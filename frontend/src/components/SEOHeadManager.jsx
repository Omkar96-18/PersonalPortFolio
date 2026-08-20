import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';

export const SEOHeadManager = ({ profile: initialProfile }) => {
  const location = useLocation();

  useEffect(() => {
    const applyMeta = (p) => {
      if (!p) return;

      // 1. Dynamic Favicon / Head Title Image
      const faviconUrl = p.favicon_url || p.avatar_url;
      if (faviconUrl) {
        let favicon = document.getElementById('dynamic-favicon');
        if (!favicon) {
          favicon = document.createElement('link');
          favicon.id = 'dynamic-favicon';
          favicon.rel = 'icon';
          document.head.appendChild(favicon);
        }
        favicon.href = faviconUrl;

        let appleIcon = document.getElementById('dynamic-apple-icon');
        if (!appleIcon) {
          appleIcon = document.createElement('link');
          appleIcon.id = 'dynamic-apple-icon';
          appleIcon.rel = 'apple-touch-icon';
          document.head.appendChild(appleIcon);
        }
        appleIcon.href = faviconUrl;
      }

      // 2. Dynamic Title
      const pageTitle = p.site_title || `${p.name || 'devil37'} | ${p.title || 'AI/ML Engineer & Backend Architect'}`;
      if (location.pathname.includes('/blogs/')) {
        // Individual blog posts manage their own specific titles
      } else if (location.pathname.includes('/blogs')) {
        document.title = `Technical Blog & Research | ${p.name || 'devil37'}`;
      } else if (location.pathname.includes('/admin/dashboard')) {
        document.title = `Admin Control Matrix | ${p.name || 'devil37'}`;
      } else if (location.pathname.includes('/admin/login')) {
        document.title = `Admin Security Login | ${p.name || 'devil37'}`;
      } else {
        document.title = pageTitle;
      }

      // 3. Dynamic Description
      const desc = p.seo_description || p.bio || 'AI/ML Engineer & Backend Architect specializing in Agentic RAG Systems and High-Performance Microservices.';
      const descMeta = document.querySelector('meta[name="description"]');
      if (descMeta) descMeta.setAttribute('content', desc);

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', desc);

      const twitterDesc = document.querySelector('meta[name="twitter:description"]');
      if (twitterDesc) twitterDesc.setAttribute('content', desc);

      // 4. Dynamic Keywords
      const keywords = p.seo_keywords || 'Omkar Pardeshi, devil37, AI Engineer, Machine Learning, Deep Learning, Backend Architect, Django, FastAPI, PyTorch, LangChain, CrewAI, RAG, Python';
      const keyMeta = document.querySelector('meta[name="keywords"]');
      if (keyMeta) keyMeta.setAttribute('content', keywords);

      // 5. Open Graph Image
      const ogImg = document.getElementById('og-image');
      if (ogImg && faviconUrl) ogImg.setAttribute('content', faviconUrl);

      const twImg = document.getElementById('twitter-image');
      if (twImg && faviconUrl) twImg.setAttribute('content', faviconUrl);
    };

    if (initialProfile) {
      applyMeta(initialProfile);
    } else {
      api.getProfile()
        .then(data => applyMeta(data))
        .catch(err => console.debug('SEO metadata applied with defaults.'));
    }
  }, [initialProfile, location.pathname]);

  return null;
};

export default SEOHeadManager;
