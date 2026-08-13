import { Request, Response, NextFunction } from 'express';
import { PersonalizationService } from '../services/personalization.service';
import { RecommendationService } from '../services/recommendation.service';
import { YoutubeService } from '../services/youtube.service';
import { RoadmapService } from '../services/roadmap.service';
import { LearningProgress } from '../models/LearningProgress';
import { LearningResource } from '../models/LearningResource';
import { sendSuccess, sendError } from '../utils/response';
import mongoose from 'mongoose';

export class LearningController {
  /**
   * GET /api/learning-hub
   * Retrieves personalized context, recommendations, progress, and video previews.
   */
  public static getLearningHubData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const userId = req.user.sub;
      
      // 1. Get Personalization Context and Recommendations
      const context = await PersonalizationService.getPersonalizationContext(userId);
      const recommendations = await RecommendationService.generateRecommendations(context);

      // 2. Fetch Active Roadmap and Current Milestone
      const roadmap = await RoadmapService.getRoadmap(userId);
      let currentMilestone = null;
      
      if (roadmap) {
        const flatMilestones = roadmap.stages.flatMap(s => s.milestones);
        const activeIdx = flatMilestones.findIndex(
          m => !m.completed && m.status !== 'Completed & Verified' && m.status !== 'Completed — Review Recommended'
        );
        if (activeIdx !== -1) {
          currentMilestone = flatMilestones[activeIdx];
        }
      }

      // 3. Construct Recommended Skills with explicit reasons
      const recommendedSkills: Array<{ name: string; reason: string }> = [];
      const skillGaps = recommendations.skillGap.missingSkills || [];
      const expectedSkills = recommendations.skillGap.expectedSkills || [];

      if (currentMilestone && currentMilestone.skills) {
        currentMilestone.skills.forEach(skill => {
          recommendedSkills.push({
            name: skill,
            reason: `Required by your current roadmap milestone: "${currentMilestone.title}"`
          });
        });
      }

      skillGaps.forEach(skill => {
        // Prevent duplicate skill entries
        if (!recommendedSkills.some(s => s.name.toLowerCase() === skill.toLowerCase())) {
          recommendedSkills.push({
            name: skill,
            reason: 'Identified as a Career Match skill gap'
          });
        }
      });

      expectedSkills.forEach(skill => {
        if (!recommendedSkills.some(s => s.name.toLowerCase() === skill.toLowerCase())) {
          recommendedSkills.push({
            name: skill,
            reason: 'Required skill for your target career'
          });
        }
      });

      // 4. Construct Next Learning Step
      let nextLearningStep = null;
      if (currentMilestone) {
        nextLearningStep = {
          milestoneTitle: currentMilestone.title,
          milestoneDescription: currentMilestone.description,
          requiredSkills: currentMilestone.skills || [],
          learningObjectives: currentMilestone.learningObjectives || [],
          reason: `Recommended because "${currentMilestone.title}" is your active roadmap milestone.`
        };
      }

      // 5. Fetch User Learning Progress & Bookmarked Resources
      let progressDoc = await LearningProgress.findOne({ userId: new mongoose.Types.ObjectId(userId) });
      if (!progressDoc) {
        progressDoc = new LearningProgress({ userId: new mongoose.Types.ObjectId(userId) });
        await progressDoc.save();
      }

      const activeProgressRecords = progressDoc.resources.filter(r => r.status === 'in_progress');
      const completedProgressRecords = progressDoc.resources.filter(r => r.status === 'completed');
      const bookmarkedIds = progressDoc.bookmarkedResources || [];

      // Look up resource metadata from database
      const allTrackingIds = [
        ...activeProgressRecords.map(r => r.resourceId),
        ...completedProgressRecords.map(r => r.resourceId),
        ...bookmarkedIds
      ];
      
      const dbResources = await LearningResource.find({ resourceId: { $in: allTrackingIds } });
      const resourceMap = new Map(dbResources.map(r => [r.resourceId, r]));

      const continueLearning = activeProgressRecords.map(rec => {
        const meta = resourceMap.get(rec.resourceId);
        return {
          resourceId: rec.resourceId,
          status: rec.status,
          startedAt: rec.startedAt,
          lastAccessed: rec.lastAccessed,
          title: meta?.title || 'YouTube Tutorial',
          description: meta?.description || '',
          url: meta?.url || '',
          provider: meta?.provider || 'YouTube',
          type: meta?.type || 'Video',
          thumbnail: meta?.thumbnail || '',
          channel: meta?.channel || '',
        };
      });

