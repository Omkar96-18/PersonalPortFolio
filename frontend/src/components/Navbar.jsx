import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Code2, Menu, X, Sun, Moon } from 'lucide-react';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (theme === 'light') document.body.classList.add('light-theme');
    else document.body.classList.remove('light-theme');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    setIsOpen(false);
    const targetId = sectionId.replace('#', '');
    
    if (location.pathname !== '/') {
      navigate('/' + sectionId);
    } else {
      const el = document.getElementById(targetId);
      if (el) {
        if (window.lenis) {
          window.lenis.scrollTo(el, { offset: -70, duration: 1.1 });
        } else {
          const yOffset = -70;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    }
  };

  const isActive = path => location.pathname === path ? 'active' : '';

  return (
    <header className="navbar-fixed-outer">
      <nav className={`navbar-floating-capsule ${isScrolled ? 'scrolled' : ''}`}>
        <Link to="/PersonalPortfolio" className="navbar-logo" onClick={() => setIsOpen(false)}>
          <Code2 className="logo-icon" size={18} />
          <span className="logo-text">devil<span className="logo-accent">37</span></span>
        </Link>

        <div className="navbar-center-links">
          <a href="#about"      onClick={e => handleNavClick(e, '#about')}      className="nav-link">About</a>
          <a href="#projects"   onClick={e => handleNavClick(e, '#projects')}   className="nav-link">Projects</a>
          <a href="#skills"     onClick={e => handleNavClick(e, '#skills')}     className="nav-link">Skills</a>
          <a href="#experience" onClick={e => handleNavClick(e, '#experience')} className="nav-link">History</a>
          <a href="#contact"    onClick={e => handleNavClick(e, '#contact')}    className="nav-link">Contact</a>
          <Link to="/blogs" className={`nav-link ${isActive('/blogs')}`}>Blog</Link>
        </div>

        <div className="navbar-actions">
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Dropdown */}
      {isOpen && (
        <>
          <div className="mobile-backdrop" onClick={() => setIsOpen(false)} />
          <div className="mobile-menu-glass animate-in">
            <a href="#about"      onClick={e => handleNavClick(e, '#about')}      className="mobile-link">About</a>
            <a href="#projects"   onClick={e => handleNavClick(e, '#projects')}   className="mobile-link">Projects</a>
            <a href="#skills"     onClick={e => handleNavClick(e, '#skills')}     className="mobile-link">Skills</a>
            <a href="#experience" onClick={e => handleNavClick(e, '#experience')} className="mobile-link">History</a>
            <a href="#contact"    onClick={e => handleNavClick(e, '#contact')}    className="mobile-link">Contact</a>
            <Link to="/blogs" onClick={() => setIsOpen(false)} className={`mobile-link ${isActive('/blogs')}`}>Blog Articles</Link>
          </div>
        </>
      )}

      <style>{`
        .navbar-fixed-outer {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 10000;
          padding: 14px 16px;
          pointer-events: none;
          display: flex;
          justify-content: center;
        }

        .navbar-floating-capsule {
          pointer-events: auto;
          width: 100%;
          max-width: 840px;
          height: 50px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 999px;
          
          /* Ultra-Glassy Backdrop Filter & Translucent Colors */
          background: rgba(7, 7, 10, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(28px) saturate(210%);
          -webkit-backdrop-filter: blur(28px) saturate(210%);
          box-shadow: 
            0 15px 35px -10px rgba(0, 0, 0, 0.85),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.18),
            0 0 20px rgba(128, 10, 28, 0.18);
          transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
          position: relative;
          overflow: hidden;
        }

        .navbar-floating-capsule::before {
          content: '';
          position: absolute;
          top: 0; left: 15%; right: 15%; height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(246, 36, 64, 0.6) 50%, transparent 100%);
          pointer-events: none;
        }

        .navbar-floating-capsule.scrolled {
          background: rgba(5, 5, 8, 0.72);
          border-color: rgba(246, 36, 64, 0.35);
          box-shadow: 
            0 18px 45px -10px rgba(0, 0, 0, 0.95),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.22),
            0 0 22px var(--accent-red-glow);
          transform: translateY(-2px);
        }

        /* Light Mode Glassiness */
        body.light-theme .navbar-floating-capsule {
          background: rgba(255, 255, 255, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(28px) saturate(200%);
          -webkit-backdrop-filter: blur(28px) saturate(200%);
          box-shadow: 
            0 12px 32px -10px rgba(15, 23, 42, 0.08),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.9),
            0 0 15px rgba(246, 36, 64, 0.1);
        }

        body.light-theme .navbar-floating-capsule.scrolled {
          background: rgba(255, 255, 255, 0.75);
          border-color: rgba(246, 36, 64, 0.3);
          box-shadow: 
            0 16px 40px -10px rgba(15, 23, 42, 0.12),
            inset 0 1px 0 0 rgba(255, 255, 255, 1),
            0 0 20px rgba(246, 36, 64, 0.15);
        }

        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-sans);
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.5px;
        }

        .logo-icon { color: var(--accent-red); }
        .logo-accent { color: var(--accent-red); }

        .navbar-center-links {
          display: flex;
          align-items: center;
          gap: 22px;
        }

        .nav-link {
          font-family: var(--font-sans);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          position: relative;
          padding: 4px 0;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          transition: var(--transition-smooth);
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 50%;
          transform: translateX(-50%);
          width: 0; height: 2px;
          background: var(--accent-red);
          border-radius: 2px;
          box-shadow: 0 0 6px var(--accent-red);
          transition: width 0.3s ease;
        }

        .nav-link:hover, .nav-link.active {
          color: var(--text-primary);
        }

        .nav-link:hover::after, .nav-link.active::after {
          width: 100%;
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .theme-toggle-btn {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--border-color);
          cursor: pointer;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px; height: 32px;
          border-radius: 50%;
          transition: var(--transition-bounce);
        }

        body.light-theme .theme-toggle-btn {
          background: rgba(246, 36, 64, 0.08);
          border-color: rgba(246, 36, 64, 0.25);
          color: #0F172A;
        }

        .theme-toggle-btn:hover {
          color: var(--accent-red);
          border-color: var(--accent-red);
          box-shadow: 0 0 10px var(--accent-red-glow);
          transform: rotate(30deg) scale(1.08);
        }

        .mobile-toggle {
          display: none;
          background: transparent;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
        }

        .mobile-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          z-index: 9998;
          pointer-events: auto;
        }

        .mobile-menu-glass {
          position: fixed;
          top: 72px; left: 16px; right: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          z-index: 9999;
          pointer-events: auto;
          background: rgba(7, 7, 10, 0.88);
          border: 1px solid rgba(246, 36, 64, 0.3);
          backdrop-filter: blur(28px) saturate(200%);
          border-radius: var(--border-radius-md);
          box-shadow: 0 20px 40px rgba(0,0,0,0.9);
        }

        body.light-theme .mobile-menu-glass {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(246, 36, 64, 0.3);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.15);
        }

        .mobile-link {
          font-family: var(--font-sans);
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: var(--transition-smooth);
        }

        .mobile-link:hover, .mobile-link.active {
          color: var(--accent-red);
        }

        @media (max-width: 768px) {
          .navbar-center-links { display: none; }
          .mobile-toggle { display: block; }
          .navbar-floating-capsule { max-width: 100%; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
