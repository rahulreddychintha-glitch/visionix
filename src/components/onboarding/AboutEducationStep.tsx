import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check, Plus, Trash2 } from 'lucide-react';
import {
  STEP2_EDUCATION_LEVELS,
  SCHOOL_CLASSES,
  INTERMEDIATE_CLASSES,
  INTERMEDIATE_STREAMS,
  DIPLOMA_BRANCHES,
  DIPLOMA_STUDY_YEARS,
  UNDERGRADUATE_COURSES,
  UNDERGRADUATE_STUDY_YEARS,
  POSTGRADUATE_COURSES,
  POSTGRADUATE_STUDY_YEARS,
  DOCTORATE_COURSES,
  DOCTORATE_STUDY_YEARS,
  STEP2_ACADEMIC_FIELDS,
  OTHER_OPTION,
  type TaxonomyItem
} from '../../constants/onboarding.constants';
import { SearchableSelect } from './SearchableSelect';
import { NavigationButtons } from './NavigationButtons';
import styles from '../../pages/OnboardingPage.module.css';

const DISCIPLINE_SPECIALIZATIONS_MAP: Record<string, { value: string; label: string }[]> = {
  // Engineering / CS
  btech_be: [
    { value: 'artificial_intelligence', label: 'Artificial Intelligence & ML' },
    { value: 'data_science', label: 'Data Science & Analytics' },
    { value: 'cyber_security', label: 'Cyber Security & Cryptography' },
    { value: 'software_engineering', label: 'Software Development' },
    { value: 'cloud_computing', label: 'Cloud Computing & DevOps' },
    { value: 'vlsi_embedded', label: 'VLSI & Embedded Systems' },
    { value: 'robotics_automation', label: 'Robotics & Automation' },
    { value: 'structural_engineering', label: 'Structural Engineering' },
    { value: 'thermal_automotive', label: 'Thermal & Automotive Systems' },
  ],
  bca: [
    { value: 'fullstack_web', label: 'Full Stack Web Development' },
    { value: 'cloud_devops', label: 'Cloud Computing & DevOps' },
    { value: 'mobile_app_dev', label: 'Mobile Application Development' },
    { value: 'data_analytics', label: 'Data Analytics & Database Admin' },
    { value: 'cyber_security', label: 'Cyber Security & Network Defense' },
  ],
  bsc_cs_it: [
    { value: 'artificial_intelligence', label: 'Artificial Intelligence & ML' },
    { value: 'data_science', label: 'Data Science & Analytics' },
    { value: 'cloud_computing', label: 'Cloud Infrastructure & Networks' },
    { value: 'cyber_security', label: 'Information Security & Cryptography' },
  ],
  // Diploma
  dip_cse: [
    { value: 'web_development', label: 'Web & App Development' },
    { value: 'networking_cloud', label: 'Computer Networks & Cloud' },
    { value: 'cyber_security', label: 'Cyber Security & Systems' },
  ],
  dip_mech: [
    { value: 'cad_cam_design', label: 'CAD/CAM & Product Design' },
    { value: 'automotive_ev', label: 'Automobile & EV Engineering' },
    { value: 'robotics_automation', label: 'Industrial Automation & Robotics' },
  ],
  dip_civil: [
    { value: 'structural_design', label: 'Structural Drafting & Surveying' },
    { value: 'construction_mgmt', label: 'Construction Management' },
  ],
  dip_eee: [
    { value: 'power_systems', label: 'Power Systems & EV Charging' },
    { value: 'control_systems', label: 'Industrial Control Systems' },
  ],
  dip_ece: [
    { value: 'embedded_systems', label: 'Embedded Systems & IoT' },
    { value: 'telecom_networks', label: 'Telecommunication Networks' },
  ],
  // Medicine & Healthcare
  mbbs: [
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'neurology', label: 'Neurology' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'oncology', label: 'Oncology' },
    { value: 'general_surgery', label: 'General Surgery' },
    { value: 'orthopedics', label: 'Orthopedics' },
  ],
  bds: [
    { value: 'orthodontics', label: 'Orthodontics' },
    { value: 'oral_surgery', label: 'Oral & Maxillofacial Surgery' },
    { value: 'prosthodontics', label: 'Prosthodontics' },
  ],
  bpharm: [
    { value: 'pharmacology', label: 'Clinical Pharmacology' },
    { value: 'pharmaceutics', label: 'Pharmaceutics & Drug Design' },
    { value: 'clinical_trials', label: 'Clinical Trials & Regulatory Affairs' },
  ],
  // Business & Commerce
  bcom: [
    { value: 'accounting_audit', label: 'Accounting & Auditing' },
    { value: 'taxation_compliance', label: 'Taxation & Regulatory Compliance' },
    { value: 'banking_insurance', label: 'Banking & Financial Services' },
    { value: 'corporate_finance', label: 'Corporate Finance' },
  ],
  bba_bms: [
    { value: 'marketing_strategy', label: 'Marketing Strategy & Digital Ads' },
    { value: 'corporate_finance', label: 'Corporate Finance & Investment Banking' },
    { value: 'human_resources', label: 'Human Resources & Talent Management' },
    { value: 'operations_supply_chain', label: 'Operations & Supply Chain Management' },
    { value: 'business_analytics', label: 'Business Analytics & Growth Strategy' },
  ],
  // Postgrad
  mba: [
    { value: 'finance_investment', label: 'Finance & Investment Banking' },
    { value: 'marketing_growth', label: 'Marketing, Brand & Growth Strategy' },
    { value: 'operations_supply', label: 'Operations & Supply Chain' },
    { value: 'business_analytics', label: 'Business Analytics & Data-Driven Strategy' },
    { value: 'product_management', label: 'Product Management & Tech Strategy' },
  ],
  mtech_me: [
    { value: 'artificial_intelligence', label: 'AI, Machine Learning & Deep Learning' },
    { value: 'data_engineering', label: 'Big Data & Distributed Computing' },
    { value: 'vlsi_microelectronics', label: 'VLSI Design & Microelectronics' },
    { value: 'robotics_mechatronics', label: 'Robotics, Autonomous Systems & Mechatronics' },
  ],
  // Law
  law_integrated: [
    { value: 'corporate_law', label: 'Corporate & Commercial Law' },
    { value: 'cyber_law_ipr', label: 'Cyber Law & Intellectual Property (IPR)' },
    { value: 'criminal_law', label: 'Criminal Justice & Litigation' },
    { value: 'constitutional_law', label: 'Constitutional & Human Rights Law' },
  ],
  // Design
  bdes_barch: [
    { value: 'ui_ux_design', label: 'UI/UX & Product Design' },
    { value: 'graphic_branding', label: 'Graphic Design & Visual Branding' },
    { value: 'fashion_design', label: 'Fashion & Textile Design' },
    { value: 'interior_architecture', label: 'Interior Architecture & Spatial Planning' },
    { value: 'animation_vfx', label: '3D Animation, Game Art & VFX' },
  ],
  // Humanities
  ba_humanities: [
    { value: 'economics_policy', label: 'Economics & Public Policy' },
    { value: 'psychology_counseling', label: 'Psychology & Behavioral Sciences' },
    { value: 'journalism_media', label: 'Journalism & Digital Media Communication' },
    { value: 'english_literature', label: 'English Literature & Creative Writing' },
  ]
};

