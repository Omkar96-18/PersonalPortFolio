import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, ArrowRight, Clock, BookOpen, BookOpenText, X, Sparkles } from 'lucide-react';
import { api } from '../services/api';

const calculateReadTime = content => {
  const words = (content || '').trim().split(/\s+/).length;
  return `${Math.ceil(words / 200)} min`;
};

export const BlogList = () => {
  const [blogs, setBlogs]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    api.getBlogs()
      .then(data => setBlogs(data || []))
      .catch(err => console.error('Failed to fetch blogs', err))
      .finally(() => setLoading(false));
  }, []);

  const allTags = Array.from(new Set(blogs.flatMap(b => b.tags_list || [])));

  const filteredBlogs = blogs.filter(blog => {
    const s = searchQuery.toLowerCase();
    const matchSearch = blog.title.toLowerCase().includes(s) ||
                        blog.excerpt.toLowerCase().includes(s);
    const matchTag    = selectedTag ? blog.tags_list.includes(selectedTag) : true;
    return matchSearch && matchTag;
  });

  if (loading) return (
    <div className="loader-container">
      <div className="loader" />
      <p>Loading articles...</p>
    </div>
  );

  return (
    <div className="bloglist-page">
      <div className="bloglist-ambient-glow" />

      <div className="container">

        {/* ── Page Header ── */}
        <div className="bl-page-header">
          <div className="bl-header-left">
            <div className="bl-eyebrow">
              <BookOpen size={12} />
              <span>ENGINEERING PUBLICATIONS</span>
            </div>
            <h1 className="bl-page-title">Technical Articles</h1>
          </div>
          <p className="bl-page-lead">
            Deep dives on Retrieval-Augmented Generation (RAG), agentic AI workflows, microservice design, and distributed systems.
          </p>
        </div>

        {/* ── Toolbar: search + tag strip ── */}
        <div className="bl-toolbar">
          <div className="bl-search">
            <Search size={15} className="bl-search-icon" />
            <input
              type="text"
              placeholder="Search by title, keyword or topic…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="bl-clear-btn">
                <X size={13} />
              </button>
            )}
          </div>

          <div className="bl-tag-strip">
            <button
              className={`bl-tag-btn ${selectedTag === '' ? 'active' : ''}`}
              onClick={() => setSelectedTag('')}
            >
              All <span className="bl-tag-count">{blogs.length}</span>
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                className={`bl-tag-btn ${selectedTag === tag ? 'active' : ''}`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* ── Articles grid / empty ── */}
        {filteredBlogs.length === 0 ? (
          <div className="bl-empty">
            <Sparkles size={28} className="bl-empty-icon" />
            <h3>No articles match your filters</h3>
            <p>Try clearing the search query or selecting a different tag.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedTag(''); }}
              className="btn btn-secondary btn-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="bl-grid">
            {filteredBlogs.map((blog, idx) => {
              const readTime = calculateReadTime(blog.content);
              const primaryTag = blog.tags_list?.[0] || 'Article';
              const dateStr = new Date(blog.created_at).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
              });

              return (
                <article key={blog.id} className="bl-card">

                  {/* Cover / placeholder */}
                  <Link to={`/blogs/${blog.slug}`} className="bl-card-img-wrap">
                    {blog.cover_image_url ? (
                      <img src={blog.cover_image_url} alt={blog.title} className="bl-card-img" />
                    ) : (
                      <div className="bl-card-placeholder">
                        <BookOpenText size={28} />
                      </div>
                    )}
                    <div className="bl-card-img-overlay" />
                    <span className="bl-primary-tag">{primaryTag}</span>
                    {!blog.is_published && <span className="bl-draft-chip">DRAFT</span>}
                  </Link>

                  {/* Body */}
                  <div className="bl-card-body">
                    <div className="bl-card-meta">
                      <span><Calendar size={11} /> {dateStr}</span>
                      <span className="bl-meta-dot" />
                      <span><Clock size={11} /> {readTime} read</span>
                    </div>

                    <h2 className="bl-card-title">
                      <Link to={`/blogs/${blog.slug}`}>{blog.title}</Link>
                    </h2>

                    <p className="bl-card-excerpt">{blog.excerpt}</p>

                    <div className="bl-card-footer">
                      {blog.tags_list?.slice(0, 3).map((tag, i) => (
                        <span key={i} className="bl-tag-pill">#{tag}</span>
                      ))}
                      <Link to={`/blogs/${blog.slug}`} className="bl-read-link">
                        Read <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>

                </article>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        /* ─── BLOG LIST PAGE — MINIMAL PROFESSIONAL ─── */
        .bloglist-page {
          padding-top: 100px;
          padding-bottom: 96px;
          text-align: left;
          position: relative;
          min-height: 100vh;
        }
        .bloglist-ambient-glow {
          position: absolute; left: -10%; top: 10%;
          width: 50vw; height: 50vw; max-width: 520px; max-height: 520px;
          background: radial-gradient(circle, rgba(128,10,28,0.15) 0%, transparent 70%);
          filter: blur(65px); pointer-events: none; z-index: 0;
        }
        .bloglist-page .container { position: relative; z-index: 1; }

        /* Page header */
        .bl-page-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 40px; margin-bottom: 52px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding-bottom: 36px;
        }
        .bl-header-left { display: flex; flex-direction: column; gap: 10px; flex-shrink: 0; }
        .bl-eyebrow {
          display: inline-flex; align-items: center; gap: 7px;
          font-family: var(--font-mono); font-size: 0.68rem; font-weight: 700;
          color: var(--accent-red); letter-spacing: 2px; text-transform: uppercase;
        }
        .bl-page-title {
          font-family: var(--font-sans); font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 800; color: #FFFFFF; margin: 0; letter-spacing: -1.5px; line-height: 1.05;
        }
        .bl-page-lead {
          font-size: 1rem; color: var(--text-secondary); line-height: 1.75;
          max-width: 460px; margin: 0; text-align: right;
        }

        /* Toolbar */
        .bl-toolbar {
          display: flex; flex-direction: column; gap: 16px;
          margin-bottom: 44px;
          padding: 18px 22px;
          background: rgba(10,10,15,0.6);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: var(--border-radius-md);
        }
        .bl-search {
          display: flex; align-items: center; gap: 10px;
          background: rgba(0,0,0,0.35);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: var(--border-radius-sm);
          padding: 10px 14px;
          transition: border-color 0.25s ease;
        }
        .bl-search:focus-within { border-color: rgba(246,36,64,0.45); }
        .bl-search-icon { color: var(--accent-red); flex-shrink: 0; }
        .bl-search input {
          background: transparent; border: none;
          color: var(--text-primary); width: 100%;
          font-size: 0.92rem; font-family: var(--font-sans);
          outline: none;
        }
        .bl-search input::placeholder { color: var(--text-muted); }
        .bl-clear-btn {
          background: transparent; border: none;
          color: var(--text-muted); cursor: pointer;
          padding: 2px; display: flex; transition: color 0.2s ease;
        }
        .bl-clear-btn:hover { color: var(--accent-red); }

        .bl-tag-strip {
          display: flex; align-items: center; flex-wrap: wrap; gap: 8px;
        }
        .bl-tag-btn {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: var(--text-secondary);
          padding: 5px 12px;
          border-radius: var(--border-radius-sm);
          cursor: pointer; font-size: 0.72rem; font-weight: 600;
          font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.5px;
          transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
        }
        .bl-tag-btn:hover { background: rgba(246,36,64,0.1); border-color: rgba(246,36,64,0.3); color: #FFFFFF; }
        .bl-tag-btn.active {
          background: var(--accent-red); border-color: var(--accent-red);
          color: #FFFFFF;
        }
        .bl-tag-count {
          font-size: 0.6rem; opacity: 0.65;
          background: rgba(255,255,255,0.12);
          padding: 1px 5px; border-radius: 4px;
        }

        /* Grid */
        .bl-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        /* Card */
        .bl-card {
          display: flex; flex-direction: column;
          background: rgba(10,10,15,0.65);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: var(--border-radius-md);
          overflow: hidden;
          transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
        }
        .bl-card:hover {
          border-color: rgba(246,36,64,0.35);
          box-shadow: 0 16px 40px -12px rgba(0,0,0,0.85);
          transform: translateY(-4px);
        }

        .bl-card-img-wrap {
          display: block; position: relative;
          height: 180px; overflow: hidden; flex-shrink: 0;
        }
        .bl-card-img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.55s cubic-bezier(0.25,1,0.5,1);
          display: block;
        }
        .bl-card:hover .bl-card-img { transform: scale(1.05); }
        .bl-card-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 35%, rgba(10,10,15,0.75) 100%);
          pointer-events: none;
        }
        .bl-primary-tag {
          position: absolute; bottom: 12px; left: 12px;
          font-family: var(--font-mono); font-size: 0.62rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 1px;
          padding: 3px 8px; border-radius: 4px;
          background: rgba(128,10,28,0.9); border: 1px solid rgba(246,36,64,0.5);
          color: #FFFFFF;
        }
        .bl-draft-chip {
          position: absolute; top: 10px; right: 10px;
          font-family: var(--font-mono); font-size: 0.6rem; font-weight: 700;
          padding: 2px 7px; border-radius: 4px;
          background: rgba(245,158,11,0.18); border: 1px solid rgba(245,158,11,0.35);
          color: #f59e0b; letter-spacing: 1px;
        }
        .bl-card-placeholder {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, rgba(128,10,28,0.18) 0%, rgba(7,7,10,0.9) 100%);
          color: rgba(246,36,64,0.4);
        }

        .bl-card-body { padding: 22px; display: flex; flex-direction: column; flex-grow: 1; gap: 10px; }
        .bl-card-meta {
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
          font-family: var(--font-mono); font-size: 0.68rem; color: var(--text-muted);
        }
        .bl-card-meta span { display: flex; align-items: center; gap: 4px; }
        .bl-meta-dot { width: 3px; height: 3px; border-radius: 50%; background: rgba(255,255,255,0.2); }

        .bl-card-title {
          font-family: var(--font-sans); font-size: 1.1rem; font-weight: 800;
          line-height: 1.3; letter-spacing: -0.3px; margin: 0;
        }
        .bl-card-title a { color: #FFFFFF; text-decoration: none; transition: color 0.2s ease; }
        .bl-card-title a:hover { color: var(--accent-red); }

        .bl-card-excerpt {
          font-size: 0.87rem; color: var(--text-secondary); line-height: 1.65;
          margin: 0; flex-grow: 1;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
        }

        .bl-card-footer {
          display: flex; align-items: center; gap: 7px; flex-wrap: wrap;
          border-top: 1px solid rgba(255,255,255,0.05);
          padding-top: 14px; margin-top: auto;
        }
        .bl-tag-pill {
          font-family: var(--font-mono); font-size: 0.65rem; font-weight: 600;
          color: var(--text-secondary); letter-spacing: 0.3px;
          padding: 3px 8px; border-radius: 4px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
          transition: background 0.2s ease;
        }
        .bl-card:hover .bl-tag-pill { background: rgba(246,36,64,0.08); border-color: rgba(246,36,64,0.2); }
        .bl-read-link {
          margin-left: auto; display: inline-flex; align-items: center; gap: 5px;
          font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700;
          color: var(--accent-red); text-transform: uppercase; letter-spacing: 1px;
          transition: gap 0.2s ease;
        }
        .bl-read-link:hover { gap: 8px; }

        /* Empty state */
        .bl-empty {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 14px; padding: 80px 20px; text-align: center;
          color: var(--text-secondary); font-size: 0.92rem;
          border: 1px dashed rgba(255,255,255,0.1); border-radius: var(--border-radius-lg);
        }
        .bl-empty-icon { color: rgba(246,36,64,0.4); }
        .bl-empty h3 { font-size: 1.15rem; font-weight: 700; color: #FFFFFF; margin: 0; }
        .bl-empty p { margin: 0; }

        /* Light mode */
        body.light-theme .bl-page-title { color: #0F172A; }
        body.light-theme .bl-toolbar { background: #FFFFFF; border-color: rgba(0,0,0,0.08); }
        body.light-theme .bl-search { background: #F8FAFC; border-color: rgba(0,0,0,0.1); }
        body.light-theme .bl-search input { color: #0F172A; }
        body.light-theme .bl-tag-btn { background: rgba(0,0,0,0.04); border-color: rgba(0,0,0,0.1); color: #475569; }
        body.light-theme .bl-tag-btn:hover { background: rgba(246,36,64,0.08); color: #0F172A; }
        body.light-theme .bl-tag-btn.active { background: var(--accent-red); color: #FFFFFF; }
        body.light-theme .bl-card { background: #FFFFFF; border-color: rgba(0,0,0,0.08); }
        body.light-theme .bl-card-title a { color: #0F172A; }
        body.light-theme .bl-card-excerpt { color: #475569; }
        body.light-theme .bl-card-footer { border-top-color: rgba(0,0,0,0.07); }
        body.light-theme .bl-tag-pill { background: rgba(0,0,0,0.04); border-color: rgba(0,0,0,0.09); color: #475569; }
        body.light-theme .bl-empty h3 { color: #0F172A; }

        @media (max-width: 960px) {
          .bl-page-header { flex-direction: column; align-items: flex-start; }
          .bl-page-lead { text-align: left; max-width: 100%; }
        }
        @media (max-width: 600px) {
          .bloglist-page { padding-top: 80px; }
          .bl-grid { grid-template-columns: 1fr; }
          .bl-toolbar { padding: 14px; }
        }
      `}</style>
    </div>
  );
};

export default BlogList;
