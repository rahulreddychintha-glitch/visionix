import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Youtube, ExternalLink, Eye, Clock, Calendar } from 'lucide-react';
import styles from './DashboardWidgets.module.css';
import { PersonalizationApiService } from '../../services/personalization.service';

interface YouTubeVideo {
  id: string;
  title: string;
  channel: string;
  duration: string;
  views: string;
  publishedAt: string;
  thumbnail: string;
}

interface YouTubeLearningProps {
  videos?: YouTubeVideo[];
}

export const YouTubeLearning: React.FC<YouTubeLearningProps> = ({ videos: propVideos }) => {
  const [videos, setVideos] = useState<YouTubeVideo[]>(propVideos || []);

  useEffect(() => {
    if (propVideos) {
      setVideos(propVideos);
      return;
    }

    PersonalizationApiService.getPersonalizedVideos()
      .then(apiVideos => {
        if (apiVideos) {
          setVideos(apiVideos);
        } else {
          setVideos([]);
        }
      })
      .catch(err => {
        console.error('Error fetching YouTube API data from server:', err);
        setVideos([]);
      });
  }, [propVideos]);

  return (
    <motion.div
      className="premiumCard"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 className="text-subheading">YouTube Learning</h3>
          <p className="text-caption" style={{ marginTop: '2px' }}>Curated video explanations</p>
        </div>
        <Youtube size={16} style={{ color: '#ef4444' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
        {videos.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px', color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>
            YouTube learning tutorials are currently unavailable.
          </div>
        ) : (
          videos.map((video) => (
            <a
              key={video.id}
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.interactiveListItem}
              style={{
                display: 'flex',
                gap: '14px',
                padding: '12px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.01)',
                border: '1px solid rgba(255,255,255,0.03)',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              {/* Live Video Thumbnail */}
              <div 
                style={{
                  width: '76px',
                  height: '48px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  position: 'relative',
                  flexShrink: 0,
                  border: '1px solid rgba(255,255,255,0.04)',
                  overflow: 'hidden'
                }}
              >
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : null}
                <div 
                  style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '4px',
                    background: 'rgba(0,0,0,0.8)',
                    padding: '1px 4px',
                    borderRadius: '3px',
                    fontSize: '0.55rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}
                >
                  <Clock size={8} />
                  <span>{video.duration}</span>
                </div>
              </div>

              {/* Video Meta info */}
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span 
                  className="text-description" 
                  style={{ 
                    fontSize: '0.775rem', 
                    fontWeight: 650, 
                    color: 'var(--text-primary)', 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis' 
                  }}
                >
                  {video.title}
                </span>
                <div style={{ fontSize: '0.675rem', color: 'var(--text-secondary)' }}>
                  {video.channel}
                </div>
                <div style={{ display: 'flex', gap: '8px', fontSize: '0.625rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <Eye size={10} /> {video.views}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <Calendar size={10} /> {video.publishedAt}
                  </span>
                </div>
              </div>
              
              <ExternalLink size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            </a>
          ))
        )}
      </div>
    </motion.div>
  );
};
