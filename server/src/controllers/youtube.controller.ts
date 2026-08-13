import { Request, Response, NextFunction } from 'express';
import { YoutubeService } from '../services/youtube.service';
import { PersonalizationService } from '../services/personalization.service';
import { RoadmapService } from '../services/roadmap.service';
import { CAREERS_DATA } from '../constants/careers.constants';
import { sendSuccess, sendError } from '../utils/response';
import config from '../config/env';

export class YoutubeController {
  /**
   * GET /api/youtube/search
   * Search career development and skill tutorials.
   */
  public static search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        sendError(res, 'Not authenticated.', [], 401);
        return;
      }

      const userId = req.user.sub;
      const { careerId, category, skill, q } = req.query;

      let queryStr = '';

      if (q && typeof q === 'string' && q.trim().length > 0) {
        queryStr = q;
      } else if (skill && typeof skill === 'string' && skill.trim().length > 0) {
        queryStr = `${skill} tutorial course`;
      } else {
        // Fetch personalization context to build a rich contextual query
        const context = await PersonalizationService.getPersonalizationContext(userId);
        
        // Find career details if possible
        const targetCareerId = typeof careerId === 'string' ? careerId : undefined;
        let careerTitle = context.dreamCareer || '';
        
        if (targetCareerId) {
          const matched = CAREERS_DATA.find(c => c.id === targetCareerId);
          if (matched) {
            careerTitle = matched.title;
          }
        }

        const isGenericCareer = !careerTitle || careerTitle === 'Career Explorer' || careerTitle === 'Career Professional';
        const cleanCareerTitle = isGenericCareer ? '' : careerTitle;

        const categoryStr = typeof category === 'string' ? category : '';

        switch (categoryStr) {
          case 'Career Fundamentals':
            queryStr = cleanCareerTitle 
              ? `${cleanCareerTitle} career overview fundamentals` 
              : 'professional career overview fundamentals';
            break;
          
          case 'Required Skills':
            // Try to query the career's recommended skills
            const careerObj = cleanCareerTitle ? CAREERS_DATA.find(c => c.title === cleanCareerTitle) : null;
            const firstSkill = careerObj && careerObj.skills.length > 0 ? careerObj.skills[0] : '';
            queryStr = firstSkill 
              ? `${firstSkill} core skills training` 
              : (cleanCareerTitle ? `${cleanCareerTitle} required skills overview` : 'professional core skills training');
            break;

          case 'Current Roadmap Milestone':
            // Fetch roadmap to find active milestone title
            const roadmap = await RoadmapService.getRoadmap(userId, targetCareerId);
            let activeMilestone = '';
            if (roadmap) {
              for (const stage of roadmap.stages) {
                const found = stage.milestones.find(m => m.status === 'In Progress' || m.status === 'Upcoming');
                if (found) {
                  activeMilestone = found.title;
                  break;
                }
              }
            }
            queryStr = activeMilestone 
              ? `${cleanCareerTitle ? cleanCareerTitle + ' ' : ''}${activeMilestone} tutorial` 
              : (cleanCareerTitle ? `${cleanCareerTitle} roadmap milestones` : 'professional career roadmap milestones');
            break;

          case 'Skill Gaps':
            // Compute skill gap using CAREERS_DATA vs user skills
            const targetCareerObj = cleanCareerTitle ? CAREERS_DATA.find(c => c.title === cleanCareerTitle) : null;
            let gapSkill = '';
            if (targetCareerObj) {
              const userSkills = new Set([
                ...(context.skills?.technicalSkills || []),
                ...(context.skills?.softSkills || [])
              ].map(s => s.toLowerCase()));

              const gaps = targetCareerObj.skills.filter(s => !userSkills.has(s.toLowerCase()));
              if (gaps.length > 0) {
                gapSkill = gaps[0];
              }
            }
            queryStr = gapSkill 
              ? `${gapSkill} tutorial for beginners` 
              : (cleanCareerTitle ? `${cleanCareerTitle} skills gaps training` : 'professional skills gaps training');
            break;

          case 'Interview Preparation':
            queryStr = `${cleanCareerTitle || 'professional job'} interview preparation questions`;
            break;

          case 'Certifications':
            queryStr = `${cleanCareerTitle || 'professional'} certifications exams guide`;
            break;

          case 'Projects / Practical Learning':
            queryStr = `${cleanCareerTitle || 'professional'} hands-on practice projects`;
            break;

          default:
            // Fallback: search general career skills
            queryStr = cleanCareerTitle 
              ? `${cleanCareerTitle} skills training course` 
              : 'professional career development skills';
            break;
        }
      }

      const apiKey = config.YOUTUBE_API_KEY;
      if (!apiKey || apiKey.trim().length === 0) {
        sendSuccess(res, 'YouTube API key is missing.', {
          query: queryStr,
          videos: [],
          configMissing: true,
          apiUnavailable: false,
          errorType: 'CONFIGURATION_MISSING'
        });
        return;
      }

      const maxResults = req.query.maxResults ? parseInt(req.query.maxResults as string, 10) : 4;
      let videos: any[] = [];
      let apiUnavailable = false;
      let errorType: string | null = null;

      try {
        videos = await YoutubeService.searchVideos(queryStr, maxResults);
      } catch (err: any) {
        apiUnavailable = true;
        errorType = classifyYoutubeError(err);
      }

      sendSuccess(res, 'YouTube search results retrieved successfully.', {
        query: queryStr,
        videos,
        configMissing: false,
        apiUnavailable,
        errorType
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
