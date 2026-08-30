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

  const runCommand = (cmdStr) => {
    const cmd = (cmdStr || '').trim();
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

    setHistory(prev => [...prev, { type: 'input', text: cmd }, { type: 'output', text: res }]);
    setInput('');
  };

  const handleCommand = e => {
    e.preventDefault();
    runCommand(input);
  };

  const quickCommands = ['neofetch', 'skills', 'projects', 'whoami', 'clear'];

  return (
    <div className="terminal-wrapper">
      <div className="terminal-container glass-panel">
        <ScrollToTop/>
        <div className="terminal-header">
          <div className="terminal-dots">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
          </div>
          <div className="terminal-title">
            <TerminalSquare size={13} className="accent-red-icon" /> devil37@portfolio: ~ (bash)
          </div>
          <span className="terminal-live-badge">LIVE TERMINAL</span>
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
              placeholder="type command (e.g. neofetch)..."
            />
          </form>
        </div>
      </div>

      <div className="terminal-quick-chips">
        <span className="chips-label">Quick Commands:</span>
        <div className="chips-buttons-group">
          {quickCommands.map(cmd => (
            <button 
              key={cmd} 
              type="button" 
              onClick={() => runCommand(cmd)}
              className="terminal-chip-btn"
              title={`Execute $ ${cmd}`}
            >
              $ {cmd}
            </button>
          ))}
        </div>
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
        <div className="hero-ambient-glow-secondary" />
        <div className="container hero-container">
          <div className="hero-content">
            {/* 1. Status & Availability Header Row */}
            <div className="hero-status-row">
              <div className="hero-status-pill">
                <span className="live-status-dot" />
                <span className="hero-status-text">SYSTEMS ACTIVE // AI &amp; BACKEND ARCHITECT</span>
              </div>
              <div className="hero-availability-tag">
                <Sparkles size={12} className="accent-red-icon" />
                <span>OPEN TO WORK</span>
              </div>
            </div>

            {/* 2. Main Title & Shimmer Name */}
            <div className="hero-title-wrapper">
              <span className="hero-kicker-label">SOFTWARE ENGINEER &amp; AI DEVELOPER</span>
              <h1 className="hero-title">
                HI, I'M <span className="highlight">{profile?.name || 'Omkar Pardeshi'}</span>
              </h1>
            </div>

            {/* 3. High-Tech Dynamic Role Command Bar */}
            <div className="hero-role-badge glass-panel">
              <span className="role-cli-prompt">$ specialty --current:</span>
              <div className="hero-subtitle">
                <TypingText texts={titlesArray} />
              </div>
            </div>

            {/* 4. Hero Summary Description */}
            <p className="hero-description">
              {profile?.bio || 'Specializing in building high-performance backend microservices and deploying advanced agentic AI, NLP, and Deep Learning pipelines.'}
            </p>

            {/* 5. Core Pillars Micro-Badges */}
            <div className="hero-tech-highlights">
              <div className="tech-badge-item">
                <BrainCircuit size={14} className="accent-red-icon" />
                <span>Agentic AI &amp; RAG</span>
              </div>
              <div className="tech-badge-item">
                <Server size={14} className="accent-red-icon" />
                <span>Scalable Microservices</span>
              </div>
              <div className="tech-badge-item">
                <Database size={14} className="accent-red-icon" />
                <span>Data Pipelines &amp; Vector DB</span>
              </div>
            </div>

            {/* 6. Action CTAs */}
            <div className="hero-buttons">
              <a href="#projects" className="btn btn-primary hero-btn-main">
                Explore Projects <ArrowRight size={16} />
              </a>
              <a href="#contact" className="btn btn-secondary hero-btn-contact">
                <Send size={15} /> Get in Touch
              </a>
              {profile?.resume_url && (
                <button
                  type="button"
                  onClick={handleDownloadResume}
                  disabled={downloadingResume}
                  className="btn btn-secondary hero-btn-resume"
                  title="Direct Download Resume PDF"
                >
                  <Download size={14} className="accent-red-icon" />
                  <span>{downloadingResume ? 'Downloading...' : 'Resume (PDF)'}</span>
                </button>
              )}
            </div>

            {/* 7. Quick Location & Contact Info Strip */}
            <div className="hero-contact-info">
              {profile?.location && (
                <div className="info-item">
                  <MapPin size={14} className="accent-red-icon" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile?.email && (
                <a href={`mailto:${profile.email}`} className="info-item info-link" title="Click to send email">
                  <Mail size={14} className="accent-red-icon" />
                  <span>{profile.email}</span>
                </a>
              )}
              {profile?.github_url && (
                <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="info-item info-link info-social" title="GitHub Profile">
                  <Github size={14} />
                  <span>GitHub</span>
                </a>
              )}
              {profile?.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="info-item info-link info-social" title="LinkedIn Profile">
                  <ExternalLink size={13} />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>

          <div className="hero-interactive-column">
            <TerminalMock />
          </div>
        </div>
      </header>

      {/* ABOUT ME SECTION — Minimal Professional Redesign */}
      <section id="about" className="about-section section bg-alt section-with-grid">
        <div className="section-grid-bg" />
        <div className="section-scanlines" />
        <div className="about-ambient-glow" />
        <div className="section-glow-orb-2 about-orb-2" />
        <div className="container">

          {/* Section Header */}
          <div className="about-section-header">
            <div className="about-header-left">
              <div className="about-eyebrow">
                <span className="live-dot" />
                <span>SYSTEM ARCHITECT &amp; ENGINEER</span>
              </div>
              <h2 className="about-section-title">About Me</h2>
            </div>
            <p className="about-section-lead">
              Bridging engineering principles, resilient distributed backends, and advanced intelligent systems into production-grade solutions.
            </p>
          </div>

          {/* Main two-column bento layout */}
          <div className="about-bento-grid">

            {/* ── Column A: Bio card ── */}
            <div className="about-bio-panel glass-panel">
              <div className="bio-panel-label">
                <span className="badge-dot" /> BIOGRAPHY &amp; PHILOSOPHY
              </div>
              <div className="about-markdown-body">
                <MarkdownRenderer content={profile?.about_me || 'Welcome to my profile! Edit this about section in the Admin Dashboard.'} />
              </div>
            </div>

            {/* ── Column B: right side stacked ── */}
            <div className="about-right-stack">

              {/* Numbered expertise pillars */}
              <div className="about-pillars-panel">
                <p className="about-right-label">CORE EXPERTISE</p>
                <div className="pillars-list">
                  {pillars.map((pillar, idx) => (
                    <div
                      key={idx}
                      className={`pillar-row ${activePillar === idx ? 'active' : ''}`}
                      onClick={() => setActivePillar(idx)}
                    >
                      <span className="pillar-row-num">0{idx + 1}</span>
                      <div className="pillar-row-body">
                        <div className="pillar-row-head">
                          <span className="pillar-row-icon">{pillar.icon}</span>
                          <h4 className="pillar-row-title">{pillar.title}</h4>
                        </div>
                        {activePillar === idx && (
                          <p className="pillar-row-desc">{pillar.desc}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Capability metric strip */}
              <div className="about-metrics-strip">
                <div className="metric-item">
                  <BrainCircuit size={16} className="metric-icon" />
                  <div className="metric-text">
                    <span className="metric-title">AI / ML Systems</span>
                    <span className="metric-sub">RAG &amp; Agentic Frameworks</span>
                  </div>
                </div>
                <div className="metric-divider" />
                <div className="metric-item">
                  <Server size={16} className="metric-icon" />
                  <div className="metric-text">
                    <span className="metric-title">Backend Engineering</span>
                    <span className="metric-sub">FastAPI, Django &amp; Go</span>
                  </div>
                </div>
                <div className="metric-divider" />
                <div className="metric-item">
                  <Rocket size={16} className="metric-icon" />
                  <div className="metric-text">
                    <span className="metric-title">Production Scale</span>
                    <span className="metric-sub">High-Throughput &amp; Low Latency</span>
                  </div>
                </div>
              </div>

              {/* Resume download card */}
              <div className="about-resume-card">
                <div className="resume-card-left">
                  <div className="resume-card-icon">
                    <FileText size={18} />
                  </div>
                  <div className="resume-card-text">
                    <span className="resume-card-title">Curriculum Vitae</span>
                    <span className="resume-card-sub">AI/ML · Backend · Systems Engineering</span>
                  </div>
                </div>
                <div className="resume-card-actions">
                  <button
                    type="button"
                    onClick={handleDownloadResume}
                    disabled={downloadingResume}
                    className="btn btn-primary resume-dl-btn"
                    title="Download Resume PDF"
                  >
                    {downloadingResume
                      ? <><Loader2 size={13} className="spin-icon" /> Downloading…</>
                      : <><Download size={13} /> Download</>
                    }
                  </button>
                  {profile?.resume_url && (
                    <a
                      href={api.getResumeViewUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary resume-view-btn"
                      title="View PDF in Browser"
                    >
                      <Eye size={13} /> Preview
                    </a>
                  )}
                </div>
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

      {/* FEATURED PROJECTS — Minimal Professional Redesign */}
      <section id="projects" className="projects-section section bg-alt section-with-grid">
        <div className="section-grid-bg" />
        <div className="section-scanlines" />
        <div className="projects-ambient-glow" />
        <div className="container">

          {/* Section header — matching About Me / Work History / Insights */}
          <div className="proj-section-header">
            <div className="proj-header-left">
              <div className="proj-eyebrow">
                <FolderGit2 size={12} />
                <span>ENGINEERING PORTFOLIO</span>
              </div>
              <h2 className="proj-section-title">Featured Projects</h2>
            </div>
            <p className="proj-section-lead">
              Production microservices, high-performance RAG pipelines, and scalable distributed AI frameworks.
            </p>
          </div>

          {projects.length === 0 ? (
            <div className="proj-empty-state">
              <FolderGit2 size={32} className="proj-empty-icon" />
              <p>Project architectures will appear here once added from the Admin Dashboard.</p>
            </div>
          ) : (
            <div className="proj-grid">
              {projects.map((project, idx) => (
                <div 
                  key={project.id} 
                  className="proj-card"
                  onClick={() => setSelectedProject(project)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedProject(project); } }}
                >
                  {/* Cover / Placeholder */}
                  <div className="proj-img-wrap">
                    {project.image_url ? (
                      <img src={project.image_url} alt={project.title} className="proj-img" />
                    ) : (
                      <div className="proj-placeholder">
                        <Cpu size={28} />
                        <span className="proj-placeholder-text">SYSTEM ARCHITECTURE</span>
                      </div>
                    )}
                    <div className="proj-img-overlay" />
                    
                    {/* Status badge */}
                    <div className="proj-status-badge">
                      {project.demo_url ? (
                        <span className="proj-status-chip live">
                          <span className="proj-live-dot" /> LIVE SYSTEM
                        </span>
                      ) : (
                        <span className="proj-status-chip code">
                          <GitBranch size={10} /> ARCHITECTURE
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="proj-body">
                    <div className="proj-title-row">
                      <h3 className="proj-title">{project.title}</h3>
                      <span className="proj-open-hint" title="Inspect architecture specs">
                        <ArrowRight size={14} className="proj-arrow-icon" />
                      </span>
                    </div>

                    <p className="proj-desc">{project.description}</p>

                    {/* Tech Stack Pills */}
                    {project.tech_stack_list && project.tech_stack_list.length > 0 && (
                      <div className="proj-tech-list">
                        {project.tech_stack_list.slice(0, 4).map((tech, i) => (
                          <span key={i} className="proj-tech-pill">
                            <TechBrandIcon name={tech} size={12} />
                            <span>{tech}</span>
                          </span>
                        ))}
                        {project.tech_stack_list.length > 4 && (
                          <span className="proj-tech-more">+{project.tech_stack_list.length - 4}</span>
                        )}
                      </div>
                    )}

                    {/* Footer Actions */}
                    <div className="proj-footer" onClick={e => e.stopPropagation()}>
                      <button 
                        type="button"
                        onClick={() => setSelectedProject(project)} 
                        className="proj-specs-btn"
                      >
                        <Info size={12} />
                        <span>Inspect Specs</span>
                      </button>

                      <div className="proj-ext-links">
                        {project.github_url && (
                          <a 
                            href={project.github_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="proj-icon-link" 
                            title="Source Code (GitHub)"
                          >
                            <Github size={14} />
                          </a>
                        )}
                        {project.demo_url && (
                          <a 
                            href={project.demo_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="proj-icon-link proj-demo-link" 
                            title="Launch Live Demo"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>


      {/* WORK HISTORY — Professional Redesign */}
      <section id="experience" className="experience-section section">
        <div className="experience-ambient-glow" />
        <div className="container">

          {/* Section header — same pattern as About Me */}
          <div className="exp-section-header">
            <div className="exp-header-left">
              <div className="exp-eyebrow">
                <Briefcase size={12} />
                <span>CAREER TIMELINE</span>
              </div>
              <h2 className="exp-section-title">Work History</h2>
            </div>
            <p className="exp-section-lead">
              Professional progression through machine learning, backend engineering, and production AI systems.
            </p>
          </div>

          {/* Timeline */}
          {experiences.length === 0 ? (
            <div className="exp-empty-state">
              <Briefcase size={32} className="exp-empty-icon" />
              <p>Work history entries will appear here once added from the Admin Dashboard.</p>
            </div>
          ) : (
            <div className="exp-timeline">
              {experiences.map((exp, idx) => {
                const startDate = new Date(exp.start_date);
                const endDate = exp.is_current ? null : new Date(exp.end_date);
                const startLabel = startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
                const endLabel = exp.is_current ? 'Present' : endDate?.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
                const durationMs = (exp.is_current ? new Date() : endDate) - startDate;
                const months = Math.round(durationMs / (1000 * 60 * 60 * 24 * 30));
                const durationLabel = months >= 12
                  ? `${Math.floor(months / 12)}y ${months % 12 > 0 ? (months % 12) + 'mo' : ''}`.trim()
                  : `${months}mo`;

                return (
                  <div key={exp.id} className={`exp-row ${idx === 0 ? 'exp-row-first' : ''}`}>

                    {/* Left — date column */}
                    <div className="exp-date-col">
                      <span className="exp-date-end">{endLabel}</span>
                      <span className="exp-date-duration">{durationLabel}</span>
                      <span className="exp-date-start">{startLabel}</span>
                    </div>

                    {/* Center — line + node */}
                    <div className="exp-line-col">
                      <div className={`exp-node ${exp.is_current ? 'exp-node-active' : ''}`}>
                        {exp.is_current && <span className="exp-node-pulse" />}
                      </div>
                      <div className="exp-connector" />
                    </div>

                    {/* Right — card */}
                    <div className="exp-card glass-panel">
                      {exp.is_current && (
                        <div className="exp-current-badge">
                          <span className="live-dot" /> CURRENT
                        </div>
                      )}

                      <div className="exp-card-top">
                        {/* Company initial badge */}
                        <div className="exp-company-badge">
                          {exp.company?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="exp-card-meta">
                          <h3 className="exp-role">{exp.role}</h3>
                          <div className="exp-company-row">
                            <Building2 size={12} />
                            <span className="exp-company-name">{exp.company}</span>
                            {exp.location && (
                              <>
                                <span className="exp-sep">·</span>
                                <MapPin size={11} />
                                <span className="exp-location">{exp.location}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {exp.description_points?.length > 0 && (
                        <ul className="exp-bullets">
                          {exp.description_points.map((pt, pIdx) => (
                            <li key={pIdx} className="exp-bullet-item">
                              <span className="exp-bullet-dot" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>


      {/* LATEST ARTICLES — Minimal Professional Redesign */}
      {blogs.length > 0 && (
        <section id="insights" className="insights-section section bg-alt section-with-grid">
          <div className="section-grid-bg" />
          <div className="section-scanlines" />
          <div className="insights-ambient-glow" />
          <div className="container">

            {/* Section header */}
            <div className="ins-section-header">
              <div className="ins-header-left">
                <div className="ins-eyebrow">
                  <BookOpenText size={12} />
                  <span>ENGINEERING PUBLICATIONS</span>
                </div>
                <h2 className="ins-section-title">Latest Articles</h2>
              </div>
              <p className="ins-section-lead">
                Deep dives on RAG pipelines, agentic AI workflows, and distributed backend systems.
              </p>
            </div>

            {/* Article cards */}
            <div className="ins-grid">
              {blogs.map((blog, idx) => {
                const words = (blog.content || '').trim().split(/\s+/).length;
                const readTime = `${Math.ceil(words / 200)} min`;
                const primaryTag = blog.tags_list?.[0] || 'Technical';
                const dateStr = new Date(blog.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

                return (
                  <article key={blog.id} className="ins-card">

                    {/* Cover image or placeholder */}
                    <Link to={`/blogs/${blog.slug}`} className="ins-card-img-wrap">
                      {blog.cover_image_url ? (
                        <img src={blog.cover_image_url} alt={blog.title} className="ins-card-img" />
                      ) : (
                        <div className="ins-card-placeholder">
                          <BookOpenText size={24} />
                        </div>
                      )}
                      <div className="ins-card-img-overlay" />
                      <span className="ins-primary-tag">{primaryTag}</span>
                    </Link>

                    {/* Body */}
                    <div className="ins-card-body">
                      <div className="ins-card-meta">
                        <span><Calendar size={11} /> {dateStr}</span>
                        <span className="ins-meta-dot" />
                        <span><Clock size={11} /> {readTime} read</span>
                      </div>

                      <h3 className="ins-card-title">
                        <Link to={`/blogs/${blog.slug}`}>{blog.title}</Link>
                      </h3>

                      <p className="ins-card-excerpt">{blog.excerpt}</p>

                      <div className="ins-card-footer">
                        {blog.tags_list?.slice(0, 3).map((tag, tIdx) => (
                          <span key={tIdx} className="ins-tag">#{tag}</span>
                        ))}
                        <Link to={`/blogs/${blog.slug}`} className="ins-read-link">
                          Read <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>

                  </article>
                );
              })}
            </div>

            <div className="ins-action-row">
              <Link to="/blogs" className="btn btn-secondary">
                <BookOpenText size={15} /> View All Articles
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

        /* ════════════════════════════════════════════════════
           HERO SECTION: PREMIUM CYBERNETIC / DARK RED THEME
        ════════════════════════════════════════════════════ */
        .hero-section {
          padding: 130px 0 90px;
          min-height: 88vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }
        .hero-ambient-glow {
          position: absolute;
          top: -15%; left: -10%;
          width: 60vw; height: 60vw;
          max-width: 650px; max-height: 650px;
          background: radial-gradient(circle, rgba(246, 36, 64, 0.18) 0%, rgba(128, 10, 28, 0.08) 45%, transparent 70%);
          pointer-events: none;
          z-index: 0;
          filter: blur(60px);
        }
        .hero-ambient-glow-secondary {
          position: absolute;
          bottom: -20%; right: 5%;
          width: 45vw; height: 45vw;
          max-width: 500px; max-height: 500px;
          background: radial-gradient(circle, rgba(128, 10, 28, 0.14) 0%, rgba(246, 36, 64, 0.04) 50%, transparent 75%);
          pointer-events: none;
          z-index: 0;
          filter: blur(70px);
        }
        .hero-container {
          display: grid;
          grid-template-columns: 1.18fr 0.82fr;
          align-items: center;
          gap: 48px;
          position: relative;
          z-index: 1;
        }
        .hero-content {
          text-align: left;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        /* 1. Status Header Row */
        .hero-status-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
        .hero-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: rgba(246, 36, 64, 0.08);
          border: 1px solid rgba(246, 36, 64, 0.28);
          border-radius: 999px;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 700;
          color: #FFFFFF;
          letter-spacing: 1px;
          box-shadow: 0 0 16px rgba(246, 36, 64, 0.15);
          backdrop-filter: blur(10px);
        }
        .live-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 10px #10b981, 0 0 4px #10b981;
          animation: pulseGreenDot 2s infinite ease-in-out;
        }
        @keyframes pulseGreenDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
        .hero-availability-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-secondary);
          letter-spacing: 0.5px;
          font-weight: 500;
        }

        /* 2. Main Title & Shimmer Name */
        .hero-title-wrapper {
          margin-bottom: 14px;
        }
        .hero-kicker-label {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.76rem;
          font-weight: 700;
          letter-spacing: 2.5px;
          color: var(--accent-red);
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .hero-title {
          font-size: clamp(2.4rem, 5vw, 3.8rem);
          font-weight: 900;
          line-height: 1.08;
          letter-spacing: -1.8px;
          color: var(--text-primary);
          margin: 0;
        }
        .hero-title .highlight {
          background: linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 45%, var(--accent-red) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 25px rgba(246, 36, 64, 0.22);
        }

        /* 3. High-Tech Dynamic Role Command Bar */
        .hero-role-badge {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          border-radius: 8px;
          background: rgba(10, 10, 15, 0.7);
          border: 1px solid rgba(246, 36, 64, 0.22);
          margin-bottom: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
          max-width: 100%;
        }
        .role-cli-prompt {
          font-family: var(--font-mono);
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--accent-red);
          letter-spacing: 0.5px;
          white-space: nowrap;
        }
        .hero-subtitle {
          font-size: clamp(1rem, 2.2vw, 1.25rem);
          font-family: var(--font-mono);
          font-weight: 600;
          color: #FFFFFF;
          margin: 0;
          min-height: 28px;
          display: flex;
          align-items: center;
        }
        .typing-cursor {
          animation: blink 0.8s infinite;
          color: var(--accent-red);
          font-weight: bold;
          text-shadow: 0 0 10px var(--accent-red);
        }
        @keyframes blink { 50% { opacity: 0; } }

        /* 4. Hero Summary Description */
        .hero-description {
          font-size: clamp(0.96rem, 1.8vw, 1.08rem);
          line-height: 1.7;
          color: var(--text-secondary);
          margin-bottom: 22px;
          max-width: 580px;
        }

        /* 5. Core Pillars Micro-Badges */
        .hero-tech-highlights {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 28px;
        }
        .tech-badge-item {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 12px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--text-primary);
          transition: var(--transition-smooth);
        }
        .tech-badge-item:hover {
          border-color: rgba(246, 36, 64, 0.35);
          background: rgba(246, 36, 64, 0.06);
          transform: translateY(-1px);
        }

        /* 6. Action CTAs */
        .hero-buttons {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          align-items: center;
          margin-bottom: 28px;
        }
        .hero-btn-main {
          padding: 13px 26px;
          font-size: 0.88rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 0 25px rgba(246, 36, 64, 0.38);
        }
        .hero-btn-contact {
          padding: 13px 24px;
          font-size: 0.88rem;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .hero-btn-resume {
          padding: 12px 20px;
          font-size: 0.85rem;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-color);
          cursor: pointer;
        }
        .hero-btn-resume:hover {
          border-color: var(--accent-red);
          color: #FFFFFF;
          box-shadow: 0 0 15px var(--accent-red-glow);
        }

        /* 7. Quick Location & Contact Info Strip */
        .hero-contact-info {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          color: var(--text-muted);
          font-size: 0.78rem;
          font-family: var(--font-mono);
        }
        .info-item {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid var(--border-color);
        }
        .info-link {
          transition: var(--transition-smooth);
          color: var(--text-muted);
        }
        .info-link:hover {
          color: #FFFFFF;
          border-color: var(--accent-red);
        }
        .info-social:hover {
          color: var(--accent-red);
          box-shadow: 0 0 12px var(--accent-red-glow);
        }

        /* ════════════════════════════════════════════════════
           TERMINAL MOCKUP STYLES
        ════════════════════════════════════════════════════ */
        .terminal-wrapper {
          display: flex;
          flex-direction: column;
          gap: 14px;
          width: 100%;
        }
        .terminal-container {
          background: #040407 !important;
          border: 1px solid rgba(246, 36, 64, 0.25);
          border-radius: 12px;
          height: 340px;
          display: flex;
          flex-direction: column;
          font-family: var(--font-mono);
          text-align: left;
          overflow: hidden;
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.95), 0 0 30px rgba(128, 10, 28, 0.22);
          transition: var(--transition-smooth);
        }
        .terminal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px;
          background: rgba(128, 10, 28, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .terminal-dots { display: flex; gap: 6px; }
        .terminal-dots .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
        .terminal-dots .red    { background: #F62440; box-shadow: 0 0 6px #F62440; }
        .terminal-dots .yellow { background: #ffbd2e; }
        .terminal-dots .green  { background: #27c93f; }
        .terminal-title {
          font-size: 0.72rem;
          color: var(--text-secondary);
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .terminal-live-badge {
          font-size: 0.62rem;
          font-family: var(--font-mono);
          padding: 2px 7px;
          border-radius: 4px;
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          font-weight: 700;
          letter-spacing: 0.8px;
        }
        .terminal-body {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          font-size: 0.8rem;
          display: flex;
          flex-direction: column;
          gap: 10px;
          line-height: 1.45;
        }
        .terminal-input-line, .terminal-input-form { display: flex; align-items: center; gap: 8px; }
        .terminal-prompt { color: var(--accent-red); font-weight: bold; }
        .terminal-command { color: #ffffff; font-weight: 600; }
        .terminal-output { color: var(--text-secondary); white-space: pre-wrap; font-family: var(--font-mono); }
        .terminal-input { flex: 1; background: transparent; border: none; color: #ffffff; font-family: var(--font-mono); font-size: 0.8rem; }

        .terminal-quick-chips {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          padding: 8px 14px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }
        .chips-label {
          font-size: 0.72rem;
          font-family: var(--font-mono);
          color: var(--text-muted);
        }
        .chips-buttons-group {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .terminal-chip-btn {
          background: rgba(246, 36, 64, 0.08);
          border: 1px solid rgba(246, 36, 64, 0.25);
          color: var(--text-secondary);
          padding: 3px 10px;
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          cursor: pointer;
          transition: var(--transition-smooth);
        }
        .terminal-chip-btn:hover {
          background: var(--accent-red);
          color: #FFFFFF;
          border-color: var(--accent-red);
          box-shadow: 0 0 10px var(--accent-red-glow);
          transform: translateY(-1px);
        }

        /* Light Mode Hero & Terminal Overrides */
        body.light-theme .hero-status-pill {
          background: rgba(246, 36, 64, 0.08);
          border: 1px solid rgba(246, 36, 64, 0.25);
          color: #0F172A;
        }
        body.light-theme .hero-role-badge {
          background: #FFFFFF;
          border: 1px solid rgba(246, 36, 64, 0.25);
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.08);
        }
        body.light-theme .hero-subtitle {
          color: #0F172A;
        }
        body.light-theme .tech-badge-item {
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.08);
          color: #0F172A;
        }
        body.light-theme .info-item {
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.08);
          color: #475569;
        }
        body.light-theme .info-link:hover {
          color: #0F172A;
        }
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
        body.light-theme .terminal-quick-chips {
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.08);
        }


        /* ─── ABOUT ME — MINIMAL PROFESSIONAL REDESIGN ─── */
        .about-section {
          position: relative;
          padding: 100px 0;
        }
        .about-ambient-glow {
          position: absolute; right: -10%; top: 20%;
          width: 45vw; height: 45vw; max-width: 500px; max-height: 500px;
          background: radial-gradient(circle, rgba(128, 10, 28, 0.18) 0%, rgba(246, 36, 64, 0.04) 50%, transparent 70%);
          filter: blur(60px); pointer-events: none;
        }

        /* Section header — horizontal split */
        .about-section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 40px;
          margin-bottom: 52px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding-bottom: 36px;
        }
        .about-header-left { display: flex; flex-direction: column; gap: 10px; flex-shrink: 0; }
        .about-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: var(--font-mono); font-size: 0.68rem; font-weight: 700;
          color: var(--accent-red); letter-spacing: 2px; text-transform: uppercase;
        }
        .about-section-title {
          font-family: var(--font-sans); font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 800; color: #FFFFFF; margin: 0; letter-spacing: -1.5px;
          line-height: 1.05;
        }
        .about-section-lead {
          font-size: 1rem; color: var(--text-secondary); line-height: 1.75;
          max-width: 540px; margin: 0; text-align: right;
        }

        /* live dot shared */
        .live-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--accent-red); box-shadow: 0 0 8px var(--accent-red);
          animation: pulseGlow 2s infinite ease-in-out; flex-shrink: 0;
        }
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }
        .badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--accent-red); box-shadow: 0 0 8px var(--accent-red);
        }

        /* Bento grid */
        .about-bento-grid {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 24px;
          align-items: start;
        }

        /* Bio panel */
        .about-bio-panel {
          padding: 36px;
          background: rgba(10, 10, 15, 0.7);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: var(--border-radius-lg);
          display: flex; flex-direction: column;
          box-shadow: 0 20px 50px -15px rgba(0,0,0,0.85);
          min-height: 360px;
        }
        .bio-panel-label {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: var(--font-mono); font-size: 0.67rem; font-weight: 700;
          color: var(--accent-red); letter-spacing: 1.8px; text-transform: uppercase;
          margin-bottom: 24px;
        }
        .about-markdown-body {
          color: var(--text-secondary);
          font-size: 0.95rem; line-height: 1.82; flex: 1;
        }
        .about-markdown-body p { margin-bottom: 14px; }
        .about-markdown-body p:last-child { margin-bottom: 0; }
        .about-markdown-body strong { color: #FFFFFF; font-weight: 700; }

        /* Right stack */
        .about-right-stack {
          display: flex; flex-direction: column; gap: 16px;
        }

        /* Pillars panel */
        .about-pillars-panel {
          background: rgba(10, 10, 15, 0.65);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
        }
        .about-right-label {
          font-family: var(--font-mono); font-size: 0.67rem; font-weight: 700;
          color: var(--text-secondary); letter-spacing: 2px; text-transform: uppercase;
          padding: 16px 22px 12px; margin: 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .pillars-list { display: flex; flex-direction: column; }
        .pillar-row {
          display: flex; align-items: flex-start; gap: 16px;
          padding: 16px 22px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          cursor: pointer;
          transition: background 0.25s ease;
        }
        .pillar-row:last-child { border-bottom: none; }
        .pillar-row:hover { background: rgba(246, 36, 64, 0.05); }
        .pillar-row.active { background: rgba(128, 10, 28, 0.18); border-left: 2px solid var(--accent-red); padding-left: 20px; }
        .pillar-row-num {
          font-family: var(--font-mono); font-size: 0.65rem; font-weight: 700;
          color: var(--accent-red); opacity: 0.7; letter-spacing: 1px;
          line-height: 1.5; flex-shrink: 0; padding-top: 2px;
        }
        .pillar-row.active .pillar-row-num { opacity: 1; }
        .pillar-row-body { display: flex; flex-direction: column; gap: 6px; flex: 1; }
        .pillar-row-head { display: flex; align-items: center; gap: 10px; }
        .pillar-row-icon {
          display: flex; align-items: center;
          color: var(--accent-red); flex-shrink: 0;
        }
        .pillar-row-title {
          font-family: var(--font-sans); font-size: 0.92rem; font-weight: 700;
          color: #FFFFFF; margin: 0; line-height: 1.3;
        }
        .pillar-row-desc {
          font-size: 0.82rem; color: var(--text-secondary); line-height: 1.6;
          margin: 0; padding-left: 26px;
          animation: fadeIn 0.25s ease;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }

        /* Metrics strip */
        .about-metrics-strip {
          display: flex; flex-direction: column;
          background: rgba(10,10,15,0.65);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: var(--border-radius-md);
          overflow: hidden;
        }
        .metric-item {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 22px;
          transition: background 0.2s ease;
        }
        .metric-item:hover { background: rgba(246,36,64,0.05); }
        .metric-icon { color: var(--accent-red); flex-shrink: 0; }
        .metric-text { display: flex; flex-direction: column; gap: 2px; }
        .metric-title { font-size: 0.88rem; font-weight: 700; color: #FFFFFF; }
        .metric-sub { font-family: var(--font-mono); font-size: 0.67rem; color: var(--text-secondary); letter-spacing: 0.5px; }
        .metric-divider { height: 1px; background: rgba(255,255,255,0.05); margin: 0; }

        /* Resume card */
        .about-resume-card {
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
          padding: 16px 20px;
          background: rgba(10,10,15,0.65);
          border: 1px solid rgba(246,36,64,0.25);
          border-radius: var(--border-radius-md);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .about-resume-card:hover {
          border-color: rgba(246,36,64,0.5);
          box-shadow: 0 8px 24px -8px rgba(128,10,28,0.4);
        }
        .resume-card-left { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
        .resume-card-icon {
          width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0;
          background: rgba(246,36,64,0.15); border: 1px solid rgba(246,36,64,0.3);
          display: flex; align-items: center; justify-content: center;
          color: var(--accent-red);
        }
        .resume-card-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .resume-card-title { font-size: 0.9rem; font-weight: 700; color: #FFFFFF; }
        .resume-card-sub { font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-secondary); letter-spacing: 0.3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .resume-card-actions { display: flex; gap: 8px; flex-shrink: 0; }
        .resume-dl-btn { padding: 8px 16px !important; font-size: 0.8rem !important; }
        .resume-view-btn { padding: 8px 14px !important; font-size: 0.8rem !important; }

        /* Light mode overrides */
        body.light-theme .about-bio-panel {
          background: #FFFFFF;
          border-color: rgba(0,0,0,0.08);
          box-shadow: 0 12px 30px -10px rgba(15,23,42,0.08);
        }
        body.light-theme .about-section-title { color: #0F172A; }
        body.light-theme .about-pillars-panel,
        body.light-theme .about-metrics-strip,
        body.light-theme .about-resume-card {
          background: #FFFFFF;
          border-color: rgba(0,0,0,0.08);
        }
        body.light-theme .pillar-row-title,
        body.light-theme .metric-title,
        body.light-theme .resume-card-title { color: #0F172A; }
        body.light-theme .pillar-row.active { background: rgba(246,36,64,0.04); }
        body.light-theme .about-resume-card:hover { border-color: rgba(246,36,64,0.4); box-shadow: 0 8px 24px -8px rgba(246,36,64,0.12); }
        body.light-theme .metric-divider { background: rgba(0,0,0,0.06); }

        /* Responsive */
        @media (max-width: 1024px) {
          .about-bento-grid { grid-template-columns: 1fr; }
          .about-section-header { flex-direction: column; align-items: flex-start; }
          .about-section-lead { text-align: left; max-width: 100%; }
        }
        @media (max-width: 640px) {
          .about-resume-card { flex-direction: column; align-items: flex-start; }
          .resume-card-actions { width: 100%; }
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

        /* ─── FEATURED PROJECTS — MINIMAL PROFESSIONAL ─── */
        .projects-section { position: relative; }
        .projects-ambient-glow {
          position: absolute; right: -10%; bottom: 10%;
          width: 50vw; height: 50vw; max-width: 500px; max-height: 500px;
          background: radial-gradient(circle, rgba(128, 10, 28, 0.14) 0%, transparent 70%);
          filter: blur(65px); pointer-events: none;
        }

        /* Section header */
        .proj-section-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 40px; margin-bottom: 52px;
          border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 36px;
        }
        .proj-header-left { display: flex; flex-direction: column; gap: 10px; flex-shrink: 0; }
        .proj-eyebrow {
          display: inline-flex; align-items: center; gap: 7px;
          font-family: var(--font-mono); font-size: 0.68rem; font-weight: 700;
          color: var(--accent-red); letter-spacing: 2px; text-transform: uppercase;
        }
        .proj-section-title {
          font-family: var(--font-sans); font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 800; color: #FFFFFF; margin: 0; letter-spacing: -1.5px; line-height: 1.05;
        }
        .proj-section-lead {
          font-size: 1rem; color: var(--text-secondary); line-height: 1.75;
          max-width: 460px; margin: 0; text-align: right;
        }

        /* Grid */
        .proj-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
          gap: 20px;
          text-align: left;
        }

        /* Card */
        .proj-card {
          display: flex; flex-direction: column;
          background: rgba(10, 10, 15, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: var(--border-radius-md);
          overflow: hidden;
          cursor: pointer;
          transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
        }
        .proj-card:hover {
          border-color: rgba(246, 36, 64, 0.35);
          box-shadow: 0 16px 40px -12px rgba(0, 0, 0, 0.85);
          transform: translateY(-4px);
        }

        /* Cover Image Wrapper */
        .proj-img-wrap {
          height: 185px; position: relative; overflow: hidden;
          background: #06070B; flex-shrink: 0;
        }
        .proj-img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
          display: block;
        }
        .proj-card:hover .proj-img { transform: scale(1.05); }
        .proj-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 35%, rgba(10, 10, 15, 0.75) 100%);
          pointer-events: none;
        }

        /* Status Badge */
        .proj-status-badge {
          position: absolute; top: 12px; left: 12px; z-index: 2;
        }
        .proj-status-chip {
          font-family: var(--font-mono); font-size: 0.62rem; font-weight: 700;
          letter-spacing: 0.8px; padding: 3px 8px; border-radius: 4px;
          display: inline-flex; align-items: center; gap: 5px;
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
        }
        .proj-status-chip.live {
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.4);
          color: #10B981;
        }
        .proj-live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #10B981; box-shadow: 0 0 6px #10B981;
          animation: livePulse 2s infinite;
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        .proj-status-chip.code {
          background: rgba(128, 10, 28, 0.85);
          border: 1px solid rgba(246, 36, 64, 0.45);
          color: #FFFFFF;
        }

        /* Placeholder */
        .proj-placeholder {
          height: 100%; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 8px;
          background: linear-gradient(135deg, rgba(128, 10, 28, 0.18) 0%, rgba(7, 7, 10, 0.9) 100%);
          color: rgba(246, 36, 64, 0.45);
        }
        .proj-placeholder-text {
          font-family: var(--font-mono); font-size: 0.65rem; font-weight: 700;
          letter-spacing: 1px; color: var(--text-muted);
        }

        /* Body */
        .proj-body {
          padding: 22px; display: flex; flex-direction: column; flex-grow: 1; gap: 10px;
        }
        .proj-title-row {
          display: flex; align-items: center; justify-content: space-between; gap: 10px;
        }
        .proj-title {
          font-family: var(--font-sans); font-size: 1.15rem; font-weight: 800;
          color: #FFFFFF; margin: 0; letter-spacing: -0.3px; line-height: 1.3;
          transition: color 0.2s ease;
        }
        .proj-card:hover .proj-title { color: var(--accent-red); }
        .proj-open-hint {
          color: var(--text-muted); transition: transform 0.2s ease, color 0.2s ease;
          display: flex; align-items: center; flex-shrink: 0;
        }
        .proj-card:hover .proj-open-hint { color: var(--accent-red); transform: translateX(3px); }

        .proj-desc {
          font-size: 0.87rem; color: var(--text-secondary); line-height: 1.65;
          margin: 0; flex-grow: 1;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }

        /* Tech Pills */
        .proj-tech-list {
          display: flex; flex-wrap: wrap; align-items: center; gap: 6px;
          margin-top: 4px;
        }
        .proj-tech-pill {
          display: inline-flex; align-items: center; gap: 5px;
          font-family: var(--font-mono); font-size: 0.66rem; font-weight: 600;
          color: var(--text-secondary); letter-spacing: 0.3px;
          padding: 3px 8px; border-radius: 4px;
          background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.2s ease;
        }
        .proj-card:hover .proj-tech-pill {
          background: rgba(246, 36, 64, 0.08); border-color: rgba(246, 36, 64, 0.2);
        }
        .proj-tech-more {
          font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-muted);
          padding: 2px 4px;
        }

        /* Footer Actions */
        .proj-footer {
          display: flex; align-items: center; justify-content: space-between; gap: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding-top: 14px; margin-top: auto;
        }
        .proj-specs-btn {
          display: inline-flex; align-items: center; gap: 5px;
          background: transparent; border: none;
          font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700;
          color: var(--accent-red); text-transform: uppercase; letter-spacing: 0.8px;
          cursor: pointer; padding: 0;
          transition: all 0.2s ease;
        }
        .proj-specs-btn:hover { color: #FFFFFF; }
        .proj-ext-links { display: flex; align-items: center; gap: 6px; }
        .proj-icon-link {
          width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--text-secondary);
          transition: all 0.2s ease;
        }
        .proj-icon-link:hover {
          background: rgba(246, 36, 64, 0.15); border-color: rgba(246, 36, 64, 0.4);
          color: #FFFFFF; transform: translateY(-2px);
        }
        .proj-demo-link:hover {
          background: var(--accent-red); border-color: var(--accent-red);
          box-shadow: 0 0 10px rgba(246, 36, 64, 0.4);
        }

        .proj-empty-state {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 14px; padding: 70px 20px; text-align: center;
          color: var(--text-secondary); font-size: 0.92rem;
          border: 1px dashed rgba(255, 255, 255, 0.1); border-radius: var(--border-radius-lg);
        }
        .proj-empty-icon { color: rgba(246, 36, 64, 0.4); }

        /* Light Mode Theme Overrides */
        body.light-theme .proj-section-title { color: #0F172A; }
        body.light-theme .proj-card {
          background: #FFFFFF; border-color: rgba(0, 0, 0, 0.08);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        }
        body.light-theme .proj-title { color: #0F172A; }
        body.light-theme .proj-desc { color: #475569; }
        body.light-theme .proj-tech-pill {
          background: rgba(0, 0, 0, 0.04); border-color: rgba(0, 0, 0, 0.08);
          color: #475569;
        }
        body.light-theme .proj-footer { border-top-color: rgba(0, 0, 0, 0.06); }
        body.light-theme .proj-icon-link {
          background: rgba(0, 0, 0, 0.03); border-color: rgba(0, 0, 0, 0.08);
          color: #475569;
        }
        body.light-theme .proj-section-lead { text-align: right; }

        @media (max-width: 960px) {
          .proj-section-header { flex-direction: column; align-items: flex-start; gap: 16px; margin-bottom: 40px; }
          .proj-section-lead { text-align: left; max-width: 100%; }
        }
        @media (max-width: 600px) {
          .proj-section-header { padding-bottom: 24px; margin-bottom: 28px; gap: 12px; }
          .proj-section-title { font-size: 1.85rem; letter-spacing: -0.8px; }
          .proj-section-lead { font-size: 0.92rem; line-height: 1.6; }
          .proj-grid { grid-template-columns: 1fr; gap: 16px; }
          .proj-img-wrap { height: 160px; }
          .proj-body { padding: 16px 14px; gap: 8px; }
          .proj-title { font-size: 1.05rem; }
          .proj-desc { font-size: 0.84rem; line-height: 1.55; }
          .proj-tech-pill { font-size: 0.62rem; padding: 2px 7px; }
          .proj-footer { padding-top: 10px; }
          .proj-specs-btn { font-size: 0.68rem; padding: 4px 0; }
          .proj-icon-link { width: 34px; height: 34px; border-radius: 8px; }
        }
        @media (hover: none) {
          .proj-card:active {
            border-color: rgba(246, 36, 64, 0.4);
            transform: scale(0.99);
          }
          .proj-card:active .proj-title {
            color: var(--accent-red);
          }
        }



        /* ─── WORK HISTORY — PROFESSIONAL TIMELINE ─── */
        .experience-section { position: relative; overflow: hidden; }
        .experience-ambient-glow {
          position: absolute; left: -10%; top: 20%;
          width: 50vw; height: 50vw; max-width: 550px; max-height: 550px;
          background: radial-gradient(circle, rgba(128, 10, 28, 0.15) 0%, rgba(246, 36, 64, 0.04) 50%, transparent 70%);
          filter: blur(65px); pointer-events: none;
        }

        /* Section header — mirrors About Me header pattern */
        .exp-section-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 40px; margin-bottom: 60px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding-bottom: 36px;
        }
        .exp-header-left { display: flex; flex-direction: column; gap: 10px; flex-shrink: 0; }
        .exp-eyebrow {
          display: inline-flex; align-items: center; gap: 7px;
          font-family: var(--font-mono); font-size: 0.68rem; font-weight: 700;
          color: var(--accent-red); letter-spacing: 2px; text-transform: uppercase;
        }
        .exp-section-title {
          font-family: var(--font-sans); font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 800; color: #FFFFFF; margin: 0; letter-spacing: -1.5px; line-height: 1.05;
        }
        .exp-section-lead {
          font-size: 1rem; color: var(--text-secondary); line-height: 1.75;
          max-width: 480px; margin: 0; text-align: right;
        }

        /* Empty state */
        .exp-empty-state {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 14px; padding: 80px 20px; text-align: center;
          color: var(--text-secondary); font-size: 0.95rem;
          border: 1px dashed rgba(255,255,255,0.1); border-radius: var(--border-radius-lg);
        }
        .exp-empty-icon { color: rgba(246,36,64,0.4); }

        /* Main timeline container */
        .exp-timeline {
          display: flex; flex-direction: column;
          max-width: 880px; margin: 0 auto;
        }

        /* Each row: date | line | card */
        .exp-row {
          display: grid;
          grid-template-columns: 108px 48px 1fr;
          align-items: flex-start;
          position: relative;
        }

        /* Date column */
        .exp-date-col {
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 4px;
          padding-top: 18px; padding-right: 0;
          text-align: right;
        }
        .exp-date-end {
          font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700;
          color: #FFFFFF; letter-spacing: 0.3px;
        }
        .exp-date-duration {
          font-family: var(--font-mono); font-size: 0.62rem; font-weight: 600;
          color: var(--accent-red); letter-spacing: 0.5px; text-transform: uppercase;
          padding: 2px 6px; background: rgba(246,36,64,0.12);
          border: 1px solid rgba(246,36,64,0.25); border-radius: 4px;
        }
        .exp-date-start {
          font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-secondary);
        }

        /* Center line + node column */
        .exp-line-col {
          display: flex; flex-direction: column; align-items: center;
          position: relative; padding-top: 18px;
        }
        .exp-node {
          width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0; position: relative; z-index: 2;
          background: #0A0A0F;
          border: 2px solid rgba(255,255,255,0.2);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .exp-node-active {
          border-color: var(--accent-red);
          box-shadow: 0 0 10px rgba(246,36,64,0.5);
        }
        .exp-node-pulse {
          position: absolute; inset: -5px; border-radius: 50%;
          border: 1px solid var(--accent-red); opacity: 0.5;
          animation: pulseGlow 2s infinite ease-in-out;
        }
        .exp-connector {
          flex: 1; width: 1px; min-height: 24px;
          background: rgba(255,255,255,0.1);
          margin-top: 4px;
        }
        .exp-row:last-child .exp-connector { display: none; }
        .exp-row:hover .exp-node { border-color: var(--accent-red); }

        /* Card */
        .exp-card {
          margin-left: 0; margin-bottom: 20px;
          padding: 22px 26px;
          background: rgba(10, 10, 15, 0.65);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: var(--border-radius-md);
          text-align: left;
          transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
        }
        .exp-row:hover .exp-card {
          border-color: rgba(246,36,64,0.3);
          box-shadow: 0 12px 32px -12px rgba(0,0,0,0.8);
          transform: translateX(3px);
        }

        /* "CURRENT" badge at top of card */
        .exp-current-badge {
          display: inline-flex; align-items: center; gap: 7px;
          font-family: var(--font-mono); font-size: 0.62rem; font-weight: 700;
          color: var(--accent-red); letter-spacing: 2px; text-transform: uppercase;
          margin-bottom: 14px;
        }

        /* Card top: avatar + meta */
        .exp-card-top {
          display: flex; align-items: flex-start; gap: 14px; margin-bottom: 16px;
        }
        .exp-company-badge {
          width: 42px; height: 42px; border-radius: 10px; flex-shrink: 0;
          background: linear-gradient(135deg, rgba(246,36,64,0.25) 0%, rgba(128,10,28,0.4) 100%);
          border: 1px solid rgba(246,36,64,0.35);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-sans); font-size: 1.1rem; font-weight: 800;
          color: #FFFFFF; letter-spacing: -0.5px;
          transition: background 0.3s ease;
        }
        .exp-row:hover .exp-company-badge {
          background: linear-gradient(135deg, rgba(246,36,64,0.4) 0%, rgba(128,10,28,0.6) 100%);
        }
        .exp-card-meta { display: flex; flex-direction: column; gap: 5px; flex: 1; }
        .exp-role {
          font-family: var(--font-sans); font-size: 1.1rem; font-weight: 800;
          color: #FFFFFF; margin: 0; letter-spacing: -0.3px; line-height: 1.2;
        }
        .exp-company-row {
          display: flex; align-items: center; gap: 5px; flex-wrap: wrap;
          color: var(--text-secondary); font-size: 0.82rem;
        }
        .exp-company-name { font-weight: 600; color: var(--text-secondary); }
        .exp-sep { opacity: 0.4; }
        .exp-location { font-size: 0.78rem; }

        /* Bullet list */
        .exp-bullets {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 9px;
          border-top: 1px solid rgba(255,255,255,0.05);
          padding-top: 14px;
        }
        .exp-bullet-item {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 0.875rem; color: var(--text-secondary); line-height: 1.65;
        }
        .exp-bullet-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--accent-red); flex-shrink: 0;
          margin-top: 7px; opacity: 0.75;
        }

        /* Light mode */
        body.light-theme .exp-section-title { color: #0F172A; }
        body.light-theme .exp-card {
          background: #FFFFFF; border-color: rgba(0,0,0,0.08);
          box-shadow: 0 8px 24px -8px rgba(15,23,42,0.07);
        }
        body.light-theme .exp-role { color: #0F172A; }
        body.light-theme .exp-date-end { color: #0F172A; }
        body.light-theme .exp-node { background: #F8FAFC; }
        body.light-theme .exp-connector { background: rgba(0,0,0,0.1); }
        body.light-theme .exp-bullets { border-top-color: rgba(0,0,0,0.07); }

        /* Responsive */
        @media (max-width: 768px) {
          .exp-section-header { flex-direction: column; align-items: flex-start; }
          .exp-section-lead { text-align: left; max-width: 100%; }
          .exp-row { grid-template-columns: 80px 36px 1fr; }
          .exp-date-col { padding-top: 16px; }
          .exp-date-end { font-size: 0.72rem; }
          .exp-date-start { font-size: 0.65rem; }
          .exp-card { padding: 18px; }
          .exp-role { font-size: 0.95rem; }
        }
        @media (max-width: 520px) {
          .exp-row { grid-template-columns: 0 28px 1fr; }
          .exp-date-col { display: none; }
        }



        /* ─── LATEST ARTICLES — MINIMAL REDESIGN ─── */
        .insights-section { position: relative; }
        .insights-ambient-glow {
          position: absolute; right: -10%; top: 20%;
          width: 50vw; height: 50vw; max-width: 500px; max-height: 500px;
          background: radial-gradient(circle, rgba(128,10,28,0.14) 0%, transparent 70%);
          filter: blur(65px); pointer-events: none;
        }

        /* Section header */
        .ins-section-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 40px; margin-bottom: 52px;
          border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 36px;
        }
        .ins-header-left { display: flex; flex-direction: column; gap: 10px; flex-shrink: 0; }
        .ins-eyebrow {
          display: inline-flex; align-items: center; gap: 7px;
          font-family: var(--font-mono); font-size: 0.68rem; font-weight: 700;
          color: var(--accent-red); letter-spacing: 2px; text-transform: uppercase;
        }
        .ins-section-title {
          font-family: var(--font-sans); font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 800; color: #FFFFFF; margin: 0; letter-spacing: -1.5px; line-height: 1.05;
        }
        .ins-section-lead {
          font-size: 1rem; color: var(--text-secondary); line-height: 1.75;
          max-width: 420px; margin: 0; text-align: right;
        }

        /* Grid */
        .ins-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
          text-align: left;
        }

        /* Card */
        .ins-card {
          display: flex; flex-direction: column;
          background: rgba(10,10,15,0.65);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: var(--border-radius-md);
          overflow: hidden;
          transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
        }
        .ins-card:hover {
          border-color: rgba(246,36,64,0.35);
          box-shadow: 0 16px 40px -12px rgba(0,0,0,0.85);
          transform: translateY(-4px);
        }

        /* Image wrapper */
        .ins-card-img-wrap {
          display: block; position: relative;
          height: 180px; overflow: hidden; flex-shrink: 0;
        }
        .ins-card-img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.55s cubic-bezier(0.25,1,0.5,1);
          display: block;
        }
        .ins-card:hover .ins-card-img { transform: scale(1.05); }
        .ins-card-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 35%, rgba(10,10,15,0.75) 100%);
          pointer-events: none;
        }
        .ins-primary-tag {
          position: absolute; bottom: 12px; left: 12px;
          font-family: var(--font-mono); font-size: 0.62rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 1px;
          padding: 3px 8px; border-radius: 4px;
          background: rgba(128,10,28,0.9); border: 1px solid rgba(246,36,64,0.5);
          color: #FFFFFF;
        }
        .ins-card-placeholder {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, rgba(128,10,28,0.18) 0%, rgba(7,7,10,0.9) 100%);
          color: rgba(246,36,64,0.4);
        }

        /* Body */
        .ins-card-body { padding: 22px; display: flex; flex-direction: column; flex-grow: 1; gap: 10px; }
        .ins-card-meta {
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
          font-family: var(--font-mono); font-size: 0.68rem; color: var(--text-muted);
        }
        .ins-card-meta span { display: flex; align-items: center; gap: 4px; }
        .ins-meta-dot { width: 3px; height: 3px; border-radius: 50%; background: rgba(255,255,255,0.2); }

        .ins-card-title {
          font-family: var(--font-sans); font-size: 1.1rem; font-weight: 800;
          line-height: 1.3; letter-spacing: -0.3px; margin: 0;
        }
        .ins-card-title a { color: #FFFFFF; text-decoration: none; transition: color 0.2s ease; }
        .ins-card-title a:hover { color: var(--accent-red); }

        .ins-card-excerpt {
          font-size: 0.87rem; color: var(--text-secondary); line-height: 1.65;
          margin: 0; flex-grow: 1;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
        }

        .ins-card-footer {
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
          border-top: 1px solid rgba(255,255,255,0.05);
          padding-top: 14px; margin-top: auto;
        }
        .ins-tag {
          font-family: var(--font-mono); font-size: 0.65rem; font-weight: 600;
          color: var(--text-secondary); letter-spacing: 0.3px;
          padding: 3px 8px; border-radius: 4px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
        }
        .ins-read-link {
          margin-left: auto; display: inline-flex; align-items: center; gap: 5px;
          font-family: var(--font-mono); font-size: 0.7rem; font-weight: 700;
          color: var(--accent-red); text-transform: uppercase; letter-spacing: 1px;
          transition: gap 0.2s ease, color 0.2s ease;
        }
        .ins-read-link:hover { gap: 8px; }

        .ins-action-row { margin-top: 44px; display: flex; justify-content: center; }

        /* Light mode */
        body.light-theme .ins-section-title { color: #0F172A; }
        body.light-theme .ins-card { background: #FFFFFF; border-color: rgba(0,0,0,0.08); }
        body.light-theme .ins-card-title a { color: #0F172A; }
        body.light-theme .ins-card-footer { border-top-color: rgba(0,0,0,0.07); }
        body.light-theme .ins-tag { background: rgba(0,0,0,0.04); border-color: rgba(0,0,0,0.09); color: #475569; }
        body.light-theme .ins-section-lead { text-align: right; }

        @media (max-width: 960px) {
          .ins-section-header { flex-direction: column; align-items: flex-start; }
          .ins-section-lead { text-align: left; max-width: 100%; }
        }
        @media (max-width: 600px) {
          .ins-grid { grid-template-columns: 1fr; }
        }

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
          .hero-container { grid-template-columns: 1fr; text-align: center; gap: 40px; }
          .hero-content { text-align: center; align-items: center; }
          .hero-status-row { justify-content: center; }
          .hero-tech-highlights { justify-content: center; }
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
          .hero-status-row { flex-direction: column; gap: 8px; }
          .hero-role-badge { width: 100%; flex-direction: column; align-items: center; text-align: center; }
          .hero-tech-highlights { flex-direction: column; width: 100%; }
          .tech-badge-item { width: 100%; justify-content: center; }
          .hero-contact-info { flex-direction: column; align-items: center; gap: 8px; }
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
          .modal-backdrop { padding: 60px 12px 20px 12px; }
          .spec-sheet-modal { width: 100%; max-height: calc(92vh - 30px); border-radius: var(--border-radius-md); }
          .modal-scroll-body { padding: 16px 14px; gap: 14px; }
          .modal-image-wrapper { height: 160px; }
          .modal-title { font-size: 1.25rem; }
          .modal-section-box { padding: 14px; }
          .modal-box-label { font-size: 0.64rem; }
          .modal-footer-bar { padding: 12px 14px; flex-direction: column-reverse; align-items: stretch; gap: 8px; }
          .modal-footer-bar .btn { width: 100%; justify-content: center; padding: 10px 14px; font-size: 0.82rem; }
          .modal-footer-hint { display: none !important; }
          .skill-modal-hero { flex-direction: column; align-items: flex-start; gap: 12px; }
          .skill-modal-logo-wrapper { width: 48px; height: 48px; }
          .skill-modal-name { font-size: 1.25rem; }
        }
      `}</style>
    </div>
  );
};

export default Home;
