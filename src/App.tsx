import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthProvider } from './contexts/AuthContext';
import { ProfileProvider } from './contexts/ProfileContext';
import { PersonalizationProvider } from './contexts/PersonalizationContext';
import { AiModalProvider } from './contexts/AiModalContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { GuestRoute } from './components/GuestRoute';
import { Loader2 } from 'lucide-react';
import './App.css';

// Lazy-loaded route components for optimized bundle performance
const LandingPage = React.lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = React.lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const SignupPage = React.lazy(() => import('./pages/SignupPage').then(m => ({ default: m.SignupPage })));
const OnboardingPage = React.lazy(() => import('./pages/OnboardingPage').then(m => ({ default: m.OnboardingPage })));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const AiAssistantPage = React.lazy(() => import('./pages/AiAssistantPage').then(m => ({ default: m.AiAssistantPage })));
const CareerExplorerPage = React.lazy(() => import('./pages/CareerExplorerPage').then(m => ({ default: m.CareerExplorerPage })));
const SavedCareersPage = React.lazy(() => import('./pages/SavedCareersPage').then(m => ({ default: m.SavedCareersPage })));
const UnderDevelopmentPage = React.lazy(() => import('./pages/UnderDevelopmentPage').then(m => ({ default: m.UnderDevelopmentPage })));
const CareerRoadmapPage = React.lazy(() => import('./pages/CareerRoadmapPage').then(m => ({ default: m.CareerRoadmapPage })));
const MyProgressPage = React.lazy(() => import('./pages/MyProgressPage').then(m => ({ default: m.MyProgressPage })));
const LearningHubPage = React.lazy(() => import('./pages/LearningHubPage').then(m => ({ default: m.LearningHubPage })));
const YouTubeLearningPage = React.lazy(() => import('./pages/YouTubeLearningPage').then(m => ({ default: m.YouTubeLearningPage })));
const ExamsPage = React.lazy(() => import('./pages/ExamsPage').then(m => ({ default: m.ExamsPage })));
const ResumeBuilderPage = React.lazy(() => import('./pages/ResumeBuilderPage').then(m => ({ default: m.ResumeBuilderPage })));
const InterviewPage = React.lazy(() => import('./pages/InterviewPage').then(m => ({ default: m.InterviewPage })));
const BusinessPage = React.lazy(() => import('./pages/BusinessPage').then(m => ({ default: m.BusinessPage })));
const SkillNavigatorPage = React.lazy(() => import('./pages/SkillNavigatorPage').then(m => ({ default: m.SkillNavigatorPage })));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

const RouteLoadingFallback = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    width: '100%',
  }}>
    <Loader2 className="spin-animation" size={32} style={{ color: 'var(--color-primary, #6366f1)' }} />
  </div>
);

const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};


