import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Youtube, ExternalLink, AlertCircle, Clock, Film } from 'lucide-react';
import styles from './DashboardWidgets.module.css';
import { YoutubeApiService } from '../../services/youtube.service';
import type { YouTubeVideo } from '../../services/youtube.service';

interface YouTubeLearningProps {
  videos?: any[]; // for backwards compatibility
}

const CATEGORIES = [
  'Career Fundamentals',
  'Required Skills',
  'Current Roadmap Milestone',
  'Skill Gaps',
  'Interview Preparation',
  'Certifications',
  'Projects / Practical Learning'
];

export const YouTubeLearning: React.FC<YouTubeLearningProps> = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Career Fundamentals');
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [configMissing, setConfigMissing] = useState<boolean>(false);
  const [apiUnavailable, setApiUnavailable] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setConfigMissing(false);
        setApiUnavailable(false);

        const response = await YoutubeApiService.searchVideos({
          category: activeCategory,
          maxResults: 4
        });

        if (!active) return;

        if (response.configMissing) {
          setConfigMissing(true);
          setVideos([]);
        } else if (response.apiUnavailable) {
          setApiUnavailable(true);
          setVideos([]);
        } else {
          setVideos(response.videos || []);
        }
      } catch (err) {
        console.error('Error loading YouTube search results:', err);
        if (active) {
          setApiUnavailable(true);
          setVideos([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchVideos();
    return () => {
      active = false;
    };
  }, [activeCategory]);

  return (
    <motion.div
      className="premiumCard"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '420px' }}
    >
      {/* Embedded CSS animation keyframes for skeletons */}
      <style>{`
        @keyframes skeleton-pulse {
          0% { opacity: 0.6; }
          50% { opacity: 0.3; }
          100% { opacity: 0.6; }
        }
      `}</style>

      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div>
          <h3 className="text-subheading" style={{ fontSize: '1.1rem' }}>YouTube Learning</h3>
          <p className="text-caption" style={{ marginTop: '2px' }}>Curated video explanations for your active path</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(239, 68, 68, 0.08)', padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
          <Youtube size={14} style={{ color: '#ef4444' }} />
          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.02em' }}>YouTube API</span>
        </div>
      </div>

      {/* Categories Scrollable Pills */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '10px',
        marginBottom: '16px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
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

      {/* Video Content Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, justifyContent: 'center' }}>
        <AnimatePresence mode="wait">
          {loading ? (
            // Loading Skeletons
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}
            >
              {[1, 2, 3].map((n) => (
                <div 
                  key={n} 
                  style={{
                    display: 'flex',
                    gap: '14px',
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.01)',
                    border: '1px solid rgba(255,255,255,0.03)',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ width: '84px', height: '54px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.02)', animation: 'skeleton-pulse 1.5s infinite', flexShrink: 0 }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ width: '85%', height: '12px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.02)', animation: 'skeleton-pulse 1.5s infinite' }} />
                    <div style={{ width: '45%', height: '10px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.015)', animation: 'skeleton-pulse 1.5s infinite' }} />
                  </div>
                </div>
              ))}
            </motion.div>
          ) : configMissing ? (
            // Configuration missing screen
            <motion.div
              key="config"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: 'center', padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}
            >
              <AlertCircle size={24} style={{ color: '#f59e0b' }} />
              <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>API Key Configuration Missing</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4, maxWidth: '280px' }}>
                The YouTube search Data API key is not configured on this server. Add YOUTUBE_API_KEY to your env settings to enable learning video streams.
              </p>
            </motion.div>
          ) : apiUnavailable ? (
            // API offline screen
            <motion.div
              key="offline"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: 'center', padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}
            >
              <AlertCircle size={24} style={{ color: '#ef4444' }} />
              <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>YouTube API Offline</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4, maxWidth: '280px' }}>
                The search request failed or timed out. Please check your network connection or verify that your quota has not been exceeded.
              </p>
            </motion.div>
          ) : videos.length === 0 ? (
            // Empty results
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: 'center', padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}
            >
              <Film size={24} style={{ opacity: 0.4 }} />
              <p style={{ fontSize: '0.8rem' }}>No tutorials found for this category.</p>
            </motion.div>
          ) : (
            // Video Cards Grid
            <motion.div
              key="videos"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}
            >
              {videos.map((video) => (
                <a
                  key={video.videoId}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.interactiveListItem}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.01)',
                    border: '1px solid rgba(255,255,255,0.03)',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {/* Thumbnail on left */}
                  <div 
                    style={{
                      width: '84px',
                      height: '54px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      flexShrink: 0,
                      border: '1px solid rgba(255,255,255,0.04)',
                      overflow: 'hidden'
                    }}
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`;
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <div 
                      style={{
                        position: 'absolute',
                        bottom: '2px',
                        right: '4px',
                        background: 'rgba(0,0,0,0.85)',
                        padding: '1px 4px',
                        borderRadius: '3px',
                        fontSize: '0.55rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        color: '#fff'
                      }}
                    >
                      <Clock size={8} />
                      <span>Video</span>
                    </div>
                  </div>

                  {/* Metadata and Title */}
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <h4 
                      style={{ 
                        fontSize: '0.78rem', 
                        fontWeight: 650, 
                        color: 'var(--text-primary)', 
                        whiteSpace: 'nowrap', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        margin: 0
                      }}
                      dangerouslySetInnerHTML={{ __html: video.title }}
                    />
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                      {video.channelTitle}
                    </div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>
                      Published {video.publishedAt}
                    </div>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    background: 'rgba(88, 80, 236, 0.1)',
                    border: '1px solid rgba(88, 80, 236, 0.2)',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: '#c7d2fe',
                    flexShrink: 0,
                    transition: 'all 0.2s ease'
                  }}>
                    <span>Watch</span>
                    <ExternalLink size={10} style={{ color: '#c7d2fe' }} />
                  </div>
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
