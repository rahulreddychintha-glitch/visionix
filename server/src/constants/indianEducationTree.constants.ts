export type EducationNodeType =
  | 'education_stage'   // Class 10, Intermediate, Diploma, ITI, Undergraduate, Postgraduate
  | 'stream'            // MPC, BiPC, PCMB, MEC, CEC, HEC, Vocational
  | 'degree_family'     // B.Tech / B.E., B.Sc, B.Com, BBA, MBBS, Law, Design, Polytechnic
  | 'branch'            // Specific branch e.g. CSE, AI & DS, ECE, Mechanical, Civil, etc.
  | 'specialization'    // e.g. Cloud Computing, Generative AI, Investment Banking, Cardiology
  | 'higher_study'      // e.g. M.Tech, MS, MBA, MCA, MD/MS, Super-speciality, CA Final
  | 'qualification';    // e.g. ICAI CA, ICSI CS, CFA, Pilot CPL

export interface IPathwayCareerRef {
  id: string;
  title: string;
  category: string;
  salaryRange?: string;
  growthRate?: string;
  demandLevel?: string;
}

export interface IEducationTreeNode {
  id: string;
  title: string;
  subtitle?: string;
  shortCode?: string;
  nodeType: EducationNodeType;
  category: string;
  description: string;
  duration?: string;
  eligibility?: string;
  entranceExams?: string[];
  majorBranches?: string[];
  higherStudyOptions?: string[];
  skills?: string[];
  outcomes?: string[];
  careerIds?: string[];
  resolvedCareers?: IPathwayCareerRef[];
  children?: IEducationTreeNode[];
  isDirectFit?: boolean;
}

export interface IPathwayComparisonPreset {
  id: string;
  title: string;
  description: string;
  nodeIds: string[];
}

/**
 * AUTHORITATIVE STANDALONE INDIAN EDUCATION PROGRESSION TREE
 * Built according to AICTE, UGC, NTA, NMC, DCI, PCI, BCI, ICAI, and NEP 2020 standards.
 */
