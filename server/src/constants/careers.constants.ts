import config from '../config/env';

export interface CareerMetadata {
  id: string;
  title: string;
  category: string;
  description: string;
  education: string;
  skills: string[];
  responsibilities: string[];
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

export const getCareerCategory = (title: string): string => {
  const norm = title.toLowerCase();
  
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
  if (["pilot", "air traffic controller"].includes(norm)) {
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
  return "Other";
};

// 38 Realistic Demo Careers Details for Sandbox testing (Enabled ONLY when CAREER_DATA_MODE is 'mock')
export const MOCK_CAREER_DETAILS: Record<string, { description: string; education: string; responsibilities: string[] }> = {
  'civil_engineer': {
    description: "Demo description: Plans, designs, and oversees construction of infrastructure projects like roads and bridges for UI testing.",
    education: "Demo education: Bachelor's degree in Civil Engineering.",
    responsibilities: ["Develop detailed structural designs and drawings", "Manage construction budgets and schedules", "Inspect sites to monitor progress and safety conformance"]
  },
  'mechanical_engineer': {
    description: "Demo description: Designs, develops, and tests mechanical devices, engines, and tools for UI testing.",
    education: "Demo education: Bachelor's degree in Mechanical Engineering.",
    responsibilities: ["Design mechanical prototypes and components", "Analyze system thermal and stress behaviors", "Oversee fabrication and assembly of devices"]
  },
  'electrical_engineer': {
    description: "Demo description: Designs, tests, and supervises manufacturing of electrical equipment and systems for UI testing.",
    education: "Demo education: Bachelor's degree in Electrical Engineering.",
    responsibilities: ["Design electrical circuitry and power grids", "Test electrical equipment for safety and operations", "Coordinate with project managers on electrical layouts"]
  },
  'robotics_engineer': {
    description: "Demo description: Designs, builds, and maintains robotic applications and automated machinery for UI testing.",
    education: "Demo education: Bachelor's degree in Robotics or Embedded Systems.",
    responsibilities: ["Build robotics system prototypes", "Program robotic software and controls", "Troubleshoot and optimize robotics applications"]
  },
  'software_engineer': {
    description: "Demo description: Designs, develops, and implements software applications and systems for UI testing.",
    education: "Demo education: Bachelor's degree in Computer Science or Software Engineering.",
    responsibilities: ["Write clean, maintainable, and efficient source code", "Collaborate on software system architectures", "Troubleshoot, debug, and upgrade existing platforms"]
  },
  'ai_engineer': {
    description: "Demo description: Develops AI models, systems, and cognitive architectures for UI testing.",
    education: "Demo education: Bachelor's degree in Computer Science or Data Science.",
    responsibilities: ["Train neural network and machine learning models", "Integrate AI service endpoints into applications", "Evaluate model accuracy and fine-tune hyperparameters"]
  },
  'ml_engineer': {
    description: "Demo description: Researches, builds, and designs self-running artificial intelligence systems for UI testing.",
    education: "Demo education: Bachelor's degree in Computer Science or Statistics.",
    responsibilities: ["Design machine learning pipelines and components", "Optimize data science models for production deployment", "Build scalable data processing systems"]
  },
  'data_scientist': {
    description: "Demo description: Extracts, analyzes, and models complex datasets to guide corporate strategy for UI testing.",
    education: "Demo education: Bachelor's degree in Data Science, Mathematics, or Statistics.",
    responsibilities: ["Analyze large structured and unstructured datasets", "Build predictive models and analytical algorithms", "Present findings to key stakeholders"]
  },
  'cybersecurity_analyst': {
    description: "Demo description: Protects systems, networks, and data from cyber threats and unauthorized access for UI testing.",
    education: "Demo education: Bachelor's degree in Cybersecurity or Information Systems.",
    responsibilities: ["Monitor networks for security breaches and intrusions", "Implement firewall controls and data encryption", "Conduct vulnerability assessments and penetration testing"]
  },
  'cloud_engineer': {
    description: "Demo description: Designs, deploys, and maintains scalable cloud infrastructure and services for UI testing.",
    education: "Demo education: Bachelor's degree in Computer Science or Cloud Systems.",
    responsibilities: ["Design virtual server architectures on cloud providers", "Set up DevOps pipelines for server deployment", "Manage cloud resources, costs, and scalability"]
  },
  'game_developer': {
    description: "Demo description: Codes, builds, and designs interactive video game components and logics for UI testing.",
    education: "Demo education: Bachelor's degree in Game Development or Computer Science.",
    responsibilities: ["Program gameplay mechanics and engine interactions", "Integrate visual assets and animations", "Optimize game performance and frame rates"]
  },
  'ui_designer': {
    description: "Demo description: Creates visual elements, layout guides, and styling components for digital screens for UI testing.",
    education: "Demo education: Bachelor's degree in Graphic Design, UI/UX, or Arts.",
    responsibilities: ["Design style guides and high-fidelity screen templates", "Ensure visual interface styling consistency", "Collaborate on interactive prototypes"]
  },
  'ux_designer': {
    description: "Demo description: Researches, defines, and structures user flows and screen interactions for digital products for UI testing.",
    education: "Demo education: Bachelor's degree in Design, Psychology, or HCI.",
    responsibilities: ["Conduct user research interviews and tests", "Create structural wireframes and low-fidelity user flows", "Optimize product flows for high user satisfaction"]
  },
  'architect': {
    description: "Demo description: Plans, designs, and structures residential and commercial physical buildings for UI testing.",
    education: "Demo education: Bachelor's degree in Architecture.",
    responsibilities: ["Develop architectural designs and project layout concepts", "Ensure structural blueprints match building codes", "Consult with civil engineers and clients on building progress"]
  },
  'doctor': {
    description: "Demo description: Diagnoses, treats, and helps prevent human illnesses and injuries for UI testing.",
    education: "Demo education: MD, MBBS, or equivalent medical practitioner license.",
    responsibilities: ["Examine patients and diagnose medical conditions", "Prescribe medications and recommend treatment plans", "Collaborate with healthcare staff on clinical workflows"]
  },
  'nurse': {
    description: "Demo description: Provides hands-on clinical care, administers treatments, and monitors patient vitals for UI testing.",
    education: "Demo education: Bachelor's degree in Nursing (BSN) or equivalent license.",
    responsibilities: ["Administer medications and monitor patient vitals", "Assist surgeons and doctors in clinical tasks", "Explain healthcare guidelines to patients and families"]
  },
  'pharmacist': {
    description: "Demo description: Dispenses prescription medications and provides clinical info on drug usage for UI testing.",
    education: "Demo education: Doctor of Pharmacy (PharmD) or equivalent license.",
    responsibilities: ["Review and dispense prescription medications safely", "Advise patients on dosage guidelines and side effects", "Manage pharmacy inventory and regulatory files"]
  },
  'dentist': {
    description: "Demo description: Diagnoses and treats oral health problems and performs dental procedures for UI testing.",
    education: "Demo education: Doctor of Dental Surgery (DDS) or DDS equivalent.",
    responsibilities: ["Perform dental exams and cleanings", "Treat tooth decay, cavities, and gum diseases", "Administer local anesthetics and perform oral surgeries"]
  },
  'nutritionist': {
    description: "Demo description: Designs personalized dietary plans and advises clients on healthy nutrition for UI testing.",
    education: "Demo education: Bachelor's degree in Nutrition, Dietetics, or health sciences.",
    responsibilities: ["Assess client nutrition status and health targets", "Create personalized diet plans and recipes", "Educate groups on balanced nutrition and wellness"]
  },
  'chartered_accountant': {
    description: "Demo description: Audits financial logs, prepares company taxes, and advises on business governance for UI testing.",
    education: "Demo education: Professional CA certification or accounting degree.",
    responsibilities: ["Audit corporate accounting books and tax logs", "Prepare company financial filings and statements", "Advise on corporate taxes and compliance controls"]
  },
  'financial_analyst': {
    description: "Demo description: Analyzes investment opportunities, corporate finance data, and market metrics for UI testing.",
    education: "Demo education: Bachelor's degree in Finance, Economics, or Commerce.",
    responsibilities: ["Build financial models and NPV calculations", "Evaluate investment options and market statistics", "Prepare finance reports for management decisions"]
  },
  'investment_banker': {
    description: "Demo description: Advises corporations on capital raising, mergers and acquisitions, and asset management for UI testing.",
    education: "Demo education: Bachelor's degree in Finance or MBA.",
    responsibilities: ["Coordinate mergers and acquisition strategies", "Prepare company financial valuation models", "Advise on corporate capital structures and IPOs"]
  },
  'product_manager': {
    description: "Demo description: Directs cross-functional teams to build, launch, and iterate digital products for UI testing.",
    education: "Demo education: Bachelor's degree in Business, Computer Science, or equivalent.",
    responsibilities: ["Define product roadmaps, requirements, and user stories", "Coordinate between engineering, design, and business teams", "Analyze key performance indicators to guide product growth"]
  },
  'entrepreneur': {
    description: "Demo description: Launches new startups, builds business products, and coordinates operations for UI testing.",
    education: "Demo education: Not Specified (often business or technical degree).",
    responsibilities: ["Design business models and secure startup funding", "Manage early startup hiring and sales operations", "Drive product-market fit and revenue growth"]
  },
  'marketing_manager': {
    description: "Demo description: Designs brand campaigns, manages advertising channels, and drives customer acquisition for UI testing.",
    education: "Demo education: Bachelor's degree in Marketing, Business, or Communications.",
    responsibilities: ["Coordinate digital and offline ad campaigns", "Manage marketing budgets and customer acquisition goals", "Oversee brand guidelines and creative assets creation"]
  },
  'lawyer': {
    description: "Demo description: Represents clients in court trials, drafts legal agreements, and advises on statutory rights for UI testing.",
    education: "Demo education: Juris Doctor (JD) or Bachelor of Laws (LLB) degree.",
    responsibilities: ["Draft company contracts and court pleadings", "Represent clients in negotiations and hearings", "Conduct thorough legal research on precedents"]
  },
  'judge': {
    description: "Demo description: Presides over court hearings, interprets statutes, and delivers judicial decisions for UI testing.",
    education: "Demo education: JD / LLB degree with extensive legal practice experience.",
    responsibilities: ["Preside over legal trials and hearings", "Review case files, evidence, and briefs", "Interpret laws to make fair judicial decisions"]
  },
  'teacher': {
    description: "Demo description: Educates students in primary or secondary classes, designing lesson guides and coursework for UI testing.",
    education: "Demo education: Bachelor's degree in Education (B.Ed) or specific subject.",
    responsibilities: ["Deliver classroom lessons on specific subjects", "Evaluate student performance and homework", "Develop lesson plans matching curriculum goals"]
  },
  'professor': {
    description: "Demo description: Teaches college courses, conducts academic research, and publishes scholarly papers for UI testing.",
    education: "Demo education: PhD or doctoral degree in specific discipline.",
    responsibilities: ["Lecture undergraduate and graduate students", "Conduct research and publish academic articles", "Supervise student thesis projects"]
  },
  'scientist': {
    description: "Demo description: Conducts systematic experiments, analyzes scientific telemetry, and advances research for UI testing.",
    education: "Demo education: PhD or Master's degree in Science.",
    responsibilities: ["Design and execute lab experiments", "Analyze data using statistical models", "Publish findings in peer-reviewed scientific journals"]
  },
  'researcher': {
    description: "Demo description: Investigates data sources, prepares reports, and conducts qualitative/quantitative research for UI testing.",
    education: "Demo education: Master's degree or PhD in relevant field.",
    responsibilities: ["Gather research data from various data sources", "Prepare research abstracts and presentations", "Collaborate on research project execution"]
  },
  'biotechnologist': {
    description: "Demo description: Applies biological principles to create medical, agricultural, and industrial products for UI testing.",
    education: "Demo education: Bachelor's degree in Biotechnology, Biology, or related.",
    responsibilities: ["Operate bioreactors and titration equipment", "Perform cell cultures and DNA extraction tasks", "Verify bioproduct compliance with safety standards"]
  },
  'chef': {
    description: "Demo description: Creates visual elements, layout guides, and styling components for digital screens for UI testing.",
    education: "Demo education: Culinary arts degree or certification.",
    responsibilities: ["Create original food recipes and menus", "Supervise kitchen staff and food preparation guidelines", "Monitor food safety and hygiene metrics in the kitchen"]
  },
  'hotel_manager': {
    description: "Demo description: Manages hotel operations, customer hospitality, and room reservation budgets for UI testing.",
    education: "Demo education: Bachelor's degree in Hospitality or Hotel Management.",
    responsibilities: ["Monitor front-desk services and customer satisfaction", "Manage hotel operations budgets and staffing schedules", "Oversee rooms maintenance and event planning bookings"]
  },
  'farmer': {
    description: "Demo description: Cultivates crops, manages livestock, and operates agricultural machinery for UI testing.",
    education: "Demo education: Not Specified (often agricultural studies).",
    responsibilities: ["Plant, nurture, and harvest crop yields", "Manage livestock breeding and welfare", "Maintain tractors and farm equipment"]
  },
  'ias_officer': {
    description: "Demo description: Administers public policy, manages district governance, and coordinates state programs for UI testing.",
    education: "Demo education: Civil Services Exam completion with any bachelor's degree.",
    responsibilities: ["Implement state and central welfare policies", "Supervise public administration in the district", "Manage government budgets and public services"]
  },
  'army_officer': {
    description: "Demo description: Commands defense forces, directs combat tactics, and maintains military readiness for UI testing.",
    education: "Demo education: Military academy training with bachelor's degree.",
    responsibilities: ["Command troop units during operations and drills", "Maintain defensive equipment and security systems readiness", "Coordinate national defense strategies"]
  },
  'electrician': {
    description: "Demo description: Installs, repairs, and maintains electrical wiring and systems in buildings for UI testing.",
    education: "Demo education: Trade certificate or polytechnic diploma.",
    responsibilities: ["Read electrical blueprints and install wiring systems", "Diagnose and repair electrical shorts and issues", "Inspect electrical components for safety code compliance"]
  }
};

const isMockActive = config.CAREER_DATA_MODE === 'mock';

// Construct the complete career data array dynamically based on config mode
export const CAREERS_DATA: CareerMetadata[] = STEP3_DREAM_CAREERS.map((title) => {
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  const skills = CAREER_SKILL_MAPPING[id] || [];
  
  // Merge mock details only if mock mode is active
  const mockDetails = isMockActive ? MOCK_CAREER_DETAILS[id] : null;

  return {
    id,
    title,
    category: getCareerCategory(title),
    description: mockDetails ? mockDetails.description : "Data currently unavailable.",
    education: mockDetails ? mockDetails.education : "Not Specified",
    skills,
    responsibilities: mockDetails ? mockDetails.responsibilities : [],
    salaryRange: "Data currently unavailable.",
    growthRate: "Data currently unavailable.",
    demandLevel: "Data currently unavailable."
  };
});
