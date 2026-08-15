import React, { useState } from 'react';
import type {
  IResume,
  IResumeExperience,
  IResumeEducation,
  IResumeProject,
  IResumeCertification,
  IResumeCustomSection,
} from '../../types/resume.types';
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Code,
  Award,
  Trophy,
  Languages,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Layers,
} from 'lucide-react';
import styles from '../../pages/ResumeBuilderPage.module.css';

// ==========================================
// 1. PERSONAL INFORMATION EDITOR
// ==========================================
interface PersonalInfoEditorProps {
  resume: IResume;
  onChange: (updated: IResume) => void;
}

export const PersonalInfoEditor: React.FC<PersonalInfoEditorProps> = ({ resume, onChange }) => {
  const info = resume.personalInfo || { fullName: '', email: '' };

  const updateField = (field: keyof typeof info, val: string) => {
    onChange({
      ...resume,
      personalInfo: {
        ...info,
        [field]: val,
      },
    });
  };

  return (
    <>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <User size={20} /> Personal Information
        </h2>
      </div>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Resume Title</label>
          <input
            className={styles.input}
            type="text"
            value={resume.title || ''}
            onChange={(e) => onChange({ ...resume, title: e.target.value })}
            placeholder="e.g. Software Engineer Resume"
            maxLength={120}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Full Name *</label>
          <input
            className={styles.input}
            type="text"
            value={info.fullName || ''}
            onChange={(e) => updateField('fullName', e.target.value)}
            placeholder="e.g. Alex Morgan"
            maxLength={100}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Email Address *</label>
          <input
            className={styles.input}
            type="email"
            value={info.email || ''}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="alex.morgan@example.com"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Phone Number</label>
          <input
            className={styles.input}
            type="tel"
            value={info.phone || ''}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="+1 (555) 019-2834"
          />
        </div>
        <div className={styles.formGroupFull}>
          <label className={styles.label}>Location / City</label>
          <input
            className={styles.input}
            type="text"
            value={info.location || ''}
            onChange={(e) => updateField('location', e.target.value)}
            placeholder="e.g. San Francisco, CA or London, UK"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>LinkedIn Profile</label>
          <input
            className={styles.input}
            type="url"
            value={info.linkedin || ''}
            onChange={(e) => updateField('linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/alexmorgan"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>GitHub Profile</label>
          <input
            className={styles.input}
            type="url"
            value={info.github || ''}
            onChange={(e) => updateField('github', e.target.value)}
            placeholder="https://github.com/alexmorgan"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Portfolio / Personal Website</label>
          <input
            className={styles.input}
            type="url"
            value={info.portfolio || ''}
            onChange={(e) => updateField('portfolio', e.target.value)}
            placeholder="https://alexmorgan.dev"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Other Link / Blog</label>
          <input
            className={styles.input}
            type="url"
            value={info.website || ''}
            onChange={(e) => updateField('website', e.target.value)}
            placeholder="https://medium.com/@alex"
          />
        </div>
      </div>
    </>
  );
};

// ==========================================
// 2. SUMMARY & TARGET ROLE EDITOR
// ==========================================
interface SummaryEditorProps {
  resume: IResume;
  onChange: (updated: IResume) => void;
}

export const SummaryEditor: React.FC<SummaryEditorProps> = ({ resume, onChange }) => {
  return (
    <>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <FileText size={20} /> Target Role & Professional Summary
        </h2>
      </div>
      <div className={styles.formGrid}>
        <div className={styles.formGroupFull}>
          <label className={styles.label}>Target Career Role</label>
          <input
            className={styles.input}
            type="text"
            value={resume.targetRole || ''}
            onChange={(e) => onChange({ ...resume, targetRole: e.target.value })}
            placeholder="e.g. Full Stack Software Engineer"
            maxLength={120}
          />
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Appears prominently under your name in modern and minimal resume formats.
          </span>
        </div>
        <div className={styles.formGroupFull}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <label className={styles.label}>Professional Summary</label>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              {(resume.summary || '').length} / 3000 chars
            </span>
          </div>
          <textarea
            className={styles.textarea}
            rows={6}
            value={resume.summary || ''}
            onChange={(e) => onChange({ ...resume, summary: e.target.value })}
            placeholder="A compelling 3-5 sentence overview highlighting your core strengths, experience level, technical proficiencies, and career goals..."
            maxLength={3000}
          />
        </div>
      </div>
    </>
  );
};

// ==========================================
// 3. EXPERIENCE EDITOR
// ==========================================
interface ExperienceEditorProps {
  resume: IResume;
  onChange: (updated: IResume) => void;
}

export const ExperienceEditor: React.FC<ExperienceEditorProps> = ({ resume, onChange }) => {
  const experiences = resume.experience || [];
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});
  const [newHighlight, setNewHighlight] = useState<Record<number, string>>({});

  const toggleCollapse = (idx: number) => {
    setCollapsed((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const addExperience = () => {
    const newExp: IResumeExperience = {
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      highlights: [],
    };
    onChange({ ...resume, experience: [newExp, ...experiences] });
  };

  const updateExp = (idx: number, field: keyof IResumeExperience, val: any) => {
    const updated = [...experiences];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange({ ...resume, experience: updated });
  };

  const removeExp = (idx: number) => {
    onChange({ ...resume, experience: experiences.filter((_, i) => i !== idx) });
  };

  const moveExp = (from: number, to: number) => {
    if (to < 0 || to >= experiences.length) return;
    const updated = [...experiences];
    const item = updated.splice(from, 1)[0];
    updated.splice(to, 0, item);
    onChange({ ...resume, experience: updated });
  };

  const addHighlight = (expIdx: number) => {
    const text = (newHighlight[expIdx] || '').trim();
    if (!text) return;
    const currentHighlights = experiences[expIdx].highlights || [];
    updateExp(expIdx, 'highlights', [...currentHighlights, text]);
    setNewHighlight((prev) => ({ ...prev, [expIdx]: '' }));
  };

  const removeHighlight = (expIdx: number, hIdx: number) => {
    const currentHighlights = experiences[expIdx].highlights || [];
    updateExp(
      expIdx,
      'highlights',
      currentHighlights.filter((_, i) => i !== hIdx)
    );
  };

  return (
    <>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <Briefcase size={20} /> Work Experience ({experiences.length})
        </h2>
        <button className={styles.btnSecondary} onClick={addExperience}>
          <Plus size={14} /> Add Position
        </button>
      </div>

      <div className={styles.itemList}>
        {experiences.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            No work experience added yet. Click &quot;Add Position&quot; to begin.
          </p>
        ) : (
          experiences.map((exp, idx) => (
            <div key={idx} className={styles.itemCard}>
              <div className={styles.itemCardHeader}>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                  onClick={() => toggleCollapse(idx)}
                >
                  {collapsed[idx] ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                  <h4 className={styles.itemCardTitle}>
                    {exp.position || 'Position'} {exp.company ? `@ ${exp.company}` : ''}
                  </h4>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    className={styles.btnSecondary}
                    style={{ padding: '4px 8px' }}
                    onClick={() => moveExp(idx, idx - 1)}
                    disabled={idx === 0}
                    title="Move up"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    className={styles.btnSecondary}
                    style={{ padding: '4px 8px' }}
                    onClick={() => moveExp(idx, idx + 1)}
                    disabled={idx === experiences.length - 1}
                    title="Move down"
                  >
                    <ChevronDown size={14} />
                  </button>
                  <button
                    className={styles.btnDanger}
                    style={{ padding: '4px 8px' }}
                    onClick={() => removeExp(idx)}
                    title="Delete position"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {!collapsed[idx] && (
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Company Name *</label>
                    <input
                      className={styles.input}
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExp(idx, 'company', e.target.value)}
                      placeholder="e.g. Google, Stripe, Local Startup"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Position / Title *</label>
                    <input
                      className={styles.input}
                      type="text"
                      value={exp.position}
                      onChange={(e) => updateExp(idx, 'position', e.target.value)}
                      placeholder="e.g. Software Engineer"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Location</label>
                    <input
                      className={styles.input}
                      type="text"
                      value={exp.location || ''}
                      onChange={(e) => updateExp(idx, 'location', e.target.value)}
                      placeholder="e.g. Remote / New York, NY"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div style={{ flex: 1 }}>
                        <label className={styles.label}>Start Date</label>
                        <input
                          className={styles.input}
                          type="text"
                          value={exp.startDate || ''}
                          onChange={(e) => updateExp(idx, 'startDate', e.target.value)}
                          placeholder="e.g. Jun 2022"
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label className={styles.label}>End Date</label>
                        <input
                          className={styles.input}
                          type="text"
                          value={exp.endDate || ''}
                          onChange={(e) => updateExp(idx, 'endDate', e.target.value)}
                          placeholder="e.g. Present"
                          disabled={exp.current}
                        />
                      </div>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', marginTop: '6px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={exp.current || false}
                        onChange={(e) => {
                          updateExp(idx, 'current', e.target.checked);
                          if (e.target.checked) updateExp(idx, 'endDate', 'Present');
                        }}
                      />
                      I currently work here
                    </label>
                  </div>
                  <div className={styles.formGroupFull}>
                    <label className={styles.label}>Overview / Description</label>
                    <textarea
                      className={styles.textarea}
                      rows={3}
                      value={exp.description || ''}
                      onChange={(e) => updateExp(idx, 'description', e.target.value)}
                      placeholder="High-level summary of your team, scope of work, and impact..."
                    />
                  </div>

                  {/* Bulleted Highlights */}
                  <div className={styles.formGroupFull}>
                    <label className={styles.label}>Key Achievements / Bullet Points</label>
                    {(exp.highlights || []).map((h, hIdx) => (
                      <div key={hIdx} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ color: '#818cf8', fontWeight: 'bold' }}>•</span>
                        <input
                          className={styles.input}
                          style={{ flex: 1 }}
                          type="text"
                          value={h}
                          onChange={(e) => {
                            const updatedH = [...(exp.highlights || [])];
                            updatedH[hIdx] = e.target.value;
                            updateExp(idx, 'highlights', updatedH);
                          }}
                        />
                        <button
                          className={styles.btnDanger}
                          style={{ padding: '6px 10px' }}
                          onClick={() => removeHighlight(idx, hIdx)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                      <input
                        className={styles.input}
                        style={{ flex: 1 }}
                        type="text"
                        value={newHighlight[idx] || ''}
                        onChange={(e) => setNewHighlight({ ...newHighlight, [idx]: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addHighlight(idx);
                          }
                        }}
                        placeholder="Add bullet achievement (e.g. Scaled database queries reducing latency by 45%)..."
                      />
                      <button className={styles.btnSecondary} onClick={() => addHighlight(idx)}>
                        Add Bullet
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
};

// ==========================================
// 4. EDUCATION EDITOR
// ==========================================
interface EducationEditorProps {
  resume: IResume;
  onChange: (updated: IResume) => void;
}

export const EducationEditor: React.FC<EducationEditorProps> = ({ resume, onChange }) => {
  const education = resume.education || [];

  const addEducation = () => {
    const newEdu: IResumeEducation = {
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      current: false,
      grade: '',
      description: '',
    };
    onChange({ ...resume, education: [newEdu, ...education] });
  };

  const updateEdu = (idx: number, field: keyof IResumeEducation, val: any) => {
    const updated = [...education];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange({ ...resume, education: updated });
  };

  const removeEdu = (idx: number) => {
    onChange({ ...resume, education: education.filter((_, i) => i !== idx) });
  };

  return (
    <>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <GraduationCap size={20} /> Education ({education.length})
        </h2>
        <button className={styles.btnSecondary} onClick={addEducation}>
          <Plus size={14} /> Add Degree / School
        </button>
      </div>

      <div className={styles.itemList}>
        {education.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            No education records added. Click &quot;Add Degree / School&quot; above.
          </p>
        ) : (
          education.map((edu, idx) => (
            <div key={idx} className={styles.itemCard}>
              <div className={styles.itemCardHeader}>
                <h4 className={styles.itemCardTitle}>
                  {edu.degree || 'Degree'} {edu.institution ? `— ${edu.institution}` : ''}
                </h4>
                <button
                  className={styles.btnDanger}
                  style={{ padding: '4px 8px' }}
                  onClick={() => removeEdu(idx)}
                >
                  <Trash2 size={13} />
                </button>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Institution / University *</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEdu(idx, 'institution', e.target.value)}
                    placeholder="e.g. Stanford University"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Degree / Qualification *</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEdu(idx, 'degree', e.target.value)}
                    placeholder="e.g. Bachelor of Science"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Field of Study / Major</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={edu.fieldOfStudy || ''}
                    onChange={(e) => updateEdu(idx, 'fieldOfStudy', e.target.value)}
                    placeholder="e.g. Computer Science & AI"
                  />
                </div>
                <div className={styles.formGroup}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <label className={styles.label}>Graduation Year</label>
                      <input
                        className={styles.input}
                        type="text"
                        value={edu.endDate || ''}
                        onChange={(e) => updateEdu(idx, 'endDate', e.target.value)}
                        placeholder="e.g. 2025"
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className={styles.label}>Grade / CGPA</label>
                      <input
                        className={styles.input}
                        type="text"
                        value={edu.grade || ''}
                        onChange={(e) => updateEdu(idx, 'grade', e.target.value)}
                        placeholder="e.g. 3.8 / 4.0"
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.formGroupFull}>
                  <label className={styles.label}>Activities, Honors & Coursework</label>
                  <textarea
                    className={styles.textarea}
                    rows={2}
                    value={edu.description || ''}
                    onChange={(e) => updateEdu(idx, 'description', e.target.value)}
                    placeholder="Relevant coursework: Data Structures, Distributed Systems, Machine Learning..."
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

// ==========================================
// 5. PROJECTS EDITOR
// ==========================================
interface ProjectsEditorProps {
  resume: IResume;
  onChange: (updated: IResume) => void;
}

export const ProjectsEditor: React.FC<ProjectsEditorProps> = ({ resume, onChange }) => {
  const projects = resume.projects || [];
  const [newTech, setNewTech] = useState<Record<number, string>>({});

  const addProject = () => {
    const newProj: IResumeProject = {
      name: '',
      description: '',
      technologies: [],
      link: '',
      github: '',
      highlights: [],
    };
    onChange({ ...resume, projects: [newProj, ...projects] });
  };

  const updateProj = (idx: number, field: keyof IResumeProject, val: any) => {
    const updated = [...projects];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange({ ...resume, projects: updated });
  };

  const removeProj = (idx: number) => {
    onChange({ ...resume, projects: projects.filter((_, i) => i !== idx) });
  };

  const addTechTag = (projIdx: number) => {
    const tag = (newTech[projIdx] || '').trim();
    if (!tag) return;
    const currentTags = projects[projIdx].technologies || [];
    if (!currentTags.includes(tag)) {
      updateProj(projIdx, 'technologies', [...currentTags, tag]);
    }
    setNewTech((prev) => ({ ...prev, [projIdx]: '' }));
  };

  const removeTechTag = (projIdx: number, tag: string) => {
    const currentTags = projects[projIdx].technologies || [];
    updateProj(
      projIdx,
      'technologies',
      currentTags.filter((t) => t !== tag)
    );
  };

  return (
    <>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <FolderGit2 size={20} /> Projects ({projects.length})
        </h2>
        <button className={styles.btnSecondary} onClick={addProject}>
          <Plus size={14} /> Add Project
        </button>
      </div>

      <div className={styles.itemList}>
        {projects.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            No projects added yet. Click &quot;Add Project&quot; to showcase your portfolio work.
          </p>
        ) : (
          projects.map((proj, idx) => (
            <div key={idx} className={styles.itemCard}>
              <div className={styles.itemCardHeader}>
                <h4 className={styles.itemCardTitle}>{proj.name || 'Project Name'}</h4>
                <button
                  className={styles.btnDanger}
                  style={{ padding: '4px 8px' }}
                  onClick={() => removeProj(idx)}
                >
                  <Trash2 size={13} />
                </button>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Project Name *</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={proj.name}
                    onChange={(e) => updateProj(idx, 'name', e.target.value)}
                    placeholder="e.g. Visionix Career Portal"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Live Demo URL</label>
                  <input
                    className={styles.input}
                    type="url"
                    value={proj.link || ''}
                    onChange={(e) => updateProj(idx, 'link', e.target.value)}
                    placeholder="https://visionix.app"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>GitHub / Repository URL</label>
                  <input
                    className={styles.input}
                    type="url"
                    value={proj.github || ''}
                    onChange={(e) => updateProj(idx, 'github', e.target.value)}
                    placeholder="https://github.com/user/project"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Technologies Used</label>
                  <div className={styles.chipGroup} style={{ marginBottom: '6px' }}>
                    {(proj.technologies || []).map((t, tIdx) => (
                      <span key={tIdx} className={styles.skillChip}>
                        {t}
                        <button
                          className={styles.chipRemoveBtn}
                          onClick={() => removeTechTag(idx, t)}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input
                      className={styles.skillAddInput}
                      type="text"
                      value={newTech[idx] || ''}
                      onChange={(e) => setNewTech({ ...newTech, [idx]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTechTag(idx);
                        }
                      }}
                      placeholder="Add tag (React, Node, etc.)"
                    />
                    <button className={styles.skillAddBtn} onClick={() => addTechTag(idx)}>
                      Add
                    </button>
                  </div>
                </div>
                <div className={styles.formGroupFull}>
                  <label className={styles.label}>Project Description</label>
                  <textarea
                    className={styles.textarea}
                    rows={3}
                    value={proj.description || ''}
                    onChange={(e) => updateProj(idx, 'description', e.target.value)}
                    placeholder="Architected and built a career guidance web app serving 10,000+ students..."
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

// ==========================================
// 6. SKILLS EDITOR (WITH PHASE 12 VERIFIED INTEGRATION)
// ==========================================
interface SkillsEditorProps {
  resume: IResume;
  verifiedSkillsList: string[];
  onChange: (updated: IResume) => void;
}

export const SkillsEditor: React.FC<SkillsEditorProps> = ({
  resume,
  verifiedSkillsList = [],
  onChange,
}) => {
  const skills = resume.skills || { technical: [], soft: [], tools: [] };
  const [techInput, setTechInput] = useState('');
  const [softInput, setSoftInput] = useState('');
  const [toolInput, setToolInput] = useState('');

  const isVerified = (skillName: string) => {
    return verifiedSkillsList.some(
      (vs) => vs.toLowerCase() === skillName.toLowerCase() || skillName.toLowerCase().includes(vs.toLowerCase())
    );
  };

  const addSkill = (category: 'technical' | 'soft' | 'tools', value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const current = skills[category] || [];
    if (!current.includes(trimmed)) {
      onChange({
        ...resume,
        skills: {
          ...skills,
          [category]: [...current, trimmed],
        },
      });
    }
    if (category === 'technical') setTechInput('');
    if (category === 'soft') setSoftInput('');
    if (category === 'tools') setToolInput('');
  };

  const removeSkill = (category: 'technical' | 'soft' | 'tools', skillName: string) => {
    const current = skills[category] || [];
    onChange({
      ...resume,
      skills: {
        ...skills,
        [category]: current.filter((s) => s !== skillName),
      },
    });
  };

  return (
    <>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <Code size={20} /> Skills & Proficiencies
        </h2>
      </div>

      <div className={styles.skillsContainer}>
        {/* Phase 12 Verified Skills Summary Banner */}
        {verifiedSkillsList.length > 0 && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} style={{ color: '#10b981' }} />
              <strong style={{ color: '#6ee7b7', fontSize: '0.88rem' }}>
                Phase 12 Assessment-Verified Skills ({verifiedSkillsList.length})
              </strong>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#d1fae5', margin: 0 }}>
              These competencies are certified through your completed milestone assessments. Click any to quickly add to your technical skills:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
              {verifiedSkillsList.map((vs, idx) => {
                const isAlreadyIn = (skills.technical || []).includes(vs);
                return (
                  <button
                    key={idx}
                    onClick={() => !isAlreadyIn && addSkill('technical', vs)}
                    disabled={isAlreadyIn}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      background: isAlreadyIn ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      color: isAlreadyIn ? '#6ee7b7' : '#f3f4f6',
                      cursor: isAlreadyIn ? 'default' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    ✓ {vs} {isAlreadyIn ? '(Added)' : '+ Add'}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Technical Skills */}
        <div style={{ marginTop: '8px' }}>
          <label className={styles.label}>Technical Skills ({skills.technical?.length || 0})</label>
          <div className={styles.chipGroup}>
            {(skills.technical || []).map((s, idx) => {
              const verified = isVerified(s);
              return (
                <span
                  key={idx}
                  className={verified ? styles.verifiedSkillChip : styles.skillChip}
                  title={verified ? 'Certified via Milestone Assessment' : 'Self-reported Skill'}
                >
                  {s} {verified && '✓'}
                  <button
                    className={styles.chipRemoveBtn}
                    onClick={() => removeSkill('technical', s)}
                  >
                    ✕
                  </button>
                </span>
              );
            })}
          </div>
          <div className={styles.skillAddRow}>
            <input
              className={styles.skillAddInput}
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill('technical', techInput);
                }
              }}
              placeholder="e.g. TypeScript, Python, Next.js, GraphQL..."
            />
            <button className={styles.skillAddBtn} onClick={() => addSkill('technical', techInput)}>
              Add Skill
            </button>
          </div>
        </div>

        {/* Tools & Platforms */}
        <div style={{ marginTop: '16px' }}>
          <label className={styles.label}>Tools & Platforms ({skills.tools?.length || 0})</label>
          <div className={styles.chipGroup}>
            {(skills.tools || []).map((t, idx) => (
              <span key={idx} className={styles.skillChip}>
                {t}
                <button className={styles.chipRemoveBtn} onClick={() => removeSkill('tools', t)}>
                  ✕
                </button>
              </span>
            ))}
          </div>
          <div className={styles.skillAddRow}>
            <input
              className={styles.skillAddInput}
              type="text"
              value={toolInput}
              onChange={(e) => setToolInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill('tools', toolInput);
                }
              }}
              placeholder="e.g. Docker, Git, AWS, Figma, Postman..."
            />
            <button className={styles.skillAddBtn} onClick={() => addSkill('tools', toolInput)}>
              Add Tool
            </button>
          </div>
        </div>

        {/* Soft Skills */}
        <div style={{ marginTop: '16px' }}>
          <label className={styles.label}>Professional & Soft Skills ({skills.soft?.length || 0})</label>
          <div className={styles.chipGroup}>
            {(skills.soft || []).map((s, idx) => (
              <span key={idx} className={styles.skillChip}>
                {s}
                <button className={styles.chipRemoveBtn} onClick={() => removeSkill('soft', s)}>
                  ✕
                </button>
              </span>
            ))}
          </div>
          <div className={styles.skillAddRow}>
            <input
              className={styles.skillAddInput}
              type="text"
              value={softInput}
              onChange={(e) => setSoftInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill('soft', softInput);
                }
              }}
              placeholder="e.g. Cross-functional Leadership, Problem Solving..."
            />
            <button className={styles.skillAddBtn} onClick={() => addSkill('soft', softInput)}>
              Add Soft Skill
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ==========================================
// 7. CERTIFICATIONS EDITOR
// ==========================================
interface CertificationsEditorProps {
  resume: IResume;
  onChange: (updated: IResume) => void;
}

export const CertificationsEditor: React.FC<CertificationsEditorProps> = ({ resume, onChange }) => {
  const certs = resume.certifications || [];

  const addCert = () => {
    const newCert: IResumeCertification = {
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      url: '',
    };
    onChange({ ...resume, certifications: [newCert, ...certs] });
  };

  const updateCert = (idx: number, field: keyof IResumeCertification, val: string) => {
    const updated = [...certs];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange({ ...resume, certifications: updated });
  };

  const removeCert = (idx: number) => {
    onChange({ ...resume, certifications: certs.filter((_, i) => i !== idx) });
  };

  return (
    <>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <Award size={20} /> Certifications ({certs.length})
        </h2>
        <button className={styles.btnSecondary} onClick={addCert}>
          <Plus size={14} /> Add Certification
        </button>
      </div>

      <div className={styles.itemList}>
        {certs.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            No certifications added yet. Click &quot;Add Certification&quot; above.
          </p>
        ) : (
          certs.map((cert, idx) => (
            <div key={idx} className={styles.itemCard}>
              <div className={styles.itemCardHeader}>
                <h4 className={styles.itemCardTitle}>{cert.name || 'Certification Name'}</h4>
                <button
                  className={styles.btnDanger}
                  style={{ padding: '4px 8px' }}
                  onClick={() => removeCert(idx)}
                >
                  <Trash2 size={13} />
                </button>
              </div>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Certification Name *</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={cert.name}
                    onChange={(e) => updateCert(idx, 'name', e.target.value)}
                    placeholder="e.g. AWS Certified Solutions Architect"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Issuing Organization *</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => updateCert(idx, 'issuer', e.target.value)}
                    placeholder="e.g. Amazon Web Services"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Issue Date</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={cert.issueDate || ''}
                    onChange={(e) => updateCert(idx, 'issueDate', e.target.value)}
                    placeholder="e.g. Oct 2023"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Verification URL / ID</label>
                  <input
                    className={styles.input}
                    type="url"
                    value={cert.url || ''}
                    onChange={(e) => updateCert(idx, 'url', e.target.value)}
                    placeholder="https://credly.com/..."
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

// ==========================================
// 8. ACHIEVEMENTS & LANGUAGES EDITOR
// ==========================================
interface AdditionalSectionsEditorProps {
  resume: IResume;
  onChange: (updated: IResume) => void;
}

export const AdditionalSectionsEditor: React.FC<AdditionalSectionsEditorProps> = ({
  resume,
  onChange,
}) => {
  const achievements = resume.achievements || [];
  const languages = resume.languages || [];
  const customSections = resume.customSections || [];

  const [newAch, setNewAch] = useState('');
  const [newLangName, setNewLangName] = useState('');
  const [newLangProf, setNewLangProf] = useState('Fluent');

  const addAchievement = () => {
    if (!newAch.trim()) return;
    onChange({ ...resume, achievements: [...achievements, newAch.trim()] });
    setNewAch('');
  };

  const removeAchievement = (idx: number) => {
    onChange({ ...resume, achievements: achievements.filter((_, i) => i !== idx) });
  };

  const addLanguage = () => {
    if (!newLangName.trim()) return;
    onChange({
      ...resume,
      languages: [...languages, { name: newLangName.trim(), proficiency: newLangProf }],
    });
    setNewLangName('');
  };

  const removeLanguage = (idx: number) => {
    onChange({ ...resume, languages: languages.filter((_, i) => i !== idx) });
  };

  const addCustomSection = () => {
    const newSection: IResumeCustomSection = {
      heading: 'Leadership & Volunteering',
      content: '',
    };
    onChange({ ...resume, customSections: [...customSections, newSection] });
  };

  const updateCustomSection = (idx: number, field: keyof IResumeCustomSection, val: string) => {
    const updated = [...customSections];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange({ ...resume, customSections: updated });
  };

  const removeCustomSection = (idx: number) => {
    onChange({ ...resume, customSections: customSections.filter((_, i) => i !== idx) });
  };

  return (
    <>
      {/* Achievements */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <Trophy size={20} /> Key Achievements ({achievements.length})
        </h2>
      </div>
      <div className={styles.itemList} style={{ marginBottom: '28px' }}>
        {achievements.map((ach, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ color: '#10b981', fontWeight: 'bold' }}>★</span>
            <input
              className={styles.input}
              style={{ flex: 1 }}
              type="text"
              value={ach}
              onChange={(e) => {
                const updated = [...achievements];
                updated[idx] = e.target.value;
                onChange({ ...resume, achievements: updated });
              }}
            />
            <button className={styles.btnDanger} style={{ padding: '6px 10px' }} onClick={() => removeAchievement(idx)}>
              ✕
            </button>
          </div>
        ))}
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            className={styles.input}
            style={{ flex: 1 }}
            type="text"
            value={newAch}
            onChange={(e) => setNewAch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addAchievement();
              }
            }}
            placeholder="Add key achievement (e.g. 1st Place at National Hackathon 2024)..."
          />
          <button className={styles.btnSecondary} onClick={addAchievement}>
            Add
          </button>
        </div>
      </div>

      {/* Languages */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <Languages size={20} /> Languages ({languages.length})
        </h2>
      </div>
      <div className={styles.itemList} style={{ marginBottom: '28px' }}>
        <div className={styles.chipGroup}>
          {languages.map((l, idx) => (
            <span key={idx} className={styles.skillChip}>
              {l.name} ({l.proficiency || 'Fluent'})
              <button className={styles.chipRemoveBtn} onClick={() => removeLanguage(idx)}>
                ✕
              </button>
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            className={styles.skillAddInput}
            style={{ flex: 2 }}
            type="text"
            value={newLangName}
            onChange={(e) => setNewLangName(e.target.value)}
            placeholder="e.g. English, Spanish, Mandarin"
          />
          <select
            className={styles.selectInput}
            style={{ flex: 1 }}
            value={newLangProf}
            onChange={(e) => setNewLangProf(e.target.value)}
          >
            <option value="Native">Native</option>
            <option value="Fluent">Fluent</option>
            <option value="Professional">Professional</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Basic">Basic</option>
          </select>
          <button className={styles.skillAddBtn} onClick={addLanguage}>
            Add Language
          </button>
        </div>
      </div>

      {/* Custom Sections */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <Layers size={20} /> Custom Sections ({customSections.length})
        </h2>
        <button className={styles.btnSecondary} onClick={addCustomSection}>
          <Plus size={14} /> Add Custom Section
        </button>
      </div>
      <div className={styles.itemList}>
        {customSections.map((cs, idx) => (
          <div key={idx} className={styles.itemCard}>
            <div className={styles.itemCardHeader}>
              <input
                className={styles.input}
                style={{ fontWeight: 700, width: '70%' }}
                type="text"
                value={cs.heading}
                onChange={(e) => updateCustomSection(idx, 'heading', e.target.value)}
                placeholder="Section Title"
              />
              <button
                className={styles.btnDanger}
                style={{ padding: '4px 8px' }}
                onClick={() => removeCustomSection(idx)}
              >
                <Trash2 size={13} />
              </button>
            </div>
            <textarea
              className={styles.textarea}
              rows={4}
              value={cs.content}
              onChange={(e) => updateCustomSection(idx, 'content', e.target.value)}
              placeholder="Enter your custom section details..."
            />
          </div>
        ))}
      </div>
    </>
  );
};
