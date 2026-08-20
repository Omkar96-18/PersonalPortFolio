import React from 'react';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { Github, Linkedin } from './BrandIcons';

export const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="footer-top-border" />
      <div className="container footer-container">
        <div className="footer-left">
          <span className="footer-brand">devil<span className="footer-brand-accent">37</span></span>
          <p>© {new Date().getFullYear()} — Built with Precision & Performance.</p>
        </div>
        <div className="footer-right">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" title="GitHub">
            <Github size={15} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" title="LinkedIn">
            <Linkedin size={15} />
          </a>
          <Link to="/admin/login" className="footer-admin-link" title="Admin Portal">
            <Settings size={13} />
          </Link>
        </div>
      </div>

      <style>{`
        .footer-wrapper {
          background-color: var(--bg-secondary);
          padding: 20px 0;
          margin-top: auto;
          position: relative;
        }
        .footer-top-border {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, var(--accent-red) 50%, transparent 100%);
          opacity: 0.3;
        }
        .footer-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .footer-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .footer-brand {
          font-family: var(--font-sans);
          font-weight: 800;
          font-size: 0.95rem;
          color: var(--text-primary);
        }
        .footer-brand-accent {
          color: var(--accent-red);
        }
        .footer-left p { margin: 0; }
        .footer-right {
          display: flex;
          align-items: center;
          gap: 18px;
        }
        .footer-social-link {
          color: var(--text-muted);
          transition: var(--transition-smooth);
        }
        .footer-social-link:hover {
          color: var(--accent-red);
          filter: drop-shadow(0 0 6px var(--accent-red));
        }
        .footer-admin-link {
          color: var(--text-muted);
          opacity: 0.4;
          transition: var(--transition-smooth);
        }
        .footer-admin-link:hover {
          color: var(--text-secondary);
          opacity: 1;
        }
        @media (max-width: 600px) {
          .footer-container { flex-direction: column; gap: 12px; text-align: center; }
          .footer-left { flex-direction: column; gap: 4px; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
