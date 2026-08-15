import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { CareerExplorerPage } from './pages/CareerExplorerPage';
import { SavedCareersPage } from './pages/SavedCareersPage';
import { UnderDevelopmentPage } from './pages/UnderDevelopmentPage';
import { CareerRoadmapPage } from './pages/CareerRoadmapPage';
import { MyProgressPage } from './pages/MyProgressPage';
import { LearningHubPage } from './pages/LearningHubPage';
import { YouTubeLearningPage } from './pages/YouTubeLearningPage';
import { ExamsPage } from './pages/ExamsPage';
import { ResumeBuilderPage } from './pages/ResumeBuilderPage';
import { InterviewPage } from './pages/InterviewPage';
import { BusinessPage } from './pages/BusinessPage';
import { Footer } from './components/Footer';
import { AuthProvider } from './contexts/AuthContext';
import { ProfileProvider } from './contexts/ProfileContext';
import { PersonalizationProvider } from './contexts/PersonalizationContext';
import { AiModalProvider } from './contexts/AiModalContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { GuestRoute } from './components/GuestRoute';
import './App.css';

import { Outlet } from 'react-router-dom';

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
    <AuthProvider>
      <ProfileProvider>
        <PersonalizationProvider>
          <Router>
            <AiModalProvider>
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

                {/* Under Development Routes */}
                {['/certifications', '/scholarships', '/settings', '/account-settings', '/preferences', '/appearance', '/notifications', '/security'].map((path) => (
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
            </AiModalProvider>
          </Router>
        </PersonalizationProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;
// Remove any unused references in compilation
export { App };