export const INDIAN_EDUCATION_TREE: IEducationTreeNode = {
  id: 'stage-class-10',
  title: 'Class 10 / Secondary School Certificate (SSC / CBSE / ICSE)',
  subtitle: 'Foundation Education Stage',
  shortCode: 'Class 10',
  nodeType: 'education_stage',
  category: 'Foundation',
  description: 'Secondary School completion (10th standard) marks the primary academic milestone in India, opening pathways into Senior Secondary (10+2 Intermediate), 3-Year Technical Polytechnic Diplomas, or 1-2 Year ITI Vocational Skill Certifications.',
  duration: 'Completed at ~15-16 years of age',
  eligibility: 'Pass 10th Board Exam (State Board, CBSE, ICSE, NIOS)',
  entranceExams: ['State Board Exams', 'CBSE Class 10 Board', 'ICSE Board', 'NTSE', 'Polycet / State Diploma Entrance'],
  majorBranches: ['Intermediate (10+2 / Junior College)', 'Polytechnic Diploma (Engineering & Tech)', 'Industrial Training Institutes (ITI / Vocational)'],
  higherStudyOptions: ['Higher Secondary (11th & 12th)', 'Diploma to B.Tech Lateral Entry', 'Skill Certifications & Apprenticeships'],
  skills: ['Foundational Mathematics', 'General Science', 'Language & Reading Comprehension', 'Social Sciences', 'Basic Computer Literacy'],
  outcomes: ['Eligible for Senior Secondary (10+2) in Science, Commerce, Arts streams', 'Eligible for direct admission into 3-Year Technical Engineering Diplomas', 'Eligible for ITI Technical Trades and National Apprenticeship Certificate (NAC)'],
  children: [
    // ════════════════════════════════════════════════════════════════════════════
    // 1. INTERMEDIATE / SENIOR SECONDARY (10+2)
    // ════════════════════════════════════════════════════════════════════════════
    {
      id: 'stage-intermediate',
      title: 'Intermediate / Senior Secondary (10+2 / Higher Secondary / PUC)',
      subtitle: '2-Year Senior Secondary Academic Track',
      shortCode: '10+2',
      nodeType: 'education_stage',
      category: 'Higher Secondary',
      description: 'The standard 2-year pre-university program in India (Classes 11 and 12). Students specialize in dedicated academic streams such as MPC (Maths, Physics, Chemistry), BiPC (Biology, Physics, Chemistry), PCMB, MEC (Maths, Economics, Commerce), CEC, or HEC (Humanities/Arts).',
      duration: '2 Years (Class 11 & Class 12)',
      eligibility: 'Passed Class 10 from any recognized board',
      entranceExams: ['Board Intermediate Exams', 'JEE Main', 'NEET-UG', 'CUET-UG', 'CLAT', 'IPMAT', 'NATA', 'BITSAT', 'State CETs'],
      majorBranches: ['MPC (Maths-Physics-Chemistry)', 'BiPC (Biology-Physics-Chemistry)', 'PCMB (General Science)', 'MEC (Maths-Economics-Commerce)', 'CEC (Civics-Economics-Commerce)', 'HEC (History-Economics-Civics / Arts)'],
      higherStudyOptions: ['B.Tech / B.E.', 'MBBS / BDS / AYUSH / Pharmacy', 'B.Sc (Pure & Applied Sciences)', 'B.Com / BBA', 'Integrated 5-Year Law', 'B.Des / Media / Hospitality'],
      skills: ['Advanced Analytical Thinking', 'Domain-Specific Mastery (Science/Commerce/Arts)', 'Problem Solving', 'Competitive Exam Aptitude'],
      outcomes: ['Qualifies for all major National and State University Undergraduate Entrance Examinations', 'Gateway to Engineering, Medicine, Pure Sciences, Commerce, Law, and Public Administration degrees'],
      children: [
        // ─── STREAM 1: MPC ──────────────────────────────────────────────────
        {
          id: 'stream-mpc',
          title: 'MPC (Mathematics, Physics, Chemistry)',
          subtitle: 'Engineering, Physical Sciences, Computing & Architecture Foundation',
          shortCode: 'MPC',
          nodeType: 'stream',
          category: 'Science & Engineering',
          description: 'The premier mathematical and physical sciences stream in India. Provides foundational training in Calculus, Mechanics, Electromagnetism, Physical and Organic Chemistry, preparing students for engineering, computer science, architecture, aviation, and quantitative analytics degrees.',
          duration: '2 Years',
          eligibility: 'Pass 10th with Mathematics and Science',
          entranceExams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'State CETs / EAMCET / MHT-CET', 'NATA / JEE Main Paper 2', 'CUET-UG', 'NDA Exam'],
          majorBranches: ['B.Tech / B.E. (All Engineering Branches)', 'BCA & Computing', 'B.Sc (Physical & Mathematical Sciences)', 'B.Arch (Architecture)', 'Commercial Aviation (Pilot CPL)', 'Defence / NDA Technical'],
          higherStudyOptions: ['M.Tech / M.S.', 'MBA', 'MCA', 'Ph.D in Science/Engineering'],
          skills: ['Differential & Integral Calculus', 'Classical Mechanics & Thermodynamics', 'Atomic Structure & Chemical Bonding', 'Logical Deduction & Problem Solving'],
          outcomes: ['Direct eligibility for JEE Main / Advanced for admissions into IITs, NITs, IIITs, BITS, and State Engineering Universities', 'Direct eligibility for BCA, B.Sc, B.Arch, and NDA Aviation/Navy wings'],
          children: [
            // DEGREE: B.Tech / B.E.
            {
              id: 'degree-btech',
              title: 'B.Tech / B.E. (Bachelor of Technology / Bachelor of Engineering)',
              subtitle: '4-Year Professional Engineering Degree Family',
              shortCode: 'B.Tech',
              nodeType: 'degree_family',
              category: 'Engineering & Technology',
              description: 'AICTE-approved 4-year undergraduate professional degree covering cutting-edge engineering specializations, practical laboratory projects, and industrial internships.',
              duration: '4 Years (8 Semesters)',
              eligibility: 'Passed 10+2 with Physics, Mathematics, and Chemistry/Computer Science with minimum 50-75% aggregate',
              entranceExams: ['JEE Main', 'JEE Advanced (for IITs)', 'BITSAT', 'State Engineering CETs (KCET, MHT-CET, WBJEE, EAMCET, COMEDK)', 'VITEEE', 'SRMJEEE'],
              majorBranches: ['Computer Science & Engineering', 'Artificial Intelligence & Data Science', 'Cyber Security', 'Information Technology', 'Electronics & Communication', 'Electrical & Electronics', 'Mechanical Engineering', 'Civil Engineering', 'Aerospace Engineering', 'Chemical Engineering', 'Biotechnology Engineering', 'Robotics & Automation'],
              higherStudyOptions: ['M.Tech / M.E. via GATE', 'M.S. in USA/Europe via GRE/TOEFL', 'MBA in Tech Management via CAT/GMAT', 'Direct Industry Placements'],
              skills: ['Algorithm Design', 'Engineering Mathematics', 'Hardware & Software Integration', 'Applied Physics & Systems Modeling'],
              outcomes: ['Engineering graduates qualify for core engineering careers, high-tech software jobs, PSU technical officer roles (GATE), or global Master of Science degrees.'],
              children: [
                {
                  id: 'branch-btech-cse',
                  title: 'Computer Science & Engineering (CSE)',
                  subtitle: 'Software Architecture, Algorithms, Operating Systems & Networks',
                  shortCode: 'B.Tech CSE',
                  nodeType: 'branch',
                  category: 'Computing & Software',
                  description: 'Core computing curriculum covering Data Structures, Algorithms, Compilers, Computer Architecture, Distributed Systems, Database Management, and Web/Mobile Systems.',
                  duration: '4 Years',
                  eligibility: 'Passed 10+2 MPC with JEE / State CET rank',
                  entranceExams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'State CETs'],
                  majorBranches: ['Software Systems', 'Cloud & Distributed Computing', 'DevOps & SRE', 'Full Stack Development'],
                  higherStudyOptions: ['M.Tech in CSE / Distributed Systems (GATE)', 'M.S. in Computer Science (GRE)', 'MBA in Product Management (CAT)'],
                  skills: ['Data Structures & Algorithms', 'C++', 'Java', 'Python', 'System Design', 'Operating Systems', 'Database Management', 'Cloud Computing', 'Git'],
                  outcomes: ['High-impact engineering roles across global software companies, fintech platforms, tech startups, and research labs.'],
                  careerIds: ['software_engineer', 'cloud_engineer', 'product_manager']
                },
                {
                  id: 'branch-btech-ai-ds',
                  title: 'Artificial Intelligence & Data Science (AI & DS / AI & ML)',
                  subtitle: 'Machine Learning, Deep Learning, Big Data & Neural Architectures',
                  shortCode: 'B.Tech AI-DS',
                  nodeType: 'branch',
                  category: 'Computing & Software',
                  description: 'Specialized computing degree focusing on Statistical Learning, Neural Networks, Natural Language Processing, Computer Vision, Big Data Engineering, and Generative AI.',
                  duration: '4 Years',
                  eligibility: 'Passed 10+2 MPC with strong mathematics/computing aptitude',
                  entranceExams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'State CETs'],
                  majorBranches: ['Machine Learning Engineering', 'Deep Learning & NLP', 'Computer Vision', 'Data Science & Big Data'],
                  higherStudyOptions: ['M.Tech in AI / Robotics (GATE)', 'M.S. in Data Science / Machine Learning (GRE)', 'Ph.D in Applied Artificial Intelligence'],
                  skills: ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'SQL', 'Statistical Modeling', 'Natural Language Processing', 'Data Visualization'],
                  outcomes: ['Specialist roles as AI/ML Engineers, Data Scientists, and Machine Learning Platform Engineers across AI labs and tech enterprises.'],
                  careerIds: ['ai_engineer', 'ml_engineer', 'data_scientist']
                },
                {
                  id: 'branch-btech-cybersecurity',
                  title: 'Cyber Security & Digital Forensics',
                  subtitle: 'Network Defense, Ethical Hacking, Cryptography & Threat Analysis',
                  shortCode: 'B.Tech CyberSec',
                  nodeType: 'branch',
                  category: 'Computing & Software',
                  description: 'Dedicated specialization covering Network Protocols, Cryptographic Security, Penetration Testing, Malware Analysis, Cloud Defense, and Security Auditing.',
                  duration: '4 Years',
                  eligibility: 'Passed 10+2 MPC with JEE / State CET rank',
                  entranceExams: ['JEE Main', 'State CETs', 'Institutional Entrance Exams'],
                  majorBranches: ['Ethical Hacking & Red Teaming', 'Cloud Security', 'Threat Intelligence & SOC Operations', 'Cryptography & Blockchain'],
                  higherStudyOptions: ['M.Tech in Information Security', 'M.S. in Cyber Defense', 'Global Certifications: CISSP, CEH, OSCP'],
                  skills: ['Networking Protocols', 'Penetration Testing', 'Linux Administration', 'Cryptography', 'SIEM Tools', 'Incident Response', 'Cloud Security'],
                  outcomes: ['Key security operations roles in banking, defense agencies, cybersecurity consultancies, and cloud service providers.'],
                  careerIds: ['cybersecurity_analyst', 'cloud_engineer', 'software_engineer']
                },
                {
                  id: 'branch-btech-ece',
                  title: 'Electronics & Communication Engineering (ECE)',
                  subtitle: 'VLSI Chip Design, Embedded Systems, Signal Processing & 5G',
                  shortCode: 'B.Tech ECE',
                  nodeType: 'branch',
                  category: 'Electronics & Hardware',
                  description: 'Covers Semiconductor Devices, Digital Logic, Microprocessors & Microcontrollers, VLSI Circuit Design, Embedded Firmware, Wireless Communication, and Signal Processing.',
                  duration: '4 Years',
                  eligibility: 'Passed 10+2 MPC with JEE / State CET rank',
                  entranceExams: ['JEE Main', 'JEE Advanced', 'State CETs', 'BITSAT'],
                  majorBranches: ['VLSI & Semiconductor Design', 'Embedded Systems & IoT', 'Wireless & 5G Communications', 'Signal Processing'],
                  higherStudyOptions: ['M.Tech in VLSI Design / Embedded Systems (GATE)', 'M.S. in Electrical & Computer Engineering', 'MBA in Technology Operations'],
                  skills: ['Circuit Design', 'Verilog / VHDL', 'Embedded C', 'Microcontrollers', 'MATLAB', 'Digital Signal Processing', 'PCB Design'],
                  outcomes: ['High-demand semiconductor chip design roles (Qualcomm, Intel, Nvidia), embedded systems engineering, telecom network planning.'],
                  careerIds: ['robotics_engineer', 'software_engineer', 'electrical_engineer']
                },
                {
                  id: 'branch-btech-eee',
                  title: 'Electrical & Electronics Engineering (EEE)',
                  subtitle: 'Power Systems, Electric Vehicles (EV), Smart Grids & Control Systems',
                  shortCode: 'B.Tech EEE',
                  nodeType: 'branch',
                  category: 'Electrical & Energy',
                  description: 'Focuses on Power Generation, High Voltage Engineering, Electric Drives, Smart Grids, Power Electronics, Battery Management Systems for Electric Vehicles, and Industrial Automation.',
                  duration: '4 Years',
                  eligibility: 'Passed 10+2 MPC with JEE / State CET rank',
                  entranceExams: ['JEE Main', 'JEE Advanced', 'State CETs', 'GATE (for PSUs)'],
                  majorBranches: ['EV & Battery Powertrains', 'Power Systems & Renewable Energy', 'Industrial Automation & PLC', 'Power Electronics'],
                  higherStudyOptions: ['M.Tech in Power Systems / Power Electronics (GATE)', 'M.S. in Sustainable Energy', 'Executive PSU Cadre'],
                  skills: ['Power Systems Analysis', 'MATLAB / Simulink', 'Power Electronics', 'PLC & SCADA', 'Electric Drives', 'Battery Management'],
                  outcomes: ['Engineering leadership in Power Grid, NTPC, BHEL, EV manufacturing companies (Tata Motors, Tesla, Ather), and renewable energy solar/wind plants.'],
                  careerIds: ['electrical_engineer', 'robotics_engineer', 'mechanical_engineer']
                },
                {
                  id: 'branch-btech-mech',
                  title: 'Mechanical Engineering',
                  subtitle: 'Thermal Systems, CAD/CAM, Robotics, Automotive & Manufacturing',
                  shortCode: 'B.Tech Mech',
                  nodeType: 'branch',
                  category: 'Core Engineering',
                  description: 'Foundational engineering discipline covering Thermodynamics, Fluid Mechanics, Strength of Materials, Machine Design, CAD/CAM, CNC Manufacturing, and Robotics.',
                  duration: '4 Years',
                  eligibility: 'Passed 10+2 MPC with JEE / State CET rank',
                  entranceExams: ['JEE Main', 'JEE Advanced', 'State CETs', 'GATE'],
                  majorBranches: ['Automotive Engineering', 'CAD/CAM & FEA Simulation', 'Robotics & Automation', 'HVAC & Thermal Power'],
                  higherStudyOptions: ['M.Tech in Thermal / Machine Design (GATE)', 'M.S. in Automotive / Mechatronics', 'MBA in Supply Chain / Operations'],
                  skills: ['AutoCAD', 'SolidWorks', 'ANSYS FEA', 'Thermodynamics', 'Fluid Mechanics', 'CNC Programming', 'Manufacturing Processes'],
                  outcomes: ['Core mechanical careers in automobile giants, aerospace manufacturing, heavy machinery, defense production, and PSU organizations (ISRO, DRDO, IOCL).'],
                  careerIds: ['mechanical_engineer', 'robotics_engineer', 'supply_chain_manager']
                },
                {
                  id: 'branch-btech-civil',
                  title: 'Civil Engineering',
                  subtitle: 'Structural Engineering, Geotechnical, Transportation & Urban Infrastructure',
                  shortCode: 'B.Tech Civil',
                  nodeType: 'branch',
                  category: 'Core Engineering',
                  description: 'Design and construction of infrastructure including Mega Bridges, Highways, Smart Cities, High-Rise Structures, Dams, Environmental Systems, and Geotechnical Foundations.',
                  duration: '4 Years',
                  eligibility: 'Passed 10+2 MPC with JEE / State CET rank',
                  entranceExams: ['JEE Main', 'JEE Advanced', 'State CETs', 'GATE', 'IES / ESE (UPSC)'],
                  majorBranches: ['Structural Engineering', 'Transportation & Highway Engineering', 'Geotechnical Engineering', 'Environmental & Water Resources'],
                  higherStudyOptions: ['M.Tech in Structural Engineering / Construction Management (GATE)', 'M.S. in Infrastructure Planning', 'Indian Engineering Services (UPSC ESE)'],
                  skills: ['Structural Analysis (STAAD Pro / ETABS)', 'AutoCAD Civil', 'Surveying & GIS', 'Concrete Technology', 'Project Management', 'Quantity Estimation'],
                  outcomes: ['Chief structural engineers in mega infrastructure projects, NHAI highway projects, smart city planning, Indian Railways engineering cadres, and construction conglomerates (L&T).'],
                  careerIds: ['civil_engineer', 'architect', 'environmental_scientist']
                },
                {
                  id: 'branch-btech-aero',
                  title: 'Aerospace & Aeronautical Engineering',
                  subtitle: 'Aerodynamics, Propulsion, Flight Mechanics & Spacecraft Design',
                  shortCode: 'B.Tech Aero',
                  nodeType: 'branch',
                  category: 'Aerospace & Defence',
                  description: 'Specialized engineering branch covering Aerodynamics, Aircraft Structures, Jet & Rocket Propulsion, Orbital Mechanics, Avionics, and Unmanned Aerial Vehicles (UAV / Drones).',
                  duration: '4 Years',
                  eligibility: 'Passed 10+2 MPC with high JEE / CET rank',
                  entranceExams: ['JEE Advanced (IIST / IITs)', 'JEE Main', 'State CETs'],
                  majorBranches: ['Aircraft Design & Aerodynamics', 'Rocket Propulsion & Spacecraft Systems', 'Avionics & Flight Navigation', 'Drone & UAV Systems'],
                  higherStudyOptions: ['M.Tech / Ph.D at IIST, IITs, or IISc', 'M.S. in Aerospace Engineering (USA / Europe)', 'ISRO / DRDO Scientist Recruitment (ICRB)'],
                  skills: ['Aerodynamics Analysis', 'Computational Fluid Dynamics (CFD)', 'Propulsion Systems', 'Flight Simulation', 'Avionics', 'Materials Science'],
                  outcomes: ['Scientist/Engineer positions in ISRO, DRDO, HAL, Boeing, Airbus, aerospace startups, and commercial drone defense.'],
                  careerIds: ['astronaut', 'space_scientist', 'mechanical_engineer']
                },
                {
                  id: 'branch-btech-chem',
                  title: 'Chemical Engineering & Process Technology',
                  subtitle: 'Mass Transfer, Petrochemicals, Reaction Engineering & Plant Design',
                  shortCode: 'B.Tech Chem',
                  nodeType: 'branch',
                  category: 'Process Engineering',
                  description: 'Design and optimization of chemical manufacturing plants, refineries, pharmaceutical synthesis units, polymer manufacturing, and sustainable energy processes.',
                  duration: '4 Years',
                  eligibility: 'Passed 10+2 MPC with JEE / State CET rank',
                  entranceExams: ['JEE Main', 'JEE Advanced', 'State CETs', 'GATE'],
                  majorBranches: ['Petroleum & Refining', 'Polymer & Materials', 'Process Control & Safety', 'Biochemical Engineering'],
                  higherStudyOptions: ['M.Tech in Chemical Process Design (GATE)', 'M.S. in Chemical Engineering', 'MBA in Energy & Petrochemicals'],
                  skills: ['Mass & Heat Transfer', 'Chemical Reaction Engineering', 'Process Simulation (Aspen Plus)', 'Plant Safety', 'Thermodynamics'],
                  outcomes: ['Process engineering roles at Reliance Industries, ONGC, IOCL, pharmaceutical chemical plants, and multinational energy corporations.'],
                  careerIds: ['scientist', 'environmental_scientist', 'mechanical_engineer']
                }
              ]
            },
            // DEGREE: BCA
            {
              id: 'degree-bca',
              title: 'BCA (Bachelor of Computer Applications)',
              subtitle: '3-Year Applied Computing & Software Applications Program',
              shortCode: 'BCA',
              nodeType: 'degree_family',
              category: 'Computing & Software',
              description: 'A 3-year applied computer science degree designed for rapid industry readiness in software development, web applications, database management, and mobile technologies.',
              duration: '3 Years (6 Semesters)',
              eligibility: 'Passed 10+2 with Mathematics/Computer Science/Information Practices with minimum 50%',
              entranceExams: ['CUET-UG', 'IPU CET', 'Christ University Entrance', 'SET', 'State University Entrance Exams'],
              majorBranches: ['Full Stack Web Development', 'Mobile App Development', 'Cloud & Database Administration', 'Applied Data Analytics'],
              higherStudyOptions: ['MCA (Master of Computer Applications via NIMCET for NITs)', 'M.Sc in Computer Science / Data Science', 'MBA in Information Technology (CAT)'],
              skills: ['C++', 'Java', 'Python', 'Web Development (HTML/CSS/JavaScript/React)', 'SQL Database Management', 'Object-Oriented Programming', 'Software Engineering'],
              outcomes: ['Direct entry into full-stack software development, cloud operations, or entry into top MCA programs at NITs via NIMCET for senior software engineering tracks.'],
              careerIds: ['software_engineer', 'cloud_engineer', 'game_developer']
            },
            // DEGREE: B.Arch
            {
              id: 'degree-barch',
              title: 'B.Arch (Bachelor of Architecture)',
              subtitle: '5-Year Council of Architecture (CoA) Approved Professional Degree',
              shortCode: 'B.Arch',
              nodeType: 'degree_family',
              category: 'Design & Architecture',
              description: 'Professional 5-year architecture program covering Architectural Design, Building Construction Technology, Spatial Planning, Structural Systems, Urban Design, and Sustainable Building Science.',
              duration: '5 Years (10 Semesters)',
              eligibility: 'Passed 10+2 MPC with minimum 50% marks in Physics, Chemistry, Mathematics and 50% aggregate + NATA qualification',
              entranceExams: ['NATA (National Aptitude Test in Architecture)', 'JEE Main Paper 2 (B.Arch / B.Planning) for SPAs, NITs, and IITs (via AAT)'],
              majorBranches: ['Sustainable & Green Architecture', 'Urban Design & City Planning', 'Landscape Architecture', 'Interior Architecture & Spatial Design'],
              higherStudyOptions: ['M.Arch (Master of Architecture)', 'M.Plan (Urban & Regional Planning)', 'CEE / Master of Design (M.Des)'],
              skills: ['Architectural Drawing & Sketching', 'AutoCAD & Revit BIM', '3D Modeling & SketchUp', 'Spatial Planning', 'Building Bye-laws', 'Sustainable Construction'],
              outcomes: ['Certified CoA Registered Architect, opening private architectural consultancy, leading design firms, or joining urban planning and smart city authorities.'],
              careerIds: ['architect', 'interior_designer', 'ui_designer']
            },
            // DEGREE: Commercial Pilot (CPL)
            {
              id: 'degree-pilot-cpl',
              title: 'Commercial Pilot License (CPL) & Aviation Pathways',
              subtitle: 'DGCA Certified Flight Training & Commercial Aviation Career',
              shortCode: 'Pilot CPL',
              nodeType: 'qualification',
              category: 'Aviation',
              description: 'Direct aviation pathway combining Directorate General of Civil Aviation (DGCA) ground theory exams, 200 hours of multi-engine flight training, instrument rating, and airline cadet programs.',
              duration: '18 - 24 Months flight training + Type Rating',
              eligibility: 'Passed 10+2 with Physics and Mathematics with min 50% aggregate + DGCA Class 1 Medical Fitness',
              entranceExams: ['DGCA CPL Ground Exams (Navigation, Meteorology, Air Regs, Technical)', 'IGRUA Entrance Exam', 'Airline Cadet Pilot Selection (IndiGo, Air India)'],
              majorBranches: ['Commercial Airline Pilot (A320 / B737)', 'Cargo & Charter Aviation', 'Flight Instructor (CFI)', 'Air Traffic Management'],
              higherStudyOptions: ['Airline Transport Pilot License (ATPL)', 'Type Rating (A320/B737/B777/A350)', 'Chief Flight Instructor Rating'],
              skills: ['Aviation Navigation & Meteorology', 'Cockpit Resource Management', 'Multi-Engine Flight Maneuvers', 'Instrument Flying', 'Emergency Protocols', 'Radio Telephony (RTR-A)'],
              outcomes: ['First Officer pilot positions with commercial airlines (IndiGo, Air India, Akasa, Vistara) progressing to Captain and Commander.'],
              careerIds: ['pilot', 'air_traffic_controller']
            },
            // DEGREE: B.Sc (Pure Sciences & Data Science)
            {
              id: 'degree-bsc-mpc',
              title: 'B.Sc (Physical Sciences / Mathematics / Data Science / Physics)',
              subtitle: '3 to 4-Year Foundational Scientific & Quantitative Degree (NEP Four-Year Honours)',
              shortCode: 'B.Sc',
              nodeType: 'degree_family',
              category: 'Pure & Applied Sciences',
              description: 'Comprehensive research and scientific curriculum covering Higher Mathematics, Quantum Physics, Statistical Modeling, and Computational Physics.',
              duration: '3 to 4 Years (NEP Honours with Research)',
              eligibility: 'Passed 10+2 with Physics, Mathematics, and Chemistry',
              entranceExams: ['CUET-UG (Central Universities)', 'IISER IAT', 'NEST (NISER)', 'State University Entrance Exams'],
              majorBranches: ['Mathematics & Computing', 'Physics (Quantum & Condensed Matter)', 'Statistics & Applied Data Science', 'Chemistry'],
              higherStudyOptions: ['M.Sc via IIT JAM for IITs/IISc', 'Integrated Ph.D in TIFR/IISER/IISc', 'MCA / Data Science Master'],
              skills: ['Mathematical Rigor', 'Statistical Inference', 'Quantum & Classical Physics', 'Python / R for Scientific Computing', 'Research Methodology'],
              outcomes: ['Scientist careers in BARC, ISRO, DRDO, scientific research institutes, quantitative financial analysts, or scientific educators.'],
              careerIds: ['scientist', 'data_scientist', 'professor']
            }
          ]
        },

        // ─── STREAM 2: BiPC (Biology, Physics, Chemistry) ───────────────────
        {
          id: 'stream-bipc',
          title: 'BiPC (Biology, Physics, Chemistry / Medical Stream)',
          subtitle: 'Medicine, Dentistry, Pharmacy, Nursing, Agriculture & Biotechnology',
          shortCode: 'BiPC',
          nodeType: 'stream',
          category: 'Medical & Life Sciences',
          description: 'The premier life sciences and healthcare preparatory stream in India. Emphasizes Human Physiology, Genetics, Botany, Zoology, Organic Chemistry, and Physics, serving as the gateway to medical doctor degrees (MBBS), dentistry, pharmacy, nursing, veterinary science, and agricultural sciences.',
          duration: '2 Years',
          eligibility: 'Pass 10th with Science (Biology, Physics, Chemistry)',
          entranceExams: ['NEET-UG (National Eligibility cum Entrance Test)', 'ICAR AIEEA (Agriculture)', 'CUET-UG', 'State Nursing / Pharmacy CETs'],
          majorBranches: ['MBBS (Medicine & Surgery)', 'BDS (Dental Surgery)', 'B.Pharm & Pharm.D (Pharmacy)', 'B.Sc Nursing & Allied Health', 'B.Sc (Hons) Agriculture & Horticulture', 'B.V.Sc & AH (Veterinary Science)', 'Biotechnology & Genetics', 'AYUSH (BAMS, BHMS)'],
          higherStudyOptions: ['MD / MS / DNB via NEET-PG', 'MDS (Dental)', 'M.Pharm / Ph.D', 'M.Sc Life Sciences / Biotechnology', 'M.Sc Agriculture / ICAR-JRF'],
          skills: ['Human Anatomy & Physiology', 'Genetics & Molecular Biology', 'Organic & Medicinal Chemistry', 'Clinical Observation', 'Biochemical Laboratory Protocols'],
          outcomes: ['Direct eligibility for NEET-UG for admission into all government and private medical and dental colleges across India', 'Direct eligibility for professional pharmacy, nursing, veterinary, and agricultural research degrees'],
          children: [
            // DEGREE: MBBS
            {
              id: 'degree-mbbs',
              title: 'MBBS (Bachelor of Medicine and Bachelor of Surgery)',
              subtitle: '5.5-Year Primary Medical Degree for Practicing Physicians & Surgeons',
              shortCode: 'MBBS',
              nodeType: 'degree_family',
              category: 'Medical & Healthcare',
              description: 'The benchmark medical doctor degree in India accredited by the National Medical Commission (NMC). Includes 4.5 years of rigorous clinical curriculum across Anatomy, Physiology, Pathology, Pharmacology, Forensic Medicine, General Medicine, Surgery, Pediatrics, and Obstetrics, followed by 1 full year of compulsory rotating medical internship (CRMI).',
              duration: '5.5 Years (4.5 Years Academics + 1 Year Rotating Internship)',
              eligibility: 'Passed 10+2 with Physics, Chemistry, Biology/Biotechnology with min 50% + NEET-UG qualification',
              entranceExams: ['NEET-UG (National Testing Agency)'],
              majorBranches: ['General Medicine', 'General Surgery', 'Pediatrics', 'Obstetrics & Gynecology', 'Orthopedics', 'Anesthesiology', 'Radiology', 'Dermatology'],
              higherStudyOptions: ['MD (Doctor of Medicine) / MS (Master of Surgery) via NEET-PG', 'DNB (Diplomate of National Board)', 'DM / M.Ch (Super-Specialization in Cardiology, Neurology, Oncology)', 'USMLE (USA) / PLAB (UK) for global practice'],
              skills: ['Clinical Diagnosis & Patient Assessment', 'Internal Medicine & Pharmacotherapy', 'Surgical Protocols & Suture Techniques', 'Emergency Life Support (ACLS/BLS)', 'Medical Ethics & Patient Empathy'],
              outcomes: ['Licensed Registered Medical Practitioner (RMP) entitled to practice clinical medicine, join hospitals, setup private clinical practice, or pursue MD/MS specializations.'],
              careerIds: ['doctor', 'surgeon', 'psychologist']
            },
            // DEGREE: BDS
            {
              id: 'degree-bds',
              title: 'BDS (Bachelor of Dental Surgery)',
              subtitle: '5-Year Dental Council of India (DCI) Approved Dental Medicine Degree',
              shortCode: 'BDS',
              nodeType: 'degree_family',
              category: 'Dental Sciences',
              description: 'Professional dental healthcare degree covering Oral Anatomy, Dental Materials, Prosthodontics, Periodontics, Oral & Maxillofacial Surgery, and Orthodontics with 1 year clinical internship.',
              duration: '5 Years (4 Years Academics + 1 Year Internship)',
              eligibility: 'Passed 10+2 BiPC with min 50% + NEET-UG rank',
              entranceExams: ['NEET-UG'],
              majorBranches: ['Oral & Maxillofacial Surgery', 'Orthodontics & Dentofacial Orthopedics', 'Prosthodontics & Crown/Bridge', 'Conservative Dentistry & Endodontics', 'Periodontology'],
              higherStudyOptions: ['MDS (Master of Dental Surgery via NEET-MDS)', 'Fellowship in Cosmetic Dentistry & Implantology', 'Oral Oncology Specialization'],
              skills: ['Oral Diagnosis', 'Dental Surgery & Extractions', 'Root Canal Treatment (Endodontics)', 'Crown & Bridge Prosthetics', 'Manual Precision & Dexterity'],
              outcomes: ['Registered Dental Surgeon eligible to establish private dental clinics, join multi-speciality dental hospitals, or pursue MDS specialities.'],
              careerIds: ['dentist', 'surgeon', 'doctor']
            },
            // DEGREE: B.Pharm & Pharm.D
            {
              id: 'degree-pharmacy',
              title: 'B.Pharm (Bachelor of Pharmacy) & Pharm.D (Doctor of Pharmacy)',
              subtitle: 'Pharmacy Council of India (PCI) Approved Pharmaceutical Sciences Degrees',
              shortCode: 'Pharmacy',
              nodeType: 'degree_family',
              category: 'Pharmaceutical Sciences',
              description: 'Covers Pharmaceutical Chemistry, Pharmacology, Pharmacokinetics, Drug Formulation & Delivery, Industrial Pharmacy, Toxicology, and Clinical Pharmacy Practice.',
              duration: 'B.Pharm: 4 Years | Pharm.D: 6 Years (including 1 Year Clinical Residency)',
              eligibility: 'Passed 10+2 BiPC or MPC with min 50% aggregate',
              entranceExams: ['GPAT (for Master)', 'State Pharmacy CETs (MHT-CET, WBJEE, EAMCET, KCET)', 'NEET-UG (in select institutions)', 'CUET-UG'],
              majorBranches: ['Industrial Pharmacology & Formulation', 'Clinical Pharmacy & Hospital Practice', 'Drug Regulatory Affairs', 'Quality Assurance & Quality Control (QA/QC)'],
              higherStudyOptions: ['M.Pharm via GPAT (Pharmaceutics, Pharmacology, Analysis)', 'Pharm.D Post-Baccalaureate', 'MBA in Pharmaceutical Management', 'Ph.D in Drug Discovery'],
              skills: ['Drug Formulation & Dosage Design', 'Pharmacological Screening', 'HPLC & Spectroscopy Analysis', 'Clinical Trial Monitoring', 'Regulatory Compliance (FDA/CDSCO)'],
              outcomes: ['Pharmaceutical scientists in drug discovery labs (Sun Pharma, Dr. Reddy’s, Cipla), clinical pharmacists in hospitals, and drug inspectors in regulatory bodies.'],
              careerIds: ['pharmacist', 'scientist', 'researcher']
            },
            // DEGREE: B.Sc Nursing & Allied Health
            {
              id: 'degree-nursing-allied',
              title: 'B.Sc Nursing & Allied Health Sciences (BPT / BMLT / Radiology)',
              subtitle: 'Professional Healthcare, Nursing & Paramedical Disciplines',
              shortCode: 'Nursing & Allied',
              nodeType: 'degree_family',
              category: 'Nursing & Allied Health',
              description: 'Comprehensive medical care curriculum covering Critical Care Nursing, Pediatric Nursing, Physiotherapy (BPT), Medical Laboratory Technology (BMLT), Radiology & Medical Imaging.',
              duration: '4 Years (including clinical hospital postings)',
              eligibility: 'Passed 10+2 with Physics, Chemistry, Biology with min 45-50% aggregate',
              entranceExams: ['NEET-UG (select central institutes / AIIMS B.Sc Nursing)', 'State Nursing & Paramedical CETs', 'AIIMS Paramedical Entrance'],
              majorBranches: ['Critical Care & ICU Nursing', 'Bachelor of Physiotherapy (BPT)', 'Medical Radiology & Imaging Technology (BMIT)', 'Medical Laboratory Technology (BMLT)'],
              higherStudyOptions: ['M.Sc Nursing (Specializations in Cardiology, Oncology, Pediatrics)', 'MPT (Master of Physiotherapy)', 'Hospital Administration (MHA)'],
              skills: ['Critical Patient Care', 'ICU Protocols & Vital Monitoring', 'Physical Rehabilitation & Kinesiology', 'Diagnostic Medical Imaging', 'Pathology & Hematology Testing'],
              outcomes: ['Registered Nurse (RN) positions in major hospital networks (Apollo, Fortis, AIIMS), clinical physiotherapists, and high-demand global healthcare emigration (UK, Canada, Australia, Gulf).'],
              careerIds: ['nurse', 'doctor', 'nutritionist']
            },
            // DEGREE: B.Sc Agriculture & Biotech
            {
              id: 'degree-agri-biotech',
              title: 'B.Sc (Hons) Agriculture, Horticulture & Biotechnology',
              subtitle: 'ICAR-Accredited 4-Year Agricultural & Bio-Sciences Program',
              shortCode: 'B.Sc Agriculture',
              nodeType: 'degree_family',
              category: 'Agricultural & Bio Sciences',
              description: 'Four-year professional degree covering Agronomy, Soil Science, Genetics & Plant Breeding, Plant Pathology, Agricultural Economics, Horticulture, Biotechnology, and Precision Farming.',
              duration: '4 Years (including Rural Agricultural Work Experience - RAWE)',
              eligibility: 'Passed 10+2 with Biology/Agriculture/Maths and Chemistry/Physics with min 50%',
              entranceExams: ['ICAR AIEEA (CUET-UG for ICAR Seats)', 'State Agriculture Entrance Tests (EAMCET, KCET, MHT-CET, MP PAT, UPCATET)'],
              majorBranches: ['Agronomy & Crop Production', 'Genetics & Plant Breeding', 'Horticulture & Greenhouse Technology', 'Agricultural Biotechnology & Bioinformatics'],
              higherStudyOptions: ['M.Sc Agriculture via ICAR-JRF', 'M.Sc in Biotechnology / Genetic Engineering', 'MBA in Agribusiness Management (IIM Ahmedabad / IIM Lucknow FABM)', 'ARS (Agricultural Research Service) Scientist'],
              skills: ['Crop Genetics & Hybrid Breeding', 'Soil Chemistry & Nutrient Management', 'Pest & Pathogen Diagnostics', 'Agribusiness Analytics', 'Precision Farming & Hydroponics'],
              outcomes: ['Agricultural Scientists in ICAR/IARI institutes, Agriculture Field Officers (IBPS AFO in public sector banks), and agribusiness product managers.'],
              careerIds: ['agricultural_scientist', 'farmer', 'biotechnologist']
            }
          ]
        },

        // ─── STREAM 3: PCMB (Physics, Chemistry, Maths, Biology) ────────────
        {
          id: 'stream-pcmb',
          title: 'PCMB (Physics, Chemistry, Mathematics, Biology)',
          subtitle: 'Dual Science Track — Both Engineering & Healthcare Eligibility',
          shortCode: 'PCMB',
          nodeType: 'stream',
          category: 'General Science',
          description: 'Comprehensive science curriculum covering all four core sciences. Provides maximum flexibility, qualifying students simultaneously for Engineering (JEE), Medical (NEET), Biotechnology, Biomedical Engineering, and Computational Biology.',
          duration: '2 Years',
          eligibility: 'Pass 10th with high marks in Science and Mathematics',
          entranceExams: ['JEE Main', 'JEE Advanced', 'NEET-UG', 'CUET-UG', 'ICAR AIEEA', 'BITSAT'],
          majorBranches: ['B.Tech / B.E. (All Branches)', 'MBBS / BDS / Pharmacy', 'B.Tech Biomedical Engineering & Biotech', 'B.Sc Computational Biology & Bioinformatics', 'Genomics & Biophysics'],
          higherStudyOptions: ['M.Tech / M.S.', 'MD / MS', 'Dual Degree Science Programs'],
          skills: ['Multidisciplinary Scientific Analysis', 'Calculus & Biostatistics', 'Chemical Thermodynamics & Biochemistry', 'Computational Biology Foundations'],
          outcomes: ['Dual eligibility for both premier Engineering institutions (IITs/NITs) and Top Medical colleges (AIIMS/Government Medical Colleges).'],
          children: [
            {
              id: 'branch-pcmb-biotech-eng',
              title: 'Biomedical Engineering & Computational Biology (B.Tech / B.Sc)',
              subtitle: 'Intersection of Medical Devices, AI Diagnostics, Genomics & Bio-Signals',
              shortCode: 'Biomedical & Biotech',
              nodeType: 'branch',
              category: 'Interdisciplinary Engineering',
              description: 'Merges biological physiology with engineering design: Prosthetics, Medical Imaging (MRI/CT), AI-driven diagnostic software, Biomaterials, and Genetic Sequencing pipelines.',
              duration: '4 Years',
              eligibility: 'Passed 10+2 with Physics, Chemistry, Biology and/or Mathematics',
              entranceExams: ['JEE Main', 'NEET-UG', 'State CETs', 'CUET-UG'],
              majorBranches: ['Medical Imaging & Diagnostic Systems', 'Prosthetics & Biomechanics', 'Genomics & Bioinformatics', 'Tissue Engineering & Biomaterials'],
              higherStudyOptions: ['M.Tech / M.S. in Biomedical Engineering (GRE/GATE)', 'Ph.D in Bioengineering', 'MBA in Healthcare Technology'],
              skills: ['Bio-Signal Processing', 'Medical Device Standards (ISO 13485)', 'Biomechanics Simulation', 'Python for Genomics', 'Biomaterials Science'],
              outcomes: ['Engineering leaders in healthcare technology giants (GE Healthcare, Siemens Healthineers, Philips Medical), biotech startups, and biomedical research.'],
              careerIds: ['biotechnologist', 'genetic_engineer', 'scientist']
            }
          ]
        },

        // ─── STREAM 4: MEC (Maths, Economics, Commerce) ─────────────────────
        {
          id: 'stream-mec',
          title: 'MEC (Mathematics, Economics, Commerce)',
          subtitle: 'Commerce, Quantitative Finance, Chartered Accountancy & Analytics Foundation',
          shortCode: 'MEC',
          nodeType: 'stream',
          category: 'Commerce & Economics',
          description: 'The premier quantitative business stream in India. Combines rigorous Higher Mathematics with Financial Accounting, Macroeconomics, Microeconomics, and Business Studies, preparing students for Chartered Accountancy (CA), B.Com Honours, BBA/IPM at IIMs, and Quantitative Financial Analytics.',
          duration: '2 Years',
          eligibility: 'Pass 10th with strong aptitude in Mathematics and Social Sciences',
          entranceExams: ['CUET-UG (for SRCC, Delhi University, Central Universities)', 'IPMAT (IIM Indore, IIM Rohtak, IIM Ranchi, IIM Bodh Gaya, IIM Jammu)', 'CA Foundation (ICAI)', 'SET / NPAT / Christ Entrance', 'CLAT'],
          majorBranches: ['B.Com (Honours, Computers, Finance & Taxation)', 'BBA / BMS (Integrated IPM at IIMs)', 'Chartered Accountancy (ICAI CA)', 'B.A. / B.Sc (Hons) Economics', 'Actuarial Science & Risk Management', 'BFSI & Investment Banking'],
          higherStudyOptions: ['MBA in Finance / Strategy (IIMs via CAT)', 'Chartered Financial Analyst (CFA USA)', 'CA Final & Membership', 'M.Sc Econometrics / Data Science', 'M.Com'],
          skills: ['Financial Accounting & Ledger Operations', 'Calculus & Statistical Modeling', 'Macroeconomics & Monetary Policy', 'Corporate Taxation Fundamentals', 'Quantitative Data Interpretation'],
          outcomes: ['Direct foundation for ICAI Chartered Accountancy examinations', 'High eligibility for premier economics, commerce, and IIM 5-Year Integrated Management degrees'],
          children: [
            // DEGREE: B.Com
            {
              id: 'degree-bcom',
              title: 'B.Com (Bachelor of Commerce — Honours / Computers / Finance)',
              subtitle: '3 to 4-Year Flagship Commerce & Accounting Degree (NEP 4-Year Structure)',
              shortCode: 'B.Com',
              nodeType: 'degree_family',
              category: 'Commerce & Accounting',
              description: 'The foundational commerce degree covering Financial Accounting, Cost & Management Accounting, Corporate Law, Direct & Indirect Taxation (GST/Income Tax), Financial Markets, and Auditing.',
              duration: '3 to 4 Years (NEP Honours with Research)',
              eligibility: 'Passed 10+2 MEC/CEC with min 50-60% aggregate',
              entranceExams: ['CUET-UG (for Delhi University SRCC, Hindu College, BHU)', 'State University Entrance Exams', 'NMIMS NPAT', 'Christ University Entrance'],
              majorBranches: ['B.Com (Honours)', 'B.Com in Accounting & Finance', 'B.Com in Computer Applications & Fintech', 'B.Com in Banking & Insurance', 'B.Com in International Taxation (ACCA Integrated)'],
              higherStudyOptions: ['MBA in Corporate Finance (CAT/XAT)', 'Chartered Accountancy (CA Intermediate & Final)', 'CFA (Chartered Financial Analyst USA)', 'M.Com', 'CMA (Certified Management Accountant)'],
              skills: ['Corporate Financial Statements', 'Tally Prime & SAP ERP', 'Income Tax & GST Compliance', 'Auditing & Statutory Standards', 'Financial Modeling in Excel'],
              outcomes: ['Graduates enter Big 4 accounting firms (Deloitte, PwC, EY, KPMG), corporate finance departments, equity research desks, or pursue CA/CFA credentials.'],
              careerIds: ['chartered_accountant', 'financial_analyst', 'investment_banker']
            },
            // DEGREE: BBA / BMS
            {
              id: 'degree-bba',
              title: 'BBA / BMS (Bachelor of Business Administration / IPM at IIMs)',
              subtitle: '3-Year Degree or 5-Year Integrated Programme in Management (BBA+MBA)',
              shortCode: 'BBA / IPM',
              nodeType: 'degree_family',
              category: 'Management & Strategy',
              description: 'Comprehensive business leadership curriculum covering Marketing Management, Strategic Human Resources, Corporate Finance, Operations & Supply Chain, Business Analytics, and Entrepreneurship.',
              duration: '3 Years (BBA) or 5 Years (Integrated IPM at IIMs)',
              eligibility: 'Passed 10+2 from any stream with min 50-60% aggregate',
              entranceExams: ['IPMAT (IIM Indore, IIM Rohtak, IIM Ranchi, IIM Bodh Gaya, IIM Jammu)', 'JIPMAT', 'CUET-UG', 'SET (Symbiosis)', 'NPAT (NMIMS)'],
              majorBranches: ['Integrated Management (IPM at IIMs)', 'Finance & Banking', 'Marketing & Digital Brand Strategy', 'Business Analytics & Decision Sciences', 'International Business'],
              higherStudyOptions: ['MBA at Top Business Schools (IIMs, ISB, XLRI via CAT/XAT/GMAT)', 'Master in Management (MiM in Europe)', 'Specialized Master in Business Analytics'],
              skills: ['Strategic Planning', 'Financial Decision Making', 'Market Research & Brand Strategy', 'Business Data Analytics', 'Negotiation & Executive Presentation'],
              outcomes: ['Management consultants, brand managers, business development associates, and fast-track corporate leaders across MNCs and startups.'],
              careerIds: ['product_manager', 'marketing_manager', 'entrepreneur']
            },
            // DEGREE: ICAI CA
            {
              id: 'degree-ca',
              title: 'Chartered Accountancy (ICAI CA Professional Track)',
              subtitle: 'India\'s Highest Professional Accounting & Financial Audit Qualification',
              shortCode: 'CA',
              nodeType: 'qualification',
              category: 'Professional Accounting',
              description: 'Administered by The Institute of Chartered Accountants of India (ICAI). A rigorous multi-tier professional journey: CA Foundation → CA Intermediate (Group 1 & 2) → 3 Years Practical Articleship Training → CA Final → Fellow Chartered Accountant (FCA) Membership.',
              duration: '4.5 - 5 Years (alongside/after graduation)',
              eligibility: 'Registered after passing Class 12 (for Foundation) or Graduate (Direct Entry Scheme with min 55% Commerce / 60% Others)',
              entranceExams: ['CA Foundation', 'CA Intermediate', 'CA Final (ICAI National Exams)'],
              majorBranches: ['Statutory & Internal Auditing', 'Direct & International Taxation', 'Mergers & Acquisitions (M&A) Due Diligence', 'Forensic Accounting & Fraud Investigation'],
              higherStudyOptions: ['ICAI Certificate Courses in Forensic Audit / Valuation', 'CFA (Chartered Financial Analyst USA)', 'Global CPA (USA) / ACCA (UK) Exemptions', 'Chief Financial Officer (CFO) Pathways'],
              skills: ['Statutory Financial Auditing', 'Companies Act 2013 Compliance', 'Advanced Tax Planning & Litigations', 'IND AS & IFRS Standards', 'Corporate Valuation & Risk Assessment'],
              outcomes: ['Authorized Statutory Auditor for listed corporations, tax litigation attorney, CFO, Chief Risk Officer, and independent public accounting practice partner.'],
              careerIds: ['chartered_accountant', 'financial_analyst', 'investment_banker']
            },
            // DEGREE: Economics
            {
              id: 'degree-economics',
              title: 'B.A. / B.Sc (Hons) in Economics & Econometrics',
              subtitle: 'Economic Theory, Public Finance, Mathematical Statistics & Policy Modeling',
              shortCode: 'Economics',
              nodeType: 'degree_family',
              category: 'Economics & Analytics',
              description: 'Focuses on Microeconomic Optimization, Macroeconomic Modeling, Econometric Regressions, Game Theory, Monetary Policy, and Development Economics.',
              duration: '3 to 4 Years (NEP Honours)',
              eligibility: 'Passed 10+2 with Mathematics / Economics',
              entranceExams: ['CUET-UG (Delhi School of Economics / SRCC / St. Stephen\'s)', 'St. Xavier\'s Entrance', 'Ashoka / Flame Entrance'],
              majorBranches: ['Quantitative Econometrics & Data Analytics', 'Development & Public Policy Economics', 'Financial Economics & Securities Analysis'],
              higherStudyOptions: ['M.A. / M.Sc in Economics at Delhi School of Economics (DSE), ISI, or IGIDR', 'Indian Economic Service (IES via UPSC)', 'Ph.D in Economics'],
              skills: ['Econometric Modeling (STATA / R)', 'Micro/Macro Economic Analysis', 'Time Series Forecasting', 'Public Policy Impact Assessment', 'Quantitative Research'],
              outcomes: ['Economic policy advisors at NITI Aayog, Reserve Bank of India (RBI Grade B), World Bank / IMF analysts, and chief economists at investment banks.'],
              careerIds: ['financial_analyst', 'data_scientist', 'ias_officer']
            }
          ]
        },

        // ─── STREAM 5: CEC (Civics, Economics, Commerce) ────────────────────
        {
          id: 'stream-cec',
          title: 'CEC (Civics, Economics, Commerce)',
          subtitle: 'Commerce, Corporate Law, Civil Services & Public Administration',
          shortCode: 'CEC',
          nodeType: 'stream',
          category: 'Commerce & Law',
          description: 'A balanced stream combining Commerce and Economics with Civics and Political Systems. Ideal for students aspiring toward Law (CLAT), Corporate Taxation, Company Secretary (CS), Civil Services (UPSC), and Business Management.',
          duration: '2 Years',
          eligibility: 'Pass 10th with Social Sciences and Basic Math',
          entranceExams: ['CLAT (Common Law Admission Test for NLUs)', 'AILET (NLU Delhi)', 'CUET-UG', 'ICSI CSEET (Company Secretary)', 'IPMAT / State CETs'],
          majorBranches: ['Integrated 5-Year Law (B.A. LL.B / BBA LL.B)', 'B.Com in Corporate Law & Taxation', 'Company Secretary (ICSI CS)', 'BBA & Management', 'Civil Services Foundation (B.A. Public Administration)'],
          higherStudyOptions: ['LL.M in Corporate Law', 'MBA', 'UPSC Civil Services Examination (IAS/IPS/IRS)', 'Ph.D in Law/Commerce'],
          skills: ['Legal Reasoning & Case Law Analysis', 'Constitutional Law & Governance', 'Business Law & Contracts', 'Financial Accounting Basics', 'Public Administration'],
          outcomes: ['Admissions into top National Law Universities (NLUs via CLAT), Company Secretary certifications, corporate legal counsels, and civil administration.'],
          children: [
            // DEGREE: Integrated Law
            {
              id: 'degree-law',
              title: 'Integrated 5-Year Law (B.A. LL.B / BBA LL.B / B.Com LL.B)',
              subtitle: 'Bar Council of India (BCI) Approved Professional Advocate Degree',
              shortCode: 'Law (LL.B)',
              nodeType: 'degree_family',
              category: 'Legal Studies',
              description: 'A 5-year integrated professional law curriculum covering Constitutional Law, Jurisprudence, Criminal Law (IPC/BNS), Corporate Law, Intellectual Property Rights, Arbitration, and Moot Court advocacy.',
              duration: '5 Years (10 Semesters)',
              eligibility: 'Passed 10+2 from any stream with min 45% aggregate',
              entranceExams: ['CLAT (Consortium of 26 National Law Universities)', 'AILET (National Law University Delhi)', 'SLAT (Symbiosis Law)', 'MHCET Law', 'LSAT India'],
              majorBranches: ['Corporate Law & M&A', 'Constitutional & Criminal Litigation', 'Intellectual Property Law (IPR)', 'Arbitration & Commercial Dispute Resolution', 'Cyber Law & Data Privacy'],
              higherStudyOptions: ['LL.M (Master of Laws via CLAT-PG)', 'Judicial Services Examination (PCS-J for Civil Judge)', 'Ph.D in Law', 'International Arbitration Fellowships'],
              skills: ['Legal Research & Drafting', 'Courtroom Advocacy & Oral Arguments', 'Contract Negotiation', 'Statutory Interpretation', 'Constitutional Jurisprudence'],
              outcomes: ['Enrolled Advocate with Bar Council of India, corporate legal counsel in top law firms (Shardul Amarchand, AZB, Trilegal), Judicial Magistrate, or Public Prosecutor.'],
              careerIds: ['lawyer', 'judge', 'ias_officer']
            },
            // QUALIFICATION: ICSI CS
            {
              id: 'degree-cs',
              title: 'Company Secretary (ICSI CS Professional Qualification)',
              subtitle: 'Corporate Governance, Securities Law & Board-Level Compliance Expert',
              shortCode: 'Company Secretary',
              nodeType: 'qualification',
              category: 'Corporate Governance',
              description: 'Administered by The Institute of Company Secretaries of India (ICSI). Levels: CSEET → CS Executive (Company Law, Securities Law, Tax) → CS Professional (Corporate Restructuring, Governance) → 21 Months Practical Training.',
              duration: '3 - 4 Years (alongside graduation)',
              eligibility: 'Passed 10+2 for CSEET entrance or direct entry for Postgraduates',
              entranceExams: ['CSEET (CS Executive Entrance Test)', 'CS Executive', 'CS Professional (ICSI)'],
              majorBranches: ['Corporate Governance & Board Advisory', 'SEBI & Capital Markets Compliance', 'Mergers, Acquisitions & Takeovers', 'Secretarial Audit'],
              higherStudyOptions: ['ICSI Advanced Certificate in ADR / Insolvency', 'LL.M in Corporate Law', 'Independent Director Board Certification'],
              skills: ['Companies Act 2013 Compliance', 'SEBI LODR Regulations', 'Boardroom Procedures & Secretarial Standards', 'Corporate Restructuring Filings', 'Due Diligence'],
              outcomes: ['Mandatory Key Managerial Personnel (KMP) in all listed and large public companies, leading board secretariats and corporate legal compliance.'],
              careerIds: ['lawyer', 'chartered_accountant', 'business_owner']
            }
          ]
        },

        // ─── STREAM 6: HEC (History, Economics, Civics / Humanities / Arts) ─
        {
          id: 'stream-hec',
          title: 'HEC / Humanities & Arts (History, Economics, Civics, Political Science)',
          subtitle: 'Civil Services (UPSC), Law, Design, Journalism & Social Sciences',
          shortCode: 'HEC / Arts',
          nodeType: 'stream',
          category: 'Humanities & Social Sciences',
          description: 'The foundation for civil administration, public policy, humanities, design, media, and literature. Specializes in Indian and World History, Political Theory, Governance, Sociology, and Literature.',
          duration: '2 Years',
          eligibility: 'Pass 10th with interest in Social Sciences, Humanities, and Communication',
          entranceExams: ['CUET-UG (for top central universities: JNU, DU, BHU, Hyderabad University)', 'CLAT / AILET (Law)', 'UCEED / NID DAT / NIFT (Design)', 'TISS BAT'],
          majorBranches: ['B.A. (Hons) in Political Science, History, Sociology, English', 'UPSC Civil Services Foundation', 'Integrated 5-Year Law (B.A. LL.B)', 'Bachelor of Design (B.Des via UCEED/NID)', 'Journalism & Mass Communication (BJMC)', 'Hotel Management (BHM via NCHMCT JEE)'],
          higherStudyOptions: ['M.A. in International Relations / Political Science', 'UPSC Civil Services (IAS / IPS / IFS / IRS)', 'Master of Design (M.Des)', 'Ph.D in Social Sciences'],
          skills: ['Critical Reading & Essay Writing', 'Historical Context & Comparative Politics', 'Sociological Analysis', 'Policy Evaluation', 'Public Communication'],
          outcomes: ['Top foundation for cracking the UPSC Civil Services Examination for IAS/IPS, admissions into premier design schools (NID/NIFT), and high-impact investigative journalism.'],
          children: [
            // DEGREE: Civil Services Track
            {
              id: 'degree-ba-civil-services',
              title: 'B.A. (Hons) in Public Policy, History & Political Science (Civil Services Track)',
              subtitle: 'Academic Preparation for UPSC Civil Services (IAS / IPS / IFS) & Governance',
              shortCode: 'B.A. Governance',
              nodeType: 'degree_family',
              category: 'Governance & Public Admin',
              description: 'Focuses deeply on Indian Constitution, International Relations, Modern Indian History, Economic Geography, Public Administration, and Ethics for Civil Services Aspirants.',
              duration: '3 to 4 Years (NEP Honours)',
              eligibility: 'Passed 10+2 from any stream',
              entranceExams: ['CUET-UG (Central Universities)', 'UPSC Civil Services Examination (Preliminary, Mains, Personality Test)'],
              majorBranches: ['Indian Administrative Service (IAS)', 'Indian Police Service (IPS)', 'Indian Foreign Service (IFS)', 'State Public Service Commissions (Group 1 SDM/DSP)'],
              higherStudyOptions: ['M.A. in Public Administration / International Relations', 'Master of Public Policy (MPP at NLSIU / IIMs)', 'M.Phil / Ph.D in Political Studies'],
              skills: ['Public Administration & Governance', 'Constitutional Law Provisions', 'Essay & Analytical Writing', 'Crisis Management', 'Policy Formulation'],
              outcomes: ['District Magistrates (IAS), Superintendents of Police (IPS), Diplomats (IFS), and senior civil administration leaders.'],
              careerIds: ['ias_officer', 'ips_officer', 'ifs_officer']
            },
            // DEGREE: Design (B.Des)
            {
              id: 'degree-bdes',
              title: 'B.Des (Bachelor of Design — Product, UI/UX, Fashion, Animation)',
              subtitle: '4-Year Professional Design Degree at NID, IITs (UCEED), NIFT & Top Design Institutes',
              shortCode: 'B.Des',
              nodeType: 'degree_family',
              category: 'Design & Visual Arts',
              description: 'Covers Human-Centered Design, User Interface & User Experience (UI/UX), Product Design, Ergonomics, Visual Communication, Animation, and Fashion Technology.',
              duration: '4 Years (8 Semesters)',
              eligibility: 'Passed 10+2 from any stream (Science/Commerce/Arts)',
              entranceExams: ['UCEED (IIT Bombay, IIT Delhi, IIT Guwahati, IIT Hyderabad, IIITDM)', 'NID DAT (National Institute of Design Prelims & Mains)', 'NIFT Entrance Exam', 'SEAT / MIT DAT'],
              majorBranches: ['UI/UX & Digital Product Design', 'Industrial & Product Design', 'Communication & Graphic Design', 'Fashion Design & Textile Development', 'Animation & Game Art'],
              higherStudyOptions: ['Master of Design (M.Des via CEED for IITs/IISc/NID)', 'Master in Human-Computer Interaction (HCI)', 'Global Design Leadership'],
              skills: ['Design Thinking & User Research', 'Figma & UI Prototyping', '3D Modeling & CAD Rendering', 'Visual Hierarchy & Typography', 'Wireframing & Usability Testing'],
              outcomes: ['Lead UI/UX Designers in major tech firms, Industrial Product Designers, Creative Art Directors, and high-fashion stylists.'],
              careerIds: ['ui_designer', 'ux_designer', 'animator']
            },
            // DEGREE: Mass Communication (BJMC)
            {
              id: 'degree-bjmc',
              title: 'BJMC (Bachelor of Journalism & Mass Communication)',
              subtitle: 'Digital Journalism, Media Production, Broadcasting & Public Relations',
              shortCode: 'BJMC',
              nodeType: 'degree_family',
              category: 'Media & Communications',
              description: 'Covers Investigative Journalism, Digital Media Production, Broadcast News Writing, Video Editing, Cinematography, Public Relations (PR), and Social Media Management.',
              duration: '3 Years (6 Semesters)',
              eligibility: 'Passed 10+2 from any stream with strong language skills',
              entranceExams: ['CUET-UG (Central Universities)', 'IIMC Entrance Exam', 'IPU CET', 'Symbiosis SET'],
              majorBranches: ['Broadcast & TV News Journalism', 'Digital Content & Multimedia Storytelling', 'Public Relations (PR) & Corporate Communications', 'Film Direction & Documentary Production'],
              higherStudyOptions: ['M.A. in Mass Communication / Journalism (IIMC, Jamia, ACJ)', 'Master in Filmmaking & Direction', 'Executive PR Management'],
              skills: ['News Writing & Editorial Reporting', 'Video Editing (Premiere Pro / DaVinci)', 'Camera Operation & Lighting', 'Public Relations Campaigning', 'Digital Media Analytics'],
              outcomes: ['News anchors, investigative journalists, PR managers, digital content directors, and documentary filmmakers.'],
              careerIds: ['journalist', 'content_creator', 'film_director']
            }
          ]
        }
      ]
    },

    // ════════════════════════════════════════════════════════════════════════════
    // 2. DIPLOMA / POLYTECHNIC (3-YEAR TECHNICAL TRACK AFTER CLASS 10)
    // ════════════════════════════════════════════════════════════════════════════
    {
      id: 'stage-diploma',
      title: 'Polytechnic Diploma in Engineering (3-Year Technical Track)',
      subtitle: 'Hands-on Technical Engineering Education after Class 10',
      shortCode: 'Diploma',
      nodeType: 'education_stage',
      category: 'Technical Education',
      description: 'AICTE-approved 3-year hands-on technical curriculum after Class 10. Provides intense laboratory and workshop training, qualifying students directly for Junior Engineer (JE) technical jobs in PSUs or direct Lateral Entry into the 2nd Year (3rd Semester) of B.Tech / B.E. programs.',
      duration: '3 Years (6 Semesters)',
      eligibility: 'Passed Class 10 with minimum 35-45% aggregate in Science and Mathematics',
      entranceExams: ['State Polycet / Polytechnic Entrance Examination (e.g. AP POLYCET, TS POLYCET, JEECUP, JEXPO, DTE CET)'],
      majorBranches: ['Diploma in Computer Engineering (CSE)', 'Diploma in Electronics & Communication (ECE)', 'Diploma in Electrical & Electronics (EEE)', 'Diploma in Mechanical Engineering', 'Diploma in Civil Engineering', 'Diploma in Automobile Engineering', 'Diploma in Chemical Engineering'],
      higherStudyOptions: ['Lateral Entry into B.Tech / B.E. (Direct 2nd Year via ECET / LEET / Lateral JEE)', 'BCA (Bachelor of Computer Applications)', 'Direct Technical Recruitment — Junior Engineer (JE) in Railways, SSC, PSUs', 'Advanced Technical Certifications'],
      skills: ['Hands-on Workshop Operations', 'Engineering Drafting & CAD', 'Circuit Testing & Multimeter Diagnostics', 'Applied Mechanics & Machine Maintenance', 'Computer Troubleshooting & Programming'],
      outcomes: ['Qualifies for direct 2nd-Year admission to AICTE-approved B.Tech programs (saving 1 year of 10+2 and matching degree timelines)', 'Direct qualification for Junior Engineer examinations (RRB JE, SSC JE, State Power DISCOMs, DRDO Technical Assistant)'],
      children: [
        // BRANCH: Diploma CSE
        {
          id: 'branch-polytechnic-cse',
          title: 'Diploma in Computer Engineering / CSE',
          subtitle: 'Applied Programming, Hardware Maintenance, Networking & Web Basics',
          shortCode: 'Diploma CSE',
          nodeType: 'branch',
          category: 'Computing & Technical',
          description: 'Hands-on training in C, C++, Java, Database Management, Computer Hardware Assembling, Network Cable Crimping, Linux Commands, and Web Design.',
          duration: '3 Years',
          eligibility: 'Passed Class 10 with POLYCET rank',
          entranceExams: ['State POLYCET', 'ECET / LEET (for B.Tech Lateral Entry)'],
          majorBranches: ['Lateral Entry B.Tech in CSE / IT / AI-DS', 'BCA & Applied Computing', 'Direct IT Technical Support & Junior Web Developer'],
          higherStudyOptions: ['Direct B.Tech Lateral Entry (2nd Year)', 'BCA', 'MCA'],
          skills: ['C/C++ Programming', 'Java Basics', 'Computer Hardware Troubleshooting', 'Networking Essentials', 'SQL Database Setup', 'HTML/CSS/JavaScript'],
          outcomes: ['Eligible for Lateral Entry B.Tech into CSE/IT in top engineering colleges via state ECET/LEET with supernumerary seats, or direct junior software/hardware technician employment.'],
          children: [
            {
              id: 'branch-diploma-lateral-btech',
              title: 'Lateral Entry B.Tech (Direct 2nd Year in CSE / IT / AI)',
              subtitle: 'Supernumerary AICTE Lateral Entry Route (3-Year B.Tech after 3-Year Diploma)',
              shortCode: 'Lateral B.Tech CSE',
              nodeType: 'degree_family',
              category: 'Engineering & Technology',
              description: 'AICTE-sanctioned route allowing diploma holders to directly enter Semester 3 of the 4-year B.Tech program. Equal standing with regular B.Tech graduates.',
              duration: '3 Years (Semesters 3 to 8)',
              eligibility: 'Completed 3-Year Diploma in Engineering with min 45% aggregate + State ECET / LEET rank',
              entranceExams: ['State ECET / LEET / JELET / OJEE / Lateral Entry Tests'],
              majorBranches: ['B.Tech Computer Science & Engineering', 'B.Tech Information Technology', 'B.Tech AI & Data Science'],
              higherStudyOptions: ['M.Tech via GATE', 'M.S. in Computer Science', 'MBA in Technology Management'],
              skills: ['Advanced Algorithms', 'Object-Oriented Software Design', 'Operating Systems Internals', 'Cloud & Web Architecture', 'Machine Learning Foundations'],
              outcomes: ['Graduates obtain standard AICTE B.Tech degree, unlocking global software engineering placements, GATE examinations, and high-tech corporate careers.'],
              careerIds: ['software_engineer', 'cloud_engineer', 'ai_engineer']
            }
          ]
        },
        // BRANCH: Diploma Mechanical
        {
          id: 'branch-polytechnic-mech',
          title: 'Diploma in Mechanical Engineering',
          subtitle: 'Machining, Lathe Operations, CAD Modeling, Thermal Systems & Workshop Practice',
          shortCode: 'Diploma Mech',
          nodeType: 'branch',
          category: 'Core Engineering',
          description: 'Intense practical training in Lathe, Milling, CNC Programming, Foundry, Welding, Metrology, AutoCAD Mechanical, and Machine Maintenance.',
          duration: '3 Years',
          eligibility: 'Passed Class 10 with POLYCET rank',
          entranceExams: ['State POLYCET', 'ECET / LEET', 'RRB JE / SSC JE'],
          majorBranches: ['Lateral Entry B.Tech in Mechanical / Mechatronics', 'Junior Engineer (JE) in Indian Railways (RRB JE)', 'Production Supervisor in Automotive Industry'],
          higherStudyOptions: ['B.Tech Mechanical Lateral Entry', 'Advanced Diploma in Tool Design (CITD)'],
          skills: ['Lathe & Milling Machine Operations', 'AutoCAD Mechanical Drafting', 'CNC G-Code / M-Code Programming', 'Hydraulic & Pneumatic Circuit Setup', 'Machine Maintenance'],
          outcomes: ['Junior Engineer jobs in Indian Railways (Loco, Workshop, Carriages), BHEL, Tata Motors, L&T, or direct lateral entry into B.Tech Mechanical 2nd Year.'],
          children: [
            {
              id: 'branch-diploma-lateral-btech-mech',
              title: 'Lateral Entry B.Tech (Direct 2nd Year in Mechanical Engineering)',
              subtitle: 'Advanced Degree in Machine Design, Thermal Engineering & Robotics',
              shortCode: 'Lateral B.Tech Mech',
              nodeType: 'degree_family',
              category: 'Core Engineering',
              description: 'Progress from practical machining to advanced mathematical analysis: Finite Element Analysis (FEA), Computational Fluid Dynamics (CFD), and Automated Robotics.',
              duration: '3 Years',
              eligibility: '3-Year Diploma in Mechanical with ECET/LEET rank',
              entranceExams: ['State ECET / LEET'],
              majorBranches: ['Automotive & EV Design', 'Aerospace & Defence Manufacturing', 'Robotics & Mechatronics'],
              higherStudyOptions: ['M.Tech in Machine Design / Thermal Engineering (GATE)', 'MBA in Operations & Supply Chain'],
              skills: ['SolidWorks 3D Modeling', 'ANSYS Mechanical Simulation', 'Thermodynamic Cycle Optimization', 'Robotic Arm Kinematics', 'Plant Engineering'],
              outcomes: ['Senior mechanical design engineer in automotive, aerospace, and energy sectors.'],
              careerIds: ['mechanical_engineer', 'robotics_engineer', 'supply_chain_manager']
            }
          ]
        },
        // BRANCH: Diploma Civil
        {
          id: 'branch-polytechnic-civil',
          title: 'Diploma in Civil Engineering',
          subtitle: 'Site Surveying, Total Station, Concrete Testing, AutoCAD Civil & Estimation',
          shortCode: 'Diploma Civil',
          nodeType: 'branch',
          category: 'Core Engineering',
          description: 'Hands-on construction site training: Levelling, Total Station & Theodolite surveying, Soil testing, Concrete cube compression tests, Bill of Quantities (BOQ), and AutoCAD.',
          duration: '3 Years',
          eligibility: 'Passed Class 10 with POLYCET rank',
          entranceExams: ['State POLYCET', 'ECET / LEET', 'SSC JE / State Public Works Department (PWD) JE'],
          majorBranches: ['Lateral Entry B.Tech in Civil Engineering', 'Junior Engineer in PWD / Irrigation / Municipal Corporations', 'Site Construction Supervisor in Real Estate'],
          higherStudyOptions: ['B.Tech Civil Lateral Entry', 'Post-Diploma in Construction Management'],
          skills: ['Total Station Surveying', 'AutoCAD Civil 2D/3D', 'Concrete Mix Design & Testing', 'Bar Bending Schedules (BBS)', 'Quantity Surveying & Rate Analysis'],
          outcomes: ['Immediate employment as Site Engineers, Junior Engineers in State PWD, Irrigation departments, or lateral progression to B.Tech Civil.'],
          children: [
            {
              id: 'branch-diploma-lateral-btech-civil',
              title: 'Lateral Entry B.Tech (Direct 2nd Year in Civil Engineering)',
              subtitle: 'Advanced Structural Engineering, Smart Infrastructure & Transportation',
              shortCode: 'Lateral B.Tech Civil',
              nodeType: 'degree_family',
              category: 'Core Engineering',
              description: 'Covers advanced structural dynamics, earthquake-resistant design, prestressed concrete, and GIS infrastructure management.',
              duration: '3 Years',
              eligibility: '3-Year Diploma in Civil with ECET/LEET rank',
              entranceExams: ['State ECET / LEET'],
              majorBranches: ['Structural Engineering', 'Smart City Transportation', 'Environmental & Hydrology'],
              higherStudyOptions: ['M.Tech in Structural Engineering (GATE)', 'Indian Engineering Services (UPSC ESE)'],
              skills: ['STAAD Pro Structural Modeling', 'ETABS Building Design', 'Geotechnical Foundation Engineering', 'Project Management (Primavera / MS Project)'],
              outcomes: ['Chief structural design engineer, government executive engineer, and infrastructure construction leadership.'],
              careerIds: ['civil_engineer', 'architect', 'environmental_scientist']
            }
          ]
        },
        // BRANCH: Diploma ECE & EEE
        {
          id: 'branch-polytechnic-ece-eee',
          title: 'Diploma in Electronics & Electrical Engineering (ECE / EEE)',
          subtitle: 'Circuit Soldering, PCB Fabrication, Motor Rewinding, PLC & Microcontrollers',
          shortCode: 'Diploma ECE/EEE',
          nodeType: 'branch',
          category: 'Electrical & Electronics',
          description: 'Hands-on electrical and electronic device practice: Transformer testing, AC/DC motor winding, Oscilloscope signal analysis, Microcontroller programming (8051/Arduino), and PLC logic.',
          duration: '3 Years',
          eligibility: 'Passed Class 10 with POLYCET rank',
          entranceExams: ['State POLYCET', 'ECET / LEET', 'State Electricity Board (DISCOM) Sub-Engineer / JE Exams'],
          majorBranches: ['Lateral Entry B.Tech in ECE / EEE', 'Sub-Engineer in State Power Transmission & Distribution', 'Telecom & Network Field Technician'],
          higherStudyOptions: ['B.Tech ECE/EEE Lateral Entry', 'Advanced Embedded Systems Certification'],
          skills: ['Oscilloscope & Multimeter Diagnostics', 'PCB Layout & Soldering', 'PLC Ladder Logic Programming', 'Motor & Transformer Maintenance', 'Microcontroller Interfacing'],
          outcomes: ['Technical roles in electricity boards, telecom providers, electrical equipment manufacturers, or B.Tech Lateral Entry.'],
          children: [
            {
              id: 'branch-diploma-lateral-btech-ece-eee',
              title: 'Lateral Entry B.Tech (Direct 2nd Year in ECE / EEE)',
              subtitle: 'VLSI Chip Design, EV Powertrains & Smart Grid Systems',
              shortCode: 'Lateral B.Tech ECE/EEE',
              nodeType: 'degree_family',
              category: 'Electrical & Electronics',
              description: 'Advanced degree in semiconductor design, embedded firmware, high-voltage power electronics, and autonomous control systems.',
              duration: '3 Years',
              eligibility: '3-Year Diploma with ECET/LEET rank',
              entranceExams: ['State ECET / LEET'],
              majorBranches: ['VLSI & Semiconductor Design', 'Electric Vehicle (EV) Systems', 'Power Systems & Automation'],
              higherStudyOptions: ['M.Tech in VLSI / Power Electronics (GATE)', 'M.S. in Electrical Engineering'],
              skills: ['Verilog HDL', 'MATLAB & Simulink', 'Power Electronics Circuit Design', 'Embedded Systems C++', 'Digital Signal Processing'],
              outcomes: ['Semiconductor design engineer, power systems manager, and robotics control engineer.'],
              careerIds: ['electrical_engineer', 'robotics_engineer', 'software_engineer']
            }
          ]
        }
      ]
    },

    // ════════════════════════════════════════════════════════════════════════════
    // 3. INDUSTRIAL TRAINING INSTITUTES (ITI / VOCATIONAL SKILLS TRACK)
    // ════════════════════════════════════════════════════════════════════════════
    {
      id: 'stage-iti',
      title: 'ITI / Vocational Technical Training (NCVT / SCVT Trades)',
      subtitle: 'Craftsman Training Scheme (CTS) for Direct Industrial Employment',
      shortCode: 'ITI',
      nodeType: 'education_stage',
      category: 'Vocational Trades',
      description: 'National Council for Vocational Training (NCVT) certified 1 to 2-year skill trade courses under the Directorate General of Training (DGT). Designed for immediate industrial readiness in manufacturing, electrical maintenance, automotive repair, and computer operations.',
      duration: '1 to 2 Years depending on trade',
      eligibility: 'Passed Class 10 (or Class 8 for select trades)',
      entranceExams: ['State ITI Merit Admission / All India Trade Test (AITT) for National Trade Certificate (NTC)'],
      majorBranches: ['Electrician Trade (2 Years)', 'Fitter Trade (2 Years)', 'Mechanic Motor Vehicle (MMV - 2 Years)', 'COPA (Computer Operator & Programming Assistant - 1 Year)', 'Welder Trade (1 Year)', 'Machinist Trade (2 Years)'],
      higherStudyOptions: ['National Apprenticeship Certificate (NAC via NAPS / NATS Apprenticeship)', 'Lateral Entry to 2nd Year of Polytechnic Diploma (Direct Admission)', 'Craftsmen Instructor Training Scheme (CITS) to become ITI Instructor'],
      skills: ['Industrial Electrical Wiring & Safety Standards', 'Fitting, Turning & Precision Measurement (Vernier/Micrometer)', 'Automotive Engine Overhauling', 'Arc, TIG & MIG Welding Techniques', 'Computer Operations, Data Entry & Office Automation'],
      outcomes: ['Direct recruitment as Technician in Indian Railways (Assistant Loco Pilot - ALP, Technician Grade 3), Defence Ordnance Factories, BHEL, ISRO, and private industrial manufacturing plants', 'Direct eligibility for 1-Year National Apprenticeship or Lateral Entry to 2nd Year of Polytechnic Diploma'],
      children: [
        {
          id: 'branch-iti-electrician',
          title: 'Electrician Trade (NCVT 2-Year)',
          subtitle: 'Domestic & Industrial Electrical Wiring, Motors, Generators & Panel Wiring',
          shortCode: 'ITI Electrician',
          nodeType: 'branch',
          category: 'Vocational Trades',
          description: 'Complete hands-on training in single/three-phase wiring, AC/DC motor repair, earth testing, electrical panel assembly, and industrial safety norms.',
          duration: '2 Years',
          eligibility: 'Passed Class 10 with Science and Maths',
          entranceExams: ['All India Trade Test (AITT) for National Trade Certificate (NTC)'],
          majorBranches: ['National Apprenticeship in Railways/BHEL', 'Lateral Entry to 2nd Year Diploma EEE', 'Licensed Electrical Contractor (Wireman License)'],
          higherStudyOptions: ['Apprenticeship (NAC)', 'Diploma Lateral Entry (2nd Year EEE)'],
          skills: ['Industrial Wiring', 'Motor Rewinding', 'Circuit Breakers & Relays', 'Safety Standards & Earthing', 'Solar Panel Installation'],
          outcomes: ['Railway Assistant Loco Pilot (ALP), Technician Grade 3, state electricity board lineman/wireman, or private electrical contractor business.'],
          careerIds: ['electrician', 'mechanic']
        },
        {
          id: 'branch-iti-fitter',
          title: 'Fitter & Machinist Trade (NCVT 2-Year)',
          subtitle: 'Precision Metal Working, Assembly, Lathe Turning & Tool Operations',
          shortCode: 'ITI Fitter',
          nodeType: 'branch',
          category: 'Vocational Trades',
          description: 'Precision measurement, filing, sawing, drilling, reaming, tapping, machine assembly, and tolerance verification down to microns.',
          duration: '2 Years',
          eligibility: 'Passed Class 10',
          entranceExams: ['AITT National Trade Test'],
          majorBranches: ['Railway Workshop Technician', 'Ordnance / Defence Factory Machinist', 'Lateral Entry to 2nd Year Diploma Mechanical'],
          higherStudyOptions: ['Apprenticeship (NAC)', 'Diploma Lateral Entry (2nd Year Mechanical)'],
          skills: ['Precision Fitting', 'Micrometer & Vernier Calipers', 'Lathe Operations', 'Blueprint Reading', 'Assembly & Maintenance'],
          outcomes: ['Technician roles in Indian Railways Workshops, Defence Ordnance, BHEL, Maruti Suzuki, Tata Motors, and heavy engineering plants.'],
          careerIds: ['welder', 'mechanic', 'mechanical_engineer']
        },
        {
          id: 'branch-iti-copa',
          title: 'COPA (Computer Operator & Programming Assistant - 1-Year)',
          subtitle: 'Office Automation, Data Management, HTML/JavaScript & Computer Networks',
          shortCode: 'ITI COPA',
          nodeType: 'branch',
          category: 'Vocational Trades',
          description: 'Training in Windows/Linux OS, Microsoft Office, Database Entry in Access/MySQL, Web Design with HTML/CSS/JavaScript, and Hardware Maintenance.',
          duration: '1 Year',
          eligibility: 'Passed Class 10',
          entranceExams: ['AITT National Trade Test'],
          majorBranches: ['Data Entry Operator (DEO) in Government/Courts', 'Junior Computer Technician', 'BCA / Diploma CSE Progression'],
          higherStudyOptions: ['BCA', 'Lateral Entry Diploma CSE', 'Advanced Web Development Certifications'],
          skills: ['Office Automation (Excel/Word/PPT)', 'Typing Speed & Accuracy', 'Basic Web Design (HTML/CSS)', 'Computer Troubleshooting', 'Data Entry & Auditing'],
          outcomes: ['Data entry operators in public sector banks and government offices, junior office assistants, and computer lab assistants.'],
          careerIds: ['software_engineer', 'content_creator']
        }
      ]
    }
  ]
};