const FALLBACK_STUDY_YEARS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  '5th Year',
  'Final Year',
  'Graduated'
];

interface AboutEducationStepProps {
  data: any;
  onChange: (section: string, fields: any) => void;
  errors: any;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

export const AboutEducationStep: React.FC<AboutEducationStepProps> = ({
  data,
  onChange,
  errors,
  onNext,
  onPrev,
  isLoading
}) => {
  const education = data.education || {};
  const currentLevelId = (education.level || '').toLowerCase().trim();

  // Categorize Education Level for Dynamic Fields
  const isSchool = currentLevelId === 'school' || currentLevelId.startsWith('school');
  const isIntermediate = currentLevelId === 'intermediate' || currentLevelId.startsWith('intermediate');
  const isDiploma = currentLevelId === 'diploma' || currentLevelId.startsWith('diploma') || currentLevelId === 'polytechnic';
  const isUndergraduate = currentLevelId === 'undergraduate' || currentLevelId.startsWith('undergraduate') || currentLevelId === 'bachelors_degree';
  const isPostgraduate = currentLevelId === 'postgraduate' || currentLevelId.startsWith('postgraduate') || currentLevelId === 'masters_degree' || currentLevelId === 'mba';
  const isDoctorate = currentLevelId === 'doctorate_phd' || currentLevelId === 'post_doctorate';

  // Determine dynamic course / stream list based on level
  const courseOptions: TaxonomyItem[] = useMemo(() => {
    if (isIntermediate) return INTERMEDIATE_STREAMS;
    if (isDiploma) return DIPLOMA_BRANCHES;
    if (isUndergraduate) return UNDERGRADUATE_COURSES;
    if (isPostgraduate) return POSTGRADUATE_COURSES;
    if (isDoctorate) return DOCTORATE_COURSES;
    return STEP2_ACADEMIC_FIELDS;
  }, [isIntermediate, isDiploma, isUndergraduate, isPostgraduate, isDoctorate]);

  // Determine dynamic year / class list based on level
  const yearOptions: string[] = useMemo(() => {
    if (isIntermediate) return INTERMEDIATE_CLASSES;
    if (isDiploma) return DIPLOMA_STUDY_YEARS;
    if (isUndergraduate) return UNDERGRADUATE_STUDY_YEARS;
    if (isPostgraduate) return POSTGRADUATE_STUDY_YEARS;
    if (isDoctorate) return DOCTORATE_STUDY_YEARS;
    return FALLBACK_STUDY_YEARS;
  }, [isIntermediate, isDiploma, isUndergraduate, isPostgraduate, isDoctorate]);

  // Field Labels tailored to stage
  const courseFieldLabel = useMemo(() => {
    if (isIntermediate) return 'Stream / Combination *';
    if (isDiploma) return 'Diploma Branch / Program *';
    if (isUndergraduate) return 'Degree / Course *';
    if (isPostgraduate) return 'Degree / Program *';
    if (isDoctorate) return 'Research Domain / PhD Program *';
    return 'Course / Degree / Program *';
  }, [isIntermediate, isDiploma, isUndergraduate, isPostgraduate, isDoctorate]);

  const yearFieldLabel = useMemo(() => {
    if (isIntermediate) return 'Class / Year *';
    if (isDiploma) return 'Study Year *';
    if (isUndergraduate) return 'Study Year *';
    if (isPostgraduate) return 'Study Year *';
    if (isDoctorate) return 'Stage / Year *';
    return 'Year / Current Study Year *';
  }, [isIntermediate, isDiploma, isUndergraduate, isPostgraduate, isDoctorate]);

  const showSpecialization = !isSchool && !isIntermediate && !!education.level;
  const showAdditionalCourses = !isSchool && !!education.level;

  const additionalCourses = useMemo(() => {
    if (education.courses && Array.isArray(education.courses) && education.courses.length > 1) {
      return education.courses.slice(1);
    }
    return [];
  }, [education.courses]);

  const handleEducationChange = (field: string, value: any) => {
    const updated = {
      ...education,
      [field]: value
    };
    if (field === 'studyYear' || field === 'stream' || field === 'branchSpecialization') {
      const rest = (education.courses && education.courses.length > 1) ? education.courses.slice(1) : [];
      updated.courses = [
        {
          stream: field === 'stream' ? value : (education.stream || ''),
          branchSpecialization: field === 'branchSpecialization' ? value : (education.branchSpecialization || ''),
          studyYear: field === 'studyYear' ? value : (education.studyYear || ''),
        },
        ...rest
      ];
    }
    onChange('education', updated);
  };

  const handleLevelChange = (val: string) => {
    if (val === education.level) return;

    onChange('education', {
      ...education,
      level: val,
      currentClass: '',
      stream: '',
      branchSpecialization: '',
      studyYear: '',
      courses: [],
    });
  };

  const handleStreamChange = (val: string) => {
    const rest = (education.courses && education.courses.length > 1) ? education.courses.slice(1) : [];
    onChange('education', {
      ...education,
      stream: val,
      branchSpecialization: '',
      courses: [
        {
          stream: val,
          branchSpecialization: '',
          studyYear: education.studyYear || '',
        },
        ...rest
      ]
    });
  };

  const handleSpecializationChange = (val: string) => {
    const rest = (education.courses && education.courses.length > 1) ? education.courses.slice(1) : [];
    onChange('education', {
      ...education,
      branchSpecialization: val,
      courses: [
        {
          stream: education.stream || '',
          branchSpecialization: val,
          studyYear: education.studyYear || '',
        },
        ...rest
      ]
    });
  };

  // Multiple Courses handlers
  const handleAddCourse = () => {
    const primary = {
      stream: education.stream || '',
      branchSpecialization: education.branchSpecialization || '',
      studyYear: education.studyYear || '',
    };
    const currentCourses = (education.courses && Array.isArray(education.courses) && education.courses.length > 0)
      ? [...education.courses]
      : [primary];
    
    const updated = [...currentCourses, { stream: '', branchSpecialization: '', studyYear: '' }];
    onChange('education', {
      ...education,
      courses: updated
    });
  };

  const handleUpdateAdditionalCourse = (idx: number, field: string, val: string) => {
    const primary = {
      stream: education.stream || '',
      branchSpecialization: education.branchSpecialization || '',
      studyYear: education.studyYear || '',
    };
    const currentCourses = (education.courses && Array.isArray(education.courses) && education.courses.length > 0)
      ? [...education.courses]
      : [primary];

    const actualIdx = idx + 1;
    const target = currentCourses[actualIdx] || { stream: '', branchSpecialization: '', studyYear: '' };
    currentCourses[actualIdx] = { ...target, [field]: val };

    onChange('education', {
      ...education,
      courses: currentCourses
    });
  };

  const handleRemoveAdditionalCourse = (idx: number) => {
    const primary = {
      stream: education.stream || '',
      branchSpecialization: education.branchSpecialization || '',
      studyYear: education.studyYear || '',
    };
    const currentCourses = (education.courses && Array.isArray(education.courses) && education.courses.length > 0)
      ? [...education.courses]
      : [primary];

    const actualIdx = idx + 1;
    currentCourses.splice(actualIdx, 1);

    onChange('education', {
      ...education,
      courses: currentCourses
    });
  };

  const getSpecializationOptionsForStream = (streamName: string) => {
    const streamNorm = streamName.toLowerCase();
    
    // Check direct key or sub-match
    let matchKey = Object.keys(DISCIPLINE_SPECIALIZATIONS_MAP).find(k => streamNorm.includes(k) || k.includes(streamNorm));
    if (!matchKey) {
      if (streamNorm.includes('engineering') || streamNorm.includes('technology') || streamNorm.includes('b.tech') || streamNorm.includes('b.e')) matchKey = 'btech_be';
      else if (streamNorm.includes('bca') || streamNorm.includes('computer application')) matchKey = 'bca';
      else if (streamNorm.includes('computer science') || streamNorm.includes('bsc cs')) matchKey = 'bsc_cs_it';
      else if (streamNorm.includes('mbbs') || streamNorm.includes('medicine')) matchKey = 'mbbs';
      else if (streamNorm.includes('bds') || streamNorm.includes('dental')) matchKey = 'bds';
      else if (streamNorm.includes('pharmacy') || streamNorm.includes('b.pharm')) matchKey = 'bpharm';
      else if (streamNorm.includes('b.com') || streamNorm.includes('commerce') || streamNorm.includes('accounting')) matchKey = 'bcom';
      else if (streamNorm.includes('bba') || streamNorm.includes('management')) matchKey = 'bba_bms';
      else if (streamNorm.includes('mba')) matchKey = 'mba';
      else if (streamNorm.includes('m.tech') || streamNorm.includes('m.e')) matchKey = 'mtech_me';
      else if (streamNorm.includes('law') || streamNorm.includes('llb')) matchKey = 'law_integrated';
      else if (streamNorm.includes('design') || streamNorm.includes('b.des') || streamNorm.includes('architecture')) matchKey = 'bdes_barch';
      else if (streamNorm.includes('humanities') || streamNorm.includes('ba ') || streamNorm.includes('psychology') || streamNorm.includes('economics')) matchKey = 'ba_humanities';
    }

    const specs = matchKey ? (DISCIPLINE_SPECIALIZATIONS_MAP[matchKey] || []) : [];
    
    if (specs.length === 0) {
      const allSpecs: { value: string; label: string }[] = [];
      const seen = new Set<string>();
      Object.values(DISCIPLINE_SPECIALIZATIONS_MAP).forEach((list) => {
        list.forEach((item) => {
          if (!seen.has(item.value)) {
            seen.add(item.value);
            allSpecs.push(item);
          }
        });
      });
      return [
        ...allSpecs.map(item => ({
          id: item.value,
          label: item.label,
          category: 'General',
          icon: 'Sparkles',
          description: `Specialization in ${item.label}`,
          accentColor: '#8b5cf6',
          keywords: [item.label.toLowerCase()]
        })),
        OTHER_OPTION
      ];
    }

    return [
      ...specs.map(item => ({
        id: item.value,
        label: item.label,
        category: 'General',
        icon: 'Sparkles',
        description: `Specialization in ${item.label}`,
        accentColor: '#8b5cf6',
        keywords: [item.label.toLowerCase()]
      })),
      OTHER_OPTION
    ];
  };

  const specializationOptions = useMemo(() => {
    return getSpecializationOptionsForStream(education.stream || '');
  }, [education.stream]);

  // Step 2 Validation
  const isStepValid = useMemo(() => {
    if (!education.level) return false;
    if (isSchool) {
      return !!education.currentClass?.trim();
    }
    if (isIntermediate) {
      return !!education.stream?.trim() && !!education.studyYear?.trim();
    }
    return !!education.stream?.trim() && !!education.studyYear?.trim();
  }, [education.level, education.currentClass, education.stream, education.studyYear, isSchool, isIntermediate]);

  // Dynamic AI Insight Text Resolver
  const dynamicInsightText = useMemo(() => {
    const stream = education.stream || '';
    const normalized = stream.toLowerCase();

    if (isSchool) {
      return "Visionix will recommend foundational learning paths, STEM concepts, stream guidance (MPC vs BiPC vs MEC after Class 10), and career exploration tailored for school students.";
    }

    if (isIntermediate) {
      return "Visionix will personalize entrance exam preparation (JEE, NEET, CA Foundation, CLAT), college admissions, degree roadmaps, and career pathways tailored for your intermediate stream.";
    }

    if (isDiploma) {
      return "Visionix will personalize technical skill roadmaps, lateral entry admissions (B.Tech 2nd year via ECET/LEET), industry certifications, and engineering technician pathways.";
    }

    if (
      normalized.includes('engineering') ||
      normalized.includes('b.tech') ||
      normalized.includes('b.e') ||
      normalized.includes('computer') ||
      normalized.includes('software') ||
      normalized.includes('bca') ||
      normalized.includes('cs')
    ) {
      return "Visionix will recommend software engineering, AI/ML research, cloud architectures, developer portfolios, internships, and industry certifications.";
    }
    if (
      normalized.includes('medicine') ||
      normalized.includes('mbbs') ||
      normalized.includes('dentistry') ||
      normalized.includes('bds') ||
      normalized.includes('pharmacy') ||
      normalized.includes('b.pharm') ||
      normalized.includes('nursing') ||
      normalized.includes('healthcare')
    ) {
      return "Visionix will personalize medical specializations, clinical skills, entrance exams, certifications, and healthcare opportunities.";
    }
    if (
      normalized.includes('commerce') ||
      normalized.includes('b.com') ||
      normalized.includes('finance') ||
      normalized.includes('accounting') ||
      normalized.includes('banking')
    ) {
      return "Visionix will recommend corporate finance, accounting, taxation, CA/CFA pathways, banking, and business analytics careers.";
    }
    if (
      normalized.includes('business') ||
      normalized.includes('bba') ||
      normalized.includes('bms') ||
      normalized.includes('management') ||
      normalized.includes('mba')
    ) {
      return "Visionix will personalize management consulting, marketing strategy, operations, product management, and startup entrepreneurship.";
    }
    if (
      normalized.includes('design') ||
      normalized.includes('b.des') ||
      normalized.includes('b.arch') ||
      normalized.includes('arts') ||
      normalized.includes('humanities') ||
      normalized.includes('animation')
    ) {
      return "Visionix will personalize creative design portfolios, UI/UX systems, architectural pathways, and cultural skill development.";
    }
    if (normalized.includes('law') || normalized.includes('llb') || normalized.includes('legal')) {
      return "Visionix will recommend corporate law, litigation, intellectual property, bar prep, and international legal careers.";
    }

    return "Visionix will personalize career recommendations, learning paths, scholarships, certifications, and high-growth opportunities.";
  }, [education.stream, isSchool, isIntermediate, isDiploma]);

  const benefits = [
    'Recommend Careers',
    'Personalize Learning Paths',
    'Find Scholarships',
    'Suggest Certifications',
    'Recommend Internships',
    'Generate AI Career Guidance'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
    >
      <div>
        <h2 className={styles.title}>Education & Academic Background</h2>
        <p className={styles.subtitle}>
          Tell us about your education so Visionix can personalize your learning and career roadmap.
        </p>
      </div>

      <div className={styles.formGrid}>
        {/* Highest Education Level (Required) */}
        <div className={styles.formGroupFull}>
          <SearchableSelect
            id="educationLevel"
            label="Highest Education Level *"
            options={STEP2_EDUCATION_LEVELS}
            value={education.level || ''}
            onChange={handleLevelChange}
            placeholder="Select education level (e.g. School, Intermediate, Undergraduate)..."
            required={true}
            disabled={isLoading}
            error={errors.level}
            allowOther={false}
          />
        </div>

        {/* ─── 1. Conditional Fields for School (Classes 6–10) ──────────────── */}
        {isSchool && (
          <div className={styles.formGroupFull}>
            <SearchableSelect
              id="currentClass"
              label="Current Class *"
              options={SCHOOL_CLASSES}
              value={education.currentClass || ''}
              onChange={(val) => handleEducationChange('currentClass', val)}
              placeholder="Select class (e.g. Class 10)..."
              required={true}
              disabled={isLoading}
              error={errors.currentClass}
              allowOther={false}
            />
          </div>
        )}

        {/* ─── 2. Conditional Fields for Intermediate / +2 / PUC (Classes 11–12) ─── */}
        {isIntermediate && (
          <>
            {/* Stream / Combination (Required) */}
            <div className={styles.formGroup}>
              <SearchableSelect
                id="academicStream"
                label={courseFieldLabel}
                options={courseOptions}
                value={education.stream || ''}
                onChange={handleStreamChange}
                placeholder="Select stream (e.g. Science: MPC, Commerce: MEC)..."
                required={true}
                disabled={isLoading}
                error={errors.stream}
                allowOther={true}
              />
            </div>

            {/* Class / Year (Required) */}
            <div className={styles.formGroup}>
              <SearchableSelect
                id="studyYear"
                label={yearFieldLabel}
                options={yearOptions}
                value={education.studyYear || ''}
                onChange={(val) => {
                  const rest = (education.courses && education.courses.length > 1) ? education.courses.slice(1) : [];
                  onChange('education', {
                    ...education,
                    studyYear: val,
                    currentClass: val,
                    courses: [
                      {
                        stream: education.stream || '',
                        branchSpecialization: education.branchSpecialization || '',
                        studyYear: val,
                      },
                      ...rest
                    ]
                  });
                }}
                placeholder="Select year (e.g. Class 11, Class 12)..."
                required={true}
                disabled={isLoading}
                error={errors.studyYear}
                allowOther={true}
              />
            </div>
          </>
        )}

        {/* ─── 3. Conditional Fields for Higher Ed (Diploma, Undergraduate, Postgraduate, Doctorate) ─── */}
        {!isSchool && !isIntermediate && education.level && (
          <>
            {/* Course / Degree / Branch (Required) */}
            <div className={styles.formGroup}>
              <SearchableSelect
                id="academicStream"
                label={courseFieldLabel}
                options={courseOptions}
                value={education.stream || ''}
                onChange={handleStreamChange}
                placeholder="Select or search course/degree..."
                required={true}
                disabled={isLoading}
                error={errors.stream}
                allowOther={true}
              />
            </div>

            {/* Study Year (Required) */}
            <div className={styles.formGroup}>
              <SearchableSelect
                id="studyYear"
                label={yearFieldLabel}
                options={yearOptions}
                value={education.studyYear || ''}
                onChange={(val) => handleEducationChange('studyYear', val)}
                placeholder="Select study year..."
                required={true}
                disabled={isLoading}
                error={errors.studyYear}
                allowOther={true}
              />
            </div>

            {/* Specialization (Optional) */}
            {showSpecialization && (
              <div className={styles.formGroupFull}>
                <SearchableSelect
                  id="specialization"
                  label="Specialization (Optional)"
                  options={specializationOptions}
                  value={education.branchSpecialization || ''}
                  onChange={handleSpecializationChange}
                  placeholder="Select or type specialization (e.g. Artificial Intelligence & ML)..."
                  required={false}
                  disabled={isLoading}
                  allowOther={true}
                />
              </div>
            )}

            {/* Additional Courses Section */}
            {showAdditionalCourses && additionalCourses.map((course: any, idx: number) => {
              const specOpts = getSpecializationOptionsForStream(course.stream || '');
              return (
                <div
                  key={idx}
                  className={styles.formGroupFull}
                  style={{
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    marginTop: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#c084fc' }}>
                      Additional Course {idx + 2}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAdditionalCourse(idx)}
                      disabled={isLoading}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#f87171',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem',
                        padding: '4px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>

                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <SearchableSelect
                        id={`additionalStream_${idx}`}
                        label="Course / Degree / Program"
                        options={courseOptions}
                        value={course.stream || ''}
                        onChange={(val) => handleUpdateAdditionalCourse(idx, 'stream', val)}
                        placeholder="Select course..."
                        required={false}
                        disabled={isLoading}
                        allowOther={true}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <SearchableSelect
                        id={`additionalStudyYear_${idx}`}
                        label="Year / Study Year (Optional)"
                        options={yearOptions}
                        value={course.studyYear || ''}
                        onChange={(val) => handleUpdateAdditionalCourse(idx, 'studyYear', val)}
                        placeholder="Select year..."
                        required={false}
                        disabled={isLoading}
                        allowOther={true}
                      />
                    </div>

                    <div className={styles.formGroupFull}>
                      <SearchableSelect
                        id={`additionalSpec_${idx}`}
                        label="Specialization (Optional)"
                        options={specOpts}
                        value={course.branchSpecialization || ''}
                        onChange={(val) => handleUpdateAdditionalCourse(idx, 'branchSpecialization', val)}
                        placeholder="Select specialization..."
                        required={false}
                        disabled={isLoading}
                        allowOther={true}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* + Add Course Button */}
            {showAdditionalCourses && (
              <div className={styles.formGroupFull} style={{ marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={handleAddCourse}
                  disabled={isLoading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    background: 'rgba(139, 92, 246, 0.08)',
                    border: '1px dashed rgba(139, 92, 246, 0.3)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#c084fc',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    width: '100%',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Plus size={16} /> Add Course
                </button>
              </div>
            )}
          </>
        )}

        {/* Premium AI Insight Card */}
        <div className={styles.formGroupFull} style={{ marginTop: '8px' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut', delay: 0.1 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              padding: '20px 24px',
              background: 'rgba(139, 92, 246, 0.02)',
              border: '1px solid rgba(139, 92, 246, 0.15)',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 15px rgba(139, 92, 246, 0.03)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                color: '#c084fc',
                flexShrink: 0
              }}>
                <Sparkles size={16} />
              </div>
              <span style={{ color: '#c084fc', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                AI Insight
              </span>
            </div>

            {/* Sub-header */}
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
              Based on your education, Visionix will:
            </p>

            {/* Benefits */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px 20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              padding: '16px 0'
            }}>
              {benefits.map((benefit, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                  <Check size={14} style={{ color: '#a855f7', strokeWidth: 3 }} />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            {/* Tailored Dynamic Insight Message */}
            <div style={{
              fontSize: '0.825rem',
              color: 'var(--text-primary)',
              background: 'rgba(255, 255, 255, 0.015)',
              padding: '12px 16px',
              borderRadius: '8px',
              borderLeft: '3px solid #a855f7',
              lineHeight: '1.6',
              boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.2)'
            }}>
              {dynamicInsightText}
            </div>
          </motion.div>
        </div>

        {/* Privacy Footer */}
        <div className={styles.formGroupFull}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginTop: '4px',
            textAlign: 'center',
            opacity: 0.8
          }}>
            <span>🔒</span>
            <span>Your information stays private and is only used to personalize your AI career guidance.</span>
          </div>
        </div>
      </div>

      <NavigationButtons
        isFirstStep={false}
        isLastStep={false}
        isLoading={isLoading}
        onNext={onNext}
        onPrev={onPrev}
        nextDisabled={!isStepValid}
      />
    </motion.div>
  );
};
