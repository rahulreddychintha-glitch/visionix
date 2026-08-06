export interface TaxonomyItem {
  id: string;
  label: string;
  category: string;
  icon: string;
  description: string;
  accentColor: string;
  keywords: string[];
}

export const OTHER_OPTION: TaxonomyItem = {
  id: 'other',
  label: 'Other (Specify)',
  category: 'General',
  icon: 'Plus',
  description: 'Add a custom entry',
  accentColor: '#8b5cf6',
  keywords: ['custom', 'other', 'specify', 'new']
};

export const getTaxonomyLabel = (dataset: TaxonomyItem[], value: string): string => {
  if (!value) return '';
  if (value.startsWith('Other: ')) return value;
  const item = dataset.find((d) => d.id === value || d.label.toLowerCase() === value.toLowerCase());
  return item ? item.label : value;
};

export const getTaxonomyId = (dataset: TaxonomyItem[], value: string): string => {
  if (!value) return '';
  if (value.startsWith('Other: ')) return value;
  const item = dataset.find((d) => d.id === value || d.label.toLowerCase() === value.toLowerCase());
  return item ? item.id : value.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
};

// ─── Status / Role Taxonomy ──────────────────────────────────────────────────
export const STUDENT_STATUSES: TaxonomyItem[] = [
  { id: 'school_student', label: 'School Student', category: 'Education', icon: 'BookOpen', description: 'K-12 & High School student', accentColor: '#3b82f6', keywords: ['school', 'k12', 'student', 'high school'] },
  { id: 'college_student', label: 'College Student', category: 'Education', icon: 'BookOpen', description: 'Junior or degree college student', accentColor: '#6366f1', keywords: ['college', 'student', 'degree'] },
  { id: 'university_student', label: 'University Student', category: 'Education', icon: 'GraduationCap', description: 'Undergraduate or postgraduate university student', accentColor: '#8b5cf6', keywords: ['university', 'student', 'master', 'phd'] },
  { id: 'fresh_graduate', label: 'Fresh Graduate', category: 'Career', icon: 'Award', description: 'Recent graduate entering the workforce', accentColor: '#10b981', keywords: ['grad', 'freshman', 'entry level', 'fresher'] },
  { id: 'working_professional', label: 'Working Professional', category: 'Career', icon: 'Briefcase', description: 'Currently employed or practicing professional', accentColor: '#3b82f6', keywords: ['work', 'job', 'employed', 'professional', 'corporate'] },
  { id: 'career_changer', label: 'Career Changer', category: 'Career', icon: 'RefreshCw', description: 'Transitioning to a new field or industry', accentColor: '#f97316', keywords: ['switch', 'pivot', 'transition', 'change', 'reskill'] },
  { id: 'entrepreneur', label: 'Entrepreneur', category: 'Business', icon: 'Rocket', description: 'Founders, co-founders, and business builders', accentColor: '#ec4899', keywords: ['founder', 'startup', 'entrepreneur', 'business', 'builder'] },
  { id: 'freelancer', label: 'Freelancer', category: 'Career', icon: 'Zap', description: 'Independent professional or gig worker', accentColor: '#0694a2', keywords: ['freelance', 'contractor', 'gig', 'independent'] },
  { id: 'self_learner', label: 'Self Learner', category: 'Education', icon: 'Sparkles', description: 'Autodidact or self-taught learner', accentColor: '#ef4444', keywords: ['autodidact', 'self taught', 'bootcamp', 'independent'] }
];

export const COUNTRIES: string[] = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
  "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt",
  "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon",
  "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel",
  "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos",
  "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi",
  "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova",
  "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands",
  "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau",
  "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
  "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal",
  "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea",
  "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania",
  "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda",
  "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "Yemen", "Zambia", "Zimbabwe"
];




// ─── Education Levels Taxonomy ────────────────────────────────────────────────
export const EDUCATION_LEVELS: TaxonomyItem[] = [
  { id: 'high_school_10th', label: '10th Grade / High School', category: 'Secondary', icon: 'BookOpen', description: 'Secondary school completion', accentColor: '#3b82f6', keywords: ['10th', 'ssc', 'matric', 'secondary'] },
  { id: 'higher_secondary_12th', label: '12th Grade / Higher Secondary', category: 'Secondary', icon: 'GraduationCap', description: 'Pre-university or higher secondary', accentColor: '#6366f1', keywords: ['12th', 'hsc', 'intermediate', 'pre-university'] },
  { id: 'diploma_vocational', label: 'Diploma / Vocational Certificate', category: 'Vocational', icon: 'Award', description: 'Technical polytechnic or trade diploma', accentColor: '#f59e0b', keywords: ['polytechnic', 'diploma', 'vocational', 'certificate'] },
  { id: 'undergraduate_bachelor', label: 'Undergraduate / Bachelor Degree', category: 'Higher Ed', icon: 'GraduationCap', description: 'B.Tech, B.S., B.A., B.B.A., B.Com degree', accentColor: '#10b981', keywords: ['bachelor', 'btech', 'bs', 'bba', 'bcom', 'undergrad'] },
  { id: 'postgraduate_master', label: 'Postgraduate / Master Degree', category: 'Higher Ed', icon: 'Award', description: 'M.Tech, M.S., M.A., M.B.A., M.Com degree', accentColor: '#8b5cf6', keywords: ['master', 'mtech', 'ms', 'mba', 'mcom', 'postgrad'] },
  { id: 'doctorate_phd', label: 'Doctorate / PhD', category: 'Research', icon: 'Sparkles', description: 'Doctoral research & academia', accentColor: '#ec4899', keywords: ['phd', 'doctorate', 'researcher', 'fellowship'] },
  OTHER_OPTION,
];

// ─── Education Domains Taxonomy ───────────────────────────────────────────────
export const EDUCATION_DOMAINS: TaxonomyItem[] = [
  { id: 'engineering', label: 'Engineering & STEM', category: 'STEM', icon: 'Cpu', description: 'Computer Science, Electrical, Mech, Civil', accentColor: '#3b82f6', keywords: ['eng', 'tech', 'software', 'cs', 'mechanical', 'civil', 'stem'] },
  { id: 'medicine_healthcare', label: 'Medicine & Healthcare', category: 'Healthcare', icon: 'HeartPulse', description: 'MBBS, Nursing, Pharmacy, Dentistry', accentColor: '#ef4444', keywords: ['med', 'doctor', 'health', 'mbbs', 'nursing', 'pharma'] },
  { id: 'commerce_finance', label: 'Commerce & Finance', category: 'Finance', icon: 'TrendingUp', description: 'Accounting, Corporate Finance, Banking, CA', accentColor: '#10b981', keywords: ['finance', 'accounting', 'banking', 'ca', 'money', 'fin'] },
  { id: 'business_management', label: 'Business & Management', category: 'Management', icon: 'Briefcase', description: 'Marketing, Operations, HR, Entrepreneurship', accentColor: '#8b5cf6', keywords: ['mba', 'bba', 'marketing', 'hr', 'management', 'business'] },
  { id: 'law_legal', label: 'Law & Legal Studies', category: 'Law', icon: 'Scale', description: 'Corporate Law, Cyber Law, Criminal Law', accentColor: '#f97316', keywords: ['law', 'legal', 'lawyer', 'corporate law', 'juris'] },
  { id: 'natural_sciences', label: 'Natural Sciences', category: 'Science', icon: 'Microscope', description: 'Physics, Chemistry, Mathematics, Biology', accentColor: '#06b6d4', keywords: ['physics', 'chemistry', 'math', 'biology', 'science'] },
  { id: 'arts_humanities', label: 'Arts & Humanities', category: 'Arts', icon: 'BookOpen', description: 'Literature, History, Psychology, Sociology', accentColor: '#ec4899', keywords: ['arts', 'history', 'literature', 'psychology', 'social'] },
  { id: 'design_media', label: 'Design & Media', category: 'Design', icon: 'Palette', description: 'UI/UX Design, Graphic Design, Media', accentColor: '#f43f5e', keywords: ['ui', 'ux', 'graphic', 'media', 'journalism', 'design'] },
  { id: 'architecture', label: 'Architecture & Built Env', category: 'Construction', icon: 'Building', description: 'Urban Planning, Interior Architecture', accentColor: '#64748b', keywords: ['architect', 'urban', 'interior', 'construction'] },
  OTHER_OPTION,
];

// ─── Hierarchical Mapping: Domain -> Branches -> Specializations ──────────────
export const DOMAIN_BRANCH_MAP: Record<string, TaxonomyItem[]> = {
  engineering: [
    { id: 'computer_science_eng', label: 'Computer Science Engineering', category: 'Technology', icon: 'Code2', description: 'Software Engineering, AI, Distributed Systems', accentColor: '#3b82f6', keywords: ['cs', 'cse', 'software', 'coding', 'dev'] },
    { id: 'information_technology_eng', label: 'Information Technology', category: 'Technology', icon: 'Cpu', description: 'IT Infrastructure, Cloud & Computing', accentColor: '#06b6d4', keywords: ['it', 'computers', 'systems', 'networks'] },
    { id: 'mechanical_eng', label: 'Mechanical Engineering', category: 'Engineering', icon: 'Cpu', description: 'Automotive, CAD/CAM, Robotics & Thermal', accentColor: '#64748b', keywords: ['mech', 'automobile', 'cad', 'robotics'] },
    { id: 'civil_eng', label: 'Civil Engineering', category: 'Engineering', icon: 'Building', description: 'Structural, Infrastructure & Environmental', accentColor: '#f59e0b', keywords: ['civil', 'construction', 'structural'] },
    { id: 'electrical_eng', label: 'Electrical Engineering', category: 'Engineering', icon: 'Zap', description: 'Power Systems, Energy & Control Systems', accentColor: '#eab308', keywords: ['electrical', 'power', 'circuit', 'grid'] },
    { id: 'electronics_eng', label: 'Electronics & Communication', category: 'Engineering', icon: 'Cpu', description: 'VLSI, Embedded Systems & Telecommunications', accentColor: '#a855f7', keywords: ['ece', 'embedded', 'vlsi', 'telecom'] },
    OTHER_OPTION,
  ],
  medicine_healthcare: [
    { id: 'mbbs_surgery', label: 'MBBS & Surgery', category: 'Healthcare', icon: 'HeartPulse', description: 'General Surgery, Internal Medicine', accentColor: '#ef4444', keywords: ['doc', 'doctor', 'surgery', 'mbbs', 'clinical'] },
    { id: 'dentistry_bds', label: 'Dentistry (BDS)', category: 'Healthcare', icon: 'HeartPulse', description: 'Oral Surgery & Orthodontics', accentColor: '#f43f5e', keywords: ['dentist', 'dental', 'teeth', 'bds'] },
    { id: 'nursing_care', label: 'Nursing & Patient Care', category: 'Healthcare', icon: 'HeartPulse', description: 'Critical Care & Clinical Nursing', accentColor: '#ec4899', keywords: ['nurse', 'nursing', 'patient care'] },
    { id: 'pharmacy', label: 'Pharmacy (B.Pharm)', category: 'Healthcare', icon: 'Microscope', description: 'Pharmacology, Pharmaceutics & Bio-Trials', accentColor: '#06b6d4', keywords: ['pharma', 'drugs', 'pharmacist', 'medicines'] },
    OTHER_OPTION,
  ],
  commerce_finance: [
    { id: 'accounting_audit', label: 'Accounting & Audit', category: 'Finance', icon: 'TrendingUp', description: 'Chartered Accountancy, Taxation, Audit', accentColor: '#10b981', keywords: ['ca', 'accounting', 'audit', 'taxation', 'fin'] },
    { id: 'corporate_finance', label: 'Corporate Finance', category: 'Finance', icon: 'TrendingUp', description: 'Investment Banking, Capital Markets', accentColor: '#3b82f6', keywords: ['fin', 'finance', 'investment', 'capital', 'stocks'] },
    OTHER_OPTION,
  ],
  business_management: [
    { id: 'marketing_management', label: 'Marketing Strategy', category: 'Management', icon: 'Briefcase', description: 'Digital Marketing, Brand Management', accentColor: '#a855f7', keywords: ['marketing', 'brand', 'digital', 'sales'] },
    { id: 'human_resources_mgmt', label: 'Human Resources', category: 'Management', icon: 'Briefcase', description: 'Talent Acquisition, HR Operations', accentColor: '#6366f1', keywords: ['hr', 'recruiting', 'talent', 'people'] },
    OTHER_OPTION,
  ],
  law_legal: [
    { id: 'corporate_law', label: 'Corporate Law', category: 'Law', icon: 'Scale', description: 'M&A, IPR, Commercial Contracts', accentColor: '#f97316', keywords: ['corporate', 'm&a', 'business law', 'legal'] },
    { id: 'cyber_law_privacy', label: 'Cyber Law & Data Privacy', category: 'Law', icon: 'Shield', description: 'Data Protection, Cyber Crime, GDPR', accentColor: '#06b6d4', keywords: ['cyber law', 'privacy', 'gdpr', 'infosec'] },
    OTHER_OPTION,
  ]
};

export const BRANCH_SPECIALIZATION_MAP: Record<string, TaxonomyItem[]> = {
  computer_science_eng: [
    { id: 'artificial_intelligence', label: 'Artificial Intelligence & ML', category: 'AI', icon: 'Brain', description: 'Neural Networks, Deep Learning & LLMs', accentColor: '#a855f7', keywords: ['ai', 'ml', 'machine learning', 'deep learning', 'llm', 'generative ai'] },
    { id: 'data_science', label: 'Data Science & Analytics', category: 'Data', icon: 'TrendingUp', description: 'Big Data, Statistics, Predictive Analytics', accentColor: '#10b981', keywords: ['data', 'analytics', 'big data', 'python', 'sql'] },
    { id: 'cyber_security', label: 'Cyber Security & Cryptography', category: 'Security', icon: 'Shield', description: 'Ethical Hacking, Network & Cloud Security', accentColor: '#06b6d4', keywords: ['security', 'infosec', 'hacking', 'cyber'] },
    { id: 'software_engineering', label: 'Software Development', category: 'Software', icon: 'Code2', description: 'Full Stack Web, Mobile & Cloud Apps', accentColor: '#3b82f6', keywords: ['software', 'dev', 'fullstack', 'coding'] },
    { id: 'cloud_computing', label: 'Cloud Computing & DevOps', category: 'Cloud', icon: 'Cloud', description: 'AWS, Kubernetes & CI/CD Pipelines', accentColor: '#6366f1', keywords: ['cloud', 'aws', 'devops', 'azure', 'k8s'] },
    OTHER_OPTION,
  ],
  mbbs_surgery: [
    { id: 'cardiology', label: 'Cardiology', category: 'Healthcare', icon: 'HeartPulse', description: 'Cardiovascular Health & Medicine', accentColor: '#ef4444', keywords: ['heart', 'cardio', 'cardiologist', 'doc'] },
    { id: 'neurology', label: 'Neurology', category: 'Healthcare', icon: 'Brain', description: 'Brain & Nervous System Sciences', accentColor: '#a855f7', keywords: ['neuro', 'brain', 'neurologist', 'doc'] },
    OTHER_OPTION,
  ]
};

// Flattened arrays for fallback search
export const EDUCATION_BRANCHES: TaxonomyItem[] = Array.from(
  new Set([...Object.values(DOMAIN_BRANCH_MAP).flat(), OTHER_OPTION])
);

export const SPECIALIZATIONS: TaxonomyItem[] = Array.from(
  new Set([...Object.values(BRANCH_SPECIALIZATION_MAP).flat(), OTHER_OPTION])
);

