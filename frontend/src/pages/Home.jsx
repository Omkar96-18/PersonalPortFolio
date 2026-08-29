import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Terminal, Code, Database, Cpu, Server, Zap, Wind, Layers,
  Compass, PenTool, BarChart, TrendingUp, Grid, Activity,
  MessageSquare, Users, User, ArrowRight, ExternalLink, Mail, MapPin, X,
  ShieldCheck, BrainCircuit, Rocket, GitBranch, Award, CheckCircle2,
  Search, Sliders, Flame, CpuIcon, FolderGit2, Sparkles, TerminalSquare, Info,
  Calendar, Clock, Building2, Briefcase, BookOpenText, Send, Loader2,
  ChevronDown, ChevronUp, FileText, Download, Eye, FileDown
} from 'lucide-react';
import { Github, TechBrandIcon, getTechBrandColor } from '../components/BrandIcons';
import { api } from '../services/api';
import MarkdownRenderer from '../components/MarkdownRenderer';
import ScrollToTop from '../components/ScrollToTop';

const TypingText = ({ texts = [], speed = 100, delay = 2000 }) => {
  const [index, setIndex]       = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse]   = useState(false);
  const [text, setText]         = useState('');

  useEffect(() => {
    if (subIndex === texts[index].length + 1 && !reverse) {
      setReverse(true);
      return;
    }
    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex(prev => (prev + 1) % texts.length);
      return;
    }
    const t = setTimeout(() => setSubIndex(p => p + (reverse ? -1 : 1)), reverse ? 38 : speed);
    return () => clearTimeout(t);
  }, [subIndex, index, reverse, texts, speed, delay]);

  useEffect(() => setText(texts[index].substring(0, subIndex)), [subIndex, index, texts]);

  return (
    <span>
      {text}<span className="typing-cursor">_</span>
    </span>
  );
};

const TerminalMock = () => {
  const [commandsMap, setCommandsMap] = useState({});
  const [history, setHistory] = useState([
    { type: 'input',  text: 'neofetch' },
    { type: 'output', text: `devil37@portfolio\n----------------\nOS:      Debian GNU/Linux 12\nKernel:  6.1.0-21-amd64\nShell:   bash 5.2.15\nStack:   Django, DRF, FastAPI, Go, PyTorch\nFocus:   AI Agent Workflows & Scalable Backends` },
    { type: 'input',  text: 'cat welcome.txt' },
    { type: 'output', text: 'Type: "help", "whoami", "skills", "projects", "clear".' }
  ]);
  const [input, setInput] = useState('');
  const bodyRef = useRef(null);

  useEffect(() => {
    api.getTerminalCommands()
      .then(cmdList => {
        if (cmdList && cmdList.length > 0) {
          const map = {};
          cmdList.forEach(item => {
            map[item.command.toLowerCase()] = item.response;
          });
          setCommandsMap(map);

          if (map['neofetch']) {
            setHistory([
              { type: 'input',  text: 'neofetch' },
              { type: 'output', text: map['neofetch'] },
              { type: 'input',  text: 'cat welcome.txt' },
              { type: 'output', text: 'Type: "help", "whoami", "skills", "projects", "clear".' }
            ]);
          }
        }
      })
      .catch(err => console.error("Could not fetch terminal commands", err));
  }, []);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [history]);

  const handleCommand = e => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;
    let res = '';
    const c = cmd.toLowerCase();

    if (c === 'clear') { 
      setHistory([]); 
      setInput(''); 
      return; 
    }

    if (commandsMap[c]) {
      res = commandsMap[c];
    } else if (c === 'help') {
      const keys = Object.keys(commandsMap);
      const availableStr = keys.length > 0 
        ? keys.join(', ') + ', clear' 
        : 'help, whoami, skills, projects, neofetch, clear';
      res = `Available commands: ${availableStr}`;
    } else if (c === 'whoami') {
      res = 'devil37 (Omkar Pardeshi) - AI/ML Engineer & Backend Architect. Builds context-aware agentic systems (RAG, CrewAI) and low-latency APIs.';
    } else if (c === 'skills') {
      res = 'Languages: Python, Go, SQL, Javascript\nBackend: Django, DRF, FastAPI, Flask\nAI/ML: PyTorch, TensorFlow, NLP, RAG, CrewAI\nAutomation: n8n, clawbot';
    } else if (c === 'projects') {
      res = '1. Agentic AI Operations Platform (FastAPI, n8n, CrewAI)\n2. Distributed RAG Engine (Go, PyTorch, PostgreSQL)\nScroll down to "Featured Projects" grid to review full specs!';
    } else if (c === 'neofetch') {
      res = `devil37@portfolio\n----------------\nOS:      Debian GNU/Linux 12\nKernel:  6.1.0-21-amd64\nShell:   bash 5.2.15\nStack:   Django, DRF, FastAPI, Go, PyTorch\nFocus:   AI Agent Workflows & Scalable Backends`;
    } else {
      res = `sh: command not found: ${cmd}`;
    }

    setHistory([...history, { type: 'input', text: cmd }, { type: 'output', text: res }]);
    setInput('');
  };

  return (
    <div className="terminal-container glass-panel">
      <ScrollToTop/>
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
        </div>
        <div className="terminal-title">devil37@portfolio: ~</div>
      </div>
      <div className="terminal-body" ref={bodyRef}>
        {history.map((item, idx) => (
          <div key={idx} className="terminal-line">
            {item.type === 'input'
              ? <div className="terminal-input-line">
                  <span className="terminal-prompt">devil37@portfolio:~$</span>
                  <span className="terminal-command">{item.text}</span>
                </div>
              : <pre className="terminal-output">{item.text}</pre>}
          </div>
        ))}
        <form onSubmit={handleCommand} className="terminal-input-form">
          <span className="terminal-prompt">devil37@portfolio:~$</span>
          <input
            type="text" className="terminal-input"
            value={input} onChange={e => setInput(e.target.value)}
            autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
            placeholder="type command..."
          />
        </form>
      </div>
    </div>
  );
};

