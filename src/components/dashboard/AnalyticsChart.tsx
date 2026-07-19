import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Clock } from 'lucide-react';

interface ChartDataPoint {
  label: string;
  value: number;
}

interface AnalyticsChartProps {
  title?: string;
  subtitle?: string;
  type?: 'line' | 'bar';
  data?: ChartDataPoint[];
  color?: string;
}

const DEFAULT_DATA: ChartDataPoint[] = [
  { label: 'Mon', value: 2.5 },
  { label: 'Tue', value: 4.0 },
  { label: 'Wed', value: 3.2 },
  { label: 'Thu', value: 5.5 },
  { label: 'Fri', value: 4.8 },
  { label: 'Sat', value: 6.0 },
  { label: 'Sun', value: 3.5 }
];

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  title = 'Weekly Study Activity',
  subtitle = 'Hours spent learning key concepts',
  type = 'bar',
  data = DEFAULT_DATA,
  color = 'var(--color-primary)'
}) => {
  const maxVal = useMemo(() => {
    const vals = data.map(d => d.value);
    return Math.max(...vals, 1);
  }, [data]);

  const width = 500;
  const height = 180;
  const padding = 20;

  // Calculate coordinates for SVG Line chart
  const linePoints = useMemo(() => {
    if (type !== 'line') return '';
    const step = (width - padding * 2) / (data.length - 1);
    return data.map((d, i) => {
      const x = padding + i * step;
      const y = height - padding - (d.value / maxVal) * (height - padding * 2);
      return `${x},${y}`;
    }).join(' L ');
  }, [data, type, maxVal, width, height, padding]);

  return (
    <div className="premiumCard" style={{ height: '100%', minHeight: '340px', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h3 className="text-subheading">{title}</h3>
          <p className="text-caption" style={{ marginTop: '2px' }}>{subtitle}</p>
        </div>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, rgba(88, 80, 236, 0.1), rgba(126, 58, 242, 0.05))',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-primary)'
        }}>
          {title.toLowerCase().includes('hour') ? <Clock size={18} /> : <BarChart3 size={18} />}
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative', width: '100%', minHeight: '140px', display: 'flex', alignItems: 'flex-end' }}>
        {type === 'bar' ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', height: '100%', paddingBottom: '16px' }}>
            {data.map((d, i) => {
              const barHeightPercent = (d.value / maxVal) * 100;
              return (
                <div key={d.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '8px' }}>
                  <div style={{ width: '100%', height: '120px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', position: 'relative' }}>
                    <motion.div
                      style={{
                        width: '28%',
                        minWidth: '10px',
                        background: `linear-gradient(180deg, ${color}, rgba(88, 80, 236, 0.15))`,
                        borderRadius: '6px 6px 0 0',
                        boxShadow: `0 0 10px rgba(88, 80, 236, 0.15)`
                      }}
                      initial={{ height: 0 }}
                      animate={{ height: `${barHeightPercent}%` }}
                      transition={{ duration: 0.8, delay: i * 0.05, ease: 'easeOut' }}
                    />
                  </div>
                  <span className="text-caption" style={{ fontSize: '0.7rem', fontWeight: 650 }}>{d.label}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ width: '100%', height: '100%', paddingBottom: '16px' }}>
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.00"/>
                </linearGradient>
              </defs>
              
              {/* Grid lines */}
              <line x1={padding} y1={height/2} x2={width-padding} y2={height/2} stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4" />
              <line x1={padding} y1={height - padding} x2={width-padding} y2={height - padding} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

              {/* Area path */}
              {linePoints && (
                <motion.path
                  d={`M ${padding},${height-padding} L ${linePoints} L ${width-padding},${height-padding} Z`}
                  fill="url(#chartGrad)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                />
              )}

              {/* Line path */}
              {linePoints && (
                <motion.path
                  d={`M ${linePoints}`}
                  fill="none"
                  stroke={color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.0, ease: 'easeInOut' }}
                />
              )}
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '8px', padding: `0 ${padding}px` }}>
              {data.map(d => (
                <span key={d.label} className="text-caption" style={{ fontSize: '0.7rem' }}>{d.label}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.04)', paddingTop: '16px', marginTop: '12px' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color }} />
            <span className="text-caption" style={{ fontSize: '0.7rem' }}>Study Hours</span>
          </div>
        </div>
        <span className="text-caption" style={{ fontWeight: 600, color: 'var(--color-accent)' }}>
          On Track +15%
        </span>
      </div>
    </div>
  );
};