// ─── Dream Careers Taxonomy ──────────────────────────────────────────────────
export const DREAM_CAREERS: TaxonomyItem[] = [
  { id: 'ai_engineer', label: 'AI Engineer', category: 'Technology', icon: 'Brain', description: 'Designs intelligent systems & machine learning models', accentColor: '#a855f7', keywords: ['ai', 'ml', 'artificial intelligence', 'machine learning', 'llm', 'deep learning'] },
  { id: 'software_engineer', label: 'Software Engineer', category: 'Technology', icon: 'Code2', description: 'Full Stack & scalable software systems', accentColor: '#3b82f6', keywords: ['software', 'developer', 'coding', 'programming', 'dev', 'web'] },
  { id: 'data_scientist', label: 'Data Scientist', category: 'Technology', icon: 'TrendingUp', description: 'Advanced statistical analytics & predictive ML', accentColor: '#10b981', keywords: ['data', 'analytics', 'python', 'statistics', 'math'] },
  { id: 'cloud_architect', label: 'Cloud Engineer', category: 'Technology', icon: 'Cloud', description: 'Cloud infrastructure & DevOps (AWS/Azure/GCP)', accentColor: '#06b6d4', keywords: ['cloud', 'aws', 'azure', 'devops', 'kubernetes'] },
  { id: 'cyber_security_engineer', label: 'Cyber Security Engineer', category: 'Technology', icon: 'Shield', description: 'Information security & ethical hacking', accentColor: '#6366f1', keywords: ['security', 'infosec', 'cyber', 'hacking', 'shield'] },
  { id: 'ui_ux_designer', label: 'UI/UX Designer', category: 'Design', icon: 'Palette', description: 'Design systems & modern user experience', accentColor: '#ec4899', keywords: ['design', 'ui', 'ux', 'figma', 'product design'] },
  
  { id: 'doctor', label: 'Doctor / Physician', category: 'Healthcare', icon: 'HeartPulse', description: 'Healthcare & clinical medicine', accentColor: '#ef4444', keywords: ['doc', 'doctor', 'mbbs', 'medical', 'clinical', 'physician'] },
  { id: 'dentist', label: 'Dentist', category: 'Healthcare', icon: 'HeartPulse', description: 'Oral health & dental surgery', accentColor: '#f43f5e', keywords: ['doc', 'dentist', 'teeth', 'dental', 'bds'] },
  { id: 'clinical_researcher', label: 'Clinical Researcher', category: 'Healthcare', icon: 'Microscope', description: 'Pharmaceutical & medical trial research', accentColor: '#06b6d4', keywords: ['doc', 'research', 'clinical', 'pharma', 'trials'] },

  { id: 'financial_analyst', label: 'Financial Analyst', category: 'Finance', icon: 'TrendingUp', description: 'Corporate finance & valuation modeling', accentColor: '#10b981', keywords: ['fin', 'finance', 'investments', 'stocks', 'financial'] },
  { id: 'chartered_accountant', label: 'Chartered Accountant (CA)', category: 'Finance', icon: 'TrendingUp', description: 'Financial auditing, compliance & taxation', accentColor: '#059669', keywords: ['fin', 'ca', 'accounting', 'audit', 'taxation'] },
  { id: 'investment_banker', label: 'Investment Banker', category: 'Finance', icon: 'Building', description: 'Capital markets & corporate M&A', accentColor: '#3b82f6', keywords: ['fin', 'banking', 'm&a', 'wall street', 'finance'] },

  { id: 'product_manager', label: 'Product Manager', category: 'Management', icon: 'Briefcase', description: 'Product roadmap, vision & execution strategy', accentColor: '#8b5cf6', keywords: ['pm', 'product', 'agile', 'scrum', 'strategy'] },
  { id: 'management_consultant', label: 'Management Consultant', category: 'Management', icon: 'Briefcase', description: 'Business strategy & organizational advisory', accentColor: '#6366f1', keywords: ['consultant', 'strategy', 'advisory', 'business'] },
  { id: 'entrepreneur', label: 'Entrepreneur / Founder', category: 'Management', icon: 'Rocket', description: 'Venture creation & tech startups', accentColor: '#f97316', keywords: ['founder', 'startup', 'ceo', 'entrepreneur'] },

  { id: 'corporate_lawyer', label: 'Corporate Lawyer', category: 'Law', icon: 'Scale', description: 'Commercial law, contracts & corporate governance', accentColor: '#f97316', keywords: ['law', 'lawyer', 'legal', 'attorney', 'advocate'] },

  OTHER_OPTION,
];

// ─── Target Industries Taxonomy ──────────────────────────────────────────────
export const INDUSTRIES: TaxonomyItem[] = [
  { id: 'technology', label: 'Technology & SaaS', category: 'Tech', icon: 'Cpu', description: 'Software, Internet & Cloud Services', accentColor: '#3b82f6', keywords: ['tech', 'software', 'saas', 'internet', 'it'] },
  { id: 'healthcare', label: 'Healthcare & Hospitals', category: 'Healthcare', icon: 'HeartPulse', description: 'Medical Care, Hospitals & HealthTech', accentColor: '#ef4444', keywords: ['health', 'hospital', 'medical', 'healthtech'] },
  { id: 'finance', label: 'Financial Services & Banking', category: 'Finance', icon: 'TrendingUp', description: 'Fintech, Investment & Banking', accentColor: '#10b981', keywords: ['fin', 'banking', 'investments', 'fintech'] },
  { id: 'pharmaceuticals', label: 'Pharmaceuticals & Biotech', category: 'Healthcare', icon: 'Microscope', description: 'Drug Discovery & BioSciences', accentColor: '#06b6d4', keywords: ['pharma', 'biotech', 'drugs', 'clinical'] },
  { id: 'manufacturing', label: 'Manufacturing & Automotive', category: 'Industrial', icon: 'Cpu', description: 'Robotics, Heavy Industry & Auto', accentColor: '#64748b', keywords: ['manufacturing', 'auto', 'factory', 'industrial'] },
  { id: 'education', label: 'Education & EdTech', category: 'Education', icon: 'GraduationCap', description: 'Learning Systems & Academic Institutions', accentColor: '#8b5cf6', keywords: ['edtech', 'school', 'university', 'learning'] },
  { id: 'government', label: 'Government & Public Sector', category: 'Public', icon: 'Shield', description: 'Public Administration & Civic Tech', accentColor: '#f59e0b', keywords: ['gov', 'public sector', 'civil', 'government'] },
  { id: 'media', label: 'Media & Entertainment', category: 'Media', icon: 'Palette', description: 'Digital Content, Gaming & Publishing', accentColor: '#ec4899', keywords: ['media', 'entertainment', 'film', 'gaming'] },
  OTHER_OPTION,
];

// ─── Technical & Domain Skills Taxonomy ──────────────────────────────────────
export const TECHNICAL_SKILLS: TaxonomyItem[] = [
  { id: 'python', label: 'Python', category: 'Programming', icon: 'Code2', description: 'AI, Data Science, Web (Django/FastAPI)', accentColor: '#3b82f6', keywords: ['python', 'py', 'django', 'fastapi', 'ai'] },
  { id: 'java', label: 'Java', category: 'Programming', icon: 'Code2', description: 'Enterprise Backend (Spring Boot)', accentColor: '#f97316', keywords: ['java', 'spring', 'android', 'backend'] },
  { id: 'c_plus_plus', label: 'C++', category: 'Programming', icon: 'Code2', description: 'Systems & High Performance Computing', accentColor: '#6366f1', keywords: ['cpp', 'c++', 'dsa', 'systems'] },
  { id: 'javascript', label: 'JavaScript', category: 'Programming', icon: 'Code2', description: 'Web Applications (ES6+)', accentColor: '#eab308', keywords: ['js', 'javascript', 'es6', 'web'] },
  { id: 'typescript', label: 'TypeScript', category: 'Programming', icon: 'Code2', description: 'Type-Safe Web Applications', accentColor: '#3b82f6', keywords: ['ts', 'typescript', 'web'] },
  { id: 'react', label: 'React', category: 'Frontend', icon: 'Code2', description: 'Modern Web UI Framework', accentColor: '#06b6d4', keywords: ['react', 'reactjs', 'frontend', 'ui'] },
  { id: 'node_js', label: 'Node.js', category: 'Backend', icon: 'Code2', description: 'Event-Driven Server Runtimes', accentColor: '#10b981', keywords: ['node', 'express', 'backend', 'js'] },
  { id: 'mongodb', label: 'MongoDB', category: 'Database', icon: 'Cpu', description: 'NoSQL Document Store', accentColor: '#10b981', keywords: ['mongo', 'nosql', 'database', 'db'] },
  { id: 'sql', label: 'SQL', category: 'Database', icon: 'Cpu', description: 'Relational Database Queries & Schema', accentColor: '#3b82f6', keywords: ['sql', 'postgres', 'mysql', 'database'] },
  { id: 'docker', label: 'Docker', category: 'DevOps', icon: 'Cloud', description: 'Container Deployment Runtimes', accentColor: '#06b6d4', keywords: ['docker', 'containers', 'devops', 'cloud'] },
  { id: 'aws', label: 'AWS', category: 'Cloud', icon: 'Cloud', description: 'Amazon Web Services Cloud Infrastructure', accentColor: '#f59e0b', keywords: ['aws', 'amazon', 'cloud', 'devops'] },
  { id: 'pytorch', label: 'PyTorch', category: 'AI & Data', icon: 'Brain', description: 'Deep Learning & Neural Nets Framework', accentColor: '#ee4c2c', keywords: ['pytorch', 'ai', 'deep learning', 'ml'] },
  { id: 'tensorflow', label: 'TensorFlow', category: 'AI & Data', icon: 'Brain', description: 'Machine Learning Framework', accentColor: '#f97316', keywords: ['tf', 'tensorflow', 'ai', 'ml'] },
  { id: 'excel', label: 'Excel & Financial Modeling', category: 'Business', icon: 'TrendingUp', description: 'Financial Data Analysis', accentColor: '#10b981', keywords: ['excel', 'modeling', 'finance', 'data'] },
  { id: 'figma', label: 'Figma', category: 'Design', icon: 'Palette', description: 'Vector Design & UI Prototyping', accentColor: '#ec4899', keywords: ['figma', 'ui', 'ux', 'design', 'prototype'] },
  OTHER_OPTION,
];

// ─── Soft Skills Taxonomy ────────────────────────────────────────────────────
export const SOFT_SKILLS: TaxonomyItem[] = [
  { id: 'communication', label: 'Communication', category: 'Core', icon: 'Sparkles', description: 'Clear Verbal & Written Expressiveness', accentColor: '#8b5cf6', keywords: ['speaking', 'writing', 'presentation', 'soft skill'] },
  { id: 'critical_thinking', label: 'Critical Thinking', category: 'Core', icon: 'Brain', description: 'Analytical Logic & Reason', accentColor: '#a855f7', keywords: ['analysis', 'logic', 'thinking', 'reasoning'] },
  { id: 'problem_solving', label: 'Problem Solving', category: 'Core', icon: 'Cpu', description: 'Algorithmic & Root-Cause Resolution', accentColor: '#3b82f6', keywords: ['solving', 'troubleshooting', 'logic'] },
  { id: 'teamwork', label: 'Teamwork & Collaboration', category: 'Core', icon: 'Briefcase', description: 'Cross-Functional Group Synergies', accentColor: '#10b981', keywords: ['team', 'collaboration', 'group'] },
  { id: 'leadership', label: 'Leadership', category: 'Management', icon: 'Award', description: 'Vision & People Empowerment', accentColor: '#f97316', keywords: ['leader', 'management', 'vision'] },
  OTHER_OPTION,
];

// ─── Languages Taxonomy ──────────────────────────────────────────────────────
export const LANGUAGES: TaxonomyItem[] = [
  { id: 'english', label: 'English', category: 'Global', icon: 'BookOpen', description: 'Global Business Language', accentColor: '#3b82f6', keywords: ['english', 'en', 'global'] },
  { id: 'hindi', label: 'Hindi', category: 'Regional', icon: 'BookOpen', description: 'Indian National Language', accentColor: '#ef4444', keywords: ['hindi', 'hi', 'regional'] },
  { id: 'telugu', label: 'Telugu', category: 'Regional', icon: 'BookOpen', description: 'Regional Indian Language', accentColor: '#8b5cf6', keywords: ['telugu', 'te', 'regional'] },
  { id: 'tamil', label: 'Tamil', category: 'Regional', icon: 'BookOpen', description: 'Regional Indian Language', accentColor: '#10b981', keywords: ['tamil', 'ta', 'regional'] },
  { id: 'kannada', label: 'Kannada', category: 'Regional', icon: 'BookOpen', description: 'Regional Indian Language', accentColor: '#8b5cf6', keywords: ['kannada', 'kn', 'regional'] },
  { id: 'malayalam', label: 'Malayalam', category: 'Regional', icon: 'BookOpen', description: 'Regional Indian Language', accentColor: '#10b981', keywords: ['malayalam', 'ml', 'regional'] },
  { id: 'marathi', label: 'Marathi', category: 'Regional', icon: 'BookOpen', description: 'Regional Indian Language', accentColor: '#6366f1', keywords: ['marathi', 'mr', 'regional'] },
  { id: 'gujarati', label: 'Gujarati', category: 'Regional', icon: 'BookOpen', description: 'Regional Indian Language', accentColor: '#f97316', keywords: ['gujarati', 'gu', 'regional'] },
  { id: 'punjabi', label: 'Punjabi', category: 'Regional', icon: 'BookOpen', description: 'Regional Indian Language', accentColor: '#eab308', keywords: ['punjabi', 'pa', 'regional'] },
  { id: 'bengali', label: 'Bengali', category: 'Regional', icon: 'BookOpen', description: 'Regional Indian Language', accentColor: '#ec4899', keywords: ['bengali', 'bn', 'regional'] },
  { id: 'urdu', label: 'Urdu', category: 'Regional', icon: 'BookOpen', description: 'Regional Indian Language', accentColor: '#06b6d4', keywords: ['urdu', 'ur', 'regional'] },
  { id: 'spanish', label: 'Spanish', category: 'Global', icon: 'BookOpen', description: 'International Spanish', accentColor: '#f97316', keywords: ['spanish', 'es', 'global'] },
  { id: 'french', label: 'French', category: 'Global', icon: 'BookOpen', description: 'International French', accentColor: '#6366f1', keywords: ['french', 'fr', 'global'] },
  { id: 'german', label: 'German', category: 'Global', icon: 'BookOpen', description: 'International German', accentColor: '#eab308', keywords: ['german', 'de', 'global'] },
  { id: 'japanese', label: 'Japanese', category: 'Global', icon: 'BookOpen', description: 'Japanese Language', accentColor: '#ec4899', keywords: ['japanese', 'ja', 'global'] },
  { id: 'chinese', label: 'Chinese', category: 'Global', icon: 'BookOpen', description: 'Chinese Language', accentColor: '#ef4444', keywords: ['chinese', 'zh', 'global'] },
  OTHER_OPTION,
];

export const CAREER_INTERESTS: TaxonomyItem[] = [
  { id: 'ai_engineering', label: 'AI Engineering', category: 'Technology', icon: 'Brain', description: 'Artificial Intelligence & Machine Learning', accentColor: '#a855f7', keywords: ['ai', 'ml', 'machine learning', 'generative ai'] },
  { id: 'software_engineering', label: 'Software Engineering', category: 'Technology', icon: 'Code2', description: 'Full Stack & Software Systems', accentColor: '#3b82f6', keywords: ['software', 'dev', 'coding', 'web'] },
  { id: 'data_science', label: 'Data Science & Analytics', category: 'Technology', icon: 'TrendingUp', description: 'Advanced Analytics & Data Science', accentColor: '#10b981', keywords: ['data', 'analytics', 'statistics'] },
  { id: 'cyber_security', label: 'Cyber Security', category: 'Technology', icon: 'Shield', description: 'Information Security & Ethical Hacking', accentColor: '#06b6d4', keywords: ['security', 'cyber', 'infosec'] },
  { id: 'product_management', label: 'Product Management', category: 'Management', icon: 'Briefcase', description: 'Product Roadmap & Strategy', accentColor: '#8b5cf6', keywords: ['product', 'pm', 'agile'] },
  { id: 'cloud_computing', label: 'Cloud Computing', category: 'Technology', icon: 'Cloud', description: 'Cloud Infrastructure & DevOps', accentColor: '#6366f1', keywords: ['cloud', 'aws', 'devops', 'azure'] },
  { id: 'ui_ux_design', label: 'UI/UX Design', category: 'Design', icon: 'Palette', description: 'Design Systems & User Experience', accentColor: '#ec4899', keywords: ['ui', 'ux', 'design', 'figma'] },
  { id: 'devops', label: 'DevOps & SRE', category: 'Technology', icon: 'Cloud', description: 'CI/CD Pipelines & Site Reliability', accentColor: '#06b6d4', keywords: ['devops', 'cicd', 'sre', 'cloud'] },
  OTHER_OPTION,
];

