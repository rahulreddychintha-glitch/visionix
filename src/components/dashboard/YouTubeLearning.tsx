import React from 'react';
import { motion } from 'framer-motion';
import { Youtube, Play, Clock } from 'lucide-react';
import styles from './DashboardWidgets.module.css';

interface Video {
  title: string;
  channel: string;
  duration: string;
  thumbnailGradient: string;
}

interface YouTubeLearningProps {
  videos?: Video[];
}

const DEFAULT_VIDEOS: Video[] = [
  {
    title: 'Transformers & Self-Attention Explained',
    channel: '3Blue1Brown',
    duration: '24 mins',
    thumbnailGradient: 'linear-gradient(135deg, #ef4444, #991b1b)'
  },
  {
    title: 'PyTorch Neural Networks Course',
    channel: 'freeCodeCamp.org',
    duration: '2.5 hours',
    thumbnailGradient: 'linear-gradient(135deg, #ea580c, #9a3412)'
  }
];

export const YouTubeLearning: React.FC<YouTubeLearningProps> = ({
  videos = DEFAULT_VIDEOS
}) => {
  return (
    <motion.div
      className="premiumCard"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
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
          <div 
            key={video.title}
            className={styles.interactiveListItem}
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
            {/* Playable Video Thumbnail */}
            <div 
              style={{
                width: '60px',
                height: '40px',
                borderRadius: '6px',
                background: video.thumbnailGradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                position: 'relative',
                flexShrink: 0
              }}
            >
              <Play size={12} style={{ fill: 'currentColor' }} />
            </div>

            {/* Video Meta */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span className="text-description" style={{ fontSize: '0.775rem', fontWeight: 650, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {video.title}
              </span>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.675rem', color: 'var(--text-muted)' }}>
                <span>{video.channel}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Clock size={10} /> {video.duration}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
