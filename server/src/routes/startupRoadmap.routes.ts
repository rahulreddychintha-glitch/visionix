import { Router } from 'express';
import { StartupRoadmapController } from '../controllers/startupRoadmap.controller';
import { authenticate } from '../middleware/auth';
import {
  updateRoadmapValidator,
  roadmapIdParamValidator,
  taskValidator,
  updateTaskValidator,
  taskIdParamValidator,
} from '../validators/startupRoadmap.validator';

const router = Router();

// All roadmap routes require authentication
router.use(authenticate);

/**
 * POST /api/business/roadmaps/generate
 * Generates a startup roadmap from a business idea.
 */
router.post('/generate', StartupRoadmapController.generateRoadmap);

/**
 * GET /api/business/roadmaps
 * List all user roadmaps.
 */
router.get('/', StartupRoadmapController.getRoadmaps);

/**
 * GET /api/business/roadmaps/:id
 * Retrieve a specific roadmap.
 */
router.get('/:id', roadmapIdParamValidator, StartupRoadmapController.getRoadmapById);

/**
 * PATCH /api/business/roadmaps/:id
 * Update roadmap details.
 */
router.patch('/:id', updateRoadmapValidator, StartupRoadmapController.updateRoadmap);

/**
 * DELETE /api/business/roadmaps/:id
 * Delete a roadmap.
 */
router.delete('/:id', roadmapIdParamValidator, StartupRoadmapController.deleteRoadmap);

/**
 * GET /api/business/roadmaps/:id/next-steps
 * Get recommended next actions.
 */
router.get('/:id/next-steps', roadmapIdParamValidator, StartupRoadmapController.getNextSteps);

/**
 * POST /api/business/roadmaps/:id/milestones/:milestoneId/tasks
 * Add a task to a milestone.
 */
router.post('/:id/milestones/:milestoneId/tasks', taskValidator, StartupRoadmapController.addTask);

/**
 * PATCH /api/business/roadmaps/:id/milestones/:milestoneId/tasks/:taskId
 * Update or toggle a task.
 */
router.patch('/:id/milestones/:milestoneId/tasks/:taskId', updateTaskValidator, StartupRoadmapController.updateTask);

/**
 * DELETE /api/business/roadmaps/:id/milestones/:milestoneId/tasks/:taskId
 * Delete a task.
 */
router.delete('/:id/milestones/:milestoneId/tasks/:taskId', taskIdParamValidator, StartupRoadmapController.deleteTask);

export default router;
