import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  ExternalLink,
  FileText,
  Shield,
  Layers,
  DollarSign,
  Rocket,
  Compass,
} from 'lucide-react';
import styles from './FounderResources.module.css';

interface IFounderResourceItem {
  id: string;
  title: string;
  category: 'Pitch & Decks' | 'Legal & SAFE' | 'Customer Discovery' | 'Funding & Grants' | 'Product & MVP';
  format: 'Template' | 'Framework' | 'Guide' | 'Legal Document';
  description: string;
  sourceName: string;
  url: string;
  iconType: 'deck' | 'legal' | 'discovery' | 'funding' | 'mvp';
}

const FOUNDER_RESOURCES: IFounderResourceItem[] = [
  {
    id: 'res-1',
    title: 'Y Combinator Standard Pitch Deck Guide',
    category: 'Pitch & Decks',
    format: 'Guide',
    description: 'Official Y Combinator framework for building concise, high-impact seed pitch presentations.',
    sourceName: 'Y Combinator Library',
    url: 'https://www.ycombinator.com/library/2u-how-to-build-a-better-pitch-deck',
    iconType: 'deck',
  },
  {
    id: 'res-2',
    title: 'Lean Canvas One-Page Business Blueprint',
    category: 'Pitch & Decks',
    format: 'Template',
    description: 'Fast, actionable 1-page business modeling template designed for rapid early-stage venture validation.',
    sourceName: 'Leanstack / Ash Maurya',
    url: 'https://leanstack.com/lean-canvas',
    iconType: 'deck',
  },
  {
    id: 'res-3',
    title: 'Y Combinator Standard SAFE Agreement',
    category: 'Legal & SAFE',
    format: 'Legal Document',
    description: 'Industry-standard Simple Agreement for Future Equity (Post-Money SAFE) templates for early investments.',
    sourceName: 'Y Combinator Legal',
    url: 'https://www.ycombinator.com/documents',
    iconType: 'legal',
  },
  {
    id: 'res-4',
    title: 'The Mom Test Customer Interview Guide',
    category: 'Customer Discovery',
    format: 'Framework',
    description: 'Practical methodology for talking to potential customers and extracting unbiased problem validation.',
    sourceName: 'The Mom Test',
    url: 'http://momtestbook.com/',
    iconType: 'discovery',
  },
  {
    id: 'res-5',
    title: 'Sequoia Capital Business Plan Blueprint',
    category: 'Pitch & Decks',
    format: 'Framework',
    description: 'Sequoia framework on defining the company purpose, problem, market size, and unit economics.',
    sourceName: 'Sequoia Capital',
    url: 'https://www.sequoiacap.com/article/writing-a-business-plan/',
    iconType: 'deck',
  },
  {
    id: 'res-6',
    title: 'Stripe Atlas Early-Stage Founder Guides',
    category: 'Legal & SAFE',
    format: 'Guide',
    description: 'Comprehensive guides covering equity splits, incorporation structures, bank accounts, and early tax hygiene.',
    sourceName: 'Stripe Atlas',
    url: 'https://stripe.com/atlas/guides',
    iconType: 'legal',
  },
  {
    id: 'res-7',
    title: 'First Round Review Product-Market Fit Engine',
    category: 'Product & MVP',
    format: 'Framework',
    description: 'Superhuman PMF engine for measuring customer feedback quantitatively and directing feature development.',
    sourceName: 'First Round Review',
    url: 'https://review.firstround.com/how-superhuman-built-an-engine-to-find-product-market-fit',
    iconType: 'mvp',
  },
  {
    id: 'res-8',
    title: 'Open Source Startup Playbook',
    category: 'Product & MVP',
    format: 'Guide',
    description: 'Strategies for commercializing developer tools, managing community contributions, and building SaaS moats.',
    sourceName: 'OSS Capital',
    url: 'https://oss.capital/',
    iconType: 'mvp',
  },
];

const CATEGORIES = [
  'All Toolkits',
  'Pitch & Decks',
  'Legal & SAFE',
  'Customer Discovery',
  'Funding & Grants',
  'Product & MVP',
];

export const FounderResources: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Toolkits');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredResources = FOUNDER_RESOURCES.filter((res) => {
    const matchesCategory =
      selectedCategory === 'All Toolkits' || res.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim().length === 0 ||
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.sourceName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'deck':
        return <FileText size={18} style={{ color: '#818cf8' }} />;
      case 'legal':
        return <Shield size={18} style={{ color: '#60a5fa' }} />;
      case 'discovery':
        return <Compass size={18} style={{ color: '#fbbf24' }} />;
      case 'funding':
        return <DollarSign size={18} style={{ color: '#34d399' }} />;
      case 'mvp':
        return <Layers size={18} style={{ color: '#c084fc' }} />;
      default:
        return <BookOpen size={18} style={{ color: '#10b981' }} />;
    }
  };

  return (
    <div className={styles.container}>
      {/* 1. Header Banner */}
      <div className={styles.headerBanner}>
        <h2 className={styles.title}>
          <Rocket size={22} style={{ color: '#34d399' }} /> Founder Toolkits & Resource Vault
        </h2>
        <p className={styles.subtitle}>
          Curated frameworks, legal starter templates, pitch methodologies, and customer validation tools to help you take
          your venture from concept to execution.
        </p>
      </div>

      {/* 2. Toolbar & Category Chips */}
      <div className={styles.toolbar}>
        <div className={styles.categoryChips}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`${styles.categoryChip} ${selectedCategory === cat ? styles.categoryChipActive : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: '240px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search toolkits..."
            style={{
              width: '100%',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              padding: '7px 12px 7px 34px',
              color: '#f3f4f6',
              fontSize: '0.84rem',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* 3. Resources Grid */}
      {filteredResources.length === 0 ? (
        <div
          style={{
            background: 'var(--bg-card, rgba(30, 41, 59, 0.7))',
            border: '1px solid var(--border-card, rgba(255, 255, 255, 0.08))',
            borderRadius: '16px',
            padding: '48px 24px',
            textAlign: 'center',
            backdropFilter: 'blur(12px)',
            maxWidth: '640px',
            margin: '20px auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <BookOpen size={36} style={{ color: '#818cf8' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f3f4f6', margin: 0 }}>
            No founder resources match your query
          </h3>
          <p style={{ fontSize: '0.86rem', color: '#9ca3af', margin: 0 }}>
            Try resetting your search query or choosing another category filter.
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredResources.map((res) => (
            <div key={res.id} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.cardMeta}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {getIcon(res.iconType)}
                    <span style={{ fontSize: '0.76rem', color: '#9ca3af', fontWeight: 600 }}>{res.category}</span>
                  </div>
                  <span className={styles.typeBadge}>{res.format}</span>
                </div>

                <h3 className={styles.cardTitle}>{res.title}</h3>
                <p className={styles.cardDesc}>{res.description}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '0.76rem', color: '#9ca3af' }}>
                  Source: <strong style={{ color: '#d1d5db' }}>{res.sourceName}</strong>
                </div>

                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.openLinkBtn}
                >
                  <span>Access Resource</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
