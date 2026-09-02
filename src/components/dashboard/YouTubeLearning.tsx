import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Youtube, ExternalLink, Clock, ArrowRight } from 'lucide-react';
import styles from './DashboardWidgets.module.css';
import { YoutubeApiService } from '../../services/youtube.service';
import type { YouTubeVideo } from '../../services/youtube.service';
import { decodeHtmlEntities } from '../../utils/textUtils';

interface YouTubeLearningProps {
  videos?: any[]; // for backwards compatibility
}

const CATEGORIES = [
  'Career Fundamentals',
  'Required Skills',
  'Roadmap Milestones',
  'Interview Prep',
  'Practical Projects'
];

const FALLBACK_VIDEOS: YouTubeVideo[] = [
  {
    videoId: 'fallback_1',
    title: 'Machine Learning Full Course - Learn ML in 6 Hours',
    description: 'Comprehensive walkthrough of machine learning algorithms and code implementations.',
    thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&auto=format&fit=crop&q=60',
    channelTitle: 'freeCodeCamp.org',
    publishedAt: 'Recent',
    url: 'https://www.youtube.com'
  },
  {
    videoId: 'fallback_2',
    title: 'Data Structures and Algorithms for Beginners',
    description: 'Master core computational structures, Big O notation, and algorithm design.',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=60',
    channelTitle: 'Programming with Mosh',
    publishedAt: 'Recent',
    url: 'https://www.youtube.com'
  }
];

export const YouTubeLearning: React.FC<YouTubeLearningProps> = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Career Fundamentals');
  const [videos, setVideos] = useState<YouTubeVideo[]>(FALLBACK_VIDEOS);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await YoutubeApiService.searchVideos({
          category: activeCategory,
          maxResults: 2
        });

        if (!active) return;

        if (response.videos && response.videos.length > 0) {
          setVideos(response.videos.slice(0, 2));
        } else {
          setVideos(FALLBACK_VIDEOS);
        }
      } catch (err) {
        console.error('Error loading YouTube search results:', err);
        if (active) {
          setVideos(FALLBACK_VIDEOS);
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
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
        padding: '18px 20px',
        boxSizing: 'border-box'
      }}
    >
      <div>
        {/* Header section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h3 className="text-subheading" style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>YouTube Learning</h3>
            <p className="text-caption" style={{ marginTop: '2px', color: 'var(--text-secondary)' }}>Curated video explanations for your active path</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(239, 68, 68, 0.08)', padding: '3px 8px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
            <Youtube size={13} style={{ color: '#ef4444' }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase' }}>Curated</span>
          </div>
        </div>

        {/* Categories Scrollable Pills */}
        <div style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '6px',
          marginBottom: '10px',
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
                  padding: '4px 10px',
                  borderRadius: '16px',
                  fontSize: '0.7rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  background: isActive ? 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' : 'rgba(255,255,255,0.02)',
                  border: isActive ? 'none' : '1px solid rgba(255,255,255,0.05)',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease'
                }}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Video Content List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <AnimatePresence mode="wait">
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                {[1, 2].map((n) => (
                  <div 
                    key={n} 
                    style={{
                      display: 'flex',
                      gap: '10px',
                      padding: '8px 10px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.01)',
                      border: '1px solid rgba(255,255,255,0.03)',
                      height: '52px'
                    }}
                  />
                ))}
              </div>
            ) : (
              <motion.div
                key="videos"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}
              >
                {videos.slice(0, 2).map((video) => (
                  <a
                    key={video.videoId}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.interactiveListItem}
                    style={{
                      display: 'flex',
                      gap: '10px',
                      padding: '8px 10px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.015)',
                      border: '1px solid rgba(255,255,255,0.035)',
                      alignItems: 'center',
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Thumbnail on left */}
                    <div 
                      style={{
                        width: '64px',
                        height: '42px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(255,255,255,0.02)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        flexShrink: 0,
                        overflow: 'hidden'
                      }}
                    >
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = `https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&auto=format&fit=crop&q=60`;
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
                          right: '2px',
                          background: 'rgba(0,0,0,0.85)',
                          padding: '1px 3px',
                          borderRadius: '2px',
                          fontSize: '0.55rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px',
                          color: '#fff'
                        }}
                      >
                        <Clock size={7} />
                        <span>Vid</span>
                      </div>
                    </div>

                    {/* Metadata and Title */}
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <h4 
                        style={{ 
                          fontSize: '0.78rem', 
                          fontWeight: 600, 
                          color: 'var(--text-primary)', 
                          whiteSpace: 'nowrap', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          margin: 0 
                        }}
                      >
                        {decodeHtmlEntities(video.title)}
                      </h4>

                      <div style={{ fontSize: '0.675rem', color: 'var(--text-secondary)' }}>
                        {video.channelTitle}
                      </div>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      padding: '3px 6px',
                      borderRadius: '5px',
                      background: 'rgba(88, 80, 236, 0.1)',
                      border: '1px solid rgba(88, 80, 236, 0.2)',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      color: '#c7d2fe',
                      flexShrink: 0
                    }}>
                      <span>Watch</span>
                      <ExternalLink size={9} style={{ color: '#c7d2fe' }} />
                    </div>
                  </a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate('/youtube-learning')}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          marginTop: '14px',
          padding: '8px 14px',
          borderRadius: '8px',
          background: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid rgba(139, 92, 246, 0.22)',
          color: '#c084fc',
          fontSize: '0.78rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(139, 92, 246, 0.18)';
          e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.35)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
          e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.22)';
        }}
      >
        Open Video Learning Hub <ArrowRight size={13} />
      </button>
    </motion.div>
  );
};
