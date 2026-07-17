import { useState } from 'react';
import { 
  Sparkles, ArrowRight, Play, Users, Send, GraduationCap, Smile, 
  Brain, Map, Target, Award, UserPlus, CheckSquare, Rocket, 
  Code, Palette, Briefcase, 
  MessageSquare, Star, ArrowUpRight, ShieldCheck,
  Compass, FileText, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PreviewWidget } from '../components/PreviewWidget';
import heroAiStudent from '../assets/images/hero/hero-ai-student.jpg';
import styles from './LandingPage.module.css';

// Features overview data matching requirements
const FEATURES_DATA = [
  { title: 'AI Assistant', desc: 'Get real-time career guidance, skill gap analysis, and industry insight — available 24/7, always personalized to you.', icon: <MessageSquare size={24} /> },
  { title: 'Career Explorer', desc: 'Browse salaries, growth projections, and role requirements across thousands of in-demand professions.', icon: <Compass size={24} /> },
  { title: 'Career Match', desc: 'See how your skills and experience align with live job market expectations and find your strongest fit.', icon: <Briefcase size={24} /> },
  { title: 'Career Roadmap', desc: 'Follow a structured, milestone-driven learning plan built around your target role and timeline.', icon: <Map size={24} /> },
  { title: 'Learning Hub', desc: 'Access curated course recommendations and free resources aligned to exactly the skills your target role requires.', icon: <GraduationCap size={24} /> },
  { title: 'Resume Builder', desc: 'Build, optimize, and score your resume against real job descriptions with AI-powered analysis.', icon: <FileText size={24} /> },
  { title: 'Interview Prep', desc: 'Practice technical and behavioral interviews with simulated sessions and instant AI feedback.', icon: <Target size={24} /> },
  { title: 'Scholarships', desc: 'Discover funding opportunities matched to your background, field of study, and location.', icon: <Award size={24} /> }
];

// Careers trending data matching featured career schema
const FEATURED_CAREERS = [
  { 
    title: 'AI & Machine Learning Engineer', 
    desc: 'Design intelligent systems, fine-tune large language models, and bring production-grade ML pipelines to scale.',
    salary: '$145,000/yr', 
    growth: '+35%', 
    demand: 'Very High',
    match: '98% Match',
    category: 'Technology',
    icon: <Code size={22} />
  },
  { 
    title: 'Senior UX/UI Product Designer', 
    desc: 'Build scalable design systems, lead user research, and shape interfaces that millions of people use daily.',
    salary: '$118,000/yr', 
    growth: '+18%', 
    demand: 'High',
    match: '92% Match',
    category: 'Design',
    icon: <Palette size={22} />
  },
  { 
    title: 'Growth Product Manager', 
    desc: 'Own the full product growth cycle — from acquisition and activation to retention and revenue optimization.',
    salary: '$132,000/yr', 
    growth: '+22%', 
    demand: 'High',
    match: '88% Match',
    category: 'Business',
    icon: <Briefcase size={22} />
  }
];

// Workflow steps matching requirements
const WORKFLOW_STEPS = [
  { num: '01', title: 'Create Your Account', desc: 'Sign up, set your target industries, and tell us about your background and learning goals.', icon: <UserPlus size={24} />, color: '#3b82f6' },
  { num: '02', title: 'Complete AI Assessment', desc: 'Take our adaptive skills assessment covering technical aptitude, reasoning, and domain knowledge.', icon: <CheckSquare size={24} />, color: '#8b5cf6' },
  { num: '03', title: 'Get Career Recommendations', desc: 'Your AI profile is matched against live job market data to surface the roles where you have the highest potential.', icon: <Sparkles size={24} />, color: '#ec4899' },
  { num: '04', title: 'Follow Your Career Roadmap', desc: 'Execute your personalized milestone plan, sharpen interview skills, and track your progress to your target role.', icon: <Rocket size={24} />, color: '#10b981' }
];

