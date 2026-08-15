import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { ResumeService } from '../services/resume.service';
import { usePersonalization } from '../hooks/usePersonalization';
import type { IResume } from '../types/resume.types';
import { ResumePreview } from '../components/resume/ResumePreview';
import { ResumeAnalysis } from '../components/resume/ResumeAnalysis';
import {
  PersonalInfoEditor,
  SummaryEditor,
  ExperienceEditor,
  EducationEditor,
  ProjectsEditor,
  SkillsEditor,
  CertificationsEditor,
  AdditionalSectionsEditor,
} from '../components/resume/ResumeSectionEditors';
import {
  FileText,
  Save,
  Plus,
  Trash2,
  Sparkles,
  User,
  GraduationCap,
  Briefcase,
  Code,
  FolderGit2,
  Award,
  MoreHorizontal,
  Printer,
  Eye,
  Edit3,
  Columns,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LayoutTemplate,
  ArrowLeft,
  Wand2,
} from 'lucide-react';
import styles from './ResumeBuilderPage.module.css';

type SectionKey =
  | 'personal'
  | 'summary'
  | 'experience'
  | 'education'
  | 'projects'
  | 'skills'
  | 'certifications'
  | 'additional';

type ViewMode = 'split' | 'edit' | 'document_view' | 'analysis';

