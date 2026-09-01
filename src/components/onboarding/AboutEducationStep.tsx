import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check, Plus, Trash2 } from 'lucide-react';
import {
  STEP2_EDUCATION_LEVELS,
  STEP2_ACADEMIC_FIELDS
} from '../../constants/onboarding.constants';
import { SearchableSelect } from './SearchableSelect';
import { NavigationButtons } from './NavigationButtons';
import styles from '../../pages/OnboardingPage.module.css';
import { OTHER_OPTION } from '../../constants/onboarding.constants';

const DISCIPLINE_SPECIALIZATIONS_MAP: Record<string, { value: string; label: string }[]> = {
  civil_eng: [
    { value: 'structural_engineering', label: 'Structural Engineering' },
    { value: 'transportation_engineering', label: 'Transportation Engineering' },
    { value: 'geotechnical_engineering', label: 'Geotechnical Engineering' },
    { value: 'environmental_engineering', label: 'Environmental Engineering' },
    { value: 'construction_management', label: 'Construction Management' },
  ],
  engineering: [
    { value: 'artificial_intelligence', label: 'Artificial Intelligence & ML' },
    { value: 'data_science', label: 'Data Science & Analytics' },
    { value: 'cyber_security', label: 'Cyber Security & Cryptography' },
    { value: 'software_engineering', label: 'Software Development' },
    { value: 'cloud_computing', label: 'Cloud Computing & DevOps' },
  ],
  medicine: [
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'neurology', label: 'Neurology' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'oncology', label: 'Oncology' },
    { value: 'general_surgery', label: 'General Surgery' },
  ],
  business: [
    { value: 'corporate_finance', label: 'Corporate Finance' },
    { value: 'investment_banking', label: 'Investment Banking' },
    { value: 'accounting_audit', label: 'Accounting & Audit' },
    { value: 'marketing_strategy', label: 'Marketing Strategy' },
    { value: 'operations_management', label: 'Operations Management' },
  ],
  management: [
    { value: 'corporate_finance', label: 'Corporate Finance' },
    { value: 'investment_banking', label: 'Investment Banking' },
    { value: 'marketing_strategy', label: 'Marketing Strategy' },
    { value: 'human_resources_mgmt', label: 'Human Resources' },
  ],
  commerce: [
    { value: 'accounting_audit', label: 'Accounting & Audit' },
    { value: 'taxation', label: 'Taxation & Compliance' },
    { value: 'banking_finance', label: 'Banking & Insurance' },
  ],
  finance: [
    { value: 'corporate_finance', label: 'Corporate Finance' },
    { value: 'investment_banking', label: 'Investment Banking' },
    { value: 'portfolio_management', label: 'Portfolio Management' },
  ],
  accounting: [
    { value: 'accounting_audit', label: 'Accounting & Audit' },
    { value: 'taxation', label: 'Taxation & Compliance' },
  ],
  fine_arts: [
    { value: 'ui_ux_design', label: 'UI/UX Design' },
    { value: 'graphic_design', label: 'Graphic Design' },
    { value: 'fashion_design', label: 'Fashion Design' },
    { value: 'interior_design', label: 'Interior Design' },
    { value: 'animation_vfx', label: 'Animation & VFX' },
  ],
};

const SCHOOL_CLASSES = [
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12'
];

