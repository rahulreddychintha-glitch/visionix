import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { BusinessService } from '../services/business.service';
import { StartupRoadmapApiService } from '../services/startupRoadmap.service';
import { usePersonalization } from '../hooks/usePersonalization';
import type { IBusinessProfile, IBusinessIdea } from '../types/business.types';
import { BusinessHome } from '../components/business/BusinessHome';
import { BusinessProfileSetup } from '../components/business/BusinessProfileSetup';
import { BusinessExplorer } from '../components/business/BusinessExplorer';
import { SavedBusinessIdeas } from '../components/business/SavedBusinessIdeas';
import { BusinessOpportunityExplorer } from '../components/business/BusinessOpportunityExplorer';
import { FounderResources } from '../components/business/FounderResources';
import { StartupRoadmap } from '../components/business/StartupRoadmap';
import { BusinessAssistant } from '../components/business/BusinessAssistant';
import { BusinessIdeaValidation } from '../components/business/BusinessIdeaValidation';
import { PitchGenerator } from '../components/business/PitchGenerator';
import {
  Rocket,
  Lightbulb,
  Compass,
  BookOpen,
  Bookmark,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
} from 'lucide-react';
import styles from './BusinessPage.module.css';

type BusinessTab =
  | 'overview'
  | 'ideas'
  | 'opportunities'
  | 'resources'
  | 'saved'
  | 'roadmap'
  | 'assistant'
  | 'validation'
  | 'pitch';

