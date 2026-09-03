import { Request, Response, NextFunction } from 'express';
import { LearningHubService, ILearningHubFilterParams } from '../services/learningHub.service';
import { YoutubeService } from '../services/youtube.service';
import { LearningProgress } from '../models/LearningProgress';
import { LearningResource } from '../models/LearningResource';
import { sendSuccess, sendError } from '../utils/response';
import mongoose from 'mongoose';

export class LearningController {
  /**
   * GET /api/learning-hub
   * Retrieves personalized Learning Hub 2.0 context, prioritized resources, and complete catalog.
   */
  public static getLearningHubData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const userId = req.user.sub;
      const filters: ILearningHubFilterParams = {
        search: req.query.search as string | undefined,
        career: req.query.career as string | undefined,
        skill: req.query.skill as string | undefined,
        educationLevel: req.query.educationLevel as string | undefined,
        resourceType: req.query.resourceType as string | undefined,
        difficulty: req.query.difficulty as string | undefined,
        topicCategory: req.query.topicCategory as string | undefined,
        provider: req.query.provider as string | undefined,
      };

      const learningHubData = await LearningHubService.getPersonalizedLearningHubData(userId, filters);

      sendSuccess(res, 'Learning Hub 2.0 data retrieved successfully.', learningHubData);
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/learning-hub/start
   * Initiate progress tracking for a verified resource.
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
        if (verifiedVideo) {
          resource = new LearningResource({
            resourceId,
            title: verifiedVideo.title,
            description: verifiedVideo.description,
            url: verifiedVideo.url,
            provider: 'YouTube',
            type: 'Video Masterclass',
            thumbnail: verifiedVideo.thumbnail,
            channel: verifiedVideo.channelTitle,
            publishedAt: verifiedVideo.publishedAt,
          });
          await resource.save();
        }
      }

      // Get or create progress
      let progress = await LearningProgress.findOne({ userId: new mongoose.Types.ObjectId(userId) });
      if (!progress) {
        progress = new LearningProgress({ userId: new mongoose.Types.ObjectId(userId) });
      }

      // Check if already in tracking list
      const existingIdx = progress.resources.findIndex((r) => r.resourceId === resourceId);
      if (existingIdx !== -1) {
        progress.resources[existingIdx].lastAccessed = new Date();
      } else {
        progress.resources.push({
          resourceId,
          status: 'in_progress',
          startedAt: new Date(),
          lastAccessed: new Date(),
          completedAt: null,
        });
      }

      progress.lastStudyDate = new Date();
      progress.totalStudyMinutes = (progress.totalStudyMinutes || 0) + 15;
      await progress.save();

      sendSuccess(res, 'Resource started successfully.', {
        resourceId,
        status: 'in_progress',
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

      let progress = await LearningProgress.findOne({ userId: new mongoose.Types.ObjectId(userId) });
      if (!progress) {
        progress = new LearningProgress({ userId: new mongoose.Types.ObjectId(userId) });
      }

      let existingIdx = progress.resources.findIndex((r) => r.resourceId === resourceId);
      if (existingIdx === -1) {
        progress.resources.push({
          resourceId,
          status: status,
          startedAt: new Date(),
          lastAccessed: new Date(),
          completedAt: status === 'completed' ? new Date() : null,
        });
        existingIdx = progress.resources.length - 1;
      } else {
        progress.resources[existingIdx].status = status;
        progress.resources[existingIdx].lastAccessed = new Date();
        if (status === 'completed') {
          progress.resources[existingIdx].completedAt = new Date();
        } else {
          progress.resources[existingIdx].completedAt = null;
        }
      }

      if (status === 'completed') {
        if (!progress.completedResources.includes(resourceId)) {
          progress.completedResources.push(resourceId);
        }
        progress.totalStudyMinutes = (progress.totalStudyMinutes || 0) + 30;
      } else {
        progress.completedResources = progress.completedResources.filter((id) => id !== resourceId);
      }

      progress.lastStudyDate = new Date();
      await progress.save();

      sendSuccess(res, 'Resource progress updated successfully.', {
        resourceId,
        status,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/learning-hub/bookmark
   * Toggles bookmark state for a resource.
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

      let progress = await LearningProgress.findOne({ userId: new mongoose.Types.ObjectId(userId) });
      if (!progress) {
        progress = new LearningProgress({ userId: new mongoose.Types.ObjectId(userId) });
      }

      const isCurrentlyBookmarked = progress.bookmarkedResources.includes(resourceId);

      if (!isCurrentlyBookmarked) {
        progress.bookmarkedResources.push(resourceId);
      } else {
        progress.bookmarkedResources = progress.bookmarkedResources.filter((id) => id !== resourceId);
      }

      await progress.save();

      sendSuccess(res, 'Bookmark toggled successfully.', {
        resourceId,
        bookmarked: !isCurrentlyBookmarked,
      });
    } catch (error) {
      next(error);
    }
  };
}