export const ResumeBuilderPage: React.FC = () => {
  const { personalizationContext } = usePersonalization();

  // Document states
  const [resumes, setResumes] = useState<IResume[]>([]);
  const [activeResume, setActiveResume] = useState<IResume | null>(null);
  const [lastSavedResume, setLastSavedResume] = useState<string>('');

  // UI Navigation states
  const [activeSection, setActiveSection] = useState<SectionKey>('personal');
  const [viewMode, setViewMode] = useState<ViewMode>('split');

  // Async states
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [importing, setImporting] = useState<boolean>(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Extract verified skills from personalization context (Phase 12 single source of truth)
  const verifiedSkillsList = useMemo(() => {
    const rawList = personalizationContext?.skills?.verifiedSkills || [];
    return rawList.map((vs: any) => (typeof vs === 'string' ? vs : vs.name)).filter(Boolean);
  }, [personalizationContext]);

  // Dirty state tracking
  const isDirty = useMemo(() => {
    if (!activeResume || !lastSavedResume) return false;
    return JSON.stringify(activeResume) !== lastSavedResume;
  }, [activeResume, lastSavedResume]);

  const loadResumes = useCallback(async () => {
    try {
      setLoading(true);
      const list = await ResumeService.getResumes();
      setResumes(list);
      if (list.length > 0) {
        setActiveResume(list[0]);
        setLastSavedResume(JSON.stringify(list[0]));
      } else {
        setActiveResume(null);
        setLastSavedResume('');
      }
    } catch (err: any) {
      console.error('Error loading resumes:', err);
      setAlert({
        type: 'error',
        message: 'Failed to load resumes from the server.',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResumes();
  }, [loadResumes]);

  // Switch active resume
  const handleSelectResume = (resumeId: string) => {
    if (isDirty) {
      if (!window.confirm('You have unsaved changes on the current resume. Switch anyway?')) {
        return;
      }
    }
    const found = resumes.find((r) => r._id === resumeId);
    if (found) {
      setActiveResume(found);
      setLastSavedResume(JSON.stringify(found));
      setAlert(null);
    }
  };

  // Create new resume
  const handleCreateResume = async (prefillFromProfile = false) => {
    try {
      setSaving(true);
      setAlert(null);
      const created = await ResumeService.createResume(
        {
          title: prefillFromProfile ? 'Tailored Career Resume' : 'New Resume',
          templateId: 'modern',
        },
        prefillFromProfile
      );
      setResumes((prev) => [created, ...prev]);
      setActiveResume(created);
      setLastSavedResume(JSON.stringify(created));
      setActiveSection('personal');
      setAlert({
        type: 'success',
        message: prefillFromProfile
          ? 'New resume generated using your verified profile data.'
          : 'New blank resume created.',
      });
    } catch (err: any) {
      console.error('Error creating resume:', err);
      setAlert({
        type: 'error',
        message: 'Failed to create resume.',
      });
    } finally {
      setSaving(false);
    }
  };

  // Save changes
  const handleSave = async () => {
    if (!activeResume || !activeResume._id) return;
    try {
      setSaving(true);
      setAlert(null);
      const updated = await ResumeService.updateResume(activeResume._id, activeResume);
      setActiveResume(updated);
      setLastSavedResume(JSON.stringify(updated));
      setResumes((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
      setAlert({
        type: 'success',
        message: 'All changes saved successfully.',
      });
    } catch (err: any) {
      console.error('Error saving resume:', err);
      setAlert({
        type: 'error',
        message: 'Failed to save changes. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  // Delete resume
  const handleDelete = async () => {
    if (!activeResume || !activeResume._id) return;
    const confirmName = window.confirm(`Are you sure you want to delete "${activeResume.title || 'Untitled Resume'}"?`);
    if (!confirmName) return;

    try {
      setSaving(true);
      await ResumeService.deleteResume(activeResume._id);
      const remaining = resumes.filter((r) => r._id !== activeResume._id);
      setResumes(remaining);
      if (remaining.length > 0) {
        setActiveResume(remaining[0]);
        setLastSavedResume(JSON.stringify(remaining[0]));
      } else {
        setActiveResume(null);
        setLastSavedResume('');
      }
      setAlert({
        type: 'success',
        message: 'Resume deleted.',
      });
    } catch (err: any) {
      console.error('Error deleting resume:', err);
      setAlert({
        type: 'error',
        message: 'Failed to delete resume.',
      });
    } finally {
      setSaving(false);
    }
  };

  // Sync / Import profile info into current resume
  const handleSyncProfile = async () => {
    if (!activeResume) return;
    try {
      setImporting(true);
      const prefill = await ResumeService.getProfilePrefill();
      if (prefill) {
        setActiveResume((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            title: prev.title || prefill.title || 'My Resume',
            targetRole: prev.targetRole || prefill.targetRole || '',
            personalInfo: {
              ...prefill.personalInfo,
              ...prev.personalInfo,
            },
            summary: prev.summary || prefill.summary || '',
            education: prev.education?.length ? prev.education : prefill.education || [],
            experience: prev.experience?.length ? prev.experience : prefill.experience || [],
            skills: {
              technical: Array.from(
                new Set([...(prev.skills?.technical || []), ...(prefill.skills?.technical || [])])
              ),
              soft: Array.from(new Set([...(prev.skills?.soft || []), ...(prefill.skills?.soft || [])])),
              tools: prev.skills?.tools || [],
            },
          };
        });
        setAlert({
          type: 'success',
          message: 'Profile contact details, verified skills, and education synced to resume.',
        });
      }
    } catch (err: any) {
      console.error('Error syncing profile:', err);
      setAlert({
        type: 'error',
        message: 'Failed to sync profile information.',
      });
    } finally {
      setImporting(false);
    }
  };

  // Template switch
  const handleTemplateChange = (templateId: 'modern' | 'classic' | 'minimal') => {
    if (!activeResume) return;
    setActiveResume({
      ...activeResume,
      templateId,
    });
  };

  // Print / PDF trigger
  const handlePrint = () => {
    window.print();
  };

  // Handle AI analysis suggested change application
  const handleApplyAnalysisChange = (updatedResume: IResume, message: string) => {
    setActiveResume(updatedResume);
    setAlert({
      type: 'success',
      message: `${message} Click "Save Resume" to persist changes.`,
    });
  };

  // ============================================================
  // 1. DEDICATED FULLSCREEN "VIEW RESUME" MODE (Phase 13.3)
  // ============================================================
  if (viewMode === 'document_view' && activeResume) {
    return (
      <div className={styles.viewResumeWorkspace}>
        {/* Sleek Top Toolbar (Automatically hidden on @media print) */}
        <div className={styles.viewResumeToolbar}>
          <div className={styles.viewResumeToolbarLeft}>
            <button
              className={styles.btnSecondary}
              onClick={() => setViewMode('split')}
              title="Return to resume editor"
            >
              <ArrowLeft size={16} /> Back to Editor
            </button>
            <div className={styles.viewResumeDocTitle}>
              <FileText size={18} style={{ color: '#818cf8' }} />
              <span>{activeResume.title || 'Untitled Resume'}</span>
              <span className={isDirty ? styles.dirtyBadge : styles.savedBadge}>
                {isDirty ? '● Unsaved Changes' : '✓ Saved'}
              </span>
            </div>
          </div>

          <div className={styles.viewResumeToolbarRight}>
            <div className={styles.templateGroup}>
              <button
                className={`${styles.templateBtn} ${
                  (activeResume.templateId || 'modern') === 'modern' ? styles.templateBtnActive : ''
                }`}
                onClick={() => handleTemplateChange('modern')}
              >
                Modern
              </button>
              <button
                className={`${styles.templateBtn} ${
                  activeResume.templateId === 'classic' ? styles.templateBtnActive : ''
                }`}
                onClick={() => handleTemplateChange('classic')}
              >
                Classic
              </button>
              <button
                className={`${styles.templateBtn} ${
                  activeResume.templateId === 'minimal' ? styles.templateBtnActive : ''
                }`}
                onClick={() => handleTemplateChange('minimal')}
              >
                Minimal
              </button>
            </div>

            {isDirty && (
              <button className={styles.btnPrimary} onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 size={15} className={styles.spinner} /> : <Save size={15} />}
                Save
              </button>
            )}

            <button
              className={styles.btnPrimary}
              onClick={handlePrint}
              style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
              title="Open browser print dialog to save as PDF or print"
            >
              <Printer size={16} />
              Print / Save as PDF
            </button>
          </div>
        </div>

        {/* Centered Document View Container */}
        <div className={styles.viewResumeDocumentContainer}>
          <ResumePreview
            resume={activeResume}
            templateId={activeResume.templateId || 'modern'}
          />
        </div>
      </div>
    );
  }

  // ============================================================
  // 2. DASHBOARD BUILDER & EDITOR WORKSPACE
  // ============================================================
  return (
    <DashboardLayout>
      <div className="ambient-noise" />
      <div
        className="glow-accent-primary"
        style={{ width: '500px', height: '500px', top: '10%', left: '15%', opacity: 0.2 }}
      />

      <div className={styles.container}>
        {/* Main Header */}
        <div className={styles.header}>
          <div className={styles.headerTitleWrapper}>
            <h1>
              <FileText size={26} />
              Resume Builder
              <span className={styles.badge}>Phase 13.4</span>
              {activeResume && (
                <span className={isDirty ? styles.dirtyBadge : styles.savedBadge}>
                  {isDirty ? '● Unsaved Changes' : '✓ Saved'}
                </span>
              )}
            </h1>
            <p className={styles.subtitle}>
              Design, analyze with Gemini AI, and print ATS-friendly professional resumes with real-time live preview.
            </p>
          </div>

          <div className={styles.headerActions}>
            {/* View Mode Controls */}
            <div className={styles.viewModeSelector}>
              <button
                className={`${styles.viewModeBtn} ${viewMode === 'edit' ? styles.viewModeBtnActive : ''}`}
                onClick={() => setViewMode('edit')}
                title="Editor only"
              >
                <Edit3 size={15} /> Edit
              </button>
              <button
                className={`${styles.viewModeBtn} ${viewMode === 'split' ? styles.viewModeBtnActive : ''}`}
                onClick={() => setViewMode('split')}
                title="Split Side-by-Side"
              >
                <Columns size={15} /> Split
              </button>
              <button
                className={`${styles.viewModeBtn} ${viewMode === 'analysis' ? styles.viewModeBtnActive : ''}`}
                onClick={() => setViewMode('analysis')}
                title="AI Resume Analysis & Optimization"
              >
                <Wand2 size={15} /> AI Analysis
              </button>
            </div>

            {activeResume && (
              <>
                <button
                  className={styles.btnSecondary}
                  onClick={() => setViewMode('document_view')}
                  title="Open full-screen distraction-free resume document"
                  style={{ borderColor: 'rgba(99, 102, 241, 0.4)', color: '#c7d2fe' }}
                >
                  <Eye size={16} />
                  View Resume
                </button>
                <button
                  className={styles.btnSecondary}
                  onClick={handlePrint}
                  title="Print or export as PDF"
                >
                  <Printer size={16} />
                  Print / PDF
                </button>
                <button
                  className={styles.btnSecondary}
                  onClick={handleSyncProfile}
                  disabled={importing || saving}
                  title="Import details and verified skills from profile"
                >
                  <Sparkles size={16} />
                  {importing ? 'Syncing...' : 'Sync Profile'}
                </button>
                <button
                  className={styles.btnDanger}
                  onClick={handleDelete}
                  disabled={saving}
                  title="Delete active resume"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  className={styles.btnPrimary}
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? <Loader2 size={16} className={styles.spinner} /> : <Save size={16} />}
                  Save Resume
                </button>
              </>
            )}
          </div>
        </div>

        {/* Template Selector Bar (When in Edit or Split mode) */}
        {activeResume && viewMode !== 'analysis' && (
          <div className={styles.templateBar}>
            <span className={styles.templateLabel}>
              <LayoutTemplate size={16} /> Resume Template:
            </span>
            <div className={styles.templateGroup}>
              <button
                className={`${styles.templateBtn} ${
                  (activeResume.templateId || 'modern') === 'modern' ? styles.templateBtnActive : ''
                }`}
                onClick={() => handleTemplateChange('modern')}
              >
                Modern Clean
              </button>
              <button
                className={`${styles.templateBtn} ${
                  activeResume.templateId === 'classic' ? styles.templateBtnActive : ''
                }`}
                onClick={() => handleTemplateChange('classic')}
              >
                Classic Executive
              </button>
              <button
                className={`${styles.templateBtn} ${
                  activeResume.templateId === 'minimal' ? styles.templateBtnActive : ''
                }`}
                onClick={() => handleTemplateChange('minimal')}
              >
                Minimal Tech
              </button>
            </div>
          </div>
        )}

        {/* Alert Feedback */}
        {alert && (
          <div className={`${styles.alert} ${alert.type === 'success' ? styles.alertSuccess : styles.alertError}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {alert.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{alert.message}</span>
            </div>
            <button
              onClick={() => setAlert(null)}
              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '1rem' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Content Area */}
        {loading ? (
          <div className={styles.loadingWrapper}>
            <Loader2 size={36} className={styles.spinner} />
            <p>Loading your resume documents...</p>
          </div>
        ) : !activeResume ? (
          /* Empty State */
          <div className={styles.emptyCard}>
            <div className={styles.emptyIconWrapper}>
              <FileText size={32} />
            </div>
            <h2 className={styles.emptyTitle}>No Resumes Found</h2>
            <p className={styles.emptyText}>
              Create your first career resume. Choose to automatically generate a tailored template prefilled with your
              verified skills, education, and career aspirations, or start fresh from a blank document.
            </p>
            <div className={styles.emptyActions}>
              <button
                className={styles.btnPrimary}
                onClick={() => handleCreateResume(true)}
                disabled={saving}
              >
                <Sparkles size={16} />
                Generate from My Profile
              </button>
              <button
                className={styles.btnSecondary}
                onClick={() => handleCreateResume(false)}
                disabled={saving}
              >
                <Plus size={16} />
                Create Blank Resume
              </button>
            </div>
          </div>
        ) : viewMode === 'analysis' ? (
          /* 3. AI Resume Analysis Workspace */
          <ResumeAnalysis
            resume={activeResume}
            onApplyChange={handleApplyAnalysisChange}
          />
        ) : (
          /* 4. Main Multi-Column Workspace (Split or Edit) */
          <div className={viewMode === 'split' ? styles.builderGridSplit : styles.builderGridSingle}>
            {/* Left Section Navigator */}
            <div className={styles.sidebarNav}>
              {resumes.length > 1 && (
                <div className={styles.resumeSelectWrapper}>
                  <label className={styles.resumeSelectLabel}>Active Resume</label>
                  <select
                    className={styles.selectInput}
                    value={activeResume._id}
                    onChange={(e) => handleSelectResume(e.target.value)}
                  >
                    {resumes.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.title || 'Untitled Resume'}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                className={`${styles.navItem} ${activeSection === 'personal' ? styles.navItemActive : ''}`}
                onClick={() => setActiveSection('personal')}
              >
                <User size={16} />
                Personal Info
              </button>

              <button
                className={`${styles.navItem} ${activeSection === 'summary' ? styles.navItemActive : ''}`}
                onClick={() => setActiveSection('summary')}
              >
                <FileText size={16} />
                Summary & Role
              </button>

              <button
                className={`${styles.navItem} ${activeSection === 'experience' ? styles.navItemActive : ''}`}
                onClick={() => setActiveSection('experience')}
              >
                <Briefcase size={16} />
                Experience ({activeResume.experience?.length || 0})
              </button>

              <button
                className={`${styles.navItem} ${activeSection === 'education' ? styles.navItemActive : ''}`}
                onClick={() => setActiveSection('education')}
              >
                <GraduationCap size={16} />
                Education ({activeResume.education?.length || 0})
              </button>

              <button
                className={`${styles.navItem} ${activeSection === 'projects' ? styles.navItemActive : ''}`}
                onClick={() => setActiveSection('projects')}
              >
                <FolderGit2 size={16} />
                Projects ({activeResume.projects?.length || 0})
              </button>

              <button
                className={`${styles.navItem} ${activeSection === 'skills' ? styles.navItemActive : ''}`}
                onClick={() => setActiveSection('skills')}
              >
                <Code size={16} />
                Skills ({((activeResume.skills?.technical?.length || 0) + (activeResume.skills?.soft?.length || 0))})
              </button>

              <button
                className={`${styles.navItem} ${activeSection === 'certifications' ? styles.navItemActive : ''}`}
                onClick={() => setActiveSection('certifications')}
              >
                <Award size={16} />
                Certifications ({activeResume.certifications?.length || 0})
              </button>

              <button
                className={`${styles.navItem} ${activeSection === 'additional' ? styles.navItemActive : ''}`}
                onClick={() => setActiveSection('additional')}
              >
                <MoreHorizontal size={16} />
                More Sections
              </button>

              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button
                  className={styles.btnSecondary}
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => handleCreateResume(false)}
                  disabled={saving}
                >
                  <Plus size={15} />
                  New Resume
                </button>
              </div>
            </div>

            {/* Middle Editor Form Panel */}
            <div className={styles.formPanel}>
              {activeSection === 'personal' && (
                <PersonalInfoEditor resume={activeResume} onChange={setActiveResume} />
              )}
              {activeSection === 'summary' && (
                <SummaryEditor resume={activeResume} onChange={setActiveResume} />
              )}
              {activeSection === 'experience' && (
                <ExperienceEditor resume={activeResume} onChange={setActiveResume} />
              )}
              {activeSection === 'education' && (
                <EducationEditor resume={activeResume} onChange={setActiveResume} />
              )}
              {activeSection === 'projects' && (
                <ProjectsEditor resume={activeResume} onChange={setActiveResume} />
              )}
              {activeSection === 'skills' && (
                <SkillsEditor
                  resume={activeResume}
                  verifiedSkillsList={verifiedSkillsList}
                  onChange={setActiveResume}
                />
              )}
              {activeSection === 'certifications' && (
                <CertificationsEditor resume={activeResume} onChange={setActiveResume} />
              )}
              {activeSection === 'additional' && (
                <AdditionalSectionsEditor resume={activeResume} onChange={setActiveResume} />
              )}
            </div>

            {/* Live Preview Panel (In Split mode) */}
            {viewMode === 'split' && (
              <div className={styles.previewPanel}>
                <div className={styles.previewPanelHeader}>
                  <span className={styles.previewPanelTitle}>
                    <Eye size={16} /> Live Document Preview
                  </span>
                  <button
                    className={styles.btnSecondary}
                    style={{ padding: '3px 8px', fontSize: '0.78rem' }}
                    onClick={() => setViewMode('document_view')}
                  >
                    Expand View ↗
                  </button>
                </div>
                <ResumePreview
                  resume={activeResume}
                  templateId={activeResume.templateId || 'modern'}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ResumeBuilderPage;