export const Home = () => {
  const location  = useLocation();
  const [profile, setProfile]         = useState(null);
  const [skills, setSkills]           = useState([]);
  const [projects, setProjects]       = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [blogs, setBlogs]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [skillSearch, setSkillSearch]       = useState('');
  const [isSkillsExpanded, setIsSkillsExpanded] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSkill, setSelectedSkill]     = useState(null);
  const [activePillar, setActivePillar]     = useState(0);
  const [contactData, setContactData]       = useState({ name: '', email: '', subject: '', message: '' });
  const [sendingContact, setSendingContact] = useState(false);
  const [contactStatus, setContactStatus]   = useState({ type: '', message: '' });
  const [downloadingResume, setDownloadingResume] = useState(false);

  const handleDownloadResume = (e) => {
    if (e) e.preventDefault();
    if (!profile?.resume_url) {
      alert("Resume PDF has not been uploaded yet. Please upload it via the Admin Dashboard.");
      return;
    }
    setDownloadingResume(true);
    // Use the dedicated server-side download endpoint that sets Content-Disposition: attachment
    // This avoids all CORS / blob fetch issues and works from both local media and external URLs
    const downloadUrl = api.getResumeDownloadUrl();
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${(profile?.name || 'Omkar_Pardeshi').replace(/\s+/g, '_')}_Resume.pdf`;
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadingResume(false), 1200);
  };

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.replace('#', ''));
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [location]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedSkill) {
          setSelectedSkill(null);
        } else if (selectedProject) {
          setSelectedProject(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSkill, selectedProject]);

  useEffect(() => {
    if (selectedSkill || selectedProject) {
      window.lenis?.stop();
      document.body.style.overflow = 'hidden';
    } else {
      window.lenis?.start();
      document.body.style.overflow = '';
    }
    return () => { 
      window.lenis?.start();
      document.body.style.overflow = ''; 
    };
  }, [selectedSkill, selectedProject]);

  useEffect(() => {
    Promise.all([
      api.getProfile(), api.getSkills(), api.getProjects(),
      api.getExperiences(), api.getBlogs()
    ]).then(([p, s, pr, ex, bl]) => {
      setProfile(p);
      setSkills(s || []);
      setProjects(pr || []);
      setExperiences(ex || []);
      setBlogs((bl || []).slice(0, 3));
    }).catch(err => console.error('Failed to load portfolio data', err))
      .finally(() => setLoading(false));
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactData.name || !contactData.email || !contactData.message) {
      setContactStatus({ type: 'error', message: 'Please fill out all required fields (Name, Email, Message).' });
      return;
    }
    
    setSendingContact(true);
    setContactStatus({ type: '', message: '' });

    try {
      const res = await api.sendContactMessage(contactData);
      setContactStatus({ 
        type: 'success', 
        message: res.message || `Thank you, ${contactData.name}! Your message has been sent successfully. A confirmation email has been dispatched to ${contactData.email}.` 
      });
      setContactData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error("Failed to send contact message", err);
      setContactStatus({ 
        type: 'error', 
        message: err.message || 'Failed to send message. Please verify your email and try again.' 
      });
    } finally {
      setSendingContact(false);
    }
  };

  if (loading) return (
    <div className="loader-container">
      <div className="loader" />
      <p>Syncing system database...</p>
    </div>
  );

  const categories = {
    all: "Show All",
    languages: "Languages",
    backend: "Backend & Systems",
    frontend: "Frontend",
    ai_ml: "AI/ML & Data Science",
    advanced_ai: "Advanced AI",
    tools: "Tools & DevOps"
  };

  const filteredSkills = skills.filter(s => {
    const matchesCategory = activeCategory === 'all' || s.category === activeCategory;
    const matchesSearch = s.name.toLowerCase().includes(skillSearch.toLowerCase()) ||
                          (s.category && s.category.toLowerCase().includes(skillSearch.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const SKILL_PREVIEW_LIMIT = 8;
  const hasMoreSkills = filteredSkills.length > SKILL_PREVIEW_LIMIT;
  const displayedSkills = (!isSkillsExpanded && hasMoreSkills) ? filteredSkills.slice(0, SKILL_PREVIEW_LIMIT) : filteredSkills;

  const titlesArray = ['AI/ML Engineer', 'Data Scientist', 'Backend Architect', 'Agentic RAG Developer'];

  const pillars = [
    {
      title: "AI Agent Workflows & RAG Systems",
      icon: <BrainCircuit size={22} className="pillar-icon" />,
      desc: "Specialized in constructing context-aware Retrieval-Augmented Generation (RAG) architectures with multi-agent orchestration via CrewAI, LangChain, and dense vector embeddings."
    },
    {
      title: "Scalable Microservices & Low-Latency APIs",
      icon: <Server size={22} className="pillar-icon" />,
      desc: "Designing resilient backend engines using Django REST Framework, FastAPI, and Go. Engineered for low-latency request handling and automated distributed workloads."
    },
    {
      title: "Data Pipelines & Vector Databases",
      icon: <Database size={22} className="pillar-icon" />,
      desc: "Implementing high-throughput data processing layers with PostgreSQL, pgvector, Redis caching, PyTorch, and TensorFlow for real-time model inference."
    },
    {
      title: "Automated Workflows & Infrastructure",
      icon: <GitBranch size={22} className="pillar-icon" />,
      desc: "Deploying production containerization with Docker, automated CI/CD pipelines, n8n integrations, and system automation scripts."
    }
  ];

  return (
    <div className="portfolio-page">
      {/* Hero Section with Ambient Dark Red Ambient Halo */}
      <header className="hero-section section">
        <div className="hero-ambient-glow" />
        <div className="container hero-container">
          <div className="hero-content">
            <div className="technical-decor">
              <span className="decor-line" />
              <span className="hero-badge">SYSTEMS ACTIVE // DARK RED ACCENTS</span>
            </div>
            <h1 className="hero-title">
              HI, I'M <span className="highlight">{profile?.name || 'devil37'}</span>
            </h1>
            <h2 className="hero-subtitle">
              <TypingText texts={titlesArray} />
            </h2>
            <p className="hero-description">
              {profile?.bio || 'Specializing in building robust, performant backends and advanced AI workflows.'}
            </p>

            <div className="hero-buttons">
              <a href="#projects" className="btn btn-primary">Projects <ArrowRight size={15} /></a>
              <a href="#contact" className="btn btn-secondary">Get in touch</a>
            </div>

            {profile && (
              <div className="hero-contact-info">
                {profile.location && <span className="info-item"><MapPin size={14} className="accent-red-icon" /> {profile.location}</span>}
                {profile.email    && <span className="info-item"><Mail size={14} className="accent-red-icon" /> {profile.email}</span>}
              </div>
            )}
          </div>

          <div className="hero-interactive-column">
            <TerminalMock />
          </div>
        </div>
      </header>

      {/* ABOUT US SECTION */}
      <section id="about" className="about-section section bg-alt section-with-grid">
        <div className="section-grid-bg" />
        <div className="section-scanlines" />
        <div className="about-ambient-glow" />
        <div className="section-glow-orb-2 about-orb-2" />
        <div className="container">
          <div className="section-badge-wrapper">
            <span className="section-pill-tag">
              <span className="live-dot" /> SYSTEM ARCHITECT &amp; ENGINEER
            </span>
          </div>
          <h2 className="section-title">About Me</h2>
          <p className="section-subtitle">Bridging engineering principles, resilient distributed backends, and advanced intelligent systems</p>

          <div className="about-stats-grid">
            <div className="glass-panel stat-card">
              <div className="stat-icon-wrapper"><BrainCircuit size={20} /></div>
              <div className="stat-content">
                <span className="stat-number">AI / ML Systems</span>
                <span className="stat-label">Agentic Frameworks &amp; RAG</span>
              </div>
            </div>
            <div className="glass-panel stat-card">
              <div className="stat-icon-wrapper"><Server size={20} /></div>
              <div className="stat-content">
                <span className="stat-number">Backend Engineering</span>
                <span className="stat-label">FastAPI, Django &amp; Go</span>
              </div>
            </div>
            <div className="glass-panel stat-card">
              <div className="stat-icon-wrapper"><Rocket size={20} /></div>
              <div className="stat-content">
                <span className="stat-number">Production Scaling</span>
                <span className="stat-label">High-Throughput &amp; Low Latency</span>
              </div>
            </div>
            <div className="glass-panel stat-card">
              <div className="stat-icon-wrapper"><ShieldCheck size={20} /></div>
              <div className="stat-content">
                <span className="stat-number">Full Lifecycle</span>
                <span className="stat-label">End-to-End Delivery</span>
              </div>
            </div>
          </div>

          <div className="about-main-layout">
            <div className="glass-panel about-bio-card">
              <div className="card-header-badge">
                <span className="badge-dot" /> BIOGRAPHY &amp; TECHNICAL PHILOSOPHY
              </div>
              <div className="about-markdown-body">
                <MarkdownRenderer content={profile?.about_me || 'Welcome to my profile! Edit this about section in the Admin Dashboard.'} />
              </div>
              
              {/* HIGH-TECH RESUME DOWNLOAD & VIEW CARD */}
              <div className="about-resume-box">
                <div className="resume-box-left">
                  <div className="">
                    <FileText size={22} className="accent-red-icon" />
                  </div>
                  <div className="resume-info-text">
                    <div className="resume-status-badge">
                      <span className="live-dot" /> VERIFIED SPECIFICATION // PDF CREDENTIALS
                    </div>
                    <h4 className="resume-title">Curriculum Vitae &amp; Technical Resume</h4>
                    <p className="resume-desc">Comprehensive history of AI/ML systems engineering, backend architectures, and production implementations.</p>
                  </div>
                </div>

                <div className="resume-action-buttons">
                  <button 
                    type="button"
                    onClick={handleDownloadResume}
                    disabled={downloadingResume}
                    className={`btn btn-primary resume-download-btn ${downloadingResume ? 'loading' : ''}`}
                    title="Direct Download PDF Resume"
                  >
                    {downloadingResume ? (
                      <>
                        <Loader2 size={15} className="spin-icon" /> Downloading...
                      </>
                    ) : (
                      <>
                        <Download size={15} /> Direct Download (PDF)
                      </>
                    )}
                  </button>
                  {profile?.resume_url && (
                    <a 
                      href={api.getResumeViewUrl()}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-secondary resume-preview-btn"
                      title="Open Resume PDF in New Browser Tab"
                    >
                      <Eye size={15} /> View in Browser
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="about-pillars-column">
              <div className="pillars-header-wrap">
                <span className="pillars-heading">CORE ARCHITECTURAL PILLARS</span>
              </div>
              <div className="pillars-grid">
                {pillars.map((pillar, idx) => (
                  <div 
                    key={idx} 
                    className={`glass-panel pillar-card`}
                    onClick={() => setActivePillar(idx)}
                  >
                    <div className="pillar-header">
                      <div className="pillar-icon-box">{pillar.icon}</div>
                      <h4 className="pillar-title">{pillar.title}</h4>
                    </div>
                    <p className="pillar-desc">{pillar.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS & EXPERTISE SECTION */}
      <section id="skills" className="skills-section section">
        <div className="skills-ambient-glow" />
        <div className="container">
          <h2 className="section-title">Skills &amp; Expertise</h2>
          <p className="section-subtitle">My core technology stack across backend systems, AI engineering, and infrastructure</p>

          <div className="skills-control-bar glass-panel">
            <div className="skills-search-box">
              <Search size={16} className="search-icon-accent" />
              <input
                type="text"
                placeholder="Search technology (e.g. PyTorch, Django, Go)..."
                value={skillSearch}
                onChange={e => setSkillSearch(e.target.value)}
              />
              {skillSearch && (
                <button onClick={() => setSkillSearch('')} className="clear-search-btn">
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="skills-legend-wrapper">
              <div className="legend-item"><span className="legend-dot expert" /> 90%+ Expert</div>
              <div className="legend-item"><span className="legend-dot advanced" /> 75%+ Advanced</div>
              <div className="legend-item"><span className="legend-dot applied" /> 60%+ Applied</div>
            </div>

            {hasMoreSkills && (
              <button 
                className="btn btn-secondary btn-sm catalog-trigger-btn"
                onClick={() => setIsSkillsExpanded(!isSkillsExpanded)}
                title={isSkillsExpanded ? "Collapse skills view" : "Expand to view all technologies"}
              >
                {isSkillsExpanded ? <ChevronUp size={14} className="accent-red-icon" /> : <ChevronDown size={14} className="accent-red-icon" />}
                <span>{isSkillsExpanded ? 'Collapse' : `View All (${filteredSkills.length})`}</span>
              </button>
            )}
          </div>

          <div className="skills-filter-wrapper glass-panel">
            {Object.entries(categories).map(([key, label]) => (
              <button
                key={key}
                className={`skill-tab-btn ${activeCategory === key ? 'active' : ''}`}
                onClick={() => setActiveCategory(key)}
              >
                {label}
              </button>
            ))}
          </div>

          {filteredSkills.length === 0 ? (
            <div className="glass-panel empty-skills-panel">
              <CpuIcon size={32} className="empty-icon" />
              <h4>No technologies matching "{skillSearch}"</h4>
              <p>Try searching for a different framework or clear the search filter.</p>
              <button onClick={() => { setSkillSearch(''); setActiveCategory('all'); }} className="btn btn-secondary btn-sm">Clear Search</button>
            </div>
          ) : (
            <>
              <div className="skills-filtered-grid">
                {displayedSkills.map(skill => {
                  const brandColor = skill.color_theme || getTechBrandColor(skill.name);
                  const percentageVal = Math.min(100, Math.max(0, skill.percentage ?? 85));
                  const activeTicks = Math.round((percentageVal / 100) * 10);
                  const categoryLabel = categories[skill.category] || skill.category?.replace('_', ' ') || 'General';

                  return (
                    <div 
                      key={skill.id} 
                      className="glass-panel skill-metric-card"
                      style={{ '--brand-color': brandColor }}
                      onClick={() => setSelectedSkill(skill)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedSkill(skill); } }}
                      title={`Click to view ${skill.name} detailed specs & description`}
                    >
                      <div className="skill-card-top-stripe" style={{ backgroundColor: brandColor }} />
                      
                      <div className="skill-metric-header">
                        <div className="skill-metric-main">
                          <span className="brand-logo-icon" style={{ borderColor: `${brandColor}40`, background: `${brandColor}12` }}>
                            {skill.logo_url ? (
                              <img src={skill.logo_url} alt={skill.name} style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                            ) : (
                              <TechBrandIcon name={skill.name} size={20} />
                            )}
                          </span>
                          <div className="skill-metric-info">
                            <span className="skill-name-text">{skill.name}</span>
                            <span className="skill-category-sub">{categoryLabel}</span>
                          </div>
                        </div>
                        
                        {skill.proficiency && (
                          <span className="skill-mini-proficiency" style={{ borderColor: `${brandColor}50`, color: brandColor }}>
                            {skill.proficiency}
                          </span>
                        )}
                      </div>

                      <div className="skill-meter-container">
                        <div className="skill-meter">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <span
                              key={i}
                              className={`meter-tick ${i < activeTicks ? 'active' : ''}`}
                              style={{
                                backgroundColor: i < activeTicks ? brandColor : undefined,
                                borderColor: i < activeTicks ? brandColor : undefined,
                                boxShadow: i < activeTicks ? `0 0 6px ${brandColor}` : undefined
                              }}
                            />
                          ))}
                        </div>
                        <span className="meter-percentage-text" style={{ color: brandColor }}>
                          {percentageVal}%
                        </span>
                      </div>

                      <div className="skill-card-footer-hint">
                        <span>Inspect Details</span>
                        <ExternalLink size={11} className="hint-arrow" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {hasMoreSkills && (
                <div className="skills-view-more-banner glass-panel">
                  <div className="view-more-info">
                    <div className="view-more-icon-box">
                      <Layers size={22} className="accent-red-icon" />
                    </div>
                    <div className="view-more-text">
                      <h4 className="view-more-title">
                        {isSkillsExpanded 
                          ? `All ${filteredSkills.length} Technologies Expanded`
                          : `Explore Complete Tech Stack (${skills.length} Technologies)`}
                      </h4>
                      <p className="view-more-subtitle">
                        {isSkillsExpanded 
                          ? `Showing all ${filteredSkills.length} technologies. Click on any skill card to read its full description & specs.`
                          : `Showing ${displayedSkills.length} of ${filteredSkills.length} matching skills in preview.`}
                      </p>
                    </div>
                  </div>
                  <button 
                    className={`btn ${isSkillsExpanded ? 'btn-secondary' : 'btn-primary'} skills-view-more-btn`}
                    onClick={() => setIsSkillsExpanded(!isSkillsExpanded)}
                    aria-expanded={isSkillsExpanded}
                  >
                    {isSkillsExpanded ? (
                      <>
                        <ChevronUp size={16} />
                        <span>Show Less (Preview {SKILL_PREVIEW_LIMIT} Skills)</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} />
                        <span>View More Technologies (+{filteredSkills.length - SKILL_PREVIEW_LIMIT} More)</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section id="projects" className="projects-section section bg-alt section-with-grid">
        <div className="section-grid-bg" />
        <div className="section-scanlines" />
        <div className="projects-ambient-glow" />
        <div className="section-glow-orb-2 projects-orb-2" />
        <div className="container">
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">Click on any project card to inspect detailed specs, architecture, and live links</p>

          <div className="projects-grid">
            {projects.map((project, idx) => (
              <div 
                key={project.id} 
                className="glass-panel project-card professional-card"
                style={{ animationDelay: `${idx * 0.1}s`, cursor: 'pointer' }}
                onClick={() => setSelectedProject(project)}
                role="button"
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedProject(project); } }}
              >
                <div className="project-top-stripe" />

                {project.image_url ? (
                  <div className="project-image-container">
                    <img src={project.image_url} alt={project.title} className="project-image" />
                    <div className="image-overlay-glow" />
                    <div className="card-floating-badges">
                      {project.demo_url ? (
                        <span className="floating-status-badge live">
                          <span className="live-pulsing-dot" /> Live System
                        </span>
                      ) : (
                        <span className="floating-status-badge code">
                          <GitBranch size={10} /> Architecture
                        </span>
                      )}
                    </div>
                    <div className="project-image-inspect-overlay">
                      <span className="inspect-pill">
                        <Sparkles size={12} className="accent-red-icon" /> Inspect Architecture Specs
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="project-placeholder-hero">
                    <div className="placeholder-pattern" />
                    <div className="placeholder-content">
                      <Cpu size={32} className="accent-red-icon placeholder-icon" />
                      <span className="placeholder-domain">System Architecture</span>
                    </div>
                  </div>
                )}
                
                <div className="project-content">
                  <div className="project-header-row">
                    <h3 className="project-title">{project.title}</h3>
                  </div>

                  <p className="project-desc">{project.description}</p>
                  
                  <div className="project-tech-header">
                    <span className="tech-heading-label"><Cpu size={12} className="accent-red-icon" /> IMPLEMENTED SKILLS:</span>
                    <div className="project-tags">
                      {project.tech_stack_list?.map((tech, i) => (
                        <span key={i} className="tag tag-cyan project-tech-pill">
                          <TechBrandIcon name={tech} size={13} />
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="project-actions" onClick={e => e.stopPropagation()}>
                    <button 
                      onClick={() => setSelectedProject(project)} 
                      className="btn btn-secondary btn-sm flex-btn"
                      title="Inspect full technical architecture & system design"
                    >
                      <Info size={13} /> Specs
                    </button>
                    {project.github_url && (
                      <a 
                        href={project.github_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-secondary btn-sm icon-only-btn" 
                        title="View Source Code Repository"
                      >
                        <Github size={15} />
                      </a>
                    )}
                    {project.demo_url && (
                      <a 
                        href={project.demo_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-primary btn-sm flex-btn demo-btn"
                        title="Launch Live System Demo"
                      >
                        <ExternalLink size={13} /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WORK HISTORY / EXPERIENCE SECTION */}
      <section id="experience" className="experience-section section">
        <div className="experience-ambient-glow" />
        <div className="container">
          <h2 className="section-title">Work History</h2>
          <p className="section-subtitle">Professional career progression in machine learning, software development, and systems engineering</p>

          <div className="about-stats-grid" style={{ marginBottom: '40px' }}>
            <div className="glass-panel stat-card">
              <div className="stat-icon-wrapper"><Briefcase size={20} /></div>
              <div className="stat-content">
                <span className="stat-number">Full-Stack &amp; ML</span>
                <span className="stat-label">Senior Software &amp; AI Roles</span>
              </div>
            </div>
            <div className="glass-panel stat-card">
              <div className="stat-icon-wrapper"><Zap size={20} /></div>
              <div className="stat-content">
                <span className="stat-number">Low-Latency APIs</span>
                <span className="stat-label">High-Throughput Engines</span>
              </div>
            </div>
            <div className="glass-panel stat-card">
              <div className="stat-icon-wrapper"><Award size={20} /></div>
              <div className="stat-content">
                <span className="stat-number">Production Impact</span>
                <span className="stat-label">Enterprise AI Systems</span>
              </div>
            </div>
          </div>

          <div className="timeline">
            {experiences.map(exp => (
              <div key={exp.id} className="timeline-item">
                <div className="timeline-marker" />
                <div className="timeline-content glass-panel professional-card">
                  <div className="exp-top-stripe" />
                  
                  <div className="timeline-header">
                    <div>
                      <h3 className="role-title">{exp.role}</h3>
                      <h4 className="company-title">
                        <Building2 size={14} className="accent-red-icon" /> {exp.company} {exp.location && `| ${exp.location}`}
                      </h4>
                    </div>
                    <span className="badge date-badge">
                      <Calendar size={12} className="accent-red-icon" />
                      {new Date(exp.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - {exp.is_current ? 'Present' : new Date(exp.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                    </span>
                  </div>

                  <div className="experience-bullets">
                    {exp.description_points?.map((point, pIdx) => (
                      <div key={pIdx} className="bullet-point">
                        <CheckCircle2 size={15} className="bullet-check-icon" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ARTICLES & INSIGHTS SHOWCASE SECTION */}
      {blogs.length > 0 && (
        <section id="insights" className="insights-section section bg-alt section-with-grid">
          <div className="section-grid-bg" />
          <div className="section-scanlines" />
          <div className="insights-ambient-glow" />
          <div className="section-glow-orb-2 insights-orb-2" />
          <div className="container">
            <h2 className="section-title">Latest Articles</h2>
            <p className="section-subtitle">Deep dives on Retrieval-Augmented Generation (RAG), AI multi-agent systems, and distributed backends</p>

            <div className="insights-grid">
              {blogs.map((blog, idx) => {
                const words = (blog.content || '').trim().split(/\s+/).length;
                const readTime = `${Math.ceil(words / 200)} min read`;
                const primaryTag = blog.tags_list?.[0] || 'Technical';

                return (
                  <article 
                    key={blog.id} 
                    className="glass-panel insight-card professional-card"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="project-top-stripe" />
                    
                    {blog.cover_image_url ? (
                      <div className="insight-image-wrapper">
                        <img src={blog.cover_image_url} alt={blog.title} className="insight-image" />
                        <div className="image-overlay-glow" />
                        <div className="card-floating-badges">
                          <span className="floating-category-badge">{primaryTag}</span>
                          <span className="floating-time-badge">
                            <Clock size={11} /> {readTime}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="insight-placeholder-hero">
                        <div className="placeholder-pattern" />
                        <BookOpenText size={28} className="accent-red-icon" />
                        <span className="floating-category-badge">{primaryTag}</span>
                      </div>
                    )}
                    
                    <div className="insight-body">
                      <div className="insight-meta-strip">
                        <span className="insight-date">
                          <Calendar size={12} className="accent-red-icon" />
                          {new Date(blog.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                        <span className="insight-author">
                          <User size={12} className="accent-red-icon" /> devil37
                        </span>
                        <span className="insight-readtime">
                          <Clock size={12} className="accent-red-icon" />
                          {readTime}
                        </span>
                      </div>

                      <h3 className="insight-title">
                        <Link to={`/blogs/${blog.slug}`}>{blog.title}</Link>
                      </h3>

                      <p className="insight-excerpt">{blog.excerpt}</p>

                      <div className="insight-tags-strip">
                        {blog.tags_list?.map((tag, tIdx) => (
                          <span key={tIdx} className="tag tag-cyan article-tag-pill">#{tag}</span>
                        ))}
                      </div>

                      <div className="insight-footer">
                        <Link to={`/blogs/${blog.slug}`} className="btn-read-more">
                          <span>Read Full Article</span>
                          <ArrowRight size={14} className="article-arrow-icon" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="insights-action-footer">
              <Link to="/blogs" className="btn btn-secondary">
                <BookOpenText size={16} /> Explore All Articles
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="contact-section section">
        <div className="container">
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">Let's collaborate on AI models, system integrations, or scale backends. Fill out your details to receive an instant thank-you confirmation email.</p>

          <div className="contact-container">
            <div className="contact-sidebar">
              <div className="glass-panel contact-sidebar-card">
                <h3>Contact Information</h3>
                <p className="sidebar-description">Feel free to reach out via email or connect with me on social platforms. I'm always open to discussing new projects, design systems, and AI workflows.</p>
                <div className="sidebar-links">
                  {profile?.email && (
                    <div className="sidebar-item">
                      <Mail className="accent-icon" size={16} />
                      <a href={`mailto:${profile.email}`}>{profile.email}</a>
                    </div>
                  )}
                  {profile?.location && (
                    <div className="sidebar-item">
                      <MapPin className="accent-icon" size={16} />
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="contact-form-wrapper">
              <form onSubmit={handleContactSubmit} className="glass-panel contact-form">
                {contactStatus.message && (
                  <div className={`form-alert alert-${contactStatus.type}`}>
                    {contactStatus.type === 'success' ? <CheckCircle2 size={16} /> : <Info size={16} />}
                    <span>{contactStatus.message}</span>
                  </div>
                )}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Name *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required
                      placeholder="e.g. Omkar Pardeshi"
                      value={contactData.name} 
                      onChange={e => setContactData({ ...contactData, name: e.target.value })} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      required
                      placeholder="e.g. omkar@example.com"
                      value={contactData.email} 
                      onChange={e => setContactData({ ...contactData, email: e.target.value })} 
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Subject Topic</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="e.g. AI Workflow Collaboration / Project Inquiry"
                    value={contactData.subject} 
                    onChange={e => setContactData({ ...contactData, subject: e.target.value })} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Message Details *</label>
                  <textarea 
                    className="form-control" 
                    required
                    placeholder="Provide a brief overview of your inquiry or proposed project..."
                    value={contactData.message} 
                    onChange={e => setContactData({ ...contactData, message: e.target.value })} 
                  />
                </div>
                
                <button type="submit" className="btn btn-primary w-full" disabled={sendingContact}>
                  {sendingContact ? (
                    <>
                      <Loader2 size={16} className="spin-icon" /> Sending Email...
                    </>
                  ) : (
                    <>
                      <Send size={15} /> Send Message &amp; Dispatch Confirmation
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* SPEC SHEET PROJECT MODAL */}
      {selectedProject && (
        <div 
          className="modal-backdrop" 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedProject(null);
            }
          }}
        >
          <div className="modal-content glass-panel spec-sheet-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header-bar">
              <div className="modal-title-badge">
                <Zap size={14} className="accent-red-icon" /> SYSTEM ARCHITECTURE SPEC SHEET
              </div>
              <button 
                type="button"
                className="spec-close-btn" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedProject(null);
                }} 
                aria-label="Close modal"
                title="Close Spec Sheet (Esc)"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-scroll-body" data-lenis-prevent="true">
              {selectedProject.image_url && (
                <div className="modal-image-wrapper">
                  <img src={selectedProject.image_url} alt={selectedProject.title} className="modal-image" />
                  <div className="modal-image-shade" />
                </div>
              )}

              <h2 className="modal-title">{selectedProject.title}</h2>

              <div className="modal-section-box">
                <span className="modal-box-label"><Cpu size={14} className="accent-red-icon" /> IMPLEMENTED TECHNOLOGIES &amp; FRAMEWORKS</span>
                <div className="modal-tags">
                  {selectedProject.tech_stack_list?.map((tech, i) => (
                    <span key={i} className="tag tag-cyan modal-tech-pill">
                      <TechBrandIcon name={tech} size={16} />
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="modal-section-box markdown-spec-box">
                <span className="modal-box-label"><Info size={14} className="accent-red-icon" /> DETAILED ARCHITECTURE SPECS</span>
                <div className="modal-markdown">
                  <MarkdownRenderer content={selectedProject.long_description || selectedProject.description} />
                </div>
              </div>
            </div>

            <div className="modal-footer-bar">
              <div className="modal-footer-hint">Press <kbd>ESC</kbd> to close</div>
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedProject(null);
                }} 
                className="btn btn-secondary"
              >
                <X size={15} /> Close Spec Sheet
              </button>
              {selectedProject.github_url && (
                <a href={selectedProject.github_url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                  <Github size={16} /> View Source Code
                </a>
              )}
              {selectedProject.demo_url && (
                <a href={selectedProject.demo_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <ExternalLink size={16} /> Launch Live System Demo
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SKILL DETAIL SPECIFICATION MODAL */}
      {selectedSkill && (() => {
        const brandColor = selectedSkill.color_theme || getTechBrandColor(selectedSkill.name);
        const percentageVal = Math.min(100, Math.max(0, selectedSkill.percentage ?? 85));
        const activeTicks = Math.round((percentageVal / 100) * 10);
        const categoryLabel = categories[selectedSkill.category] || selectedSkill.category?.replace('_', ' ') || 'General';
        const skillDescription = selectedSkill.description?.trim() || `### Overview & Architecture
**${selectedSkill.name}** is a core technology in my production engineering stack, utilized for architecting scalable, high-throughput systems and modular components.

### Core Competencies & Production Usage
- **Production Implementation:** Deep practical experience architecting, debugging, and maintaining enterprise solutions using ${selectedSkill.name}.
- **System Integration:** Seamlessly integrated with RESTful APIs, distributed databases, and automated background workers.
- **Performance & Reliability:** Engineered for high availability, low latency, and efficient resource utilization.
- **Testing & Tooling:** Maintained comprehensive test coverage and automated deployment workflows.`;

        const relatedProjects = projects.filter(p => 
          p.tech_stack_list?.some(t => t?.toLowerCase() === selectedSkill.name?.toLowerCase()) ||
          p.tech_stack?.toLowerCase().includes(selectedSkill.name?.toLowerCase())
        );

        return (
          <div 
            className="modal-backdrop skill-detail-backdrop" 
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedSkill(null);
              }
            }}
          >
            <div 
              className="modal-content glass-panel spec-sheet-modal skill-detail-modal" 
              onClick={e => e.stopPropagation()}
              style={{ '--brand-color': brandColor }}
            >
              <div className="skill-modal-glow" style={{ background: `radial-gradient(circle, ${brandColor}25 0%, transparent 70%)` }} />
              
              <div className="modal-header-bar" style={{ borderBottomColor: `${brandColor}35` }}>
                <div className="modal-title-badge">
                  <Sparkles size={14} style={{ color: brandColor }} /> SKILL &amp; EXPERTISE SPECIFICATION
                </div>
                <button 
                  type="button"
                  className="spec-close-btn" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedSkill(null);
                  }} 
                  aria-label="Close modal"
                  title="Close (Esc)"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="modal-scroll-body" data-lenis-prevent="true">
                {/* Skill Top Header with Logo, Name, Category, Proficiency */}
                <div className="skill-modal-hero" style={{ borderColor: `${brandColor}35` }}>
                  <div className="skill-modal-logo-wrapper" style={{ borderColor: brandColor, background: `${brandColor}18` }}>
                    {selectedSkill.logo_url ? (
                      <img src={selectedSkill.logo_url} alt={selectedSkill.name} className="skill-modal-logo-img" />
                    ) : (
                      <TechBrandIcon name={selectedSkill.name} size={36} />
                    )}
                  </div>
                  <div className="skill-modal-hero-details">
                    <div className="skill-modal-badges">
                      <span className="badge category-badge modal-category-badge">
                        {categoryLabel}
                      </span>
                      {selectedSkill.proficiency && (
                        <span className="skill-mini-proficiency" style={{ borderColor: `${brandColor}60`, color: brandColor, background: `${brandColor}15` }}>
                          {selectedSkill.proficiency}
                        </span>
                      )}
                    </div>
                    <h2 className="modal-title skill-modal-name">{selectedSkill.name}</h2>
                    <div className="skill-modal-quick-stats">
                      <span className="quick-stat-item">
                        <Award size={12} style={{ color: brandColor }} /> {percentageVal}% Proficiency
                      </span>
                      {relatedProjects.length > 0 && (
                        <span className="quick-stat-item">
                          <Layers size={12} style={{ color: brandColor }} /> {relatedProjects.length} Linked {relatedProjects.length === 1 ? 'Project' : 'Projects'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Proficiency Gauge Section */}
                <div className="modal-section-box">
                  <div className="skill-modal-meter-header">
                    <span className="modal-box-label">
                      <Award size={14} style={{ color: brandColor }} /> PROFICIENCY LEVEL &amp; MASTERY
                    </span>
                    <span className="skill-modal-pct" style={{ color: brandColor }}>
                      {percentageVal}%
                    </span>
                  </div>
                  <div className="skill-meter" style={{ height: '10px' }}>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <span
                        key={i}
                        className={`meter-tick ${i < activeTicks ? 'active' : ''}`}
                        style={{
                          height: '10px',
                          backgroundColor: i < activeTicks ? brandColor : undefined,
                          borderColor: i < activeTicks ? brandColor : undefined,
                          boxShadow: i < activeTicks ? `0 0 8px ${brandColor}` : undefined
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Detailed Description Section */}
                <div className="modal-section-box markdown-spec-box">
                  <span className="modal-box-label">
                    <Info size={14} style={{ color: brandColor }} /> DESCRIPTION &amp; PRACTICAL APPLICATION
                  </span>
                  <div className="modal-markdown skill-modal-description">
                    <MarkdownRenderer content={skillDescription} />
                  </div>
                </div>

                {/* Related Projects if any */}
                {relatedProjects.length > 0 && (
                  <div className="modal-section-box">
                    <span className="modal-box-label">
                      <Layers size={14} style={{ color: brandColor }} /> FEATURED IN PROJECTS ({relatedProjects.length})
                    </span>
                    <div className="skill-modal-related-projects">
                      {relatedProjects.map(p => (
                        <div 
                          key={p.id} 
                          className="skill-related-project-pill"
                          onClick={() => {
                            setSelectedSkill(null);
                            setSelectedProject(p);
                          }}
                          title={`View ${p.title} architecture specs`}
                        >
                          <Zap size={14} style={{ color: brandColor }} />
                          <div className="related-project-info">
                            <span className="related-project-title">{p.title}</span>
                            {p.tech_stack && (
                              <span className="related-project-stack">{p.tech_stack}</span>
                            )}
                          </div>
                          <ArrowRight size={13} className="pill-arrow" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer-bar">
                <div className="modal-footer-hint">Press <kbd>ESC</kbd> to close</div>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedSkill(null);
                  }} 
                  className="btn btn-primary"
                >
                  <X size={15} /> Close Overview
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      <style>{`
        .portfolio-page { padding-top: 60px; position: relative; }
        .bg-alt { background-color: var(--bg-secondary); position: relative; }

        /* Ambient Dark Red Glows */
        .hero-section {
          padding: 120px 0 80px;
          min-height: 85vh;
          display: flex; align-items: center;
          position: relative;
        }
        .hero-ambient-glow {
          position: absolute;
          top: -10%; left: -10%;
          width: 50vw; height: 50vw;
          max-width: 600px; max-height: 600px;
          background: radial-gradient(circle, rgba(128, 10, 28, 0.22) 0%, rgba(246, 36, 64, 0.08) 45%, transparent 70%);
          pointer-events: none;
          z-index: 0;
          filter: blur(50px);
        }
        .hero-container {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          align-items: center;
          gap: 40px;
          position: relative;
          z-index: 1;
        }
        .hero-content { text-align: left; }
        .technical-decor { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .decor-line {
          width: 28px; height: 2px;
          background: linear-gradient(90deg, var(--accent-red) 0%, var(--accent-dark-red) 100%);
          box-shadow: 0 0 8px var(--accent-red);
        }
        .hero-badge {
          font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 2px; color: var(--text-secondary);
        }
        .hero-title {
          font-size: clamp(2.2rem, 5.5vw, 3.5rem);
          font-weight: 800; line-height: 1.1; margin-bottom: 12px; letter-spacing: -1.5px;
        }
        .hero-title .highlight {
          background: linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 40%, var(--accent-red) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 20px rgba(246, 36, 64, 0.15);
        }
        .hero-subtitle {
          font-size: clamp(1.1rem, 2.5vw, 1.4rem);
          font-family: var(--font-mono); font-weight: 500; color: var(--text-secondary); margin-bottom: 20px; min-height: 34px;
        }
        .typing-cursor {
          animation: blink 0.8s infinite; color: var(--accent-red); font-weight: bold; text-shadow: 0 0 8px var(--accent-red);
        }
        @keyframes blink { 50% { opacity: 0; } }

        .hero-description {
          font-size: clamp(0.92rem, 2vw, 1.05rem); color: var(--text-secondary); margin-bottom: 28px; max-width: 580px;
        }
        .hero-buttons { display: flex; gap: 14px; margin-bottom: 32px; }
        .hero-contact-info { display: flex; flex-wrap: wrap; gap: 20px; color: var(--text-muted); font-size: 0.78rem; font-family: var(--font-mono); text-transform: uppercase; }
        .info-item { display: flex; align-items: center; gap: 6px; }
        .accent-red-icon { color: var(--accent-red); }

        /* TERMINAL MOCKUP STYLES WITH LIGHT MODE OVERRIDES */
        .terminal-container {
          background: #020204 !important;
          border: 1px solid rgba(128, 10, 28, 0.25);
          height: 330px; display: flex; flex-direction: column;
          font-family: var(--font-mono); text-align: left; overflow: hidden;
          box-shadow: 0 20px 40px -20px rgba(0,0,0,0.95), 0 0 25px rgba(128, 10, 28, 0.18);
          transition: var(--transition-smooth);
        }
        .terminal-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 16px; background: rgba(128, 10, 28, 0.08);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .terminal-dots { display: flex; gap: 6px; }
        .terminal-dots .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
        .terminal-dots .red    { background: #F62440; box-shadow: 0 0 6px #F62440; }
        .terminal-dots .yellow { background: #ffbd2e; }
        .terminal-dots .green  { background: #27c93f; }
        .terminal-title { font-size: 0.68rem; color: var(--text-muted); letter-spacing: 0.5px; }
        .terminal-body {
          flex: 1; padding: 14px; overflow-y: auto; font-size: 0.78rem; display: flex; flex-direction: column; gap: 10px; line-height: 1.4;
        }
        .terminal-input-line, .terminal-input-form { display: flex; align-items: center; gap: 8px; }
        .terminal-prompt { color: var(--accent-red); font-weight: bold; }
        .terminal-command { color: #ffffff; }
        .terminal-output { color: var(--text-secondary); white-space: pre-wrap; font-family: var(--font-mono); }
        .terminal-input { flex: 1; background: transparent; border: none; color: #ffffff; font-family: var(--font-mono); font-size: 0.78rem; }

        /* Light Mode Terminal Overrides */
        body.light-theme .terminal-container {
          background: #FFFFFF !important;
          border: 1px solid rgba(246, 36, 64, 0.3);
          box-shadow: 0 20px 40px -20px rgba(15, 23, 42, 0.12), 0 0 20px rgba(153, 0, 17, 0.1);
        }
        body.light-theme .terminal-header {
          background: rgba(246, 36, 64, 0.06);
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }
        body.light-theme .terminal-title { color: #475569; }
        body.light-theme .terminal-prompt { color: #990011; }
        body.light-theme .terminal-command { color: #0F172A; font-weight: 700; }
        body.light-theme .terminal-output { color: #334155; }
        body.light-theme .terminal-input { color: #0F172A; }

        /* ABOUT ME STYLES & LUXURY CYBERNETIC LAYOUT */
        .about-section { 
          position: relative; 
          padding: 100px 0;
        }
        .about-ambient-glow {
          position: absolute; right: -10%; top: 20%;
          width: 45vw; height: 45vw; max-width: 500px; max-height: 500px;
          background: radial-gradient(circle, rgba(128, 10, 28, 0.22) 0%, rgba(246, 36, 64, 0.05) 50%, transparent 70%);
          filter: blur(60px); pointer-events: none;
        }
        .section-badge-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 12px;
        }
        .section-pill-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 5px 14px;
          border-radius: 999px;
          background: rgba(128, 10, 28, 0.25);
          border: 1px solid rgba(246, 36, 64, 0.35);
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--accent-red);
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }
        .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--accent-red);
          box-shadow: 0 0 8px var(--accent-red);
          animation: pulseGlow 2s infinite ease-in-out;
        }
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }

        .about-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 18px;
          margin: 36px 0 40px 0;
        }
        .stat-card {
          padding: 20px 22px;
          display: flex;
          align-items: center;
          gap: 16px;
          border-left: 3px solid var(--accent-red);
          border-radius: var(--border-radius-md);
          background: rgba(10, 10, 15, 0.65);
          border-top: 1px solid rgba(246, 36, 64, 0.15);
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .stat-card:hover {
          transform: translateY(-4px);
          border-left-color: #FFFFFF;
          border-top-color: var(--accent-red);
          box-shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.85), 0 0 20px rgba(128, 10, 28, 0.3);
        }
        .stat-icon-wrapper {
          width: 44px; height: 44px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(246, 36, 64, 0.2) 0%, rgba(128, 10, 28, 0.35) 100%);
          border: 1px solid rgba(246, 36, 64, 0.35);
          display: flex; align-items: center; justify-content: center;
          color: var(--accent-red);
          flex-shrink: 0;
          transition: all 0.3s ease;
        }
        .stat-card:hover .stat-icon-wrapper {
          color: #FFFFFF;
          background: var(--accent-red);
          box-shadow: 0 0 16px var(--accent-red);
          transform: scale(1.08);
        }
        .stat-content { display: flex; flex-direction: column; text-align: left; gap: 2px; }
        .stat-number { font-family: var(--font-sans); font-size: 1.05rem; font-weight: 800; color: #FFFFFF; letter-spacing: -0.3px; }
        .stat-label { font-family: var(--font-mono); font-size: 0.68rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; }

        .about-main-layout {
          display: grid;
          grid-template-columns: 1.18fr 0.82fr;
          gap: 32px;
          align-items: start;
          text-align: left;
        }
        .about-bio-card {
          padding: 34px;
          border: 1px solid rgba(246, 36, 64, 0.2);
          background: rgba(10, 10, 15, 0.7);
          border-radius: var(--border-radius-lg);
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 45px -15px rgba(0, 0, 0, 0.9);
        }
        .card-header-badge {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700;
          color: var(--accent-red); letter-spacing: 1.5px;
          margin-bottom: 22px;
          text-transform: uppercase;
        }
        .badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--accent-red); box-shadow: 0 0 8px var(--accent-red);
        }
        .about-markdown-body {
          color: var(--text-secondary);
          font-size: 0.96rem;
          line-height: 1.8;
        }
        .about-markdown-body p {
          margin-bottom: 16px;
        }
        .about-markdown-body strong {
          color: #FFFFFF;
          font-weight: 700;
        }

        /* RESUME ACTION BOX */
        .about-resume-box {
          margin-top: 30px;
          padding: 22px 24px;
          border-radius: var(--border-radius-md);
          background: linear-gradient(135deg, rgba(128, 10, 28, 0.28) 0%, rgba(7, 7, 10, 0.98) 100%);
          border: 1px solid rgba(246, 36, 64, 0.4);
          box-shadow: 0 12px 35px -10px rgba(0, 0, 0, 0.9), 0 0 22px rgba(128, 10, 28, 0.25);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
          flex-wrap: wrap;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease;
        }
        .about-resume-box:hover {
          border-color: var(--accent-red);
          box-shadow: 0 18px 40px -10px rgba(0, 0, 0, 0.95), 0 0 28px rgba(246, 36, 64, 0.4);
          transform: translateY(-3px);
        }
        .resume-box-left {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
          min-width: 260px;
        }
        .resume-icon-badge {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          background: rgba(246, 36, 64, 0.18);
          border: 1px solid rgba(246, 36, 64, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--accent-red);
          transition: all 0.3s ease;
        }
        .about-resume-box:hover .resume-icon-badge {
          background: var(--accent-red);
          color: #FFFFFF;
          box-shadow: 0 0 16px var(--accent-red);
        }
        .resume-info-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
          text-align: left;
        }
        .resume-status-badge {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--accent-red);
          letter-spacing: 1.2px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .resume-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0;
          letter-spacing: -0.4px;
        }
        .resume-desc {
          font-size: 0.82rem;
          color: var(--text-secondary);
          margin: 0;
          line-height: 1.5;
        }
        .resume-action-buttons {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          flex-shrink: 0;
        }
        .resume-download-btn {
          background: linear-gradient(135deg, var(--accent-red) 0%, var(--accent-dark-red) 100%) !important;
          border-color: var(--accent-red) !important;
          color: #FFFFFF !important;
          box-shadow: 0 0 16px var(--accent-red-glow);
          font-weight: 700;
          padding: 11px 20px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .resume-download-btn:hover {
          box-shadow: 0 0 24px var(--accent-red) !important;
          transform: translateY(-2px);
        }
        .resume-download-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .resume-preview-btn {
          padding: 11px 18px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        /* PILLARS COLUMN */
        .about-pillars-column { display: flex; flex-direction: column; gap: 14px; text-align: left; }
        .pillars-header-wrap {
          margin-bottom: 8px;
        }
        .pillars-heading {
          font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700;
          color: var(--text-secondary); letter-spacing: 1.5px;
          text-transform: uppercase;
        }
        .pillars-grid { display: flex; flex-direction: column; gap: 14px; }
        .pillar-card {
          padding: 20px 22px;
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-left: 3px solid transparent;
          background: rgba(10, 10, 15, 0.6);
          border-radius: var(--border-radius-md);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pillar-card:hover, .pillar-card.active {
          border-color: rgba(246, 36, 64, 0.4);
          border-left-color: var(--accent-red);
          background: rgba(128, 10, 28, 0.16);
          box-shadow: 0 12px 30px -10px rgba(0,0,0,0.85), 0 0 18px rgba(128, 10, 28, 0.3);
          transform: translateX(4px);
        }
        .pillar-header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
        .pillar-icon-box {
          width: 36px; height: 36px;
          border-radius: 8px;
          background: rgba(246, 36, 64, 0.15);
          border: 1px solid rgba(246, 36, 64, 0.3);
          display: flex; align-items: center; justify-content: center;
          color: var(--accent-red);
          flex-shrink: 0;
          transition: all 0.3s ease;
        }
        .pillar-card:hover .pillar-icon-box, .pillar-card.active .pillar-icon-box {
          background: var(--accent-red);
          color: #FFFFFF;
          box-shadow: 0 0 12px var(--accent-red);
        }
        .pillar-title { font-family: var(--font-sans); font-size: 1rem; font-weight: 700; color: #FFFFFF; margin: 0; }
        .pillar-desc { font-size: 0.84rem; color: var(--text-secondary); line-height: 1.6; margin: 0; }

        /* Light Mode About Overrides */
        body.light-theme .about-bio-card {
          background: #FFFFFF;
          border-color: rgba(246, 36, 64, 0.2);
          box-shadow: 0 15px 35px -10px rgba(15, 23, 42, 0.08);
        }
        body.light-theme .stat-card {
          background: #FFFFFF;
          border-color: rgba(246, 36, 64, 0.15);
          box-shadow: 0 10px 25px -10px rgba(15, 23, 42, 0.06);
        }
        body.light-theme .stat-number { color: #0F172A; }
        body.light-theme .pillar-card {
          background: #FFFFFF;
          border-color: rgba(0, 0, 0, 0.08);
          box-shadow: 0 8px 20px -8px rgba(15, 23, 42, 0.06);
        }
        body.light-theme .pillar-card:hover, body.light-theme .pillar-card.active {
          background: rgba(246, 36, 64, 0.04);
          border-color: rgba(246, 36, 64, 0.3);
          border-left-color: var(--accent-red);
        }
        body.light-theme .pillar-title { color: #0F172A; }
        body.light-theme .about-resume-box {
          background: linear-gradient(135deg, rgba(246, 36, 64, 0.08) 0%, #FFFFFF 100%);
          border-color: rgba(246, 36, 64, 0.3);
          box-shadow: 0 12px 30px -10px rgba(15, 23, 42, 0.1);
        }
        body.light-theme .resume-title { color: #0F172A; }
        body.light-theme .resume-desc { color: #475569; }

        @media (max-width: 960px) {
          .about-main-layout { grid-template-columns: 1fr; gap: 28px; }
          .about-resume-box { flex-direction: column; align-items: flex-start; }
          .resume-action-buttons { width: 100%; justify-content: flex-start; }
        }

        /* SKILLS STYLES */
        .skills-section { position: relative; }
        .skills-ambient-glow {
          position: absolute; left: -10%; top: 30%;
          width: 50vw; height: 50vw; max-width: 550px; max-height: 550px;
          background: radial-gradient(circle, rgba(128, 10, 28, 0.16) 0%, rgba(246, 36, 64, 0.04) 50%, transparent 70%);
          filter: blur(65px); pointer-events: none;
        }
        .skills-control-bar {
          padding: 16px 22px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }
        .skills-search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(246, 36, 64, 0.25);
          border-radius: var(--border-radius-sm);
          padding: 8px 14px;
          width: 320px;
          max-width: 100%;
          transition: var(--transition-smooth);
        }
        .skills-search-box:focus-within {
          border-color: var(--accent-red);
          box-shadow: 0 0 12px var(--accent-red-glow);
        }
        .search-icon-accent { color: var(--accent-red); }
        .skills-search-box input {
          background: transparent; border: none; color: #FFFFFF;
          font-family: var(--font-mono); font-size: 0.8rem; width: 100%;
        }
        .skills-search-box input::placeholder { color: var(--text-muted); }
        .clear-search-btn { background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 2px; display: flex; }
        .clear-search-btn:hover { color: var(--accent-red); }

        .skills-legend-wrapper {
          display: flex; align-items: center; gap: 16px;
          font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-secondary);
        }
        .legend-item { display: flex; align-items: center; gap: 6px; }
        .legend-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
        .legend-dot.expert   { background: #F62440; box-shadow: 0 0 6px #F62440; }
        .legend-dot.advanced { background: #3776AB; box-shadow: 0 0 6px #3776AB; }
        .legend-dot.applied  { background: #10B981; box-shadow: 0 0 6px #10B981; }

        .skills-filter-wrapper {
          display: flex; gap: 8px; padding: 8px; margin-bottom: 28px; overflow-x: auto; border-radius: var(--border-radius-sm);
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .skills-filter-wrapper::-webkit-scrollbar { display: none; }
        .skill-tab-btn {
          background: transparent; border: none; color: var(--text-secondary); padding: 8px 14px;
          font-size: 0.72rem; font-family: var(--font-mono); text-transform: uppercase; cursor: pointer;
          transition: var(--transition-smooth); border-radius: var(--border-radius-sm);
          white-space: nowrap;
        }
        .skill-tab-btn.active, .skill-tab-btn:hover { background: rgba(128, 10, 28, 0.2); color: var(--text-primary); border-color: rgba(246, 36, 64, 0.3); }
        .skills-filtered-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 18px; text-align: left; }
        
        .skill-metric-card {
          padding: 18px;
          display: flex; flex-direction: column; gap: 14px;
          border-radius: var(--border-radius-md);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease;
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }
        .skill-card-top-stripe {
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          opacity: 0.85;
          transition: height 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease;
        }
        .skill-metric-card:hover {
          border-color: var(--brand-color);
          box-shadow: 0 18px 36px -8px rgba(0, 0, 0, 0.9), 0 0 22px var(--brand-color);
          transform: translateY(-5px);
        }
        .skill-metric-card:hover .skill-card-top-stripe {
          height: 3px;
          box-shadow: 0 0 12px var(--brand-color);
        }
        .skill-metric-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
        .skill-metric-main { display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1; }
        .skill-metric-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; text-align: left; }
        .skill-name-text {
          font-size: 0.96rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.3;
          word-break: break-word;
          letter-spacing: -0.2px;
        }
        .skill-category-sub {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .brand-logo-icon {
          display: flex; align-items: center; justify-content: center;
          width: 32px; height: 32px;
          border-radius: 6px; flex-shrink: 0;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease;
        }
        .skill-metric-card:hover .brand-logo-icon {
          transform: scale(1.12);
          box-shadow: 0 0 14px var(--brand-color);
        }
        .skill-mini-proficiency {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          padding: 2px 8px;
          border-radius: 20px;
          border: 1px solid;
          white-space: nowrap;
          flex-shrink: 0;
          background: rgba(0, 0, 0, 0.25);
        }
        .category-badge { font-size: 0.58rem; padding: 2px 6px; background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-color); }
        .skill-meter-container { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .skill-meter { display: flex; gap: 3px; flex: 1; }
        .meter-tick { height: 7px; flex: 1; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.02); border-radius: 1px; transition: var(--transition-smooth); }
        .meter-percentage-text { font-family: var(--font-mono); font-size: 0.76rem; font-weight: 800; }

        .skill-card-footer-hint {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 5px;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 600;
          color: var(--brand-color);
          opacity: 0;
          transform: translateY(4px);
          transition: all 0.25s ease;
          margin-top: -6px;
        }
        .skill-metric-card:hover .skill-card-footer-hint {
          opacity: 1;
          transform: translateY(0);
        }
        .hint-arrow { transition: transform 0.2s ease; }
        .skill-metric-card:hover .hint-arrow { transform: translateX(2px) translateY(-1px); }

        /* ── SKILL DETAIL MODAL SPECIFIC STYLES ── */
        .skill-detail-modal {
          max-width: 640px;
          position: relative;
        }
        .skill-modal-glow {
          position: absolute;
          top: -60px; right: -60px;
          width: 320px; height: 320px;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(60px);
          z-index: 0;
          opacity: 0.6;
        }
        .skill-modal-hero {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 18px 22px;
          background: rgba(0, 0, 0, 0.45);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-md);
          position: relative;
          z-index: 1;
        }
        .skill-modal-logo-wrapper {
          width: 64px;
          height: 64px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.45);
        }
        .skill-modal-logo-img {
          width: 42px;
          height: 42px;
          object-fit: contain;
        }
        .skill-modal-hero-details {
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-align: left;
          flex: 1;
        }
        .skill-modal-badges {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .modal-category-badge {
          font-size: 0.68rem;
          padding: 3px 9px;
          text-transform: uppercase;
          font-family: var(--font-mono);
        }
        .skill-modal-name {
          font-size: 1.55rem;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0;
          letter-spacing: -0.5px;
        }
        .skill-modal-quick-stats {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          margin-top: 2px;
        }
        .quick-stat-item {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-secondary);
        }
        .skill-modal-meter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .skill-modal-pct {
          font-family: var(--font-mono);
          font-size: 1.15rem;
          font-weight: 800;
        }
        .skill-modal-description {
          line-height: 1.7;
          font-size: 0.92rem;
          color: var(--text-secondary);
        }
        .skill-modal-empty-desc {
          margin: 0;
          color: var(--text-secondary);
          font-style: italic;
        }
        .skill-modal-related-projects {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .skill-related-project-pill {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          color: var(--text-primary);
          transition: var(--transition-smooth);
        }
        .skill-related-project-pill:hover {
          background: rgba(128, 10, 28, 0.2);
          border-color: var(--accent-red);
          transform: translateX(4px);
        }
        .related-project-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }
        .related-project-title {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .related-project-stack {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        .modal-footer-hint {
          margin-right: auto;
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 0.74rem;
          color: var(--text-muted);
        }
        kbd {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          padding: 2px 6px;
          font-size: 0.68rem;
          font-family: var(--font-mono);
          color: var(--text-primary);
        }

        .catalog-trigger-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          padding: 6px 12px;
          border-radius: var(--border-radius-sm);
          white-space: nowrap;
          cursor: pointer;
          transition: var(--transition-smooth);
        }
        .catalog-trigger-btn:hover {
          border-color: var(--accent-red);
          color: #FFFFFF;
          box-shadow: 0 0 10px var(--accent-red-glow);
        }

        /* ── VIEW MORE BANNER ── */
        .skills-view-more-banner {
          margin-top: 24px;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border: 1px solid rgba(246, 36, 64, 0.25);
          background: linear-gradient(90deg, rgba(128, 10, 28, 0.15) 0%, rgba(7, 7, 10, 0.6) 100%);
          border-radius: var(--border-radius-md);
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.8);
        }
        .view-more-info {
          display: flex;
          align-items: center;
          gap: 16px;
          text-align: left;
        }
        .view-more-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: rgba(128, 10, 28, 0.25);
          border: 1px solid rgba(246, 36, 64, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .view-more-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 4px 0;
          letter-spacing: -0.3px;
        }
        .view-more-subtitle {
          font-size: 0.82rem;
          color: var(--text-secondary);
          margin: 0;
        }
        .skills-view-more-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          padding: 10px 20px;
          font-size: 0.85rem;
          flex-shrink: 0;
        }

        /* Light theme overrides for skill elements */
        body.light-theme .skills-view-more-banner {
          background: linear-gradient(90deg, rgba(246, 36, 64, 0.06) 0%, #FFFFFF 100%);
          border-color: rgba(246, 36, 64, 0.2);
        }
        body.light-theme .view-more-icon-box {
          background: rgba(246, 36, 64, 0.08);
          border-color: rgba(246, 36, 64, 0.2);
        }
        body.light-theme .view-more-title {
          color: #0F172A;
        }
        body.light-theme .catalog-trigger-btn {
          background: #FFFFFF;
          border-color: rgba(0, 0, 0, 0.12);
          color: #0F172A;
        }
        body.light-theme .skill-mini-proficiency {
          background: rgba(255, 255, 255, 0.85);
        }
        body.light-theme .skill-modal-hero {
          background: #F8FAFC;
          border-color: rgba(0, 0, 0, 0.08);
        }
        body.light-theme .skill-modal-name {
          color: #0F172A;
        }
        body.light-theme .skill-related-project-pill {
          background: #FFFFFF;
          border-color: rgba(0, 0, 0, 0.08);
          color: #0F172A;
        }
        body.light-theme .related-project-title {
          color: #0F172A;
        }
        body.light-theme .skill-related-project-pill:hover {
          background: rgba(246, 36, 64, 0.06);
          border-color: rgba(246, 36, 64, 0.3);
        }
        body.light-theme .skill-modal-description {
          color: #334155;
        }
        body.light-theme kbd {
          background: rgba(15, 23, 42, 0.06);
          border-color: rgba(15, 23, 42, 0.15);
          color: #0F172A;
        }

        .empty-skills-panel {
          padding: 48px 24px;
          text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 12px;
        }
        .empty-icon { color: var(--accent-red); opacity: 0.6; }
        .empty-skills-panel h4 { font-size: 1.1rem; color: #FFFFFF; }
        .empty-skills-panel p { color: var(--text-secondary); font-size: 0.85rem; }

        /* FEATURED PROJECTS WITH PROFESSIONAL ANIMATIONS & CYBERNETIC AESTHETICS */
        .projects-section { position: relative; }
        .projects-ambient-glow {
          position: absolute; right: -10%; bottom: 10%;
          width: 50vw; height: 50vw; max-width: 550px; max-height: 550px;
          background: radial-gradient(circle, rgba(128, 10, 28, 0.18) 0%, rgba(246, 36, 64, 0.05) 50%, transparent 70%);
          filter: blur(65px); pointer-events: none;
        }
        .projects-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); 
          gap: 28px; 
          text-align: left; 
        }
        
        .professional-card {
          display: flex; flex-direction: column; height: 100%; overflow: hidden;
          border-radius: var(--border-radius-md); position: relative;
          transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease;
          border: 1px solid var(--border-color);
          background: rgba(7, 7, 9, 0.75);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.85);
        }
        .professional-card .project-top-stripe, .professional-card .exp-top-stripe {
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--accent-red) 0%, var(--accent-dark-red) 60%, transparent 100%);
          z-index: 4; transition: height 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease;
        }
        .professional-card:hover {
          border-color: rgba(246, 36, 64, 0.45);
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.95), 0 0 30px rgba(128, 10, 28, 0.35);
          transform: translateY(-6px);
        }
        .professional-card:hover .project-top-stripe, .professional-card:hover .exp-top-stripe {
          height: 3px;
          box-shadow: 0 0 14px var(--accent-red);
        }
        .project-image-container { 
          height: 200px; 
          overflow: hidden; 
          border-bottom: 1px solid var(--border-color); 
          position: relative; 
        }
        .project-image { 
          width: 100%; 
          height: 100%; 
          object-fit: cover; 
          transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1); 
        }
        .image-overlay-glow {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(7, 7, 10, 0.85) 100%);
          pointer-events: none;
          z-index: 1;
        }
        .professional-card:hover .project-image { transform: scale(1.06); }

        /* Floating Badges on Images */
        .card-floating-badges {
          position: absolute; top: 12px; left: 12px; right: 12px;
          display: flex; justify-content: space-between; align-items: center;
          z-index: 3; pointer-events: none;
        }
        .floating-status-badge {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: var(--font-mono); font-size: 0.68rem; font-weight: 700;
          padding: 4px 10px; border-radius: 999px;
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          text-transform: uppercase; letter-spacing: 0.6px;
        }
        .floating-status-badge.live {
          background: rgba(16, 185, 129, 0.18);
          border: 1px solid rgba(16, 185, 129, 0.45);
          color: #10B981;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.2);
        }
        .live-pulsing-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #10B981; box-shadow: 0 0 8px #10B981;
          animation: pulseDot 1.8s infinite;
        }
        @keyframes pulseDot {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.3); opacity: 1; box-shadow: 0 0 12px #10B981; }
          100% { transform: scale(0.95); opacity: 0.8; }
        }
        .floating-status-badge.code {
          background: rgba(128, 10, 28, 0.35);
          border: 1px solid rgba(246, 36, 64, 0.4);
          color: #F8FAFC;
        }

        /* Image Inspect Hover Overlay */
        .project-image-inspect-overlay {
          position: absolute; inset: 0;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(3px);
          -webkit-backdrop-filter: blur(3px);
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: opacity 0.3s ease;
          z-index: 2;
        }
        .professional-card:hover .project-image-inspect-overlay {
          opacity: 1;
        }
        .inspect-pill {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(128, 10, 28, 0.9);
          border: 1px solid var(--accent-red);
          color: #FFFFFF; font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700;
          padding: 8px 16px; border-radius: 999px;
          box-shadow: 0 0 20px rgba(246, 36, 64, 0.5);
          transform: translateY(6px); transition: transform 0.3s ease;
        }
        .professional-card:hover .inspect-pill {
          transform: translateY(0);
        }

        .project-placeholder-hero {
          height: 180px;
          background: linear-gradient(135deg, rgba(128, 10, 28, 0.2) 0%, rgba(7, 7, 10, 0.85) 100%);
          display: flex; align-items: center; justify-content: center; position: relative;
          border-bottom: 1px solid var(--border-color);
        }
        .placeholder-content {
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          color: var(--text-secondary);
        }
        .placeholder-domain {
          font-family: var(--font-mono); font-size: 0.72rem; text-transform: uppercase; letter-spacing: 1px;
        }

        .project-content { padding: 24px; display: flex; flex-direction: column; flex-grow: 1; }
        .project-header-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
        .project-title { font-size: 1.25rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.4px; line-height: 1.3; transition: color 0.3s ease; }
        .professional-card:hover .project-title { color: #FFFFFF; }
        .project-desc { font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 20px; flex-grow: 1; line-height: 1.65; }
        
        .project-tech-header { display: flex; flex-direction: column; gap: 8px; margin-bottom: 22px; }
        .tech-heading-label { font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-muted); display: flex; align-items: center; gap: 6px; letter-spacing: 1.2px; text-transform: uppercase; }
        .project-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .project-tech-pill {
          display: inline-flex; align-items: center; gap: 6px;
          transition: all 0.25s ease;
          background: rgba(128, 10, 28, 0.15);
          border: 1px solid rgba(246, 36, 64, 0.25);
          padding: 4px 10px; font-size: 0.72rem; font-family: var(--font-mono); font-weight: 600;
        }
        .project-tech-pill:hover {
          background: rgba(128, 10, 28, 0.3);
          border-color: var(--accent-red);
          color: #FFFFFF;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(246, 36, 64, 0.25);
        }

        .project-actions { display: flex; gap: 8px; border-top: 1px solid var(--border-color); padding-top: 18px; align-items: center; margin-top: auto; }
        .flex-btn { flex: 1; justify-content: center; }
        .icon-only-btn { padding: 10px 12px; }
        .demo-btn {
          background: linear-gradient(135deg, var(--accent-red) 0%, var(--accent-dark-red) 100%) !important;
          border-color: var(--accent-red) !important;
          box-shadow: 0 0 14px var(--accent-red-glow);
        }
        .demo-btn:hover {
          box-shadow: 0 0 22px var(--accent-red) !important;
        }

        /* WORK HISTORY ENHANCED STYLES */
        .experience-section { position: relative; }
        .experience-ambient-glow {
          position: absolute; left: -10%; top: 20%;
          width: 50vw; height: 50vw; max-width: 550px; max-height: 550px;
          background: radial-gradient(circle, rgba(128, 10, 28, 0.18) 0%, rgba(246, 36, 64, 0.05) 50%, transparent 70%);
          filter: blur(65px); pointer-events: none;
        }
        .timeline { position: relative; max-width: 860px; margin: 0 auto; padding-left: 28px; text-align: left; }
        .timeline::before {
          content: ''; position: absolute; left: 8px; top: 0; bottom: 0; width: 2px;
          background: linear-gradient(180deg, var(--accent-red) 0%, var(--accent-dark-red) 60%, transparent 100%);
          box-shadow: 0 0 10px var(--accent-red-glow);
        }
        .timeline-item { position: relative; margin-bottom: 32px; }
        .timeline-marker {
          position: absolute; left: -29px; top: 12px; width: 14px; height: 14px;
          border-radius: 50%; background: #070709; border: 2px solid var(--accent-red);
          box-shadow: 0 0 12px var(--accent-red); transition: var(--transition-smooth);
        }
        .timeline-item:hover .timeline-marker {
          background: var(--accent-red); transform: scale(1.2);
        }
        .timeline-content { padding: 24px; border-radius: var(--border-radius-md); }
        .company-title {
          font-size: 0.88rem; font-weight: 600; color: var(--text-secondary);
          font-family: var(--font-mono); display: flex; align-items: center; gap: 6px; margin-top: 4px;
        }
        .bullet-check-icon { color: var(--accent-red); flex-shrink: 0; margin-top: 2px; }

        /* ARTICLES SHOWCASE ENHANCED STYLES */
        .insights-section { position: relative; }
        .insights-ambient-glow {
          position: absolute; right: -10%; top: 20%;
          width: 50vw; height: 50vw; max-width: 550px; max-height: 550px;
          background: radial-gradient(circle, rgba(128, 10, 28, 0.18) 0%, rgba(246, 36, 64, 0.05) 50%, transparent 70%);
          filter: blur(65px); pointer-events: none;
        }
        .insights-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); 
          gap: 28px; 
          text-align: left; 
        }
        .insight-card { 
          display: flex; flex-direction: column; height: 100%; overflow: hidden; 
          border-radius: var(--border-radius-md); position: relative; 
        }
        .insight-image-wrapper { 
          height: 195px; 
          overflow: hidden; 
          border-bottom: 1px solid var(--border-color); 
          position: relative; 
        }
        .insight-image { 
          width: 100%; height: 100%; object-fit: cover; 
          transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1); 
        }
        .insight-card:hover .insight-image { transform: scale(1.06); }

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
        .insight-placeholder-hero {
          height: 180px;
          background: linear-gradient(135deg, rgba(128, 10, 28, 0.15) 0%, rgba(7, 7, 10, 0.85) 100%);
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;
          position: relative; border-bottom: 1px solid var(--border-color);
        }

        .insight-body { padding: 24px; display: flex; flex-direction: column; flex-grow: 1; }
        .insight-meta-strip {
          display: flex; gap: 16px; align-items: center; flex-wrap: wrap;
          font-family: var(--font-mono); font-size: 0.72rem;
          color: var(--text-muted); margin-bottom: 12px;
        }
        .insight-date, .insight-author, .insight-readtime { display: flex; align-items: center; gap: 5px; }
        .insight-title { font-size: 1.25rem; font-weight: 800; line-height: 1.35; margin-bottom: 12px; color: var(--text-primary); letter-spacing: -0.4px; }
        .insight-title a { color: var(--text-primary); transition: color 0.3s ease; text-decoration: none; }
        .insight-title a:hover, .insight-card:hover .insight-title a { color: #FFFFFF; }
        .insight-excerpt { font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 18px; flex-grow: 1; line-height: 1.65; }
        .insight-tags-strip { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 22px; }
        .article-tag-pill { font-size: 0.68rem; padding: 3px 8px; }
        .insight-footer { border-top: 1px solid var(--border-color); padding-top: 16px; margin-top: auto; }
        .btn-read-more { 
          display: inline-flex; align-items: center; gap: 7px; 
          font-weight: 700; font-size: 0.82rem; font-family: var(--font-sans);
          color: var(--accent-red); text-transform: uppercase; letter-spacing: 0.8px; 
          transition: all 0.3s ease; 
        }
        .btn-read-more:hover, .insight-card:hover .btn-read-more { gap: 12px; color: #FFFFFF; }
        .article-arrow-icon { transition: transform 0.3s ease; }
        .insight-card:hover .article-arrow-icon { transform: translateX(4px); }
        .insights-action-footer { margin-top: 36px; display: flex; justify-content: center; }

        /* SPEC SHEET MODAL STYLING POSITIONED BELOW NAVBAR WITH SILKY SMOOTH POPUP */
        .modal-backdrop {
          position: fixed; 
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.85); 
          backdrop-filter: blur(16px); 
          -webkit-backdrop-filter: blur(16px);
          z-index: 99999;
          display: flex; 
          align-items: center; 
          justify-content: center;
          padding: 85px 16px 30px 16px;
          animation: backdropFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          overflow: hidden;
        }
        .skill-detail-backdrop {
          z-index: 100000;
          background: rgba(0, 0, 0, 0.90);
          backdrop-filter: blur(18px); 
          -webkit-backdrop-filter: blur(18px);
        }
        .spec-sheet-modal {
          max-width: 780px;
          width: 100%;
          max-height: calc(90vh - 60px);
          height: auto;
          display: flex; 
          flex-direction: column;
          padding: 0 !important;
          border: 1px solid var(--accent-red) !important;
          box-shadow: 0 30px 80px rgba(0,0,0,0.95), 0 0 35px rgba(128, 10, 28, 0.4);
          overflow: hidden;
          animation: modalPopIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: center center;
          position: relative;
        }
        @keyframes backdropFadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes modalPopIn {
          0% {
            opacity: 0;
            transform: scale(0.92) translateY(24px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .modal-header-bar {
          display: flex; 
          justify-content: space-between; 
          align-items: center;
          padding: 14px 22px;
          background: rgba(128, 10, 28, 0.25);
          border-bottom: 1px solid var(--border-color);
          flex-shrink: 0;
          position: relative;
          z-index: 10;
        }
        .modal-title-badge {
          font-family: var(--font-mono); 
          font-size: 0.72rem; 
          font-weight: 700;
          color: var(--text-primary); 
          letter-spacing: 1.5px; 
          display: flex; 
          align-items: center; 
          gap: 8px;
        }
        .spec-close-btn {
          width: 34px; 
          height: 34px;
          border-radius: 50%;
          background: rgba(246, 36, 64, 0.2);
          border: 1px solid rgba(246, 36, 64, 0.45);
          color: #FFFFFF;
          display: flex; 
          align-items: center; 
          justify-content: center;
          cursor: pointer;
          pointer-events: auto;
          position: relative;
          z-index: 20;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .spec-close-btn:hover {
          background: var(--accent-red);
          color: #FFFFFF;
          box-shadow: 0 0 16px var(--accent-red);
          transform: rotate(90deg) scale(1.12);
        }

        .modal-scroll-body {
          padding: 24px 28px;
          overflow-y: auto !important;
          overflow-x: hidden;
          flex: 1 1 auto;
          min-height: 0;
          display: flex; 
          flex-direction: column; 
          gap: 20px;
          scrollbar-width: thin;
          scrollbar-color: var(--accent-red) rgba(0,0,0,0.3);
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
        }
        .modal-scroll-body::-webkit-scrollbar {
          width: 6px;
        }
        .modal-scroll-body::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.25);
        }
        .modal-scroll-body::-webkit-scrollbar-thumb {
          background: var(--accent-red);
          border-radius: 999px;
        }
        .modal-image-wrapper {
          height: 240px; 
          border-radius: var(--border-radius-md);
          position: relative; 
          overflow: hidden; 
          border: 1px solid var(--border-color);
          flex-shrink: 0;
        }
        .modal-image { width: 100%; height: 100%; object-fit: cover; }
        .modal-image-shade {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 50%, rgba(7,7,10,0.9) 100%);
        }
        .modal-title { font-size: 1.6rem; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px; }
        
        .modal-section-box {
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-md);
          padding: 18px 20px;
          display: flex; flex-direction: column; gap: 12px;
          text-align: left;
        }
        .modal-box-label {
          font-family: var(--font-mono); font-size: 0.68rem; font-weight: 700;
          color: var(--text-secondary); letter-spacing: 1.5px; display: flex; align-items: center; gap: 8px;
        }
        .modal-tags { display: flex; flex-wrap: wrap; gap: 8px; }
        .modal-tech-pill {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(128, 10, 28, 0.22);
          border: 1px solid rgba(246, 36, 64, 0.3);
          color: #FFFFFF; font-size: 0.8rem; font-family: var(--font-mono);
          padding: 6px 12px; border-radius: 6px; font-weight: 600;
        }
        .markdown-spec-box { padding: 22px; }

        .modal-footer-bar {
          padding: 14px 24px;
          background: rgba(128, 10, 28, 0.15);
          border-top: 1px solid var(--border-color);
          display: flex; justify-content: flex-end; align-items: center; gap: 12px; flex-wrap: wrap;
          flex-shrink: 0;
          position: relative;
          z-index: 10;
        }

        .contact-container { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: 32px; text-align: left; }
        .contact-sidebar-card { padding: 24px; height: 100%; }
        .contact-sidebar-card h3 { margin-bottom: 14px; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 0.5px; }
        .sidebar-description { color: var(--text-secondary); font-size: 0.88rem; margin-bottom: 20px; line-height: 1.6; }
        .sidebar-links { display: flex; flex-direction: column; gap: 14px; }
        .sidebar-item { display: flex; align-items: center; gap: 10px; color: var(--text-secondary); font-size: 0.88rem; word-break: break-all; }
        .sidebar-item a:hover { color: var(--accent-red); }
        .accent-icon { color: var(--accent-red); flex-shrink: 0; }
        .contact-form { padding: 28px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-alert {
          padding: 12px 18px; border-radius: var(--border-radius-sm); margin-bottom: 20px;
          display: flex; align-items: flex-start; gap: 10px; font-weight: 500; font-size: 0.85rem; font-family: var(--font-mono);
          line-height: 1.5;
        }
        .alert-success { background: rgba(16, 185, 129, 0.15); border: 1px solid #10B981; color: #10B981; }
        .alert-error { background: rgba(239, 68, 68, 0.15); border: 1px solid #EF4444; color: #EF4444; }
        .spin-icon { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .w-full { width: 100%; justify-content: center; }

        /* ═══════════════════════════════════════════════════════════════
           AESTHETIC GRID & DECORATIVE BACKGROUNDS
           ═══════════════════════════════════════════════════════════════ */
        .section-with-grid {
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }

        /* ── DOT GRID PATTERN ── */
        .section-grid-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image:
            radial-gradient(circle, rgba(246, 36, 64, 0.12) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 20%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 20%, transparent 80%);
        }

        /* ── DIAGONAL SCANLINES ── */
        .section-scanlines {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.025;
          background-image: repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 4px,
            rgba(248, 250, 252, 0.5) 4px,
            rgba(248, 250, 252, 0.5) 5px
          );
          mask-image: linear-gradient(180deg, transparent 0%, black 15%, black 85%, transparent 100%);
          -webkit-mask-image: linear-gradient(180deg, transparent 0%, black 15%, black 85%, transparent 100%);
        }

        /* ── SECONDARY GLOW ORBS ── */
        .section-glow-orb-2 {
          position: absolute;
          z-index: 0;
          pointer-events: none;
          border-radius: 50%;
          filter: blur(80px);
        }

        .about-orb-2 {
          left: -8%; bottom: 5%;
          width: 35vw; height: 35vw;
          max-width: 400px; max-height: 400px;
          background: radial-gradient(circle, rgba(246, 36, 64, 0.10) 0%, rgba(153, 0, 17, 0.04) 50%, transparent 75%);
        }

        .projects-orb-2 {
          left: -5%; top: 15%;
          width: 40vw; height: 40vw;
          max-width: 450px; max-height: 450px;
          background: radial-gradient(circle, rgba(128, 10, 28, 0.12) 0%, rgba(246, 36, 64, 0.04) 45%, transparent 70%);
        }

        .insights-orb-2 {
          left: -8%; bottom: 10%;
          width: 38vw; height: 38vw;
          max-width: 420px; max-height: 420px;
          background: radial-gradient(circle, rgba(246, 36, 64, 0.10) 0%, rgba(153, 0, 17, 0.04) 50%, transparent 75%);
        }

        /* ── CROSSHAIR / CORNER ACCENTS (::before on sections) ── */
        .section-with-grid::before {
          content: '';
          position: absolute;
          top: 40px; left: 40px;
          width: 60px; height: 60px;
          border-top: 1px solid rgba(246, 36, 64, 0.15);
          border-left: 1px solid rgba(246, 36, 64, 0.15);
          pointer-events: none;
          z-index: 0;
        }
        .section-with-grid::after {
          content: '';
          position: absolute;
          bottom: 40px; right: 40px;
          width: 60px; height: 60px;
          border-bottom: 1px solid rgba(246, 36, 64, 0.15);
          border-right: 1px solid rgba(246, 36, 64, 0.15);
          pointer-events: none;
          z-index: 0;
        }

        /* ── LIGHT MODE OVERRIDES ── */
        body.light-theme .section-grid-bg {
          background-image:
            radial-gradient(circle, rgba(15, 23, 42, 0.06) 1px, transparent 1px);
          mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 25%, transparent 75%);
          -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 25%, transparent 75%);
        }

        body.light-theme .section-scanlines {
          opacity: 0.018;
          background-image: repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 4px,
            rgba(15, 23, 42, 0.3) 4px,
            rgba(15, 23, 42, 0.3) 5px
          );
        }

        body.light-theme .about-orb-2 {
          background: radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, rgba(79, 70, 229, 0.02) 50%, transparent 75%);
        }
        body.light-theme .projects-orb-2 {
          background: radial-gradient(circle, rgba(99, 102, 241, 0.07) 0%, rgba(79, 70, 229, 0.02) 45%, transparent 70%);
        }
        body.light-theme .insights-orb-2 {
          background: radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, rgba(79, 70, 229, 0.02) 50%, transparent 75%);
        }

        body.light-theme .section-with-grid::before {
          border-top-color: rgba(15, 23, 42, 0.06);
          border-left-color: rgba(15, 23, 42, 0.06);
        }
        body.light-theme .section-with-grid::after {
          border-bottom-color: rgba(15, 23, 42, 0.06);
          border-right-color: rgba(15, 23, 42, 0.06);
        }

        @media (max-width: 900px) {
          .hero-container { grid-template-columns: 1fr; text-align: center; gap: 36px; }
          .hero-content { text-align: center; }
          .hero-buttons { justify-content: center; }
          .hero-contact-info { justify-content: center; }
          .about-main-layout { grid-template-columns: 1fr; }
          .skills-control-bar { flex-direction: column; align-items: stretch; }
          .skills-search-box { width: 100%; }
          .skills-legend-wrapper { justify-content: space-between; }
          .contact-container { grid-template-columns: 1fr; }
          .form-row { grid-template-columns: 1fr; gap: 0; }
        }

        @media (max-width: 600px) {
          .hero-buttons { flex-direction: column; width: 100%; }
          .hero-buttons .btn { width: 100%; }
          .about-bio-card { padding: 20px 16px; }
          .about-stats-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
          .stat-card { padding: 12px; gap: 10px; }
          .stat-icon-wrapper { width: 32px; height: 32px; }
          .stat-number { font-size: 0.85rem; }
          .skills-filtered-grid { grid-template-columns: 1fr; gap: 12px; }
          .skill-metric-card { padding: 14px 16px; gap: 10px; }
          .skill-name-text { font-size: 0.92rem; }
          .brand-logo-icon { width: 28px; height: 28px; }
          .category-badge { display: none; }
          .projects-grid { grid-template-columns: 1fr; }
          .insights-grid { grid-template-columns: 1fr; }
          .timeline { padding-left: 20px; }
          .timeline-marker { left: -20px; width: 10px; height: 10px; }
          .timeline-content { padding: 16px; }
          .skills-view-more-banner { flex-direction: column; align-items: stretch; text-align: center; gap: 16px; padding: 16px; }
          .view-more-info { flex-direction: column; text-align: center; }
          .skills-view-more-btn { width: 100%; justify-content: center; }
          .catalog-toolbar { padding: 14px 16px; }
          .catalog-stats-strip { flex-direction: column; align-items: flex-start; gap: 6px; }
          .catalog-scroll-body { padding: 14px; }
          .catalog-grid { grid-template-columns: 1fr; gap: 12px; }
          .modal-backdrop { padding: 80px 10px 20px 10px; }
          .modal-scroll-body { padding: 16px; }
          .spec-sheet-modal { width: 100%; max-height: calc(95vh - 70px); }
          .skill-modal-hero { flex-direction: column; align-items: flex-start; gap: 12px; }
          .skill-modal-logo-wrapper { width: 48px; height: 48px; }
          .skill-modal-name { font-size: 1.25rem; }
        }
      `}</style>
    </div>
  );
};

export default Home;
