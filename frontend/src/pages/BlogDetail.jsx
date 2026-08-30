import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Share2, BookOpen, Check, Tag } from 'lucide-react';
import { api } from '../services/api';
import MarkdownRenderer from '../components/MarkdownRenderer';

const calculateReadTime = content => {
  const words = (content || '').trim().split(/\s+/).length;
  return `${Math.ceil(words / 200)} min read`;
};

export const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [copied, setCopied]     = useState(false);
  const [readProgress, setReadProgress] = useState(0);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setReadProgress(Math.min(100, Math.max(0, progress)));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    api.getBlog(slug)
      .then(data => setBlog(data))
      .catch(() => setError('Article not found or you do not have permission to view it.'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="loader-container">
      <div className="loader" />
      <p>Loading article…</p>
    </div>
  );

  if (error || !blog) return (
    <div className="bd-error-page container">
      <div className="bd-error-card">
        <BookOpen size={28} className="bd-error-icon" />
        <h3>Article not found</h3>
        <p>{error || "We couldn't find the article you were looking for."}</p>
        <Link to="/blogs" className="btn btn-primary"><ArrowLeft size={15} /> Back to Articles</Link>
      </div>
    </div>
  );

  const readTime = calculateReadTime(blog.content);
  const dateStr  = new Date(blog.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="bd-page">
      {/* Reading progress bar */}
      <div className="bd-progress-bar" style={{ width: `${readProgress}%` }} />
      <div className="bd-ambient-glow" />

      <div className="container bd-container">

        {/* Back link */}
        <Link to="/blogs" className="bd-back-link">
          <ArrowLeft size={14} /> All Articles
        </Link>

        <article className="bd-article">

          {/* ── Article header ── */}
          <header className="bd-header">

            {/* Eyebrow */}
            <div className="bd-eyebrow">
              <BookOpen size={12} />
              <span>TECHNICAL ARTICLE</span>
              {!blog.is_published && <span className="bd-draft-badge">DRAFT</span>}
            </div>

            {/* Title */}
            <h1 className="bd-title">{blog.title}</h1>

            {/* Meta row */}
            <div className="bd-meta-row">
              <span className="bd-meta-item">
                <Calendar size={13} /> {dateStr}
              </span>
              <span className="bd-meta-sep" />
              <span className="bd-meta-item">
                <Clock size={13} /> {readTime}
              </span>
              <span className="bd-meta-sep" />
              <button onClick={handleShare} className="bd-share-btn">
                {copied ? <><Check size={13} /> Copied!</> : <><Share2 size={13} /> Share</>}
              </button>
            </div>

            {/* Author */}
            <div className="bd-author-row">
              <div className="bd-author-avatar">d37</div>
              <div className="bd-author-info">
                <span className="bd-author-name">devil37 (Omkar Pardeshi)</span>
                <span className="bd-author-role">AI/ML Engineer & Backend Architect</span>
              </div>
            </div>

            {/* Tags */}
            {blog.tags_list?.length > 0 && (
              <div className="bd-tags-row">
                <Tag size={12} className="bd-tags-icon" />
                {blog.tags_list.map((tag, i) => (
                  <span key={i} className="bd-tag">{tag}</span>
                ))}
              </div>
            )}
          </header>

          {/* ── Cover image ── */}
          {blog.cover_image_url && (
            <div className="bd-cover-wrap">
              <img src={blog.cover_image_url} alt={blog.title} className="bd-cover-img" />
              <div className="bd-cover-overlay" />
            </div>
          )}

          {/* ── Content ── */}
          <div className="bd-content">
            <MarkdownRenderer content={blog.content} />
          </div>

          {/* ── Footer: tags + nav ── */}
          <footer className="bd-footer">
            {blog.tags_list?.length > 0 && (
              <div className="bd-footer-tags">
                {blog.tags_list.map((tag, i) => (
                  <span key={i} className="bd-tag">{tag}</span>
                ))}
              </div>
            )}
            <Link to="/blogs" className="bd-back-footer-link">
              <ArrowLeft size={14} /> Back to all articles
            </Link>
          </footer>

        </article>
      </div>

      <style>{`
        /* ─── BLOG DETAIL PAGE — MINIMAL PROFESSIONAL ─── */
        .bd-page {
          padding-top: 100px;
          padding-bottom: 96px;
          text-align: left;
          position: relative;
          min-height: 100vh;
        }
        .bd-ambient-glow {
          position: absolute; right: -10%; top: 15%;
          width: 50vw; height: 50vw; max-width: 520px; max-height: 520px;
          background: radial-gradient(circle, rgba(128,10,28,0.14) 0%, transparent 70%);
          filter: blur(65px); pointer-events: none; z-index: 0;
        }

        /* Reading progress bar */
        .bd-progress-bar {
          position: fixed; top: 0; left: 0; height: 2px;
          background: var(--accent-red);
          z-index: 10001; transition: width 0.1s ease-out;
        }

        /* Container */
        .bd-container { max-width: 760px !important; position: relative; z-index: 1; }

        /* Back link */
        .bd-back-link {
          display: inline-flex; align-items: center; gap: 7px;
          font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700;
          color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1.5px;
          margin-bottom: 36px;
          transition: color 0.2s ease, transform 0.2s ease;
        }
        .bd-back-link:hover { color: var(--accent-red); transform: translateX(-2px); }

        /* Article */
        .bd-article { display: flex; flex-direction: column; gap: 0; }

        /* Header */
        .bd-header {
          display: flex; flex-direction: column; gap: 20px;
          padding-bottom: 32px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          margin-bottom: 32px;
        }

        .bd-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: var(--font-mono); font-size: 0.68rem; font-weight: 700;
          color: var(--accent-red); letter-spacing: 2px; text-transform: uppercase;
        }
        .bd-draft-badge {
          padding: 2px 7px; border-radius: 4px;
          background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.3);
          color: #f59e0b; font-size: 0.6rem;
        }

        .bd-title {
          font-family: var(--font-sans);
          font-size: clamp(1.75rem, 5vw, 2.6rem);
          font-weight: 800; line-height: 1.15;
          color: #FFFFFF; margin: 0; letter-spacing: -1px;
        }

        .bd-meta-row {
          display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
          font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);
        }
        .bd-meta-item { display: flex; align-items: center; gap: 5px; }
        .bd-meta-sep { width: 3px; height: 3px; border-radius: 50%; background: rgba(255,255,255,0.2); }
        .bd-share-btn {
          background: transparent; border: none; cursor: pointer;
          display: inline-flex; align-items: center; gap: 5px;
          font-family: var(--font-mono); font-size: 0.72rem;
          color: var(--text-muted); padding: 0;
          transition: color 0.2s ease;
        }
        .bd-share-btn:hover { color: var(--accent-red); }

        /* Author */
        .bd-author-row {
          display: flex; align-items: center; gap: 12px;
          padding: 14px 18px;
          background: rgba(10,10,15,0.65);
          border: 1px solid rgba(255,255,255,0.07);
          border-left: 2px solid var(--accent-red);
          border-radius: var(--border-radius-md);
        }
        .bd-author-avatar {
          width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, rgba(246,36,64,0.2) 0%, rgba(128,10,28,0.4) 100%);
          border: 1px solid rgba(246,36,64,0.35);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-mono); font-weight: 700; font-size: 0.78rem;
          color: var(--accent-red);
        }
        .bd-author-info { display: flex; flex-direction: column; gap: 2px; }
        .bd-author-name { font-weight: 700; font-size: 0.88rem; color: #FFFFFF; }
        .bd-author-role { font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-secondary); }

        /* Tags */
        .bd-tags-row {
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
        }
        .bd-tags-icon { color: var(--text-muted); flex-shrink: 0; }
        .bd-tag {
          font-family: var(--font-mono); font-size: 0.65rem; font-weight: 600;
          color: var(--text-secondary); padding: 3px 9px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09);
          border-radius: 4px; letter-spacing: 0.3px;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .bd-tag:hover { background: rgba(246,36,64,0.1); color: #FFFFFF; }

        /* Cover image */
        .bd-cover-wrap {
          position: relative; width: 100%;
          max-height: 420px; border-radius: var(--border-radius-md);
          overflow: hidden; margin-bottom: 36px;
          border: 1px solid rgba(255,255,255,0.07);
        }
        .bd-cover-img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .bd-cover-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 50%, rgba(10,10,15,0.6) 100%);
          pointer-events: none;
        }

        /* Content */
        .bd-content {
          padding: 40px 44px;
          font-size: 1.05rem;
          line-height: 1.88;
          color: var(--text-body);
          background: rgba(10,10,15,0.65);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: var(--border-radius-md);
          margin-bottom: 36px;
        }

        /* Footer */
        .bd-footer {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 16px;
          padding-top: 28px;
          border-top: 1px solid rgba(255,255,255,0.07);
        }
        .bd-footer-tags { display: flex; flex-wrap: wrap; gap: 7px; }
        .bd-back-footer-link {
          display: inline-flex; align-items: center; gap: 7px;
          font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700;
          color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1.5px;
          margin-left: auto;
          transition: color 0.2s ease, transform 0.2s ease;
        }
        .bd-back-footer-link:hover { color: var(--accent-red); transform: translateX(-2px); }

        /* Error page */
        .bd-error-page { padding-top: 160px; padding-bottom: 80px; }
        .bd-error-card {
          display: flex; flex-direction: column; align-items: center; gap: 16px;
          text-align: center; padding: 64px 32px;
          border: 1px dashed rgba(255,255,255,0.1);
          border-radius: var(--border-radius-lg);
        }
        .bd-error-icon { color: rgba(246,36,64,0.45); }
        .bd-error-card h3 { font-size: 1.15rem; font-weight: 700; color: #FFFFFF; margin: 0; }
        .bd-error-card p { color: var(--text-secondary); font-size: 0.9rem; margin: 0; }

        /* Light mode */
        body.light-theme .bd-title { color: #0F172A; }
        body.light-theme .bd-author-row { background: #F8FAFC; border-color: rgba(0,0,0,0.08); }
        body.light-theme .bd-author-name { color: #0F172A; }
        body.light-theme .bd-content { background: #FFFFFF; border-color: rgba(0,0,0,0.08); color: #1E293B; }
        body.light-theme .bd-tag { background: rgba(0,0,0,0.04); border-color: rgba(0,0,0,0.09); color: #475569; }
        body.light-theme .bd-cover-wrap { border-color: rgba(0,0,0,0.1); }
        body.light-theme .bd-footer { border-top-color: rgba(0,0,0,0.08); }
        body.light-theme .bd-error-card h3 { color: #0F172A; }

        @media (max-width: 768px) {
          .bd-page { padding-top: 80px; }
          .bd-title { font-size: 1.75rem; }
          .bd-content { padding: 24px 20px; font-size: 0.97rem; }
          .bd-header { gap: 16px; }
        }
        @media (max-width: 520px) {
          .bd-content { padding: 18px 16px; }
          .bd-footer { flex-direction: column; align-items: flex-start; }
          .bd-back-footer-link { margin-left: 0; }
        }
      `}</style>
    </div>
  );
};

export default BlogDetail;