      const completedLearning = completedProgressRecords.map(rec => {
        const meta = resourceMap.get(rec.resourceId);
        return {
          resourceId: rec.resourceId,
          status: rec.status,
          startedAt: rec.startedAt,
          lastAccessed: rec.lastAccessed,
          completedAt: rec.completedAt,
          title: meta?.title || 'YouTube Tutorial',
          description: meta?.description || '',
          url: meta?.url || '',
          provider: meta?.provider || 'YouTube',
          type: meta?.type || 'Video',
          thumbnail: meta?.thumbnail || '',
          channel: meta?.channel || '',
        };
      });

      const bookmarkedResources = bookmarkedIds.map(id => {
        const meta = resourceMap.get(id);
        const progressRec = progressDoc!.resources.find(r => r.resourceId === id);
        return {
          resourceId: id,
          title: meta?.title || 'YouTube Video',
          description: meta?.description || '',
          url: meta?.url || `https://www.youtube.com/watch?v=${id}`,
          provider: meta?.provider || 'YouTube',
          type: meta?.type || 'Video',
          thumbnail: meta?.thumbnail || '',
          channel: meta?.channel || '',
          status: progressRec ? progressRec.status : 'not_started'
        };
      });

      // 6. Secure YouTube Video recommendations preview based on milestone/career context
      let youtubeVideos: any[] = [];
      let youtubeError: string | null = null;
      const dreamCareer = context.dreamCareer && context.dreamCareer !== 'Career Explorer' ? context.dreamCareer : '';
      
      let youtubeQuery = '';
      if (currentMilestone) {
        youtubeQuery = `${dreamCareer || 'professional'} ${currentMilestone.title} tutorial`;
      } else if (dreamCareer) {
        youtubeQuery = `${dreamCareer} skills tutorial`;
      } else if (context.discipline && context.discipline !== 'General Studies') {
        youtubeQuery = `${context.discipline} fundamentals career overview`;
      } else {
        youtubeQuery = 'professional skills career guide';
      }

      const skipYoutube = req.query.skipYoutube === 'true';

      if (!skipYoutube) {
        try {
          youtubeVideos = await YoutubeService.searchVideos(youtubeQuery, 4);
        } catch (err: any) {
          console.warn('[LearningController] YouTube preview search failed:', err);
          youtubeError = classifyYoutubeError(err);
        }
      }

