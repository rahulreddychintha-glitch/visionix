import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, 
  ExternalLink, 
  Loader2, 
  AlertCircle, 
  Bookmark, 
  BookmarkCheck,
  BookOpen, 
  Youtube,
  Clock,
  ChevronRight
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { LearningHubApiService } from '../services/learning.service';
import type { LearningHubData } from '../types/learning.types';
import { decodeHtmlEntities } from '../utils/textUtils';


export const LearningHubPage: React.FC = () => {
  const [data, setData] = useState<LearningHubData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchHubData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await LearningHubApiService.getLearningHubData();
      setData(res);
    } catch (err: any) {
      console.error('Error loading Learning Hub:', err);
      setError('Failed to load personalized recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHubData();
  }, [fetchHubData]);

  const handleStartResource = async (resourceId: string) => {
    try {
      setActionLoading(resourceId);
      await LearningHubApiService.startResource(resourceId);
      // Reload details to sync continue learning lists
      const updated = await LearningHubApiService.getLearningHubData();
      setData(updated);
    } catch (err) {
      console.error('Error starting resource:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCompleteResource = async (resourceId: string) => {
    try {
      setActionLoading(resourceId);
      await LearningHubApiService.updateProgress(resourceId, 'completed');
      const updated = await LearningHubApiService.getLearningHubData();
      setData(updated);
    } catch (err) {
      console.error('Error completing resource:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleBookmark = async (resourceId: string) => {
    try {
      setActionLoading(resourceId);
      await LearningHubApiService.toggleBookmark(resourceId);
      const updated = await LearningHubApiService.getLearningHubData();
      setData(updated);
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading && !data) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
          <Loader2 className="spin-animation" size={32} style={{ color: 'var(--color-primary)' }} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-animation {
          animation: spin 1.5s linear infinite;
        }
      `}</style>
      <div className="ambient-noise" />
      <div className="glow-accent-primary" style={{ width: '400px', height: '400px', top: '10%', left: '15%', opacity: 0.35 }} />
      <div className="glow-accent-secondary" style={{ width: '450px', height: '450px', bottom: '15%', right: '10%', opacity: 0.3 }} />

      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        position: 'relative',
        zIndex: 1,
        padding: '24px'
      }}>
        {/* Hero Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              color: 'var(--color-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              background: 'rgba(99, 102, 241, 0.1)',
              padding: '3px 8px',
              borderRadius: '9999px'
            }}>
              Personalized Learning
            </span>
          </div>
          <h1 className="text-heading" style={{ fontSize: '1.8rem', marginTop: '4px' }}>Learning Hub</h1>
          <p className="text-muted" style={{ fontSize: '0.9rem', maxWidth: '600px', marginTop: '2px' }}>
            Visionix parses your roadmap milestones and skill gaps to suggest the most relevant learning paths.
          </p>
        </div>

        {error && (
          <div className="premiumCard" style={{ display: 'flex', gap: '10px', borderColor: 'rgba(239, 68, 68, 0.2)', padding: '16px', background: 'rgba(239, 68, 68, 0.02)' }}>
            <AlertCircle size={18} style={{ color: '#ef4444', flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>Error Loading Learning Hub</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>{error}</p>
            </div>
          </div>
        )}

        {/* User Configuration State Checks */}
        {!data?.dreamCareer ? (
          <div className="premiumCard" style={{ padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '999px',
              background: 'rgba(245, 158, 11, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f59e0b',
              border: '1px solid rgba(245, 158, 11, 0.15)'
            }}>
              <AlertCircle size={22} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 650, color: 'var(--text-primary)' }}>Set a Dream Career first</h3>
            <p className="text-muted" style={{ fontSize: '0.82rem', maxWidth: '380px', lineHeight: 1.4 }}>
              Define your career goals to receive personalized learning recommendations and skill gap tutorials.
            </p>
            <Link 
              to="/profile" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 650,
                textDecoration: 'none',
                marginTop: '6px'
              }}
            >
              Configure Goals <ChevronRight size={14} />
            </Link>
          </div>
        ) : !data?.hasRoadmap ? (
          <div className="premiumCard" style={{ padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '999px',
              background: 'rgba(99, 102, 241, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)',
              border: '1px solid rgba(99, 102, 241, 0.15)'
            }}>
              <BookOpen size={22} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 650, color: 'var(--text-primary)' }}>Generate Career Roadmap</h3>
            <p className="text-muted" style={{ fontSize: '0.82rem', maxWidth: '380px', lineHeight: 1.4 }}>
              Complete your career roadmap to receive milestone-based learning recommendations matching your path.
            </p>
            <Link 
              to="/roadmap" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 650,
                textDecoration: 'none',
                marginTop: '6px'
              }}
            >
              Generate Roadmap <ChevronRight size={14} />
            </Link>
          </div>
        ) : (
          /* Main Personalization Grid */
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
            
            {/* 1. Next Learning Step & Skills Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '24px', alignItems: 'start' }}>
              {/* Your Next Learning Step */}
              <div className="premiumCard" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 className="text-subheading" style={{ fontSize: '1.05rem' }}>Your Next Learning Step</h3>
                    <p className="text-caption" style={{ marginTop: '2px' }}>Highest priority action based on active milestone</p>
                  </div>
                  <Award size={18} style={{ color: 'var(--color-primary)' }} />
                </div>

                {data.nextLearningStep ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                    <div style={{
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.01)',
                      border: '1px solid rgba(255,255,255,0.03)'
                    }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {data.nextLearningStep.milestoneTitle}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                        {data.nextLearningStep.milestoneDescription}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)' }}>Required Skills:</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {data.nextLearningStep.requiredSkills.map(skill => (
                          <span key={skill} style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', color: 'var(--text-secondary)' }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {data.nextLearningStep.learningObjectives.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)' }}>Learning Objectives:</div>
                        <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {data.nextLearningStep.learningObjectives.map(obj => (
                            <li key={obj}>{obj}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div style={{
                      marginTop: 'auto',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: 'rgba(99, 102, 241, 0.04)',
                      border: '1px solid rgba(99, 102, 241, 0.1)',
                      fontSize: '0.72rem',
                      color: 'var(--text-secondary)',
                      fontStyle: 'italic'
                    }}>
                      💡 {data.nextLearningStep.reason}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    No active milestone identified. Complete current milestones.
                  </div>
                )}
              </div>

              {/* Recommended Skills */}
              <div className="premiumCard" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 className="text-subheading" style={{ fontSize: '1.05rem' }}>Recommended Skills</h3>
                    <p className="text-caption" style={{ marginTop: '2px' }}>Priority focus list & mapping</p>
                  </div>
                  <Award size={18} style={{ color: 'var(--color-secondary)' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto' }}>
                  {data.recommendedSkills.length === 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      No skill recommendations available.
                    </div>
                  ) : (
                    data.recommendedSkills.map(skill => (
                      <div 
                        key={skill.name}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px',
                          padding: '10px',
                          borderRadius: '8px',
                          background: 'rgba(255,255,255,0.01)',
                          border: '1px solid rgba(255,255,255,0.03)'
                        }}
                      >
                        <span style={{ fontSize: '0.78rem', fontWeight: 650, color: 'var(--text-primary)' }}>{skill.name}</span>
                        <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)' }}>{skill.reason}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* 2. Continue Learning / Bookmarked Resources Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '24px' }}>
              
              {/* Continue Learning */}
              <div className="premiumCard">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 className="text-subheading" style={{ fontSize: '1.05rem' }}>Continue Learning</h3>
                    <p className="text-caption" style={{ marginTop: '2px' }}>Resume your active study tracks</p>
                  </div>
                </div>

                {data.continueLearning.length === 0 ? (
                  <div style={{ padding: '24px 16px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '12px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    No learning activity yet. Start a YouTube tutorial previewed below to track it.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                    {data.continueLearning.map(course => (
                      <div 
                        key={course.resourceId}
                        style={{
                          display: 'flex',
                          gap: '12px',
                          padding: '12px',
                          borderRadius: '12px',
                          background: 'rgba(255,255,255,0.01)',
                          border: '1px solid rgba(255,255,255,0.03)',
                          alignItems: 'center'
                        }}
                      >
                        {course.thumbnail && (
                          <div style={{ width: '80px', height: '50px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                            <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        )}
                        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 650, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {course.title}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{course.channel} • {course.provider}</span>
                          <div style={{ display: 'inline-flex', alignSelf: 'flex-start', fontSize: '0.62rem', fontWeight: 700, padding: '1px 6px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', marginTop: '2px' }}>
                            Self-reported progress: In Progress
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
                          <a 
                            href={course.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => handleStartResource(course.resourceId)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                              padding: '5px 10px',
                              borderRadius: '6px',
                              background: 'var(--color-primary)',
                              color: '#fff',
                              fontSize: '0.68rem',
                              fontWeight: 600,
                              textDecoration: 'none'
                            }}
                          >
                            Resume <ExternalLink size={10} />
                          </a>
                          <button
                            onClick={() => handleCompleteResource(course.resourceId)}
                            disabled={actionLoading === course.resourceId}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              border: '1px solid rgba(255,255,255,0.08)',
                              background: 'rgba(255,255,255,0.02)',
                              color: 'var(--text-secondary)',
                              fontSize: '0.68rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            Complete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bookmarked Tutorials */}
              <div className="premiumCard">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 className="text-subheading" style={{ fontSize: '1.05rem' }}>Bookmarked Resources</h3>
                    <p className="text-caption" style={{ marginTop: '2px' }}>Quick access bookmarks</p>
                  </div>
                </div>

                {data.bookmarkedResources.length === 0 ? (
                  <div style={{ padding: '24px 16px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '12px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    No bookmarked tutorials yet. Click bookmark icon on any YouTube video to save it.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                    {data.bookmarkedResources.map(course => (
                      <div 
                        key={course.resourceId}
                        style={{
                          display: 'flex',
                          gap: '12px',
                          padding: '12px',
                          borderRadius: '12px',
                          background: 'rgba(255,255,255,0.01)',
                          border: '1px solid rgba(255,255,255,0.03)',
                          alignItems: 'center'
                        }}
                      >
                        {course.thumbnail && (
                          <div style={{ width: '80px', height: '50px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                            <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        )}
                        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 650, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {course.title}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{course.channel} • {course.provider}</span>
                          <div style={{ display: 'inline-flex', alignSelf: 'flex-start', fontSize: '0.6rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                            Status: {course.status === 'completed' ? 'Completed by you' : course.status === 'in_progress' ? 'In Progress' : 'Not Started'}
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
                          <button
                            onClick={() => handleStartResource(course.resourceId)}
                            disabled={actionLoading === course.resourceId || course.status === 'completed' || course.status === 'in_progress'}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              background: 'var(--color-primary)',
                              border: 'none',
                              color: '#fff',
                              fontSize: '0.68rem',
                              fontWeight: 600,
                              cursor: (course.status === 'completed' || course.status === 'in_progress') ? 'default' : 'pointer',
                              opacity: (course.status === 'completed' || course.status === 'in_progress') ? 0.5 : 1
                            }}
                          >
                            {course.status === 'in_progress' ? 'In Progress' : course.status === 'completed' ? 'Completed' : 'Start'}
                          </button>
                          <button
                            onClick={() => handleToggleBookmark(course.resourceId)}
                            disabled={actionLoading === course.resourceId}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              border: '1px solid rgba(255,255,255,0.08)',
                              background: 'rgba(255,255,255,0.02)',
                              color: 'var(--text-secondary)',
                              fontSize: '0.68rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 3. YouTube Recommended Videos Preview */}
            <div className="premiumCard">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h3 className="text-subheading" style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Youtube size={20} style={{ color: '#ef4444' }} /> YouTube Learning Preview
                  </h3>
                  <p className="text-caption" style={{ marginTop: '2px' }}>Personalized tutorials matching your milestone query: <strong>"{data.youtubeQuery}"</strong></p>
                </div>
                <Link 
                  to="/youtube" 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.74rem',
                    color: 'var(--color-primary)',
                    textDecoration: 'none',
                    fontWeight: 700
                  }}
                >
                  Explore All Videos <ChevronRight size={12} />
                </Link>
              </div>

              {data.youtubeError ? (
                <div style={{ padding: '36px 16px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={28} style={{ color: data.youtubeError === 'QUOTA_EXCEEDED' ? '#f59e0b' : '#ef4444' }} />
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    {data.youtubeError === 'CONFIGURATION_MISSING' && 'YouTube Learning is not configured yet.'}
                    {data.youtubeError === 'API_KEY_INVALID' && 'YouTube API key is invalid. Please check configuration.'}
                    {data.youtubeError === 'QUOTA_EXCEEDED' && 'YouTube API quota reached. YouTube learning resources are temporarily unavailable because the API quota has been reached. Please try again later.'}
                    {data.youtubeError === 'RATE_LIMITED' && 'YouTube request limit reached. Please try again later.'}
                    {data.youtubeError === 'TIMEOUT' && 'YouTube is taking too long to respond.'}
                    {data.youtubeError === 'SERVER_ERROR' && 'YouTube Learning is temporarily unavailable.'}
                    {data.youtubeError === 'NETWORK_ERROR' && 'YouTube search failed. Please verify your connection.'}
                  </div>
                  <button 
                    onClick={fetchHubData}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '6px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'var(--text-primary)',
                      fontSize: '0.74rem',
                      fontWeight: 650,
                      cursor: 'pointer',
                      marginTop: '6px'
                    }}
                  >
                    Try Again
                  </button>
                </div>
              ) : data.youtubeVideos.length === 0 ? (
                <div style={{ padding: '36px 16px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '12px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  No relevant tutorials found.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                  {data.youtubeVideos.map(video => {
                    const isBookmarked = data.bookmarkedResources.some(br => br.resourceId === video.videoId);
                    const isTracking = data.continueLearning.some(cl => cl.resourceId === video.videoId) || data.completedLearning.some(cl => cl.resourceId === video.videoId);

                    return (
                      <div 
                        key={video.videoId}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          background: 'rgba(255,255,255,0.01)',
                          border: '1px solid rgba(255,255,255,0.03)',
                          position: 'relative'
                        }}
                      >
                        {/* Thumbnail */}
                        <div style={{ position: 'relative', width: '100%', height: '140px', background: 'rgba(0,0,0,0.2)' }}>
                          <img 
                            src={video.thumbnail} 
                            alt={video.title} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div style={{
                            position: 'absolute',
                            bottom: '8px',
                            right: '8px',
                            background: 'rgba(0,0,0,0.85)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '0.62rem',
                            fontWeight: 700,
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}>
                            <Clock size={8} /> Video
                          </div>
                          
                          {/* Bookmark overlay btn */}
                          <button
                            onClick={() => handleToggleBookmark(video.videoId)}
                            disabled={actionLoading === video.videoId}
                            style={{
                              position: 'absolute',
                              top: '8px',
                              right: '8px',
                              width: '28px',
                              height: '28px',
                              borderRadius: '999px',
                              background: 'rgba(0,0,0,0.7)',
                              border: 'none',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              zIndex: 2
                            }}
                          >
                            {isBookmarked ? <BookmarkCheck size={14} style={{ color: 'var(--color-primary)' }} /> : <Bookmark size={14} />}
                          </button>
                        </div>

                        {/* Metadata */}
                        <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                          <h4 
                            style={{ fontSize: '0.78rem', fontWeight: 650, color: 'var(--text-primary)', margin: 0, lineHeight: 1.4, height: '40px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                          >
                            {decodeHtmlEntities(video.title)}
                          </h4>

                          <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{video.channelTitle}</span>
                          <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: 'auto' }}>Published {video.publishedAt}</span>
                          
                          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                            <a 
                              href={video.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => handleStartResource(video.videoId)}
                              style={{
                                flex: 1,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                color: 'var(--text-secondary)',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                textDecoration: 'none'
                              }}
                            >
                              Watch <ExternalLink size={10} />
                            </a>
                            <button
                              onClick={() => handleStartResource(video.videoId)}
                              disabled={actionLoading === video.videoId || isTracking}
                              style={{
                                flex: 1,
                                padding: '6px 12px',
                                borderRadius: '6px',
                                background: isTracking ? 'rgba(16, 185, 129, 0.1)' : 'var(--color-primary)',
                                border: isTracking ? '1px solid rgba(16, 185, 129, 0.2)' : 'none',
                                color: isTracking ? '#10b981' : '#fff',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                cursor: isTracking ? 'default' : 'pointer'
                              }}
                            >
                              {isTracking ? 'Tracking' : 'Start'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
export default LearningHubPage;
