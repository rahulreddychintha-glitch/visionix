import React, { useState } from 'react';
import type { IBusinessIdea, IBusinessProfile } from '../../types/business.types';
import { calculateBusinessIdeaMatch } from '../../utils/businessMatching';
import { BusinessIdeaDetails } from './BusinessIdeaDetails';
import {
  Bookmark,
  Trash2,
  ArrowRight,
  TrendingUp,
  ExternalLink,
} from 'lucide-react';

interface SavedBusinessIdeasProps {
  profile: IBusinessProfile | null;
  userSkills: string[];
  verifiedSkills: string[];
  userIndustries: string[];
  onRemoveSaved: (ideaId: string) => Promise<void>;
  onExploreClick: () => void;
  onBuildStartup?: (idea: IBusinessIdea) => void;
}

export const SavedBusinessIdeas: React.FC<SavedBusinessIdeasProps> = ({
  profile,
  userSkills,
  verifiedSkills,
  userIndustries,
  onRemoveSaved,
  onExploreClick,
  onBuildStartup,
}) => {
  const [selectedIdea, setSelectedIdea] = useState<IBusinessIdea | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const rawSaved = profile?.savedBusinessIdeas || [];
  const savedIdeas: IBusinessIdea[] = rawSaved.filter(
    (item): item is IBusinessIdea => typeof item === 'object' && item !== null && '_id' in item
  );

  const handleRemove = async (ideaId: string) => {
    try {
      setRemovingId(ideaId);
      await onRemoveSaved(ideaId);
    } catch (err) {
      console.error('Failed to remove saved idea:', err);
    } finally {
      setRemovingId(null);
    }
  };

  if (savedIdeas.length === 0) {
    return (
      <div
        style={{
          background: 'var(--bg-card, rgba(30, 41, 59, 0.7))',
          border: '1px solid var(--border-card, rgba(255, 255, 255, 0.08))',
          borderRadius: '16px',
          padding: '48px 24px',
          textAlign: 'center',
          backdropFilter: 'blur(12px)',
          maxWidth: '640px',
          margin: '20px auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <Bookmark size={40} style={{ color: '#818cf8' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f3f4f6', margin: 0 }}>
          You haven't saved any business ideas yet
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#9ca3af', lineHeight: 1.5, margin: 0 }}>
          Bookmark promising market opportunities in the Business Ideas Explorer to review their blueprints and execution models later.
        </p>
        <button
          onClick={onExploreClick}
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '9px 20px',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.88rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            marginTop: '8px',
          }}
        >
          Explore Business Ideas <ArrowRight size={15} />
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f3f4f6', margin: '0 0 4px 0' }}>
            Saved Business Blueprints ({savedIdeas.length})
          </h3>
          <p style={{ fontSize: '0.84rem', color: '#9ca3af', margin: 0 }}>
            Quickly reference your saved venture concepts, review required tech stacks, and track execution steps.
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '16px',
        }}
      >
        {savedIdeas.map((idea) => {
          const matchResult = calculateBusinessIdeaMatch(
            idea,
            profile,
            userSkills,
            verifiedSkills,
            userIndustries
          );

          return (
            <div
              key={idea._id}
              style={{
                background: 'var(--bg-card, rgba(30, 41, 59, 0.7))',
                border: '1px solid var(--border-card, rgba(255, 255, 255, 0.08))',
                borderRadius: '14px',
                padding: '20px',
                backdropFilter: 'blur(12px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '2px 7px',
                        borderRadius: '5px',
                        background: 'rgba(99, 102, 241, 0.15)',
                        color: '#818cf8',
                      }}
                    >
                      {idea.industry}
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '2px 7px',
                        borderRadius: '5px',
                        background: 'rgba(59, 130, 246, 0.15)',
                        color: '#60a5fa',
                      }}
                    >
                      {idea.difficulty}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#34d399',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                    }}
                  >
                    <TrendingUp size={11} /> {matchResult.matchScore}%
                  </div>
                </div>

                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f3f4f6', margin: '0 0 6px 0' }}>
                  {idea.title}
                </h4>
                <p
                  style={{
                    fontSize: '0.84rem',
                    color: '#9ca3af',
                    lineHeight: 1.45,
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {idea.shortDescription}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  paddingTop: '12px',
                }}
              >
                <button
                  type="button"
                  onClick={() => handleRemove(idea._id)}
                  disabled={removingId === idea._id}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#f87171',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                  }}
                >
                  <Trash2 size={13} /> Remove
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedIdea(idea)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#f3f4f6',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                  }}
                >
                  <span>View Blueprint</span>
                  <ExternalLink size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Blueprint Modal */}
      {selectedIdea && (
        <BusinessIdeaDetails
          idea={selectedIdea}
          isSaved={true}
          matchResult={calculateBusinessIdeaMatch(
            selectedIdea,
            profile,
            userSkills,
            verifiedSkills,
            userIndustries
          )}
          onClose={() => setSelectedIdea(null)}
          onSaveToggle={async (id) => {
            await handleRemove(id);
            setSelectedIdea(null);
          }}
          onBuildStartup={onBuildStartup}
        />
      )}
    </div>
  );
};
