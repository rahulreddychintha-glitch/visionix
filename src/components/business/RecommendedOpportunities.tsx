import React, { useState, useEffect } from 'react';
import type {
  IBusinessOpportunity,
  IBusinessProfile,
} from '../../types/business.types';
import { BusinessService } from '../../services/business.service';
import { calculateBusinessOpportunityMatch } from '../../utils/businessOpportunityMatching';
import { BusinessOpportunityCard } from './BusinessOpportunityCard';
import { BusinessOpportunityDetails } from './BusinessOpportunityDetails';
import { Sparkles, Loader2 } from 'lucide-react';

interface RecommendedOpportunitiesProps {
  profile: IBusinessProfile | null;
  userSkills: string[];
  verifiedSkills: string[];
  userIndustries: string[];
  onSaveToggle: (id: string) => Promise<void>;
}

export const RecommendedOpportunities: React.FC<RecommendedOpportunitiesProps> = ({
  profile,
  userSkills,
  verifiedSkills,
  userIndustries,
  onSaveToggle,
}) => {
  const [opportunities, setOpportunities] = useState<IBusinessOpportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOpportunity, setSelectedOpportunity] = useState<IBusinessOpportunity | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchRecommended = async () => {
      try {
        setLoading(true);
        const data = await BusinessService.getRecommendedOpportunities();
        if (isMounted) setOpportunities(data || []);
      } catch (err) {
        console.warn('Failed to load recommended opportunities:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRecommended();
    return () => {
      isMounted = false;
    };
  }, []);

  const savedIdSet = new Set(
    (profile?.savedOpportunities || []).map((item) =>
      typeof item === 'object' ? item._id : item.toString()
    )
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', color: '#9ca3af', gap: '8px' }}>
        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
        <span>Matching top opportunities to your profile...</span>
      </div>
    );
  }

  if (opportunities.length === 0) {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Sparkles size={18} style={{ color: '#818cf8' }} />
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f3f4f6', margin: 0 }}>
          Top Recommended for Your Profile
        </h3>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '18px',
        }}
      >
        {opportunities.slice(0, 3).map((opp) => {
          const match = calculateBusinessOpportunityMatch(
            opp,
            profile,
            userSkills,
            verifiedSkills,
            userIndustries
          );

          return (
            <BusinessOpportunityCard
              key={opp._id}
              opportunity={opp}
              isSaved={savedIdSet.has(opp._id)}
              matchResult={match}
              onSaveToggle={onSaveToggle}
              onViewDetails={(selected) => setSelectedOpportunity(selected)}
            />
          );
        })}
      </div>

      {selectedOpportunity && (
        <BusinessOpportunityDetails
          opportunity={selectedOpportunity}
          isSaved={savedIdSet.has(selectedOpportunity._id)}
          matchResult={calculateBusinessOpportunityMatch(
            selectedOpportunity,
            profile,
            userSkills,
            verifiedSkills,
            userIndustries
          )}
          onClose={() => setSelectedOpportunity(null)}
          onSaveToggle={onSaveToggle}
        />
      )}
    </div>
  );
};
