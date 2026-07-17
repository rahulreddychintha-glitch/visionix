import { useState, useEffect } from 'react';
import { User, ArrowRight, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';

const NAV_ITEMS = [
  { label: 'Home', href: '#' },
  { label: 'Features', href: '#features' },
  { label: 'Careers', href: '#careers' },
  { label: 'How It Works', href: '#workflow' },
  { label: "What You'll Learn", href: '#what-you-learn' },
];

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('Home');

  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavClick = (label: string, href: string) => {
    setActiveLink(label);
    setIsMenuOpen(false);
    
    if (window.location.pathname !== '/') {
      navigate(href === '#' ? '/' : '/' + href);
    } else {
      if (href === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const element = document.getElementById(href.replace('#', ''));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Brand Logo matching Reference Design */}
        <a 
          href="#" 
          className={styles.logo} 
          aria-label="Visionix Home" 
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('Home', '#');
          }}
        >
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
        </a>

        {/* Desktop Navigation Links */}
        <div className={styles.navLinks}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`${styles.link} ${activeLink === item.label ? styles.activeLink : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.label, item.href);
              }}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Navigation Action Buttons */}
        <div className={styles.actions}>
          <button 
            className={styles.loginBtn} 
            aria-label="Log In"
            onClick={() => navigate('/login')}
          >
            <User size={16} />
            <span>Log In</span>
          </button>
          
          <button 
            className="btn btn-primary" 
            style={{ padding: '8px 18px' }} 
            aria-label="Sign Up"
            onClick={() => navigate('/signup')}
          >
            <span>Sign Up</span>
            <ArrowRight size={15} />
          </button>

          {/* Hamburger Icon */}
          <button 
            className={styles.menuToggle} 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            aria-expanded={isMenuOpen} 
            aria-label="Toggle Navigation Menu"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown Panel */}
      <div className={`${styles.mobileDrawer} ${isMenuOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerLinks}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`${styles.drawerLink} ${activeLink === item.label ? styles.activeDrawerLink : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.label, item.href);
              }}
            >
              {item.label}
            </a>
          ))}
          <div className={styles.drawerDivider}></div>
          <button 
            className={styles.drawerLoginBtn} 
            onClick={() => {
              setIsMenuOpen(false);
              navigate('/login');
            }}
          >
            <User size={16} />
            <span>Log In</span>
          </button>
          <button 
            className="btn btn-primary" 
            style={{ width: '100%' }} 
            onClick={() => {
              setIsMenuOpen(false);
              navigate('/signup');
            }}
          >
            <span>Sign Up</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </nav>
  );
};
