import React, { useState, useEffect, useCallback } from 'react';
import type {
  IStartupRoadmap,
  IStartupTask,
  TaskStatus,
  INextStepRecommendation,
} from '../../types/startupRoadmap.types';
import { StartupRoadmapApiService } from '../../services/startupRoadmap.service';
import {
  Rocket,
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Layers,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import styles from './StartupRoadmap.module.css';

interface StartupRoadmapProps {
  onExploreIdeas: () => void;
  onOpenAssistant: (roadmapId: string) => void;
  onOpenValidation: (roadmapId: string) => void;
  onOpenPitch: (roadmapId: string) => void;
}

export const StartupRoadmap: React.FC<StartupRoadmapProps> = ({
  onExploreIdeas,
  onOpenAssistant,
  onOpenValidation,
  onOpenPitch,
}) => {
  const [roadmaps, setRoadmaps] = useState<IStartupRoadmap[]>([]);
  const [activeRoadmapId, setActiveRoadmapId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [nextSteps, setNextSteps] = useState<INextStepRecommendation[]>([]);
  const [expandedMilestones, setExpandedMilestones] = useState<Record<string, boolean>>({});

  // Add Task Modal State
  const [addingTaskForMilestone, setAddingTaskForMilestone] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskDesc, setNewTaskDesc] = useState<string>('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskMinutes, setNewTaskMinutes] = useState<number>(45);

  const activeRoadmap = roadmaps.find((r) => r._id === activeRoadmapId) || roadmaps[0] || null;

  // Load all user roadmaps
  const loadRoadmaps = useCallback(async () => {
    try {
      setLoading(true);
      const list = await StartupRoadmapApiService.getRoadmaps();
      setRoadmaps(list || []);
      if (list.length > 0 && !activeRoadmapId) {
        setActiveRoadmapId(list[0]._id);
        // Expand the first active milestone by default
        const activeM = list[0].milestones.find((m) => m.status === 'active') || list[0].milestones[0];
        if (activeM) {
          setExpandedMilestones({ [activeM.id]: true });
        }
      }
    } catch (err) {
      console.warn('Failed to load startup roadmaps:', err);
    } finally {
      setLoading(false);
    }
  }, [activeRoadmapId]);

  useEffect(() => {
    loadRoadmaps();
  }, [loadRoadmaps]);

  // Load next steps whenever active roadmap changes
  useEffect(() => {
    if (!activeRoadmap?._id) return;
    const fetchNextSteps = async () => {
      try {
        const steps = await StartupRoadmapApiService.getNextSteps(activeRoadmap._id);
        setNextSteps(steps || []);
      } catch (_e) {
        // silent fallback
      }
    };
    fetchNextSteps();
  }, [activeRoadmap?._id]);

  const toggleMilestone = (mId: string) => {
    setExpandedMilestones((prev) => ({ ...prev, [mId]: !prev[mId] }));
  };

  const handleToggleTask = async (milestoneId: string, task: IStartupTask) => {
    if (!activeRoadmap) return;
    const nextStatus: TaskStatus = task.status === 'completed' ? 'todo' : 'completed';

    // Optimistic UI update
    setRoadmaps((prev) =>
      prev.map((r) => {
        if (r._id !== activeRoadmap._id) return r;
        const updatedM = r.milestones.map((m) => {
          if (m.id !== milestoneId) return m;
          const updatedTasks = m.tasks.map((t) =>
            t.id === task.id ? { ...t, status: nextStatus } : t
          );
          const completedCount = updatedTasks.filter((t) => t.status === 'completed').length;
          const mProgress = updatedTasks.length > 0 ? Math.round((completedCount / updatedTasks.length) * 100) : 0;
          return { ...m, tasks: updatedTasks, progress: mProgress };
        });

        let totalT = 0;
        let compT = 0;
        updatedM.forEach((m) => {
          totalT += m.tasks.length;
          compT += m.tasks.filter((t) => t.status === 'completed').length;
        });
        const overall = totalT > 0 ? Math.round((compT / totalT) * 100) : 0;

        return { ...r, milestones: updatedM, overallProgress: overall };
      })
    );

    try {
      const updated = await StartupRoadmapApiService.updateTask(
        activeRoadmap._id,
        milestoneId,
        task.id,
        { status: nextStatus }
      );
      setRoadmaps((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
    } catch (err) {
      console.error('Failed to update task status:', err);
      loadRoadmaps();
    }
  };

  const handleDeleteTask = async (milestoneId: string, taskId: string) => {
    if (!activeRoadmap) return;
    try {
      const updated = await StartupRoadmapApiService.deleteTask(activeRoadmap._id, milestoneId, taskId);
      setRoadmaps((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRoadmap || !addingTaskForMilestone || !newTaskTitle.trim()) return;

    try {
      const updated = await StartupRoadmapApiService.addTask(activeRoadmap._id, addingTaskForMilestone, {
        title: newTaskTitle.trim(),
        description: newTaskDesc.trim(),
        priority: newTaskPriority,
        estimatedMinutes: newTaskMinutes,
      });

      setRoadmaps((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
      setAddingTaskForMilestone(null);
      setNewTaskTitle('');
      setNewTaskDesc('');
    } catch (err) {
      console.error('Failed to add custom task:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px', gap: '10px', color: '#9ca3af' }}>
        <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
        <span>Loading your venture roadmaps...</span>
      </div>
    );
  }

  if (roadmaps.length === 0) {
    return (
      <div
        style={{
          background: 'var(--bg-card, rgba(30, 41, 59, 0.7))',
          border: '1px solid var(--border-card, rgba(255, 255, 255, 0.08))',
          borderRadius: '16px',
          padding: '54px 24px',
          textAlign: 'center',
          backdropFilter: 'blur(12px)',
          maxWidth: '640px',
          margin: '30px auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <Rocket size={44} style={{ color: '#818cf8' }} />
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f3f4f6', margin: 0 }}>
          No Active Startup Roadmaps Yet
        </h3>
        <p style={{ fontSize: '0.9rem', color: '#9ca3af', lineHeight: 1.5, margin: 0 }}>
          Choose a business idea from the Business Ideas explorer and click <strong>Build This Startup</strong> to generate a customized venture execution roadmap.
        </p>

        <button
          onClick={onExploreIdeas}
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '10px 22px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            marginTop: '8px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>Explore Business Ideas</span>
          <ArrowRight size={15} />
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 1. Header Card with Venture Overview & Progress */}
      {activeRoadmap && (
        <div className={styles.headerCard}>
          <div className={styles.titleArea}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className={styles.badge}>{activeRoadmap.industry}</span>
              <span className={styles.badge} style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                {activeRoadmap.businessModel}
              </span>
              <span className={styles.badge} style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                Stage: {activeRoadmap.currentStage}
              </span>
            </div>

            <h2 className={styles.ventureTitle}>
              <Rocket size={24} style={{ color: '#818cf8' }} />
              {activeRoadmap.title}
            </h2>
            <div className={styles.ventureMeta}>
              <span>{activeRoadmap.description}</span>
            </div>

            {/* Quick Venture Actions */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => onOpenAssistant(activeRoadmap._id)}
                style={{
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  color: '#818cf8',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Sparkles size={13} /> AI Mentor Advice
              </button>

              <button
                onClick={() => onOpenValidation(activeRoadmap._id)}
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#34d399',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <CheckCircle2 size={13} /> Validate Idea
              </button>

              <button
                onClick={() => onOpenPitch(activeRoadmap._id)}
                style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: '#fbbf24',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Layers size={13} /> Pitch & Business Plan
              </button>
            </div>
          </div>

          <div className={styles.progressBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrendingUp size={14} style={{ color: '#10b981' }} /> Overall Progress
              </span>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981' }}>
                {activeRoadmap.overallProgress}%
              </span>
            </div>

            <div className={styles.progressBarBg}>
              <div
                className={styles.progressBarFill}
                style={{ width: `${activeRoadmap.overallProgress}%` }}
              />
            </div>

            <div style={{ fontSize: '0.74rem', color: '#9ca3af', textAlign: 'right' }}>
              {activeRoadmap.milestones.filter((m) => m.status === 'completed').length} of {activeRoadmap.milestones.length} milestones complete
            </div>
          </div>
        </div>
      )}

      {/* 2. Recommended Next Steps Box */}
      {nextSteps.length > 0 && (
        <div className={styles.nextStepsBox}>
          <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} /> Recommended Next Startup Actions
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
            {nextSteps.map((step, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f3f4f6' }}>{step.title}</span>
                  <span
                    className={`${styles.priorityBadge} ${
                      step.priority === 'high'
                        ? styles.priorityHigh
                        : step.priority === 'medium'
                        ? styles.priorityMedium
                        : styles.priorityLow
                    }`}
                  >
                    {step.priority}
                  </span>
                </div>
                <div style={{ fontSize: '0.76rem', color: '#9ca3af' }}>{step.reason}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Milestones & Interactive Task Hierarchy */}
      <div className={styles.milestonesList}>
        {activeRoadmap?.milestones.map((m, idx) => {
          const isExpanded = !!expandedMilestones[m.id];
          const isCompleted = m.status === 'completed';
          const isActive = m.status === 'active';

          return (
            <div
              key={m.id}
              className={`${styles.milestoneCard} ${isActive ? styles.milestoneCardActive : ''} ${
                isCompleted ? styles.milestoneCardCompleted : ''
              }`}
            >
              {/* Milestone Header */}
              <div className={styles.milestoneHeader} onClick={() => toggleMilestone(m.id)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: isCompleted
                        ? 'rgba(16, 185, 129, 0.2)'
                        : isActive
                        ? 'rgba(99, 102, 241, 0.2)'
                        : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${
                        isCompleted ? '#10b981' : isActive ? '#6366f1' : 'rgba(255, 255, 255, 0.1)'
                      }`,
                      color: isCompleted ? '#34d399' : isActive ? '#818cf8' : '#9ca3af',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.86rem',
                    }}
                  >
                    {isCompleted ? <CheckCircle2 size={16} /> : idx + 1}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: '#f3f4f6', margin: 0 }}>
                        {m.title}
                      </h4>
                      <span
                        className={styles.badge}
                        style={{
                          fontSize: '0.68rem',
                          background: isCompleted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                          color: isCompleted ? '#34d399' : '#818cf8',
                        }}
                      >
                        {m.stage}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '2px' }}>
                      {m.description}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.86rem', fontWeight: 700, color: isCompleted ? '#34d399' : '#f3f4f6' }}>
                      {m.progress}%
                    </span>
                    <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                      {m.tasks.filter((t) => t.status === 'completed').length}/{m.tasks.length} tasks
                    </div>
                  </div>

                  {isExpanded ? <ChevronDown size={18} color="#9ca3af" /> : <ChevronRight size={18} color="#9ca3af" />}
                </div>
              </div>

              {/* Milestone Tasks & Content */}
              {isExpanded && (
                <div className={styles.milestoneBody}>
                  <div className={styles.tasksList}>
                    {m.tasks.map((task) => {
                      const isTaskDone = task.status === 'completed';
                      return (
                        <div
                          key={task.id}
                          className={`${styles.taskItem} ${isTaskDone ? styles.taskCompleted : ''}`}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                            <button
                              type="button"
                              onClick={() => handleToggleTask(m.id, task)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0 0 0' }}
                            >
                              {isTaskDone ? (
                                <CheckCircle2 size={18} style={{ color: '#10b981' }} />
                              ) : (
                                <Circle size={18} style={{ color: '#6b7280' }} />
                              )}
                            </button>

                            <div>
                              <h5 className={styles.taskTitle}>{task.title}</h5>
                              {task.description && <p className={styles.taskDesc}>{task.description}</p>}
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {task.estimatedMinutes && (
                              <span style={{ fontSize: '0.74rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                <Clock size={11} /> {task.estimatedMinutes}m
                              </span>
                            )}

                            <span
                              className={`${styles.priorityBadge} ${
                                task.priority === 'high'
                                  ? styles.priorityHigh
                                  : task.priority === 'medium'
                                  ? styles.priorityMedium
                                  : styles.priorityLow
                              }`}
                            >
                              {task.priority}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleDeleteTask(m.id, task.id)}
                              style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: '4px' }}
                              title="Delete task"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add Task Form or Button */}
                  {addingTaskForMilestone === m.id ? (
                    <form
                      onSubmit={handleCreateTask}
                      style={{
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        borderRadius: '10px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f3f4f6' }}>
                        Add Custom Task to {m.title}
                      </div>

                      <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Task title (e.g. Conduct interview with user #3)..."
                        required
                        style={{
                          background: 'rgba(0, 0, 0, 0.4)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          color: '#f3f4f6',
                          fontSize: '0.86rem',
                          outline: 'none',
                        }}
                      />

                      <textarea
                        value={newTaskDesc}
                        onChange={(e) => setNewTaskDesc(e.target.value)}
                        placeholder="Optional description / notes..."
                        rows={2}
                        style={{
                          background: 'rgba(0, 0, 0, 0.4)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          color: '#f3f4f6',
                          fontSize: '0.84rem',
                          outline: 'none',
                        }}
                      />

                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <select
                          value={newTaskPriority}
                          onChange={(e) => setNewTaskPriority(e.target.value as any)}
                          style={{
                            background: '#0f172a',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '6px',
                            padding: '6px 10px',
                            color: '#f3f4f6',
                            fontSize: '0.8rem',
                          }}
                        >
                          <option value="low">Priority: Low</option>
                          <option value="medium">Priority: Medium</option>
                          <option value="high">Priority: High</option>
                        </select>

                        <input
                          type="number"
                          value={newTaskMinutes}
                          onChange={(e) => setNewTaskMinutes(parseInt(e.target.value, 10) || 45)}
                          min={5}
                          max={1000}
                          style={{
                            width: '100px',
                            background: '#0f172a',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '6px',
                            padding: '6px 10px',
                            color: '#f3f4f6',
                            fontSize: '0.8rem',
                          }}
                        />
                        <span style={{ fontSize: '0.76rem', color: '#9ca3af' }}>minutes</span>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          onClick={() => setAddingTaskForMilestone(null)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#9ca3af',
                            borderRadius: '6px',
                            padding: '6px 14px',
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          style={{
                            background: '#6366f1',
                            border: 'none',
                            color: '#ffffff',
                            borderRadius: '6px',
                            padding: '6px 14px',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Save Task
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      type="button"
                      className={styles.addTaskBtn}
                      onClick={() => {
                        setAddingTaskForMilestone(m.id);
                        setNewTaskTitle('');
                        setNewTaskDesc('');
                      }}
                    >
                      <Plus size={14} /> Add Custom Task to Milestone
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