const STUDY_YEARS = [
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
  const isSchool = education.level?.toLowerCase() === 'school' || education.level === 'School';

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
    const isNowSchool = val?.toLowerCase() === 'school' || val === 'School';
    onChange('education', {
      ...education,
      level: val,
      currentClass: isNowSchool ? (education.currentClass || '') : '',
      stream: isNowSchool ? '' : (education.stream || ''),
      branchSpecialization: isNowSchool ? '' : (education.branchSpecialization || ''),
      studyYear: isNowSchool ? '' : (education.studyYear || ''),
      courses: isNowSchool ? [] : (education.courses || []),
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
    // Reset downstream interests and career goals
    onChange('interests', {
      careerInterests: [],
      favouriteSubjects: [],
      technologies: [],
      industries: [],
    });
    onChange('careerGoals', {
      dreamCareer: '',
      preferredIndustries: [],
      salaryGoal: '',
      careerObjectives: '',
      preferredJobType: '',
      preferredLocation: '',
      longTermAspirations: '',
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
    // Reset downstream interests and career goals
    onChange('interests', {
      careerInterests: [],
      favouriteSubjects: [],
      technologies: [],
      industries: [],
    });
    onChange('careerGoals', {
      dreamCareer: '',
      preferredIndustries: [],
      salaryGoal: '',
      careerObjectives: '',
      preferredJobType: '',
      preferredLocation: '',
      longTermAspirations: '',
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
    const specs = DISCIPLINE_SPECIALIZATIONS_MAP[streamName] || [];
    
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
  const isStepValid = isSchool
    ? (!!education.level && !!education.currentClass?.trim())
    : (!!education.level && !!education.stream && !!education.studyYear?.trim());

  // Dynamic AI Insight Text Resolver
  const dynamicInsightText = useMemo(() => {
    const stream = education.stream || '';
    const normalized = stream.toLowerCase();

    if (isSchool) {
      return "Visionix will recommend foundational learning paths, STEM concepts, academic streams, and future career explorations tailored for school students.";
    }

    if (
      normalized.includes('engineering') ||
      normalized.includes('mechanical') ||
      normalized.includes('civil') ||
      normalized.includes('electrical') ||
      normalized.includes('electronics') ||
      normalized.includes('aerospace') ||
      normalized.includes('robotics') ||
      normalized.includes('automobile')
    ) {
      return "Visionix will recommend engineering careers, certifications, internships, and industry skills.";
    }
    if (
      normalized.includes('computer science') ||
      normalized.includes('information technology') ||
      normalized.includes('artificial intelligence') ||
      normalized.includes('data science') ||
      normalized.includes('cyber security') ||
      normalized.includes('cloud') ||
      normalized.includes('blockchain') ||
      normalized.includes('game') ||
      normalized.includes('ui ux') ||
      normalized.includes('software')
    ) {
      return "Visionix will recommend software engineering, AI/ML research, cloud architectures, certifications, and developer portfolios.";
    }
    if (
      normalized.includes('medicine') ||
      normalized.includes('healthcare') ||
      normalized.includes('dentistry') ||
      normalized.includes('nursing') ||
      normalized.includes('pharmacy') ||
      normalized.includes('veterinary') ||
      normalized.includes('psychology') ||
      normalized.includes('biology') ||
      normalized.includes('biotechnology')
    ) {
      return "Visionix will personalize medical specializations, entrance exams, certifications, and healthcare opportunities.";
    }
    if (
      normalized.includes('commerce') ||
      normalized.includes('finance') ||
      normalized.includes('accounting') ||
      normalized.includes('economics') ||
      normalized.includes('banking')
    ) {
      return "Visionix will recommend finance, accounting, banking, investment and business career paths.";
    }
    if (
      normalized.includes('business') ||
      normalized.includes('management') ||
      normalized.includes('mba') ||
      normalized.includes('marketing') ||
      normalized.includes('human resources') ||
      normalized.includes('entrepreneur')
    ) {
      return "Visionix will personalize entrepreneurship, leadership, consulting, and management pathways.";
    }
    if (
      normalized.includes('arts') ||
      normalized.includes('humanities') ||
      normalized.includes('design') ||
      normalized.includes('fashion') ||
      normalized.includes('animation') ||
      normalized.includes('film') ||
      normalized.includes('music') ||
      normalized.includes('literature') ||
      normalized.includes('languages') ||
      normalized.includes('history') ||
      normalized.includes('political science') ||
      normalized.includes('geography')
    ) {
      return "Visionix will personalize creative careers, higher education opportunities, galleries, portfolios, and skill development.";
    }
    if (normalized.includes('law') || normalized.includes('legal')) {
      return "Visionix will recommend legal career paths, corporate law, certifications, bar prep, and higher studies.";
    }

    return "Visionix will personalize career recommendations, learning paths, scholarships, certifications, and opportunities.";
  }, [education.stream, isSchool]);

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
          Tell us about your education so Visionix can personalize your learning journey.
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
            placeholder="Select education level..."
            required={true}
            disabled={isLoading}
            error={errors.level}
            allowOther={false}
          />
        </div>

        {/* Conditional Fields for School */}
        {isSchool && (
          <div className={styles.formGroupFull}>
            <SearchableSelect
              id="currentClass"
              label="Class *"
              options={SCHOOL_CLASSES}
              value={education.currentClass || ''}
              onChange={(val) => handleEducationChange('currentClass', val)}
              placeholder="Select class (e.g. Class 10)..."
              required={true}
              disabled={isLoading}
              error={errors.currentClass}
              allowOther={true}
            />
          </div>
        )}

        {/* Conditional Fields for Higher Education (non-School) */}
        {!isSchool && education.level && (
          <>
            {/* Course / Degree / Program (Required) */}
            <div className={styles.formGroup}>
              <SearchableSelect
                id="academicStream"
                label="Course / Degree / Program *"
                options={STEP2_ACADEMIC_FIELDS}
                value={education.stream || ''}
                onChange={handleStreamChange}
                placeholder="Select or search course/degree..."
                required={true}
                disabled={isLoading}
                error={errors.stream}
                allowOther={true}
              />
            </div>

            {/* Year / Current Study Year (Required) */}
            <div className={styles.formGroup}>
              <SearchableSelect
                id="studyYear"
                label="Year / Current Study Year *"
                options={STUDY_YEARS}
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
            <div className={styles.formGroupFull}>
              <SearchableSelect
                id="specialization"
                label="Specialization (Optional)"
                options={specializationOptions}
                value={education.branchSpecialization || ''}
                onChange={handleSpecializationChange}
                placeholder="Select or type specialization..."
                required={false}
                disabled={isLoading}
                allowOther={true}
              />
            </div>

            {/* Additional Courses Section */}
            {additionalCourses.map((course: any, idx: number) => {
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
                        options={STEP2_ACADEMIC_FIELDS}
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
                        options={STUDY_YEARS}
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
