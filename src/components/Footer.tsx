import { Compass, Github, Twitter, Linkedin } from 'lucide-react';
import styles from './Footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <a href="/" className={styles.logo}>
              <Compass className={styles.compass} size={20} />
              <span className={styles.logoText}>Vision<span className={styles.logoHighlight}>ix</span></span>
            </a>
            <p className={styles.description}>
              AI-powered career guidance for students — personalized roadmaps, live skill tracking, and targeted interview preparation.
            </p>
            <div className={styles.socials}>
              <a href="#" className={styles.socialLink} aria-label="Twitter"><Twitter size={18} /></a>
              <a href="#" className={styles.socialLink} aria-label="LinkedIn"><Linkedin size={18} /></a>
              <a href="#" className={styles.socialLink} aria-label="GitHub"><Github size={18} /></a>
            </div>
          </div>
          
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Platform</h4>
            <ul className={styles.linksList}>
              <li><a href="#features" className={styles.footerLink}>Career Roadmap</a></li>
              <li><a href="#features" className={styles.footerLink}>Learning Hub</a></li>
              <li><a href="#features" className={styles.footerLink}>Interview Prep</a></li>
            </ul>
          </div>
          
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Resources</h4>
            <ul className={styles.linksList}>
              <li><a href="#" className={styles.footerLink}>Documentation</a></li>
              <li><a href="#" className={styles.footerLink}>Help Center</a></li>
              <li><a href="#" className={styles.footerLink}>Privacy Policy</a></li>
            </ul>
          </div>

          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Company</h4>
            <ul className={styles.linksList}>
              <li><a href="#" className={styles.footerLink}>About Us</a></li>
              <li><a href="#" className={styles.footerLink}>Careers</a></li>
              <li><a href="#" className={styles.footerLink}>Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>&copy; {new Date().getFullYear()} Visionix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