// ─── Simple Dropdown Constants ───────────────────────────────────────────────
export const WORK_MODES = ['Remote', 'Hybrid', 'Office'];
export const PREFERRED_JOB_TYPES = [
  'Full-Time Employment',
  'Part-Time Position',
  'Internship / Co-op',
  'Freelance / Contract',
  'Remote Contract',
  OTHER_OPTION.label,
];
export const PREFERRED_LOCATIONS = [
  'Remote (Work from Anywhere)',
  'Local City / Metropolitan Area',
  'National Relocation',
  'International / Global Relocation',
  OTHER_OPTION.label,
];
export const HIGHER_ED_PLANS = [
  'No Immediate Plans',
  'Master Degree / Postgraduate',
  'Doctorate / PhD',
  'Professional Licensing / Certification',
  OTHER_OPTION.label,
];
export const YEARS_OF_EXPERIENCE = [
  '0 years (Fresh / Student)',
  '< 1 year',
  '1 - 2 years',
  '3 - 5 years',
  '5 - 10 years',
  '10+ years',
];
export const LEARNING_STYLES = ['Video', 'Reading', 'Interactive', 'Projects'];
export const LEARNING_PACES = ['Slow', 'Moderate', 'Fast'];
export const WEEKLY_STUDY_TIMES = ['<5 hrs', '5–10 hrs', '10–20 hrs', '20+ hrs'];

// ─── Keyword Alias Dictionary ────────────────────────────────────────────────
export const KEYWORD_ALIASES: Record<string, string[]> = {
  doc: ['doctor', 'dentist', 'clinical_researcher', 'mbbs_surgery'],
  fin: ['financial_analyst', 'chartered_accountant', 'investment_banker', 'corporate_finance', 'accounting_audit', 'commerce_finance', 'finance'],
  ai: ['ai_engineer', 'artificial_intelligence', 'ml_engineer', 'data_scientist', 'pytorch', 'tensorflow', 'ai_engineering'],
  cloud: ['cloud_architect', 'aws', 'devops_engineer', 'cloud_computing', 'docker', 'devops'],
  dev: ['software_engineer', 'full_stack_dev', 'react', 'node_js', 'typescript', 'javascript', 'python', 'java', 'c_plus_plus', 'software_engineering'],
};

export const getContextualDreamCareers = (
  domainId?: string,
  _statusId?: string
): TaxonomyItem[] => {
  if (!domainId) return DREAM_CAREERS;

  const matches = DREAM_CAREERS.filter((c) => c.category?.toLowerCase() === domainId.toLowerCase() || c.id === 'other');
  if (matches.length > 1) return matches;

  return DREAM_CAREERS;
};

// ─── Phase 4 Redesign Step 2 Taxonomy Constants ──────────────────────────────
export const STEP2_EDUCATION_LEVELS: TaxonomyItem[] = [
  { id: 'school', label: 'School', category: 'Basic', icon: 'BookOpen', description: 'Primary or middle school education', accentColor: '#3b82f6', keywords: ['school', 'primary', 'middle', 'education'] },
  { id: 'high_school', label: 'High School', category: 'Secondary', icon: 'GraduationCap', description: 'Secondary school completion (10th/12th grade)', accentColor: '#6366f1', keywords: ['high school', 'secondary', 'hsc', 'ssc'] },
  { id: 'intermediate', label: 'Intermediate', category: 'Secondary', icon: 'BookOpen', description: 'Pre-university intermediate studies', accentColor: '#3b82f6', keywords: ['intermediate', 'pre-university', '12th', 'junior college'] },
  { id: 'diploma', label: 'Diploma', category: 'Technical', icon: 'Award', description: 'Technical or vocational diploma course', accentColor: '#f59e0b', keywords: ['diploma', 'technical', 'polytechnic'] },
  { id: 'polytechnic', label: 'Polytechnic', category: 'Technical', icon: 'Award', description: 'Polytechnic engineering diploma program', accentColor: '#f59e0b', keywords: ['polytechnic', 'diploma', 'technical'] },
  { id: 'iti', label: 'ITI', category: 'Vocational', icon: 'Briefcase', description: 'Industrial Training Institute certificate', accentColor: '#10b981', keywords: ['iti', 'industrial', 'trade', 'vocational'] },
  { id: 'vocational_training', label: 'Vocational Training', category: 'Vocational', icon: 'Briefcase', description: 'Applied vocational skills or trade qualification', accentColor: '#10b981', keywords: ['vocational', 'trade', 'skills'] },
  { id: 'certificate_program', label: 'Certificate Program', category: 'Certification', icon: 'Award', description: 'Short term certificate course or credential program', accentColor: '#6366f1', keywords: ['certificate', 'program', 'credential'] },
  { id: 'bachelors_degree', label: "Bachelor's Degree", category: 'Higher Ed', icon: 'GraduationCap', description: 'Undergraduate university degree (B.Tech, B.S., B.A., B.Com)', accentColor: '#10b981', keywords: ['bachelor', 'undergraduate', 'btech', 'bs', 'ba', 'bcom'] },
  { id: 'masters_degree', label: "Master's Degree", category: 'Higher Ed', icon: 'Award', description: 'Postgraduate university degree (M.Tech, M.S., M.A., M.Com)', accentColor: '#8b5cf6', keywords: ['master', 'postgraduate', 'mtech', 'ms', 'ma', 'mcom'] },
  { id: 'mba', label: 'MBA', category: 'Management', icon: 'Briefcase', description: 'Master of Business Administration degree', accentColor: '#8b5cf6', keywords: ['mba', 'management', 'business'] },
  { id: 'doctorate_phd', label: 'Doctorate (PhD)', category: 'Research', icon: 'Sparkles', description: 'Doctoral research degree (PhD)', accentColor: '#ec4899', keywords: ['phd', 'doctorate', 'research'] },
  { id: 'post_doctorate', label: 'Post Doctorate', category: 'Research', icon: 'Sparkles', description: 'Postdoctoral research fellowship', accentColor: '#ec4899', keywords: ['postdoc', 'fellowship', 'research'] },
  OTHER_OPTION
];

export const STEP2_CURRENT_STATUSES: TaxonomyItem[] = [
  { id: 'currently_studying', label: 'Currently Studying', category: 'Status', icon: 'BookOpen', description: 'Enrolled and actively attending classes', accentColor: '#3b82f6', keywords: ['studying', 'learning', 'enrolled', 'student'] },
  { id: 'completed', label: 'Completed', category: 'Status', icon: 'Award', description: 'Finished academic program successfully', accentColor: '#10b981', keywords: ['completed', 'graduated', 'done', 'alumni'] },
  { id: 'on_break', label: 'On Break', category: 'Status', icon: 'RefreshCw', description: 'Temporarily paused studies or taking a gap year', accentColor: '#f97316', keywords: ['break', 'pause', 'gap', 'sabbatical'] },
  { id: 'dropped_out', label: 'Dropped Out', category: 'Status', icon: 'X', description: 'Left the academic program before completion', accentColor: '#ef4444', keywords: ['dropped', 'dropout', 'left'] },
  { id: 'preparing_admission', label: 'Preparing for Admission', category: 'Status', icon: 'Sparkles', description: 'Studying for entrance tests or awaiting admission results', accentColor: '#8b5cf6', keywords: ['admission', 'entrance', 'prep'] },
  { id: 'preparing_exams', label: 'Preparing for Exams', category: 'Status', icon: 'Award', description: 'Studying for licensing, board, or certification exams', accentColor: '#6366f1', keywords: ['exams', 'test', 'prep'] },
  { id: 'working_while_studying', label: 'Working While Studying', category: 'Status', icon: 'Briefcase', description: 'Balancing a career/job along with ongoing education', accentColor: '#06b6d4', keywords: ['work', 'job', 'studying', 'dual'] },
  { id: 'self_learning', label: 'Self Learning', category: 'Status', icon: 'Sparkles', description: 'Independently learning new skills outside classrooms', accentColor: '#ec4899', keywords: ['self', 'bootcamp', 'online', 'autodidact'] }
];

export const STEP2_ACADEMIC_FIELDS: TaxonomyItem[] = [
  // Engineering
  { id: 'engineering', label: 'Engineering', category: 'Engineering', icon: 'Cpu', description: 'Core Engineering disciplines', accentColor: '#3b82f6', keywords: ['engineering', 'stem'] },
  { id: 'mechanical_eng', label: 'Mechanical Engineering', category: 'Engineering', icon: 'Cpu', description: 'Machines, kinematics, thermodynamics', accentColor: '#3b82f6', keywords: ['mechanical', 'mech'] },
  { id: 'civil_eng', label: 'Civil Engineering', category: 'Engineering', icon: 'Building', description: 'Infrastructure, structures, surveying', accentColor: '#64748b', keywords: ['civil', 'construction'] },
  { id: 'electrical_eng', label: 'Electrical Engineering', category: 'Engineering', icon: 'Cpu', description: 'Power systems, electrical circuits', accentColor: '#f59e0b', keywords: ['electrical', 'ee'] },
  { id: 'electronics', label: 'Electronics', category: 'Engineering', icon: 'Cpu', description: 'Semiconductors, circuits, hardware', accentColor: '#3b82f6', keywords: ['electronics', 'hardware', 'ece'] },
  { id: 'chemical_eng', label: 'Chemical Engineering', category: 'Engineering', icon: 'Microscope', description: 'Industrial chemistry, process design', accentColor: '#06b6d4', keywords: ['chemical', 'chemistry'] },
  { id: 'aerospace_eng', label: 'Aerospace Engineering', category: 'Engineering', icon: 'Rocket', description: 'Aeronautics, spacecraft design', accentColor: '#ec4899', keywords: ['aerospace', 'space', 'aeronautics'] },
  { id: 'biomedical_eng', label: 'Biomedical Engineering', category: 'Engineering', icon: 'HeartPulse', description: 'Healthcare devices, biotech systems', accentColor: '#ef4444', keywords: ['biomedical', 'biotech'] },
  { id: 'robotics_eng', label: 'Robotics Engineering', category: 'Engineering', icon: 'Cpu', description: 'Automation, mechatronics, autonomous bots', accentColor: '#10b981', keywords: ['robotics', 'automation'] },
  { id: 'automobile_eng', label: 'Automobile Engineering', category: 'Engineering', icon: 'Cpu', description: 'Vehicle design and automotive systems', accentColor: '#3b82f6', keywords: ['automobile', 'automotive'] },

  // Medical & Healthcare
  { id: 'medicine', label: 'Medicine', category: 'Medical & Healthcare', icon: 'HeartPulse', description: 'Clinical medicine & diagnostics (MBBS)', accentColor: '#ef4444', keywords: ['medicine', 'doctor', 'mbbs'] },
  { id: 'dentistry', label: 'Dentistry', category: 'Medical & Healthcare', icon: 'HeartPulse', description: 'Dental surgery and oral health', accentColor: '#ef4444', keywords: ['dentistry', 'dentist', 'bds'] },
  { id: 'nursing', label: 'Nursing', category: 'Medical & Healthcare', icon: 'HeartPulse', description: 'Patient care & clinical support', accentColor: '#ef4444', keywords: ['nursing', 'nurse'] },
  { id: 'pharmacy', label: 'Pharmacy', category: 'Medical & Healthcare', icon: 'HeartPulse', description: 'Pharmacology and pharmaceutical sciences', accentColor: '#ef4444', keywords: ['pharmacy', 'pharmacology'] },
  { id: 'veterinary_science', label: 'Veterinary Science', category: 'Medical & Healthcare', icon: 'HeartPulse', description: 'Animal health & medicine', accentColor: '#ef4444', keywords: ['veterinary', 'animals'] },
  { id: 'psychology', label: 'Psychology', category: 'Medical & Healthcare', icon: 'Brain', description: 'Mental health, counseling, behavior', accentColor: '#8b5cf6', keywords: ['psychology', 'clinical', 'counseling'] },
  { id: 'biotechnology', label: 'Biotechnology', category: 'Medical & Healthcare', icon: 'Microscope', description: 'Biological engineering, genomics, biochemistry', accentColor: '#10b981', keywords: ['biotech', 'biotechnology', 'genetics'] },

  // Business & Commerce
  { id: 'business', label: 'Business', category: 'Business & Commerce', icon: 'Briefcase', description: 'General business principles & strategies', accentColor: '#8b5cf6', keywords: ['business', 'entrepreneurship'] },
  { id: 'management', label: 'Management', category: 'Business & Commerce', icon: 'Briefcase', description: 'Administration, leadership, MBA studies', accentColor: '#8b5cf6', keywords: ['management', 'admin', 'mba'] },
  { id: 'commerce', label: 'Commerce', category: 'Business & Commerce', icon: 'Briefcase', description: 'Banking, retail, CA foundations', accentColor: '#3b82f6', keywords: ['commerce', 'banking', 'ca'] },
  { id: 'finance', label: 'Finance', category: 'Business & Commerce', icon: 'TrendingUp', description: 'Corporate finance, investment banking', accentColor: '#10b981', keywords: ['finance', 'fin', 'investments'] },
  { id: 'accounting', label: 'Accounting', category: 'Business & Commerce', icon: 'TrendingUp', description: 'Audit, taxation, accounting standards', accentColor: '#10b981', keywords: ['accounting', 'tax', 'audit'] },
  { id: 'economics', label: 'Economics', category: 'Business & Commerce', icon: 'TrendingUp', description: 'Macro/microeconomics, econometrics', accentColor: '#06b6d4', keywords: ['economics', 'econometrics'] },
  { id: 'marketing', label: 'Marketing', category: 'Business & Commerce', icon: 'Briefcase', description: 'Brand management, digital marketing, ads', accentColor: '#ec4899', keywords: ['marketing', 'brand'] },
  { id: 'human_resources', label: 'Human Resources', category: 'Business & Commerce', icon: 'Briefcase', description: 'Talent management, organizational behavior', accentColor: '#64748b', keywords: ['hr', 'human resources'] },

  // Arts & Humanities
  { id: 'fine_arts', label: 'Arts', category: 'Arts & Humanities', icon: 'Palette', description: 'Drawing, painting, visual arts', accentColor: '#f43f5e', keywords: ['arts', 'painting', 'fine arts'] },
  { id: 'humanities', label: 'Humanities', category: 'Arts & Humanities', icon: 'BookOpen', description: 'Sociology, anthropology, cultural studies', accentColor: '#3b82f6', keywords: ['humanities', 'sociology', 'culture'] },
  { id: 'literature', label: 'Literature', category: 'Arts & Humanities', icon: 'BookOpen', description: 'English, comparative literature, writing', accentColor: '#3b82f6', keywords: ['literature', 'english'] },
  { id: 'languages', label: 'Languages', category: 'Arts & Humanities', icon: 'BookOpen', description: 'Linguistics, language studies, translation', accentColor: '#3b82f6', keywords: ['languages', 'linguistics'] },
  { id: 'history', label: 'History', category: 'Arts & Humanities', icon: 'BookOpen', description: 'World history, archaeology, historical research', accentColor: '#64748b', keywords: ['history', 'archaeology'] },
  { id: 'political_science', label: 'Political Science', category: 'Arts & Humanities', icon: 'Scale', description: 'Government, political theory, geopolitics', accentColor: '#6366f1', keywords: ['politics', 'political science'] },
  { id: 'geography', label: 'Geography', category: 'Arts & Humanities', icon: 'BookOpen', description: 'Physical geography, GIS mapping', accentColor: '#64748b', keywords: ['geography', 'gis'] },

  // Science
  { id: 'physics', label: 'Physics', category: 'Science', icon: 'Microscope', description: 'Astrophysics, thermodynamics, quantum physics', accentColor: '#06b6d4', keywords: ['physics', 'science'] },
  { id: 'chemistry', label: 'Chemistry', category: 'Science', icon: 'Microscope', description: 'Organic, inorganic, biochemistry', accentColor: '#06b6d4', keywords: ['chemistry', 'chemical'] },
  { id: 'mathematics', label: 'Mathematics', category: 'Science', icon: 'Brain', description: 'Pure math, applied mathematics, algebra', accentColor: '#8b5cf6', keywords: ['math', 'mathematics'] },
  { id: 'statistics', label: 'Statistics', category: 'Science', icon: 'TrendingUp', description: 'Probability, quantitative methods, statistical learning', accentColor: '#10b981', keywords: ['statistics', 'stats'] },
  { id: 'biology', label: 'Biology', category: 'Science', icon: 'Microscope', description: 'Genetics, microbiology, ecology', accentColor: '#ef4444', keywords: ['biology', 'genetics'] },

  // Law
  { id: 'law', label: 'Law', category: 'Law', icon: 'Scale', description: 'Corporate, criminal, cyber, international law', accentColor: '#f97316', keywords: ['law', 'llb', 'llm', 'legal'] },

  // Education
  { id: 'education_pedagogy', label: 'Education', category: 'Education', icon: 'BookOpen', description: 'Pedagogy, curriculum design, classroom teaching', accentColor: '#3b82f6', keywords: ['education', 'teaching', 'pedagogy'] },

  // Agriculture
  { id: 'agriculture', label: 'Agriculture', category: 'Agriculture', icon: 'BookOpen', description: 'Soil science, farming technology, horticulture', accentColor: '#10b981', keywords: ['agriculture', 'farming'] },

  // Architecture
  { id: 'architecture_design', label: 'Architecture', category: 'Architecture', icon: 'Building', description: 'Urban planning, structural architecture', accentColor: '#64748b', keywords: ['architecture', 'urban'] },

  // Design
  { id: 'design_studies', label: 'Design', category: 'Design', icon: 'Palette', description: 'Graphic, industrial, communication design', accentColor: '#f43f5e', keywords: ['design', 'graphic'] },
  { id: 'fashion', label: 'Fashion', category: 'Design', icon: 'Palette', description: 'Textile, apparel, and fashion design', accentColor: '#f43f5e', keywords: ['fashion', 'apparel'] },
  { id: 'animation', label: 'Animation', category: 'Design', icon: 'Palette', description: '3D modeling, visual effects, game art', accentColor: '#ec4899', keywords: ['animation', 'vfx'] },
  { id: 'interior_design', label: 'Interior Design', category: 'Design', icon: 'Palette', description: 'Spatial layout, interior aesthetics', accentColor: '#f43f5e', keywords: ['interior design', 'interior', 'spatial'] },

  // Technology
  { id: 'computer_science', label: 'Computer Science', category: 'Technology', icon: 'Code2', description: 'Programming, software systems, algorithms', accentColor: '#10b981', keywords: ['cs', 'computer science', 'programming', 'software'] },
  { id: 'information_tech', label: 'Information Technology', category: 'Technology', icon: 'Cloud', description: 'Systems administration, networking', accentColor: '#3b82f6', keywords: ['it', 'information technology'] },
  { id: 'artificial_intelligence', label: 'Artificial Intelligence', category: 'Technology', icon: 'Brain', description: 'Machine learning, deep learning, NLP', accentColor: '#8b5cf6', keywords: ['ai', 'artificial intelligence', 'ml', 'machine learning'] },
  { id: 'data_science', label: 'Data Science', category: 'Technology', icon: 'TrendingUp', description: 'Big data analytics, statistics, data modeling', accentColor: '#06b6d4', keywords: ['data', 'data science', 'analytics'] },
  { id: 'cyber_security', label: 'Cyber Security', category: 'Technology', icon: 'Shield', description: 'Information security, cryptography, ethical hacking', accentColor: '#ef4444', keywords: ['security', 'cyber', 'hacking', 'shield'] },
  { id: 'cloud_computing', label: 'Cloud Computing', category: 'Technology', icon: 'Cloud', description: 'AWS, Azure, cloud architecture, devops', accentColor: '#3b82f6', keywords: ['cloud', 'aws', 'devops'] },
  { id: 'blockchain', label: 'Blockchain', category: 'Technology', icon: 'Shield', description: 'Web3, smart contracts, crypto ledger', accentColor: '#10b981', keywords: ['blockchain', 'web3', 'crypto'] },
  { id: 'game_development', label: 'Game Development', category: 'Technology', icon: 'Rocket', description: 'Unity, Unreal Engine, gameplay design', accentColor: '#ec4899', keywords: ['game', 'dev', 'unity'] },
  { id: 'ui_ux_design', label: 'UI UX Design', category: 'Technology', icon: 'Palette', description: 'User interface & experience product design', accentColor: '#f43f5e', keywords: ['ui', 'ux', 'product design'] },

  // Hospitality & Tourism
  { id: 'hospitality', label: 'Hospitality', category: 'Hospitality', icon: 'Briefcase', description: 'Hotel, culinary arts, service management', accentColor: '#f59e0b', keywords: ['hospitality', 'hotel'] },
  { id: 'tourism', label: 'Tourism', category: 'Hospitality', icon: 'Briefcase', description: 'Tourism economics, travel administration', accentColor: '#06b6d4', keywords: ['tourism', 'travel'] },

  // Media
  { id: 'journalism', label: 'Journalism', category: 'Media', icon: 'BookOpen', description: 'Reporting, investigative journalism, news', accentColor: '#3b82f6', keywords: ['journalism', 'news'] },
  { id: 'media_communications', label: 'Media', category: 'Media', icon: 'Palette', description: 'Public relations, television, social media', accentColor: '#ec4899', keywords: ['media', 'communications'] },
  { id: 'film', label: 'Film', category: 'Media', icon: 'Palette', description: 'Cinematography, directing, screenwriting', accentColor: '#f43f5e', keywords: ['film', 'movies', 'cinema'] },

  // Sports
  { id: 'sports_science', label: 'Sports Science', category: 'Sports', icon: 'Award', description: 'Kinesiology, sports training, physical ed', accentColor: '#f59e0b', keywords: ['sports', 'athletics', 'fitness'] },

  // Defense
  { id: 'defense_studies', label: 'Defense', category: 'Defense', icon: 'Shield', description: 'National security, military strategy', accentColor: '#64748b', keywords: ['defense', 'military', 'security'] },

  // Social Sciences & Public Work
  { id: 'social_work', label: 'Social Work', category: 'Social Sciences', icon: 'BookOpen', description: 'Community development, welfare services', accentColor: '#ef4444', keywords: ['social work', 'welfare'] },
  { id: 'public_admin', label: 'Public Administration', category: 'Social Sciences', icon: 'Scale', description: 'Public policy, administrative law', accentColor: '#6366f1', keywords: ['public', 'policy'] },

  // Environmental Studies
  { id: 'environmental_science', label: 'Environmental Science', category: 'Environmental Studies', icon: 'Microscope', description: 'Climate change, conservation, sustainability', accentColor: '#10b981', keywords: ['environmental', 'climate', 'green'] },

  // Aviation
  { id: 'aviation', label: 'Aviation', category: 'Aviation', icon: 'Rocket', description: 'Aerospace operations, pilot licensing, aviation tech', accentColor: '#3b82f6', keywords: ['aviation', 'pilot', 'flight'] },

  // Marine Science
  { id: 'marine_science', label: 'Marine Science', category: 'Marine Science', icon: 'Microscope', description: 'Oceanography, marine biology, aquatic systems', accentColor: '#06b6d4', keywords: ['marine', 'ocean', 'aquatic'] },

  OTHER_OPTION
];

