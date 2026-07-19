import type { DashboardData } from '../types/dashboard.types';
import { UserService } from './user.service';

// Seeded/Demo data for the student "Rahul"
const SEEDED_DASHBOARD_DATA: DashboardData = {
  stats: [
    {
      title: 'AI Career Match',
      value: '98%',
      trend: '↑ 2.4% match fit',
      trendPositive: true,
      subtext: 'Matching target skills progress',
      color: 'var(--color-primary)',
      sparklinePoints: [60, 72, 85, 90, 95, 98],
      hasProgress: true,
      progress: 98
    },
    {
      title: 'Current Progress',
      value: '24%',
      trend: '↑ 5% this week',
      trendPositive: true,
      subtext: 'Of total curriculum completed',
      color: 'var(--color-secondary)',
      sparklinePoints: [10, 15, 18, 20, 22, 24],
      hasProgress: true,
      progress: 24
    },
    {
      title: 'Skills Learned',
      value: '12 / 28',
      trend: '+2 new skills',
      trendPositive: true,
      subtext: 'Core domain skills verified',
      color: 'var(--color-accent)',
      sparklinePoints: [4, 6, 8, 9, 10, 12],
      hasProgress: true,
      progress: 42
    },
    {
      title: 'Certificates',
      value: '3 Earned',
      trend: '1 Pending review',
      trendPositive: true,
      subtext: 'Credentials verified on-chain',
      color: '#10b981',
      sparklinePoints: [1, 1, 2, 2, 3, 3],
      hasProgress: false,
      progress: 0
    }
  ],
  assistant: {
    messages: [
      {
        sender: 'ai',
        text: "Your Python foundations are solid. I recommend moving to Phase 2: PyTorch and neural network training next.",
        timestamp: new Date()
      }
    ],
    isOnline: true
  },
  careerRecommendation: {
    title: 'AI & Machine Learning Engineer',
    description: 'Design and deploy deep learning models, tune LLMs, and architect neural pipelines.',
    matchPercentage: 98,
    salaryRange: '$145,000/yr',
    difficulty: 'Intermediate',
    estimatedTime: '6 Months',
    expectedGrowth: '+35% Growth',
    learningProgress: 24,
    topSkills: ['Python', 'PyTorch', 'Linear Algebra']
  },
  roadmap: [
    {
      title: 'Phase 1: Foundations of ML',
      duration: 'Month 1 - 3',
      description: 'Master Python libraries, exploratory data analysis, and relational database queries.',
      skills: ['Python', 'NumPy & Pandas', 'Linear Algebra', 'SQL'],
      completed: true,
      status: 'completed'
    },
    {
      title: 'Phase 2: Deep Learning & Transformers',
      duration: 'Month 4 - 6',
      description: 'Build and train neural network configurations and transformers for NLP & CV.',
      skills: ['PyTorch', 'TensorFlow', 'Model Optimization', 'Hugging Face'],
      completed: false,
      status: 'active'
    },
    {
      title: 'Phase 3: LLMs & Production MLOps',
      duration: 'Month 7 - 9',
      description: 'Deploy foundation model endpoints, configure vector indexing, and pipeline automation.',
      skills: ['LangChain', 'Vector Databases', 'Docker & AWS', 'MLOps'],
      completed: false,
      status: 'locked'
    }
  ],
  learningResources: [
    {
      provider: 'Coursera',
      title: 'Deep Learning Specialization',
      duration: '4 Weeks',
      difficulty: 'Intermediate',
      rating: 4.9,
      continueUrl: 'https://coursera.org',
      categoryColor: 'linear-gradient(135deg, #1e40af, #3b82f6)'
    },
    {
      provider: 'Udemy',
      title: 'Python Core & Data Structures Masterclass',
      duration: '18 Hours',
      difficulty: 'Beginner',
      rating: 4.7,
      continueUrl: 'https://udemy.com',
      categoryColor: 'linear-gradient(135deg, #a21caf, #d946ef)'
    },
    {
      provider: 'roadmap.sh',
      title: 'AI & Machine Learning Roadmap Guide',
      duration: 'Self-paced',
      difficulty: 'Beginner',
      rating: 4.8,
      continueUrl: 'https://roadmap.sh',
      categoryColor: 'linear-gradient(135deg, #ea580c, #f97316)'
    }
  ],
  scholarships: [
    {
      name: 'Google AI Research Fellowship',
      provider: 'Google Research',
      amount: '$15,000 Award',
      deadline: 'Apply by Aug 30',
      eligibility: 'Graduate Students in CS/AI',
      link: 'https://research.google/outreach/fellowship/'
    },
    {
      name: 'Figma Design Creator Grant',
      provider: 'Figma Community',
      amount: '$8,000 Award',
      deadline: 'Apply by Sep 15',
      eligibility: 'Undergraduate Design Students',
      link: 'https://www.figma.com/grants/'
    }
  ],
  trendingCareers: [
    {
      title: 'Senior Product Designer',
      growth: '+18% Growth',
      matchScore: 92
    },
    {
      title: 'Growth Product Manager',
      growth: '+22% Growth',
      matchScore: 88
    }
  ]
};

