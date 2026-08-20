import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Share2, BookOpen, Check, Sparkles } from 'lucide-react';
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
      <p>Loading article content...</p>
    </div>
  );

  if (error || !blog) return (
    <div className="blog-error-page container section">
      <div className="empty-state glass-panel">
        <Sparkles size={32} className="empty-icon-accent" />
        <h3>Error loading article</h3>
        <p>{error || "We couldn't find the article you were looking for."}</p>
        <Link to="/blogs" className="btn btn-primary"><ArrowLeft size={16} /> Back to Articles</Link>
      </div>
    </div>
  );

  return (
    <div className="blog-detail-page">
      {/* Top Reading Progress Bar */}
      <div className="reading-progress-bar" style={{ width: `${readProgress}%` }} />

      <div className="blogdetail-ambient-glow" />

      <div className="container blog-detail-container">
        <Link to="/blogs" className="back-link">
          <ArrowLeft size={15} /> Back to Articles
        </Link>

        <article className="blog-post-wrapper">
          <header className="post-header">
            <div className="post-meta-strip">
              <span className="meta-item"><Calendar size={13} className="accent-red-icon" />{new Date(blog.created_at).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</span>
              <span className="meta-item"><Clock size={13} className="accent-red-icon" />{calculateReadTime(blog.content)}</span>
              <span className="meta-item"><BookOpen size={13} className="accent-red-icon" />Technical Deep Dive</span>
              <button onClick={handleShare} className="meta-item share-btn" title="Copy Article URL">
                {copied ? <Check size={13} className="accent-red-icon" /> : <Share2 size={13} />}
                <span>{copied ? 'Link Copied!' : 'Share'}</span>
              </button>
              {!blog.is_published && <span className="badge draft-badge">Draft</span>}
            </div>

            <h1 className="post-title">{blog.title}</h1>

            {/* Author Badge Bar */}
            <div className="author-badge-bar glass-panel">
              <div className="author-avatar">d37</div>
              <div className="author-details">
                <span className="author-name">devil37 (Omkar Pardeshi)</span>
                <span className="author-role">AI/ML Engineer &amp; Backend Architect</span>
              </div>
            </div>

            <div className="post-tags">
              {blog.tags_list.map((tag, i) => <span key={i} className="tag tag-cyan">{tag}</span>)}
            </div>
          </header>

          {blog.cover_image_url && (
            <div className="post-cover-image">
              <img src={blog.cover_image_url} alt={blog.title} />
              <div className="image-overlay-glow" />
            </div>
          )}

          {/* Reading Column */}
          <div className="post-content glass-panel">
            <MarkdownRenderer content={blog.content} />
          </div>
        </article>
      </div>

      <style>{`
        .blog-detail-page {
          padding-top: 100px;
          padding-bottom: 80px;
          text-align: left;
          position: relative;
        }

        .blogdetail-ambient-glow {
          position: absolute; right: -10%; top: 15%;
          width: 50vw; height: 50vw; max-width: 550px; max-height: 550px;
          background: radial-gradient(circle, rgba(128, 10, 28, 0.18) 0%, rgba(246, 36, 64, 0.05) 50%, transparent 70%);
          filter: blur(65px); pointer-events: none;
        }
        body.light-theme .blogdetail-ambient-glow {
          background: radial-gradient(circle, rgba(246, 36, 64, 0.12) 0%, rgba(153, 0, 17, 0.03) 50%, transparent 70%);
        }

        .reading-progress-bar {
          position: fixed;
          top: 0; left: 0;
          height: 3px;
          background: var(--accent-red);
          box-shadow: 0 0 10px var(--accent-red);
          z-index: 10001;
          transition: width 0.1s ease-out;
        }

        .blog-detail-container {
          max-width: 840px !important;
          position: relative;
          z-index: 1;
        }

        .back-link {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 0.78rem; font-weight: 600;
          font-family: var(--font-mono);
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 24px;
          transition: var(--transition-smooth);
        }
        .back-link:hover { color: var(--accent-red); transform: translateX(-2px); }

        .post-header { margin-bottom: 32px; }
        .post-meta-strip {
          display: flex; gap: 18px; flex-wrap: wrap; align-items: center;
          font-family: var(--font-mono); font-size: 0.75rem;
          color: var(--text-muted); margin-bottom: 16px;
        }
        .meta-item { display: flex; align-items: center; gap: 6px; }
        .accent-red-icon { color: var(--accent-red); }
        
        .share-btn {
          background: transparent; border: none; cursor: pointer;
          color: var(--text-muted); font-family: inherit; font-size: inherit;
          padding: 0; display: flex; align-items: center; gap: 6px;
          transition: var(--transition-smooth);
        }
        .share-btn:hover { color: var(--accent-red); }

        .post-title {
          font-family: var(--font-sans);
          font-size: clamp(2rem, 5vw, 2.75rem);
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 24px;
          color: var(--text-primary);
          letter-spacing: -1px;
        }

        .author-badge-bar {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 20px;
          margin-bottom: 24px;
          border-radius: var(--border-radius-md);
          border-left: 3px solid var(--accent-red);
        }
        .author-avatar {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(246,36,64,0.15) 0%, rgba(128,10,28,0.3) 100%);
          border: 1px solid rgba(246, 36, 64, 0.3);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-mono); font-weight: 700; font-size: 0.85rem;
          color: var(--accent-red);
          flex-shrink: 0;
        }
        .author-details { display: flex; flex-direction: column; }
        .author-name { font-weight: 700; font-size: 0.92rem; color: var(--text-primary); }
        .author-role { font-size: 0.75rem; color: var(--text-secondary); font-family: var(--font-mono); }

        .post-tags { display: flex; flex-wrap: wrap; gap: 8px; }

        .post-cover-image {
          width: 100%; max-height: 420px;
          border-radius: var(--border-radius-md);
          overflow: hidden; margin-bottom: 36px;
          border: 1px solid var(--border-color);
          position: relative;
        }
        .post-cover-image img { width: 100%; height: 100%; object-fit: cover; display: block; }
        
        .post-content {
          padding: 44px;
          font-size: 1.05rem;
          line-height: 1.85;
          color: var(--text-body);
        }

        /* Light Mode Overrides */
        body.light-theme .post-title { color: #0F172A; }
        body.light-theme .post-content { background: #FFFFFF; border: 1px solid rgba(0, 0, 0, 0.08); color: #1E293B; }
        body.light-theme .author-badge-bar { background: #F8FAFC; border: 1px solid rgba(0,0,0,0.08); border-left-color: var(--accent-red); }
        body.light-theme .author-name { color: #0F172A; }

        @media (max-width: 768px) {
          .post-title { font-size: 2rem; }
          .post-content { padding: 22px; }
        }
      `}</style>
    </div>
  );
};

export default BlogDetail;
