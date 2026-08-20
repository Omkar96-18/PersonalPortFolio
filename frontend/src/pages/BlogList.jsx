import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, ArrowRight, Clock, BookOpen, User, BookOpenText, X, Sparkles } from 'lucide-react';
import { api } from '../services/api';

const calculateReadTime = content => {
  const words = (content || '').trim().split(/\s+/).length;
  return `${Math.ceil(words / 200)} min read`;
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
      <p>Loading technical articles...</p>
    </div>
  );

  return (
    <div className="blogs-page container section">
      <div className="bloglist-ambient-glow" />

      {/* Header */}
      <div className="blogs-header">
        <div className="technical-decor">
          <span className="decor-line" />
          <span className="hero-badge"><BookOpen size={13} className="accent-red-icon" /> ENGINEERING LOGS &amp; PUBLICATIONS</span>
        </div>
        <h1 className="section-title">Technical Articles &amp; Insights</h1>
        <p className="section-subtitle">Deep dives on Retrieval-Augmented Generation (RAG), agentic AI workflows, microservice design, and distributed systems</p>
      </div>

      {/* Search & Tag Filter Toolbar */}
      <div className="blogs-toolbar glass-panel">
        <div className="search-box">
          <Search size={16} className="search-icon-accent" />
          <input
            type="text"
            placeholder="Search articles by title, keyword, or topic..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="clear-search-btn">
              <X size={14} />
            </button>
          )}
        </div>
        
        <div className="tags-filters-strip">
          <span className="filter-label">Filter by Tag:</span>
          <button className={`tag-filter-btn ${selectedTag === '' ? 'active' : ''}`} onClick={() => setSelectedTag('')}>All ({blogs.length})</button>
          {allTags.map(tag => (
            <button key={tag} className={`tag-filter-btn ${selectedTag === tag ? 'active' : ''}`} onClick={() => setSelectedTag(tag)}>{tag}</button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      {filteredBlogs.length === 0 ? (
        <div className="empty-state glass-panel">
          <Sparkles size={32} className="empty-icon-accent" />
          <h3>No articles matching filters</h3>
          <p>Try clearing your search query or selecting a different technology tag.</p>
          <button onClick={() => { setSearchQuery(''); setSelectedTag(''); }} className="btn btn-secondary btn-sm">Reset Filters</button>
        </div>
      ) : (
        <div className="blogs-grid">
          {filteredBlogs.map((blog, idx) => {
            const readTime = calculateReadTime(blog.content);
            const primaryTag = blog.tags_list?.[0] || 'Technical';

            return (
              <article key={blog.id} className="blog-card glass-panel professional-card" style={{ animationDelay: `${idx * 0.08}s` }}>
                <div className="blog-top-stripe" />
                
                {blog.cover_image_url ? (
                  <div className="blog-card-image">
                    <img src={blog.cover_image_url} alt={blog.title} />
                    <div className="image-overlay-glow" />
                    <div className="card-floating-badges">
                      <span className="floating-category-badge">{primaryTag}</span>
                      <span className="floating-time-badge">
                        <Clock size={11} /> {readTime}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="blog-card-placeholder">
                    <BookOpenText size={32} className="accent-red-icon" />
                    <span className="floating-category-badge">{primaryTag}</span>
                  </div>
                )}
                
                <div className="blog-card-content">
                  <div className="blog-card-meta">
                    <span className="meta-item"><Calendar size={12} className="accent-red-icon" />{new Date(blog.created_at).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'})}</span>
                    <span className="meta-item"><User size={12} className="accent-red-icon" />devil37</span>
                    <span className="meta-item"><Clock size={12} className="accent-red-icon" />{readTime}</span>
                    {!blog.is_published && <span className="badge draft-badge">Draft</span>}
                  </div>
                  
                  <h2 className="blog-card-title">
                    <Link to={`/blogs/${blog.slug}`}>{blog.title}</Link>
                  </h2>
                  
                  <p className="blog-card-excerpt">{blog.excerpt}</p>
                  
                  <div className="blog-card-tags">
                    {blog.tags_list?.map((tag, i) => <span key={i} className="tag tag-cyan article-tag-pill">#{tag}</span>)}
                  </div>
                  
                  <div className="blog-card-footer">
                    <Link to={`/blogs/${blog.slug}`} className="read-more-link">
                      <span>Read Full Article</span>
                      <ArrowRight size={14} className="article-arrow-icon" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <style>{`
        .blogs-page { padding-top: 100px; text-align: left; position: relative; }
        .bloglist-ambient-glow {
          position: absolute; left: -10%; top: 10%;
          width: 50vw; height: 50vw; max-width: 550px; max-height: 550px;
          background: radial-gradient(circle, rgba(128, 10, 28, 0.18) 0%, rgba(246, 36, 64, 0.05) 50%, transparent 70%);
          filter: blur(65px); pointer-events: none;
        }
        body.light-theme .bloglist-ambient-glow {
          background: radial-gradient(circle, rgba(246, 36, 64, 0.12) 0%, rgba(153, 0, 17, 0.03) 50%, transparent 70%);
        }

        .blogs-header { margin-bottom: 36px; }
        .technical-decor { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
        .decor-line {
          width: 24px; height: 2px;
          background: linear-gradient(90deg, var(--accent-red) 0%, var(--accent-dark-red) 100%);
          box-shadow: 0 0 6px var(--accent-red);
        }
        .hero-badge {
          font-family: var(--font-mono); font-size: 0.68rem; letter-spacing: 1.5px; color: var(--text-secondary);
          display: flex; align-items: center; gap: 6px;
        }

        .blogs-toolbar {
          padding: 20px 24px;
          display: flex; flex-direction: column; gap: 18px;
          margin-bottom: 40px;
          border-left: 3px solid var(--accent-red);
        }
        .search-box {
          display: flex; align-items: center; gap: 12px;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(246, 36, 64, 0.25);
          border-radius: var(--border-radius-sm);
          padding: 10px 16px;
          transition: var(--transition-smooth);
        }
        .search-box:focus-within {
          border-color: var(--accent-red);
          box-shadow: 0 0 12px var(--accent-red-glow);
        }
        .search-icon-accent { color: var(--accent-red); }
        .search-box input {
          background: transparent; border: none;
          color: var(--text-primary); width: 100%; font-size: 0.92rem;
          font-family: var(--font-sans);
        }
        .search-box input::placeholder { color: var(--text-muted); }
        .clear-search-btn { background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 2px; display: flex; }
        .clear-search-btn:hover { color: var(--accent-red); }

        .tags-filters-strip { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; }
        .filter-label { font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; margin-right: 4px; }
        .tag-filter-btn {
          background: rgba(128, 10, 28, 0.12);
          border: 1px solid rgba(246, 36, 64, 0.2);
          color: var(--text-secondary);
          padding: 6px 14px;
          border-radius: var(--border-radius-sm);
          cursor: pointer; font-size: 0.75rem; font-weight: 600;
          transition: var(--transition-smooth);
          font-family: var(--font-mono);
          text-transform: uppercase;
        }
        .tag-filter-btn:hover, .tag-filter-btn.active {
          background: var(--accent-red);
          color: #FFFFFF;
          border-color: var(--accent-red);
          box-shadow: 0 0 12px var(--accent-red-glow);
        }

        .blogs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 28px;
        }
        .blog-card {
          display: flex; flex-direction: column; height: 100%; overflow: hidden;
          position: relative; 
          transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease;
          border-radius: var(--border-radius-md);
          background: rgba(7, 7, 9, 0.75);
          border: 1px solid var(--border-color);
        }
        .blog-top-stripe {
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--accent-red) 0%, var(--accent-dark-red) 60%, transparent 100%);
          z-index: 4; transition: height 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease;
        }
        .blog-card:hover {
          border-color: rgba(246, 36, 64, 0.45);
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.95), 0 0 30px rgba(128, 10, 28, 0.35);
          transform: translateY(-6px);
        }
        .blog-card:hover .blog-top-stripe { height: 3px; box-shadow: 0 0 14px var(--accent-red); }

        .blog-card-image { height: 195px; overflow: hidden; position: relative; border-bottom: 1px solid var(--border-color); }
        .blog-card-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
        .image-overlay-glow {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(7, 7, 10, 0.85) 100%);
          pointer-events: none;
          z-index: 1;
        }
        .blog-card:hover .blog-card-image img { transform: scale(1.06); }

        .card-floating-badges {
          position: absolute; top: 12px; left: 12px; right: 12px;
          display: flex; justify-content: space-between; align-items: center;
          z-index: 3; pointer-events: none;
        }
        .floating-category-badge {
          font-family: var(--font-mono); font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px;
          padding: 4px 10px; border-radius: 4px;
          background: rgba(128, 10, 28, 0.85); border: 1px solid rgba(246, 36, 64, 0.5);
          color: #FFFFFF; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
        }
        .floating-time-badge {
          display: inline-flex; align-items: center; gap: 5px;
          font-family: var(--font-mono); font-size: 0.65rem; font-weight: 600;
          padding: 4px 10px; border-radius: 999px;
          background: rgba(0, 0, 0, 0.65); border: 1px solid var(--border-color);
          color: var(--text-secondary); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
        }

        .blog-card-placeholder {
          height: 180px;
          background: linear-gradient(135deg, rgba(128, 10, 28, 0.15) 0%, rgba(7, 7, 10, 0.85) 100%);
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;
          position: relative; border-bottom: 1px solid var(--border-color);
        }

        .blog-card-content { padding: 24px; display: flex; flex-direction: column; flex-grow: 1; }
        .blog-card-meta {
          display: flex; gap: 16px; align-items: center; flex-wrap: wrap;
          color: var(--text-muted); font-size: 0.72rem;
          font-family: var(--font-mono); margin-bottom: 12px;
        }
        .meta-item { display: flex; align-items: center; gap: 5px; }
        .accent-red-icon { color: var(--accent-red); }
        .draft-badge { background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid rgba(245,158,11,0.2); }

        .blog-card-title { font-family: var(--font-sans); font-size: 1.25rem; font-weight: 800; line-height: 1.35; margin-bottom: 12px; letter-spacing: -0.4px; }
        .blog-card-title a { color: var(--text-primary); transition: color 0.3s ease; text-decoration: none; }
        .blog-card-title a:hover, .blog-card:hover .blog-card-title a { color: #FFFFFF; }
        
        .blog-card-excerpt { color: var(--text-secondary); font-size: 0.88rem; margin-bottom: 18px; flex-grow: 1; line-height: 1.65; }
        .blog-card-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 22px; }
        .article-tag-pill { font-size: 0.68rem; padding: 3px 8px; }
        .blog-card-footer { border-top: 1px solid var(--border-color); padding-top: 16px; margin-top: auto; }
        .read-more-link {
          display: inline-flex; align-items: center; gap: 7px;
          font-weight: 700; font-size: 0.82rem; font-family: var(--font-sans);
          color: var(--accent-red); text-transform: uppercase; letter-spacing: 0.8px;
          transition: all 0.3s ease;
        }
        .read-more-link:hover, .blog-card:hover .read-more-link { gap: 12px; color: #FFFFFF; }
        .article-arrow-icon { transition: transform 0.3s ease; }
        .blog-card:hover .article-arrow-icon { transform: translateX(4px); }

        .empty-state { padding: 48px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .empty-icon-accent { color: var(--accent-red); opacity: 0.6; }
        .empty-state h3 { margin-bottom: 6px; color: #FFFFFF; font-size: 1.2rem; }
        .empty-state p { color: var(--text-secondary); margin-bottom: 16px; font-size: 0.88rem; }

        /* Light Mode Specific Overrides */
        body.light-theme .blogs-toolbar { background: rgba(255, 255, 255, 0.95); }
        body.light-theme .search-box { background: #FFFFFF; border-color: rgba(246, 36, 64, 0.3); }
        body.light-theme .search-box input { color: #0F172A; }
        body.light-theme .tag-filter-btn { background: rgba(246, 36, 64, 0.08); color: #0F172A; border-color: rgba(246, 36, 64, 0.2); }
        body.light-theme .tag-filter-btn:hover, body.light-theme .tag-filter-btn.active { background: var(--accent-red); color: #FFFFFF; }
        body.light-theme .blog-card { background: rgba(255, 255, 255, 0.94); border-color: rgba(0, 0, 0, 0.08); }
        body.light-theme .blog-card-title a { color: #0F172A; }
        body.light-theme .blog-card-title a:hover, body.light-theme .blog-card:hover .blog-card-title a { color: var(--accent-red); }
        body.light-theme .blog-card-excerpt { color: #475569; }
        body.light-theme .empty-state h3 { color: #0F172A; }
        body.light-theme .read-more-link:hover { color: #990011 !important; }

        @media (max-width: 600px) {
          .blogs-grid { grid-template-columns: 1fr; }
          .blogs-toolbar { padding: 16px; }
          .tags-filters-strip { gap: 6px; }
        }
      `}</style>
    </div>
  );
};

export default BlogList;
