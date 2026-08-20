import React, { useState, useEffect } from 'react';
import { ChevronUp, Terminal } from 'lucide-react';

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button 
      onClick={scrollToTop} 
      className="scroll-to-top-btn glass-panel animate-in"
      aria-label="Scroll to top & terminal"
      title="devil37@portfolio:~$ cd /top"
    >
      <div className="scroll-btn-inner">
        <Terminal size={14} className="terminal-btn-icon" />
        <span className="scroll-btn-text">TOP</span>
        <ChevronUp size={16} className="chevron-icon" />
      </div>

      <style>{`
        .scroll-to-top-btn {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9990;
          padding: 10px 16px;
          background: rgba(7, 7, 10, 0.75);
          border: 1px solid rgba(246, 36, 64, 0.4);
          border-radius: 999px;
          cursor: pointer;
          color: #FFFFFF;
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8), 0 0 15px rgba(246, 36, 64, 0.25);
          transition: all 0.35s cubic-bezier(0.25, 1, 0.5, 1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        body.light-theme .scroll-to-top-btn {
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(246, 36, 64, 0.35);
          color: #0F172A;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12), 0 0 15px rgba(246, 36, 64, 0.15);
        }

        .scroll-btn-inner {
          display: flex;
          align-items: center;
          gap: 7px;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .terminal-btn-icon {
          color: var(--accent-red);
        }

        .chevron-icon {
          color: var(--accent-red);
          transition: transform 0.3s ease;
        }

        .scroll-to-top-btn:hover {
          transform: translateY(-4px) scale(1.05);
          background: var(--accent-red);
          border-color: var(--accent-red);
          color: #FFFFFF;
          box-shadow: 0 15px 35px rgba(246, 36, 64, 0.4), 0 0 25px var(--accent-red);
        }

        .scroll-to-top-btn:hover .terminal-btn-icon,
        .scroll-to-top-btn:hover .chevron-icon {
          color: #FFFFFF;
        }

        .scroll-to-top-btn:hover .chevron-icon {
          transform: translateY(-2px);
        }

        @keyframes animateIn {
          from { opacity: 0; transform: translateY(20px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-in {
          animation: animateIn 0.3s cubic-bezier(0.25, 1, 0.5, 1);
        }

        @media (max-width: 600px) {
          .scroll-to-top-btn {
            bottom: 20px;
            right: 18px;
            padding: 8px 12px;
          }
          .scroll-btn-text { display: none; }
        }
      `}</style>
    </button>
  );
};

export default ScrollToTop;