export const STEP2_ACADEMIC_PERFORMANCES: TaxonomyItem[] = [
  { id: 'outstanding', label: 'Outstanding', category: 'Performance', icon: 'Award', description: 'Top of class academic performance', accentColor: '#10b981', keywords: ['outstanding', 'top', 'a+'] },
  { id: 'excellent', label: 'Excellent', category: 'Performance', icon: 'Award', description: 'Top tier grades or academic performance', accentColor: '#10b981', keywords: ['excellent', 'grade a'] },
  { id: 'very_good', label: 'Very Good', category: 'Performance', icon: 'Award', description: 'Consistent above-average grades', accentColor: '#10b981', keywords: ['very good', 'good'] },
  { id: 'good', label: 'Good', category: 'Performance', icon: 'Award', description: 'Satisfactory academic progress', accentColor: '#3b82f6', keywords: ['good', 'average'] },
  { id: 'average', label: 'Average', category: 'Performance', icon: 'BookOpen', description: 'Moderate academic results or passing grades', accentColor: '#f59e0b', keywords: ['average', 'passing'] },
  { id: 'needs_improvement', label: 'Needs Improvement', category: 'Performance', icon: 'RefreshCw', description: 'Working to improve grades and results', accentColor: '#ef4444', keywords: ['needs improvement', 'improving', 'low'] },
  { id: 'prefer_not_to_say', label: 'Prefer Not To Say', category: 'Performance', icon: 'Shield', description: 'Keep academic performance confidential', accentColor: '#64748b', keywords: ['private', 'confidential', 'hide'] }
];

export const STEP2_LEARNING_GOALS: TaxonomyItem[] = [
  { id: 'get_job', label: 'Get a Job', category: 'Career', icon: 'Briefcase', description: 'Transition into professional employment', accentColor: '#10b981', keywords: ['job', 'employment', 'placement'] },
  { id: 'higher_studies', label: 'Higher Studies', category: 'Education', icon: 'GraduationCap', description: "Prepare for master's, PhD, or advanced degrees", accentColor: '#3b82f6', keywords: ['studies', 'master', 'postgrad', 'phd'] },
  { id: 'government_exams', label: 'Government Exams', category: 'Exams', icon: 'Award', description: 'Prepare for public sector or civil service exams', accentColor: '#6366f1', keywords: ['government', 'civil', 'exams', 'psc'] },
  { id: 'study_abroad', label: 'Study Abroad', category: 'Education', icon: 'Globe', description: 'Apply for international universities and courses', accentColor: '#3b82f6', keywords: ['abroad', 'foreign', 'international'] },
  { id: 'research', label: 'Research', category: 'Academic', icon: 'Microscope', description: 'Conduct research or join research labs', accentColor: '#06b6d4', keywords: ['research', 'phd', 'papers'] },
  { id: 'start_business', label: 'Start a Business', category: 'Business', icon: 'Rocket', description: 'Launch a startup, build a product, or start a company', accentColor: '#ec4899', keywords: ['startup', 'founder', 'business', 'entrepreneur'] },
  { id: 'freelancing', label: 'Freelancing', category: 'Career', icon: 'Zap', description: 'Work independently for remote clients and contracts', accentColor: '#0694a2', keywords: ['freelance', 'contract', 'gig'] },
  { id: 'skill_development', label: 'Skill Development', category: 'Personal', icon: 'Cpu', description: 'Acquire new technical or soft skills', accentColor: '#8b5cf6', keywords: ['skills', 'learning', 'upskill'] },
  { id: 'career_change', label: 'Career Change', category: 'Career', icon: 'RefreshCw', description: 'Transition to a completely new industry or domain', accentColor: '#f97316', keywords: ['change', 'pivot', 'switch'] },
  { id: 'competitive_exams', label: 'Competitive Exams', category: 'Exams', icon: 'Award', description: 'Prepare for standard national/international tests', accentColor: '#6366f1', keywords: ['competitive', 'exams', 'olympiad', 'gre', 'gate'] },
  { id: 'still_exploring', label: 'Still Exploring', category: 'Personal', icon: 'Sparkles', description: 'Exploring options and building general knowledge', accentColor: '#ec4899', keywords: ['explore', 'curious', 'undecided'] }
];

export const STEP2_CURRENT_YEARS: TaxonomyItem[] = [
  { id: 'year_1', label: 'Year 1', category: 'Year', icon: 'BookOpen', description: 'First year of the academic program', accentColor: '#3b82f6', keywords: ['year 1', 'first year', 'freshman'] },
  { id: 'year_2', label: 'Year 2', category: 'Year', icon: 'BookOpen', description: 'Second year of the academic program', accentColor: '#3b82f6', keywords: ['year 2', 'second year', 'sophomore'] },
  { id: 'year_3', label: 'Year 3', category: 'Year', icon: 'BookOpen', description: 'Third year of the academic program', accentColor: '#3b82f6', keywords: ['year 3', 'third year', 'junior'] },
  { id: 'year_4', label: 'Year 4', category: 'Year', icon: 'BookOpen', description: 'Fourth year of the academic program', accentColor: '#3b82f6', keywords: ['year 4', 'fourth year', 'senior'] },
  { id: 'year_5', label: 'Year 5', category: 'Year', icon: 'BookOpen', description: 'Fifth year of the academic program', accentColor: '#3b82f6', keywords: ['year 5', 'fifth year'] },
  { id: 'year_6', label: 'Year 6', category: 'Year', icon: 'BookOpen', description: 'Sixth year of the academic program', accentColor: '#3b82f6', keywords: ['year 6', 'sixth year'] },
  { id: 'sem_1', label: 'Semester 1', category: 'Semester', icon: 'BookOpen', description: 'First semester', accentColor: '#6366f1', keywords: ['semester 1', 'sem 1'] },
  { id: 'sem_2', label: 'Semester 2', category: 'Semester', icon: 'BookOpen', description: 'Second semester', accentColor: '#6366f1', keywords: ['semester 2', 'sem 2'] },
  { id: 'sem_3', label: 'Semester 3', category: 'Semester', icon: 'BookOpen', description: 'Third semester', accentColor: '#6366f1', keywords: ['semester 3', 'sem 3'] },
  { id: 'sem_4', label: 'Semester 4', category: 'Semester', icon: 'BookOpen', description: 'Fourth semester', accentColor: '#6366f1', keywords: ['semester 4', 'sem 4'] },
  { id: 'sem_5', label: 'Semester 5', category: 'Semester', icon: 'BookOpen', description: 'Fifth semester', accentColor: '#6366f1', keywords: ['semester 5', 'sem 5'] },
  { id: 'sem_6', label: 'Semester 6', category: 'Semester', icon: 'BookOpen', description: 'Sixth semester', accentColor: '#6366f1', keywords: ['semester 6', 'sem 6'] },
  { id: 'sem_7', label: 'Semester 7', category: 'Semester', icon: 'BookOpen', description: 'Seventh semester', accentColor: '#6366f1', keywords: ['semester 7', 'sem 7'] },
  { id: 'sem_8', label: 'Semester 8', category: 'Semester', icon: 'BookOpen', description: 'Eighth semester', accentColor: '#6366f1', keywords: ['semester 8', 'sem 8'] },
  { id: 'sem_9', label: 'Semester 9', category: 'Semester', icon: 'BookOpen', description: 'Ninth semester', accentColor: '#6366f1', keywords: ['semester 9', 'sem 9'] },
  { id: 'sem_10', label: 'Semester 10', category: 'Semester', icon: 'BookOpen', description: 'Tenth semester', accentColor: '#6366f1', keywords: ['semester 10', 'sem 10'] },
  { id: 'sem_11', label: 'Semester 11', category: 'Semester', icon: 'BookOpen', description: 'Eleventh semester', accentColor: '#6366f1', keywords: ['semester 11', 'sem 11'] },
  { id: 'sem_12', label: 'Semester 12', category: 'Semester', icon: 'BookOpen', description: 'Twelfth semester', accentColor: '#6366f1', keywords: ['semester 12', 'sem 12'] },
  { id: 'completed_sem', label: 'Completed', category: 'Semester', icon: 'Award', description: 'Academic course duration completed', accentColor: '#10b981', keywords: ['completed', 'done', 'graduated'] }
];

export const INSTITUTIONS: string[] = [
  "Indian Institute of Technology",
  "National Institute of Technology",
  "University of Oxford",
  "Harvard University",
  "Stanford University",
  "University of Melbourne",
  "University of Tokyo",
  "Massachusetts Institute of Technology",
  "California Institute of Technology",
  "University of Cambridge",
  "Imperial College London",
  "ETH Zurich",
  "University of Chicago",
  "Princeton University",
  "Yale University",
  "National University of Singapore"
];

