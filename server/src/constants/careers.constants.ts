import config from '../config/env';

export interface CareerMetadata {
  id: string;
  title: string;
  category: string;
  description: string;
  overview?: string;
  education: string;
  skills: string[];
  responsibilities: string[];
  relevantDegrees?: string[];
  relevantSubjects?: string[];
  entranceExams?: string[];
  careerPathway?: string;
  salaryRange: string;
  growthRate: string;
  demandLevel: string;
}

export const STEP3_DREAM_CAREERS = [
  "Doctor", "Surgeon", "Dentist", "Nurse", "Pharmacist", "Psychologist", "Veterinarian",
  "Teacher", "Professor", "Scientist", "Researcher", "Mechanical Engineer", "Civil Engineer",
  "Electrical Engineer", "Architect", "Pilot", "Air Traffic Controller", "Lawyer", "Judge",
  "Chartered Accountant", "Financial Analyst", "Investment Banker", "Software Engineer",
  "AI Engineer", "ML Engineer", "Data Scientist", "Cybersecurity Analyst", "UI Designer",
  "UX Designer", "Product Manager", "Chef", "Hotel Manager", "Fashion Designer", "Interior Designer",
  "Animator", "Film Director", "Actor", "Musician", "Journalist", "Content Creator", "Farmer",
  "Agricultural Scientist", "Police Officer", "Army Officer", "IAS Officer", "IPS Officer",
  "IFS Officer", "Entrepreneur", "Business Owner", "Marketing Manager", "Sales Manager",
  "Supply Chain Manager", "Game Developer", "Robotics Engineer", "Cloud Engineer",
  "Blockchain Developer", "Electrician", "Welder", "Mechanic", "Fitness Trainer",
  "Sports Coach", "Nutritionist", "Marine Engineer", "Astronaut", "Space Scientist",
  "Environmental Scientist", "Biotechnologist", "Genetic Engineer", "Marine Biologist",
  "Social Worker", "NGO Founder", "Photographer", "Event Planner", "Digital Creator"
];

export const CAREER_SKILL_MAPPING: Record<string, string[]> = {
  'doctor': ['Clinical Diagnosis', 'Patient Care', 'Medicine', 'Critical Thinking', 'Communication', 'Medical Ethics'],
  'surgeon': ['Surgery', 'Clinical Diagnosis', 'Patient Care', 'Critical Thinking', 'Leadership', 'Manual Precision'],
  'dentist': ['Dentistry', 'Clinical Diagnosis', 'Patient Care', 'Communication', 'Manual Dexterity', 'Oral Surgery'],
  'nurse': ['Patient Care', 'Clinical Diagnosis', 'Medicine', 'Communication', 'Teamwork', 'Critical Care'],
  'pharmacist': ['Pharmacology', 'Patient Care', 'Communication', 'Math', 'Analytical Thinking', 'Drug Formulation'],
  'psychologist': ['Psychology', 'Communication', 'Critical Thinking', 'Empathy', 'Active Listening', 'Counseling'],
  'veterinarian': ['Veterinary Science', 'Patient Care', 'Biology', 'Communication', 'Problem Solving', 'Animal Surgery'],
  'teacher': ['Teaching', 'Public Speaking', 'Leadership', 'Presentation', 'Communication', 'Curriculum Design'],
  'professor': ['Teaching', 'Research', 'Public Speaking', 'Presentation', 'Writing', 'Academic Mentorship'],
  'scientist': ['Research', 'Physics', 'Chemistry', 'Biology', 'Statistical Analysis', 'Laboratory Skills'],
  'researcher': ['Research', 'Statistical Analysis', 'Writing', 'Critical Thinking', 'Analytical Thinking', 'Data Modeling'],
  'mechanical_engineer': ['Mechanical Repair', 'CAD', 'AutoCAD', 'SolidWorks', 'MATLAB', 'Problem Solving', 'Thermodynamics'],
  'civil_engineer': ['Civil Engineering', 'CAD', 'AutoCAD', 'Revit', 'Project Management', 'Structural Analysis'],
  'electrical_engineer': ['Electrical Maintenance', 'Circuit Design', 'MATLAB', 'PLC', 'Problem Solving', 'Power Systems'],
  'architect': ['Architecture', 'CAD', 'AutoCAD', 'Revit', 'Figma', 'Creativity', '3D Modeling'],
  'pilot': ['Aviation', 'Critical Thinking', 'Decision Making', 'Communication', 'Problem Solving', 'Navigation'],
  'air_traffic_controller': ['Air Traffic Control', 'Critical Thinking', 'Decision Making', 'Communication', 'Attention to Detail'],
  'lawyer': ['Law', 'Legal Drafting', 'Negotiation', 'Public Speaking', 'Critical Thinking', 'Constitutional Law'],
  'judge': ['Judiciary', 'Law', 'Critical Thinking', 'Decision Making', 'Analytical Thinking', 'Legal Precedent'],
  'chartered_accountant': ['Accounting', 'Excel', 'Tally', 'SAP', 'Finance', 'Analytical Thinking', 'Taxation & Auditing'],
  'financial_analyst': ['Finance', 'Excel', 'SAP', 'Statistical Analysis', 'Business Strategy', 'Financial Modeling'],
  'investment_banker': ['Finance', 'Negotiation', 'Excel', 'Business Strategy', 'Presentation', 'Valuation & M&A'],
  'software_engineer': ['Programming', 'Python', 'Java', 'React', 'Cloud', 'Networking', 'Problem Solving', 'Data Structures'],
  'ai_engineer': ['AI', 'Python', 'Machine Learning', 'Artificial Intelligence', 'Programming', 'Deep Learning', 'PyTorch'],
  'ml_engineer': ['Machine Learning', 'Python', 'Artificial Intelligence', 'Programming', 'Statistical Analysis', 'MLOps'],
  'data_scientist': ['Data Science', 'Python', 'Excel', 'Statistical Analysis', 'SQL', 'Machine Learning', 'Data Visualization'],
  'cybersecurity_analyst': ['Cybersecurity', 'Networking', 'Cloud', 'Analytical Thinking', 'Problem Solving', 'Penetration Testing'],
  'ui_designer': ['UI/UX', 'Figma', 'Blender', 'Graphic Design', 'Creativity', 'Design Systems', 'Prototyping'],
  'ux_designer': ['UI/UX', 'Figma', 'Research', 'Analytical Thinking', 'Communication', 'Wireframing', 'Usability Testing'],
  'product_manager': ['Project Management', 'Business Strategy', 'Leadership', 'Negotiation', 'Communication', 'Agile / Scrum'],
  'chef': ['Cooking', 'Culinary Arts', 'Time Management', 'Creativity', 'Teamwork', 'Food Safety & Hygiene'],
  'hotel_manager': ['Hotel Management', 'Customer Service', 'Leadership', 'Time Management', 'Negotiation', 'Hospitality Operations'],
  'fashion_designer': ['Fashion Design', 'Fashion Illustration', 'Creativity', 'Graphic Design', 'Communication', 'Textile Knowledge'],
  'interior_designer': ['Interior Design', 'CAD', 'Revit', 'Figma', 'Creativity', 'Space Planning', 'Lighting Design'],
  'animator': ['Animation', 'Blender', 'Graphic Design', 'Figma', 'Creativity', 'Motion Graphics', '3D Rigging'],
  'film_director': ['Film Making', 'Video Editing', 'Leadership', 'Creativity', 'Communication', 'Cinematography', 'Storyboarding'],
  'actor': ['Acting', 'Public Speaking', 'Creativity', 'Communication', 'Adaptability', 'Voice Modulation'],
  'musician': ['Music Production', 'Creativity', 'Presentation', 'Performance', 'Time Management', 'Audio Engineering'],
  'journalist': ['Journalism', 'Writing', 'Public Speaking', 'Research', 'Communication', 'Investigative Reporting'],
  'content_creator': ['Content Creation', 'Video Editing', 'Photography', 'Digital Marketing', 'Social Media', 'Storytelling'],
  'farmer': ['Agriculture', 'Agriculture Management', 'Machine Operation', 'Adaptability', 'Time Management', 'Soil Science'],
  'agricultural_scientist': ['Agriculture', 'Research', 'Biology', 'Microscope', 'Statistical Analysis', 'Crop Genetics'],
  'police_officer': ['Police Services', 'Shield', 'Leadership', 'Decision Making', 'Conflict Resolution', 'Criminal Law'],
  'army_officer': ['Defence', 'Shield', 'Leadership', 'Decision Making', 'Physical Fitness', 'Tactical Strategy'],
  'ias_officer': ['Civil Services', 'Public Administration', 'Leadership', 'Policy Formulation', 'Communication', 'Public Finance'],
  'ips_officer': ['Civil Services', 'Law Enforcement', 'Leadership', 'Decision Making', 'Conflict Resolution', 'Security Ops'],
  'ifs_officer': ['Diplomacy', 'Civil Services', 'Negotiation', 'Foreign Languages', 'Communication', 'International Relations'],
  'entrepreneur': ['Entrepreneurship', 'Business Strategy', 'Sales', 'Marketing', 'Negotiation', 'Financial Planning'],
  'business_owner': ['Business Strategy', 'Sales', 'Marketing', 'Accounting', 'Project Management', 'Operations'],
  'marketing_manager': ['Marketing', 'Digital Marketing', 'Advertising', 'Sales', 'Creative Thinking', 'SEO & Brand Strategy'],
  'sales_manager': ['Sales', 'Negotiation', 'Communication', 'Business Strategy', 'Leadership', 'Client Relationship'],
  'supply_chain_manager': ['Supply Chain', 'Logistics', 'SAP', 'Negotiation', 'Analytical Thinking', 'Inventory Optimization'],
  'game_developer': ['Game Development', 'Programming', 'C++', 'Blender', 'Creativity', 'Unity / Unreal Engine'],
  'robotics_engineer': ['Robotics', 'Embedded Systems', 'PLC', 'SolidWorks', 'MATLAB', 'Control Systems'],
  'cloud_engineer': ['Cloud Computing', 'Networking', 'Cloud', 'DevOps', 'Programming', 'AWS / Azure / GCP', 'Docker & Kubernetes'],
  'blockchain_developer': ['Blockchain', 'Cryptography', 'Programming', 'C++', 'Analytical Thinking', 'Smart Contracts / Solidity'],
  'electrician': ['Electrician', 'Circuit Design', 'PLC', 'Machine Operation', 'Problem Solving', 'Safety Standards'],
  'welder': ['Welder', 'Machine Operation', 'Physical Stamina', 'Attention to Detail', 'Metallurgy'],
  'mechanic': ['Mechanic', 'Machine Operation', 'SolidWorks', 'Mechanical Repair', 'Problem Solving', 'Diagnostics'],
  'fitness_trainer': ['Fitness', 'Nutrition', 'Coaching', 'Customer Service', 'Communication', 'Biomechanics & Exercise Science'],
  'sports_coach': ['Sports', 'Coaching', 'Leadership', 'Teamwork', 'Communication', 'Tactical Analysis'],
  'nutritionist': ['Nutrition', 'Public Health', 'Communication', 'Analytical Thinking', 'Active Listening', 'Dietetics'],
  'marine_engineer': ['Marine Engineering', 'Machine Operation', 'SolidWorks', 'Problem Solving', 'Teamwork', 'Naval Architecture'],
  'astronaut': ['Space Science', 'Aviation', 'Critical Thinking', 'Adaptability', 'Physical Stamina', 'Orbital Mechanics'],
  'space_scientist': ['Space Science', 'Astronomy', 'Physics', 'Research', 'Statistical Analysis', 'Astrophysics'],
  'environmental_scientist': ['Environmental Science', 'GIS', 'Research', 'Sustainability', 'Analytical Thinking', 'Ecology'],
  'biotechnologist': ['Biotechnology', 'Biology', 'Laboratory Skills', 'Microscope', 'Research', 'Molecular Biology'],
  'genetic_engineer': ['Genetics', 'Biotechnology', 'Laboratory Skills', 'Research', 'Statistical Analysis', 'CRISPR & Gene Editing'],
  'marine_biologist': ['Biology', 'Oceanography', 'Research', 'Laboratory Skills', 'Active Listening', 'Marine Ecology'],
  'social_worker': ['Social Work', 'NGO', 'Communication', 'Active Listening', 'Conflict Resolution', 'Community Outreach'],
  'ngo_founder': ['NGO', 'Entrepreneurship', 'Leadership', 'Negotiation', 'Project Management', 'Fundraising & Advocacy'],
  'photographer': ['Photography', 'Video Editing', 'Figma', 'Creativity', 'Marketing', 'Lighting & Composition'],
  'event_planner': ['Event Management', 'Negotiation', 'Time Management', 'Budgeting', 'Communication', 'Vendor Coordination'],
  'digital_creator': ['YouTube', 'Gaming', 'Influencer', 'Content Creation', 'Digital Marketing', 'Audience Growth']
};

