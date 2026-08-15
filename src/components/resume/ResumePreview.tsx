import React from 'react';
import type { IResume } from '../../types/resume.types';
import styles from './ResumePreview.module.css';

interface ResumePreviewProps {
  resume: IResume;
  templateId?: 'modern' | 'classic' | 'minimal';
}

// Clean URL formatter for resume display (e.g. "linkedin.com/in/username")
const formatDisplayUrl = (url?: string) => {
  if (!url) return '';
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
};

// Date range formatter
const formatDateRange = (start?: string, end?: string, current?: boolean) => {
  if (!start && !end && !current) return '';
  if (start && current) return `${start} – Present`;
  if (start && end) return `${start} – ${end}`;
  if (end) return end;
  if (start) return start;
  return '';
};

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  resume,
  templateId = 'modern',
}) => {
  const activeTemplate = resume.templateId || templateId || 'modern';
  const {
    personalInfo,
    targetRole,
    summary,
    experience = [],
    education = [],
    projects = [],
    skills = { technical: [], soft: [], tools: [] },
    certifications = [],
    achievements = [],
    languages = [],
    customSections = [],
  } = resume;

  // Filter non-empty contact items
  const contactItems: string[] = [];
  if (personalInfo?.email) contactItems.push(personalInfo.email);
  if (personalInfo?.phone) contactItems.push(personalInfo.phone);
  if (personalInfo?.location) contactItems.push(personalInfo.location);
  if (personalInfo?.linkedin) contactItems.push(formatDisplayUrl(personalInfo.linkedin));
  if (personalInfo?.github) contactItems.push(formatDisplayUrl(personalInfo.github));
  if (personalInfo?.portfolio) contactItems.push(formatDisplayUrl(personalInfo.portfolio));
  if (personalInfo?.website) contactItems.push(formatDisplayUrl(personalInfo.website));

  // Non-empty checks
  const hasSummary = Boolean(summary && summary.trim());
  const hasExperience = experience.length > 0;
  const hasEducation = education.length > 0;
  const hasProjects = projects.length > 0;
  const hasSkills =
    (skills.technical && skills.technical.length > 0) ||
    (skills.tools && skills.tools.length > 0) ||
    (skills.soft && skills.soft.length > 0);
  const hasCertifications = certifications.length > 0;
  const hasAchievements = achievements.length > 0;
  const hasLanguages = languages.length > 0;
  const hasCustomSections = customSections.length > 0;

  // ==========================================
  // RENDER TEMPLATE: MODERN
  // ==========================================
  const renderModern = () => (
    <div className={styles.modernLayout}>
      {/* Header */}
      <header className={styles.modernHeader}>
        <h1 className={styles.modernName}>{personalInfo?.fullName || 'Your Name'}</h1>
        {targetRole && <div className={styles.modernTargetRole}>{targetRole}</div>}
        {contactItems.length > 0 && (
          <div className={styles.modernContactRow}>
            {contactItems.map((item, idx) => (
              <React.Fragment key={idx}>
                <span>{item}</span>
                {idx < contactItems.length - 1 && <span className={styles.modernContactSeparator}>•</span>}
              </React.Fragment>
            ))}
          </div>
        )}
      </header>

      {/* Summary */}
      {hasSummary && (
        <section className={styles.modernSection}>
          <h2 className={styles.modernSectionTitle}>Professional Summary</h2>
          <p className={styles.modernSummaryText}>{summary}</p>
        </section>
      )}

      {/* Experience */}
      {hasExperience && (
        <section className={styles.modernSection}>
          <h2 className={styles.modernSectionTitle}>Work Experience</h2>
          {experience.map((exp, idx) => (
            <div key={idx} className={styles.modernItem}>
              <div className={styles.modernItemHeader}>
                <div>
                  <h3 className={styles.modernItemTitle}>
                    {exp.position} {exp.company ? `— ${exp.company}` : ''}
                  </h3>
                  {exp.location && <span className={styles.modernItemSubtitle}>{exp.location}</span>}
                </div>
                <span className={styles.modernItemDate}>
                  {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                </span>
              </div>
              {exp.description && <p className={styles.modernItemDesc}>{exp.description}</p>}
              {exp.highlights && exp.highlights.length > 0 && (
                <ul className={styles.modernHighlightsList}>
                  {exp.highlights.map((h, hIdx) => (
                    <li key={hIdx}>{h}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {hasEducation && (
        <section className={styles.modernSection}>
          <h2 className={styles.modernSectionTitle}>Education</h2>
          {education.map((edu, idx) => (
            <div key={idx} className={styles.modernItem}>
              <div className={styles.modernItemHeader}>
                <div>
                  <h3 className={styles.modernItemTitle}>
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                  </h3>
                  <span className={styles.modernItemSubtitle}>{edu.institution}</span>
                </div>
                <span className={styles.modernItemDate}>
                  {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                </span>
              </div>
              {edu.grade && <p className={styles.modernItemDesc}>Grade / CGPA: {edu.grade}</p>}
              {edu.description && <p className={styles.modernItemDesc}>{edu.description}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {hasProjects && (
        <section className={styles.modernSection}>
          <h2 className={styles.modernSectionTitle}>Projects</h2>
          {projects.map((proj, idx) => (
            <div key={idx} className={styles.modernItem}>
              <div className={styles.modernItemHeader}>
                <h3 className={styles.modernItemTitle}>{proj.name}</h3>
                <div style={{ display: 'flex', gap: '8px', fontSize: '0.78rem' }}>
                  {proj.link && <span>{formatDisplayUrl(proj.link)}</span>}
                  {proj.link && proj.github && <span>•</span>}
                  {proj.github && <span>{formatDisplayUrl(proj.github)}</span>}
                </div>
              </div>
              {proj.technologies && proj.technologies.length > 0 && (
                <p className={styles.modernItemDesc}>
                  <strong>Technologies:</strong> {proj.technologies.join(', ')}
                </p>
              )}
              {proj.description && <p className={styles.modernItemDesc}>{proj.description}</p>}
              {proj.highlights && proj.highlights.length > 0 && (
                <ul className={styles.modernHighlightsList}>
                  {proj.highlights.map((h, hIdx) => (
                    <li key={hIdx}>{h}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {hasSkills && (
        <section className={styles.modernSection}>
          <h2 className={styles.modernSectionTitle}>Skills & Proficiencies</h2>
          <div className={styles.modernSkillsBlock}>
            {skills.technical && skills.technical.length > 0 && (
              <div>
                <span className={styles.modernSkillLabel}>Technical Skills:</span>
                {skills.technical.join(', ')}
              </div>
            )}
            {skills.tools && skills.tools.length > 0 && (
              <div>
                <span className={styles.modernSkillLabel}>Tools & Platforms:</span>
                {skills.tools.join(', ')}
              </div>
            )}
            {skills.soft && skills.soft.length > 0 && (
              <div>
                <span className={styles.modernSkillLabel}>Professional Skills:</span>
                {skills.soft.join(', ')}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Certifications */}
      {hasCertifications && (
        <section className={styles.modernSection}>
          <h2 className={styles.modernSectionTitle}>Certifications</h2>
          {certifications.map((cert, idx) => (
            <div key={idx} className={styles.modernItem}>
              <div className={styles.modernItemHeader}>
                <h3 className={styles.modernItemTitle}>
                  {cert.name} — <span style={{ fontWeight: 500, color: '#475569' }}>{cert.issuer}</span>
                </h3>
                <span className={styles.modernItemDate}>{cert.issueDate || ''}</span>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Achievements */}
      {hasAchievements && (
        <section className={styles.modernSection}>
          <h2 className={styles.modernSectionTitle}>Key Achievements</h2>
          <ul className={styles.modernHighlightsList}>
            {achievements.map((ach, idx) => (
              <li key={idx}>{ach}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Languages */}
      {hasLanguages && (
        <section className={styles.modernSection}>
          <h2 className={styles.modernSectionTitle}>Languages</h2>
          <p className={styles.modernSummaryText}>
            {languages.map((l) => `${l.name} (${l.proficiency || 'Fluent'})`).join(' • ')}
          </p>
        </section>
      )}

      {/* Custom Sections */}
      {hasCustomSections &&
        customSections.map((cs, idx) => (
          <section key={idx} className={styles.modernSection}>
            <h2 className={styles.modernSectionTitle}>{cs.heading}</h2>
            <p className={styles.modernSummaryText} style={{ whiteSpace: 'pre-line' }}>
              {cs.content}
            </p>
          </section>
        ))}
    </div>
  );

  // ==========================================
  // RENDER TEMPLATE: CLASSIC
  // ==========================================
  const renderClassic = () => (
    <div className={styles.classicLayout}>
      <header className={styles.classicHeader}>
        <h1 className={styles.classicName}>{personalInfo?.fullName || 'Your Name'}</h1>
        {targetRole && <div className={styles.classicTargetRole}>{targetRole}</div>}
        {contactItems.length > 0 && (
          <div className={styles.classicContactRow}>
            {contactItems.map((item, idx) => (
              <React.Fragment key={idx}>
                <span>{item}</span>
                {idx < contactItems.length - 1 && <span> | </span>}
              </React.Fragment>
            ))}
          </div>
        )}
      </header>

      {hasSummary && (
        <section className={styles.classicSection}>
          <h2 className={styles.classicSectionTitle}>Professional Summary</h2>
          <p className={styles.classicSummaryText}>{summary}</p>
        </section>
      )}

      {hasExperience && (
        <section className={styles.classicSection}>
          <h2 className={styles.classicSectionTitle}>Experience</h2>
          {experience.map((exp, idx) => (
            <div key={idx} className={styles.classicItem}>
              <div className={styles.classicItemHeader}>
                <span className={styles.classicItemTitle}>
                  {exp.position} — {exp.company}
                </span>
                <span className={styles.classicItemDate}>
                  {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                </span>
              </div>
              {exp.location && <div className={styles.classicItemSubtitle}>{exp.location}</div>}
              {exp.description && <p className={styles.classicSummaryText}>{exp.description}</p>}
              {exp.highlights && exp.highlights.length > 0 && (
                <ul className={styles.classicHighlightsList}>
                  {exp.highlights.map((h, hIdx) => (
                    <li key={hIdx}>{h}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {hasEducation && (
        <section className={styles.classicSection}>
          <h2 className={styles.classicSectionTitle}>Education</h2>
          {education.map((edu, idx) => (
            <div key={idx} className={styles.classicItem}>
              <div className={styles.classicItemHeader}>
                <span className={styles.classicItemTitle}>
                  {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                </span>
                <span className={styles.classicItemDate}>
                  {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                </span>
              </div>
              <div className={styles.classicItemSubtitle}>
                {edu.institution} {edu.grade ? `— Grade: ${edu.grade}` : ''}
              </div>
              {edu.description && <p className={styles.classicSummaryText}>{edu.description}</p>}
            </div>
          ))}
        </section>
      )}

      {hasProjects && (
        <section className={styles.classicSection}>
          <h2 className={styles.classicSectionTitle}>Projects</h2>
          {projects.map((proj, idx) => (
            <div key={idx} className={styles.classicItem}>
              <div className={styles.classicItemHeader}>
                <span className={styles.classicItemTitle}>{proj.name}</span>
                {proj.link && <span className={styles.classicItemDate}>{formatDisplayUrl(proj.link)}</span>}
              </div>
              {proj.technologies && proj.technologies.length > 0 && (
                <p className={styles.classicSummaryText}>
                  <strong>Technologies:</strong> {proj.technologies.join(', ')}
                </p>
              )}
              {proj.description && <p className={styles.classicSummaryText}>{proj.description}</p>}
            </div>
          ))}
        </section>
      )}

      {hasSkills && (
        <section className={styles.classicSection}>
          <h2 className={styles.classicSectionTitle}>Skills & Proficiencies</h2>
          <div className={styles.classicSkillsText}>
            {skills.technical && skills.technical.length > 0 && (
              <p style={{ margin: '0 0 3px 0' }}>
                <strong>Technical Skills:</strong> {skills.technical.join(', ')}
              </p>
            )}
            {skills.tools && skills.tools.length > 0 && (
              <p style={{ margin: '0 0 3px 0' }}>
                <strong>Tools & Platforms:</strong> {skills.tools.join(', ')}
              </p>
            )}
            {skills.soft && skills.soft.length > 0 && (
              <p style={{ margin: 0 }}>
                <strong>Professional Skills:</strong> {skills.soft.join(', ')}
              </p>
            )}
          </div>
        </section>
      )}

      {hasCertifications && (
        <section className={styles.classicSection}>
          <h2 className={styles.classicSectionTitle}>Certifications</h2>
          <ul className={styles.classicHighlightsList}>
            {certifications.map((cert, idx) => (
              <li key={idx}>
                <strong>{cert.name}</strong> — {cert.issuer} {cert.issueDate ? `(${cert.issueDate})` : ''}
              </li>
            ))}
          </ul>
        </section>
      )}

      {hasAchievements && (
        <section className={styles.classicSection}>
          <h2 className={styles.classicSectionTitle}>Achievements</h2>
          <ul className={styles.classicHighlightsList}>
            {achievements.map((ach, idx) => (
              <li key={idx}>{ach}</li>
            ))}
          </ul>
        </section>
      )}

      {hasLanguages && (
        <section className={styles.classicSection}>
          <h2 className={styles.classicSectionTitle}>Languages</h2>
          <p className={styles.classicSummaryText}>
            {languages.map((l) => `${l.name} (${l.proficiency || 'Fluent'})`).join(' • ')}
          </p>
        </section>
      )}

      {hasCustomSections &&
        customSections.map((cs, idx) => (
          <section key={idx} className={styles.classicSection}>
            <h2 className={styles.classicSectionTitle}>{cs.heading}</h2>
            <p className={styles.classicSummaryText} style={{ whiteSpace: 'pre-line' }}>
              {cs.content}
            </p>
          </section>
        ))}
    </div>
  );

  // ==========================================
  // RENDER TEMPLATE: MINIMAL
  // ==========================================
  const renderMinimal = () => (
    <div className={styles.minimalLayout}>
      <header className={styles.minimalHeader}>
        <h1 className={styles.minimalName}>{personalInfo?.fullName || 'Your Name'}</h1>
        {targetRole && <div className={styles.minimalTargetRole}>{targetRole}</div>}
        {contactItems.length > 0 && (
          <div className={styles.minimalContactRow}>
            {contactItems.map((item, idx) => (
              <React.Fragment key={idx}>
                <span>{item}</span>
                {idx < contactItems.length - 1 && <span> / </span>}
              </React.Fragment>
            ))}
          </div>
        )}
      </header>

      {hasSummary && (
        <section className={styles.minimalSection}>
          <h2 className={styles.minimalSectionTitle}>Summary</h2>
          <p className={styles.minimalItemDesc}>{summary}</p>
        </section>
      )}

      {hasExperience && (
        <section className={styles.minimalSection}>
          <h2 className={styles.minimalSectionTitle}>Experience</h2>
          {experience.map((exp, idx) => (
            <div key={idx} className={styles.minimalItem}>
              <div className={styles.minimalItemHeader}>
                <span className={styles.minimalItemTitle}>
                  {exp.position} @ {exp.company}
                </span>
                <span className={styles.minimalItemDate}>
                  {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                </span>
              </div>
              {exp.location && <div className={styles.minimalItemSubtitle}>{exp.location}</div>}
              {exp.description && <p className={styles.minimalItemDesc}>{exp.description}</p>}
              {exp.highlights && exp.highlights.length > 0 && (
                <ul className={styles.modernHighlightsList}>
                  {exp.highlights.map((h, hIdx) => (
                    <li key={hIdx}>{h}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {hasEducation && (
        <section className={styles.minimalSection}>
          <h2 className={styles.minimalSectionTitle}>Education</h2>
          {education.map((edu, idx) => (
            <div key={idx} className={styles.minimalItem}>
              <div className={styles.minimalItemHeader}>
                <span className={styles.minimalItemTitle}>
                  {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''} — {edu.institution}
                </span>
                <span className={styles.minimalItemDate}>
                  {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                </span>
              </div>
              {edu.description && <p className={styles.minimalItemDesc}>{edu.description}</p>}
            </div>
          ))}
        </section>
      )}

      {hasProjects && (
        <section className={styles.minimalSection}>
          <h2 className={styles.minimalSectionTitle}>Projects</h2>
          {projects.map((proj, idx) => (
            <div key={idx} className={styles.minimalItem}>
              <div className={styles.minimalItemHeader}>
                <span className={styles.minimalItemTitle}>{proj.name}</span>
                {proj.technologies && proj.technologies.length > 0 && (
                  <span className={styles.minimalItemDate}>{proj.technologies.join(', ')}</span>
                )}
              </div>
              {proj.description && <p className={styles.minimalItemDesc}>{proj.description}</p>}
            </div>
          ))}
        </section>
      )}

      {hasSkills && (
        <section className={styles.minimalSection}>
          <h2 className={styles.minimalSectionTitle}>Skills</h2>
          <div className={styles.minimalItemDesc}>
            {skills.technical && skills.technical.length > 0 && (
              <div>
                <strong>Technical: </strong> {skills.technical.join(' • ')}
              </div>
            )}
            {skills.tools && skills.tools.length > 0 && (
              <div>
                <strong>Tools: </strong> {skills.tools.join(' • ')}
              </div>
            )}
            {skills.soft && skills.soft.length > 0 && (
              <div>
                <strong>Professional: </strong> {skills.soft.join(' • ')}
              </div>
            )}
          </div>
        </section>
      )}

      {hasCertifications && (
        <section className={styles.minimalSection}>
          <h2 className={styles.minimalSectionTitle}>Certifications</h2>
          <div className={styles.minimalItemDesc}>
            {certifications.map((c) => `${c.name} (${c.issuer})`).join(' • ')}
          </div>
        </section>
      )}

      {hasAchievements && (
        <section className={styles.minimalSection}>
          <h2 className={styles.minimalSectionTitle}>Achievements</h2>
          <ul className={styles.modernHighlightsList}>
            {achievements.map((ach, idx) => (
              <li key={idx}>{ach}</li>
            ))}
          </ul>
        </section>
      )}

      {hasLanguages && (
        <section className={styles.minimalSection}>
          <h2 className={styles.minimalSectionTitle}>Languages</h2>
          <div className={styles.minimalItemDesc}>
            {languages.map((l) => `${l.name} (${l.proficiency || 'Fluent'})`).join(' • ')}
          </div>
        </section>
      )}

      {hasCustomSections &&
        customSections.map((cs, idx) => (
          <section key={idx} className={styles.minimalSection}>
            <h2 className={styles.minimalSectionTitle}>{cs.heading}</h2>
            <p className={styles.minimalItemDesc} style={{ whiteSpace: 'pre-line' }}>
              {cs.content}
            </p>
          </section>
        ))}
    </div>
  );

  return (
    <div className={styles.previewContainer}>
      <div className={styles.documentSheet} id="visionix-resume-sheet">
        {activeTemplate === 'classic'
          ? renderClassic()
          : activeTemplate === 'minimal'
          ? renderMinimal()
          : renderModern()}
      </div>
    </div>
  );
};