export const BusinessPage: React.FC = () => {
  const { personalizationContext } = usePersonalization();

  const [activeTab, setActiveTab] = useState<BusinessTab>('overview');
  const [profile, setProfile] = useState<IBusinessProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSetupMode, setIsSetupMode] = useState<boolean>(false);
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Extract real user details & verified skills (strictly Read-Only)
  const userName = useMemo(() => {
    return personalizationContext?.name || 'Founder';
  }, [personalizationContext]);

  const targetRole = useMemo(() => {
    return (
      (personalizationContext?.careerGoals as any)?.targetRole ||
      personalizationContext?.careerGoals?.dreamCareer ||
      'Entrepreneurship & Tech'
    );
  }, [personalizationContext]);

  const discipline = useMemo(() => {
    return personalizationContext?.discipline || 'Technology & Engineering';
  }, [personalizationContext]);

  const verifiedSkills = useMemo(() => {
    const rawList = personalizationContext?.skills?.verifiedSkills || [];
    return rawList.map((vs: any) => (typeof vs === 'string' ? vs : vs.name)).filter(Boolean);
  }, [personalizationContext]);

  const technicalSkills = useMemo(() => {
    return personalizationContext?.skills?.technicalSkills || [];
  }, [personalizationContext]);

  const userIndustries = useMemo(() => {
    return (
      (personalizationContext?.interests as any)?.industries ||
      (personalizationContext?.careerGoals as any)?.preferredIndustries ||
      []
    );
  }, [personalizationContext]);

  // Load business profile data
  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const data = await BusinessService.getBusinessProfile();
      setProfile(data);
    } catch (err) {
      console.warn('Failed to load business profile:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Save profile handler
  const handleSaveProfile = async (updateData: Partial<IBusinessProfile>) => {
    const updated = await BusinessService.updateBusinessProfile(updateData);
    setProfile(updated);
    setIsSetupMode(false);
    setAlert({
      type: 'success',
      message: 'Business profile updated successfully.',
    });
  };

  // Toggle Save Idea
  const handleSaveIdeaToggle = async (ideaId: string) => {
    try {
      const isCurrentlySaved = (profile?.savedBusinessIdeas || []).some((item) => {
        const id = typeof item === 'object' ? item._id : item.toString();
        return id === ideaId;
      });

      let updated: IBusinessProfile;
      if (isCurrentlySaved) {
        updated = await BusinessService.removeSavedBusinessIdea(ideaId);
        setAlert({
          type: 'success',
          message: 'Idea removed from your saved blueprints.',
        });
      } else {
        updated = await BusinessService.saveBusinessIdea(ideaId);
        setAlert({
          type: 'success',
          message: 'Idea saved to your business blueprints.',
        });
      }
      setProfile(updated);
    } catch (err: any) {
      console.error('Failed to toggle save business idea:', err);
      setAlert({
        type: 'error',
        message: err?.response?.data?.message || 'Failed to update saved ideas.',
      });
    }
  };

  // Toggle Save Opportunity
  const handleSaveOpportunityToggle = async (opportunityId: string) => {
    try {
      const isCurrentlySaved = (profile?.savedOpportunities || []).some((item) => {
        const id = typeof item === 'object' ? item._id : item.toString();
        return id === opportunityId;
      });

      let updated: IBusinessProfile;
      if (isCurrentlySaved) {
        updated = await BusinessService.removeSavedBusinessOpportunity(opportunityId);
        setAlert({
          type: 'success',
          message: 'Opportunity removed from your saved list.',
        });
      } else {
        updated = await BusinessService.saveBusinessOpportunity(opportunityId);
        setAlert({
          type: 'success',
          message: 'Opportunity saved to your bookmarks.',
        });
      }
      setProfile(updated);
    } catch (err: any) {
      console.error('Failed to toggle save opportunity:', err);
      setAlert({
        type: 'error',
        message: err?.response?.data?.message || 'Failed to update saved opportunity.',
      });
    }
  };

  // Build Startup from Idea
  const handleBuildStartup = async (idea: IBusinessIdea) => {
    try {
      const roadmap = await StartupRoadmapApiService.generateRoadmap(idea._id);
      setSelectedRoadmapId(roadmap._id);
      setAlert({
        type: 'success',
        message: `Startup roadmap for "${idea.title}" generated successfully!`,
      });
      setActiveTab('roadmap');
    } catch (err: any) {
      console.error('Failed to build startup roadmap from idea:', err);
      setAlert({
        type: 'error',
        message: err?.response?.data?.message || 'Failed to generate startup roadmap.',
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="ambient-noise" />
      <div
        className="glow-accent-primary"
        style={{ width: '500px', height: '500px', top: '10%', right: '10%', opacity: 0.16 }}
      />

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitleWrapper}>
            <h1>
              <Rocket size={26} style={{ color: '#818cf8' }} />
              Business & Startup Hub
              <span className={styles.badge}>Phase 14 Startup Hub</span>
            </h1>
            <p className={styles.subtitle}>
              Discover market opportunities, build step-by-step venture roadmaps, chat with an AI mentor, and generate pitch decks.
            </p>
          </div>
        </div>

        {/* Global Hub Navigation Tabs */}
        {!isSetupMode && (
          <div className={styles.navTabs}>
            <button
              className={`${styles.navTabBtn} ${activeTab === 'overview' ? styles.navTabBtnActive : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <Sparkles size={15} /> Overview & Hub
            </button>
            <button
              className={`${styles.navTabBtn} ${activeTab === 'ideas' ? styles.navTabBtnActive : ''}`}
              onClick={() => setActiveTab('ideas')}
            >
              <Lightbulb size={15} /> Business Ideas
            </button>
            <button
              className={`${styles.navTabBtn} ${activeTab === 'opportunities' ? styles.navTabBtnActive : ''}`}
              onClick={() => setActiveTab('opportunities')}
            >
              <Rocket size={15} /> Opportunities & Grants
            </button>
            <button
              className={`${styles.navTabBtn} ${activeTab === 'resources' ? styles.navTabBtnActive : ''}`}
              onClick={() => setActiveTab('resources')}
            >
              <BookOpen size={15} /> Founder Resources
            </button>
            <button
              className={`${styles.navTabBtn} ${activeTab === 'saved' ? styles.navTabBtnActive : ''}`}
              onClick={() => setActiveTab('saved')}
            >
              <Bookmark size={15} /> Saved Blueprints ({profile?.savedBusinessIdeas?.length || 0})
            </button>
            <button
              className={`${styles.navTabBtn} ${activeTab === 'roadmap' ? styles.navTabBtnActive : ''}`}
              onClick={() => setActiveTab('roadmap')}
            >
              <Compass size={15} /> Startup Roadmap
            </button>
            <button
              className={`${styles.navTabBtn} ${activeTab === 'assistant' ? styles.navTabBtnActive : ''}`}
              onClick={() => setActiveTab('assistant')}
            >
              <Sparkles size={15} /> AI Assistant
            </button>
            <button
              className={`${styles.navTabBtn} ${activeTab === 'validation' ? styles.navTabBtnActive : ''}`}
              onClick={() => setActiveTab('validation')}
            >
              <CheckCircle2 size={15} /> Idea Validation
            </button>
            <button
              className={`${styles.navTabBtn} ${activeTab === 'pitch' ? styles.navTabBtnActive : ''}`}
              onClick={() => setActiveTab('pitch')}
            >
              <Layers size={15} /> Pitch Generator
            </button>
          </div>
        )}

        {/* Alert Notification */}
        {alert && (
          <div className={`${styles.alert} ${alert.type === 'success' ? styles.alertSuccess : styles.alertError}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {alert.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{alert.message}</span>
            </div>
            <button
              onClick={() => setAlert(null)}
              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* View States */}
        {loading ? (
          <div className={styles.loadingWrapper}>
            <Loader2 size={38} className={styles.spinner} />
            <p>Loading your entrepreneurship workspace...</p>
          </div>
        ) : isSetupMode ? (
          <BusinessProfileSetup
            existingProfile={profile}
            onCancel={() => setIsSetupMode(false)}
            onSave={handleSaveProfile}
          />
        ) : activeTab === 'overview' ? (
          <BusinessHome
            profile={profile}
            userName={userName}
            targetRole={targetRole}
            discipline={discipline}
            verifiedSkills={verifiedSkills}
            technicalSkills={technicalSkills}
            onOpenSetup={() => setIsSetupMode(true)}
            onNavigateTab={(tab) => setActiveTab(tab as BusinessTab)}
          />
        ) : activeTab === 'ideas' ? (
          <BusinessExplorer
            profile={profile}
            userSkills={technicalSkills}
            verifiedSkills={verifiedSkills}
            userIndustries={userIndustries}
            onSaveToggle={handleSaveIdeaToggle}
            onBuildStartup={handleBuildStartup}
          />
        ) : activeTab === 'opportunities' ? (
          <BusinessOpportunityExplorer
            profile={profile}
            userSkills={technicalSkills}
            verifiedSkills={verifiedSkills}
            userIndustries={userIndustries}
            onSaveToggle={handleSaveOpportunityToggle}
          />
        ) : activeTab === 'resources' ? (
          <FounderResources />
        ) : activeTab === 'saved' ? (
          <SavedBusinessIdeas
            profile={profile}
            userSkills={technicalSkills}
            verifiedSkills={verifiedSkills}
            userIndustries={userIndustries}
            onRemoveSaved={handleSaveIdeaToggle}
            onExploreClick={() => setActiveTab('ideas')}
            onBuildStartup={handleBuildStartup}
          />
        ) : activeTab === 'roadmap' ? (
          <StartupRoadmap
            onExploreIdeas={() => setActiveTab('ideas')}
            onOpenAssistant={(id) => {
              setSelectedRoadmapId(id);
              setActiveTab('assistant');
            }}
            onOpenValidation={(id) => {
              setSelectedRoadmapId(id);
              setActiveTab('validation');
            }}
            onOpenPitch={(id) => {
              setSelectedRoadmapId(id);
              setActiveTab('pitch');
            }}
          />
        ) : activeTab === 'assistant' ? (
          <BusinessAssistant roadmapId={selectedRoadmapId || undefined} />
        ) : activeTab === 'validation' ? (
          <BusinessIdeaValidation roadmapId={selectedRoadmapId || undefined} />
        ) : activeTab === 'pitch' ? (
          <PitchGenerator roadmapId={selectedRoadmapId || undefined} />
        ) : null}
      </div>
    </DashboardLayout>
  );
};

export default BusinessPage;
