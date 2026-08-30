import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { api } from '../services/api';
import { SocialBrandIcon } from './BrandIcons';

export const Footer = () => {
  const [profile, setProfile] = useState(null);
  const [socialLinks, setSocialLinks] = useState([]);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      api.getProfile().catch(() => null),
      api.getSocialLinks().catch(() => [])
    ]).then(([prof, links]) => {
      if (isMounted) {
        if (prof) setProfile(prof);
        if (links && links.length > 0) setSocialLinks(links);
      }
    });

    return () => { isMounted = false; };
  }, []);

  // Compute brand name parts
  const brandFull = profile?.footer_brand || 'devil37';
  const brandLetters = brandFull.replace(/\d+$/, '');
  const brandNumbers = brandFull.match(/\d+$/)?.[0] || '';

  // Compute footer copyright text
  const currentYear = new Date().getFullYear();
  const rawFooterText = profile?.footer_text || 'Built with Precision & Performance.';
  const formattedFooterText = rawFooterText.replace(/\{year\}/gi, currentYear);

  // Fallback links if no social links in database yet
  const displayLinks = (socialLinks && socialLinks.length > 0) 
    ? socialLinks.filter(l => l.is_active !== false)
    : [
        ...(profile?.github_url ? [{ platform: 'github', label: 'GitHub', url: profile.github_url }] : [{ platform: 'github', label: 'GitHub', url: 'https://github.com/omkar96-18/' }]),
        ...(profile?.linkedin_url ? [{ platform: 'linkedin', label: 'LinkedIn', url: profile.linkedin_url }] : [{ platform: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/omkar-pardeshi-09b7b7348/' }]),
        ...(profile?.twitter_url ? [{ platform: 'twitter', label: 'Twitter / X', url: profile.twitter_url }] : []),
        ...(profile?.leetcode_url ? [{ platform: 'leetcode', label: 'LeetCode', url: profile.leetcode_url }] : []),
        ...(profile?.kaggle_url ? [{ platform: 'kaggle', label: 'Kaggle', url: profile.kaggle_url }] : []),
        ...(profile?.youtube_url ? [{ platform: 'youtube', label: 'YouTube', url: profile.youtube_url }] : []),
      ];

  return (
    <footer className="footer-wrapper">
      <div className="footer-top-border" />
      <div className="container footer-container">
        <div className="footer-left">
          <span className="footer-brand">
            {brandLetters}
            {brandNumbers && <span className="footer-brand-accent">{brandNumbers}</span>}
          </span>
          <p>© {currentYear} — {formattedFooterText}</p>
        </div>
        <div className="footer-right">
          {displayLinks.map((link, idx) => (
            <a 
              key={link.id || idx}
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-social-link" 
              title={link.label || link.platform}
              aria-label={link.label || link.platform}
            >
              <SocialBrandIcon platform={link.platform} icon={link.icon} size={15} />
            </a>
          ))}
          <Link to="/admin/login" className="footer-admin-link" title="Admin Portal / Control Center" aria-label="Admin Portal">
            <Settings size={14} />
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
          gap: 16px;
          flex-wrap: wrap;
        }
        .footer-social-link {
          color: var(--text-muted);
          transition: var(--transition-smooth);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .footer-social-link:hover {
          color: var(--accent-red);
          transform: translateY(-2px);
          filter: drop-shadow(0 0 6px var(--accent-red));
        }
        .footer-admin-link {
          color: var(--text-muted);
          opacity: 0.4;
          transition: var(--transition-smooth);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-left: 4px;
        }
        .footer-admin-link:hover {
          color: var(--text-secondary);
          opacity: 1;
          transform: rotate(45deg);
        }
        @media (max-width: 600px) {
          .footer-container { flex-direction: column; gap: 12px; text-align: center; }
          .footer-left { flex-direction: column; gap: 4px; }
          .footer-right { justify-content: center; gap: 14px; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