export const getCareerCategory = (title: string): string => {
  const norm = title.toLowerCase();
  
  if (["software engineer", "ai engineer", "ml engineer", "data scientist", "cybersecurity analyst", "cloud engineer", "game developer", "blockchain developer"].includes(norm)) {
    return "Technology";
  }
  if (["doctor", "surgeon", "dentist", "nurse", "pharmacist", "psychologist", "veterinarian", "nutritionist"].includes(norm)) {
    return "Healthcare";
  }
  if (["teacher", "professor"].includes(norm)) {
    return "Education";
  }
  if (["scientist", "researcher", "agricultural scientist", "space scientist", "environmental scientist", "biotechnologist", "genetic engineer", "marine biologist"].includes(norm)) {
    return "Science";
  }
  if (["mechanical engineer", "civil engineer", "electrical engineer", "robotics engineer", "marine engineer"].includes(norm)) {
    return "Engineering";
  }
  if (["architect", "interior designer", "fashion designer", "ui designer", "ux designer", "animator", "photographer"].includes(norm)) {
    return "Arts & Design";
  }
  if (["pilot", "air traffic controller", "astronaut"].includes(norm)) {
    return "Aviation";
  }
  if (["lawyer", "judge"].includes(norm)) {
    return "Law";
  }
  if (["chartered accountant", "financial analyst", "investment banker", "product manager", "entrepreneur", "business owner", "marketing manager", "sales manager", "supply chain manager"].includes(norm)) {
    return "Business & Finance";
  }
  if (["chef", "hotel manager", "event planner"].includes(norm)) {
    return "Hospitality & Tourism";
  }
  if (["film director", "actor", "musician", "journalist", "content creator", "digital creator"].includes(norm)) {
    return "Media & Entertainment";
  }
  if (["farmer"].includes(norm)) {
    return "Agriculture";
  }
  if (["ias officer", "ips officer", "ifs officer", "police officer"].includes(norm)) {
    return "Government";
  }
  if (["army officer"].includes(norm)) {
    return "Defence";
  }
  if (["electrician", "welder", "mechanic"].includes(norm)) {
    return "Skilled Trades";
  }
  if (["fitness trainer", "sports coach"].includes(norm)) {
    return "Fitness & Sports";
  }
  if (["social worker", "ngo founder"].includes(norm)) {
    return "Social Work & Non-Profit";
  }
  return "Other";
};

/**
 * Complete, structured static/mock career information dataset for Career Explorer, Career Details, and Comparison.
 */
