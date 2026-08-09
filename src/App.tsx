import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { UnderDevelopmentPage } from './pages/UnderDevelopmentPage';
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

                {/* Under Development Routes */}
                {['/roadmap', '/explore', '/courses', '/youtube', '/interview', '/certifications', '/exams', '/scholarships', '/resume', '/saved', '/business', '/progress', '/settings', '/account-settings', '/preferences', '/appearance', '/notifications', '/security', '/subscription'].map((path) => (
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