// Testimonials replaced by Success Stories
const SUCCESS_STORIES = [
  {
    name: 'Aria Montgomery',
    role: 'UX Researcher at Stripe',
    avatar: 'AM',
    avatarBg: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
    story: 'Visionix built me a six-month transition plan that aligned with exactly what tech companies were hiring for. I moved from general marketing into UX Research at Stripe in under half a year.',
    rating: 5
  },
  {
    name: 'Kunal Patel',
    role: 'DevOps Engineer at Cloudflare',
    avatar: 'KP',
    avatarBg: 'linear-gradient(135deg, #3b82f6, #10b981)',
    story: 'I had no idea which cloud certifications actually mattered. Visionix analyzed my background, built a focused DevOps learning track, and I accepted an offer at Cloudflare three months later.',
    rating: 5
  }
];

export const LandingPage = () => {
  const navigate = useNavigate();
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);


  return (
    <div className={styles.page}>
      {/* Drifting Ambient Background Elements */}
      <div className="ambient-bg"></div>
      <div className="glow-accent-primary" style={{ top: '15%', left: '10%', width: '450px', height: '450px' }}></div>
      <div className="glow-accent-secondary" style={{ top: '50%', right: '5%', width: '500px', height: '500px' }}></div>

      {/* HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            
            {/* Hero Left Content */}
            <div className={`${styles.heroLeft} animate-slide-up`}>
              <div className={styles.announcementBadge}>
                <Sparkles size={13} className={styles.sparkleIcon} />
                <span>AI-Powered Career Platform</span>
              </div>
              
              <h1 className={styles.heroTitle}>
                AI-Powered Career Guidance <br />
                For Your <br />
                <span className={styles.purpleGradientText}>Bright Future</span>
              </h1>
              
              <p className={styles.heroDesc}>
                Explore in-demand careers, build the skills employers value, and follow a personalized Career Roadmap — powered by AI built around your ambitions.
              </p>
              
              <div className={styles.heroActions}>
                <button 
                  className="btn btn-primary" 
                  aria-label="Start Your Journey"
                  onClick={() => navigate('/signup')}
                >
                  <span>Start Your Journey</span>
                  <ArrowRight size={16} />
                </button>
                
                <button 
                  className="btn btn-secondary" 
                  aria-label="Watch Demo Video"
                  onClick={() => setIsDemoModalOpen(true)}
                >
                  <div className={styles.playIconWrapper}>
                    <Play size={14} fill="currentColor" />
                  </div>
                  <span>Watch Demo</span>
                </button>
              </div>

              {/* Social Proof Avatar Stack */}
              <div className={styles.socialProof}>
                <div className={styles.avatarStack}>
                  <div className={`${styles.proofAvatar} ${styles.av1}`}>JS</div>
                  <div className={`${styles.proofAvatar} ${styles.av2}`}>RL</div>
                  <div className={`${styles.proofAvatar} ${styles.av3}`}>AK</div>
                  <div className={`${styles.proofAvatar} ${styles.av4}`}>MD</div>
                  <div className={`${styles.proofAvatar} ${styles.av5}`}>SL</div>
                </div>
                <div className={styles.proofBadge}>50K+</div>
                <p className={styles.proofText}>
                  Students already building their careers with Visionix
                </p>
              </div>
            </div>

            {/* Hero Right Visual Column - New AI Student Illustration with Floating Widgets */}
            <div className={styles.heroRight}>
              <div className={styles.heroIllustrationContainer}>
                <div className={styles.heroImageWrapper}>
                  <img 
                    src={heroAiStudent} 
                    alt="Visionix AI student looking at interactive holographic learning milestones panel" 
                    className={styles.heroImage}
                    loading="eager"
                  />
                  <div className={styles.heroImageOverlay} />
                </div>
                
                {/* Floating Widgets inspired by Dashboard */}
                {/* Widget 1: AI Match Badge */}
                <div className={`${styles.floatingWidget} ${styles.widgetAiMatch}`}>
                  <div className={styles.matchCircle}>
                    <Sparkles size={12} className={styles.matchIcon} />
                    <span>98% Match</span>
                  </div>
                </div>

                {/* Widget 2: Roadmap Progress Card */}
                <div className={`${styles.floatingWidget} ${styles.widgetMiniRoadmap} glass-panel`}>
                  <div className={styles.widgetHeader}>
                    <Map size={12} style={{ color: 'var(--color-primary)' }} />
                    <span className={styles.widgetTitle}>Active Roadmap</span>
                  </div>
                  <div className={styles.widgetBody}>
                    <div className={styles.roadmapLine}>
                      <div className={`${styles.roadmapNode} ${styles.completed}`}></div>
                      <div className={`${styles.roadmapNode} ${styles.active}`}></div>
                      <div className={styles.roadmapNode}></div>
                    </div>
                    <span className={styles.roadmapStatus}>Phase 2: Deep Learning & NLP</span>
                  </div>
                </div>

                {/* Widget 3: Resume Score Card */}
                <div className={`${styles.floatingWidget} ${styles.widgetResumeScore} glass-panel`}>
                  <div className={styles.widgetHeader}>
                    <CheckSquare size={12} style={{ color: 'var(--color-accent)' }} />
                    <span className={styles.widgetTitle}>Resume Score</span>
                  </div>
                  <div className={styles.widgetScoreVal}>
                    <span className={styles.scoreNumber}>92</span>
                    <span className={styles.scoreMax}>/100</span>
                  </div>
                </div>

                {/* Widget 4: Learning Progress Widget */}
                <div className={`${styles.floatingWidget} ${styles.widgetLearningProgress} glass-panel`}>
                  <div className={styles.widgetHeader}>
                    <GraduationCap size={12} style={{ color: 'var(--color-secondary)' }} />
                    <span className={styles.widgetTitle}>Python Mastery</span>
                  </div>
                  <div className={styles.widgetProgressRow}>
                    <div className={styles.widgetProgressBar}>
                      <div className={styles.widgetProgressFill} style={{ width: '85%' }} />
                    </div>
                    <span className={styles.widgetProgressText}>85%</span>
                  </div>
                </div>

                {/* Widget 5: AI Assistant Bubble */}
                <div className={`${styles.floatingWidget} ${styles.widgetAiAssistant}`}>
                  <div className={styles.assistantAvatar}>AI</div>
                  <div className={styles.assistantBubble}>
                    <p>Start with Python and SQL — they unlock everything else.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* HERO QUICK FEATURES ROW */}
          <div className={styles.quickFeaturesRow}>
            <div className={`${styles.quickCard} glass-panel`}>
              <div className={styles.quickIconWrapper} style={{ color: '#a855f7' }}>
                <Brain size={20} />
              </div>
              <div className={styles.quickCardContent}>
                <h4>AI Career Guidance</h4>
                <p>Tailored recommendations based on your skills and goals.</p>
              </div>
            </div>
            
            <div className={`${styles.quickCard} glass-panel`}>
              <div className={styles.quickIconWrapper} style={{ color: '#ec4899' }}>
                <Map size={20} />
              </div>
              <div className={styles.quickCardContent}>
                <h4>Career Roadmaps</h4>
                <p>Milestone-driven plans built around your target role.</p>
              </div>
            </div>
            
            <div className={`${styles.quickCard} glass-panel`}>
              <div className={styles.quickIconWrapper} style={{ color: '#6366f1' }}>
                <Target size={20} />
              </div>
              <div className={styles.quickCardContent}>
                <h4>Interview Prep</h4>
                <p>Practice real interview formats with instant AI feedback.</p>
              </div>
            </div>
            
            <div className={`${styles.quickCard} glass-panel`}>
              <div className={styles.quickIconWrapper} style={{ color: '#14b8a6' }}>
                <Award size={20} />
              </div>
              <div className={styles.quickCardContent}>
                <h4>Certifications</h4>
                <p>Curated courses and credentials that move your career forward.</p>
              </div>
            </div>
          </div>

          {/* HERO STATISTICS BAR */}
          <div className={`${styles.statsContainer} glass-panel`}>
            <div className={styles.statNode}>
              <Users size={22} className={styles.statIcon} />
              <div className={styles.statInfo}>
                <span className={styles.statVal}>50K+</span>
                <span className={styles.statSub}>Students Guided</span>
              </div>
            </div>
            
            <div className={styles.statNode}>
              <Send size={22} className={styles.statIcon} />
              <div className={styles.statInfo}>
                <span className={styles.statVal}>1,500+</span>
                <span className={styles.statSub}>Career Paths</span>
              </div>
            </div>
            
            <div className={styles.statNode}>
              <GraduationCap size={22} className={styles.statIcon} />
              <div className={styles.statInfo}>
                <span className={styles.statVal}>10K+</span>
                <span className={styles.statSub}>Institutions & Exams</span>
              </div>
            </div>
            
            <div className={styles.statNode}>
              <Smile size={22} className={styles.statIcon} />
              <div className={styles.statInfo}>
                <span className={styles.statVal}>95%</span>
                <span className={styles.statSub}>Satisfaction Rate</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className={styles.sectionPadding}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Everything You Need to Succeed</h2>
            <p className={styles.sectionSubtitle}>A complete set of AI-powered tools designed to take you from exploration to employment.</p>
          </div>

          <div className={styles.featuresGrid}>
            {FEATURES_DATA.map((feat, idx) => (
              <div key={idx} className={`${styles.featureCard} glass-panel`}>
                <div className={styles.featureIconWrapper}>
                  {feat.icon}
                </div>
                <h3>{feat.title}</h3>
                <p>{feat.desc}</p>
                <button 
                  className={styles.learnMoreBtn}
                  onClick={() => alert('This feature is on the Visionix roadmap and coming soon!')}
                  aria-label={`Learn more about ${feat.title}`}
                >
                  <span>Learn More</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAREERS SECTION */}
      <section id="careers" className={styles.sectionPadding}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Explore High-Growth Careers</h2>
            <p className={styles.sectionSubtitle}>Browse in-demand roles with live salary data, market growth rates, and your AI-calculated fit score.</p>
          </div>

          <div className={styles.careersGrid}>
            {FEATURED_CAREERS.map((career, index) => (
              <div key={index} className={`${styles.careerCard} glass-panel`}>
                <div className={styles.careerCardHeader}>
                  <div className={styles.careerIconCircle}>
                    {career.icon}
                  </div>
                  <span className={styles.careerMatchBadge}>{career.match}</span>
                </div>
                <h3 className={styles.careerTitle}>{career.title}</h3>
                <p className={styles.careerCardDesc}>{career.desc}</p>
                
                <div className={styles.careerMeta}>
                  <div className={styles.careerMetaItem}>
                    <span className={styles.metaLabel}>Avg. Salary</span>
                    <span className={styles.metaVal}>{career.salary}</span>
                  </div>
                  <div className={styles.careerMetaItem}>
                    <span className={styles.metaLabel}>Growth Rate</span>
                    <span className={styles.metaValHighlight}>{career.growth}</span>
                  </div>
                  <div className={styles.careerMetaItem}>
                    <span className={styles.metaLabel}>Demand</span>
                    <span className={styles.metaValDemand}>{career.demand}</span>
                  </div>
                </div>
                
                <div className={styles.careerDivider}></div>
                
                <button 
                  className={styles.exploreCareerBtn}
                  onClick={() => alert(`Full Career Explorer for ${career.title} is coming soon!`)}
                  aria-label={`Explore the ${career.title} career path`}
                >
                  <span>View Career Path</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="workflow" className={styles.sectionPadding}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>How It Works</h2>
            <p className={styles.sectionSubtitle}>Four clear steps from signing up to landing the role you are aiming for.</p>
          </div>

          <div className={styles.workflowGrid}>
            {WORKFLOW_STEPS.map((step, idx) => (
              <div key={idx} className={`${styles.workflowStep} glass-panel`}>
                <div className={styles.stepNum}>{step.num}</div>
                <div className={styles.stepIconWrapper} style={{ color: step.color }}>
                  {step.icon}
                </div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU'LL LEARN SECTION */}
      <section id="what-you-learn" className={styles.sectionPadding}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>What You'll Learn</h2>
            <p className={styles.sectionSubtitle}>Develop the technical skills, career fundamentals, and industry awareness employers are actively looking for.</p>
          </div>

          <div className={styles.skillsCategoriesGrid}>
            {/* Column 1: Technical Skills */}
            <div className={`${styles.skillsCategoryCard} glass-panel`}>
              <div className={styles.skillsCategoryHeader}>
                <Code className={styles.categoryHeaderIcon} size={20} style={{ color: 'var(--color-primary)' }} />
                <h3>Technical Skills</h3>
              </div>
              <div className={styles.skillsList}>
                {['Python & Data Analysis', 'Java & OOP', 'SQL & Databases', 'Machine Learning'].map((item, idx) => (
                  <div key={idx} className={styles.skillBullet}>
                    <div className={styles.bulletCheck} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Career Skills */}
            <div className={`${styles.skillsCategoryCard} glass-panel`}>
              <div className={styles.skillsCategoryHeader}>
                <Target className={styles.categoryHeaderIcon} size={20} style={{ color: 'var(--color-secondary)' }} />
                <h3>Career Skills</h3>
              </div>
              <div className={styles.skillsList}>
                {['Resume Building & Scoring', 'Interview Preparation', 'Professional Communication', 'Structured Problem Solving'].map((item, idx) => (
                  <div key={idx} className={styles.skillBullet}>
                    <div className={styles.bulletCheck} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Industry Readiness */}
            <div className={`${styles.skillsCategoryCard} glass-panel`}>
              <div className={styles.skillsCategoryHeader}>
                <Award className={styles.categoryHeaderIcon} size={20} style={{ color: 'var(--color-accent)' }} />
                <h3>Industry Readiness</h3>
              </div>
              <div className={styles.skillsList}>
                {['Certifications & Credentials', 'Scholarship Discovery', 'Strategic Career Planning', 'Portfolio Building'].map((item, idx) => (
                  <div key={idx} className={styles.skillBullet}>
                    <div className={styles.bulletCheck} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW SECTION */}
      <section id="dashboard-preview" className={styles.sectionPadding}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>See Your Dashboard in Action</h2>
            <p className={styles.sectionSubtitle}>Explore a live preview of the Career Dashboard — select a career track, follow your Career Roadmap, and see your AI-calculated match score in real time.</p>
          </div>
          <PreviewWidget />
        </div>
      </section>

      {/* SUCCESS STORIES SECTION */}
      <section id="success-stories" className={styles.sectionPadding}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Student Success Stories</h2>
            <p className={styles.sectionSubtitle}>Real students. Real career transitions. Here is what they achieved with Visionix.</p>
          </div>

          <div className={styles.successGrid}>
            {SUCCESS_STORIES.map((story, index) => (
              <div key={index} className={`${styles.successCard} glass-panel`}>
                <div className={styles.ratingRow}>
                  {[...Array(story.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />
                  ))}
                </div>
                <p className={styles.quoteText}>
                  "{story.story}"
                </p>
                <div className={styles.userInfo}>
                  <div className={styles.userAvatar} style={{ background: story.avatarBg }}>
                    {story.avatar}
                  </div>
                  <div>
                    <h4>{story.name}</h4>
                    <p>{story.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={`${styles.ctaBox} glass-panel`}>
            <div className={styles.ctaGlow}></div>
            <Sparkles className={styles.ctaIcon} size={44} />
            <h2 className={styles.ctaTitle}>Your Future Starts with the Right Career Path</h2>
            <p className={styles.ctaText}>
              Unlock your personalized Career Roadmap, AI-powered skill assessments, and Interview Prep — everything you need to move from student to professional.
            </p>
            <div className={styles.ctaActions}>
              <button 
                className="btn btn-primary" 
                aria-label="Start Your Journey"
                onClick={() => navigate('/signup')}
              >
                <span>Start Your Journey</span>
                <ArrowRight size={18} />
              </button>
              <button 
                className="btn btn-secondary" 
                aria-label="Watch Demo Video"
                onClick={() => setIsDemoModalOpen(true)}
              >
                Watch Demo
              </button>
            </div>
            <div className={styles.securityBadge}>
              <ShieldCheck size={14} />
              <span>Free to start • No credit card required • AI-powered from day one</span>
            </div>
          </div>
        </div>
      </section>

      {/* WATCH DEMO OVERLAY MODAL */}
      {isDemoModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsDemoModalOpen(false)}>
          <div className={`${styles.modalContent} glass-panel`} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModalBtn} onClick={() => setIsDemoModalOpen(false)} aria-label="Close Modal">
              <X size={20} />
            </button>
            <div className={styles.mockVideoPlayer}>
              <div className={styles.videoPlayButton}>
                <Play size={28} fill="currentColor" style={{ color: 'var(--color-primary)' }} />
              </div>
              <div className={styles.videoInfo}>
                <h4>Visionix Platform Walkthrough</h4>
                <p>See how Visionix builds your Career Roadmap and matches you to the right opportunities.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