// ─── Phase 4 Redesign Step 3 Taxonomy Constants ──────────────────────────────
export const STEP3_INTERESTS: TaxonomyItem[] = [
  // Technology & Computing
  { id: 'software_development', label: 'Software Development', category: 'Technology', icon: 'Code2', description: 'Application, system, & web development', accentColor: '#10b981', keywords: ['dev', 'software', 'programming', 'code'] },
  { id: 'artificial_intelligence', label: 'Artificial Intelligence', category: 'Technology', icon: 'Brain', description: 'Deep learning & neural architectures', accentColor: '#8b5cf6', keywords: ['ai', 'intelligence', 'cognitive'] },
  { id: 'machine_learning', label: 'Machine Learning', category: 'Technology', icon: 'Brain', description: 'Predictive modeling & algorithm optimization', accentColor: '#8b5cf6', keywords: ['ml', 'statistics', 'modeling'] },
  { id: 'data_science', label: 'Data Science', category: 'Technology', icon: 'TrendingUp', description: 'Big data analytics & business metrics', accentColor: '#06b6d4', keywords: ['data', 'analytics', 'statistics'] },
  { id: 'cybersecurity', label: 'Cybersecurity', category: 'Technology', icon: 'Shield', description: 'Information integrity & network defense', accentColor: '#ef4444', keywords: ['security', 'cyber', 'pentest'] },
  { id: 'cloud_computing', label: 'Cloud Computing', category: 'Technology', icon: 'Cloud', description: 'Devops & virtual server architecture', accentColor: '#3b82f6', keywords: ['cloud', 'aws', 'devops'] },
  { id: 'networking', label: 'Networking', category: 'Technology', icon: 'Shield', description: 'Routing protocols & network admin controls', accentColor: '#3b82f6', keywords: ['network', 'routers', 'sysadmin'] },
  { id: 'devops', label: 'DevOps', category: 'Technology', icon: 'RefreshCw', description: 'Continuous integration & infrastructure automation', accentColor: '#10b981', keywords: ['devops', 'cicd', 'automation'] },
  { id: 'blockchain', label: 'Blockchain', category: 'Technology', icon: 'Cpu', description: 'Smart contracts & decentralized ledgers', accentColor: '#f59e0b', keywords: ['crypto', 'blockchain', 'solidity'] },
  { id: 'game_development', label: 'Game Development', category: 'Technology', icon: 'Rocket', description: 'Physics engines, rendering, & game design', accentColor: '#ec4899', keywords: ['gaming', 'unity', 'unreal'] },
  { id: 'robotics', label: 'Robotics', category: 'Technology', icon: 'Cpu', description: 'Automation control & hardware interfaces', accentColor: '#ec4899', keywords: ['robots', 'automation', 'mechatronics'] },
  { id: 'embedded_systems', label: 'Embedded Systems', category: 'Technology', icon: 'Cpu', description: 'Microcontrollers & low-level firmware', accentColor: '#8b5cf6', keywords: ['firmware', 'hardware', 'arduino'] },
  { id: 'iot', label: 'IoT', category: 'Technology', icon: 'Cpu', description: 'Connected devices & hardware sensor grids', accentColor: '#a855f7', keywords: ['iot', 'sensors', 'electronics'] },
  { id: 'ui_ux', label: 'UI/UX', category: 'Technology', icon: 'Palette', description: 'User interface mockups & experience design', accentColor: '#f43f5e', keywords: ['ux', 'ui', 'figma'] },
  { id: 'product_design', label: 'Product Design', category: 'Technology', icon: 'Palette', description: 'Designing physical & digital user journeys', accentColor: '#f43f5e', keywords: ['product', 'design', 'spec'] },
  { id: 'web_development', label: 'Web Development', category: 'Technology', icon: 'Code2', description: 'Frontend & backend web systems creation', accentColor: '#10b981', keywords: ['web', 'html', 'react', 'js'] },
  { id: 'mobile_development', label: 'Mobile Development', category: 'Technology', icon: 'Code2', description: 'iOS & Android app ecosystem development', accentColor: '#10b981', keywords: ['mobile', 'apps', 'swift', 'flutter'] },
  { id: 'ar_vr', label: 'AR/VR', category: 'Technology', icon: 'Sparkles', description: 'Virtual realities & mixed spatial layouts', accentColor: '#a855f7', keywords: ['ar', 'vr', 'metaverse'] },
  { id: 'quantum_computing', label: 'Quantum Computing', category: 'Technology', icon: 'Cpu', description: 'Qubit computing algorithms & physics theory', accentColor: '#6366f1', keywords: ['quantum', 'qubits', 'physics'] },
  { id: 'computer_graphics', label: 'Computer Graphics', category: 'Technology', icon: 'Palette', description: 'Rendering, ray tracing, & visual asset math', accentColor: '#ec4899', keywords: ['graphics', 'rendering', 'vulkan', 'opengl'] },

  // Engineering
  { id: 'mechanical_engineering', label: 'Mechanical Engineering', category: 'Engineering', icon: 'Cpu', description: 'Thermodynamics, CAD designs, & engine design', accentColor: '#3b82f6', keywords: ['mechanical', 'cad', 'solidworks'] },
  { id: 'civil_engineering', label: 'Civil Engineering', category: 'Engineering', icon: 'Building', description: 'Concrete, structural analysis, & urban design', accentColor: '#64748b', keywords: ['civil', 'construction', 'structures'] },
  { id: 'electrical_engineering', label: 'Electrical Engineering', category: 'Engineering', icon: 'Cpu', description: 'Power grids, microcontrollers, & current systems', accentColor: '#f59e0b', keywords: ['electrical', 'power', 'circuits'] },
  { id: 'electronics_engineering', label: 'Electronics Engineering', category: 'Engineering', icon: 'Cpu', description: 'Semiconductors, logic gates, & microchips', accentColor: '#f59e0b', keywords: ['electronics', 'chips', 'hardware'] },
  { id: 'chemical_engineering', label: 'Chemical Engineering', category: 'Engineering', icon: 'Microscope', description: 'Process optimization & chemical synthesis control', accentColor: '#06b6d4', keywords: ['chemical', 'refinery', 'reactions'] },
  { id: 'petroleum_engineering', label: 'Petroleum Engineering', category: 'Engineering', icon: 'Briefcase', description: 'Hydrocarbon discovery, drilling, & refining', accentColor: '#d97706', keywords: ['petroleum', 'oil', 'drilling'] },
  { id: 'mining_engineering', label: 'Mining Engineering', category: 'Engineering', icon: 'Building', description: 'Mineral extraction & resource geotechnology', accentColor: '#64748b', keywords: ['mining', 'resources', 'minerals'] },
  { id: 'marine_engineering', label: 'Marine Engineering', category: 'Engineering', icon: 'Cpu', description: 'Vessel engines, hulls, & marine system designs', accentColor: '#3b82f6', keywords: ['marine', 'ships', 'navy'] },
  { id: 'aerospace_engineering', label: 'Aerospace Engineering', category: 'Engineering', icon: 'Rocket', description: 'Aerodynamics, propulsion, & aircraft design', accentColor: '#ec4899', keywords: ['aerospace', 'space', 'planes'] },
  { id: 'automotive_engineering', label: 'Automotive Engineering', category: 'Engineering', icon: 'Cpu', description: 'Vehicle chassis design & EV battery grids', accentColor: '#3b82f6', keywords: ['automotive', 'cars', 'ev'] },
  { id: 'industrial_engineering', label: 'Industrial Engineering', category: 'Engineering', icon: 'Cpu', description: 'Logistics models & manufacturing optimization', accentColor: '#64748b', keywords: ['industrial', 'factory', 'efficiency'] },
  { id: 'manufacturing_engineering', label: 'Manufacturing Engineering', category: 'Engineering', icon: 'Cpu', description: 'Factory automation, assembly, & mold designs', accentColor: '#64748b', keywords: ['manufacturing', 'machining', 'cnc'] },
  { id: 'agricultural_engineering', label: 'Agricultural Engineering', category: 'Engineering', icon: 'BookOpen', description: 'Farming machinery, irrigation, & storage systems', accentColor: '#10b981', keywords: ['agricultural', 'tractors', 'irrigation'] },
  { id: 'biomedical_engineering', label: 'Biomedical Engineering', category: 'Engineering', icon: 'HeartPulse', description: 'Prosthetics development & clinical scanner designs', accentColor: '#ef4444', keywords: ['biomedical', 'prosthetics', 'scanners'] },
  { id: 'environmental_engineering', label: 'Environmental Engineering', category: 'Engineering', icon: 'Microscope', description: 'Waste recycling, emissions control, & sustainability', accentColor: '#10b981', keywords: ['environmental', 'pollution', 'water'] },
  { id: 'mechatronics', label: 'Mechatronics', category: 'Engineering', icon: 'Cpu', description: 'Feedback controller loops, logic, & electro-mechanicals', accentColor: '#3b82f6', keywords: ['mechatronics', 'sensors', 'motors'] },
  { id: 'metallurgy', label: 'Metallurgy', category: 'Engineering', icon: 'Cpu', description: 'Alloy synthesis, metallurgy testing, & casting', accentColor: '#64748b', keywords: ['metallurgy', 'metals', 'steel'] },
  { id: 'textile_engineering', label: 'Textile Engineering', category: 'Engineering', icon: 'Palette', description: 'Synthetic fibers fabrication & apparel production', accentColor: '#f43f5e', keywords: ['textile', 'fabric', 'yarn'] },

  // Medical & Healthcare
  { id: 'medicine', label: 'Medicine', category: 'Medical', icon: 'HeartPulse', description: 'Clinical diagnosis & therapeutic workflows', accentColor: '#ef4444', keywords: ['medicine', 'doctor', 'clinical'] },
  { id: 'surgery', label: 'Surgery', category: 'Medical', icon: 'HeartPulse', description: 'Clinical operative interventions & anatomy', accentColor: '#ef4444', keywords: ['surgery', 'surgeon', 'operation'] },
  { id: 'nursing', label: 'Nursing', category: 'Medical', icon: 'HeartPulse', description: 'Patient care, drug delivery, & clinical support', accentColor: '#ef4444', keywords: ['nursing', 'nurse', 'ward'] },
  { id: 'pharmacy', label: 'Pharmacy', category: 'Medical', icon: 'HeartPulse', description: 'Dispensing drugs & biochemical pharmacology', accentColor: '#ef4444', keywords: ['pharmacy', 'pharmacist', 'prescription'] },
  { id: 'dentistry', label: 'Dentistry', category: 'Medical', icon: 'HeartPulse', description: 'Oral medicine, tooth diagnostics, & extraction', accentColor: '#ef4444', keywords: ['dentistry', 'dentist', 'teeth'] },
  { id: 'physiotherapy', label: 'Physiotherapy', category: 'Medical', icon: 'HeartPulse', description: 'Muscle rehabilitation, exercise therapy, & recovery', accentColor: '#ef4444', keywords: ['physiotherapy', 'rehab', 'recovery'] },
  { id: 'veterinary_science', label: 'Veterinary Science', category: 'Medical', icon: 'HeartPulse', description: 'Animal pathology, health, & surgery', accentColor: '#10b981', keywords: ['veterinary', 'animals', 'vet'] },
  { id: 'public_health', label: 'Public Health', category: 'Medical', icon: 'HeartPulse', description: 'Epidemiology, hygiene, & community health metrics', accentColor: '#ef4444', keywords: ['public health', 'epidemic', 'sanitation'] },
  { id: 'nutrition', label: 'Nutrition', category: 'Medical', icon: 'HeartPulse', description: 'Diet blueprints, vitamins intake, & food values', accentColor: '#10b981', keywords: ['nutrition', 'diet', 'calories'] },
  { id: 'psychology', label: 'Psychology', category: 'Medical', icon: 'Brain', description: 'Mental dynamics, clinical therapy, & behavior', accentColor: '#8b5cf6', keywords: ['psychology', 'mind', 'counseling'] },
  { id: 'psychiatry', label: 'Psychiatry', category: 'Medical', icon: 'Brain', description: 'Neuroscience & pharmacological mental treatment', accentColor: '#8b5cf6', keywords: ['psychiatry', 'mental', 'neurology'] },
  { id: 'medical_lab_science', label: 'Medical Laboratory Science', category: 'Medical', icon: 'Microscope', description: 'Blood diagnostics, biopsy scanning, & cultures', accentColor: '#06b6d4', keywords: ['laboratory', 'blood', 'diagnostics'] },
  { id: 'radiology', label: 'Radiology', category: 'Medical', icon: 'Microscope', description: 'CT scanning, MRI imaging, & ultrasound analysis', accentColor: '#06b6d4', keywords: ['radiology', 'xray', 'mri'] },
  { id: 'emergency_medicine', label: 'Emergency Medicine', category: 'Medical', icon: 'HeartPulse', description: 'Acute trauma management & clinical resuscitation', accentColor: '#ef4444', keywords: ['emergency', 'trauma', 'er'] },
  { id: 'healthcare_management', label: 'Healthcare Management', category: 'Medical', icon: 'Briefcase', description: 'Hospital operation scheduling & clinic safety audit', accentColor: '#ef4444', keywords: ['hospital', 'clinic', 'administration'] },
  { id: 'occupational_therapy', label: 'Occupational Therapy', category: 'Medical', icon: 'HeartPulse', description: 'Aiding patients regain independence through daily tasks', accentColor: '#ef4444', keywords: ['occupational', 'therapy', 'rehab'] },
  { id: 'speech_therapy', label: 'Speech Therapy', category: 'Medical', icon: 'HeartPulse', description: 'Voice diagnostics & speech therapy correction models', accentColor: '#ef4444', keywords: ['speech', 'voice', 'therapy'] },

  // Science & Research
  { id: 'physics', label: 'Physics', category: 'Science', icon: 'Microscope', description: 'Mechanics, quantum science, & thermodynamics theory', accentColor: '#06b6d4', keywords: ['physics', 'quantum', 'mechanics'] },
  { id: 'chemistry', label: 'Chemistry', category: 'Science', icon: 'Microscope', description: 'Chemical bond structures, molecules, & kinetics', accentColor: '#06b6d4', keywords: ['chemistry', 'chemical', 'molecules'] },
  { id: 'biology', label: 'Biology', category: 'Science', icon: 'Microscope', description: 'Cytology, anatomy, and ecology ecosystems', accentColor: '#10b981', keywords: ['biology', 'cells', 'botany'] },
  { id: 'biotechnology', label: 'Biotechnology', category: 'Science', icon: 'Microscope', description: 'Cell engineering, lab diagnostics, & genomics', accentColor: '#10b981', keywords: ['biotech', 'biotechnology', 'genetics'] },
  { id: 'genetics', label: 'Genetics', category: 'Science', icon: 'Brain', description: 'DNA replication, transcription, & heredity models', accentColor: '#8b5cf6', keywords: ['genetics', 'dna', 'genomics'] },
  { id: 'astronomy', label: 'Astronomy', category: 'Science', icon: 'Rocket', description: 'Galaxies evolution, telescopes, & cosmology theory', accentColor: '#ec4899', keywords: ['astronomy', 'stars', 'space'] },
  { id: 'environmental_science', label: 'Environmental Science', category: 'Science', icon: 'Microscope', description: 'Forest ecology, climates, & conservation models', accentColor: '#10b981', keywords: ['ecology', 'climate', 'conservation'] },
  { id: 'geology', label: 'Geology', category: 'Science', icon: 'Building', description: 'Earth strata, seismic cycles, & minerals chemistry', accentColor: '#64748b', keywords: ['geology', 'rocks', 'seismic'] },
  { id: 'oceanography', label: 'Oceanography', category: 'Science', icon: 'Microscope', description: 'Marine currents, ocean topology, & marine sciences', accentColor: '#3b82f6', keywords: ['ocean', 'marine', 'tides'] },
  { id: 'space_science', label: 'Space Science', category: 'Science', icon: 'Rocket', description: 'Astrophysics, rockets propulsion, & spacecrafts', accentColor: '#ec4899', keywords: ['space', 'cosmology', 'astrophysics'] },
  { id: 'mathematics', label: 'Mathematics', category: 'Science', icon: 'TrendingUp', description: 'Linear algebra, calculus models, & geometry logic', accentColor: '#3b82f6', keywords: ['math', 'calculus', 'algebra'] },
  { id: 'statistics', label: 'Statistics', category: 'Science', icon: 'TrendingUp', description: 'Probabilities calculation, data regression, & analytics', accentColor: '#3b82f6', keywords: ['statistics', 'probabilities', 'regression'] },
  { id: 'research', label: 'Research', category: 'Science', icon: 'Microscope', description: 'Academic literature review, hypothesis testing, & papers', accentColor: '#06b6d4', keywords: ['research', 'literature', 'hypothesis'] },

  // Business & Commerce
  { id: 'finance', label: 'Finance', category: 'Business', icon: 'TrendingUp', description: 'Capital allocation, stock portfolios, & auditing', accentColor: '#10b981', keywords: ['finance', 'banking', 'stocks'] },
  { id: 'accounting', label: 'Accounting', category: 'Business', icon: 'TrendingUp', description: 'Ledger registers, tax declarations, & audit controls', accentColor: '#10b981', keywords: ['accounting', 'tally', 'audit'] },
  { id: 'banking', label: 'Banking', category: 'Business', icon: 'Briefcase', description: 'Lending risk auditing & investment workflows', accentColor: '#3b82f6', keywords: ['banking', 'loans', 'credit'] },
  { id: 'investment', label: 'Investment', category: 'Business', icon: 'TrendingUp', description: 'Venture metrics tracking & assets allocation', accentColor: '#10b981', keywords: ['investment', 'stocks', 'equity'] },
  { id: 'marketing', label: 'Marketing', category: 'Business', icon: 'Briefcase', description: 'Brand advertisements & customer research models', accentColor: '#ec4899', keywords: ['marketing', 'branding', 'campaign'] },
  { id: 'sales', label: 'Sales', category: 'Business', icon: 'Briefcase', description: 'Closing deals, lead acquisition, & communication', accentColor: '#10b981', keywords: ['sales', 'selling', 'leads'] },
  { id: 'human_resources', label: 'Human Resources', category: 'Business', icon: 'Briefcase', description: 'Talent recruitment, employee reviews, & HR policies', accentColor: '#64748b', keywords: ['hr', 'recruiting', 'talent'] },
  { id: 'entrepreneurship', label: 'Entrepreneurship', category: 'Business', icon: 'Rocket', description: 'Business strategy formulation & MVP launches', accentColor: '#ec4899', keywords: ['startup', 'founder', 'business'] },
  { id: 'business_analytics', label: 'Business Analytics', category: 'Business', icon: 'TrendingUp', description: 'Tableau models, Excel forecasting, & dashboards', accentColor: '#8b5cf6', keywords: ['business', 'analytics', 'forecasting'] },
  { id: 'supply_chain', label: 'Supply Chain', category: 'Business', icon: 'Briefcase', description: 'Raw materials dispatching & logistics operations', accentColor: '#f59e0b', keywords: ['supply chain', 'sourcing', 'inventory'] },
  { id: 'logistics', label: 'Logistics', category: 'Business', icon: 'Briefcase', description: 'Fleet schedules routing & shipping operations', accentColor: '#f59e0b', keywords: ['logistics', 'shipping', 'transit'] },
  { id: 'operations', label: 'Operations', category: 'Business', icon: 'RefreshCw', description: 'Business procedures audit & quality benchmarks', accentColor: '#64748b', keywords: ['operations', 'quality', 'efficiency'] },
  { id: 'international_business', label: 'International Business', category: 'Business', icon: 'Globe', description: 'Cross-border trade tariffs & imports/exports models', accentColor: '#3b82f6', keywords: ['global', 'trade', 'tariffs'] },
  { id: 'economics', label: 'Economics', category: 'Business', icon: 'TrendingUp', description: 'Macro-economics models, inflation, & market trends', accentColor: '#10b981', keywords: ['economics', 'macro', 'markets'] },

  // Law & Government
  { id: 'law', label: 'Law', category: 'Law & Government', icon: 'Scale', description: 'Civil rights, corporate contracts, & legal drafting', accentColor: '#f97316', keywords: ['law', 'legal', 'drafting'] },
  { id: 'judiciary', label: 'Judiciary', category: 'Law & Government', icon: 'Scale', description: 'Court trials administration & legal analysis', accentColor: '#f97316', keywords: ['judiciary', 'judge', 'court'] },
  { id: 'civil_services', label: 'Civil Services', category: 'Law & Government', icon: 'Scale', description: 'Bureaucracy administration & public policy execution', accentColor: '#6366f1', keywords: ['civil services', 'ias', 'administration'] },
  { id: 'public_administration', label: 'Public Administration', category: 'Law & Government', icon: 'Scale', description: 'Municipal services supervision & public budgeting', accentColor: '#6366f1', keywords: ['government', 'public', 'budgeting'] },
  { id: 'diplomacy', label: 'Diplomacy', category: 'Law & Government', icon: 'Globe', description: 'Foreign embassy negotiations & multi-lateral pacts', accentColor: '#3b82f6', keywords: ['diplomacy', 'embassy', 'foreign'] },
  { id: 'politics', label: 'Politics', category: 'Law & Government', icon: 'Scale', description: 'Constitutional affairs, campaigns, & policy analysis', accentColor: '#64748b', keywords: ['politics', 'policy', 'elections'] },
  { id: 'criminology', label: 'Criminology', category: 'Law & Government', icon: 'Shield', description: 'Criminal profiling, forensics, & penal analysis', accentColor: '#ef4444', keywords: ['criminology', 'forensics', 'penal'] },
  { id: 'police_services', label: 'Police Services', category: 'Law & Government', icon: 'Shield', description: 'Law enforcement, incident control, & traffic safety', accentColor: '#ef4444', keywords: ['police', 'cop', 'security'] },
  { id: 'defence', label: 'Defence', category: 'Law & Government', icon: 'Shield', description: 'National security operations & military systems', accentColor: '#64748b', keywords: ['defence', 'military', 'army'] },
  { id: 'intelligence', label: 'Intelligence', category: 'Law & Government', icon: 'Shield', description: 'Tactical information collection & homeland defense', accentColor: '#ef4444', keywords: ['intelligence', 'cia', 'espionage'] },

  // Education
  { id: 'teaching', label: 'Teaching', category: 'Education', icon: 'BookOpen', description: 'Explaining concepts, grading work, & lesson plans', accentColor: '#3b82f6', keywords: ['teaching', 'pedagogy', 'teacher'] },
  { id: 'education_technology', label: 'Education Technology', category: 'Education', icon: 'BookOpen', description: 'Online learning platforms & digital curricula', accentColor: '#8b5cf6', keywords: ['edtech', 'curriculum', 'lms'] },
  { id: 'academic_research', label: 'Academic Research', category: 'Education', icon: 'Microscope', description: 'Acquiring academic publications & literature synthesis', accentColor: '#06b6d4', keywords: ['academia', 'research', 'papers'] },
  { id: 'school_education', label: 'School Education', category: 'Education', icon: 'BookOpen', description: 'Primary and secondary student counseling tracks', accentColor: '#3b82f6', keywords: ['school', 'k12', 'primary'] },
  { id: 'university_education', label: 'University Education', category: 'Education', icon: 'BookOpen', description: 'Higher learning lecturing, courses, & thesis models', accentColor: '#3b82f6', keywords: ['university', 'college', 'lectures'] },
  { id: 'special_education', label: 'Special Education', category: 'Education', icon: 'BookOpen', description: 'Personalized instruction methods for diverse abilities', accentColor: '#3b82f6', keywords: ['special education', 'inclusion'] },

  // Arts & Design
  { id: 'graphic_design', label: 'Graphic Design', category: 'Arts & Design', icon: 'Palette', description: 'Vector graphics, layouts, and branding guides', accentColor: '#f43f5e', keywords: ['graphics', 'branding', 'layouts'] },
  { id: 'fashion_design', label: 'Fashion Design', category: 'Arts & Design', icon: 'Palette', description: 'Garments sketching, patterns, and textiles', accentColor: '#f43f5e', keywords: ['fashion', 'apparel', 'sketching'] },
  { id: 'interior_design', label: 'Interior Design', category: 'Arts & Design', icon: 'Palette', description: 'Interior spatial layouts & furniture styling', accentColor: '#f43f5e', keywords: ['interior', 'furniture', 'decor'] },
  { id: 'architecture', label: 'Architecture', category: 'Arts & Design', icon: 'Building', description: 'Structural designs, building plans, & CAD prints', accentColor: '#64748b', keywords: ['architecture', 'urban', 'blueprints'] },
  { id: 'animation', label: 'Animation', category: 'Arts & Design', icon: 'Palette', description: '3D character models creation & keyframe loops', accentColor: '#ec4899', keywords: ['animation', 'blender', 'rendering'] },
  { id: 'illustration', label: 'Illustration', category: 'Arts & Design', icon: 'Palette', description: 'Drawing book art, vectors, & character designs', accentColor: '#f43f5e', keywords: ['drawing', 'illustration', 'sketch'] },
  { id: 'fine_arts', label: 'Fine Arts', category: 'Arts & Design', icon: 'Palette', description: 'Canvas painting, clay sculpting, & art curation', accentColor: '#f43f5e', keywords: ['fine art', 'painting', 'sculpture'] },
  { id: 'photography', label: 'Photography', category: 'Arts & Design', icon: 'Palette', description: 'Camera lighting control, filters, and digital editing', accentColor: '#ec4899', keywords: ['photography', 'camera', 'photo'] },
  { id: 'film_making', label: 'Film Making', category: 'Arts & Design', icon: 'Palette', description: 'Cinematography composition & storyboard assembly', accentColor: '#ec4899', keywords: ['film', 'movie', 'directing'] },
  { id: 'music', label: 'Music', category: 'Arts & Design', icon: 'Palette', description: 'Instrumental play, songwriting, & sound mixes', accentColor: '#f43f5e', keywords: ['music', 'songwriting', 'guitar'] },
  { id: 'dance', label: 'Dance', category: 'Arts & Design', icon: 'Palette', description: 'Choreography steps mapping & stage play execution', accentColor: '#f43f5e', keywords: ['dance', 'choreography', 'ballet'] },
  { id: 'theatre', label: 'Theatre', category: 'Arts & Design', icon: 'Palette', description: 'Acting projection, script reading, & costume plans', accentColor: '#f43f5e', keywords: ['theatre', 'drama', 'acting'] },
  { id: 'creative_writing', label: 'Creative Writing', category: 'Arts & Design', icon: 'BookOpen', description: 'Fiction drafting, play scripts, & character stories', accentColor: '#3b82f6', keywords: ['writing', 'fiction', 'novel'] },

  // Media & Communication
  { id: 'journalism', label: 'Journalism', category: 'Media', icon: 'BookOpen', description: 'Reporting news, interview loops, & article prints', accentColor: '#3b82f6', keywords: ['journalism', 'news', 'press'] },
  { id: 'public_relations', label: 'Public Relations', category: 'Media', icon: 'Briefcase', description: 'Press statement drafts & public reputation management', accentColor: '#ec4899', keywords: ['pr', 'media', 'press'] },
  { id: 'content_creation', label: 'Content Creation', category: 'Media', icon: 'Palette', description: 'Writing blogs, editing clips, & podcast scripts', accentColor: '#ec4899', keywords: ['content', 'youtube', 'blog'] },
  { id: 'digital_marketing', label: 'Digital Marketing', category: 'Media', icon: 'Briefcase', description: 'SEO optimization, Google Ads, & analytics tracking', accentColor: '#ec4899', keywords: ['seo', 'marketing', 'ads'] },
  { id: 'social_media', label: 'Social Media', category: 'Media', icon: 'Briefcase', description: 'Audience building, schedules, & brand posts', accentColor: '#ec4899', keywords: ['facebook', 'instagram', 'twitter'] },
  { id: 'advertising', label: 'Advertising', category: 'Media', icon: 'Briefcase', description: 'Slogan scripting & poster design concepts', accentColor: '#ec4899', keywords: ['ads', 'copywriting', 'posters'] },
  { id: 'broadcasting', label: 'Broadcasting', category: 'Media', icon: 'BookOpen', description: 'TV studio layout controls & radio show hosting', accentColor: '#3b82f6', keywords: ['radio', 'broadcasting', 'tv'] },

  // Agriculture
  { id: 'agriculture', label: 'Agriculture', category: 'Agriculture', icon: 'BookOpen', description: 'Farming techniques, soil mechanics, & grain yields', accentColor: '#10b981', keywords: ['farming', 'soil', 'crops'] },
  { id: 'horticulture', label: 'Horticulture', category: 'Agriculture', icon: 'BookOpen', description: 'Greenhouse plant growing, flowers, & layout designs', accentColor: '#10b981', keywords: ['plants', 'greenhouse', 'garden'] },
  { id: 'forestry', label: 'Forestry', category: 'Agriculture', icon: 'BookOpen', description: 'Forest ecosystems conservation & timber logging', accentColor: '#10b981', keywords: ['forest', 'timber', 'ecology'] },
  { id: 'fisheries', label: 'Fisheries', category: 'Agriculture', icon: 'BookOpen', description: 'Fish hatcheries, aquaculture, & seafood biology', accentColor: '#3b82f6', keywords: ['aquaculture', 'fish', 'marine'] },
  { id: 'dairy_technology', label: 'Dairy Technology', category: 'Agriculture', icon: 'Microscope', description: 'Milk processing, safety standards, & dairy units', accentColor: '#10b981', keywords: ['dairy', 'milk', 'cheese'] },
  { id: 'food_technology', label: 'Food Technology', category: 'Agriculture', icon: 'Microscope', description: 'Food packaging chemistry, enzymes, & safety guidelines', accentColor: '#10b981', keywords: ['food technology', 'preservatives'] },

  // Hospitality
  { id: 'hotel_management', label: 'Hotel Management', category: 'Hospitality', icon: 'Briefcase', description: 'Front desk admin, lodging schedules, & hotel standards', accentColor: '#f59e0b', keywords: ['hotel', 'resort', 'service'] },
  { id: 'tourism', label: 'Tourism', category: 'Hospitality', icon: 'Globe', description: 'Tour itineraries planning & historic site guides', accentColor: '#3b82f6', keywords: ['tourism', 'travel', 'guide'] },
  { id: 'aviation', label: 'Aviation', category: 'Hospitality', icon: 'Briefcase', description: 'Airport operations, checkin grids, & airline schedules', accentColor: '#3b82f6', keywords: ['aviation', 'airport', 'airline'] },
  { id: 'cabin_crew', label: 'Cabin Crew', category: 'Hospitality', icon: 'Briefcase', description: 'Flight safety protocols & passenger cabin comfort', accentColor: '#3b82f6', keywords: ['cabin crew', 'flight', 'safety'] },
  { id: 'event_management', label: 'Event Management', category: 'Hospitality', icon: 'Briefcase', description: 'Corporate conference logistics & stage arrangements', accentColor: '#f59e0b', keywords: ['events', 'coordinator', 'wedding'] },
  { id: 'culinary_arts', label: 'Culinary Arts', category: 'Hospitality', icon: 'Palette', description: 'Menu blueprints, food plating, and restaurant standards', accentColor: '#f59e0b', keywords: ['chef', 'cooking', 'plating'] },
  { id: 'bakery', label: 'Bakery', category: 'Hospitality', icon: 'Palette', description: 'Pastries baking, oven timing, & retail packaging', accentColor: '#f59e0b', keywords: ['baking', 'pastry', 'oven'] },

  // Sports & Fitness
  { id: 'sports', label: 'Sports', category: 'Sports & Fitness', icon: 'Award', description: 'Athletic competitions play & tournament leagues', accentColor: '#f59e0b', keywords: ['sports', 'athletics', 'football'] },
  { id: 'fitness', label: 'Fitness', category: 'Sports & Fitness', icon: 'Award', description: 'Weight training protocols & cardio exercise schedules', accentColor: '#ef4444', keywords: ['gym', 'workout', 'cardio'] },
  { id: 'coaching', label: 'Coaching', category: 'Sports & Fitness', icon: 'Award', description: 'Instructing team tactics & analyzing match reviews', accentColor: '#3b82f6', keywords: ['coaching', 'tactics', 'train'] },
  { id: 'nutrition_sports', label: 'Nutrition', category: 'Sports & Fitness', icon: 'HeartPulse', description: 'Athletic recovery diets & protein plans calculation', accentColor: '#10b981', keywords: ['sports diet', 'recovery', 'hydration'] },
  { id: 'sports_science', label: 'Sports Science', category: 'Sports & Fitness', icon: 'Microscope', description: 'Muscle kinetics, biomechanics testing, & stamina physics', accentColor: '#06b6d4', keywords: ['kinesiology', 'biomechanics'] },
  { id: 'yoga', label: 'Yoga', category: 'Sports & Fitness', icon: 'Award', description: 'Flexibility poses, breath routines, & mindfulness', accentColor: '#10b981', keywords: ['yoga', 'mindfulness', 'postures'] },

  // Skilled Trades
  { id: 'electrician', label: 'Electrician', category: 'Skilled Trades', icon: 'Cpu', description: 'Wiring layout planning, safety fuses, & voltage checks', accentColor: '#f59e0b', keywords: ['electrician', 'wiring', 'voltage'] },
  { id: 'plumber', label: 'Plumber', category: 'Skilled Trades', icon: 'Cpu', description: 'Pipeline connections, valves mapping, & system drainage', accentColor: '#3b82f6', keywords: ['plumber', 'drainage', 'piping'] },
  { id: 'carpenter', label: 'Carpenter', category: 'Skilled Trades', icon: 'Building', description: 'Wood cutting blueprints, styling, & joints assembly', accentColor: '#64748b', keywords: ['carpentry', 'wood', 'furniture'] },
  { id: 'welder', label: 'Welder', category: 'Skilled Trades', icon: 'Cpu', description: 'Metal joints welding, gas torch safety, & metallurgy', accentColor: '#64748b', keywords: ['welding', 'metallurgy', 'gas'] },
  { id: 'mechanic', label: 'Mechanic', category: 'Skilled Trades', icon: 'Cpu', description: 'Automobile chassis diagnostics & motor parts repair', accentColor: '#64748b', keywords: ['mechanic', 'engines', 'gears'] },
  { id: 'cnc', label: 'CNC', category: 'Skilled Trades', icon: 'Cpu', description: 'CNC tool coding, lathe operations, & metal milling', accentColor: '#64748b', keywords: ['cnc', 'milling', 'lathe'] },
  { id: 'hvac', label: 'HVAC', category: 'Skilled Trades', icon: 'Cpu', description: 'Air conditions coolant check, vents, & heating controls', accentColor: '#64748b', keywords: ['hvac', 'chillers', 'heating'] },
  { id: 'construction_trades', label: 'Construction', category: 'Skilled Trades', icon: 'Building', description: 'Masonry structures building, scaffolding, & logistics', accentColor: '#64748b', keywords: ['construction', 'masonry', 'scaffold'] },

  // Creative Careers
  { id: 'youtube', label: 'YouTube', category: 'Creative Careers', icon: 'Palette', description: 'Scripting episodes, camera rendering, & channel metrics', accentColor: '#ef4444', keywords: ['youtube', 'vlog', 'channel'] },
  { id: 'gaming_creative', label: 'Gaming', category: 'Creative Careers', icon: 'Rocket', description: 'Interactive gaming matches live stream & communities', accentColor: '#ec4899', keywords: ['gaming', 'twitch', 'livestream'] },
  { id: 'esports', label: 'Esports', category: 'Creative Careers', icon: 'Award', description: 'Pro tournament preparation & esports teams coaching', accentColor: '#ec4899', keywords: ['esports', 'tournament', 'matches'] },
  { id: 'influencer', label: 'Influencer', category: 'Creative Careers', icon: 'Palette', description: 'Product sponsorships, brand campaigns, & posts reach', accentColor: '#ec4899', keywords: ['influencer', 'sponsor', 'brand'] },
  { id: 'podcasting', label: 'Podcasting', category: 'Creative Careers', icon: 'Palette', description: 'Vocal setups record, interview scripts, & RSS feeds', accentColor: '#3b82f6', keywords: ['podcasting', 'audio', 'spotify'] },
  { id: 'blogging', label: 'Blogging', category: 'Creative Careers', icon: 'BookOpen', description: 'SEO article writing, WordPress, & newsletter schedules', accentColor: '#3b82f6', keywords: ['blogging', 'articles', 'subscribes'] },
  { id: 'writing_creative', label: 'Writing', category: 'Creative Careers', icon: 'BookOpen', description: 'Novels drafts, screenplays writing, & poetry collections', accentColor: '#3b82f6', keywords: ['poetry', 'scripts', 'creative'] },

  // Others
  { id: 'ngo', label: 'NGO', category: 'Others', icon: 'Briefcase', description: 'Public relief campaigns & non-profit finance control', accentColor: '#10b981', keywords: ['ngo', 'charity', 'fundraising'] },
  { id: 'social_work', label: 'Social Work', category: 'Others', icon: 'HeartPulse', description: 'Welfare checks, family counseling, & housing aids', accentColor: '#ef4444', keywords: ['welfare', 'housing', 'counseling'] },
  { id: 'religious_studies', label: 'Religious Studies', category: 'Others', icon: 'BookOpen', description: 'Comparative theology, ancient texts, & ritual contexts', accentColor: '#8b5cf6', keywords: ['theology', 'ancient', 'texts'] },
  { id: 'environmental_activism', label: 'Environmental Activism', category: 'Others', icon: 'BookOpen', description: 'Organizing climate rallies, petitions, & sustainability', accentColor: '#10b981', keywords: ['activism', 'climate', 'greenpeace'] },
  { id: 'sustainability_others', label: 'Sustainability', category: 'Others', icon: 'BookOpen', description: 'Carbon footprint metrics & renewable grid models', accentColor: '#10b981', keywords: ['sustainability', 'recycle', 'eco'] },
  { id: 'wildlife_conservation', label: 'Wildlife Conservation', category: 'Others', icon: 'BookOpen', description: 'Endangered fauna sanctuaries & biosphere protection', accentColor: '#10b981', keywords: ['wildlife', 'conservation', 'fauna'] }
];

