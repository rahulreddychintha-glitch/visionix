import mongoose from 'mongoose';
import {
  StartupRoadmap,
  IStartupRoadmap,
  IStartupRoadmapDocument,
  IStartupMilestone,
  IStartupTask,
} from '../models/StartupRoadmap';
import { BusinessIdea } from '../models/BusinessIdea';
import { PersonalizationService } from './personalization.service';

export interface INextStepRecommendation {
  id: string;
  title: string;
  reason: string;
  priority: 'low' | 'medium' | 'high';
  estimatedMinutes: number;
  milestoneTitle: string;
  milestoneId: string;
}

export class StartupRoadmapService {
  /**
   * Recalculates milestone progress and overall roadmap progress based on task completion.
   */
  private static recalculateProgress(milestones: IStartupMilestone[]): {
    milestones: IStartupMilestone[];
    overallProgress: number;
    currentStage: string;
  } {
    let totalTasks = 0;
    let completedTasks = 0;
    let currentActiveStage = milestones[0]?.stage || 'Problem Definition';

    const updatedMilestones = milestones.map((m, mIdx) => {
      const mTasks = m.tasks || [];
      const mCompleted = mTasks.filter((t) => t.status === 'completed').length;
      totalTasks += mTasks.length;
      completedTasks += mCompleted;

      const mProgress = mTasks.length > 0 ? Math.round((mCompleted / mTasks.length) * 100) : 0;
      let mStatus = m.status;

      if (mProgress === 100 && mTasks.length > 0) {
        mStatus = 'completed';
      } else if (mProgress > 0 || mIdx === 0) {
        mStatus = 'active';
        currentActiveStage = m.stage;
      }

      return {
        ...m,
        progress: mProgress,
        status: mStatus,
      };
    });

    const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      milestones: updatedMilestones,
      overallProgress,
      currentStage: currentActiveStage,
    };
  }

  /**
   * Generates a structured, actionable startup roadmap from a curated Business Idea.
   */
  public static async generateRoadmapFromBusinessIdea(
    userId: string,
    ideaId: string
  ): Promise<IStartupRoadmapDocument> {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(ideaId)) {
      throw new Error('Invalid User ID or Business Idea ID format.');
    }

    const idea = await BusinessIdea.findOne({ _id: ideaId, isActive: true });
    if (!idea) {
      throw new Error('Business idea not found.');
    }

    // Read personalization context (Phase 12 verified skills strictly READ-ONLY)
    const pContext = await PersonalizationService.getPersonalizationContext(userId).catch(() => null);
    const verifiedSkills = (pContext?.skills?.verifiedSkills || []).map((vs: any) =>
      typeof vs === 'string' ? vs : vs.name
    );

    // Build standard milestone architecture adapted to the business model and skills
    const baseMilestones: IStartupMilestone[] = [
      {
        id: `ms-1-${Date.now()}`,
        title: 'Problem Discovery & Customer Validation',
        stage: 'Validation',
        order: 1,
        status: 'active',
        progress: 0,
        estimatedDays: 14,
        description: `Conduct structured customer interviews to validate that ${idea.targetAudience.join(', ') || 'target users'} actively suffer from "${idea.problem}".`,
        notes: `Target initial validation: 10 customer interviews with ${idea.targetAudience[0] || 'core users'}.`,
        tasks: [
          {
            id: `task-1-1-${Date.now()}`,
            title: `Define 3 specific customer personas within ${idea.targetAudience[0] || 'target market'}`,
            description: 'Document primary workflows, frustrations, and daily pain points.',
            status: 'todo',
            priority: 'high',
            estimatedMinutes: 60,
            order: 1,
          },
          {
            id: `task-1-2-${Date.now()}`,
            title: 'Draft 5 non-leading customer interview questions',
            description: 'Apply Mom Test principles to avoid biased feedback and validate real past behaviors.',
            status: 'todo',
            priority: 'high',
            estimatedMinutes: 45,
            order: 2,
          },
          {
            id: `task-1-3-${Date.now()}`,
            title: 'Conduct initial 5 customer discovery interviews',
            description: 'Record notes, recurring pain points, and current workaround tools.',
            status: 'todo',
            priority: 'high',
            estimatedMinutes: 150,
            order: 3,
          },
          {
            id: `task-1-4-${Date.now()}`,
            title: 'Synthesize interview findings and refine solution hypothesis',
            description: `Verify if proposed solution "${idea.solution.substring(0, 120)}..." aligns with discovered needs.`,
            status: 'todo',
            priority: 'medium',
            estimatedMinutes: 60,
            order: 4,
          },
        ],
      },
      {
        id: `ms-2-${Date.now()}`,
        title: 'Solution Specification & MVP Architecture',
        stage: 'Planning',
        order: 2,
        status: 'upcoming',
        progress: 0,
        estimatedDays: 10,
        description: `Define the core feature set for the MVP leveraging ${idea.requiredSkills.slice(0, 4).join(', ') || 'key technologies'}.`,
        tasks: [
          {
            id: `task-2-1-${Date.now()}`,
            title: 'List the single core value workflow for the MVP',
            description: 'Strip away non-essential features and focus 100% on solving the primary problem.',
            status: 'todo',
            priority: 'high',
            estimatedMinutes: 45,
            order: 1,
          },
          {
            id: `task-2-2-${Date.now()}`,
            title: `Design high-level tech stack leveraging ${idea.requiredSkills[0] || 'modern web framework'}`,
            description: verifiedSkills.length > 0
              ? `Leverage verified strengths in ${verifiedSkills.slice(0, 3).join(', ')}.`
              : 'Choose reliable, rapid prototyping tools and databases.',
            status: 'todo',
            priority: 'medium',
            estimatedMinutes: 60,
            order: 2,
          },
          {
            id: `task-2-3-${Date.now()}`,
            title: 'Create wireframes and user interaction flow',
            description: 'Map out the 3 screens needed to deliver the core solution.',
            status: 'todo',
            priority: 'medium',
            estimatedMinutes: 90,
            order: 3,
          },
        ],
      },
      {
        id: `ms-3-${Date.now()}`,
        title: 'MVP Prototype Build & Internal Testing',
        stage: 'Development',
        order: 3,
        status: 'upcoming',
        progress: 0,
        estimatedDays: 21,
        description: 'Build a working proof-of-concept MVP and test with 3 friendly testers.',
        tasks: [
          {
            id: `task-3-1-${Date.now()}`,
            title: 'Set up project repository and foundational architecture',
            description: 'Initialize backend, database schema, and frontend UI scaffolding.',
            status: 'todo',
            priority: 'high',
            estimatedMinutes: 90,
            order: 1,
          },
          {
            id: `task-3-2-${Date.now()}`,
            title: 'Implement core functionality & user onboarding',
            description: 'Build the primary engine that delivers the value proposition.',
            status: 'todo',
            priority: 'high',
            estimatedMinutes: 240,
            order: 2,
          },
          {
            id: `task-3-3-${Date.now()}`,
            title: 'Conduct end-to-end user testing & fix critical blockers',
            description: 'Observe 3 users performing the primary task without guidance.',
            status: 'todo',
            priority: 'medium',
            estimatedMinutes: 120,
            order: 3,
          },
        ],
      },
      {
        id: `ms-4-${Date.now()}`,
        title: 'Business Model & Go-To-Market Strategy',
        stage: 'Go-To-Market',
        order: 4,
        status: 'upcoming',
        progress: 0,
        estimatedDays: 14,
        description: `Structure the ${idea.businessModel} revenue model and first 100 customer acquisition channels.`,
        tasks: [
          {
            id: `task-4-1-${Date.now()}`,
            title: `Define pricing tiers for ${idea.businessModel} model`,
            description: 'Model basic pricing tiers, free trial/freemium limits, and unit economics.',
            status: 'todo',
            priority: 'high',
            estimatedMinutes: 60,
            order: 1,
          },
          {
            id: `task-4-2-${Date.now()}`,
            title: 'Set up landing page with early access waitlist',
            description: 'Showcase value proposition, key benefits, and email capture form.',
            status: 'todo',
            priority: 'high',
            estimatedMinutes: 120,
            order: 2,
          },
          {
            id: `task-4-3-${Date.now()}`,
            title: 'Identify top 3 distribution channels for launch',
            description: 'Explore niche communities, direct outreach, content marketing, and campus networks.',
            status: 'todo',
            priority: 'medium',
            estimatedMinutes: 60,
            order: 3,
          },
        ],
      },
      {
        id: `ms-5-${Date.now()}`,
        title: 'Pitch Preparation & Early Traction',
        stage: 'Launch & Growth',
        order: 5,
        status: 'upcoming',
        progress: 0,
        estimatedDays: 14,
        description: 'Prepare a 10-slide pitch deck, apply for student grants, and launch public beta.',
        tasks: [
          {
            id: `task-5-1-${Date.now()}`,
            title: 'Generate standard 10-slide pitch deck draft',
            description: 'Synthesize problem, solution, market size, business model, and roadmap.',
            status: 'todo',
            priority: 'medium',
            estimatedMinutes: 90,
            order: 1,
          },
          {
            id: `task-5-2-${Date.now()}`,
            title: 'Explore and bookmark 2 relevant grants or incubator deadlines',
            description: 'Reference Visionix Opportunities hub for student founder grants.',
            status: 'todo',
            priority: 'medium',
            estimatedMinutes: 45,
            order: 2,
          },
        ],
      },
    ];

    const recalculated = this.recalculateProgress(baseMilestones);

    const roadmap = await StartupRoadmap.create({
      userId: new mongoose.Types.ObjectId(userId),
      businessIdeaId: new mongoose.Types.ObjectId(ideaId),
      title: idea.title,
      description: idea.shortDescription,
      founderRole: 'Founder / Product Lead',
      industry: idea.industry,
      businessModel: idea.businessModel,
      currentStage: recalculated.currentStage,
      overallProgress: recalculated.overallProgress,
      status: 'active',
      milestones: recalculated.milestones,
    });

    return roadmap;
  }

  /**
   * Retrieves all roadmaps owned by the user.
   */
  public static async getRoadmaps(userId: string): Promise<IStartupRoadmapDocument[]> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid User ID format.');
    }
    return StartupRoadmap.find({ userId }).sort({ updatedAt: -1 });
  }

  /**
   * Retrieves a single roadmap by ID ensuring user ownership.
   */
  public static async getRoadmapById(
    userId: string,
    roadmapId: string
  ): Promise<IStartupRoadmapDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(roadmapId)) {
      return null;
    }
    return StartupRoadmap.findOne({ _id: roadmapId, userId });
  }

  /**
   * Updates basic details of a roadmap.
   */
  public static async updateRoadmap(
    userId: string,
    roadmapId: string,
    data: Partial<IStartupRoadmap>
  ): Promise<IStartupRoadmapDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(roadmapId)) {
      throw new Error('Invalid ID format.');
    }

    const updatePayload = { ...data };
    delete updatePayload.userId;
    delete (updatePayload as any)._id;

    const roadmap = await StartupRoadmap.findOneAndUpdate(
      { _id: roadmapId, userId },
      { $set: updatePayload },
      { new: true }
    );

    return roadmap;
  }

  /**
   * Deletes a roadmap owned by user.
   */
  public static async deleteRoadmap(userId: string, roadmapId: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(roadmapId)) {
      throw new Error('Invalid ID format.');
    }

    const res = await StartupRoadmap.deleteOne({ _id: roadmapId, userId });
    return (res.deletedCount || 0) > 0;
  }

  /**
   * Adds a new task to a specific milestone.
   */
  public static async addTask(
    userId: string,
    roadmapId: string,
    milestoneId: string,
    taskData: Partial<IStartupTask>
  ): Promise<IStartupRoadmapDocument> {
    const roadmap = await this.getRoadmapById(userId, roadmapId);
    if (!roadmap) throw new Error('Roadmap not found or unauthorized.');

    const milestoneIndex = roadmap.milestones.findIndex((m) => m.id === milestoneId);
    if (milestoneIndex === -1) throw new Error('Milestone not found.');

    const newTask: IStartupTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: taskData.title || 'New Startup Task',
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      estimatedMinutes: taskData.estimatedMinutes || 45,
      order: roadmap.milestones[milestoneIndex].tasks.length + 1,
    };

    roadmap.milestones[milestoneIndex].tasks.push(newTask);
    const recalculated = this.recalculateProgress(roadmap.milestones);

    roadmap.milestones = recalculated.milestones;
    roadmap.overallProgress = recalculated.overallProgress;
    roadmap.currentStage = recalculated.currentStage;
    await roadmap.save();

    return roadmap;
  }

  /**
   * Updates or toggles an existing task.
   */
  public static async updateTask(
    userId: string,
    roadmapId: string,
    milestoneId: string,
    taskId: string,
    taskData: Partial<IStartupTask>
  ): Promise<IStartupRoadmapDocument> {
    const roadmap = await this.getRoadmapById(userId, roadmapId);
    if (!roadmap) throw new Error('Roadmap not found or unauthorized.');

    const milestoneIndex = roadmap.milestones.findIndex((m) => m.id === milestoneId);
    if (milestoneIndex === -1) throw new Error('Milestone not found.');

    const taskIndex = roadmap.milestones[milestoneIndex].tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) throw new Error('Task not found.');

    const currentTask = roadmap.milestones[milestoneIndex].tasks[taskIndex];
    const newStatus = taskData.status || currentTask.status;

    roadmap.milestones[milestoneIndex].tasks[taskIndex] = {
      ...currentTask,
      ...taskData,
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date() : null,
    };

    const recalculated = this.recalculateProgress(roadmap.milestones);
    roadmap.milestones = recalculated.milestones;
    roadmap.overallProgress = recalculated.overallProgress;
    roadmap.currentStage = recalculated.currentStage;
    await roadmap.save();

    return roadmap;
  }

  /**
   * Deletes a task from a milestone.
   */
  public static async deleteTask(
    userId: string,
    roadmapId: string,
    milestoneId: string,
    taskId: string
  ): Promise<IStartupRoadmapDocument> {
    const roadmap = await this.getRoadmapById(userId, roadmapId);
    if (!roadmap) throw new Error('Roadmap not found or unauthorized.');

    const milestoneIndex = roadmap.milestones.findIndex((m) => m.id === milestoneId);
    if (milestoneIndex === -1) throw new Error('Milestone not found.');

    roadmap.milestones[milestoneIndex].tasks = roadmap.milestones[milestoneIndex].tasks.filter(
      (t) => t.id !== taskId
    );

    const recalculated = this.recalculateProgress(roadmap.milestones);
    roadmap.milestones = recalculated.milestones;
    roadmap.overallProgress = recalculated.overallProgress;
    roadmap.currentStage = recalculated.currentStage;
    await roadmap.save();

    return roadmap;
  }

  /**
   * Returns prioritized next actions based on the current milestone and uncompleted tasks.
   */
  public static async getRecommendedNextSteps(
    userId: string,
    roadmapId: string
  ): Promise<INextStepRecommendation[]> {
    const roadmap = await this.getRoadmapById(userId, roadmapId);
    if (!roadmap) return [];

    const recommendations: INextStepRecommendation[] = [];

    // Find first active or uncompleted milestone
    const activeMilestones = roadmap.milestones.filter((m) => m.status !== 'completed');

    for (const m of activeMilestones) {
      const pendingTasks = m.tasks.filter((t) => t.status !== 'completed');
      for (const t of pendingTasks) {
        recommendations.push({
          id: t.id,
          title: t.title,
          reason: `Part of ${m.title} (${m.stage} stage)`,
          priority: t.priority,
          estimatedMinutes: t.estimatedMinutes || 45,
          milestoneTitle: m.title,
          milestoneId: m.id,
        });
        if (recommendations.length >= 4) break;
      }
      if (recommendations.length >= 4) break;
    }

    return recommendations;
  }
}
