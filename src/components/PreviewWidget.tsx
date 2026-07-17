import { useState, useEffect } from 'react';
import { Zap, Target, BookOpen, ChevronRight, Award, Loader2, Clock } from 'lucide-react';
import styles from './PreviewWidget.module.css';

interface Milestone {
  title: string;
  duration: string;
  description: string;
  skills: string[];
}

interface DashboardCareerPath {
  id: string;
  title: string;
  salary: string;
  growthRate: string;
  matchScore: number;
  description: string;
  milestones: Milestone[];
  skillsProgress: { name: string; value: number }[];
  aiAssistantMessages: string[];
  scholarship: { name: string; amount: string; deadline: string };
}

const DASHBOARD_CAREERS: DashboardCareerPath[] = [
  {
    id: 'ai-eng',
    title: 'AI & Machine Learning Engineer',
    salary: '$145,000/yr',
    growthRate: '+35% Growth',
    matchScore: 98,
    description: 'Design and deploy deep learning models, tune LLMs, and architect neural pipelines.',
    milestones: [
      {
        title: 'Phase 1: Foundations of ML',
        duration: 'Month 1 - 3',
        description: 'Master Python libraries, exploratory data analysis, and relational database queries.',
        skills: ['Python', 'NumPy & Pandas', 'Linear Algebra', 'SQL']
      },
      {
        title: 'Phase 2: Deep Learning & Transformers',
        duration: 'Month 4 - 6',
        description: 'Build and train neural network configurations and transformers for NLP & CV.',
        skills: ['PyTorch', 'TensorFlow', 'Model Optimization', 'Hugging Face']
      },
      {
        title: 'Phase 3: LLMs & Production MLOps',
        duration: 'Month 7 - 9',
        description: 'Deploy foundation model endpoints, configure vector indexing, and pipeline automation.',
        skills: ['LangChain', 'Vector Databases', 'Docker & AWS', 'MLOps']
      }
    ],
    skillsProgress: [
      { name: 'Python & Dataframes', value: 85 },
      { name: 'Neural Network Architectures', value: 65 },
      { name: 'Vector Database Indexing', value: 40 }
    ],
    aiAssistantMessages: [
      "Your Python foundations are solid. I recommend moving to Phase 2: PyTorch and neural network training next.",
      "Good progress on model training. Prioritize transformer self-attention mechanisms to unlock the final LLM track.",
      "You have reached the deployment phase. Try building an agent pipeline using LangChain connected to a vector store."
    ],
    scholarship: {
      name: 'Google AI Research Fellowship',
      amount: '$15,000 Award',
      deadline: 'Apply by Aug 30'
    }
  },
  {
    id: 'ux-designer',
    title: 'Senior Product Designer (UX/UI)',
    salary: '$118,000/yr',
    growthRate: '+18% Growth',
    matchScore: 92,
    description: 'Design interactive web & mobile interfaces, construct component libraries, and direct research.',
    milestones: [
      {
        title: 'Phase 1: Visual Design & Systems',
        duration: 'Month 1 - 3',
        description: 'Master Figma auto-layout, typographic hierarchy, responsive grids, and design tokens.',
        skills: ['Figma Auto-Layout', 'Design Tokens', 'Typography', 'Prototyping']
      },
      {
        title: 'Phase 2: User Research & Wireframes',
        duration: 'Month 4 - 6',
        description: 'Conduct stakeholder user interviews, compose journey maps, and build wireframe skeletons.',
        skills: ['User Interviews', 'Journey Mapping', 'Information Architecture', 'Wireframes']
      },
      {
        title: 'Phase 3: Design Systems & Handoff',
        duration: 'Month 7 - 9',
        description: 'Construct multi-theme enterprise design component libraries and manage asset handoffs.',
        skills: ['Atomic Design', 'Figma Libraries', 'Usability Auditing', 'Dev Handoff']
      }
    ],
    skillsProgress: [
      { name: 'Figma Component Libraries', value: 90 },
      { name: 'User Experience Auditing', value: 75 },
      { name: 'Figma Auto-Layout Handoff', value: 50 }
    ],
    aiAssistantMessages: [
      "Your visual design score is strong. Build your atomic component library in Phase 1 before moving into research.",
      "Running user interviews? Transfer your findings into a Journey Map to complete your Phase 2 milestones.",
      "Ready for handoff? Make sure all styles reference Design Tokens in Figma before sharing with engineering."
    ],
    scholarship: {
      name: 'Figma Design Creator Grant',
      amount: '$8,000 Award',
      deadline: 'Apply by Sep 15'
    }
  },
  {
    id: 'growth-pm',
    title: 'Growth Product Manager',
    salary: '$132,000/yr',
    growthRate: '+22% Growth',
    matchScore: 88,
    description: 'Drive user acquisition campaigns, map retention analytics, and run product localization funnels.',
    milestones: [
      {
        title: 'Phase 1: Product Metrics & Analysis',
        duration: 'Month 1 - 3',
        description: 'Configure event tracking triggers, construct activation retention charts, and run SQL querying.',
        skills: ['SQL Databases', 'Mixpanel Triggers', 'A/B Test Design', 'Product Metrics']
      },
      {
        title: 'Phase 2: Funnel Growth Optimization',
        duration: 'Month 4 - 6',
        description: 'Map user onboarding flows, implement virality coefficients, and design conversion prompts.',
        skills: ['Onboarding Flow UX', 'Referral Loop Mechanics', 'Conversion Optimizing', 'UX Audit']
      },
      {
        title: 'Phase 3: Scaling & Monetization Hooks',
        duration: 'Month 7 - 9',
        description: 'Optimize subscription upgrade paywalls, localized billing structures, and growth loops.',
        skills: ['Monetization Models', 'Agile Team Sync', 'Roadmap Allocation', 'Market Expansion']
      }
    ],
    skillsProgress: [
      { name: 'Product Analytics (SQL / Mixpanel)', value: 75 },
      { name: 'Funnel Optimization Loops', value: 60 },
      { name: 'Subscription Monetization Hook', value: 40 }
    ],
    aiAssistantMessages: [
      "Start by setting up event tracking for key user actions. Mixpanel and SQL are your core analytics tools here.",
      "Your onboarding flow scores are improving. Focus on referral loop mechanics to push the virality coefficient above 1.0.",
      "Monetization review started. Run A/B tests on your pricing page to identify the highest-converting plan structure."
    ],
    scholarship: {
      name: 'Product School Leadership Grant',
      amount: '$5,000 Award',
      deadline: 'Apply by Oct 01'
    }
  }
];