      sendSuccess(res, 'Learning Hub data retrieved successfully.', {
        dreamCareer: dreamCareer || null,
        hasRoadmap: !!roadmap,
        nextLearningStep,
        recommendedSkills,
        continueLearning,
        completedLearning,
        bookmarkedResources,
        youtubeVideos,
        youtubeQuery,
        youtubeError
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/learning-hub/start
   * Start tracking a resource. Verifies the resource via secure backend YouTube service.
   */
  public static startResource = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const userId = req.user.sub;
      const { resourceId } = req.body;

      if (!resourceId || typeof resourceId !== 'string') {
        sendError(res, 'Resource ID is required.', [], 400);
        return;
      }

      // Check if resource is in database. If not, fetch and save verified metadata
      let resource = await LearningResource.findOne({ resourceId });
      if (!resource) {
        const verifiedVideo = await YoutubeService.getVideoDetails(resourceId);
        if (!verifiedVideo) {
          sendError(res, 'Resource could not be verified from external source.', [], 400);
          return;
        }

        resource = new LearningResource({
          resourceId,
          title: verifiedVideo.title,
          description: verifiedVideo.description,
          url: verifiedVideo.url,
          provider: 'YouTube',
          type: 'Video',
          thumbnail: verifiedVideo.thumbnail,
          channel: verifiedVideo.channelTitle,
          publishedAt: verifiedVideo.publishedAt
        });

        await resource.save();
      }

      // Get or create progress
      let progress = await LearningProgress.findOne({ userId: new mongoose.Types.ObjectId(userId) });
      if (!progress) {
        progress = new LearningProgress({ userId: new mongoose.Types.ObjectId(userId) });
      }

      // Check if already in tracking list
      const existingIdx = progress.resources.findIndex(r => r.resourceId === resourceId);
      if (existingIdx !== -1) {
        // Just update access timestamp
        progress.resources[existingIdx].lastAccessed = new Date();
      } else {
        progress.resources.push({
          resourceId,
          status: 'in_progress',
          startedAt: new Date(),
          lastAccessed: new Date(),
          completedAt: null
        });
      }

      progress.lastStudyDate = new Date();
      await progress.save();

      sendSuccess(res, 'Resource started successfully.', {
        resourceId,
        status: 'in_progress'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/learning-hub/progress
   * Update status of resource (e.g. mark completed).
   */
  public static updateProgress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const userId = req.user.sub;
      const { resourceId, status } = req.body;

      if (!resourceId || typeof resourceId !== 'string') {
        sendError(res, 'Resource ID is required.', [], 400);
        return;
      }

      if (status !== 'completed' && status !== 'in_progress') {
        sendError(res, 'Invalid progress status.', [], 400);
        return;
      }

      const progress = await LearningProgress.findOne({ userId: new mongoose.Types.ObjectId(userId) });
      if (!progress) {
        sendError(res, 'No learning progress found.', [], 404);
        return;
      }

      const existingIdx = progress.resources.findIndex(r => r.resourceId === resourceId);
      if (existingIdx === -1) {
        sendError(res, 'Resource is not actively being tracked.', [], 404);
        return;
      }

      progress.resources[existingIdx].status = status;
      progress.resources[existingIdx].lastAccessed = new Date();
      
      if (status === 'completed') {
        progress.resources[existingIdx].completedAt = new Date();
        // Add to completedResources for backward compatibility if not present
        if (!progress.completedResources.includes(resourceId)) {
          progress.completedResources.push(resourceId);
        }
      } else {
        progress.resources[existingIdx].completedAt = null;
        // Remove from completedResources list
        progress.completedResources = progress.completedResources.filter(id => id !== resourceId);
      }

      progress.lastStudyDate = new Date();
      await progress.save();

      sendSuccess(res, 'Resource progress updated successfully.', {
        resourceId,
        status
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/learning-hub/bookmark
   * Toggles bookmark state for a resource. Verifies the resource first if bookmarking new.
   */
  public static toggleBookmark = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const userId = req.user.sub;
      const { resourceId } = req.body;

      if (!resourceId || typeof resourceId !== 'string') {
        sendError(res, 'Resource ID is required.', [], 400);
        return;
      }

      // If user is bookmarking, verify resource exists in database/external source first
      let progress = await LearningProgress.findOne({ userId: new mongoose.Types.ObjectId(userId) });
      if (!progress) {
        progress = new LearningProgress({ userId: new mongoose.Types.ObjectId(userId) });
      }

      const isCurrentlyBookmarked = progress.bookmarkedResources.includes(resourceId);
      
      if (!isCurrentlyBookmarked) {
        // Verify resource details
        let resource = await LearningResource.findOne({ resourceId });
        if (!resource) {
          const verifiedVideo = await YoutubeService.getVideoDetails(resourceId);
          if (!verifiedVideo) {
            sendError(res, 'Resource could not be verified from external source.', [], 400);
            return;
          }

          resource = new LearningResource({
            resourceId,
            title: verifiedVideo.title,
            description: verifiedVideo.description,
            url: verifiedVideo.url,
            provider: 'YouTube',
            type: 'Video',
            thumbnail: verifiedVideo.thumbnail,
            channel: verifiedVideo.channelTitle,
            publishedAt: verifiedVideo.publishedAt
          });

          await resource.save();
        }

        progress.bookmarkedResources.push(resourceId);
      } else {
        progress.bookmarkedResources = progress.bookmarkedResources.filter(id => id !== resourceId);
      }

      await progress.save();

      sendSuccess(res, 'Bookmark toggled successfully.', {
        resourceId,
        bookmarked: !isCurrentlyBookmarked
      });
    } catch (error) {
      next(error);
    }
  };
}

function classifyYoutubeError(err: any): string {
  if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
    return 'TIMEOUT';
  }
  if (err.response) {
    const status = err.response.status;
    const apiError = err.response.data?.error;
    const reason = apiError?.errors?.[0]?.reason || '';

    if (status === 400 && reason === 'keyInvalid') {
      return 'API_KEY_INVALID';
    }
    if (status === 403 && (reason === 'quotaExceeded' || reason === 'dailyLimitExceeded')) {
      return 'QUOTA_EXCEEDED';
    }
    if (status === 429) {
      return 'RATE_LIMITED';
    }
    if (status >= 500) {
      return 'SERVER_ERROR';
    }
  }
  return 'NETWORK_ERROR';
}