export const STATIC_CAREER_INFORMATION: Record<string, Partial<CareerMetadata>> = {
  // ─── TECHNOLOGY ─────────────────────────────────────────────────────────────
  'software_engineer': {
    description: "Designs, develops, tests, and maintains modern software applications, microservices, and platforms.",
    education: "Bachelor's degree in Computer Science, Information Technology, Software Engineering, or equivalent practical coding experience.",
    responsibilities: [
      "Write clean, scalable, and maintainable software code across backend and frontend systems",
      "Architect microservice architectures, API endpoints, and database schemas",
      "Conduct rigorous code reviews, automated unit testing, and continuous deployment workflows",
      "Debug system bottlenecks and optimize high-throughput database queries and distributed caches"
    ],
    relevantDegrees: ["B.Tech / B.E. in Computer Science / IT", "BCA (Bachelor of Computer Applications)", "B.Sc Computer Science", "MCA / M.Tech"],
    relevantSubjects: ["Data Structures & Algorithms", "Object-Oriented Programming (Java/C++)", "Database Management Systems (DBMS)", "Computer Networks", "Operating Systems"],
    entranceExams: ["JEE Main / JEE Advanced", "BITSAT / State Engineering CETs", "GATE (CS/IT)", "CUET (UG/PG)"],
    careerPathway: "Junior Software Engineer → Software Engineer → Senior Software Engineer → Staff / Lead Engineer → Engineering Manager / Software Architect",
    salaryRange: "₹6,00,000 - ₹26,00,000 / year",
    growthRate: "+24% (Very High Growth)",
    demandLevel: "High Demand"
  },
  'ai_engineer': {
    description: "Builds intelligent systems, generative AI applications, deep neural networks, and cognitive architectures.",
    education: "Bachelor's or Master's degree in Computer Science, Artificial Intelligence, Data Science, or Mathematics.",
    responsibilities: [
      "Develop and fine-tune Large Language Models (LLMs), vision transformers, and generative agents",
      "Implement machine learning pipelines, embedding vector search, and Retrieval-Augmented Generation (RAG)",
      "Optimize inference latency and deploy models using quantization and GPU acceleration",
      "Evaluate algorithmic bias, safety guardrails, and model alignment standards"
    ],
    relevantDegrees: ["B.Tech in Artificial Intelligence & Data Science", "B.Tech Computer Science", "M.Sc Data Science / AI", "M.Tech in AI / Machine Learning"],
    relevantSubjects: ["Linear Algebra & Multivariable Calculus", "Probability & Statistics", "Deep Learning & Neural Networks", "Natural Language Processing", "Computer Vision"],
    entranceExams: ["JEE Main / JEE Advanced", "GATE (CS/DA - Data Science & AI)", "GRE / Advanced Academic Exams"],
    careerPathway: "Associate AI Engineer → AI Engineer → Senior AI Researcher/Engineer → Lead AI Scientist → Head of AI / Chief AI Architect",
    salaryRange: "₹8,50,000 - ₹35,00,000 / year",
    growthRate: "+38% (Explosive Growth)",
    demandLevel: "Extremely High Demand"
  },
  'ml_engineer': {
    description: "Bridges the gap between data science research and production engineering by deploying scalable ML pipelines.",
    education: "Bachelor's or Master's degree in Computer Science, Statistics, Mathematics, or Data Engineering.",
    responsibilities: [
      "Design and maintain automated MLOps pipelines for model training, validation, and registry",
      "Deploy machine learning models at scale using Docker, Kubernetes, and cloud ML platforms",
      "Monitor data drift, concept drift, and production model performance metrics in real time",
      "Optimize feature engineering pipelines and large-scale data ingestion streams"
    ],
    relevantDegrees: ["B.Tech Computer Science / Data Science", "B.Sc Statistics / Data Science", "M.Tech in ML / Data Systems"],
    relevantSubjects: ["Machine Learning Theory", "Statistical Modeling", "Distributed Computing", "Cloud Computing & MLOps", "Python & C++ Systems"],
    entranceExams: ["JEE Main / JEE Advanced", "GATE (CS/DA)", "State CETs"],
    careerPathway: "Junior ML Engineer → Machine Learning Engineer → Senior MLOps Engineer → ML Architect → Director of Machine Learning",
    salaryRange: "₹8,00,000 - ₹30,00,000 / year",
    growthRate: "+32% (Very High Growth)",
    demandLevel: "High Demand"
  },
  'data_scientist': {
    description: "Extracts predictive insights, builds statistical models, and guides corporate strategy using big data telemetry.",
    education: "Bachelor's or Master's degree in Data Science, Statistics, Mathematics, Economics, or Computer Science.",
    responsibilities: [
      "Analyze massive structured and unstructured datasets to identify actionable market patterns",
      "Build predictive regression, classification, clustering, and time-series forecasting models",
      "Translate complex statistical findings into compelling executive visualizations and narratives",
      "Design A/B test experiments, sample size determinations, and causal inference studies"
    ],
    relevantDegrees: ["B.Sc Data Science / Statistics", "B.Tech Computer Science / Data Science", "B.Stat (ISI)", "M.Sc Applied Statistics / Analytics"],
    relevantSubjects: ["Applied Statistics & Probability", "Machine Learning", "Data Mining & Wrangling", "Business Analytics", "SQL & Big Data Frameworks"],
    entranceExams: ["ISI Admission Test", "IIT JAM (Mathematical Statistics)", "JEE Main / GATE (DA)", "CUET UG/PG"],
    careerPathway: "Junior Data Analyst → Data Scientist → Senior Data Scientist → Lead Data Scientist → VP of Data & Analytics",
    salaryRange: "₹7,00,000 - ₹28,00,000 / year",
    growthRate: "+28% (High Growth)",
    demandLevel: "High Demand"
  },
  'cybersecurity_analyst': {
    description: "Defends enterprise infrastructure, cloud assets, and sensitive data against cyber attacks and intrusions.",
    education: "Bachelor's degree in Cybersecurity, Information Technology, Computer Science, or equivalent certifications.",
    responsibilities: [
      "Monitor security operations centers (SOC) for real-time cyber threats and network anomalies",
      "Perform vulnerability scans, penetration testing, and ethical hacking assessments",
      "Implement zero-trust network architectures, firewall protocols, and identity access controls",
      "Coordinate incident response protocols and forensic investigations following security breaches"
    ],
    relevantDegrees: ["B.Tech in Cybersecurity / Information Security", "B.Sc IT / Computer Science", "BCA with Cyber Security Specialization"],
    relevantSubjects: ["Network Security & Cryptography", "Ethical Hacking & Penetration Testing", "Operating System Internals", "Digital Forensics", "Cloud Security"],
    entranceExams: ["JEE Main / State Engineering CETs", "CEH (Certified Ethical Hacker)", "CompTIA Security+", "CISSP"],
    careerPathway: "SOC Analyst Tier 1 → Cybersecurity Analyst → Penetration Tester / Threat Hunter → Security Architect → Chief Information Security Officer (CISO)",
    salaryRange: "₹6,00,000 - ₹25,00,000 / year",
    growthRate: "+30% (Very High Growth)",
    demandLevel: "Extremely High Demand"
  },
  'cloud_engineer': {
    description: "Architects, provisions, and automates resilient cloud infrastructure and DevOps continuous integration workflows.",
    education: "Bachelor's degree in Computer Science, Information Technology, Cloud Computing, or equivalent.",
    responsibilities: [
      "Design high-availability, fault-tolerant cloud architectures across AWS, Microsoft Azure, or GCP",
      "Implement Infrastructure as Code (IaC) using Terraform, Ansible, and CloudFormation",
      "Manage containerized microservices orchestration via Kubernetes and Docker clusters",
      "Monitor cloud spending, performance metrics, and automated disaster recovery failovers"
    ],
    relevantDegrees: ["B.Tech Computer Science / Cloud Technology", "BCA / B.Sc IT", "M.Tech Cloud Computing"],
    relevantSubjects: ["Cloud Infrastructure & Virtualization", "DevOps & CI/CD Pipelines", "Computer Networks & Protocols", "Linux System Administration", "Distributed Systems"],
    entranceExams: ["JEE Main / State CETs", "AWS Certified Solutions Architect", "Azure Administrator (AZ-104)", "GCP Cloud Engineer"],
    careerPathway: "Associate Cloud Engineer → Cloud & DevOps Engineer → Senior Cloud Architect → Principal Infrastructure Engineer → Head of Cloud Infrastructure",
    salaryRange: "₹6,50,000 - ₹27,00,000 / year",
    growthRate: "+26% (Very High Growth)",
    demandLevel: "High Demand"
  },
  'game_developer': {
    description: "Programs gameplay mechanics, physics engines, shaders, and interactive digital worlds for consoles, PC, and mobile.",
    education: "Bachelor's degree in Game Development, Computer Science, Multimedia, or software engineering.",
    responsibilities: [
      "Code interactive gameplay mechanics, physics calculations, and artificial intelligence in C++ / C#",
      "Build immersive game logic utilizing industry engines such as Unreal Engine and Unity",
      "Optimize rendering framerates, memory utilization, and cross-platform multiplayer networking",
      "Collaborate with 3D artists, sound designers, and level creators on interactive experiences"
    ],
    relevantDegrees: ["B.Tech / B.Sc in Game Design & Development", "B.Tech Computer Science", "Diploma in 3D Game Programming"],
    relevantSubjects: ["3D Math & Linear Algebra", "C++ / C# Programming", "Game Engine Architecture", "Computer Graphics & Shaders", "Physics Simulation"],
    entranceExams: ["JEE Main / State CETs", "University Specific Game Design Entrance Tests"],
    careerPathway: "Junior Game Programmer → Gameplay Developer → Senior Engine Programmer → Lead Technical Director → Studio Technical Officer",
    salaryRange: "₹5,00,000 - ₹22,00,000 / year",
    growthRate: "+20% (High Growth)",
    demandLevel: "Moderate to High Demand"
  },
  'blockchain_developer': {
    description: "Designs decentralized applications, cryptographic consensus mechanisms, and secure smart contract architectures.",
    education: "Bachelor's degree in Computer Science, Cryptography, Information Technology, or Mathematics.",
    responsibilities: [
      "Write, test, and formally audit secure smart contracts using Solidity, Rust, and Vyper",
      "Architect decentralized protocols, DeFi mechanisms, and cross-chain interoperability bridges",
      "Integrate Web3 decentralized frontends with wallet providers and blockchain node RPCs",
      "Analyze cryptographic algorithms, zero-knowledge proofs, and consensus mechanisms"
    ],
    relevantDegrees: ["B.Tech in Computer Science / Blockchain Technology", "B.Sc Computer Science", "M.Tech in Cryptography & Information Security"],
    relevantSubjects: ["Applied Cryptography", "Distributed Systems", "Smart Contract Development", "Data Structures", "Network Protocols"],
    entranceExams: ["JEE Main / GATE (CS)", "State Engineering CETs"],
    careerPathway: "Junior Smart Contract Developer → Blockchain Engineer → Senior Protocol Developer → Web3 Technical Lead → Chief Blockchain Architect",
    salaryRange: "₹7,50,000 - ₹32,00,000 / year",
    growthRate: "+22% (High Growth)",
    demandLevel: "High Demand"
  },

  // ─── HEALTHCARE ─────────────────────────────────────────────────────────────
  'doctor': {
    description: "Diagnoses clinical illnesses, prescribes medical treatments, and coordinates comprehensive patient care.",
    education: "MBBS (Bachelor of Medicine and Bachelor of Surgery) followed by compulsory clinical internship and MD/MS residency.",
    responsibilities: [
      "Conduct thorough patient clinical examinations, diagnostic assessments, and medical history reviews",
      "Prescribe evidence-based therapeutic treatments, medications, and lifestyle interventions",
      "Interpret medical laboratory findings, radiographic scans, and specialized diagnostic reports",
      "Manage emergency medical interventions and collaborate with multidisciplinary clinical teams"
    ],
    relevantDegrees: ["MBBS (Bachelor of Medicine, Bachelor of Surgery)", "MD / MS (Doctor of Medicine / Master of Surgery)", "DNB (Diplomate of National Board)"],
    relevantSubjects: ["Human Anatomy", "Physiology", "Biochemistry", "Pathology", "Pharmacology", "General Medicine"],
    entranceExams: ["NEET-UG (National Eligibility cum Entrance Test)", "NEET-PG / INI-CET", "USMLE / PLAB (for overseas practice)"],
    careerPathway: "Medical Intern → Resident Doctor (Junior Resident) → Senior Resident → Consultant Physician → Head of Department / Medical Director",
    salaryRange: "₹9,00,000 - ₹36,00,000 / year",
    growthRate: "+18% (Stable High Growth)",
    demandLevel: "High Demand"
  },
  'surgeon': {
    description: "Performs complex surgical operations to treat diseases, repair injuries, and restore anatomical functioning.",
    education: "MBBS degree followed by MS (Master of Surgery) or DNB in General Surgery, and M.Ch in surgical super-specialization.",
    responsibilities: [
      "Perform preoperative assessments, patient risk evaluations, and surgical consent consultations",
      "Execute specialized surgical procedures with high manual precision and aseptic discipline",
      "Manage intraoperative contingencies, surgical instrumentation, and vital monitoring teams",
      "Oversee post-operative patient recovery, wound healing, and critical care management"
    ],
    relevantDegrees: ["MBBS", "MS (General Surgery / Orthopedics / ENT / Ophthalmology)", "M.Ch (Super-Speciality in Neurosurgery / Cardio / Plastic Surgery)"],
    relevantSubjects: ["Surgical Anatomy", "Operative Surgery", "Surgical Pathology", "Anesthesia & Critical Care", "Trauma & Emergency Care"],
    entranceExams: ["NEET-UG", "NEET-PG", "NEET-SS (Super Speciality)"],
    careerPathway: "Surgical Resident → Senior Surgical Registrar → Junior Consultant Surgeon → Lead Consultant Surgeon → Chief of Surgery",
    salaryRange: "₹12,00,000 - ₹50,00,000 / year",
    growthRate: "+16% (Very High Demand)",
    demandLevel: "High Demand"
  },
  'dentist': {
    description: "Diagnoses, prevents, and treats oral cavity diseases, dental defects, and performs corrective tooth surgeries.",
    education: "BDS (Bachelor of Dental Surgery) followed by optional MDS (Master of Dental Surgery) in orthodontics or prosthodontics.",
    responsibilities: [
      "Perform comprehensive dental examinations, oral radiographs, and periodontal evaluations",
      "Execute restorative dental procedures including root canal therapies, fillings, and crown placements",
      "Perform minor oral surgical procedures including tooth extractions and implant placements",
      "Advise patients on oral hygiene regimens, preventative tooth care, and orthodontic solutions"
    ],
    relevantDegrees: ["BDS (Bachelor of Dental Surgery)", "MDS (Master of Dental Surgery - Orthodontics, Endodontics, etc.)"],
    relevantSubjects: ["Dental Anatomy & Histology", "Oral Pathology", "Periodontics", "Prosthodontics", "Oral & Maxillofacial Surgery"],
    entranceExams: ["NEET-UG", "NEET-MDS"],
    careerPathway: "Dental Intern → Associate Dentist → Senior Dental Consultant → Dental Clinic Owner / Specialist Orthodontist",
    salaryRange: "₹4,50,000 - ₹18,00,000 / year",
    growthRate: "+14% (Moderate Growth)",
    demandLevel: "Moderate to High Demand"
  },
  'nurse': {
    description: "Delivers essential patient bedside care, administers medical treatments, and monitors clinical patient vitals.",
    education: "B.Sc Nursing, GNM (General Nursing and Midwifery), or M.Sc in Specialized Clinical Nursing.",
    responsibilities: [
      "Monitor, record, and interpret patient vital signs and clinical changes in hospital wards and ICUs",
      "Administer prescribed medications, intravenous fluids, and clinical therapies accurately",
      "Assist doctors and surgeons during complex medical evaluations and surgical procedures",
      "Provide empathetic patient education, post-operative care guidance, and emotional support"
    ],
    relevantDegrees: ["B.Sc Nursing (4-year)", "GNM (General Nursing & Midwifery)", "M.Sc Nursing (Critical Care / Pediatric / Oncology)"],
    relevantSubjects: ["Anatomy & Physiology", "Fundamentals of Nursing", "Medical-Surgical Nursing", "Pharmacology", "Community Health Nursing"],
    entranceExams: ["State Nursing Entrance Exams", "AIIMS Nursing Entrance", "NCLEX-RN (for global licensure)"],
    careerPathway: "Staff Nurse → Senior Staff Nurse → Nursing Supervisor / In-Charge → Assistant Nursing Superintendent → Chief Nursing Officer (CNO)",
    salaryRange: "₹3,50,000 - ₹12,00,000 / year",
    growthRate: "+22% (High Global Demand)",
    demandLevel: "Extremely High Demand"
  },
  'pharmacist': {
    description: "Dispenses prescription medications, counsels patients on drug usage, and ensures pharmaceutical compliance.",
    education: "B.Pharm (Bachelor of Pharmacy), Pharm.D (Doctor of Pharmacy), or M.Pharm.",
    responsibilities: [
      "Review medical prescriptions for dosage accuracy, drug interactions, and contraindications",
      "Dispense pharmaceuticals and educate patients on optimal drug administration and side effects",
      "Manage clinical pharmacy inventory, cold-chain storage standards, and narcotic ledgers",
      "Participate in clinical drug trials, pharmacological safety audits, and medication therapy management"
    ],
    relevantDegrees: ["B.Pharm (Bachelor of Pharmacy)", "Pharm.D (Doctor of Pharmacy)", "M.Pharm (Pharmacology / Pharmaceutics)"],
    relevantSubjects: ["Pharmaceutics", "Pharmacology", "Pharmaceutical Chemistry", "Pharmacognosy", "Hospital & Clinical Pharmacy"],
    entranceExams: ["State Pharmacy CETs", "GPAT (Graduate Pharmacy Aptitude Test)", "BITS HD"],
    careerPathway: "Retail / Hospital Pharmacist → Quality Control / Formulation Specialist → Senior Regulatory Affairs Associate → Clinical Research Manager → Director of Pharmacy",
    salaryRange: "₹4,00,000 - ₹15,00,000 / year",
    growthRate: "+15% (Steady Growth)",
    demandLevel: "High Demand"
  },
  'psychologist': {
    description: "Evaluates cognitive and emotional behavior, conducts psychotherapy, and supports psychological well-being.",
    education: "Bachelor's degree in Psychology (B.A./B.Sc.) followed by Master's (M.A./M.Sc.) and M.Phil/Psy.D in Clinical Psychology (RCI certified).",
    responsibilities: [
      "Conduct psychological assessments, psychometric diagnostic tests, and behavioral interviews",
      "Administer evidence-based psychotherapy (CBT, DBT, mindfulness-based stress reduction)",
      "Develop customized mental health support plans for anxiety, mood disorders, and trauma recovery",
      "Facilitate group therapy sessions, corporate wellness workshops, and counseling programs"
    ],
    relevantDegrees: ["B.A. / B.Sc in Psychology", "M.A. / M.Sc in Clinical / Counseling Psychology", "M.Phil in Clinical Psychology (RCI Licensed)", "Psy.D / Ph.D in Psychology"],
    relevantSubjects: ["General & Cognitive Psychology", "Developmental Psychology", "Psychopathology & Abnormal Psychology", "Psychological Testing & Statistics", "Counseling Techniques"],
    entranceExams: ["CUET (UG/PG)", "NIMHANS / CIP Entrance Examinations", "GATE (Psychology) / UGC-NET"],
    careerPathway: "Counselor / Trainee Psychologist → Licensed Clinical Psychologist → Senior Consultant Psychologist → Clinic Director / Head of Behavioral Health",
    salaryRange: "₹4,50,000 - ₹16,00,000 / year",
    growthRate: "+24% (Very High Growth)",
    demandLevel: "High Demand"
  },
  'veterinarian': {
    description: "Diagnoses illnesses, performs surgeries, and administers preventive medical care for domestic and wild animals.",
    education: "B.V.Sc & A.H. (Bachelor of Veterinary Science and Animal Husbandry) with state/national veterinary council registration.",
    responsibilities: [
      "Examine domestic pets, livestock, and exotic animals for physical ailments and injuries",
      "Perform soft tissue and orthopedic surgical procedures, dental cleanings, and emergency care",
      "Administer vaccinations, parasite treatments, and nutritional guidance for animal health",
      "Advise on animal breeding protocols, zoonotic disease prevention, and public veterinary health"
    ],
    relevantDegrees: ["B.V.Sc & A.H. (Bachelor of Veterinary Science & Animal Husbandry)", "M.V.Sc (Veterinary Surgery / Medicine / Pathology)"],
    relevantSubjects: ["Veterinary Anatomy & Physiology", "Veterinary Pharmacology", "Veterinary Surgery & Radiology", "Animal Nutrition & Breeding", "Veterinary Microbiology"],
    entranceExams: ["NEET-UG (All India Veterinary Quota)", "State Veterinary Entrance Examinations"],
    careerPathway: "Veterinary Officer / Associate Vet → Senior Veterinary Surgeon → Veterinary Clinic Owner → Zoo / Wildlife Veterinarian → Director of Veterinary Services",
    salaryRange: "₹5,00,000 - ₹18,00,000 / year",
    growthRate: "+19% (High Demand)",
    demandLevel: "High Demand"
  },
  'nutritionist': {
    description: "Designs evidence-based dietary regimens, evaluates metabolic health, and promotes preventative wellness.",
    education: "B.Sc in Food Science & Nutrition or Dietetics, followed by M.Sc and Registered Dietitian (RD) certification.",
    responsibilities: [
      "Assess client metabolic rates, body composition, dietary intake logs, and clinical biomarkers",
      "Create personalized, evidence-based meal plans for medical nutrition therapy and weight management",
      "Educate individuals and corporate groups on balanced nutrition, gut health, and micronutrients",
      "Collaborate with physicians and fitness coaches to optimize patient recovery and sports performance"
    ],
    relevantDegrees: ["B.Sc in Clinical Nutrition & Dietetics", "B.Sc Food Science & Nutrition", "M.Sc in Foods and Nutrition", "Post Graduate Diploma in Dietetics (PGDD)"],
    relevantSubjects: ["Human Nutrition & Metabolism", "Clinical Dietetics", "Food Microbiology & Chemistry", "Biochemistry", "Public Health Nutrition"],
    entranceExams: ["University Specific Entrance Tests", "Registered Dietitian (RD) Examination (IDA)"],
    careerPathway: "Clinical Dietitian Intern → Certified Clinical Nutritionist → Senior Sports / Bariatric Nutritionist → Private Practice Consultant / Wellness Director",
    salaryRange: "₹3,50,000 - ₹14,00,000 / year",
    growthRate: "+18% (Growing Demand)",
    demandLevel: "Moderate to High Demand"
  },

  // ─── ENGINEERING ─────────────────────────────────────────────────────────────
  'mechanical_engineer': {
    description: "Designs, analyzes, manufactures, and maintains mechanical systems, thermal equipment, and robotics machinery.",
    education: "Bachelor's degree in Mechanical Engineering (B.Tech / B.E.) or related discipline.",
    responsibilities: [
      "Create parametric 3D CAD models, assembly drawings, and GD&T specifications using SolidWorks/CATIA",
      "Perform finite element analysis (FEA) and computational fluid dynamics (CFD) simulations",
      "Oversee manufacturing processes, CNC machining, thermodynamics, and precision fabrication",
      "Conduct root-cause failure analyses and implement reliability engineering enhancements"
    ],
    relevantDegrees: ["B.Tech / B.E. in Mechanical Engineering", "Diploma in Mechanical Engineering", "M.Tech in Thermal / Machine Design / Mechatronics"],
    relevantSubjects: ["Engineering Mechanics & Strength of Materials", "Thermodynamics & Heat Transfer", "Fluid Mechanics", "Kinematics & Dynamics of Machines", "CAD / CAM & Manufacturing Tech"],
    entranceExams: ["JEE Main / JEE Advanced", "GATE (ME)", "State Engineering CETs"],
    careerPathway: "Graduate Engineer Trainee (GET) → Mechanical Design Engineer → Senior Project Engineer → Lead Mechanical Architect → VP of Engineering",
    salaryRange: "₹5,00,000 - ₹20,00,000 / year",
    growthRate: "+14% (Stable Growth)",
    demandLevel: "Moderate to High Demand"
  },
  'civil_engineer': {
    description: "Plans, designs, constructs, and oversees vital infrastructure such as highways, bridges, dams, and skyscrapers.",
    education: "Bachelor's degree in Civil Engineering (B.Tech / B.E.).",
    responsibilities: [
      "Develop structural design blueprints, foundation load calculations, and seismic reinforcement plans",
      "Manage construction site operations, contractor scheduling, safety audits, and project budgets",
      "Conduct geotechnical soil surveys, material testing (concrete, steel), and quality control inspections",
      "Ensure municipal environmental clearances, water management compliance, and building code adherence"
    ],
    relevantDegrees: ["B.Tech / B.E. in Civil Engineering", "Diploma in Civil Engineering", "M.Tech in Structural Engineering / Construction Management"],
    relevantSubjects: ["Structural Analysis & Design (RCC / Steel)", "Geotechnical & Foundation Engineering", "Surveying & Geomatics", "Hydraulics & Water Resources", "Construction Planning & Management"],
    entranceExams: ["JEE Main / JEE Advanced", "GATE (CE)", "State Engineering CETs", "IES (UPSC Engineering Services)"],
    careerPathway: "Site Engineer → Structural / Project Engineer → Senior Project Manager → Chief Resident Engineer → General Manager (Infrastructure)",
    salaryRange: "₹4,50,000 - ₹18,00,000 / year",
    growthRate: "+12% (Steady Growth)",
    demandLevel: "Moderate to High Demand"
  },
  'electrical_engineer': {
    description: "Designs, tests, and oversees electrical power generation, transmission grids, control systems, and electronics.",
    education: "Bachelor's degree in Electrical Engineering (B.Tech / B.E.) or Electrical & Electronics Engineering (EEE).",
    responsibilities: [
      "Design electrical power distribution systems, substation single-line diagrams, and switchgear layouts",
      "Program programmable logic controllers (PLCs), SCADA telemetry, and industrial automation drives",
      "Conduct electrical load flow calculations, harmonic filtering, and short-circuit fault simulations",
      "Oversee renewable energy integration (solar PV grids, wind turbines, EV charging infrastructure)"
    ],
    relevantDegrees: ["B.Tech / B.E. in Electrical Engineering", "B.Tech in Electrical & Electronics Engineering (EEE)", "M.Tech in Power Systems / Power Electronics"],
    relevantSubjects: ["Circuit Theory & Networks", "Electrical Machines & Transformers", "Power Systems & Transmission", "Control Systems", "Power Electronics & Drives"],
    entranceExams: ["JEE Main / JEE Advanced", "GATE (EE)", "State Engineering CETs", "UPSC ESE"],
    careerPathway: "Junior Electrical Engineer → Electrical Design Engineer → Senior Automation / Power Engineer → Lead Project Engineer → Chief Electrical Consultant",
    salaryRange: "₹5,00,000 - ₹21,00,000 / year",
    growthRate: "+16% (High Growth in EV/Renewables)",
    demandLevel: "High Demand"
  },
  'robotics_engineer': {
    description: "Develops autonomous robots, robotic manipulators, sensor fusion, and embedded control architectures.",
    education: "Bachelor's degree in Robotics, Mechatronics, Mechanical, or Electrical/Computer Engineering.",
    responsibilities: [
      "Design robotic mechanical kinematics, motor drive actuators, and end-effector mechanisms",
      "Develop embedded firmware and real-time control algorithms in C++ using ROS 2 (Robot Operating System)",
      "Implement computer vision, LIDAR SLAM navigation, and obstacle avoidance algorithms",
      "Test autonomous robotics systems in industrial manufacturing and logistics environments"
    ],
    relevantDegrees: ["B.Tech in Robotics & Automation", "B.Tech Mechatronics", "B.Tech Mechanical / Electronics", "M.Tech in Robotics"],
    relevantSubjects: ["Robotics Kinematics & Dynamics", "Embedded Systems & Microcontrollers", "Control Engineering & ROS", "Computer Vision & Sensor Fusion", "Mechatronics"],
    entranceExams: ["JEE Main / JEE Advanced", "GATE (ME/EE/IN)", "State CETs"],
    careerPathway: "Robotics Programmer → Autonomous Systems Engineer → Senior Robotics Architect → Head of Robotics & Automation",
    salaryRange: "₹6,50,000 - ₹28,00,000 / year",
    growthRate: "+28% (Very High Growth)",
    demandLevel: "High Demand"
  },
  'marine_engineer': {
    description: "Operates, maintains, and repairs propulsion machinery, generators, and auxiliary systems on ocean vessels.",
    education: "B.Tech / B.E. in Marine Engineering with Directorate General of Shipping (DGS) approved pre-sea training and CDC.",
    responsibilities: [
      "Operate and maintain massive two-stroke marine diesel engines, gas turbines, and propulsion shafts",
      "Manage shipboard electrical generation, desalination plants, boilers, and refrigeration systems",
      "Ensure compliance with international maritime safety codes (SOLAS, MARPOL, ISM)",
      "Diagnose mechanical emergencies and perform precision machinery overhauls at sea"
    ],
    relevantDegrees: ["B.Tech / B.E. in Marine Engineering (4 years DGS Approved)", "Graduate Marine Engineering (GME) 1-year course"],
    relevantSubjects: ["Marine Diesel Engines", "Naval Architecture & Ship Construction", "Marine Electrical Systems", "Marine Auxiliary Machinery", "Maritime Law & Safety"],
    entranceExams: ["IMU-CET (Indian Maritime University Common Entrance Test)", "JEE Main"],
    careerPathway: "Junior Engineer (Cadet) → 4th Marine Engineer → 3rd Engineer → Second Engineer → Chief Engineer Officer (Merchant Navy)",
    salaryRange: "₹8,00,000 - ₹45,00,000 / year (Tax-Free at Sea)",
    growthRate: "+15% (High International Demand)",
    demandLevel: "High Demand"
  },

  // ─── ARTS & DESIGN ───────────────────────────────────────────────────────────
  'architect': {
    description: "Envisions, designs, and plans aesthetically inspiring and functionally sustainable physical built environments.",
    education: "B.Arch (Bachelor of Architecture, 5-year degree) recognized by the Council of Architecture (COA).",
    responsibilities: [
      "Conceptualize innovative building designs, spatial floor plans, and 3D architectural renders",
      "Produce comprehensive construction working drawings, structural details, and material specs",
      "Coordinate with structural engineers, MEP consultants, and landscape architects during construction",
      "Incorporate green building principles, passive solar design, and municipal zoning compliance"
    ],
    relevantDegrees: ["B.Arch (Bachelor of Architecture - 5 years)", "M.Arch (Urban Design / Landscape / Sustainable Architecture)"],
    relevantSubjects: ["Architectural Design & Studio", "Building Construction & Materials", "History of Architecture", "Structural Mechanics in Architecture", "Climatology & Green Architecture"],
    entranceExams: ["NATA (National Aptitude Test in Architecture)", "JEE Main Paper 2 (B.Arch / B.Planning)"],
    careerPathway: "Junior Architect → Project Architect → Senior Architectural Associate → Principal Architect / Architecture Studio Partner",
    salaryRange: "₹4,50,000 - ₹20,00,000 / year",
    growthRate: "+15% (Steady Growth)",
    demandLevel: "Moderate to High Demand"
  },
  'ui_designer': {
    description: "Crafts engaging visual design systems, interactive UI components, animations, and high-fidelity screen layouts.",
    education: "Bachelor's degree in Design (B.Des), Fine Arts, Graphic Design, or equivalent portfolio experience.",
    responsibilities: [
      "Create cohesive design systems, component libraries, typography hierarchies, and color palettes in Figma",
      "Design pixel-perfect responsive web, mobile, and tablet user interface layouts",
      "Build interactive micro-animations and micro-interactions to elevate user delight",
      "Collaborate closely with frontend engineers to ensure design token fidelity and responsive execution"
    ],
    relevantDegrees: ["B.Des in Communication Design / Digital Media", "BFA in Graphic Design", "Certificate / Diploma in UI/UX Design"],
    relevantSubjects: ["Visual Hierarchy & Typography", "Design Systems & Component Architecture", "Color Theory & Contrast", "Prototyping & Motion Design", "Web & Mobile Design Patterns"],
    entranceExams: ["UCEED", "NID DAT (Design Aptitude Test)", "NIFT Entrance Exam", "Portfolio Review"],
    careerPathway: "Junior UI Designer → Visual / UI Designer → Senior UI Designer → Lead Design Systems Architect → Head of Visual Design",
    salaryRange: "₹5,00,000 - ₹22,00,000 / year",
    growthRate: "+22% (High Growth)",
    demandLevel: "High Demand"
  },
  'ux_designer': {
    description: "Researches user behaviors, designs intuitive workflows, and optimizes usability for digital products.",
    education: "Bachelor's or Master's degree in Design (B.Des/M.Des), Human-Computer Interaction (HCI), Psychology, or Cognitive Science.",
    responsibilities: [
      "Conduct generative user research, contextual inquiries, and competitive benchmark studies",
      "Synthesize user personas, empathy maps, information architectures, and complex user journeys",
      "Construct low-to-medium fidelity wireframes and clickable validation prototypes",
      "Facilitate usability testing sessions, identify friction drop-offs, and iterate based on telemetry data"
    ],
    relevantDegrees: ["B.Des / M.Des in Interaction Design / HCI", "B.Sc Cognitive Science", "Degree in Psychology / Design"],
    relevantSubjects: ["Human-Computer Interaction (HCI)", "User Research Methodologies", "Information Architecture", "Usability Testing & Metrics", "Cognitive Psychology in UX"],
    entranceExams: ["UCEED / CEED", "NID DAT", "University Design Entrance Exams"],
    careerPathway: "Associate UX Researcher/Designer → Product UX Designer → Senior UX Designer → Principal UX Strategist → VP of User Experience",
    salaryRange: "₹6,00,000 - ₹26,00,000 / year",
    growthRate: "+25% (High Growth)",
    demandLevel: "High Demand"
  },
  'interior_designer': {
    description: "Transforms indoor architectural spaces to be functional, safe, aesthetically pleasing, and ergonomically sound.",
    education: "Bachelor of Interior Design (B.Des / B.Sc Interior Design) or professional diploma.",
    responsibilities: [
      "Plan interior floor plans, spatial zoning, furniture placement, and traffic flow layouts",
      "Select curated materials, fabrics, lighting fixtures, custom cabinetry, and decorative finishes",
      "Produce detailed 3D photorealistic renderings and AutoCAD elevation drawings for contractors",
      "Manage client budgets, vendor sourcing, on-site execution, and fit-out timelines"
    ],
    relevantDegrees: ["B.Des in Interior Design", "B.Sc Interior Design", "Diploma in Interior Architecture & Design"],
    relevantSubjects: ["Interior Spatial Planning", "Lighting Design & Acoustics", "Furniture Design & Joinery", "Material Science & Finishes", "AutoCAD & 3D Modeling (SketchUp/3ds Max)"],
    entranceExams: ["NID DAT", "UCEED", "AIEED / University Specific Design Tests"],
    careerPathway: "Junior Interior Designer → Interior Project Lead → Senior Interior Designer → Interior Design Firm Partner / Principal",
    salaryRange: "₹3,80,000 - ₹16,00,000 / year",
    growthRate: "+16% (Steady Demand)",
    demandLevel: "Moderate to High Demand"
  },
  'fashion_designer': {
    description: "Creates original clothing collections, apparel concepts, footwear, and fashion accessories.",
    education: "Bachelor of Design in Fashion Design (B.Des) from NIFT or recognized design institute.",
    responsibilities: [
      "Illustrate original garment concepts, mood boards, color themes, and seasonal trend forecasts",
      "Select textiles, weave structures, trims, patterns, and garment construction techniques",
      "Supervise pattern making, draping, sample prototyping, and model fitting adjustments",
      "Coordinate with apparel manufacturers, merchandising teams, and runway showcases"
    ],
    relevantDegrees: ["B.Des in Fashion Design", "B.FTech (Fashion Technology)", "Diploma in Fashion Styling & Apparel"],
    relevantSubjects: ["Fashion Illustration & Digital Design", "Textile Science & Fiber Knowledge", "Pattern Making & Garment Construction", "History of World Fashion", "Apparel Merchandising"],
    entranceExams: ["NIFT Entrance Exam (CAT/GAT)", "NID DAT", "UCEED"],
    careerPathway: "Assistant Fashion Designer → Fashion Designer / Stylist → Senior Apparel Designer → Creative Director / Fashion Label Founder",
    salaryRange: "₹4,00,000 - ₹20,00,000 / year",
    growthRate: "+14% (Competitive Market)",
    demandLevel: "Moderate Demand"
  },
  'animator': {
    description: "Brings characters, visual effects, and digital stories to life through 2D/3D movement and motion design.",
    education: "Bachelor's degree in Animation, Visual Effects, Digital Arts, or equivalent industry portfolio.",
    responsibilities: [
      "Apply the 12 principles of animation to create expressive character performances and weight",
      "Build and rig complex 3D character skeletons and kinematic controllers in Blender / Maya",
      "Animate dynamic cameras, environment interactions, and visual effects for film and games",
      "Collaborate with lighting artists, compositors, and storyboard directors on sequence timing"
    ],
    relevantDegrees: ["B.Sc in Animation & VFX", "B.Des in Animation Film Design", "Diploma in 3D Character Animation"],
    relevantSubjects: ["Principles of Classical Animation", "3D Character Rigging & Kinematics", "Digital Storyboarding", "Lighting & Rendering (Arnold/Cycles)", "Motion Graphics & Compositing"],
    entranceExams: ["NID DAT", "UCEED", "Institute Portfolio Entrance Tests"],
    careerPathway: "Junior 3D Animator → Character Animator → Senior Animator → Animation Lead / Supervisor → Animation Director",
    salaryRange: "₹4,00,000 - ₹18,00,000 / year",
    growthRate: "+20% (High Growth in Gaming & OTT)",
    demandLevel: "Moderate to High Demand"
  },

  // ─── BUSINESS & FINANCE ──────────────────────────────────────────────────────
  'chartered_accountant': {
    description: "Provides expert financial auditing, corporate taxation, statutory compliance, and strategic financial advisory.",
    education: "CA designation awarded by ICAI (Institute of Chartered Accountants of India) after passing Foundation, Inter, Final, and 3 years Articleship.",
    responsibilities: [
      "Conduct statutory, internal, and forensic audits of public and private corporate balance sheets",
      "Structure direct and indirect tax strategies (GST, corporate income tax, international transfer pricing)",
      "Advise corporate leadership on financial structuring, M&A due diligence, and capital allocations",
      "Ensure stringent regulatory compliance with statutory company laws and accounting standards (Ind AS / IFRS)"
    ],
    relevantDegrees: ["B.Com / B.Com (Hons) alongside CA Course", "BBA Finance", "ICAI Chartered Accountancy (Foundation, Inter, Final)"],
    relevantSubjects: ["Financial Accounting & Reporting", "Direct & Indirect Tax Laws", "Auditing & Assurance Standards", "Strategic Financial Management", "Corporate & Economic Laws"],
    entranceExams: ["CA Foundation Exam (ICAI)", "CA Intermediate Exam", "CA Final Exam"],
    careerPathway: "Articled Assistant → Qualified CA / Audit Associate → Senior Manager (Tax / Audit / Deals) → Partner at CA Firm / Chief Financial Officer (CFO)",
    salaryRange: "₹8,00,000 - ₹35,00,000 / year",
    growthRate: "+18% (Consistently High Demand)",
    demandLevel: "Extremely High Demand"
  },
  'financial_analyst': {
    description: "Evaluates financial datasets, builds forecasting models, and recommends investment decisions for enterprises.",
    education: "Bachelor's degree in Finance, Economics, Commerce, or CFA (Chartered Financial Analyst) charter.",
    responsibilities: [
      "Build detailed dynamic three-statement financial models, DCF valuations, and sensitivity analyses",
      "Analyze macroeconomic indicators, market trends, competitor balance sheets, and earnings calls",
      "Synthesize investment memos, executive dashboards, and quarterly variance reports",
      "Monitor corporate liquidity, capital expenditure budgets, and portfolio risk distributions"
    ],
    relevantDegrees: ["BBA Finance / B.Com (Hons)", "B.Sc Economics / Statistics", "MBA Finance", "CFA Program"],
    relevantSubjects: ["Corporate Finance", "Financial Statement Analysis", "Equity Valuation & Fixed Income", "Portfolio Management", "Excel & Financial Modeling"],
    entranceExams: ["CFA Level 1/2/3", "CAT / XAT / GMAT (for Top B-Schools)", "CUET UG/PG"],
    careerPathway: "Junior Financial Analyst → Senior Equity / Corporate Analyst → Portfolio Manager / Finance Manager → VP of Finance",
    salaryRange: "₹6,00,000 - ₹24,00,000 / year",
    growthRate: "+16% (Strong Growth)",
    demandLevel: "High Demand"
  },
  'investment_banker': {
    description: "Advises corporations and governments on capital raising (IPOs, debt issuance) and strategic mergers & acquisitions.",
    education: "MBA in Finance from top-tier business school, Master's in Finance, or Bachelor's in Economics/Commerce/Engineering.",
    responsibilities: [
      "Structure multi-million dollar Mergers & Acquisitions (M&A) deals, LBOs, and corporate spin-offs",
      "Author detailed pitchbooks, confidential information memorandums (CIM), and fairness opinions",
      "Underwrite initial public offerings (IPOs), bond placements, and private equity equity syndications",
      "Lead high-stakes negotiations between institutional investors, corporate boards, and regulators"
    ],
    relevantDegrees: ["MBA Finance (IIMs / Top Tier)", "B.Tech + MBA", "B.Com (Hons) / B.A. Economics from premier colleges", "CFA / CA"],
    relevantSubjects: ["Advanced Corporate Valuation & Modeling", "Mergers, Acquisitions & Corporate Restructuring", "Investment Banking Practices", "Securities Regulation & Deal Structuring", "Capital Markets"],
    entranceExams: ["CAT / GMAT / XAT", "CFA Program"],
    careerPathway: "Investment Banking Analyst → Associate → Vice President (VP) → Director → Managing Director (MD)",
    salaryRange: "₹15,00,000 - ₹75,00,000 / year (Plus Performance Bonuses)",
    growthRate: "+15% (High Lucrative Demand)",
    demandLevel: "High Demand"
  },
  'product_manager': {
    description: "Drives product strategy, defines feature roadmaps, and aligns engineering, design, and business goals.",
    education: "Bachelor's degree in Computer Science, Business, Engineering, or MBA.",
    responsibilities: [
      "Define comprehensive product vision, OKRs, user stories, and feature requirement specs (PRDs)",
      "Conduct user research, customer feedback loops, and market landscape analyses",
      "Prioritize sprint backlogs and collaborate with engineering and UX teams in agile cadences",
      "Analyze product analytics, funnel conversion metrics, churn rates, and growth experiments"
    ],
    relevantDegrees: ["B.Tech Computer Science / Engineering + MBA", "BBA / BBS + Product Experience", "Masters in Management (MiM)"],
    relevantSubjects: ["Product Management & Agile Methodologies", "Data Analytics & Metrics (SQL/Amplitude)", "User Experience & System Thinking", "Business Strategy & Economics", "Software Development Lifecycle"],
    entranceExams: ["CAT / GMAT", "Product Management Certifications"],
    careerPathway: "Associate Product Manager (APM) → Product Manager → Senior Product Manager → Group Product Manager → Chief Product Officer (CPO)",
    salaryRange: "₹10,00,000 - ₹40,00,000 / year",
    growthRate: "+26% (Very High Growth)",
    demandLevel: "High Demand"
  },
  'entrepreneur': {
    description: "Founds innovative ventures, develops disruptive business models, secures venture capital, and scales operations.",
    education: "No formal requirement; practical acumen in business strategy, technology, marketing, or engineering.",
    responsibilities: [
      "Identify market inefficiencies, validate value propositions, and achieve product-market fit",
      "Pitch vision to angel investors and venture capital firms to raise seed and growth funding rounds",
      "Recruit core founding teams, establish corporate culture, and direct operational priorities",
      "Drive customer acquisition, strategic partnerships, unit economics profitability, and company scaling"
    ],
    relevantDegrees: ["B.Tech / B.E.", "BBA / Entrepreneurship", "MBA / Masters in Business", "Self-Taught / Multidisciplinary"],
    relevantSubjects: ["Entrepreneurial Strategy & Innovation", "Venture Finance & Capital Raising", "Marketing & Customer Acquisition", "Business Law & Intellectual Property", "Operations & Team Leadership"],
    entranceExams: ["Venture Pitching / Incubator Selection", "CAT / GMAT (Optional for B-Schools)"],
    careerPathway: "Founder / Co-Founder → CEO / Managing Director → Serial Entrepreneur / Venture Capitalist",
    salaryRange: "₹6,00,000 - ₹50,00,000+ / year (High Equity Potential)",
    growthRate: "+30% (Startup Ecosystem Boom)",
    demandLevel: "High Opportunity"
  },

  // ─── LAW & GOVERNMENT ────────────────────────────────────────────────────────
  'lawyer': {
    description: "Represents clients in legal proceedings, drafts contractual agreements, and advocates rights before courts.",
    education: "5-year integrated BA LLB / BBA LLB or 3-year LLB degree followed by State Bar Council enrollment and AIBE certification.",
    responsibilities: [
      "Represent individual and corporate clients in trial courts, high courts, and supreme court benches",
      "Draft comprehensive pleadings, writ petitions, commercial contracts, and legal notices",
      "Conduct thorough case law research, precedent analysis, and statutory interpretation",
      "Counsel clients on risk mitigation, dispute settlement negotiations, and legal arbitration"
    ],
    relevantDegrees: ["BA LLB (5-Year Integrated)", "BBA LLB / B.Com LLB", "LLB (3-Year post-graduation)", "LLM (Master of Laws)"],
    relevantSubjects: ["Constitutional Law", "Law of Contracts & Torts", "Criminal Law & Procedure (IPC/CrPC)", "Corporate & Commercial Law", "Civil Procedure Code & Evidence Act"],
    entranceExams: ["CLAT (Common Law Admission Test)", "AILET (All India Law Entrance Test)", "SLAT / State Law CETs", "AIBE (All India Bar Examination)"],
    careerPathway: "Junior Advocate → Associate Lawyer → Senior Associate → Partner at Law Firm / Designated Senior Advocate",
    salaryRange: "₹5,00,000 - ₹28,00,000 / year",
    growthRate: "+16% (Strong Demand)",
    demandLevel: "High Demand"
  },
  'judge': {
    description: "Presides over court proceedings, interprets legislation, evaluates evidence, and delivers binding legal verdicts.",
    education: "LLB / LLM degree with qualification in State Judicial Services Examination (PCS-J) or Higher Judicial Services.",
    responsibilities: [
      "Preside over civil and criminal court trials with strict judicial neutrality and decorum",
      "Admit and evaluate evidence, examine witness testimonies, and hear counsel oral arguments",
      "Author detailed judicial orders, warrants, injunctions, and final legal judgments",
      "Protect constitutional fundamental rights, uphold statutory laws, and administer justice"
    ],
    relevantDegrees: ["LLB (3-Year or 5-Year Integrated)", "LLM (Master of Laws)"],
    relevantSubjects: ["Constitutional Law & Jurisprudence", "Civil & Criminal Procedural Codes", "Law of Evidence", "Specific Relief & Limitation Acts", "Judicial Ethics & Interpretation"],
    entranceExams: ["State Judicial Services Examination (PCS-J)", "Higher Judicial Services Examination (Direct from Bar)"],
    careerPathway: "Civil Judge Junior Division / Judicial Magistrate → Senior Civil Judge → District & Sessions Judge → High Court Justice → Supreme Court Justice",
    salaryRange: "₹10,00,000 - ₹30,00,000 / year (With Government Allowances & Housing)",
    growthRate: "+12% (Prestigious Sovereign Role)",
    demandLevel: "High Prestige"
  },
  'ias_officer': {
    description: "Administers government policies, manages district civil governance, coordinates public welfare, and advises ministries.",
    education: "Bachelor's degree in any discipline with qualification in the UPSC Civil Services Examination (CSE).",
    responsibilities: [
      "Manage public administration, law and order, and emergency disaster relief across administrative districts",
      "Formulate, execute, and monitor central and state socio-economic development schemes",
      "Allocate and supervise district government budgets, public healthcare, and educational services",
      "Draft policy frameworks, cabinet briefings, and legislative bills at state and central ministry secretariats"
    ],
    relevantDegrees: ["Any Bachelor's Degree (B.A., B.Sc., B.Tech, B.Com, MBBS, etc.)"],
    relevantSubjects: ["Indian Polity & Governance", "Indian & World Economy", "Modern History & Geography", "Ethics, Integrity & Aptitude", "General Science & Current Affairs"],
    entranceExams: ["UPSC Civil Services Examination (Prelims, Mains, Personality Test Interview)"],
    careerPathway: "Assistant Collector (Sub-Divisional Magistrate) → District Magistrate / Collector → Joint Secretary → Principal Secretary → Cabinet Secretary of India",
    salaryRange: "₹7,50,000 - ₹28,00,000 / year (With Highest Sovereign Privileges & Security)",
    growthRate: "+10% (Apex Civil Service)",
    demandLevel: "Extremely Prestigious"
  },
  'ips_officer': {
    description: "Leads law enforcement, crime prevention, intelligence operations, and internal security for the state and nation.",
    education: "Bachelor's degree in any discipline with qualification in the UPSC Civil Services Examination (CSE).",
    responsibilities: [
      "Command district and state police personnel to maintain public peace and enforce criminal law",
      "Direct investigations into organized crime, financial fraud, narcotics trafficking, and cybercrime",
      "Oversee intelligence gathering, VIP security protocols, counter-terrorism, and riot containment",
      "Lead state police battalions and central armed police forces (IB, CBI, RAW, NIA, CRPF, BSF)"
    ],
    relevantDegrees: ["Any Bachelor's Degree in Science, Engineering, Arts, Commerce, or Law"],
    relevantSubjects: ["Criminal Law & Police Administration", "Internal Security Challenges", "Indian Constitution & Governance", "Ethics & Leadership", "Physical Training (SVPNPA)"],
    entranceExams: ["UPSC Civil Services Examination (Prelims, Mains, Interview)"],
    careerPathway: "Assistant Superintendent of Police (ASP) → Superintendent of Police (SP / DCP) → Deputy Inspector General (DIG) → Inspector General (IG) → Director General of Police (DGP)",
    salaryRange: "₹7,50,000 - ₹26,00,000 / year (With Official Residence & Security)",
    growthRate: "+10% (Apex Police Service)",
    demandLevel: "Extremely Prestigious"
  },

  // ─── AVIATION & SPACE ────────────────────────────────────────────────────────
  'pilot': {
    description: "Commands commercial or cargo aircraft, navigates air routes, and ensures passenger and flight safety.",
    education: "10+2 with Physics and Mathematics, followed by DGCA-approved flight school training to earn CPL (Commercial Pilot License).",
    responsibilities: [
      "Perform pre-flight inspections, flight planning, fuel calculations, and weight-and-balance checks",
      "Operate multi-engine aircraft controls, automated flight management systems (FMS), and radar",
      "Communicate with air traffic control (ATC) towers during taxi, takeoff, cruising, and landing phases",
      "Manage emergency in-flight contingencies, severe weather diversions, and system redundancies"
    ],
    relevantDegrees: ["B.Sc in Aviation (Optional)", "CPL (Commercial Pilot License by DGCA)", "Type Rating on Specific Aircraft (A320 / B737)"],
    relevantSubjects: ["Air Navigation & Flight Planning", "Aviation Meteorology", "Air Regulations & Flight Rules", "Aviation Technical General & Specific", "Radio Telephony (RTR)"],
    entranceExams: ["DGCA CPL Theory Exams", "RTR(A) Exam by WPC", "Airline Cadet Pilot Assessments"],
    careerPathway: "Second Officer → First Officer (Co-Pilot) → Senior First Officer → Captain (Commander) → Line Training Captain / Chief Pilot",
    salaryRange: "₹18,00,000 - ₹70,00,000 / year",
    growthRate: "+22% (Booming Commercial Aviation)",
    demandLevel: "High Demand"
  },
  'space_scientist': {
    description: "Researches celestial bodies, planetary systems, space physics, and satellite orbital dynamics.",
    education: "Master's or Ph.D. in Astrophysics, Space Science, Physics, or Aerospace Engineering.",
    responsibilities: [
      "Analyze astronomical data collected by space telescopes, orbital probes, and deep space telemetry",
      "Model orbital trajectories, gravitational assists, and planetary atmosphere characteristics",
      "Design scientific sensor payloads for lunar, planetary, and solar exploration missions",
      "Publish breakthrough research papers on stellar evolution, cosmological models, and exoplanets"
    ],
    relevantDegrees: ["B.Tech in Aerospace Engineering / Engineering Physics", "B.Sc & M.Sc Physics / Astronomy", "Ph.D. in Astrophysics / Space Science"],
    relevantSubjects: ["Astrophysics & Celestial Mechanics", "Classical & Quantum Mechanics", "Electrodynamics & Plasma Physics", "Orbital Dynamics & Trajectory Design", "Computational Physics & Data Analysis"],
    entranceExams: ["ISRO ICRB Entrance Examination", "GATE (Physics / Aerospace)", "CSIR-NET JRF", "JEST (Joint Entrance Screening Test)"],
    careerPathway: "Scientist/Engineer 'SC' → Scientist 'SD/SE' → Senior Project Scientist → Mission Director → Director of Space Center (ISRO/NASA)",
    salaryRange: "₹8,00,000 - ₹28,00,000 / year",
    growthRate: "+18% (Expanding Space Sector)",
    demandLevel: "High Prestige"
  }
};