export const PreviewWidget = () => {
  const [selectedId, setSelectedId] = useState<string>('ai-eng');
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedCareer = DASHBOARD_CAREERS.find(c => c.id === selectedId) || DASHBOARD_CAREERS[0];

  const handleIdChange = (id: string) => {
    setIsGenerating(true);
    setSelectedId(id);
    setActivePhaseIndex(0);
  };

  useEffect(() => {
    if (isGenerating) {
      const timer = setTimeout(() => {
        setIsGenerating(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isGenerating]);

  return (
    <div className={`${styles.widgetContainer} glass-panel`}>
      {/* Dashboard Top Header Bar */}
      <div className={styles.dashboardHeader}>
        <div className={styles.dashLogo}>
          <div className={styles.dashLogoDot}></div>
          <span>Visionix Console</span>
        </div>
        <div className={styles.dashHeaderActions}>
          <div className={styles.userBadge}>
            <div className={styles.userAvatar}>JD</div>
            <span>John Doe &mdash; Student</span>
          </div>
        </div>
      </div>

      <div className={styles.layoutGrid}>
        {/* Sidebar Navigation Panel (Selector) */}
        <div className={styles.selectorCol}>
          <div className={styles.sidebarLabel}>Select a Career Track</div>
          {DASHBOARD_CAREERS.map((career) => (
            <button
              key={career.id}
              onClick={() => handleIdChange(career.id)}
              className={`${styles.selectCard} ${selectedId === career.id ? styles.activeCard : ''}`}
              aria-label={`Switch target dashboard preview to ${career.title}`}
            >
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>{career.title}</span>
                <ChevronRight size={16} className={styles.arrowIcon} />
              </div>
              <div className={styles.metaRow}>
                <span className={styles.cardSalary}>{career.salary}</span>
                <span className={styles.cardGrowth}>{career.growthRate}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Dashboard Work Area (Canvas) */}
        <div className={styles.canvasCol}>
          {isGenerating ? (
            <div className={styles.generatingOverlay}>
              <Loader2 className={styles.spinner} size={36} />
              <h4>Preparing your dashboard...</h4>
              <p>Analyzing your profile, mapping milestones, and loading AI recommendations.</p>
            </div>
          ) : (
            <div className={styles.dashboardContent}>
              {/* Dashboard Content Header Grid */}
              <div className={styles.canvasHeader}>
                <div className={styles.headerLeft}>
                  <div className={styles.badgeRow}>
                    <span className={styles.featuredBadge}>Active Profile</span>
                  </div>
                  <h4 className={styles.canvasTitle}>{selectedCareer.title}</h4>
                  <p className={styles.canvasDesc}>{selectedCareer.description}</p>
                </div>
                
                {/* AI Career Match Circular Widget */}
                <div className={styles.matchScoreCard}>
                  <div className={styles.scoreRadial}>
                    <svg viewBox="0 0 36 36" className={styles.circularChart}>
                      <path className={styles.circleBg}
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path className={styles.circle}
                        strokeDasharray={`${selectedCareer.matchScore}, 100`}
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className={styles.scoreText}>
                      <span className={styles.scorePct}>{selectedCareer.matchScore}%</span>
                      <span className={styles.scoreLbl}>Fit</span>
                    </div>
                  </div>
                  <span className={styles.matchLabel}>AI Career Match</span>
                </div>
              </div>

              {/* Main Dashboard Panel Layout Grid */}
              <div className={styles.dashboardGrid}>
                {/* Left Column: Roadmap Milestones Timeline */}
                <div className={`${styles.roadmapPanel} glass-panel`}>
                  <h5 className={styles.panelTitle}>
                    <Clock size={14} style={{ color: 'var(--color-primary)' }} />
                    <span>Career Roadmap</span>
                  </h5>
                  <div className={styles.roadmapBody}>
                    <div className={styles.timelineWrapper}>
                      {selectedCareer.milestones.map((milestone, idx) => (
                        <div
                          key={idx}
                          onClick={() => setActivePhaseIndex(idx)}
                          className={`${styles.timelineNode} ${idx <= activePhaseIndex ? styles.nodeCompleted : ''} ${idx === activePhaseIndex ? styles.nodeActive : ''}`}
                        >
                          <div className={styles.nodeCircle}>
                            {idx === 0 && <BookOpen size={12} />}
                            {idx === 1 && <Target size={12} />}
                            {idx === 2 && <Award size={12} />}
                          </div>
                          <div className={styles.nodeContent}>
                            <span className={styles.nodeTitle}>{milestone.title}</span>
                            <span className={styles.nodeDuration}>{milestone.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className={styles.phaseDetails} key={`${selectedId}-${activePhaseIndex}`}>
                      <div className={styles.phaseHeader}>
                        <Zap className={styles.phaseIcon} size={16} />
                        <h6>{selectedCareer.milestones[activePhaseIndex].title} Details</h6>
                      </div>
                      <p className={styles.phaseDesc}>{selectedCareer.milestones[activePhaseIndex].description}</p>
                      
                      <div className={styles.skillsWrapper}>
                        <span className={styles.skillsHeading}>Key Skills for This Phase:</span>
                        <div className={styles.skillsList}>
                          {selectedCareer.milestones[activePhaseIndex].skills.map((skill, sIdx) => (
                            <span key={sIdx} className={styles.skillBadge}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
