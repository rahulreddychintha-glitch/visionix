import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Youtube, ExternalLink, Eye, Clock, Calendar } from 'lucide-react';
import styles from './DashboardWidgets.module.css';

interface YouTubeVideo {
  id: string;
  title: string;
  channel: string;
  duration: string;
  views: string;
  publishedAt: string;
  thumbnail: string;
}

const SEEDED_VIDEOS: YouTubeVideo[] = [
  {
    id: 'wjZofJX0v4M',
    title: 'But what is a neural network? | Chapter 1, Deep learning',
    channel: '3Blue1Brown',
    duration: '20:13',
    views: '12M views',
    publishedAt: '6 years ago',
    thumbnail: 'https://img.youtube.com/vi/wjZofJX0v4M/mqdefault.jpg'
  },
  {
    id: 'aircAruvnKk',
    title: 'But what is a convolution?',
    channel: '3Blue1Brown',
    duration: '26:01',
    views: '3.4M views',
    publishedAt: '1 year ago',
    thumbnail: 'https://img.youtube.com/vi/aircAruvnKk/mqdefault.jpg'
  }
];

interface YouTubeLearningProps {
  videos?: YouTubeVideo[];
}

export const YouTubeLearning: React.FC<YouTubeLearningProps> = ({ videos: propVideos }) => {
  const [videos, setVideos] = useState<YouTubeVideo[]>(propVideos || SEEDED_VIDEOS);

  // Attempt to fetch from YouTube Data API if VITE_YOUTUBE_API_KEY exists
  useEffect(() => {
    if (propVideos) {
      setVideos(propVideos);
      return;
    }

    const apiKey = (window as any).env?.VITE_YOUTUBE_API_KEY || import.meta.env?.VITE_YOUTUBE_API_KEY;
    if (!apiKey) return;

    // Search query for AI & Deep Learning tutorials
    const query = 'Machine Learning tutorial PyTorch';
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=2&type=video&key=${apiKey}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.items) {
          const apiVideos = data.items.map((item: any) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            channel: item.snippet.channelTitle,
            duration: '15 mins', // Simplified duration fallback
            views: '100K+ views', // Standard views fallback
            publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
            thumbnail: item.snippet.thumbnails.medium.url
          }));
          setVideos(apiVideos);
        }
      })
      .catch(err => console.error('Error fetching YouTube API data:', err));
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        {videos.map((video) => (
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
                background: `url(${video.thumbnail}) center/cover no-repeat`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                position: 'relative',
                flexShrink: 0,
                border: '1px solid rgba(255,255,255,0.04)'
              }}
            >
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
        ))}
      </div>
    </motion.div>
  );
};