export const MOCK_CAREER_DETAILS = STATIC_CAREER_INFORMATION;

// Construct the complete career data array dynamically with rich structured data
export const CAREERS_DATA: CareerMetadata[] = STEP3_DREAM_CAREERS.map((title) => {
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  const skills = CAREER_SKILL_MAPPING[id] || ['Problem Solving', 'Communication', 'Analytical Thinking'];
  const category = getCareerCategory(title);
  
  const staticDetails = STATIC_CAREER_INFORMATION[id];

  // Default fallback generator based on category if specific entry is not explicitly written
  const defaultDescription = staticDetails?.description || `Professional career in ${category} focused on specialized industry execution and development as a ${title}.`;
  const defaultEducation = staticDetails?.education || `Bachelor's degree or specialized professional training in ${category} or related discipline.`;
  const defaultResponsibilities = staticDetails?.responsibilities || [
    `Execute core ${title} tasks and industry standard operational workflows`,
    `Collaborate with cross-functional teams and stakeholders on project deliverables`,
    `Maintain continuous learning and ensure adherence to professional compliance standards`
  ];
  const defaultDegrees = staticDetails?.relevantDegrees || [`Bachelor's in ${category}`, `Specialized Diploma in ${title}`];
  const defaultSubjects = staticDetails?.relevantSubjects || [`Foundational ${category} Principles`, `Applied ${title} Methodologies`, `Professional Ethics & Industry Standards`];
  const defaultExams = staticDetails?.entranceExams || [`Relevant National & State Entrance Examinations`, `Professional Certification & Licensure`];
  const defaultPathway = staticDetails?.careerPathway || `Entry-Level ${title} → Mid-Level Professional → Senior ${title} → Lead / Director`;
  const defaultSalary = staticDetails?.salaryRange || `₹4,50,000 - ₹18,00,000 / year`;
  const defaultGrowth = staticDetails?.growthRate || `+15% (Steady Growth)`;
  const defaultDemand = staticDetails?.demandLevel || `High Demand`;

  return {
    id,
    title,
    category,
    description: defaultDescription,
    overview: defaultDescription,
    education: defaultEducation,
    skills,
    responsibilities: defaultResponsibilities,
    relevantDegrees: defaultDegrees,
    relevantSubjects: defaultSubjects,
    entranceExams: defaultExams,
    careerPathway: defaultPathway,
    salaryRange: defaultSalary,
    growthRate: defaultGrowth,
    demandLevel: defaultDemand
  };
});