export class DashboardService {
  /**
   * Fetches dashboard details. For development, seeds default user data.
   * In production, this can query database integrations dynamically.
   */
  public static async getDashboardData(userEmail: string): Promise<DashboardData> {
    // If the logged-in user is 'Rahul' or has a test email, return seeded data
    if (userEmail.toLowerCase().includes('rahul') || userEmail.toLowerCase().includes('test') || userEmail === 'rahul@example.com') {
      return Promise.resolve(SEEDED_DASHBOARD_DATA);
    }
    
    try {
      // Fetch user profile from MongoDB via API
      const profile = await UserService.getProfile();
      
      const dreamCareer = profile?.careerGoals?.dreamCareer || 'Software Engineer';
      const objectives = profile?.careerGoals?.careerObjectives || 'Build a solid foundation in software development, mastering core algorithms and database systems.';
      const techSkills = profile?.skills?.technicalSkills || [];
      const salaryGoal = profile?.careerGoals?.salaryGoal || '$95,000/yr';
      
      // Calculate dynamic Stats
      const skillsCount = techSkills.length;
      const skillsLearnedText = `${skillsCount} / 24`;
      const skillsProgressPercent = Math.min(Math.round((skillsCount / 24) * 100), 100);
      
      const stats = [
        {
          title: 'AI Career Match',
          value: '95%',
          trend: '↑ 1.8% match fit',
          trendPositive: true,
          subtext: 'Matching target skills progress',
          color: 'var(--color-primary)',
          sparklinePoints: [70, 75, 80, 85, 90, 95],
          hasProgress: true,
          progress: 95
        },
        {
          title: 'Current Progress',
          value: '10%',
          trend: '↑ 2% this week',
          trendPositive: true,
          subtext: 'Of total curriculum completed',
          color: 'var(--color-secondary)',
          sparklinePoints: [0, 2, 5, 8, 10],
          hasProgress: true,
          progress: 10
        },
        {
          title: 'Skills Learned',
          value: skillsLearnedText,
          trend: `+${skillsCount} verified`,
          trendPositive: true,
          subtext: 'Core domain skills verified',
          color: 'var(--color-accent)',
          sparklinePoints: [0, Math.round(skillsCount / 3), Math.round(skillsCount / 2), skillsCount],
          hasProgress: true,
          progress: skillsProgressPercent
        },
        {
          title: 'Certificates',
          value: '0 Earned',
          trend: '0 Pending review',
          trendPositive: false,
          subtext: 'Credentials verified on-chain',
          color: '#10b981',
          sparklinePoints: [0, 0, 0],
          hasProgress: false,
          progress: 0
        }
      ];

      // Dynamic AI Assistant message
      const firstName = profile?.personal?.fullName?.split(' ')[0] || 'Student';
      const assistant = {
        messages: [
          {
            sender: 'ai' as 'ai' | 'user',
            text: `Welcome to Visionix, ${firstName}! Based on your interest in ${dreamCareer}, I've initialized your personalized Career Roadmap. Let's start with foundational courses next.`,
            timestamp: new Date()
          }
        ],
        isOnline: true
      };

      const careerRecommendation = {
        title: dreamCareer,
        description: objectives,
        matchPercentage: 95,
        salaryRange: salaryGoal,
        difficulty: 'Beginner',
        estimatedTime: '6 Months',
        expectedGrowth: '+28% Growth',
        learningProgress: 10,
        topSkills: techSkills.slice(0, 3)
      };

      // Dynamic Career Roadmap
      const roadmap = [
        {
          title: `Phase 1: Foundations of ${dreamCareer}`,
          duration: 'Month 1 - 2',
          description: 'Establish critical baseline competencies, language setups, and core toolchains.',
          skills: techSkills.slice(0, 2).concat(['Git', 'Foundations']),
          completed: false,
          status: 'active' as const
        },
        {
          title: `Phase 2: Core Engineering & Tech Stack`,
          duration: 'Month 3 - 4',
          description: 'Develop comprehensive project architectures using primary library frameworks.',
          skills: techSkills.slice(2, 5).concat(['Frameworks', 'APIs']),
          completed: false,
          status: 'locked' as const
        },
        {
          title: `Phase 3: Deployment & Domain Expertise`,
          duration: 'Month 5 - 6',
          description: 'Package, deploy, and scale robust real-world production configurations.',
          skills: techSkills.slice(5).concat(['Deployments', 'Security']),
          completed: false,
          status: 'locked' as const
        }
      ];

      // Dynamic learning resources (fallbacks)
      const learningResources = [
        {
          provider: 'Visionix Academy',
          title: `Introductory curriculum for ${dreamCareer}`,
          duration: '2 Weeks',
          difficulty: 'Beginner',
          rating: 4.8,
          continueUrl: 'https://roadmap.sh',
          categoryColor: 'linear-gradient(135deg, #1e40af, #3b82f6)'
        }
      ];

      const scholarships = [
        {
          name: `${dreamCareer} Future Leaders Fellowship`,
          provider: 'Visionix Grant Foundation',
          amount: '$5,000 Award',
          deadline: 'Apply by Sep 30',
          eligibility: 'New Platform Enrollees',
          link: 'https://research.google/outreach/fellowship/'
        }
      ];

      const trendingCareers = [
        {
          title: dreamCareer,
          growth: '+28% Growth',
          matchScore: 95
        }
      ];

      return {
        stats,
        assistant,
        careerRecommendation,
        roadmap,
        learningResources,
        scholarships,
        trendingCareers
      };
    } catch (err) {
      console.error('Error fetching dynamic profile for dashboard:', err);
      return SEEDED_DASHBOARD_DATA;
    }
  }
}
