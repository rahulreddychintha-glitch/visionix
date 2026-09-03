import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Youtube, 
  Search, 
  ExternalLink, 
  AlertCircle, 
  Clock, 
  Film, 
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { YoutubeApiService } from '../services/youtube.service';
import type { YouTubeVideo } from '../services/youtube.service';
import { LearningHubApiService } from '../services/learning.service';
import { decodeHtmlEntities } from '../utils/textUtils';


const CATEGORIES = [
  'Career Fundamentals',
  'Required Skills',
  'Current Roadmap Milestone',
  'Skill Gaps',
  'Interview Preparation',
  'Certifications',
  'Projects / Practical Learning'
];

export const YouTubeLearningPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Career Fundamentals');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Custom State for logical sequencing
  const [userState, setUserState] = useState<{
    dreamCareer: string | null;
    hasRoadmap: boolean;
    loaded: boolean;
  }>({
    dreamCareer: null,
    hasRoadmap: false,
    loaded: false
  });

  // Detailed error state mapping
  const [youtubeError, setYoutubeError] = useState<string | null>(null);
  
  // Bookmarks & tracking lists to display states correctly
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [trackedIds, setTrackedIds] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Sync bookmarks and tracked resources from learning hub backend
  const syncUserLearningState = useCallback(async () => {
    try {
      // Pass skipYoutube = true to prevent duplicate backend searches!
      const hubData = await LearningHubApiService.getLearningHubData(true);
      if (hubData) {
        setBookmarkedIds(hubData.bookmarkedResources.map(r => r.resourceId));
        setTrackedIds([
          ...hubData.continueLearning.map(r => r.resourceId),
          ...hubData.completedLearning.map(r => r.resourceId)
        ]);
        setUserState({
          dreamCareer: hubData.targetCareer?.title || hubData.dreamCareer || null,
          hasRoadmap: hubData.hasRoadmap ?? false,
          loaded: true
        });
      }
    } catch (err) {
      console.warn('[YouTubeLearningPage] Failed to sync user learning states:', err);
      // Fallback loaded state so we don't block search indefinitely
      setUserState(prev => ({ ...prev, loaded: true }));
    }
  }, []);

  // Fetch search videos based on filters or query
  const fetchVideos = useCallback(async () => {
    // Prevent fetching if context state is not resolved yet
    if (!userState.loaded) return;

    try {
      setLoading(true);
      setYoutubeError(null);

      // Verify category context requirements BEFORE searching to save API quota
      if (debouncedQuery.trim().length === 0) {
        // All categories require onboarding (dreamCareer setup)
        if (!userState.dreamCareer) {
          setVideos([]);
          return;
        }

        // Current Roadmap Milestone requires roadmap generation
        if (activeCategory === 'Current Roadmap Milestone' && !userState.hasRoadmap) {
          setVideos([]);
          return;
        }
      }

      const params: any = { maxResults: 8 };
      
      if (debouncedQuery.trim().length > 0) {
        params.q = debouncedQuery;
      } else {
        params.category = activeCategory;
      }

      const response = await YoutubeApiService.searchVideos(params);

      if (response.configMissing) {
        setYoutubeError('CONFIGURATION_MISSING');
        setVideos([]);
      } else if (response.apiUnavailable) {
        setYoutubeError(response.errorType || 'NETWORK_ERROR');
        setVideos([]);
      } else {
        setVideos(response.videos || []);
        setYoutubeError(null);
      }
    } catch (err) {
      console.error('Error loading YouTube search results:', err);
      setYoutubeError('NETWORK_ERROR');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, debouncedQuery, userState]);

  // Debounce search query with length threshold checks
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setDebouncedQuery('');
      return;
    }
    if (searchQuery.trim().length < 3) {
      return; // Skip search for short queries
    }
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 600); // 600ms debounce
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Decoupled Effects: Sync user state first, then fetch videos only on specific triggers
  useEffect(() => {
    syncUserLearningState();
  }, [syncUserLearningState]);

  useEffect(() => {
    if (userState.loaded) {
      fetchVideos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userState.loaded, activeCategory, debouncedQuery]);

  const handleStartResource = async (resourceId: string) => {
    try {
      setActionLoading(resourceId);
      await LearningHubApiService.startResource(resourceId);
      await syncUserLearningState();
    } catch (err) {
      console.error('Error starting resource:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleBookmark = async (resourceId: string) => {
    try {
      setActionLoading(resourceId);
      await LearningHubApiService.toggleBookmark(resourceId);
      await syncUserLearningState();
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 3 || searchQuery.trim().length === 0) {
      setDebouncedQuery(searchQuery);
    }
  };

  const handleRetry = () => {
    YoutubeApiService.clearCache();
    fetchVideos();
  };

  // Determine if the selected category personalization is missing
  const isPersonalizationMissing = debouncedQuery.trim().length === 0 && (
    !userState.dreamCareer || 
    (activeCategory === 'Current Roadmap Milestone' && !userState.hasRoadmap)
  );

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
        @keyframes skeleton-pulse {
          0% { opacity: 0.6; }
          50% { opacity: 0.3; }
          100% { opacity: 0.6; }
        }
      `}</style>
      <div className="ambient-noise" />
      <div className="glow-accent-primary" style={{ width: '400px', height: '400px', top: '10%', right: '15%', opacity: 0.3 }} />
      <div className="glow-accent-secondary" style={{ width: '450px', height: '450px', bottom: '15%', left: '10%', opacity: 0.25 }} />

      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        position: 'relative',
        zIndex: 1,
        padding: '24px'
      }}>
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                color: '#ef4444',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                background: 'rgba(239, 68, 68, 0.1)',
                padding: '3px 8px',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Youtube size={12} /> YouTube API Stream
              </span>
            </div>
            <h1 className="text-heading" style={{ fontSize: '1.8rem', marginTop: '4px' }}>YouTube Learning</h1>
            <p className="text-muted" style={{ fontSize: '0.9rem', maxWidth: '600px', marginTop: '2px' }}>
              Access curated video explanations directly mapped to your career milestones and skill gaps.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '4px 12px', minWidth: '280px' }}>
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search custom topics..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                flex: 1,
                padding: '6px 0'
              }}
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => { setSearchQuery(''); setDebouncedQuery(''); }} 
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.74rem', cursor: 'pointer' }}
              >
                Clear
              </button>
            )}
          </form>
        </div>

        {/* Categories Scrollable Pills */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          borderBottom: '1px solid rgba(255,255,255,0.03)',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category && debouncedQuery.trim().length === 0;
            return (
              <button
                key={category}
                onClick={() => {
                  setSearchQuery('');
                  setDebouncedQuery('');
                  setActiveCategory(category);
                }}
                style={{
                  whiteSpace: 'nowrap',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  background: isActive ? 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' : 'rgba(255,255,255,0.02)',
                  border: isActive ? 'none' : '1px solid rgba(255,255,255,0.05)',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  boxShadow: isActive ? '0 4px 12px rgba(88, 80, 236, 0.2)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Videos Display Section */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '300px', justifyContent: 'center' }}>
          <AnimatePresence mode="wait">
            {/* Loading sequence wait */}
            {!userState.loaded ? (
              <motion.div
                key="loading-context"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}
              >
                Finding learning resources...
              </motion.div>
            ) : loading ? (
              // Loading skeletons
              <motion.div
                key="loading-search"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ width: '100%', height: '150px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)', animation: 'skeleton-pulse 1.5s infinite' }} />
                    <div style={{ width: '90%', height: '14px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.02)', animation: 'skeleton-pulse 1.5s infinite' }} />
                    <div style={{ width: '50%', height: '10px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.015)', animation: 'skeleton-pulse 1.5s infinite' }} />
                  </div>
                ))}
              </motion.div>
            ) : isPersonalizationMissing ? (
              // Truthful personalization warning empty state
              <motion.div
                key="personalization-missing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ textAlign: 'center', padding: '48px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}
              >
                <AlertCircle size={32} style={{ color: '#f59e0b' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 650, color: 'var(--text-primary)' }}>No personalized topics are available yet</h3>
                <p className="text-muted" style={{ fontSize: '0.82rem', maxWidth: '360px', lineHeight: 1.4 }}>
                  {!userState.dreamCareer 
                    ? 'Please configure your Dream Career in onboarding to populate personalized categories.'
                    : 'Please generate your career roadmap under the Roadmap page to populate milestone tutorials.'}
                </p>
              </motion.div>
            ) : youtubeError ? (
              // Detailed error messages with Try Again
              <motion.div
                key="api-error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ textAlign: 'center', padding: '48px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}
              >
                <AlertCircle size={32} style={{ color: (youtubeError === 'QUOTA_EXCEEDED' || youtubeError === 'RATE_LIMITED') ? '#f59e0b' : '#ef4444' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 650, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                  {youtubeError === 'CONFIGURATION_MISSING' && 'YouTube Learning is not configured yet.'}
                  {youtubeError === 'QUOTA_EXCEEDED' && 'YouTube API quota reached.'}
                  {youtubeError === 'RATE_LIMITED' && 'YouTube request limit reached. Please try again later.'}
                  {youtubeError === 'TIMEOUT' && 'YouTube is taking too long to respond.'}
                  {youtubeError === 'SERVER_ERROR' && 'YouTube Learning is temporarily unavailable.'}
                  {youtubeError === 'NETWORK_ERROR' && 'YouTube search failed. Please verify your connection.'}
                </h3>
                <p className="text-muted" style={{ fontSize: '0.82rem', maxWidth: '360px', lineHeight: 1.4, marginTop: '4px' }}>
                  {youtubeError === 'CONFIGURATION_MISSING' && 'The YOUTUBE_API_KEY environment variable is not configured on this server.'}
                  {youtubeError === 'API_KEY_INVALID' && 'The server YouTube API credentials are rejected. Verify credentials.'}
                  {youtubeError === 'QUOTA_EXCEEDED' && 'YouTube learning resources are temporarily unavailable because the API quota has been reached. Please try again later.'}
                  {youtubeError === 'RATE_LIMITED' && 'You are refreshing too quickly. Wait a few moments before retrying.'}
                  {youtubeError === 'TIMEOUT' && 'The Google API is taking too long to respond. Please verify connection and retry.'}
                  {youtubeError === 'SERVER_ERROR' && 'The backend returned an unexpected response. Please try again.'}
                  {youtubeError === 'NETWORK_ERROR' && 'Unable to reach the server. Please check your network connection.'}
                </p>
                <button 
                  onClick={handleRetry}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'var(--text-primary)',
                    fontSize: '0.8rem',
                    fontWeight: 650,
                    cursor: 'pointer',
                    marginTop: '12px'
                  }}
                >
                  Try Again
                </button>
              </motion.div>
            ) : videos.length === 0 ? (
              // Empty state
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ textAlign: 'center', padding: '48px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}
              >
                <Film size={32} style={{ opacity: 0.4 }} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>No relevant tutorials found</h3>
                <p style={{ fontSize: '0.8rem', maxWidth: '300px', lineHeight: 1.4 }}>
                  No video results were found for the query: "{debouncedQuery || activeCategory}". Try searching another topic.
                </p>
              </motion.div>
            ) : (
              // Render Grid of Real YouTube Cards
              <motion.div
                key="videos"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}
              >
                {videos.map((video) => {
                  const isBookmarked = bookmarkedIds.includes(video.videoId);
                  const isTracking = trackedIds.includes(video.videoId);

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
                      {/* Video Thumbnail */}
                      <div style={{ position: 'relative', width: '100%', height: '150px', background: 'rgba(0,0,0,0.2)' }}>
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

                        {/* Bookmark Overlay Button */}
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
                          {isBookmarked ? (
                            <BookmarkCheck size={14} style={{ color: 'var(--color-primary)' }} />
                          ) : (
                            <Bookmark size={14} />
                          )}
                        </button>
                      </div>

                      {/* Video Meta */}
                      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
};
export default YouTubeLearningPage;