export const STEP3_TECHNICAL_SKILLS: TaxonomyItem[] = [
  { id: 'programming', label: 'Programming', category: 'Technical', icon: 'Code2', description: 'Coding in C++, C#, JS, Go, or Rust', accentColor: '#10b981', keywords: ['programming', 'coding'] },
  { id: 'ai', label: 'AI', category: 'Technical', icon: 'Brain', description: 'Machine intelligence systems', accentColor: '#8b5cf6', keywords: ['ai', 'intelligence'] },
  { id: 'python', label: 'Python', category: 'Technical', icon: 'Code2', description: 'Core backend, scripting, and data pipelines', accentColor: '#10b981', keywords: ['python', 'scripting'] },
  { id: 'java', label: 'Java', category: 'Technical', icon: 'Code2', description: 'Enterprise backend systems development', accentColor: '#10b981', keywords: ['java'] },
  { id: 'react', label: 'React', category: 'Technical', icon: 'Code2', description: 'Frontend client UI layouts library', accentColor: '#10b981', keywords: ['react', 'js'] },
  { id: 'flutter', label: 'Flutter', category: 'Technical', icon: 'Code2', description: 'Cross-platform app development', accentColor: '#10b981', keywords: ['flutter', 'dart'] },
  { id: 'cpp', label: 'C++', category: 'Technical', icon: 'Code2', description: 'Low-level systems programming language', accentColor: '#10b981', keywords: ['c++', 'cpp'] },
  { id: 'cybersecurity', label: 'Cybersecurity', category: 'Technical', icon: 'Shield', description: 'Information integrity & network defense protection', accentColor: '#ef4444', keywords: ['security', 'cyber', 'pentest'] },
  { id: 'networking', label: 'Networking', category: 'Technical', icon: 'Shield', description: 'Routing protocols & network admin controls', accentColor: '#ef4444', keywords: ['networking', 'routers'] },
  { id: 'cloud', label: 'Cloud', category: 'Technical', icon: 'Cloud', description: 'Server architectures & virtual resources', accentColor: '#3b82f6', keywords: ['cloud', 'aws', 'azure'] },
  { id: 'autocad', label: 'AutoCAD', category: 'Technical', icon: 'Building', description: 'Aided blueprints rendering calculations', accentColor: '#64748b', keywords: ['autocad', 'drafting'] },
  { id: 'solidworks', label: 'SolidWorks', category: 'Technical', icon: 'Building', description: '3D solid modeling CAD design tool', accentColor: '#64748b', keywords: ['solidworks', 'mechanical'] },
  { id: 'matlab', label: 'MATLAB', category: 'Technical', icon: 'Cpu', description: 'Numerical computing environment & matrix math', accentColor: '#f59e0b', keywords: ['matlab', 'matrices'] },
  { id: 'plc', label: 'PLC', category: 'Technical', icon: 'Cpu', description: 'Programmable logic controllers programming', accentColor: '#f59e0b', keywords: ['plc', 'industrial'] },
  { id: 'circuit_design', label: 'Circuit Design', category: 'Technical', icon: 'Cpu', description: 'Analog & digital PCB circuitry blueprints design', accentColor: '#f59e0b', keywords: ['pcb', 'electronics'] },
  { id: 'clinical_diagnosis', label: 'Clinical Diagnosis', category: 'Technical', icon: 'HeartPulse', description: 'Symptom matching & clinical pathway selection', accentColor: '#ef4444', keywords: ['diagnosis', 'symptoms'] },
  { id: 'patient_care', label: 'Patient Care', category: 'Technical', icon: 'HeartPulse', description: 'Clinical nursing and hospital ward support', accentColor: '#ef4444', keywords: ['patient', 'nursing'] },
  { id: 'accounting', label: 'Accounting', category: 'Technical', icon: 'TrendingUp', description: 'Financial books audits & logs entry', accentColor: '#10b981', keywords: ['accounting', 'tax', 'audit'] },
  { id: 'excel', label: 'Excel', category: 'Technical', icon: 'TrendingUp', description: 'Spreadsheets, formulas, and data analysis', accentColor: '#10b981', keywords: ['excel', 'sheets'] },
  { id: 'sap', label: 'SAP', category: 'Technical', icon: 'Briefcase', description: 'Enterprise resource planning administration', accentColor: '#8b5cf6', keywords: ['sap', 'erp'] },
  { id: 'tally', label: 'Tally', category: 'Technical', icon: 'TrendingUp', description: 'Tally software accounting entry ledger control', accentColor: '#10b981', keywords: ['tally', 'accounting'] },
  { id: 'cooking', label: 'Cooking', category: 'Technical', icon: 'Palette', description: 'Culinary arts, food hygiene, & recipe preparation', accentColor: '#f59e0b', keywords: ['cooking', 'chef'] },
  { id: 'photography', label: 'Photography', category: 'Technical', icon: 'Palette', description: 'Digital camera operations & studio lighting', accentColor: '#f43f5e', keywords: ['photography', 'camera'] },
  { id: 'video_editing', label: 'Video Editing', category: 'Technical', icon: 'Palette', description: 'VFX special effects rendering and cut assemblies', accentColor: '#ec4899', keywords: ['video', 'editing'] },
  { id: 'graphic_design', label: 'Graphic Design', category: 'Technical', icon: 'Palette', description: 'Vector assets, brand guides, & graphics layout', accentColor: '#f43f5e', keywords: ['graphic', 'illustrations'] },
  { id: 'fashion_illustration', label: 'Fashion Illustration', category: 'Technical', icon: 'Palette', description: 'Apparel sketch layout design & color palettes', accentColor: '#f43f5e', keywords: ['fashion', 'sketching'] },
  { id: 'legal_drafting', label: 'Legal Drafting', category: 'Technical', icon: 'Scale', description: 'Drafting petitions, court briefs, & company contracts', accentColor: '#f97316', keywords: ['legal', 'drafting', 'briefs'] },
  { id: 'research', label: 'Research', category: 'Technical', icon: 'Microscope', description: 'Scientific information extraction & analysis', accentColor: '#06b6d4', keywords: ['research', 'scientific'] },
  { id: 'statistical_analysis', label: 'Statistical Analysis', category: 'Technical', icon: 'TrendingUp', description: 'R-code regression models & SPSS calculations', accentColor: '#3b82f6', keywords: ['statistics', 'spss'] },
  { id: 'gis', label: 'GIS', category: 'Technical', icon: 'Building', description: 'Geographic information mapping & telemetry checks', accentColor: '#64748b', keywords: ['gis', 'mapping', 'geography'] },
  { id: 'laboratory_skills', label: 'Laboratory Skills', category: 'Technical', icon: 'Microscope', description: 'Specimen titration, lab cultures, & safety protocols', accentColor: '#06b6d4', keywords: ['titration', 'lab', 'biology'] },
  { id: 'cad', label: 'CAD', category: 'Technical', icon: 'Building', description: 'Computer-aided engineering blue prints design', accentColor: '#64748b', keywords: ['cad', 'drafting'] },
  { id: 'revit', label: 'Revit', category: 'Technical', icon: 'Building', description: 'Autodesk Revit BIM architecture design modeling', accentColor: '#64748b', keywords: ['revit', 'bim'] },
  { id: 'figma', label: 'Figma', category: 'Technical', icon: 'Palette', description: 'Collaborative client UI designs & layouts prototyping', accentColor: '#f43f5e', keywords: ['figma', 'ui', 'ux'] },
  { id: 'blender', label: 'Blender', category: 'Technical', icon: 'Palette', description: '3D models modeling, bones setups, & textures design', accentColor: '#ec4899', keywords: ['blender', '3d', 'render'] },
  { id: 'music_production', label: 'Music Production', category: 'Technical', icon: 'Palette', description: 'DAW software sound editing, loops mix, & vocal setup', accentColor: '#f43f5e', keywords: ['daw', 'music', 'mix'] },
  { id: 'language_translation', label: 'Language Translation', category: 'Technical', icon: 'Globe', description: 'High fidelity cross language documents translation', accentColor: '#3b82f6', keywords: ['translation', 'languages'] },
  { id: 'project_management', label: 'Project Management', category: 'Technical', icon: 'Briefcase', description: 'Administering milestones, schedules, and deliverables', accentColor: '#8b5cf6', keywords: ['project', 'management', 'pm'] },
  { id: 'sales', label: 'Sales', category: 'Technical', icon: 'Briefcase', description: 'Customer relations & revenue acquisition pipelines', accentColor: '#10b981', keywords: ['sales', 'leads', 'revenue'] },
  { id: 'marketing', label: 'Marketing', category: 'Technical', icon: 'Briefcase', description: 'Campaign administration & digital advertisements', accentColor: '#ec4899', keywords: ['marketing', 'advertising'] },
  { id: 'negotiation', label: 'Negotiation', category: 'Technical', icon: 'Scale', description: 'Facilitating discussions to reach agreements', accentColor: '#f97316', keywords: ['negotiation', 'contracts'] },
  { id: 'business_strategy', label: 'Business Strategy', category: 'Technical', icon: 'Briefcase', description: 'Formulating strategic execution frameworks', accentColor: '#8b5cf6', keywords: ['strategy', 'business'] },
  { id: 'machine_operation', label: 'Machine Operation', category: 'Technical', icon: 'Cpu', description: 'Industrial tool assemblies controls & safety audits', accentColor: '#64748b', keywords: ['machinery', 'lathe'] },
  { id: 'agriculture_management', label: 'Agriculture Management', category: 'Technical', icon: 'BookOpen', description: 'Crop yields tracking & agriculture inventory budgets', accentColor: '#10b981', keywords: ['farming', 'crop'] },
  { id: 'food_safety', label: 'Food Safety', category: 'Technical', icon: 'Microscope', description: 'Food hygiene certifications & microbial checks', accentColor: '#10b981', keywords: ['hygiene', 'safety'] }
];

