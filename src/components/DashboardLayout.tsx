import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Brain, 
  GitFork, 
  Compass, 
  GraduationCap, 
  Video, 
  HelpCircle, 
  Award, 
  FileText, 
  Landmark, 
  FileEdit, 
  Bookmark, 
  Lightbulb, 
  TrendingUp, 
  Settings,
  Search,
  Sparkles,
  Bell,
  Mail,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Mic
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import styles from './DashboardLayout.module.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const NAV_GROUPS = [
  {
    title: 'Core',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'AI Career Assistant', path: '/ai-assistant', icon: Brain, isNew: true },
      { label: 'Career Roadmap', path: '/roadmap', icon: GitFork },
      { label: 'Explore Careers', path: '/explore', icon: Compass },
    ]
  },
  {
    title: 'Learning & Prep',
    items: [
      { label: 'Courses & Learning', path: '/courses', icon: GraduationCap },
      { label: 'YouTube Learning', path: '/youtube', icon: Video },
      { label: 'Interview Prep', path: '/interview', icon: HelpCircle },
      { label: 'Certifications', path: '/certifications', icon: Award },
      { label: 'Entrance Exams', path: '/exams', icon: FileText },
    ]
  },
  {
    title: 'Tools & Utilities',
    items: [
      { label: 'Scholarships', path: '/scholarships', icon: Landmark },
      { label: 'Resume Builder', path: '/resume', icon: FileEdit },
      { label: 'Saved & Bookmarks', path: '/saved', icon: Bookmark },
      { label: 'Business Ideas', path: '/business', icon: Lightbulb },
      { label: 'My Progress', path: '/progress', icon: TrendingUp },
      { label: 'Settings', path: '/settings', icon: Settings },
    ]
  }
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U';
  };

  return (
    <div className={styles.layout}>
      {/* Keyboard Accessibility Skip Link */}
      <a href="#dashboard-main-content" className={styles.skipLink}>
        Skip to main content
      </a>

      {/* Sidebar Container */}
      <aside 
        className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}
        aria-label="Dashboard Sidebar"
      >
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <div className={styles.hexagonIcon}>
                <div className={styles.hexLayer1}></div>
                <div className={styles.hexLayer2}></div>
              </div>
            </div>
            <div className={styles.logoTextWrapper}>
              <span className={styles.logoText}>Visionix</span>
              <span className={styles.logoSubtitle}>AI Career Guidance</span>
            </div>
          </div>
          <button 
            className={styles.menuButton} 
            onClick={toggleSidebar}
            aria-label="Close Sidebar"
            style={{ marginLeft: 'auto' }}
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Navigation list */}
        <nav className={styles.navList}>
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className={styles.navGroup}>
              <span className={styles.navGroupTitle}>{group.title}</span>
              <div className={styles.navGroupItems}>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.label}
                      to={item.path}
                      className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                      onClick={() => {
                        if (isSidebarOpen) setIsSidebarOpen(false);
                      }}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="activeIndicator"
                          className={styles.activeIndicator}
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                        />
                      )}
                      <span className={styles.navIcon}>
                        <Icon size={18} />
                      </span>
                      <span className={styles.navItemText}>{item.label}</span>
                      {item.isNew && (
                        <span className={styles.newTag}>New</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Premium Upgrade Promotion Card */}
        <div className={styles.upgradeCard}>
          <div className={styles.upgradeCardTitle}>
            <Sparkles size={16} style={{ color: 'var(--color-primary)' }} />
            <span>Upgrade to Pro</span>
          </div>
          <p className={styles.upgradeCardText}>
            Unlock advanced AI features, personalized roadmaps, and more.
          </p>
          <button className={styles.upgradeBtn} aria-label="Upgrade to Pro Now">
            <span>Upgrade Now</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className={styles.mainContainer}>
        {/* Top Navbar Container */}
        <header className={styles.navbar}>
          <button 
            className={styles.menuButton} 
            onClick={toggleSidebar}
            aria-label="Open Sidebar"
            aria-expanded={isSidebarOpen}
          >
            <Menu size={20} />
          </button>

          {/* Refined Search bar input with interactive states & dropdown */}
          <div className={`${styles.searchWrapper} ${isSearchFocused ? styles.searchWrapperFocused : ''}`}>
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search careers, skills, courses..." 
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              aria-label="Search"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')} 
                className={styles.searchClearBtn}
                aria-label="Clear Search Input"
              >
                <X size={14} />
              </button>
            )}
            <div className={styles.voiceSearchBtn} aria-label="Voice Search Placeholder">
              <Mic size={14} />
            </div>
            <span className={styles.searchShortcut}>⌘K</span>

            {/* Dropdown containing recent searches, trending paths, and actions */}
            <AnimatePresence>
              {isSearchFocused && (
                <motion.div 
                  className={styles.searchDropdown}
                  initial={{ opacity: 0, y: 10, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.99 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className={styles.dropdownSection}>
                    <span className={styles.dropdownSectionTitle}>Recent Searches</span>
                    <div className={styles.dropdownItem} onClick={() => setSearchQuery('AI Engineering Career Path')}>AI Engineering Career Path</div>
                    <div className={styles.dropdownItem} onClick={() => setSearchQuery('React & TypeScript basics')}>React & TypeScript basics</div>
                  </div>
                  <div className={styles.dropdownSection}>
                    <span className={styles.dropdownSectionTitle}>Trending Careers</span>
                    <div className={styles.dropdownItem} onClick={() => setSearchQuery('Machine Learning Engineer')}>✨ Machine Learning Engineer</div>
                    <div className={styles.dropdownItem} onClick={() => setSearchQuery('Product Designer')}>✨ Product Designer</div>
                  </div>
                  <div className={styles.dropdownSection}>
                    <span className={styles.dropdownSectionTitle}>Quick Actions</span>
                    <div className={styles.dropdownItem} onClick={() => window.location.hash = '#roadmap'}>Go to Career Roadmap</div>
                    <div className={styles.dropdownItem} onClick={() => window.location.hash = '#ai-assistant'}>Ask Career Assistant</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className={styles.navActions}>
            {/* Ask AI Assistant Button */}
            <motion.button 
              className={styles.aiButton} 
              aria-label="Ask AI Assistant"
              whileHover={{ scale: 1.02, y: -0.5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles size={14} />
              <span>Ask AI Assistant ✨</span>
            </motion.button>

            {/* Notifications with pulsing badge */}
            <motion.button 
              className={styles.actionIconBtn} 
              aria-label="Notifications (3 unread)"
              whileHover={{ scale: 1.03, y: -0.5 }}
              whileTap={{ scale: 0.97 }}
            >
              <Bell size={18} />
              <span className={styles.iconBadge}>3</span>
            </motion.button>

            {/* Messages */}
            <motion.button 
              className={styles.actionIconBtn} 
              aria-label="Messages"
              whileHover={{ scale: 1.03, y: -0.5 }}
              whileTap={{ scale: 0.97 }}
            >
              <Mail size={18} />
            </motion.button>

            {/* Profile segment */}
            <div style={{ position: 'relative' }}>
              <motion.div 
                className={styles.profileCard} 
                aria-haspopup="true" 
                aria-label="User profile menu"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              >
                <div className={styles.avatar}>
                  {user?.avatar && (user.avatar.startsWith('http') || user.avatar.startsWith('/') || user.avatar.startsWith('data:')) ? (
                    <img src={user.avatar} alt={user.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    getInitials(user?.fullName || '')
                  )}
                </div>
                <div className={styles.profileInfo}>
                  <span className={styles.profileName}>{user?.fullName || 'Rahul'}</span>
                  <span className={styles.profileRole}>{user?.role || 'Student'}</span>
                </div>
                <ChevronDown size={14} className={styles.chevron} />
              </motion.div>

              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <motion.div 
                    className={styles.searchDropdown}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '8px',
                      width: '200px',
                      zIndex: 100,
                    }}
                    initial={{ opacity: 0, y: 10, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.99 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className={styles.dropdownSection}>
                      <span className={styles.dropdownSectionTitle}>Settings & More</span>
                      <div 
                        className={styles.dropdownItem} 
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          navigate('/profile');
                        }}
                      >
                        Profile
                      </div>
                      <div 
                        className={styles.dropdownItem} 
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          navigate('/profile');
                        }}
                      >
                        Edit Profile
                      </div>
                      <div 
                        className={styles.dropdownItem} 
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          navigate('/settings');
                        }}
                      >
                        Settings
                      </div>
                      <div 
                        className={styles.dropdownItem} 
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          navigate('/notifications');
                        }}
                      >
                        Notifications
                      </div>
                      <div 
                        className={styles.dropdownItem} 
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          navigate('/subscription');
                        }}
                      >
                        Subscription
                      </div>
                    </div>
                    <div className={styles.dropdownSection} style={{ borderTop: '1px solid rgba(255, 255, 255, 0.04)', paddingTop: '8px' }}>
                      <div 
                        className={styles.dropdownItem} 
                        style={{ color: '#ef4444' }}
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          logout();
                          navigate('/login');
                        }}
                      >
                        Logout
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Scrollable dashboard content area */}
        <main id="dashboard-main-content" className={styles.content}>
          {children}
        </main>
      </div>

      {/* Mobile Drawer Overlay Backdrop */}
      {isSidebarOpen && (
        <div 
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 45,
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

/* --- Modern Layout Primitives --- */

export interface DashboardGridProps {
  children: React.ReactNode;
  variant?: 'split' | 'triple' | 'quad';
  className?: string;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({ 
  children, 
  variant = 'split', 
  className = '' 
}) => {
  let gridStyle = styles.splitGrid;
  if (variant === 'triple') gridStyle = styles.tripleGrid;
  if (variant === 'quad') gridStyle = styles.quadGrid;
  
  return (
    <div className={`${gridStyle} ${className}`}>
      {children}
    </div>
  );
};

export interface DashboardFlexProps {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  gap?: number;
  className?: string;
}

export const DashboardFlex: React.FC<DashboardFlexProps> = ({ 
  children, 
  direction = 'row', 
  gap = 16, 
  className = '' 
}) => {
  return (
    <div 
      className={className}
      style={{
        display: 'flex',
        flexDirection: direction,
        gap: `${gap}px`,
        width: '100%'
      }}
    >
      {children}
    </div>
  );
};
