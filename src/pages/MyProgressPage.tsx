import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { RoadmapService } from '../services/roadmap.service';
import type { CareerRoadmap, Milestone } from '../services/roadmap.service';
import { PersonalizationApiService } from '../services/personalization.service';
import { 
  Target, 
  CheckCircle, 
  Circle, 
  BookOpen, 
  Clock,
  Sparkles,
  GitFork,
  ArrowRight,
  AlertCircle,
  Award
} from 'lucide-react';
import styles from './MyProgressPage.module.css';

export const MyProgressPage: React.FC = () => {
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Computed properties
  const [completedMilestones, setCompletedMilestones] = useState<Milestone[]>([]);
  const [flatMilestones, setFlatMilestones] = useState<Milestone[]>([]);
  const [currentMilestone, setCurrentMilestone] = useState<Milestone | null>(null);
  const [upcomingMilestones, setUpcomingMilestones] = useState<Milestone[]>([]);
  const [completedSkills, setCompletedSkills] = useState<string[]>([]);
  const [remainingSkills, setRemainingSkills] = useState<string[]>([]);
  const [goals, setGoals] = useState<Milestone[]>([]);
  const [recentActivity, setRecentActivity] = useState<Array<{ text: string; time: string }>>([]);

  const fetchProgressData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const rm = await RoadmapService.getRoadmap();
      
      if (rm) {
        setRoadmap(rm);
        
        // Flatten all milestones
        const flatM = rm.stages.flatMap(s => s.milestones);
        setFlatMilestones(flatM);
        const flatMilestones = flatM;
        
        // 1. Completed Milestones (includes both verified and review recommended for overall track metrics)
        const completed = flatMilestones.filter(m => m.completed || m.status === 'Completed & Verified' || m.status === 'Completed — Review Recommended');
        setCompletedMilestones(completed);
        
        // 3. Current Milestone (First uncompleted milestone)
        const currentIdx = flatMilestones.findIndex(m => !m.completed && m.status !== 'Completed & Verified' && m.status !== 'Completed — Review Recommended');
        let current: Milestone | null = null;
        if (currentIdx !== -1) {
          current = flatMilestones[currentIdx];
          setCurrentMilestone(current);
        } else {
          setCurrentMilestone(null);
        }
        
        // 4. Upcoming Milestones (Uncompleted milestones after current)
        const upcoming = currentIdx !== -1 ? flatMilestones.slice(currentIdx + 1) : [];
        setUpcomingMilestones(upcoming);
        
        // Fetch user profile verified skills
        let profileVerifiedSkills: string[] = [];
        try {
          const pData = await PersonalizationApiService.getPersonalizationData();
          if (pData?.context?.skills?.verifiedSkills) {
            profileVerifiedSkills = pData.context.skills.verifiedSkills.map((vs: any) => typeof vs === 'string' ? vs : vs.name);
          }
        } catch (pErr) {
          console.warn('Could not load profile verified skills in MyProgressPage:', pErr);
        }

        // 5. Verified Skills extraction (Strictly from authoritative UserProfile.skills.verifiedSkills)
        const compSkills = Array.from(new Set(profileVerifiedSkills));
        setCompletedSkills(compSkills);

        const compSkillsLower = new Set(compSkills.map(s => s.toLowerCase()));
        const remSkillsSet = new Set<string>();
        // Target roadmap skills not yet verified
        flatMilestones.forEach(m => {
          m.skills.forEach(s => {
            if (!compSkillsLower.has(s.toLowerCase())) {
              remSkillsSet.add(s);
            }
          });
        });
        setRemainingSkills(Array.from(remSkillsSet));

        // 6. Goals (Next 3 uncompleted milestones)
        const uncompleted = flatMilestones.filter(m => !m.completed);
        setGoals(uncompleted.slice(0, 3));

        // 6. Recent Activity list (based on saved status)
        const activityList: Array<{ text: string; time: string }> = [];
        if (completed.length > 0) {
          // List most recently completed milestones
          completed.slice(-3).reverse().forEach(m => {
            activityList.push({
              text: `Completed Milestone: ${m.title}`,
              time: 'Completed'
            });
          });
        }
        
        // Add roadmap creation event
        activityList.push({
          text: `Initialized Personalised Roadmap for ${rm.careerTitle}`,
          time: new Date(rm.createdAt).toLocaleDateString()
        });

        setRecentActivity(activityList);

      } else {
        setRoadmap(null);
      }
    } catch (err: any) {
      console.error('Error fetching progress data:', err);
      setError('Could not retrieve progress data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgressData();
  }, [fetchProgressData]);

  // Circle progress math
  const progressPercent = roadmap?.progress || 0;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <DashboardLayout>
      <div className="ambient-noise" />
      <div className="glow-accent" style={{ top: '15%', left: '15%', opacity: 0.12 }} />
      <div className="glow-accent-secondary" style={{ bottom: '15%', right: '15%', opacity: 0.12 }} />

      <div className={styles.container}>
        
        {/* Title and header info */}
        <div className={styles.header}>
          <h1 className="text-heading">My Progress</h1>
          <p className={styles.subtitle}>Track your overall development checkpoints, acquired skills, and milestones</p>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '16px' }}>
            <div className="loadingSpinner" style={{ width: '32px', height: '32px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Loading progress statistics...</p>
          </div>
        )}

        {error && (
          <div className={styles.emptyState}>
            <AlertCircle size={48} style={{ color: '#ef4444' }} />
            <h2 className={styles.emptyTitle}>Error</h2>
            <p className={styles.emptyText}>{error}</p>
            <button className={styles.button} onClick={() => fetchProgressData()}>
              Try Again
            </button>
          </div>
        )}

        {/* Empty State when no career selected */}
        {!loading && !roadmap && !error && (
          <div className={styles.emptyState}>
            <Target size={48} style={{ color: 'var(--color-primary)' }} />
            <h2 className={styles.emptyTitle}>No Active Progress</h2>
            <p className={styles.emptyText}>
              You don't have any career progress records yet because you haven't generated a roadmap. Explore careers and match them to get started.
            </p>
            <button className={styles.button} onClick={() => navigate('/explore')}>
              Explore Careers
            </button>
          </div>
        )}

        {/* Render Progress Stats Dashboard */}
        {!loading && roadmap && (
          <div className={styles.dashboardGrid}>
            
            {/* Left side: Main progress status and list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Overview circular progress card */}
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>
                  <Target size={18} style={{ color: 'var(--color-primary)' }} />
                  <span>Goal: {roadmap.careerTitle}</span>
                </h3>
                
                <div className={styles.overviewGrid}>
                  {/* SVG circular progress indicator */}
                  <div className={styles.circleProgressWrapper}>
                    <svg className={styles.circleSvg}>
                      <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="var(--color-primary)" />
                          <stop offset="100%" stopColor="var(--color-secondary)" />
                        </linearGradient>
                      </defs>
                      <circle className={styles.circleBg} cx="70" cy="70" r={radius} />
                      <circle 
                        className={styles.circleValue} 
                        cx="70" 
                        cy="70" 
                        r={radius} 
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                      />
                    </svg>
                    <div className={styles.percentageText}>
                      <span>{progressPercent}%</span>
                      <span className={styles.percentageLabel}>Done</span>
                    </div>
                  </div>

                  {/* Summary lists */}
                  <div className={styles.overviewStats}>
                    <div className={styles.statRow}>
                      <span className={styles.statLabel}>Completed Milestones</span>
                      <span className={styles.statVal}>{completedMilestones.length}</span>
                    </div>
                    <div className={styles.statRow} style={{ paddingLeft: '12px', fontSize: '0.82rem', borderLeft: '2px solid #10b981' }}>
                      <span className={styles.statLabel} style={{ color: '#10b981' }}>✓ Verified</span>
                      <span className={styles.statVal} style={{ color: '#10b981' }}>{completedMilestones.filter(m => m.status === 'Completed & Verified').length}</span>
                    </div>
                    <div className={styles.statRow} style={{ paddingLeft: '12px', fontSize: '0.82rem', borderLeft: '2px solid #f59e0b' }}>
                      <span className={styles.statLabel} style={{ color: '#f59e0b' }}>⚠ Review Recommended</span>
                      <span className={styles.statVal} style={{ color: '#f59e0b' }}>{completedMilestones.filter(m => m.status === 'Completed — Review Recommended').length}</span>
                    </div>
                    <div className={styles.statRow}>
                      <span className={styles.statLabel}>Remaining Milestones</span>
                      <span className={styles.statVal}>
                        {roadmap.stages.flatMap(s => s.milestones).length - completedMilestones.length}
                      </span>
                    </div>
                    <div className={styles.statRow}>
                      <span className={styles.statLabel}>Verified Skills</span>
                      <span className={styles.statVal}>{completedSkills.length}</span>
                    </div>
                    <div className={styles.statRow}>
                      <span className={styles.statLabel}>Assessments Attempted</span>
                      <span className={styles.statVal}>
                        {flatMilestones.filter(m => m.assessmentAttempted).length}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '12px' }}>
                  <button 
                    style={{ background: 'none', border: 'none', color: '#a78bfa', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
                    onClick={() => navigate('/roadmap')}
                  >
                    <span>Open Career Roadmap</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Milestones status breakdown */}
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>
                  <GitFork size={18} style={{ color: '#8b5cf6' }} />
                  <span>Milestone Summary</span>
                </h3>

                <div className={styles.milestonesList}>
                  {/* Current milestone */}
                  {currentMilestone ? (
                    <div className={styles.milestoneItem}>
                      <Circle className={styles.milestoneIcon} size={18} style={{ color: '#a78bfa' }} />
                      <div className={styles.milestoneInfo}>
                        <h4>{currentMilestone.title}</h4>
                        <p>{currentMilestone.description}</p>
                        <span className={`${styles.milestoneBadge} ${styles.badgeCurrent}`}>Current Milestone</span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '8px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      No active milestones remaining! You have achieved all checkpoints.
                    </div>
                  )}

                  {/* Completed list */}
                  {completedMilestones.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                      <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.03em' }}>Recently Assessed</div>
                      {completedMilestones.slice(-2).map(m => {
                        const isVerified = m.status === 'Completed & Verified';
                        return (
                          <div key={m.id} className={styles.milestoneItem}>
                            {isVerified ? (
                              <CheckCircle className={styles.milestoneIcon} size={18} style={{ color: '#10b981' }} />
                            ) : (
                              <AlertCircle className={styles.milestoneIcon} size={18} style={{ color: '#f59e0b' }} />
                            )}
                            <div className={styles.milestoneInfo}>
                              <h4>{m.title}</h4>
                              <p>{m.description}</p>
                              {isVerified ? (
                                <span className={`${styles.milestoneBadge} ${styles.badgeCompleted}`}>Completed & Verified</span>
                              ) : (
                                <span className={`${styles.milestoneBadge} ${styles.badgeReview}`}>Review Recommended</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Upcoming list preview */}
                  {upcomingMilestones.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                      <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.03em' }}>Next Up</div>
                      {upcomingMilestones.slice(0, 2).map(m => (
                        <div key={m.id} className={styles.milestoneItem}>
                          <Circle className={styles.milestoneIcon} size={18} style={{ color: 'var(--text-muted)' }} />
                          <div className={styles.milestoneInfo}>
                            <h4>{m.title}</h4>
                            <p>{m.description}</p>
                            <span className={`${styles.milestoneBadge} ${styles.badgeUpcoming}`}>Upcoming</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Skills progress list */}
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>
                  <BookOpen size={18} style={{ color: '#0694a2' }} />
                  <span>Skills Map</span>
                </h3>

                <div className={styles.skillsSplit}>
                  {/* Completed Skills */}
                  <div className={styles.skillsGroup}>
                    <h4>Verified Skills ({completedSkills.length})</h4>
                    {completedSkills.length === 0 ? (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pass milestone assessments to verify skills</p>
                    ) : (
                      <div className={styles.skillsWrap}>
                        {completedSkills.map(s => (
                          <span key={s} className={`${styles.skillPill} ${styles.skillPillCompleted}`}>{s}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Remaining Skills */}
                  <div className={styles.skillsGroup}>
                    <h4>Target Skills ({remainingSkills.length})</h4>
                    {remainingSkills.length === 0 ? (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No remaining skills required</p>
                    ) : (
                      <div className={styles.skillsWrap}>
                        {remainingSkills.map(s => (
                          <span key={s} className={`${styles.skillPill} ${styles.skillPillRemaining}`}>{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Right side: Goals and Recent Activity timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Goals widget */}
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>
                  <Sparkles size={18} style={{ color: '#f59e0b' }} />
                  <span>Learning Goals</span>
                </h3>
                
                {goals.length === 0 ? (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>All goals reached! High five!</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {goals.map((g, idx) => (
                      <div key={g.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '0.8rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', fontWeight: 600 }}>#{idx + 1}</span>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 600 }}>{g.title}</span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Skills: {g.skills.join(', ')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Activity Logs */}
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>
                  <Clock size={18} style={{ color: 'var(--text-muted)' }} />
                  <span>Recent Activity</span>
                </h3>

                <div className={styles.activityTimeline}>
                  {recentActivity.map((act, idx) => (
                    <div key={idx} className={styles.activityItem}>
                      <div className={styles.activityDot} />
                      <div className={styles.activityText}>
                        <span>{act.text}</span>
                        <span className={styles.activityTime}>{act.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assessment Results Card */}
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>
                  <Award size={18} style={{ color: 'var(--color-primary)' }} />
                  <span>Assessment Results</span>
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
                  {flatMilestones.filter(m => m.assessmentAttempted).length === 0 ? (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '12px' }}>
                      No assessments attempted yet.
                    </div>
                  ) : (
                    flatMilestones.filter(m => m.assessmentAttempted).map((m) => (
                      <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderRadius: '6px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0, flex: 1 }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>{m.title}</span>
                          <span style={{ fontSize: '0.72rem', color: m.status === 'Completed & Verified' ? '#10b981' : '#f59e0b' }}>
                            {m.status === 'Completed & Verified' ? 'Verified' : 'Review Recommended'}
                          </span>
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: m.status === 'Completed & Verified' ? '#10b981' : '#f59e0b', marginLeft: '12px', flexShrink: 0 }}>
                          {m.assessmentScore}%
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
};