export const STEP3_SOFT_SKILLS: TaxonomyItem[] = [
  { id: 'communication', label: 'Communication', category: 'Soft Skill', icon: 'BookOpen', description: 'Expressing ideas clearly in verbal & written forms', accentColor: '#3b82f6', keywords: ['communication', 'verbal'] },
  { id: 'leadership', label: 'Leadership', category: 'Soft Skill', icon: 'Award', description: 'Guiding teams, managing roles, and strategy execution', accentColor: '#8b5cf6', keywords: ['leadership', 'management'] },
  { id: 'critical_thinking', label: 'Critical Thinking', category: 'Soft Skill', icon: 'Brain', description: 'Objective analysis to make logical decisions', accentColor: '#8b5cf6', keywords: ['critical', 'thinking'] },
  { id: 'problem_solving', label: 'Problem Solving', category: 'Soft Skill', icon: 'Brain', description: 'Analytical approach to complex diagnostics', accentColor: '#8b5cf6', keywords: ['problem', 'solving'] },
  { id: 'teamwork', label: 'Teamwork', category: 'Soft Skill', icon: 'Briefcase', description: 'Collaborating effectively with diverse team groups', accentColor: '#3b82f6', keywords: ['teamwork', 'team', 'collaboration'] },
  { id: 'presentation', label: 'Presentation', category: 'Soft Skill', icon: 'BookOpen', description: 'Public speeches delivery & slides design layout', accentColor: '#3b82f6', keywords: ['presentation', 'speaking'] },
  { id: 'negotiation', label: 'Negotiation', category: 'Soft Skill', icon: 'Scale', description: 'Facilitating discussions to reach agreements', accentColor: '#f97316', keywords: ['negotiation', 'contracts'] },
  { id: 'creativity', label: 'Creativity', category: 'Soft Skill', icon: 'Palette', description: 'Thinking outside the box to design fresh concepts', accentColor: '#f43f5e', keywords: ['creativity', 'creative', 'innovation'] },
  { id: 'adaptability', label: 'Adaptability', category: 'Soft Skill', icon: 'RefreshCw', description: 'Pivoting effectively in dynamic environments', accentColor: '#f97316', keywords: ['adaptability', 'flexible', 'change'] },
  { id: 'time_management', label: 'Time Management', category: 'Soft Skill', icon: 'RefreshCw', description: 'Organizing tasks & executing under schedules', accentColor: '#f97316', keywords: ['time', 'schedules'] },
  { id: 'public_speaking', label: 'Public Speaking', category: 'Soft Skill', icon: 'BookOpen', description: 'Presenting insights cleanly in front of audiences', accentColor: '#3b82f6', keywords: ['speaking', 'audience'] },
  { id: 'decision_making', label: 'Decision Making', category: 'Soft Skill', icon: 'Brain', description: 'Selecting optimal solutions based on metrics analysis', accentColor: '#8b5cf6', keywords: ['decision', 'choice', 'decide'] },
  { id: 'customer_service', label: 'Customer Service', category: 'Soft Skill', icon: 'Briefcase', description: 'Resolving user issues with helpful guidelines', accentColor: '#10b981', keywords: ['customer', 'support'] },
  { id: 'conflict_resolution', label: 'Conflict Resolution', category: 'Soft Skill', icon: 'Scale', description: 'Mediating and aligning opposing perspectives peacefully', accentColor: '#f97316', keywords: ['conflict', 'resolution', 'mediate'] },
  { id: 'analytical_thinking', label: 'Analytical Thinking', category: 'Soft Skill', icon: 'Brain', description: 'Deconstructing complex parameters into logical components', accentColor: '#8b5cf6', keywords: ['analytical', 'analysis', 'logic'] },
  { id: 'teaching', label: 'Teaching', category: 'Soft Skill', icon: 'BookOpen', description: 'Explaining ideas & mentoring junior associates', accentColor: '#3b82f6', keywords: ['teaching', 'mentoring'] }
];

