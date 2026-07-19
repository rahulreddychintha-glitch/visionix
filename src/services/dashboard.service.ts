import type { DashboardData } from '../types/dashboard.types';

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
      organization: 'Google Research',
      amount: '$15,000 Award',
      deadline: 'Apply by Aug 30',
      status: 'Apply by Aug 30'
    },
    {
      name: 'Figma Design Creator Grant',
      organization: 'Figma Community',
      amount: '$8,000 Award',
      deadline: 'Apply by Sep 15',
      status: 'Apply by Sep 15'
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
    
    // Fallback or future API call placeholder
    // return api.get<DashboardData>(`/dashboard/${userId}`).then(res => res.data);
    return Promise.resolve(SEEDED_DASHBOARD_DATA);
  }
}
