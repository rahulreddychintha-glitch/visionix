import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  GraduationCap, 
  Settings, 
  Lock, 
  Upload, 
  Check, 
  Loader2
} from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { profile, loading, saveProfile, loadProfile } = useProfile();
  const [activeTab, setActiveTab] = useState<'personal' | 'education' | 'skills' | 'security'>('personal');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State Definitions
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('rahul_r');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [bio, setBio] = useState('Aspiring Machine Learning engineer seeking to build intelligent pipelines.');
  
  const [eduLevel, setEduLevel] = useState('Bachelor');
  const [institution, setInstitution] = useState('IIT Madras');
  const [stream, setStream] = useState('Computer Science');
  const [currentGoal, setCurrentGoal] = useState('Finish PyTorch curriculum');
  const [careerPreference, setCareerPreference] = useState('AI & Machine Learning Engineer');

  const [skills, setSkills] = useState('Python, SQL, NumPy, PyTorch');
  const [interests, setInterests] = useState('Machine Learning, Product Design, Generative AI');
  const [language, setLanguage] = useState('English');
  const [timezone, setTimezone] = useState('UTC+5:30 (IST)');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Initialize fields on load
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.personal?.fullName || user?.fullName || '');
      setEmail(user?.email || '');
      setBio(profile.careerGoals?.careerObjectives || '');
      setEduLevel(profile.education?.level || 'Bachelor');
      setInstitution(profile.education?.institution || '');
      setStream(profile.education?.stream || '');
      setCareerPreference(profile.careerGoals?.dreamCareer || '');
      
      if (profile.skills?.technicalSkills) {
        setSkills(profile.skills.technicalSkills.join(', '));
      }
      if (profile.interests?.careerInterests) {
        setInterests(profile.interests.careerInterests.join(', '));
      }
    }
  }, [profile, user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);

    const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
    const interestsArray = interests.split(',').map(i => i.trim()).filter(Boolean);

    try {
      const updatedProfile = {
        personal: {
          fullName,
        },
        education: {
          level: eduLevel,
          institution,
          stream,
        },
        skills: {
          technicalSkills: skillsArray,
        },
        interests: {
          careerInterests: interestsArray,
        },
        careerGoals: {
          dreamCareer: careerPreference,
          careerObjectives: bio,
        }
      };

      await saveProfile(updatedProfile);
      setSuccessMessage('Profile saved successfully!');
      
      // Auto clear toast
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="ambient-noise" />
      <div className="glow-accent-primary" style={{ width: '400px', height: '400px', top: '10%', left: '15%', opacity: 0.35 }}></div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h2 className="text-heading" style={{ fontSize: '1.85rem' }}>User Profile & Settings</h2>
          <p className="text-caption" style={{ marginTop: '4px' }}>Customize your account, objectives, and domain preferences</p>
        </div>

        {/* Success Feedback Alert */}
        <AnimatePresence>
          {successMessage && (
            <motion.div 
              style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '12px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#34d399',
                fontSize: '0.85rem'
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Check size={16} />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '32px', alignItems: 'flex-start' }}>
          
          {/* Tabs Navigation Sidebar */}
          <div className="premiumCard" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              className={activeTab === 'personal' ? 'premiumButtonPrimary' : 'premiumButtonSecondary'}
              onClick={() => setActiveTab('personal')}
              style={{ justifyContent: 'flex-start', padding: '10px 16px', fontSize: '0.85rem' }}
            >
              <User size={16} />
              <span>Personal Info</span>
            </button>

            <button 
              className={activeTab === 'education' ? 'premiumButtonPrimary' : 'premiumButtonSecondary'}
              onClick={() => setActiveTab('education')}
              style={{ justifyContent: 'flex-start', padding: '10px 16px', fontSize: '0.85rem' }}
            >
              <GraduationCap size={16} />
              <span>Education & Goal</span>
            </button>

            <button 
              className={activeTab === 'skills' ? 'premiumButtonPrimary' : 'premiumButtonSecondary'}
              onClick={() => setActiveTab('skills')}
              style={{ justifyContent: 'flex-start', padding: '10px 16px', fontSize: '0.85rem' }}
            >
              <Settings size={16} />
              <span>Skills & Preferences</span>
            </button>

            <button 
              className={activeTab === 'security' ? 'premiumButtonPrimary' : 'premiumButtonSecondary'}
              onClick={() => setActiveTab('security')}
              style={{ justifyContent: 'flex-start', padding: '10px 16px', fontSize: '0.85rem' }}
            >
              <Lock size={16} />
              <span>Account Security</span>
            </button>
          </div>

          {/* Form Content Wrapper */}
          <form onSubmit={handleSave} className="premiumCard" style={{ padding: '32px' }}>
            
            {/* Tab 1: Personal Details */}
            {activeTab === 'personal' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <h3 className="text-subheading" style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={18} style={{ color: 'var(--color-primary)' }} />
                  <span>Personal Details</span>
                </h3>

                {/* Avatar upload container */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    color: '#fff',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      user?.fullName?.[0] || 'Rahul'
                    )}
                  </div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}>
                    <Upload size={14} />
                    <span>Upload Image</span>
                    <input type="file" onChange={handleAvatarChange} style={{ display: 'none' }} accept="image/*" />
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>Full Name</label>
                    <input 
                      type="text" 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)} 
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        color: '#fff',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>Username</label>
                    <input 
                      type="text" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        color: '#fff',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>Email Address</label>
                    <input 
                      type="email" 
                      value={email} 
                      readOnly
                      style={{
                        background: 'rgba(255,255,255,0.01)',
                        border: '1px solid rgba(255,255,255,0.03)',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        color: 'var(--text-muted)',
                        fontSize: '0.85rem',
                        cursor: 'not-allowed'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>Phone Number</label>
                    <input 
                      type="text" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        color: '#fff',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>Biography</label>
                  <textarea 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)} 
                    rows={4}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: '#fff',
                      fontSize: '0.85rem',
                      resize: 'none'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Tab 2: Education & Career */}
            {activeTab === 'education' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <h3 className="text-subheading" style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <GraduationCap size={18} style={{ color: 'var(--color-primary)' }} />
                  <span>Education & Career Goals</span>
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>Education Level</label>
                    <select 
                      value={eduLevel} 
                      onChange={(e) => setEduLevel(e.target.value)} 
                      style={{
                        background: '#090a10',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        color: '#fff',
                        fontSize: '0.85rem'
                      }}
                    >
                      <option value="High School">High School</option>
                      <option value="Bachelor">Bachelor Degree</option>
                      <option value="Master">Master Degree</option>
                      <option value="PhD">PhD Doctorate</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>College / University</label>
                    <input 
                      type="text" 
                      value={institution} 
                      onChange={(e) => setInstitution(e.target.value)} 
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        color: '#fff',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>Degree / Stream</label>
                    <input 
                      type="text" 
                      value={stream} 
                      onChange={(e) => setStream(e.target.value)} 
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        color: '#fff',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>Career Preference (Dream Career)</label>
                    <input 
                      type="text" 
                      value={careerPreference} 
                      onChange={(e) => setCareerPreference(e.target.value)} 
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        color: '#fff',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>Current Study Goal</label>
                  <input 
                    type="text" 
                    value={currentGoal} 
                    onChange={(e) => setCurrentGoal(e.target.value)} 
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: '#fff',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Tab 3: Skills & Preferences */}
            {activeTab === 'skills' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <h3 className="text-subheading" style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Settings size={18} style={{ color: 'var(--color-primary)' }} />
                  <span>Skills & Preferences</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>Technical Skills (Comma separated)</label>
                  <input 
                    type="text" 
                    value={skills} 
                    onChange={(e) => setSkills(e.target.value)} 
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: '#fff',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>Interests (Comma separated)</label>
                  <input 
                    type="text" 
                    value={interests} 
                    onChange={(e) => setInterests(e.target.value)} 
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: '#fff',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>Preferred Language</label>
                    <input 
                      type="text" 
                      value={language} 
                      onChange={(e) => setLanguage(e.target.value)} 
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        color: '#fff',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>Timezone</label>
                    <input 
                      type="text" 
                      value={timezone} 
                      onChange={(e) => setTimezone(e.target.value)} 
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        color: '#fff',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Account Security */}
            {activeTab === 'security' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <h3 className="text-subheading" style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Lock size={18} style={{ color: 'var(--color-primary)' }} />
                  <span>Account Security</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>Current Password</label>
                  <input 
                    type="password" 
                    value={currentPassword} 
                    onChange={(e) => setCurrentPassword(e.target.value)} 
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: '#fff',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>New Password</label>
                  <input 
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: '#fff',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>Confirm New Password</label>
                  <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: '#fff',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Bottom Actions Row */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px', gap: '16px' }}>
              <button 
                type="button"
                onClick={() => window.history.back()}
                className="premiumButtonSecondary" 
                style={{ padding: '10px 24px', fontSize: '0.85rem' }}
              >
                Cancel
              </button>

              <button 
                type="submit" 
                className="premiumButtonPrimary" 
                disabled={loading}
                style={{ padding: '10px 24px', fontSize: '0.85rem' }}
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="spin-animation" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};
