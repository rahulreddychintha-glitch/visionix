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

// Construct the complete career data array
export const CAREERS_DATA: CareerMetadata[] = STEP3_DREAM_CAREERS.map((title) => {
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  const skills = CAREER_SKILL_MAPPING[id] || [];
  return {
    id,
    title,
    category: getCareerCategory(title),
    description: "Data currently unavailable.",
    education: "Not Specified",
    skills,
    responsibilities: [],
    salaryRange: "Data currently unavailable.",
    growthRate: "Data currently unavailable.",
    demandLevel: "Data currently unavailable."
  };
});
