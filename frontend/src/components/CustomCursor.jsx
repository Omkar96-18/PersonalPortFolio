import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const CustomCursor = () => {
  const redDotRef = useRef(null);
  const xrayLensRef = useRef(null);
  const ringRef = useRef(null);
  const isHoveredRef = useRef(false);
  const isMouseDownRef = useRef(false);

  useEffect(() => {
    const redDot = redDotRef.current;
    const xrayLens = xrayLensRef.current;
    const ring = ringRef.current;
    if (!redDot || !xrayLens || !ring) return;

    // Instant GPU coordinate setters for zero latency on inner elements
    const xCenterSetter = gsap.quickSetter([redDot, xrayLens], "x", "px");
    const yCenterSetter = gsap.quickSetter([redDot, xrayLens], "y", "px");

    // Comprehensive interactive element detector
    const checkClickable = (target) => {
      if (!target || target === document.body || target === document.documentElement) return false;
      
      const clickableSelector = [
        'a', 'button', 'input', 'textarea', 'select', 'summary', 'label',
        '[role="button"]', '[role="link"]', '[role="checkbox"]', '[role="tab"]',
        '[tabindex]:not([tabindex="-1"])',
        '.btn', '.tag', '.clickable', '.nav-link', '.mobile-link',
        '.project-card', '.insight-card', '.blog-card', '.skill-metric-card',
        '.stat-card', '.spec-close-btn', '.skill-related-project-pill',
        '.catalog-trigger-btn', '.in-place-expand-card', '.theme-toggle-btn',
        '.mobile-toggle', '.tag-filter-btn', '.read-more-link', '.btn-read-more'
      ].join(',');

      try {
        if (target.matches && target.matches(clickableSelector)) return true;
        if (target.closest && target.closest(clickableSelector)) return true;
        const comp = window.getComputedStyle(target);
        if (comp && comp.cursor === 'pointer') return true;
      } catch (e) {}

      return false;
    };

    const setHoverState = (hovered) => {
      if (isHoveredRef.current === hovered) return;
      isHoveredRef.current = hovered;

      if (hovered) {
        // Dissolve default red dot and bloom the crystal-clear inverted X-Ray lens
        gsap.to(redDot, {
          scale: 2.3,
          opacity: 0,
          duration: 0.2,
          ease: 'power2.out',
          overwrite: 'auto'
        });
        gsap.to(xrayLens, {
          scale: 2,
          opacity: 1,
          duration: 0.24,
          ease: 'power2.out',
          overwrite: 'auto'
        });
        gsap.to(ring, {
          scale: 2,
          borderColor: 'rgba(255, 255, 255, 0.75)',
          boxShadow: '0 0 16px rgba(246, 36, 64, 0.45)',
          duration: 0.24,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      } else {
        // Return to glowing red cyber dot
        gsap.to(redDot, {
          scale: isMouseDownRef.current ? 0.7 : 1,
          opacity: 1,
          duration: 0.22,
          ease: 'power2.out',
          overwrite: 'auto'
        });
        gsap.to(xrayLens, {
          scale: 0.25,
          opacity: 0,
          duration: 0.2,
          ease: 'power2.out',
          overwrite: 'auto'
        });
        gsap.to(ring, {
          scale: isMouseDownRef.current ? 0.85 : 1,
          borderColor: 'rgba(246, 36, 64, 0.65)',
          boxShadow: '0 0 10px rgba(246, 36, 64, 0.3)',
          duration: 0.22,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    };

    const onMouseMove = (e) => {
      xCenterSetter(e.clientX);
      yCenterSetter(e.clientY);

      // Smooth elastic follower for outer ring
      gsap.to(ring, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.16,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    };

    const onMouseOver = (e) => {
      if (checkClickable(e.target)) {
        setHoverState(true);
      }
    };

    const onMouseOut = (e) => {
      const nextTarget = e.relatedTarget;
      if (!checkClickable(nextTarget)) {
        setHoverState(false);
      }
    };

    const onMouseDown = () => {
      isMouseDownRef.current = true;
      if (isHoveredRef.current) {
        gsap.to(xrayLens, { scale: 0.85, duration: 0.12, ease: 'power2.out' });
        gsap.to(ring, { scale: 1.35, duration: 0.12, ease: 'power2.out' });
      } else {
        gsap.to(redDot, { scale: 0.7, duration: 0.12, ease: 'power2.out' });
        gsap.to(ring, { scale: 0.85, duration: 0.12, ease: 'power2.out' });
      }
    };

    const onMouseUp = () => {
      isMouseDownRef.current = false;
      if (isHoveredRef.current) {
        gsap.to(xrayLens, { scale: 1, duration: 0.16, ease: 'power2.out' });
        gsap.to(ring, { scale: 1.65, duration: 0.16, ease: 'power2.out' });
      } else {
        gsap.to(redDot, { scale: 1, duration: 0.16, ease: 'power2.out' });
        gsap.to(ring, { scale: 1, duration: 0.16, ease: 'power2.out' });
      }
    };

    const onMouseLeave = () => {
      gsap.to([redDot, xrayLens, ring], { opacity: 0, duration: 0.2 });
    };

    const onMouseEnter = () => {
      if (isHoveredRef.current) {
        gsap.to(xrayLens, { opacity: 1, duration: 0.2 });
      } else {
        gsap.to(redDot, { opacity: 1, duration: 0.2 });
      }
      gsap.to(ring, { opacity: 1, duration: 0.2 });
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseout', onMouseOut, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  return (
    <>
      {/* 1. Default Vibrant Crimson Glowing Cyber Dot */}
      <div ref={redDotRef} className="custom-cursor-red-dot" />

      {/* 2. Scaled Crystal Clear Inverted X-Ray Lens (Active on Hover) */}
      <div ref={xrayLensRef} className="custom-cursor-xray-lens" />

      {/* 3. Smooth Trailing Aura Ring */}
      <div ref={ringRef} className="custom-cursor-ring" />

      <style>{`
        .custom-cursor-red-dot {
          width: 9px;
          height: 9px;
          background-color: #F62440;
          border-radius: 50%;
          position: fixed;
          left: 0;
          top: 0;
          transform: translate(-50%, -50%);
          pointer-events: none !important;
          z-index: 9999999;
          box-shadow: 0 0 12px 3px rgba(246, 36, 64, 0.85);
          will-change: transform, opacity;
        }

        .custom-cursor-xray-lens {
          width: 28px;
          height: 28px;
          background-color: #FFFFFF;
          mix-blend-mode: difference !important;
          border-radius: 50%;
          position: fixed;
          left: 0;
          top: 0;
          transform: translate(-50%, -50%) scale(0.25);
          opacity: 0;
          pointer-events: none !important;
          z-index: 9999999;
          border: 1px solid rgba(255, 255, 255, 0.95);
          will-change: transform, opacity;
        }

        .custom-cursor-ring {
          width: 28px;
          height: 28px;
          border: 1.5px solid rgba(246, 36, 64, 0.65);
          border-radius: 50%;
          position: fixed;
          left: 0;
          top: 0;
          transform: translate(-50%, -50%);
          pointer-events: none !important;
          z-index: 9999998;
          box-shadow: 0 0 10px rgba(246, 36, 64, 0.3);
          will-change: transform, border-color, box-shadow;
        }

        /* Hide system cursor on desktop */
        @media (pointer: fine) {
          *, body, a, button, input, textarea, select {
            cursor: none !important;
          }
        }

        /* Disable custom cursor on touch / mobile devices */
        @media (max-width: 768px), (pointer: coarse) {
          .custom-cursor-red-dot, .custom-cursor-xray-lens, .custom-cursor-ring {
            display: none !important;
          }
          *, body, a, button, input, textarea, select {
            cursor: auto !important;
          }
        }
      `}</style>
    </>
  );
};

export default CustomCursor;