/**
 * FLAT LOOKUP CATALOG FOR FAST SEARCH, FILTERING, AND COMPARISON RESOLUTION
 */
export function flattenEducationTree(root: IEducationTreeNode): IEducationTreeNode[] {
  const result: IEducationTreeNode[] = [];
  function traverse(node: IEducationTreeNode) {
    result.push(node);
    if (node.children && node.children.length > 0) {
      node.children.forEach(traverse);
    }
  }
  traverse(root);
  return result;
}

export const ALL_EDUCATION_NODES = flattenEducationTree(INDIAN_EDUCATION_TREE);

/**
 * POPULAR PATHWAY COMPARISON PRESETS
 */
export const PATHWAY_COMPARISON_PRESETS: IPathwayComparisonPreset[] = [
  {
    id: 'preset-mpc-vs-diploma',
    title: 'Intermediate MPC vs Polytechnic Diploma (CSE/Mech)',
    description: 'Compare the traditional 2-year 10+2 academic route vs the 3-year hands-on technical diploma route toward engineering careers.',
    nodeIds: ['stream-mpc', 'stage-diploma']
  },
  {
    id: 'preset-btech-vs-bca',
    title: 'B.Tech CSE vs BCA (Applied Computing)',
    description: 'Compare the 4-year engineering curriculum vs the 3-year applied computer applications program in software engineering.',
    nodeIds: ['branch-btech-cse', 'degree-bca']
  },
  {
    id: 'preset-bcom-vs-bba',
    title: 'B.Com (Honours) vs BBA / IPM at IIMs',
    description: 'Compare accounting, taxation & finance depth in B.Com with corporate leadership & strategic management in BBA/IPM.',
    nodeIds: ['degree-bcom', 'degree-bba']
  },
  {
    id: 'preset-mbbs-vs-bpharm',
    title: 'MBBS (Clinical Medicine) vs B.Pharm / Pharm.D',
    description: 'Compare medical doctor patient diagnosis & surgery with pharmaceutical formulation, drug discovery & clinical pharmacy.',
    nodeIds: ['degree-mbbs', 'degree-pharmacy']
  },
  {
    id: 'preset-cec-vs-hec',
    title: 'Intermediate CEC (Law & Commerce) vs HEC (Civil Services & Arts)',
    description: 'Compare legal studies, company secretary & corporate law vs civil administration, UPSC governance & design.',
    nodeIds: ['stream-cec', 'stream-hec']
  }
];
