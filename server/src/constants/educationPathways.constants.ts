/**
 * Visionix Phase 22 — Education Pathway Constants Dataset
 * Structured, deterministic Indian education pathways connecting student education stages
 * to next academic options, qualifying exams, skills, and existing CAREERS_DATA IDs.
 */

export interface IEducationPathway {
  id: string;
  title: string;
  category: string;
  description: string;
  applicableTo: {
    levels: string[]; // e.g. ['school', 'class_10'], ['intermediate', '10+2'], ['diploma'], ['undergraduate']
    streams: string[]; // e.g. ['mpc', 'pcmb'], ['bipc'], ['mec', 'cec'], ['dip_cse'], ['btech'], ['all']
    branches?: string[];
    currentClasses?: string[];
  };
  nextEducationOptions: string[];
  courses: string[];
  entranceExams: string[];
  duration: string;
  skills: string[];
  careers: string[]; // Reuses CAREERS_DATA IDs (e.g. 'software_engineer', 'doctor', 'chartered_accountant')
  keyOutcomes: string[];
  isDirectStreamFit: boolean;
}

export const EDUCATION_PATHWAYS: IEducationPathway[] = [
  // ════════════════════════════════════════════════════════════════════════════════
  // 1. CLASS 10 / SECONDARY SCHOOL TRANSITIONS
  // ════════════════════════════════════════════════════════════════════════════════
  {
    id: 'class10-to-inter-mpc',
    title: 'Intermediate (10+2) — MPC (Maths, Physics, Chemistry)',
    category: 'Engineering & Physical Sciences',
    description: 'The foundational Indian 10+2 science pathway focusing on analytical mathematics, mechanics, and physical sciences. Prepares students for engineering, computing, architecture, aviation, and defence entrances.',
    applicableTo: {
      levels: ['school', 'class_10', '10th', 'secondary'],
      streams: ['all', 'general', '10th_general', 'school'],
      currentClasses: ['class 10', 'class 9', 'class 8 or below']
    },
    nextEducationOptions: [
      'B.Tech / B.E. in Computer Science, AI, Electronics, Mechanical, Civil',
      'BCA / B.Sc Computer Science & Data Analytics',
      'B.Arch (Architecture)',
      'Commercial Pilot License (CPL) Training',
      'National Defence Academy (NDA — Air Force & Navy)'
    ],
    courses: ['Intermediate MPC', 'CBSE / ICSE +2 Science (Non-Medical)', 'PUC Science (PCMs)'],
    entranceExams: ['JEE Main', 'JEE Advanced', 'State Engineering CETs (TS EAMCET / AP EAPCET / KCET / MHT-CET)', 'BITSAT', 'NDA'],
    duration: '2 Years',
    skills: ['Analytical Mathematics', 'Physics Principles', 'Problem Solving', 'Logical Reasoning', 'Algorithmic Thinking'],
    careers: ['software_engineer', 'ai_engineer', 'robotics_engineer', 'civil_engineer', 'architect', 'pilot', 'space_scientist'],
    keyOutcomes: [
      'Eligibility for all national and state-level engineering and technology entrance exams',
      'Strong mathematical base for computer science, data analytics, and core engineering',
      'Gateway to commercial aviation (DGCA CPL) and technical armed forces commissions'
    ],
    isDirectStreamFit: true
  },
  {
    id: 'class10-to-inter-bipc',
    title: 'Intermediate (10+2) — BiPC (Biology, Physics, Chemistry)',
    category: 'Medical & Life Sciences',
    description: 'The premier secondary life sciences pathway focusing on human anatomy, botany, zoology, and biochemistry. Tailored for medical, dental, pharmaceutical, agricultural, and biotechnology aspirations.',
    applicableTo: {
      levels: ['school', 'class_10', '10th', 'secondary'],
      streams: ['all', 'general', '10th_general', 'school'],
      currentClasses: ['class 10', 'class 9', 'class 8 or below']
    },
    nextEducationOptions: [
      'MBBS (Bachelor of Medicine & Bachelor of Surgery)',
      'BDS (Bachelor of Dental Surgery)',
      'B.Pharm / Pharm.D (Pharmacy)',
      'B.Sc Nursing & Allied Health Technologies',
      'B.Sc Agriculture & Horticulture',
      'B.Tech / B.Sc Biotechnology & Genetics'
    ],
    courses: ['Intermediate BiPC', 'CBSE / ICSE +2 Science (Medical)', 'PUC Science (PCB)'],
    entranceExams: ['NEET-UG (National Eligibility cum Entrance Test)', 'ICAR AIEEA (Agriculture)', 'State Agriculture & Medical CETs', 'AIIMS Nursing CET'],
    duration: '2 Years',
    skills: ['Biological Classification', 'Human Physiology', 'Chemical Analysis', 'Observation & Diagnostics', 'Scientific Research'],
    careers: ['doctor', 'surgeon', 'dentist', 'nurse', 'pharmacist', 'veterinarian', 'nutritionist'],
    keyOutcomes: [
      'Direct qualification track for national medical admissions via NEET-UG',
      'Preparation for high-growth healthcare sectors: clinical diagnostics, pharmaceutical R&D, and biotechnology',
      'Options in modern agricultural science, food technology, and clinical nursing'
    ],
    isDirectStreamFit: true
  },
  {
    id: 'class10-to-inter-pcmb',
    title: 'Intermediate (10+2) — PCMB (Physics, Chemistry, Maths, Biology)',
    category: 'Dual Track STEM',
    description: 'The versatile four-subject STEM pathway keeping both engineering/tech and medical/life sciences avenues wide open without early career restriction.',
    applicableTo: {
      levels: ['school', 'class_10', '10th', 'secondary'],
      streams: ['all', 'general', '10th_general', 'school'],
      currentClasses: ['class 10', 'class 9', 'class 8 or below']
    },
    nextEducationOptions: [
      'B.Tech in Biomedical Engineering / Biotechnology / Bioinformatics',
      'MBBS / BDS / B.Pharm / Pharm.D',
      'B.Tech Computer Science / AI / Data Science',
      'B.Sc Pure Sciences / Research Programs (IISc / IISER)',
      'Commercial Aviation (Pilot CPL)'
    ],
    courses: ['Intermediate PCMB', 'CBSE / ICSE +2 Science (PCMB)', 'PUC Science (PCMB)'],
    entranceExams: ['JEE Main', 'NEET-UG', 'IAT (IISER Aptitude Test)', 'NEST', 'State CETs'],
    duration: '2 Years',
    skills: ['Mathematical Modeling', 'Biological Sciences', 'Physical Science Analysis', 'Quantitative Reasoning'],
    careers: ['ai_engineer', 'doctor', 'software_engineer', 'pharmacist', 'space_scientist', 'architect'],
    keyOutcomes: [
      'Dual eligibility for both JEE (Engineering) and NEET (Medical) examinations',
      'Ideal background for modern interdisciplinary frontiers: computational biology, bioinformatics, and neurotechnology',
      'Highest academic flexibility across STEM disciplines'
    ],
    isDirectStreamFit: true
  },
  {
    id: 'class10-to-inter-mec',
    title: 'Intermediate (10+2) — MEC (Maths, Economics, Commerce)',
    category: 'Commerce, Finance & Economics',
    description: 'A quantitative commerce pathway combining financial accounting and commerce with advanced mathematics and economics. Ideal for careers in corporate finance, chartered accountancy, data analytics, and fintech.',
    applicableTo: {
      levels: ['school', 'class_10', '10th', 'secondary'],
      streams: ['all', 'general', '10th_general', 'school'],
      currentClasses: ['class 10', 'class 9', 'class 8 or below']
    },
    nextEducationOptions: [
      'B.Com (Honours / Data Analytics / Financial Accounting)',
      'BBA / BMS (Bachelor of Business Administration)',
      'Professional CA (Chartered Accountancy — ICAI Foundation)',
      'B.A. / B.Sc in Economics & Financial Analytics',
      'Actuarial Science Studies'
    ],
    courses: ['Intermediate MEC', 'CBSE / ICSE +2 Commerce with Applied Mathematics', 'PUC Commerce (MEBA / MEC)'],
    entranceExams: ['CA Foundation (ICAI)', 'CUET-UG (Central Universities)', 'IPMAT (IIM Integrated BBA+MBA)', 'SET / NPAT'],
    duration: '2 Years',
    skills: ['Financial Accounting', 'Statistical & Mathematical Analysis', 'Micro & Macroeconomics', 'Business Numeracy', 'Spreadsheet Modeling'],
    careers: ['chartered_accountant', 'financial_analyst', 'investment_banker', 'product_manager', 'data_scientist', 'entrepreneur'],
    keyOutcomes: [
      'Early foundation for ICAI Chartered Accountancy (CA) and CMA certifications',
      'Mathematical advantage in business school entrances (IPMAT/CUET) and economics degree programs',
      'Direct bridge to banking, financial markets, equity research, and commercial management'
    ],
    isDirectStreamFit: true
  },
  {
    id: 'class10-to-inter-cec',
    title: 'Intermediate (10+2) — CEC (Civics, Economics, Commerce)',
    category: 'Commerce, Business & Law',
    description: 'The business and social administration pathway designed for students interested in commercial operations, corporate law, business administration, banking, and public policy.',
    applicableTo: {
      levels: ['school', 'class_10', '10th', 'secondary'],
      streams: ['all', 'general', '10th_general', 'school'],
      currentClasses: ['class 10', 'class 9', 'class 8 or below']
    },
    nextEducationOptions: [
      'B.Com (General / Taxation / Banking & Insurance)',
      'BBA (Bachelor of Business Administration / Marketing / HR)',
      'Integrated 5-Year Law (B.A. LL.B / BBA LL.B)',
      'Bachelor of Hotel Management (BHM)',
      'Civil Services Foundation Studies (UPSC)'
    ],
    courses: ['Intermediate CEC', 'CBSE / ICSE +2 Commerce', 'PUC Commerce (CEBA)'],
    entranceExams: ['CLAT (Common Law Admission Test)', 'CUET-UG', 'NCHMCT JEE (Hotel Management)', 'State Law CETs'],
    duration: '2 Years',
    skills: ['Business Communication', 'Economic Concepts', 'Civic Principles & Governance', 'Accounting Fundamentals', 'Organizational Skills'],
    careers: ['chartered_accountant', 'lawyer', 'financial_analyst', 'entrepreneur', 'ias_officer', 'judge'],
    keyOutcomes: [
      'Direct stepping stone to corporate management (BBA) and commerce (B.Com)',
      'Preparation for competitive 5-year integrated law programs (National Law Universities)',
      'Foundation in constitutional governance and commerce for civil services'
    ],
    isDirectStreamFit: true
  },
  {
    id: 'class10-to-inter-hec',
    title: 'Intermediate (10+2) — HEC (History, Economics, Civics)',
    category: 'Humanities, Social Sciences & Law',
    description: 'A humanities and social sciences pathway exploring civil society, historical political systems, public administration, and economic theories. Excellent for civil services, journalism, creative arts, and legal advocacy.',
    applicableTo: {
      levels: ['school', 'class_10', '10th', 'secondary'],
      streams: ['all', 'general', '10th_general', 'school'],
      currentClasses: ['class 10', 'class 9', 'class 8 or below']
    },
    nextEducationOptions: [
      'B.A. in History, Political Science, Public Administration, Sociology, Psychology',
      'Integrated 5-Year Law (B.A. LL.B)',
      'Bachelor of Journalism & Mass Communication (BJMC)',
      'Bachelor of Design (B.Des) & Fine Arts (BFA)',
      'Social Work (BSW) & Public Policy'
    ],
    courses: ['Intermediate HEC', 'CBSE / ICSE +2 Humanities / Arts', 'PUC Arts (HEPS / HEG)'],
    entranceExams: ['CLAT / AILET', 'CUET-UG Humanities', 'UCEED / NID DAT (Design)', 'State University Arts CETs'],
    duration: '2 Years',
    skills: ['Critical Analysis', 'Written & Verbal Communication', 'Constitutional Law Concepts', 'Historical Research', 'Public Policy Understanding'],
    careers: ['lawyer', 'ias_officer', 'ips_officer', 'judge', 'ui_designer', 'ux_designer'],
    keyOutcomes: [
      'Strongest preparatory base for UPSC Civil Services Examination (IAS / IPS / IFS)',
      'Direct eligibility for top law schools (NLUs) through CLAT',
      'Pathways in digital media journalism, UX research, creative writing, and public governance'
    ],
    isDirectStreamFit: true
  },
  {
    id: 'class10-to-polytechnic-diploma',
    title: 'Polytechnic Diploma in Engineering (3-Year Technical Pathway)',
    category: 'Technical & Engineering Trades',
    description: 'A hands-on, 3-year technical education pathway directly after Class 10. Offers practical engineering training with direct 2nd-year lateral entry eligibility into B.Tech/B.E. degrees.',
    applicableTo: {
      levels: ['school', 'class_10', '10th', 'secondary'],
      streams: ['all', 'general', '10th_general', 'school'],
      currentClasses: ['class 10', 'class 9', 'class 8 or below']
    },
    nextEducationOptions: [
      'Lateral Entry B.Tech / B.E. (Direct Admission into 2nd Year)',
      'Diploma in Computer Engineering / IT',
      'Diploma in Mechanical / Automobile Engineering',
      'Diploma in Civil Engineering & Architecture Assistantship',
      'Diploma in Electrical & Electronics Engineering (EEE/ECE)',
      'Junior Engineer (JE) in Public Sector (SSC JE, RRB JE)'
    ],
    courses: ['State Polytechnic Diploma (DCE, DME, DCivil, DEEE, DECE)', 'Autonomous Polytechnic Program'],
    entranceExams: ['State Polytechnic Entrance Test (POLYCET / TS POLYCET / AP POLYCET / JEECUP)'],
    duration: '3 Years',
    skills: ['Practical Workshop Operations', 'Circuit & Mechanical Troubleshooting', 'Technical Drawing / CAD', 'Applied Programming', 'Industrial Safety'],
    careers: ['software_engineer', 'mechanical_engineer', 'civil_engineer', 'electrical_engineer', 'robotics_engineer'],
    keyOutcomes: [
      'Direct entry to 2nd Year B.Tech via Lateral Entry Engineering Common Entrance Tests (ECET / LEET)',
      'Early employment eligibility as Junior Engineers, Technical Supervisors, and CAD Technicians',
      'Hands-on laboratory and workshop experience prior to degree studies'
    ],
    isDirectStreamFit: true
  },
  {
    id: 'class10-to-iti-vocational',
    title: 'ITI & Vocational Technical Training (1-2 Year National Trade Certifications)',
    category: 'Vocational & Industrial Trades',
    description: 'Practical, fast-track skill training in core industrial, electrical, and mechanical trades certified by NCVT (National Council for Vocational Training).',
    applicableTo: {
      levels: ['school', 'class_10', '10th', 'secondary'],
      streams: ['all', 'general', '10th_general', 'school'],
      currentClasses: ['class 10', 'class 9', 'class 8 or below']
    },
    nextEducationOptions: [
      'Apprenticeship Training Scheme (ATS) in Industrial Units & PSUs (BHEL, Railways, HAL)',
      'Lateral Entry into 2nd Year Polytechnic Diploma',
      'All India Trade Test (AITT) for National Trade Certificate (NTC)',
      'Technician / Maintenance Specialist in Manufacturing & Core Industries'
    ],
    courses: ['ITI Electrician (2 Years)', 'ITI Fitter (2 Years)', 'ITI Motor Mechanic (2 Years)', 'ITI Draughtsman Civil/Mechanical (2 Years)', 'COPA (Computer Operator & Programming Assistant - 1 Year)'],
    entranceExams: ['State ITI Merit Admission / State Vocational Aptitude Test'],
    duration: '1 - 2 Years',
    skills: ['Electrical Wiring & Circuit Testing', 'Machine Tool Operations & Fitting', 'Mechanical Maintenance', 'Technical Drawing Interpretation', 'Industrial Safety Standards'],
    careers: ['electrical_engineer', 'mechanical_engineer', 'civil_engineer'],
    keyOutcomes: [
      'Recognized NCVT National Trade Certificate enabling direct industrial technician employment',
      'Eligibility for Railway Technician (RRB ALP / Technician) and PSU skilled trades',
      'Pathway to lateral entry diploma in engineering'
    ],
    isDirectStreamFit: true
  },

  // ════════════════════════════════════════════════════════════════════════════════
  // 2. INTERMEDIATE MPC / +2 SCIENCE (MATHS) TRANSITIONS
  // ════════════════════════════════════════════════════════════════════════════════
  {
    id: 'inter-mpc-to-btech-cse',
    title: 'B.Tech / B.E. in Computer Science & Information Technology',
    category: 'Engineering & Technology',
    description: 'The leading undergraduate engineering degree in software design, algorithms, artificial intelligence, cloud architectures, and cybersecurity.',
    applicableTo: {
      levels: ['intermediate', '10+2', '12th', 'puc', 'higher_secondary'],
      streams: ['mpc', 'pcmb', 'science_maths', 'dip_cse']
    },
    nextEducationOptions: [
      'M.Tech in Artificial Intelligence / Computer Science (via GATE)',
      'M.S. in Computer Science abroad (GRE / TOEFL)',
      'MBA in Technology Management (via CAT / GMAT)',
      'Direct software industry placement across product and services tech companies'
    ],
    courses: ['B.Tech Computer Science & Engineering', 'B.Tech Artificial Intelligence & Machine Learning', 'B.Tech Data Science', 'B.E. Information Technology'],
    entranceExams: ['JEE Main', 'JEE Advanced', 'TS EAMCET / AP EAPCET / KCET / MHT-CET', 'BITSAT', 'VITEEE', 'SRMJEEE'],
    duration: '4 Years',
    skills: ['Data Structures & Algorithms', 'Full-Stack Web & App Development', 'Cloud Computing', 'Database Management', 'Object-Oriented Programming (Java/Python/C++)'],
    careers: ['software_engineer', 'ai_engineer', 'ml_engineer', 'data_scientist', 'cloud_engineer', 'cybersecurity_analyst', 'game_developer', 'blockchain_developer'],
    keyOutcomes: [
      'Comprehensive readiness for software engineering roles in global tech enterprises and startups',
      'Deep algorithmic and system design foundation for scalable cloud systems',
      'Eligibility for higher research degrees (M.Tech/MS) and management programs'
    ],
    isDirectStreamFit: true
  },
  {
    id: 'inter-mpc-to-btech-core',
    title: 'B.Tech / B.E. in Core Engineering (Mechanical, Civil, Electrical, Robotics)',
    category: 'Engineering & Manufacturing',
    description: 'Core physical engineering degree covering industrial automation, smart infrastructure, robotics, energy systems, and advanced structural mechanics.',
    applicableTo: {
      levels: ['intermediate', '10+2', '12th', 'puc', 'higher_secondary'],
      streams: ['mpc', 'pcmb', 'science_maths']
    },
    nextEducationOptions: [
      'M.Tech in Robotics / Thermal / Structural / Power Systems Engineering (via GATE)',
      'Public Sector Undertaking (PSU) recruitment as Graduate Executive Engineer (ISRO, BHEL, NTPC, ONGC, IOCL)',
      'Master of Science (MS) in Mechatronics / Aerospace Engineering',
      'Engineering consultancy & technical management roles'
    ],
    courses: ['B.Tech Mechanical Engineering', 'B.Tech Civil Engineering', 'B.Tech Electrical & Electronics Engineering (EEE)', 'B.Tech Robotics & Automation', 'B.Tech Aerospace Engineering'],
    entranceExams: ['JEE Main', 'JEE Advanced', 'State Engineering CETs', 'BITSAT', 'GATE (post-degree)'],
    duration: '4 Years',
    skills: ['3D CAD Modeling (SolidWorks/AutoCAD)', 'Thermodynamics & Fluid Mechanics', 'Structural Load Analysis', 'Embedded Systems & PLC Programming', 'Industrial Safety & QA'],
    careers: ['mechanical_engineer', 'civil_engineer', 'electrical_engineer', 'robotics_engineer', 'marine_engineer'],
    keyOutcomes: [
      'Eligibility for elite PSU engineering roles through GATE examination',
      'Specialized competencies in industrial robotics, green energy, smart cities, and heavy infrastructure',
      'Global opportunities in automotive, aerospace, defense, and power sectors'
    ],
    isDirectStreamFit: true
  },
  {
    id: 'inter-mpc-to-bca-bsc-cs',
    title: 'BCA & B.Sc in Computer Science / Data Analytics',
    category: 'Applied Computing & Information Systems',
    description: 'A dedicated 3-year computing and application development degree focusing on programming, database management, software development, and web technologies.',
    applicableTo: {
      levels: ['intermediate', '10+2', '12th', 'puc', 'higher_secondary'],
      streams: ['mpc', 'pcmb', 'mec', 'science_maths']
    },
    nextEducationOptions: [
      'MCA (Master of Computer Applications — 2-Year Program via NIMCET)',
      'M.Sc Data Science / Artificial Intelligence',
      'MBA in Information Technology / Systems Management',
      'Software Developer / Technical Consultant in IT Services & Startups'
    ],
    courses: ['BCA (Bachelor of Computer Applications)', 'B.Sc Computer Science', 'B.Sc Data Science & Analytics'],
    entranceExams: ['CUET-UG', 'IPU CET', 'NIMCET (for post-degree MCA)', 'University Specific Aptitude Tests'],
    duration: '3 Years',
    skills: ['Web Development (HTML/CSS/JS/React)', 'Python Programming', 'SQL & Database Architecture', 'Mobile App Development', 'Operating Systems'],
    careers: ['software_engineer', 'ui_designer', 'ux_designer', 'cloud_engineer', 'data_scientist'],
    keyOutcomes: [
      'Cost-effective and time-efficient 3-year route into software development',
      'Seamless progression into top NITs for MCA through NIMCET entrance',
      'Strong practical foundation in modern web, mobile, and database stacks'
    ],
    isDirectStreamFit: true
  },
  {
    id: 'inter-mpc-to-architecture',
    title: 'Bachelor of Architecture (B.Arch) & Sustainable Spatial Planning',
    category: 'Architecture & Spatial Design',
    description: 'A 5-year professional architectural degree combining structural mathematics, aesthetic design, urban planning, and sustainable building technologies.',
    applicableTo: {
      levels: ['intermediate', '10+2', '12th', 'puc', 'higher_secondary'],
      streams: ['mpc', 'pcmb', 'science_maths']
    },
    nextEducationOptions: [
      'M.Arch in Urban Design / Sustainable Architecture',
      'Master of Urban & Regional Planning (MURP)',
      'Council of Architecture (CoA) Professional Licensure',
      'Founding an independent architectural and interior design consultancy'
    ],
    courses: ['B.Arch (Bachelor of Architecture)', 'B.Planning (Bachelor of Planning)'],
    entranceExams: ['NATA (National Aptitude Test in Architecture)', 'JEE Main Paper 2 (B.Arch/B.Planning)'],
    duration: '5 Years',
    skills: ['Architectural Drawing & Sketching', 'BIM & 3D Visualization (Revit/Rhino/AutoCAD)', 'Building Codes & Structural Mechanics', 'Sustainable Design Principles', 'Space Planning'],
    careers: ['architect', 'interior_designer', 'civil_engineer', 'ui_designer'],
    keyOutcomes: [
      'Statutory Council of Architecture (CoA) license to practice as a certified architect',
      'Mastery of digital architectural modeling, sustainable energy envelopes, and urban planning',
      'Diverse career paths in architectural firms, real estate development, and interior design'
    ],
    isDirectStreamFit: true
  },
  {
    id: 'inter-mpc-to-aviation-cpl',
    title: 'Commercial Aviation — DGCA Commercial Pilot License (CPL)',
    category: 'Aviation & Aerospace',
    description: 'A specialized aviation flight-training pathway to earn a Commercial Pilot License approved by the Directorate General of Civil Aviation (DGCA).',
    applicableTo: {
      levels: ['intermediate', '10+2', '12th', 'puc', 'higher_secondary'],
      streams: ['mpc', 'pcmb', 'science_maths']
    },
    nextEducationOptions: [
      'Type Rating on Commercial Aircraft (Airbus A320 / Boeing 737)',
      'First Officer (Co-Pilot) at Domestic & International Airlines',
      'Line Captain / Flight Instructor Rating'
    ],
    courses: ['DGCA CPL Flight Training Program (200 Flying Hours)', 'B.Sc in Aviation (Optional Integrated Degree)'],
    entranceExams: ['DGCA CPL Theoretical Examinations', 'RTR(A) Radio Telephony Exam (WPC)', 'Class 1 Aviation Medical Examination', 'Airline Cadet Pilot Assessments (IndiGo / Air India)'],
    duration: '18 - 24 Months',
    skills: ['Cockpit Instrument Navigation', 'Aviation Meteorology & Weather Analysis', 'Air Regulations & Flight Rules', 'Emergency Contingency Management', 'Radio Telephony Communications'],
    careers: ['pilot'],
    keyOutcomes: [
      'Direct issuance of DGCA Commercial Pilot License upon 200 certified flying hours',
      'Career trajectory leading to First Officer and Commander roles in commercial airlines',
      'Rigorous training in instrument flight rules (IFR), multi-engine operations, and aviation aerodynamics'
    ],
    isDirectStreamFit: true
  },

  // ════════════════════════════════════════════════════════════════════════════════
  // 3. INTERMEDIATE BiPC / +2 SCIENCE (BIOLOGY) TRANSITIONS
  // ════════════════════════════════════════════════════════════════════════════════
  {
    id: 'inter-bipc-to-mbbs-bds',
    title: 'MBBS (Medicine & Surgery) & BDS (Dental Surgery)',
    category: 'Medical & Clinical Healthcare',
    description: 'The premier clinical medical qualification in India. Comprehensive clinical education in pathology, diagnosis, pharmacology, surgery, and emergency medicine.',
    applicableTo: {
      levels: ['intermediate', '10+2', '12th', 'puc', 'higher_secondary'],
      streams: ['bipc', 'pcmb', 'science_biology', 'medical']
    },
    nextEducationOptions: [
      'MD / MS (Doctor of Medicine / Master of Surgery via NEET-PG / INI-CET)',
      'MDS (Master of Dental Surgery)',
      'DNB (Diplomate of National Board)',
      'Clinical residency and hospital practice'
    ],
    courses: ['MBBS (Bachelor of Medicine, Bachelor of Surgery)', 'BDS (Bachelor of Dental Surgery)'],
    entranceExams: ['NEET-UG (National Eligibility cum Entrance Test)'],
    duration: '5.5 Years (4.5 Years Academic + 1 Year Compulsory Rotatory Internship)',
    skills: ['Clinical Examination & Diagnosis', 'Patient Care & Medical Ethics', 'Surgical Foundations & Wound Management', 'Pharmacotherapy', 'Emergency Trauma Response'],
    careers: ['doctor', 'surgeon', 'dentist'],
    keyOutcomes: [
      'Statutory National Medical Commission (NMC) / Dental Council of India (DCI) medical license',
      'Direct eligibility for postgraduate medical specializations (MD/MS) across cardiology, neurology, radiology, and surgery',
      'Lifelong prestigious healthcare career with universal global demand'
    ],
    isDirectStreamFit: true
  },
  {
    id: 'inter-bipc-to-pharmacy',
    title: 'B.Pharm & Pharm.D (Pharmaceutical Sciences & Clinical Pharmacy)',
    category: 'Pharmaceutical & Drug Development',
    description: 'A 4-year undergraduate or 6-year doctoral pharmaceutical degree covering medicinal chemistry, pharmacology, drug delivery formulations, and clinical trials.',
    applicableTo: {
      levels: ['intermediate', '10+2', '12th', 'puc', 'higher_secondary'],
      streams: ['bipc', 'pcmb', 'science_biology', 'medical']
    },
    nextEducationOptions: [
      'M.Pharm in Pharmacology / Pharmaceutics / Quality Assurance (via GPAT)',
      'MS (Pharm) at NIPER (National Institute of Pharmaceutical Education and Research)',
      'MBA in Pharmaceutical Management / Health Policy',
      'Pharmaceutical R&D, Regulatory Affairs, and Clinical Trial Management'
    ],
    courses: ['B.Pharm (Bachelor of Pharmacy)', 'Pharm.D (Doctor of Pharmacy)'],
    entranceExams: ['GPAT (Graduate Pharmacy Aptitude Test — for post-degree)', 'State Engineering & Pharmacy CETs (EAMCET / MHT-CET)', 'NIPER JEE'],
    duration: '4 Years (B.Pharm) / 6 Years (Pharm.D)',
    skills: ['Medicinal Chemistry & Formulations', 'Pharmacology & Toxicology', 'Drug Dispensing & Quality Control', 'Clinical Trials Protocol', 'Regulatory Documentation (FDA/EMA)'],
    careers: ['pharmacist', 'nutritionist', 'doctor'],
    keyOutcomes: [
      'State Pharmacy Council registration to operate community, hospital, and corporate pharmacies',
      'Fast-track career in pharmaceutical R&D, bio-equivalence research, and regulatory compliance',
      'High international demand across healthcare, biotechnology, and nutraceutical industries'
    ],
    isDirectStreamFit: true
  },
  {
    id: 'inter-bipc-to-nursing-allied',
    title: 'B.Sc Nursing & Allied Health Sciences',
    category: 'Nursing & Allied Medical Sciences',
    description: 'A professional 4-year healthcare degree in evidence-based patient nursing, critical care, anaesthesia technology, medical imaging, and cardiac perfusion.',
    applicableTo: {
      levels: ['intermediate', '10+2', '12th', 'puc', 'higher_secondary'],
      streams: ['bipc', 'pcmb', 'science_biology', 'medical']
    },
    nextEducationOptions: [
      'M.Sc in Critical Care / Pediatric / Community Health Nursing',
      'Specialized Clinical Nurse Specialist (CNS) Certifications',
      'Hospital Administration & Nursing Management (MHA)',
      'International Healthcare Registrations (NCLEX-RN for USA/Canada, CBT/OSCE for UK)'
    ],
    courses: ['B.Sc Nursing', 'B.Sc Medical Laboratory Technology (BMLT)', 'B.Sc Radiology & Imaging Technology', 'B.Sc Anaesthesia & Operation Theatre Technology'],
    entranceExams: ['AIIMS B.Sc Nursing Entrance', 'NEET-UG (for central nursing colleges)', 'State Nursing & Paramedical CETs'],
    duration: '4 Years',
    skills: ['Patient Vitals & Clinical Assessment', 'Infection Control & Wound Care', 'Medication Administration', 'Emergency Trauma Support', 'Medical Record Keeping'],
    careers: ['nurse', 'nutritionist', 'pharmacist'],
    keyOutcomes: [
      'Immediate global employment with universal international mobility (UK, USA, Australia, Gulf)',
      'Certified clinical competency across ICUs, emergency departments, and specialized surgical suites',
      'Clear progression to Nursing Superintendent, Clinical Educator, and Hospital Administrator'
    ],
    isDirectStreamFit: true
  },
  {
    id: 'inter-bipc-to-agriculture-biotech',
    title: 'B.Sc (Hons) Agriculture, Horticulture & Biotechnology',
    category: 'Agricultural & Life Science Technologies',
    description: 'A 4-year scientific degree in modern agronomy, crop genetics, soil conservation, agri-biotechnology, and sustainable organic farming systems.',
    applicableTo: {
      levels: ['intermediate', '10+2', '12th', 'puc', 'higher_secondary'],
      streams: ['bipc', 'pcmb', 'science_biology', 'medical']
    },
    nextEducationOptions: [
      'M.Sc (Agri) in Genetics / Plant Pathology / Agronomy (via ICAR AIEEA-PG)',
      'Agricultural Research Service (ARS / ICAR Scientist via ASRB Exam)',
      'MBA in Agribusiness Management (IIM Ahmedabad / MANAGE)',
      'Agricultural Officer (AO) & Bank Field Officer (IBPS SO Agriculture)'
    ],
    courses: ['B.Sc (Hons) Agriculture', 'B.Sc (Hons) Horticulture', 'B.Tech Food Technology', 'B.Sc Biotechnology'],
    entranceExams: ['ICAR AIEEA (National Entrance)', 'State Agriculture University CETs (TS EAMCET Agri / AP EAPCET Agri / KCET)'],
    duration: '4 Years',
    skills: ['Crop Physiology & Agronomy', 'Soil Testing & Nutrient Management', 'Plant Pathology & Pest Control', 'Genetics & Hybrid Seed Breeding', 'Agri-Supply Chain Logistics'],
    careers: ['nutritionist', 'veterinarian', 'space_scientist'],
    keyOutcomes: [
      'Eligibility for prestigious ICAR Agricultural Research Scientist and State Agricultural Officer positions',
      'Fast-growing avenues in modern agri-tech startups, precision farming, and bio-fertilizer industries',
      'Dedicated reservation for specialist Banking Agriculture Field Officer roles (IBPS SO)'
    ],
    isDirectStreamFit: true
  },

  // ════════════════════════════════════════════════════════════════════════════════
  // 4. INTERMEDIATE MEC / COMMERCE + MATHS TRANSITIONS
  // ════════════════════════════════════════════════════════════════════════════════
  {
    id: 'inter-mec-to-ca-finance',
    title: 'Chartered Accountancy (ICAI) & B.Com Honours',
    category: 'Accounting & Corporate Taxation',
    description: 'India’s most respected accounting and statutory auditing pathway. Combines academic degree studies with ICAI professional examinations (Foundation, Inter, Final) and practical 3-year articleship.',
    applicableTo: {
      levels: ['intermediate', '10+2', '12th', 'puc', 'higher_secondary'],
      streams: ['mec', 'cec', 'commerce_maths', 'commerce', 'business']
    },
    nextEducationOptions: [
      'ICAI CA Intermediate & CA Final Examinations',
      'Articleship Practical Training (3 Years at a Registered CA Firm)',
      'Post-CA Certifications: DISA, International Tax, Forensic Audit',
      'Partner at Audit Firm / Chief Financial Officer (CFO) in Corporations'
    ],
    courses: ['B.Com (Honours) + CA Course (ICAI)', 'B.Com Financial Accounting & Auditing'],
    entranceExams: ['CA Foundation Exam (ICAI)', 'CUET-UG (for top Commerce Colleges like SRCC / Hindu)'],
    duration: '4.5 - 5 Years (Integrated CA & B.Com)',
    skills: ['Financial Auditing & Statutory Assurance', 'Corporate & International Taxation', 'Ind AS / IFRS Accounting Standards', 'Strategic Financial Management', 'Corporate Law Compliance'],
    careers: ['chartered_accountant', 'financial_analyst', 'investment_banker', 'entrepreneur'],
    keyOutcomes: [
      'Prestigious ICAI Chartered Accountant designation with statutory signing authority on company balance sheets',
      'Leadership roles in Big 4 audit firms (PwC, Deloitte, EY, KPMG) and multinational investment banks',
      'Exceptional earning potential and independence to establish public practice'
    ],
    isDirectStreamFit: true
  },
  {
    id: 'inter-mec-to-bba-management',
    title: 'BBA & Integrated Management Programs (IPM at IIMs)',
    category: 'Corporate Management & Business Leadership',
    description: 'A 3-year BBA or 5-year Integrated Program in Management (IPM) providing rigorous training in marketing strategy, corporate finance, operations, and leadership.',
    applicableTo: {
      levels: ['intermediate', '10+2', '12th', 'puc', 'higher_secondary'],
      streams: ['mec', 'cec', 'hec', 'commerce', 'business']
    },
    nextEducationOptions: [
      'MBA / PGDM from top tier Business Schools (IIMs, ISB, XLRI via CAT/XAT/GMAT)',
      'Management Consultant / Business Operations Associate',
      'Product Management & Growth Marketing Specialist',
      'Venture Capital Analyst / Startup Founder'
    ],
    courses: ['BBA (Bachelor of Business Administration)', 'Integrated IPM (5-Year BBA+MBA at IIM Indore/Rohtak/Ranchi)', 'BMS (Bachelor of Management Studies)'],
    entranceExams: ['IPMAT (IIM Indore/Rohtak)', 'JIPMAT', 'CUET-UG (BMS/BBA at Delhi University)', 'SET (Symbiosis)', 'NPAT (NMIMS)'],
    duration: '3 Years (BBA) / 5 Years (Integrated IPM)',
    skills: ['Business Strategy & Case Analysis', 'Marketing Management & Brand Strategy', 'Corporate Financial Valuation', 'Leadership & Team Management', 'Operations & Supply Chain'],
    careers: ['product_manager', 'financial_analyst', 'investment_banker', 'entrepreneur', 'marketing_manager'],
    keyOutcomes: [
      'Direct entry to premier IIMs without needing a separate CAT examination via IPMAT',
      'High-impact corporate careers in management consulting, product marketing, and business analytics',
      'Strong entrepreneurial platform to launch and scale business ventures'
    ],
    isDirectStreamFit: true
  },
  {
    id: 'inter-mec-to-economics-analytics',
    title: 'B.A. / B.Sc in Economics, Econometrics & Data Analytics',
    category: 'Economics & Quantitative Finance',
    description: 'An analytical degree exploring macroeconomic policy, econometric modeling, financial derivatives, data analytics, and public economic governance.',
    applicableTo: {
      levels: ['intermediate', '10+2', '12th', 'puc', 'higher_secondary'],
      streams: ['mec', 'mpc', 'pcmb', 'commerce_maths', 'science_maths']
    },
    nextEducationOptions: [
      'M.A. / M.Sc Economics at Delhi School of Economics (DSE) / ISI / JNU',
      'Indian Economic Service (IES via UPSC Examination)',
      'Master of Finance / Quantitative Finance (MS Finance)',
      'Risk Analyst / Macroeconomic Research Associate at Central Banks & Investment Firms'
    ],
    courses: ['B.A. (Hons) Economics', 'B.Sc Economics & Mathematical Statistics', 'B.Sc Data Science & Economics'],
    entranceExams: ['CUET-UG', 'ISI Admission Test (Indian Statistical Institute)', 'IIT-JAM Economics (for postgraduate admissions)'],
    duration: '3 - 4 Years',
    skills: ['Econometric Modeling & Regression', 'Statistical Analysis (R/Python/Stata)', 'Micro & Macroeconomic Policy', 'Financial Market Analysis', 'Quantitative Forecasting'],
    careers: ['financial_analyst', 'investment_banker', 'data_scientist', 'ias_officer', 'chartered_accountant'],
    keyOutcomes: [
      'Gateway to elite institutions like Delhi School of Economics (DSE) and Indian Statistical Institute (ISI)',
      'Prestigious career tracks in Reserve Bank of India (RBI Grade B), NITI Aayog, and global investment banks',
      'High-demand analytical roles in credit risk modeling, hedge funds, and economic consulting'
    ],
    isDirectStreamFit: true
  },

  // ════════════════════════════════════════════════════════════════════════════════
  // 5. INTERMEDIATE CEC & HEC / COMMERCE & HUMANITIES TRANSITIONS
  // ════════════════════════════════════════════════════════════════════════════════
  {
    id: 'inter-cec-hec-to-law',
    title: 'Integrated 5-Year Law (B.A. LL.B / BBA LL.B)',
    category: 'Legal Studies & Judicial Advocacy',
    description: 'A comprehensive 5-year integrated professional law degree covering constitutional jurisprudence, corporate legal frameworks, criminal justice, and dispute resolution.',
    applicableTo: {
      levels: ['intermediate', '10+2', '12th', 'puc', 'higher_secondary'],
      streams: ['cec', 'hec', 'mec', 'humanities', 'commerce', 'arts']
    },
    nextEducationOptions: [
      'LL.M (Master of Laws in Corporate Law / Constitutional Law / Cyber Law)',
      'Judicial Services Examination (Civil Judge Junior Division)',
      'All India Bar Examination (AIBE) for High Court / Supreme Court Practice',
      'Corporate Legal Counsel in Tier-1 Law Firms (Shardul Amarchand, Cyril Amarchand, AZB, Trilegal)'
    ],
    courses: ['B.A. LL.B (Honours)', 'BBA LL.B (Honours)', 'B.Com LL.B (Honours)'],
    entranceExams: ['CLAT (Common Law Admission Test for 26 NLUs)', 'AILET (NLU Delhi)', 'SLAT (Symbiosis Law)', 'State Law CETs (TS LAWCET / AP LAWCET / MH CET Law)'],
    duration: '5 Years',
    skills: ['Legal Research & Precedent Analysis', 'Courtroom Mooting & Oral Advocacy', 'Contract Drafting & Negotiation', 'Constitutional Interpretation', 'Corporate Mergers Due Diligence'],
    careers: ['lawyer', 'judge', 'ias_officer', 'ips_officer'],
    keyOutcomes: [
      'Enrollment with the Bar Council of India (BCI) with independent right to practice across all Indian courts',
      'Direct campus recruitment by premier corporate law firms and multinational legal departments',
      'Direct pathway to State Judicial Magistrate and Civil Judge appointments'
    ],
    isDirectStreamFit: true
  },
  {
    id: 'inter-hec-to-civil-services',
    title: 'Bachelor of Arts (B.A.) & Civil Services Foundation (UPSC Focus)',
    category: 'Public Administration & Civil Governance',
    description: 'A 3-year humanities degree in political science, history, public administration, and sociology, strategically mapped to the syllabus of the UPSC Civil Services Examination (CSE).',
    applicableTo: {
      levels: ['intermediate', '10+2', '12th', 'puc', 'higher_secondary'],
      streams: ['hec', 'cec', 'humanities', 'arts', 'social_sciences']
    },
    nextEducationOptions: [
      'UPSC Civil Services Examination (IAS / IPS / IFS / IRS Officers)',
      'State Public Service Commission Examinations (Group-1 / Deputy Collector / DSP)',
      'M.A. in Public Policy / International Relations at JNU / Delhi University',
      'Policy Analyst at Think Tanks & Governance Non-Profits'
    ],
    courses: ['B.A. (Hons) Political Science', 'B.A. Public Administration & History', 'B.A. Sociology & Psychology'],
    entranceExams: ['CUET-UG Humanities', 'UPSC Civil Services Exam (Prelims, Mains, Interview — post-degree)', 'State PSC Group-1 Exams'],
    duration: '3 Years',
    skills: ['Policy Formulation & Public Administration', 'Constitutional Law Understanding', 'Essay Writing & Critical Synthesis', 'Current Affairs & Geopolitics Analysis', 'Administrative Decision-Making'],
    careers: ['ias_officer', 'ips_officer', 'judge', 'lawyer'],
    keyOutcomes: [
      'Direct syllabus overlap with UPSC Civil Services General Studies and Optional Papers',
      'Eligibility for elite executive government appointments: District Magistrate (DM), Superintendent of Police (SP), and Ambassador (IFS)',
      'Deep foundation in public administration, social welfare policies, and governance ethics'
    ],
    isDirectStreamFit: true
  },
  {
    id: 'inter-hec-to-design-media',
    title: 'Bachelor of Design (B.Des) & Mass Communication (BJMC)',
    category: 'Design, Media & Creative Communication',
    description: 'A 4-year design or 3-year media degree in digital UI/UX design, visual communication, digital journalism, multimedia storytelling, and film production.',
    applicableTo: {
      levels: ['intermediate', '10+2', '12th', 'puc', 'higher_secondary'],
      streams: ['hec', 'cec', 'mec', 'humanities', 'arts']
    },
    nextEducationOptions: [
      'Master of Design (M.Des via CEED at IITs / NID)',
      'Master in Mass Communication / Direction (FTII / IIMC / Jamia Millia)',
      'Senior Product / UI/UX Designer at Tech Companies',
      'Investigative Journalist / Digital Media Producer / Creative Director'
    ],
    courses: ['B.Des (Product Design / Communication Design / UI/UX)', 'BJMC (Bachelor of Journalism & Mass Communication)', 'BFA (Bachelor of Fine Arts)'],
    entranceExams: ['UCEED (IIT Bombay)', 'NID DAT (National Institute of Design)', 'NIFT Entrance Exam', 'IIMC Entrance Exam'],
    duration: '3 - 4 Years',
    skills: ['User Interface (UI) & User Experience (UX) Design', 'Visual Hierarchy & Typography', 'Design Thinking & Prototyping (Figma)', 'Digital Journalism & Video Editing', 'Brand Storytelling'],
    careers: ['ui_designer', 'ux_designer', 'animator', 'fashion_designer', 'interior_designer'],
    keyOutcomes: [
      'Thriving career in high-paying digital tech UI/UX design and interaction design',
      'Portfolio-driven career across design studios, gaming companies, and tech products',
      'Opportunities in investigative broadcast media, digital publication, and creative advertising'
    ],
    isDirectStreamFit: true
  },

  // ════════════════════════════════════════════════════════════════════════════════
  // 6. POLYTECHNIC DIPLOMA TRANSITIONS (LATERAL ENTRY & CAREERS)
  // ════════════════════════════════════════════════════════════════════════════════
  {
    id: 'diploma-to-lateral-btech',
    title: 'Lateral Entry B.Tech / B.E. (Direct Admission to 2nd Year)',
    category: 'Lateral Engineering Degree',
    description: 'The premier Indian pathway for polytechnic diploma holders to join the 2nd year (3rd semester) of 4-year B.Tech engineering degree programs without loss of time.',
    applicableTo: {
      levels: ['diploma', 'polytechnic'],
      streams: ['dip_cse', 'dip_mech', 'dip_civil', 'dip_eee', 'dip_ece', 'dip_auto', 'diploma_engineering']
    },
    nextEducationOptions: [
      'B.Tech in Computer Science / IT (for Diploma CSE holders)',
      'B.Tech in Mechanical / Mechatronics (for Diploma Mech holders)',
      'B.Tech in Civil Engineering (for Diploma Civil holders)',
      'B.Tech in EEE / ECE (for Electrical/Electronics Diploma holders)',
      'M.Tech via GATE after completing B.Tech'
    ],
    courses: ['Lateral Entry B.Tech / B.E. (3 Years Duration to Complete Degree)'],
    entranceExams: ['State Lateral Entry CETs (TS ECET / AP ECET / Karnataka DCET / JELET / UPSEE Lateral Entry)'],
    duration: '3 Years (Saves 1 Year compared to starting 1st year)',
    skills: ['Applied Engineering Mathematics', 'Advanced Coding / System Architecture', 'Advanced CAD & Finite Element Analysis', 'Electronics Circuit Simulation', 'Project Engineering'],
    careers: ['software_engineer', 'ai_engineer', 'mechanical_engineer', 'civil_engineer', 'electrical_engineer', 'robotics_engineer'],
    keyOutcomes: [
      'Full B.Tech engineering degree awarded in 3 years of post-diploma study',
      'Advantage over standard 12th students due to 3 years of hands-on diploma workshop training',
      'Full eligibility for corporate campus placements, GATE, and PSU engineering examinations'
    ],
    isDirectStreamFit: true
  },
  {
    id: 'diploma-to-psu-junior-engineer',
    title: 'Direct Technical Recruitment — Junior Engineer (JE) in PSUs & Govt',
    category: 'Government Technical Services',
    description: 'Direct employment pathway for diploma holders into prestigious government and public sector technical posts (Railways, Defense, Central Engineering, Power Grids).',
    applicableTo: {
      levels: ['diploma', 'polytechnic'],
      streams: ['dip_civil', 'dip_mech', 'dip_eee', 'dip_ece', 'dip_cse']
    },
    nextEducationOptions: [
      'AMIE (Associate Member of Institution of Engineers — equivalent to B.Tech)',
      'Departmental Promotion to Assistant Engineer (AE) & Executive Engineer (EE)',
      'Distance / Part-time B.Tech for Working Professionals'
    ],
    courses: ['Technical Supervisory Roles', 'Junior Engineer Certification'],
    entranceExams: ['SSC JE (Staff Selection Commission Junior Engineer)', 'RRB JE (Railway Recruitment Board)', 'DRDO CEPTAM', 'ISRO Technical Assistant', 'State PSC Sub-Engineer / AE Exams'],
    duration: 'Immediate Employment Track',
    skills: ['Technical Site Inspection', 'Blueprint & Schematic Reading', 'Preventive Maintenance Scheduling', 'Public Procurement & Estimation', 'Quality Assurance Compliance'],
    careers: ['civil_engineer', 'mechanical_engineer', 'electrical_engineer', 'marine_engineer'],
    keyOutcomes: [
      'Stable, prestigious government employment immediately upon diploma graduation (Age 19-21)',
      'Attractive pay scales with government pension, housing, and medical allowances',
      'Clear promotional hierarchy from Junior Engineer (JE) to Executive Engineer'
    ],
    isDirectStreamFit: true
  },

  // ════════════════════════════════════════════════════════════════════════════════
  // 7. UNDERGRADUATE: B.TECH / B.E. / BCA TRANSITIONS
  // ════════════════════════════════════════════════════════════════════════════════
  {
    id: 'ug-tech-to-mtech-ms-gate',
    title: 'M.Tech / M.S. in Advanced Computing, AI & Systems (GATE / GRE)',
    category: 'Postgraduate Technical Specialization',
    description: 'Advanced postgraduate master’s program for computer science and engineering graduates focusing on machine learning, cloud distributed systems, VLSI, and robotics.',
    applicableTo: {
      levels: ['undergraduate', 'bachelor', 'btech', 'bca', 'graduated'],
      streams: ['btech', 'bca', 'bsc_cs', 'computer_science', 'it', 'engineering', 'cse']
    },
    nextEducationOptions: [
      'Ph.D. in Computer Science / Artificial Intelligence',
      'Staff AI Researcher / Principal Systems Architect',
      'Research Scientist at Global R&D Labs (Google DeepMind, Microsoft Research, Meta AI)'
    ],
    courses: ['M.Tech in CSE / AI / Data Science (IITs / IISc / NITs)', 'M.S. in Computer Science (USA / Germany / UK / Singapore)'],
    entranceExams: ['GATE (Graduate Aptitude Test in Engineering — CS/IT)', 'GRE & TOEFL/IELTS (for overseas MS admissions)'],
    duration: '2 Years',
    skills: ['Deep Learning & Neural Architectures', 'Distributed Systems & Microservices', 'Advanced Algorithmic Design', 'Research Methodology & Technical Paper Writing', 'Scalable Cloud Systems'],
    careers: ['ai_engineer', 'ml_engineer', 'data_scientist', 'software_engineer', 'space_scientist', 'robotics_engineer'],
    keyOutcomes: [
      'Monthly ₹12,400 MHRD stipend during 2-year M.Tech at top Indian IITs/NITs',
      'Campus placements in tier-1 research teams and high-frequency trading (HFT) firms with top-tier packages',
      'Gateway to academic professorships and high-impact doctoral research'
    ],
    isDirectStreamFit: true
  },
  {
    id: 'ug-tech-to-mba-product-management',
    title: 'MBA in Tech Management, Product Strategy & Consulting (CAT / GMAT)',
    category: 'Corporate Strategy & Product Leadership',
    description: 'A 2-year postgraduate management degree transforming technical software engineers and engineering graduates into product leaders, management consultants, and enterprise directors.',
    applicableTo: {
      levels: ['undergraduate', 'bachelor', 'btech', 'bca', 'bcom', 'bba', 'graduated'],
      streams: ['btech', 'bca', 'bcom', 'bba', 'engineering']
    },
    nextEducationOptions: [
      'Group Product Manager (GPM) / VP of Product',
      'Management Consultant at McKinsey, BCG, Bain, or Strategy&',
      'Investment Banking Technology Associate'
    ],
    courses: ['MBA / PGDM (IIMs — Ahmedabad, Bangalore, Calcutta, Lucknow, Kozhikode, Indore)', 'MBA (ISB Hyderabad / Mohali)', 'Global MBA (INSEAD, Harvard, Stanford)'],
    entranceExams: ['CAT (Common Admission Test)', 'XAT (XLRI)', 'GMAT (Global / ISB)', 'NMAT / SNAP'],
    duration: '2 Years (1 Year at ISB)',
    skills: ['Product Lifecycle Management (PLM)', 'Business Case & ROI Modeling', 'Corporate Finance & M&A Strategy', 'Executive Stakeholder Negotiation', 'Market Research & User Analytics'],
    careers: ['product_manager', 'financial_analyst', 'investment_banker', 'entrepreneur'],
    keyOutcomes: [
      'Top-tier campus placements into Management Consulting, Product Leadership, and Private Equity',
      'Exponential acceleration into corporate executive leadership and business ownership',
      'Highest average starting packages among Indian professional postgraduate degrees'
    ],
    isDirectStreamFit: true
  },

  // ════════════════════════════════════════════════════════════════════════════════
  // 8. UNDERGRADUATE: B.COM / BBA TRANSITIONS
  // ════════════════════════════════════════════════════════════════════════════════
  {
    id: 'ug-commerce-to-cfa-investment-banking',
    title: 'Chartered Financial Analyst (CFA USA) & Investment Banking',
    category: 'Global Finance & Asset Management',
    description: 'The world’s most recognized credential for investment management, equity research, portfolio management, and investment banking.',
    applicableTo: {
      levels: ['undergraduate', 'bachelor', 'bcom', 'bba', 'graduated'],
      streams: ['bcom', 'bba', 'mec', 'commerce', 'finance', 'business']
    },
    nextEducationOptions: [
      'CFA Level 1, Level 2, and Level 3 Examinations (CFA Institute USA)',
      'Master of Science in Financial Engineering / M.Sc Finance',
      'Portfolio Manager / Senior Equity Research Analyst / M&A Associate'
    ],
    courses: ['CFA Program (Chartered Financial Analyst — Levels I, II, III)', 'Financial Modeling & Valuation Analyst (FMVA)'],
    entranceExams: ['CFA Institute Examination (Level I, II, III)', 'NISM Series Certifications'],
    duration: '2 - 3 Years',
    skills: ['DCF & LBO Financial Modeling', 'Equity & Fixed Income Valuation', 'Portfolio Management & Asset Allocation', 'Corporate Financial Statement Analysis', 'Derivatives & Risk Management'],
    careers: ['investment_banker', 'financial_analyst', 'chartered_accountant', 'entrepreneur'],
    keyOutcomes: [
      'Global CFA Charterholder credential recognized across 160+ countries',
      'Direct qualification for front-office Investment Banking and Sovereign Wealth Funds',
      'Top-tier remuneration packages in hedge funds, private equity, and wealth management'
    ],
    isDirectStreamFit: true
  },

  // ════════════════════════════════════════════════════════════════════════════════
  // 9. UNDERGRADUATE: MBBS / BDS / B.PHARM / CLINICAL TRANSITIONS
  // ════════════════════════════════════════════════════════════════════════════════
  {
    id: 'ug-medical-to-md-ms-neet-pg',
    title: 'MD / MS Postgraduate Medical Specialization (NEET-PG / INI-CET)',
    category: 'Postgraduate Medical Specialization',
    description: 'Post-MBBS clinical specialization to become a Consultant Physician (MD) or Consultant Surgeon (MS) in Cardiology, Neurology, Pediatrics, Orthopedics, or Radiology.',
    applicableTo: {
      levels: ['undergraduate', 'bachelor', 'mbbs', 'medical', 'graduated'],
      streams: ['mbbs', 'bds', 'medical', 'bipc']
    },
    nextEducationOptions: [
      'DM / M.Ch (Super-Speciality Degrees in Cardiology, Neurosurgery, Surgical Oncology via NEET-SS)',
      'Fellowship of the Royal Colleges (MRCP / FRCS in UK / Commonwealth)',
      'Head of Department / Director of Clinical Services in Super-Speciality Hospitals'
    ],
    courses: ['MD (General Medicine / Pediatrics / Radiology / Dermatology)', 'MS (General Surgery / Orthopedics / Obstetrics & Gynaecology / Ophthalmology)'],
    entranceExams: ['NEET-PG (National Eligibility cum Entrance Test — Postgraduate)', 'INI-CET (AIIMS, JIPMER, PGIMER, NIMHANS)'],
    duration: '3 Years (with Full Monthly Clinical Residency Stipend)',
    skills: ['Advanced Clinical Diagnosis & Therapy', 'Complex Surgical Interventions', 'Emergency Trauma & Critical Resuscitation', 'Clinical Trial Leadership', 'Medical Department Administration'],
    careers: ['surgeon', 'doctor', 'dentist'],
    keyOutcomes: [
      'Attainment of Specialist Consultant status with full independent clinical admitting privileges',
      'Government / Hospital monthly residency stipend throughout the 3-year program',
      'Direct stepping stone to NEET-SS Super-Speciality (DM / M.Ch) degrees'
    ],
    isDirectStreamFit: true
  }
];