export const STEP3_EXPERIENCES: TaxonomyItem[] = [
  { id: 'no_experience', label: 'No Experience', category: 'Experience', icon: 'X', description: 'Entry level, starting a brand new path', accentColor: '#ef4444', keywords: ['none', 'fresh', 'beginner'] },
  { id: 'internship', label: 'Internship', category: 'Experience', icon: 'Briefcase', description: 'Temporary training and industry practice', accentColor: '#10b981', keywords: ['intern', 'training'] },
  { id: 'part_time', label: 'Part Time', category: 'Experience', icon: 'Briefcase', description: 'Flexible employment or concurrent roles', accentColor: '#3b82f6', keywords: ['parttime', 'flexible'] },
  { id: 'full_time', label: 'Full Time', category: 'Experience', icon: 'Briefcase', description: 'Active professional career development', accentColor: '#3b82f6', keywords: ['fulltime', 'regular'] },
  { id: 'freelancer', label: 'Freelancer', category: 'Experience', icon: 'Zap', description: 'Contract assignments for diverse clients', accentColor: '#06b6d4', keywords: ['freelance', 'contracts'] },
  { id: 'self_employed', label: 'Self Employed', category: 'Experience', icon: 'Zap', description: 'Direct independent professional practice', accentColor: '#06b6d4', keywords: ['independent', 'sole'] },
  { id: 'entrepreneur', label: 'Entrepreneur', category: 'Experience', icon: 'Rocket', description: 'Founding products and starting companies', accentColor: '#ec4899', keywords: ['founder', 'startup'] },
  { id: 'research', label: 'Research', category: 'Experience', icon: 'Microscope', description: 'Academic and scientific investigation roles', accentColor: '#06b6d4', keywords: ['academic', 'papers'] },
  { id: 'volunteer', label: 'Volunteer', category: 'Experience', icon: 'HeartPulse', description: 'Charitable or community service activities', accentColor: '#ef4444', keywords: ['charity', 'community'] },
  { id: 'other', label: 'Other', category: 'Experience', icon: 'Plus', description: 'Unlisted types of career background', accentColor: '#64748b', keywords: ['unlisted', 'other'] }
];

export const STEP3_INDUSTRIES: string[] = [
  "Technology",
  "Healthcare",
  "Manufacturing",
  "Construction",
  "Automobile",
  "Education",
  "Finance",
  "Government",
  "Defence",
  "Legal",
  "Agriculture",
  "Energy",
  "Oil & Gas",
  "Mining",
  "Telecommunications",
  "Retail",
  "Hospitality",
  "Media",
  "Entertainment",
  "Sports",
  "Fashion",
  "Transportation",
  "Aviation",
  "Space",
  "Marine",
  "Research",
  "Consulting",
  "Biotechnology",
  "Pharmaceuticals",
  "Food",
  "NGO",
  "Real Estate",
  "Insurance",
  "Logistics",
  "E-Commerce",
  "Renewable Energy"
];

export const STEP3_DREAM_CAREERS: string[] = [
  "Doctor",
  "Surgeon",
  "Dentist",
  "Nurse",
  "Pharmacist",
  "Psychologist",
  "Veterinarian",
  "Teacher",
  "Professor",
  "Scientist",
  "Researcher",
  "Mechanical Engineer",
  "Civil Engineer",
  "Electrical Engineer",
  "Architect",
  "Pilot",
  "Air Traffic Controller",
  "Lawyer",
  "Judge",
  "Chartered Accountant",
  "Financial Analyst",
  "Investment Banker",
  "Software Engineer",
  "AI Engineer",
  "ML Engineer",
  "Data Scientist",
  "Cybersecurity Analyst",
  "UI Designer",
  "UX Designer",
  "Product Manager",
  "Chef",
  "Hotel Manager",
  "Fashion Designer",
  "Interior Designer",
  "Animator",
  "Film Director",
  "Actor",
  "Musician",
  "Journalist",
  "Content Creator",
  "Farmer",
  "Agricultural Scientist",
  "Police Officer",
  "Army Officer",
  "IAS Officer",
  "IPS Officer",
  "IFS Officer",
  "Entrepreneur",
  "Business Owner",
  "Marketing Manager",
  "Sales Manager",
  "Supply Chain Manager",
  "Game Developer",
  "Robotics Engineer",
  "Cloud Engineer",
  "Blockchain Developer",
  "Electrician",
  "Welder",
  "Mechanic",
  "Fitness Trainer",
  "Sports Coach",
  "Nutritionist",
  "Marine Engineer",
  "Astronaut",
  "Space Scientist",
  "Environmental Scientist",
  "Biotechnologist",
  "Genetic Engineer",
  "Marine Biologist",
  "Social Worker",
  "NGO Founder",
  "Photographer",
  "Event Planner",
  "Digital Creator"
];

export const CAREER_SKILL_MAPPING: Record<string, string[]> = {
  'doctor': ['Clinical Diagnosis', 'Patient Care', 'Medicine', 'Critical Thinking', 'Communication'],
  'surgeon': ['Surgery', 'Clinical Diagnosis', 'Patient Care', 'Critical Thinking', 'Leadership'],
  'dentist': ['Dentistry', 'Clinical Diagnosis', 'Patient Care', 'Communication', 'Manual Dexterity'],
  'nurse': ['Patient Care', 'Clinical Diagnosis', 'Medicine', 'Communication', 'Teamwork'],
  'pharmacist': ['Pharmacology', 'Patient Care', 'Communication', 'Math', 'Analytical Thinking'],
  'psychologist': ['Psychology', 'Communication', 'Critical Thinking', 'Empathy', 'Active Listening'],
  'veterinarian': ['Veterinary Science', 'Patient Care', 'Biology', 'Communication', 'Problem Solving'],
  'teacher': ['Teaching', 'Public Speaking', 'Leadership', 'Presentation', 'Communication'],
  'professor': ['Teaching', 'Research', 'Public Speaking', 'Presentation', 'Writing'],
  'scientist': ['Research', 'Physics', 'Chemistry', 'Biology', 'Statistical Analysis', 'Laboratory Skills'],
  'researcher': ['Research', 'Statistical Analysis', 'Writing', 'Critical Thinking', 'Analytical Thinking'],
  'mechanical_engineer': ['Mechanical Repair', 'CAD', 'AutoCAD', 'SolidWorks', 'MATLAB', 'Problem Solving'],
  'civil_engineer': ['Civil Engineering', 'CAD', 'AutoCAD', 'Revit', 'Project Management'],
  'electrical_engineer': ['Electrical Maintenance', 'Circuit Design', 'MATLAB', 'PLC', 'Problem Solving'],
  'architect': ['Architecture', 'CAD', 'AutoCAD', 'Revit', 'Figma', 'Creativity'],
  'pilot': ['Aviation', 'Critical Thinking', 'Decision Making', 'Communication', 'Problem Solving'],
  'air_traffic_controller': ['Air Traffic Control', 'Critical Thinking', 'Decision Making', 'Communication', 'Attention to Detail'],
  'lawyer': ['Law', 'Legal Drafting', 'Negotiation', 'Public Speaking', 'Critical Thinking'],
  'judge': ['Judiciary', 'Law', 'Critical Thinking', 'Decision Making', 'Analytical Thinking'],
  'chartered_accountant': ['Accounting', 'Excel', 'Tally', 'SAP', 'Finance', 'Analytical Thinking'],
  'financial_analyst': ['Finance', 'Excel', 'SAP', 'Statistical Analysis', 'Business Strategy'],
  'investment_banker': ['Finance', 'Negotiation', 'Excel', 'Business Strategy', 'Presentation'],
  'software_engineer': ['Programming', 'Python', 'Java', 'React', 'Cloud', 'Networking', 'Problem Solving'],
  'ai_engineer': ['AI', 'Python', 'Machine Learning', 'Artificial Intelligence', 'Programming'],
  'ml_engineer': ['Machine Learning', 'Python', 'Artificial Intelligence', 'Programming', 'Statistical Analysis'],
  'data_scientist': ['Data Science', 'Python', 'Excel', 'Statistical Analysis', 'GIS'],
  'cybersecurity_analyst': ['Cybersecurity', 'Networking', 'Cloud', 'Analytical Thinking', 'Problem Solving'],
  'ui_designer': ['UI/UX', 'Figma', 'Blender', 'Graphic Design', 'Creativity'],
  'ux_designer': ['UI/UX', 'Figma', 'Research', 'Analytical Thinking', 'Communication'],
  'product_manager': ['Project Management', 'Business Strategy', 'Leadership', 'Negotiation', 'Communication'],
  'chef': ['Cooking', 'Culinary Arts', 'Time Management', 'Creativity', 'Teamwork'],
  'hotel_manager': ['Hotel Management', 'Customer Service', 'Leadership', 'Time Management', 'Negotiation'],
  'fashion_designer': ['Fashion Design', 'Fashion Illustration', 'Creativity', 'Graphic Design', 'Communication'],
  'interior_designer': ['Interior Design', 'CAD', 'Revit', 'Figma', 'Creativity'],
  'animator': ['Animation', 'Blender', 'Graphic Design', 'Figma', 'Creativity'],
  'film_director': ['Film Making', 'Video Editing', 'Leadership', 'Creativity', 'Communication'],
  'actor': ['Acting', 'Public Speaking', 'Creativity', 'Communication', 'Adaptability'],
  'musician': ['Music Production', 'Creativity', 'Presentation', 'Performance', 'Time Management'],
  'journalist': ['Journalism', 'Writing', 'Public Speaking', 'Research', 'Communication'],
  'content_creator': ['Content Creation', 'Video Editing', 'Photography', 'Digital Marketing', 'Social Media'],
  'farmer': ['Agriculture', 'Agriculture Management', 'Machine Operation', 'Adaptability', 'Time Management'],
  'agricultural_scientist': ['Agriculture', 'Research', 'Biology', 'Microscope', 'Statistical Analysis'],
  'police_officer': ['Police Services', 'Shield', 'Leadership', 'Decision Making', 'Conflict Resolution'],
  'army_officer': ['Defence', 'Shield', 'Leadership', 'Decision Making', 'Physical Fitness'],
  'ias_officer': ['Civil Services', 'Public Administration', 'Leadership', 'Policy Formulation', 'Communication'],
  'ips_officer': ['Civil Services', 'Law Enforcement', 'Leadership', 'Decision Making', 'Conflict Resolution'],
  'ifs_officer': ['Diplomacy', 'Civil Services', 'Negotiation', 'Foreign Languages', 'Communication'],
  'entrepreneur': ['Entrepreneurship', 'Business Strategy', 'Sales', 'Marketing', 'Negotiation'],
  'business_owner': ['Business Strategy', 'Sales', 'Marketing', 'Accounting', 'Project Management'],
  'marketing_manager': ['Marketing', 'Digital Marketing', 'Advertising', 'Sales', 'Creative Thinking'],
  'sales_manager': ['Sales', 'Negotiation', 'Communication', 'Business Strategy', 'Leadership'],
  'supply_chain_manager': ['Supply Chain', 'Logistics', 'SAP', 'Negotiation', 'Analytical Thinking'],
  'game_developer': ['Game Development', 'Programming', 'C++', 'Blender', 'Creativity'],
  'robotics_engineer': ['Robotics', 'Embedded Systems', 'PLC', 'SolidWorks', 'MATLAB'],
  'cloud_engineer': ['Cloud Computing', 'Networking', 'Cloud', 'DevOps', 'Programming'],
  'blockchain_developer': ['Blockchain', 'Cryptography', 'Programming', 'C++', 'Analytical Thinking'],
  'electrician': ['Electrician', 'Circuit Design', 'PLC', 'Machine Operation', 'Problem Solving'],
  'welder': ['Welder', 'Machine Operation', 'Physical Stamina', 'Attention to Detail'],
  'mechanic': ['Mechanic', 'Machine Operation', 'SolidWorks', 'Mechanical Repair', 'Problem Solving'],
  'fitness_trainer': ['Fitness', 'Nutrition', 'Coaching', 'Customer Service', 'Communication'],
  'sports_coach': ['Sports', 'Coaching', 'Leadership', 'Teamwork', 'Communication'],
  'nutritionist': ['Nutrition', 'Public Health', 'Communication', 'Analytical Thinking', 'Active Listening'],
  'marine_engineer': ['Marine Engineering', 'Machine Operation', 'SolidWorks', 'Problem Solving', 'Teamwork'],
  'astronaut': ['Space Science', 'Aviation', 'Critical Thinking', 'Adaptability', 'Physical Stamina'],
  'space_scientist': ['Space Science', 'Astronomy', 'Physics', 'Research', 'Statistical Analysis'],
  'environmental_scientist': ['Environmental Science', 'GIS', 'Research', 'Sustainability', 'Analytical Thinking'],
  'biotechnologist': ['Biotechnology', 'Biology', 'Laboratory Skills', 'Microscope', 'Research'],
  'genetic_engineer': ['Genetics', 'Biotechnology', 'Laboratory Skills', 'Research', 'Statistical Analysis'],
  'marine_biologist': ['Biology', 'Oceanography', 'Research', 'Laboratory Skills', 'Active Listening'],
  'social_worker': ['Social Work', 'NGO', 'Communication', 'Active Listening', 'Conflict Resolution'],
  'ngo_founder': ['NGO', 'Entrepreneurship', 'Leadership', 'Negotiation', 'Project Management'],
  'photographer': ['Photography', 'Video Editing', 'Figma', 'Creativity', 'Marketing'],
  'event_planner': ['Event Management', 'Negotiation', 'Time Management', 'Budgeting', 'Communication'],
  'digital_creator': ['YouTube', 'Gaming', 'Influencer', 'Content Creation', 'Digital Marketing']
};

export const getTypicalSkills = (careerIdOrLabel: string): string[] => {
  const norm = (careerIdOrLabel || '').toLowerCase().replace(/[^a-z0-9]+/g, '_');
  
  if (CAREER_SKILL_MAPPING[norm]) {
    return CAREER_SKILL_MAPPING[norm];
  }
  
  const matchKey = Object.keys(CAREER_SKILL_MAPPING).find(key => norm.includes(key) || key.includes(norm));
  if (matchKey) {
    return CAREER_SKILL_MAPPING[matchKey];
  }
  
  return ['Communication', 'Problem Solving', 'Leadership', 'Critical Thinking', 'Time Management'];
};