function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProfileProvider>
          <PersonalizationProvider>
            <Router>
              <AiModalProvider>
                <Suspense fallback={<RouteLoadingFallback />}>
                  <Routes>
                    {/* Public Layout wrapper routes */}
                    <Route element={<PublicLayout />}>
                      <Route path="/" element={<LandingPage />} />
                      <Route 
                        path="/login" 
                        element={
                          <GuestRoute>
                            <LoginPage />
                          </GuestRoute>
                        } 
                      />
                      <Route 
                        path="/signup" 
                        element={
                          <GuestRoute>
                            <SignupPage />
                          </GuestRoute>
                        } 
                      />
                      <Route 
                        path="/onboarding" 
                        element={
                          <ProtectedRoute allowPendingOnboarding isOnboardingRoute>
                            <OnboardingPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route path="*" element={<LandingPage />} />
                    </Route>

                    {/* Standalone Dashboard route using its own composition */}
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <DashboardPage />
                        </ProtectedRoute>
                      } 
                    />

                    <Route 
                      path="/profile" 
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      } 
                    />

                    {/* AI Assistant Phase 6 Route */}
                    <Route 
                      path="/ai-assistant" 
                      element={
                        <ProtectedRoute>
                          <AiAssistantPage />
                        </ProtectedRoute>
                      } 
                    />

                    {/* Career Explorer Routes */}
                    <Route 
                      path="/explore" 
                      element={
                        <ProtectedRoute>
                          <CareerExplorerPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/career-explorer" 
                      element={
                        <ProtectedRoute>
                          <CareerExplorerPage />
                        </ProtectedRoute>
                      } 
                    />

                    <Route 
                      path="/saved" 
                      element={
                        <ProtectedRoute>
                          <SavedCareersPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/saved-careers" 
                      element={
                        <ProtectedRoute>
                          <SavedCareersPage />
                        </ProtectedRoute>
                      } 
                    />

                    <Route 
                      path="/roadmap" 
                      element={
                        <ProtectedRoute>
                          <CareerRoadmapPage />
                        </ProtectedRoute>
                      } 
                    />

                    <Route 
                      path="/progress" 
                      element={
                        <ProtectedRoute>
                          <MyProgressPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/my-progress" 
                      element={
                        <ProtectedRoute>
                          <MyProgressPage />
                        </ProtectedRoute>
                      } 
                    />

                    <Route 
                      path="/courses" 
                      element={
                        <ProtectedRoute>
                          <LearningHubPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/learning-hub" 
                      element={
                        <ProtectedRoute>
                          <LearningHubPage />
                        </ProtectedRoute>
                      } 
                    />

                    <Route 
                      path="/youtube" 
                      element={
                        <ProtectedRoute>
                          <YouTubeLearningPage />
                        </ProtectedRoute>
                      } 
                    />

                    <Route 
                      path="/exams" 
                      element={
                        <ProtectedRoute>
                          <ExamsPage />
                        </ProtectedRoute>
                      } 
                    />

                    {/* Resume Builder Phase 13 Foundation Route */}
                    <Route 
                      path="/resume" 
                      element={
                        <ProtectedRoute>
                          <ResumeBuilderPage />
                        </ProtectedRoute>
                      } 
                    />

                    {/* Interview Preparation Phase 13.5 Route */}
                    <Route 
                      path="/interview" 
                      element={
                        <ProtectedRoute>
                          <InterviewPage />
                        </ProtectedRoute>
                      } 
                    />

                    {/* Business & Startup Hub Phase 14 Foundation Route */}
                    <Route 
                      path="/business" 
                      element={
                        <ProtectedRoute>
                          <BusinessPage />
                        </ProtectedRoute>
                      } 
                    />

                    {/* Skill Gap & Next-Step Planner Phase 15 Route */}
                    <Route 
                      path="/skill-gap" 
                      element={
                        <ProtectedRoute>
                          <SkillNavigatorPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/skill-navigator" 
                      element={
                        <ProtectedRoute>
                          <SkillNavigatorPage />
                        </ProtectedRoute>
                      } 
                    />

                    {/* Settings Phase 16 Route & Aliases */}
                    {['/settings', '/account-settings', '/preferences', '/appearance', '/notifications', '/security'].map((path) => (
                      <Route 
                        key={path}
                        path={path} 
                        element={
                          <ProtectedRoute>
                            <SettingsPage />
                          </ProtectedRoute>
                        } 
                      />
                    ))}

                    {/* Under Development Routes */}
                    {['/scholarships'].map((path) => (
                      <Route 
                        key={path}
                        path={path} 
                        element={
                          <ProtectedRoute>
                            <UnderDevelopmentPage title={path.substring(1).replace('-', ' ').toUpperCase()} />
                          </ProtectedRoute>
                        } 
                      />
                    ))}
                  </Routes>
                </Suspense>
              </AiModalProvider>
            </Router>
          </PersonalizationProvider>
        </ProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
// Remove any unused references in compilation
export { App };

