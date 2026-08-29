import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Code, Briefcase, BookOpen, AlertCircle, Plus, Trash2, Edit3, 
  Save, Check, RefreshCw, X, Eye, EyeOff, Image, Palette, Percent,
  Sparkles, ExternalLink, HelpCircle, Layers, Terminal, Mail, MessageSquare,
  FileText, Upload, Download, Loader2, Globe, LogOut
} from 'lucide-react';
import { api } from '../services/api';
import { TechBrandIcon } from '../components/BrandIcons';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bio');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  // Loaded database items
  const [profile, setProfile]         = useState(null);
  const [skills, setSkills]           = useState([]);
  const [projects, setProjects]       = useState([]);
  const [blogs, setBlogs]             = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [commands, setCommands]       = useState([]);
  const [messages, setMessages]       = useState([]);

  // Form states
  const [bioForm, setBioForm] = useState({ 
    name: '', title: '', bio: '', about_me: '', avatar_url: '', 
    favicon_url: '', site_title: '', seo_keywords: '', seo_description: '',
    github_url: '', linkedin_url: '', resume_url: '', email: '', location: '' 
  });
  
  // Modals / Editing / Adding states
  const [editingItem, setEditingItem] = useState(null);
  const [addingItem, setAddingItem] = useState(null);

  // Shared generic entry form states
  const [skillForm, setSkillForm]     = useState({ name: '', category: 'backend', proficiency: '', percentage: 85, icon: 'Code', logo_url: '', color_theme: '#F62440', description: '', order: 0 });
  const [projectForm, setProjectForm] = useState({ title: '', slug: '', description: '', long_description: '', image_url: '', github_url: '', demo_url: '', tech_stack: '', order: 0 });
  const [blogForm, setBlogForm]       = useState({ title: '', slug: '', excerpt: '', content: '', cover_image_url: '', tags: '', is_published: false });
  const [expForm, setExpForm]         = useState({ role: '', company: '', location: '', start_date: '', end_date: '', is_current: false, description: '', order: 0 });
  const [cmdForm, setCmdForm]         = useState({ command: '', response: '', description: '', order: 0 });

  useEffect(() => {
    if (!api.isAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [profileRes, skillsRes, projectsRes, blogsRes, experiencesRes, commandsRes, messagesRes] = await Promise.all([
        api.getProfile(),
        api.getSkills(),
        api.getProjects(),
        api.getBlogs(),
        api.getExperiences(),
        api.getTerminalCommands(),
        api.getContactMessages().catch(() => []),
      ]);

      if (profileRes) {
        setProfile(profileRes);
        setBioForm(profileRes);
      }
      setSkills(skillsRes || []);
      setProjects(projectsRes || []);
      setBlogs(blogsRes || []);
      setExperiences(experiencesRes || []);
      setCommands(commandsRes || []);
      setMessages(messagesRes || []);
    } catch (err) {
      console.error("Failed to load admin data", err);
      setError("Failed to sync database. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setSuccess(type === 'success' ? message : '');
    setError(type === 'error' ? message : '');
    setTimeout(() => {
      setSuccess('');
      setError('');
    }, 4000);
  };

  // BIO / PROFILE operations
  const handleBioSubmit = async (e) => {
    e.preventDefault();
    try {
      if (profile) {
        const updated = await api.updateProfile(profile.id, bioForm);
        setProfile(updated);
        showToast("Profile bio & About Me details updated! Applied immediately to live website.");
      } else {
        const created = await api.createProfile(bioForm);
        setProfile(created);
        showToast("Profile bio created! Applied immediately to live website.");
      }
    } catch (err) {
      showToast("Failed to save profile details.", "error");
    }
  };

  const handleResumeFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      showToast("Please select a valid PDF file.", "error");
      return;
    }

    setUploadingResume(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.uploadResume(formData);
      if (res.file_url) {
        setBioForm(prev => ({ ...prev, resume_url: res.file_url }));
        if (profile) {
          setProfile(prev => ({ ...prev, resume_url: res.file_url }));
        }
        showToast("Resume PDF uploaded successfully! Remember to save profile changes.");
      }
    } catch (err) {
      console.error("Resume upload error", err);
      showToast(err.message || "Failed to upload resume PDF.", "error");
    } finally {
      setUploadingResume(false);
      e.target.value = '';
    }
  };

  const handleFaviconFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFavicon(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.uploadFavicon(formData);
      if (res.file_url) {
        setBioForm(prev => ({ ...prev, favicon_url: res.file_url }));
        if (profile) {
          setProfile(prev => ({ ...prev, favicon_url: res.file_url }));
        }
        // Update browser tab icon immediately
        const fav = document.getElementById('dynamic-favicon');
        if (fav) fav.href = res.file_url;
        showToast("Head title image / Favicon uploaded and updated live! Remember to save profile changes.");
      }
    } catch (err) {
      console.error("Favicon upload error", err);
      showToast(err.message || "Failed to upload favicon image.", "error");
    } finally {
      setUploadingFavicon(false);
      e.target.value = '';
    }
  };

  // SKILL operations
  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const res = await api.updateSkill(editingItem.id, skillForm);
        setSkills(skills.map(s => s.id === res.id ? res : s));
        showToast("Skill details, percentage & color theme updated! Applied immediately.");
      } else {
        const res = await api.createSkill(skillForm);
        setSkills([...skills, res]);
        showToast("New Skill created! Applied immediately to live website.");
      }
      closeForms();
    } catch (err) {
      showToast("Failed to save skill details.", "error");
    }
  };

  const deleteSkill = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    try {
      await api.deleteSkill(id);
      setSkills(skills.filter(s => s.id !== id));
      showToast("Skill deleted successfully.");
    } catch (err) {
      showToast("Failed to delete skill.", "error");
    }
  };

  // PROJECT operations
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const res = await api.updateProject(editingItem.id, projectForm);
        setProjects(projects.map(p => p.id === res.id ? res : p));
        showToast("Project details & specs updated! Applied immediately to live website.");
      } else {
        const res = await api.createProject(projectForm);
        setProjects([...projects, res]);
        showToast("New Project added! Applied immediately to live website.");
      }
      closeForms();
    } catch (err) {
      showToast("Failed to save project.", "error");
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
      showToast("Project deleted.");
    } catch (err) {
      showToast("Failed to delete project.", "error");
    }
  };

  // BLOG operations
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const res = await api.updateBlog(editingItem.id, blogForm);
        setBlogs(blogs.map(b => b.id === res.id ? res : b));
        showToast("Blog post updated! Applied immediately to live website.");
      } else {
        const res = await api.createBlog(blogForm);
        setBlogs([res, ...blogs]);
        showToast("New Blog post published! Visible immediately on live website.");
      }
      closeForms();
    } catch (err) {
      showToast("Failed to save blog.", "error");
    }
  };

  const deleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;
    try {
      await api.deleteBlog(id);
      setBlogs(blogs.filter(b => b.id !== id));
      showToast("Blog post removed.");
    } catch (err) {
      showToast("Failed to delete blog post.", "error");
    }
  };

  // EXPERIENCE operations
  const handleExpSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const res = await api.updateExperience(editingItem.id, expForm);
        setExperiences(experiences.map(ex => ex.id === res.id ? res : ex));
        showToast("Experience record updated! Applied immediately.");
      } else {
        const res = await api.createExperience(expForm);
        setExperiences([...experiences, res]);
        showToast("Experience record created! Applied immediately.");
      }
      closeForms();
    } catch (err) {
      showToast("Failed to save experience details.", "error");
    }
  };

  const deleteExp = async (id) => {
    if (!window.confirm("Are you sure you want to delete this experience record?")) return;
    try {
      await api.deleteExperience(id);
      setExperiences(experiences.filter(ex => ex.id !== id));
      showToast("Experience deleted.");
    } catch (err) {
      showToast("Failed to delete experience.", "error");
    }
  };

  // TERMINAL COMMAND operations
  const handleCmdSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const res = await api.updateTerminalCommand(editingItem.id, cmdForm);
        setCommands(commands.map(c => c.id === res.id ? res : c));
        showToast(`Terminal prompt '$ ${res.command}' updated! Applied immediately to neofetch terminal.`);
      } else {
        const res = await api.createTerminalCommand(cmdForm);
        setCommands([...commands, res]);
        showToast(`New terminal command '$ ${res.command}' created! Active in neofetch terminal.`);
      }
      closeForms();
    } catch (err) {
      showToast("Failed to save terminal command.", "error");
    }
  };

  const deleteCmd = async (id) => {
    if (!window.confirm("Are you sure you want to delete this terminal prompt?")) return;
    try {
      await api.deleteTerminalCommand(id);
      setCommands(commands.filter(c => c.id !== id));
      showToast("Terminal command removed.");
    } catch (err) {
      showToast("Failed to delete terminal command.", "error");
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this visitor message?")) return;
    try {
      await api.deleteContactMessage(id);
      setMessages(messages.filter(m => m.id !== id));
      showToast("Visitor inquiry message deleted.");
    } catch (err) {
      showToast("Failed to delete visitor message.", "error");
    }
  };

  const closeForms = () => {
    setEditingItem(null);
    setAddingItem(null);
    setSkillForm({ name: '', category: 'backend', proficiency: '', percentage: 85, icon: 'Code', logo_url: '', color_theme: '#F62440', description: '', order: 0 });
    setProjectForm({ title: '', slug: '', description: '', long_description: '', image_url: '', github_url: '', demo_url: '', tech_stack: '', order: 0 });
    setBlogForm({ title: '', slug: '', excerpt: '', content: '', cover_image_url: '', tags: '', is_published: false });
    setExpForm({ role: '', company: '', location: '', start_date: '', end_date: '', is_current: false, description: '', order: 0 });
    setCmdForm({ command: '', response: '', description: '', order: 0 });
  };

  const startAdd = (type) => {
    closeForms();
    setAddingItem(type);
  };

  const startEdit = (type, item) => {
    closeForms();
    setEditingItem(item);
    if (type === 'skill') setSkillForm({ ...item, percentage: item.percentage ?? 85, logo_url: item.logo_url || '', color_theme: item.color_theme || '#F62440', description: item.description || '' });
    if (type === 'project') setProjectForm({
      title: item.title || '',
      slug: item.slug || '',
      description: item.description || '',
      long_description: item.long_description || '',
      image_url: item.image_url || '',
      github_url: item.github_url || '',
      demo_url: item.demo_url || '',
      tech_stack: item.tech_stack || (item.tech_stack_list ? item.tech_stack_list.join(', ') : ''),
      order: item.order || 0
    });
    if (type === 'blog') setBlogForm({ ...item, tags: item.tags || (item.tags_list ? item.tags_list.join(', ') : '') });
    if (type === 'experience') setExpForm(item);
    if (type === 'terminal') setCmdForm(item);
  };

  const colorPresets = [
    '#F62440', '#800A1C', '#3776AB', '#61DAFB', '#0C4B33', '#059669', 
    '#00ADD8', '#EE4C2C', '#FF6F00', '#336791', '#2496ED', '#F7DF1E', '#EA4B71'
  ];

  const handleLogout = () => {
    api.logout();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader" />
        <p>Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page container section">
      <div className="admin-header glass-panel">
        <div>
          <h1 className="admin-title">System Control Center</h1>
          <p className="admin-subtitle">Manage, customize, and publish content across your portfolio in real-time</p>
        </div>
        <div className="admin-actions">
          <button onClick={loadData} className="btn btn-secondary btn-sm" title="Reload data from database">
            <RefreshCw size={14} /> Refresh
          </button>
          <Link to="/" className="btn btn-secondary btn-sm" title="Go to live portfolio website">
            <ExternalLink size={14} /> View Website
          </Link>
          <button onClick={handleLogout} className="btn btn-primary btn-sm" title="Log out from admin portal">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      {/* Toast Notifications */}
      {success && <div className="toast toast-success"><Check size={16} /> {success}</div>}
      {error && <div className="toast toast-error"><AlertCircle size={16} /> {error}</div>}

      <div className="admin-layout">
        {/* Navigation Sidebar Tabs */}
        <div className="admin-sidebar glass-panel">
          <button className={`admin-tab ${activeTab === 'bio' ? 'active' : ''}`} onClick={() => { setActiveTab('bio'); closeForms(); }}>
            <User size={18} /> Profile &amp; Bio
          </button>
          <button className={`admin-tab ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => { setActiveTab('messages'); closeForms(); }}>
            <Mail size={18} /> Visitor Inbox ({messages.length})
          </button>
          <button className={`admin-tab ${activeTab === 'terminal' ? 'active' : ''}`} onClick={() => { setActiveTab('terminal'); closeForms(); }}>
            <Terminal size={18} /> Terminal Commands ({commands.length})
          </button>
          <button className={`admin-tab ${activeTab === 'skills' ? 'active' : ''}`} onClick={() => { setActiveTab('skills'); closeForms(); }}>
            <Code size={18} /> Skills &amp; Percentages ({skills.length})
          </button>
          <button className={`admin-tab ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => { setActiveTab('projects'); closeForms(); }}>
            <Briefcase size={18} /> Projects ({projects.length})
          </button>
          <button className={`admin-tab ${activeTab === 'blogs' ? 'active' : ''}`} onClick={() => { setActiveTab('blogs'); closeForms(); }}>
            <BookOpen size={18} /> Articles &amp; Blogs ({blogs.length})
          </button>
          <button className={`admin-tab ${activeTab === 'experience' ? 'active' : ''}`} onClick={() => { setActiveTab('experience'); closeForms(); }}>
            <Layers size={18} /> Work History ({experiences.length})
          </button>
        </div>

        {/* Main Content Management Area */}
        <div className="admin-content-area">
          {/* TAB 1: BIO & PROFILE */}
          {activeTab === 'bio' && (
            <div className="glass-panel main-panel-card">
              <h2 className="panel-title">Manage Personal Profile &amp; About Me</h2>
              <form onSubmit={handleBioSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input type="text" className="form-control" value={bioForm.name || ''} onChange={(e) => setBioForm({ ...bioForm, name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Primary Headline Title *</label>
                    <input type="text" className="form-control" value={bioForm.title || ''} onChange={(e) => setBioForm({ ...bioForm, title: e.target.value })} required placeholder="e.g. AI/ML Engineer & Backend Architect" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Hero Bio (Short introduction) *</label>
                  <textarea className="form-control" value={bioForm.bio || ''} onChange={(e) => setBioForm({ ...bioForm, bio: e.target.value })} required></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">About Me Section (Full Markdown supported) *</label>
                  <textarea className="form-control" style={{ minHeight: '200px' }} value={bioForm.about_me || ''} onChange={(e) => setBioForm({ ...bioForm, about_me: e.target.value })} required></textarea>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-control" value={bioForm.email || ''} onChange={(e) => setBioForm({ ...bioForm, email: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input type="text" className="form-control" value={bioForm.location || ''} onChange={(e) => setBioForm({ ...bioForm, location: e.target.value })} placeholder="e.g. India" />
                  </div>
                </div>

                {/* DEDICATED RESUME PDF MANAGEMENT */}
                <div className="form-section-box" style={{ background: 'rgba(128, 10, 28, 0.12)', border: '1px solid rgba(246, 36, 64, 0.25)', borderRadius: '8px', padding: '18px 20px', margin: '22px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                    <label className="form-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#FFFFFF', fontWeight: 700 }}>
                      <FileText size={16} className="accent-red-icon" /> Resume PDF File Management
                    </label>
                    {bioForm.resume_url && (
                      <a href={bioForm.resume_url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ padding: '5px 12px', fontSize: '0.76rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <ExternalLink size={13} /> View Current Live Resume PDF
                      </a>
                    )}
                  </div>

                  <div className="form-row" style={{ alignItems: 'flex-end', gap: '14px' }}>
                    <div className="form-group" style={{ flex: 1, margin: 0 }}>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                        Option A: Upload New PDF from Computer / Device
                      </label>
                      <input 
                        type="file" 
                        accept=".pdf,application/pdf"
                        onChange={handleResumeFileUpload} 
                        disabled={uploadingResume}
                        className="form-control"
                        style={{ padding: '8px', cursor: 'pointer', background: 'rgba(0,0,0,0.4)' }}
                      />
                    </div>
                    {uploadingResume && (
                      <div style={{ padding: '10px 14px', background: 'rgba(246, 36, 64, 0.15)', border: '1px solid var(--accent-red)', borderRadius: '6px', fontSize: '0.8rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Loader2 size={15} className="spin-icon" /> Uploading PDF...
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: '16px' }}>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                      Option B: Or Direct Resume PDF URL (Internal / Google Drive / Cloudinary)
                    </label>
                    <input 
                      type="url" 
                      className="form-control" 
                      value={bioForm.resume_url || ''} 
                      onChange={(e) => setBioForm({ ...bioForm, resume_url: e.target.value })} 
                      placeholder="http://127.0.0.1:8000/media/resumes/... or https://..." 
                    />
                  </div>
                </div>

                {/* DEDICATED HEAD TITLE IMAGE (FAVICON) & SEO MANAGEMENT */}
                <div className="form-section-box" style={{ background: 'rgba(128, 10, 28, 0.12)', border: '1px solid rgba(246, 36, 64, 0.25)', borderRadius: '8px', padding: '18px 20px', margin: '22px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                    <label className="form-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#FFFFFF', fontWeight: 700 }}>
                      <Globe size={16} className="accent-red-icon" /> Browser Tab Title Image (Favicon) &amp; SEO Engine
                    </label>
                    {bioForm.favicon_url && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img 
                          src={bioForm.favicon_url} 
                          alt="Current Favicon" 
                          style={{ width: '26px', height: '26px', objectFit: 'contain', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', padding: '2px', border: '1px solid rgba(246,36,64,0.4)' }} 
                        />
                        <a href={bioForm.favicon_url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <ExternalLink size={12} /> View Live Icon
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="form-row" style={{ alignItems: 'flex-end', gap: '14px' }}>
                    <div className="form-group" style={{ flex: 1, margin: 0 }}>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                        Upload New Title Image / Favicon (PNG, SVG, ICO, WEBP, JPG)
                      </label>
                      <input 
                        type="file" 
                        accept="image/*,.svg,.ico,.png,.jpg,.jpeg,.webp"
                        onChange={handleFaviconFileUpload} 
                        disabled={uploadingFavicon}
                        className="form-control"
                        style={{ padding: '8px', cursor: 'pointer', background: 'rgba(0,0,0,0.4)' }}
                      />
                    </div>
                    {uploadingFavicon && (
                      <div style={{ padding: '10px 14px', background: 'rgba(246, 36, 64, 0.15)', border: '1px solid var(--accent-red)', borderRadius: '6px', fontSize: '0.8rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Loader2 size={15} className="spin-icon" /> Uploading Icon...
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: '16px' }}>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                      Or Direct Title Image / Favicon URL
                    </label>
                    <input 
                      type="url" 
                      className="form-control" 
                      value={bioForm.favicon_url || ''} 
                      onChange={(e) => setBioForm({ ...bioForm, favicon_url: e.target.value })} 
                      placeholder="https://... or /media/icons/..." 
                    />
                  </div>

                  <div className="form-row" style={{ marginTop: '16px' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>Custom Browser Tab Title (SEO Title)</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={bioForm.site_title || ''} 
                        onChange={(e) => setBioForm({ ...bioForm, site_title: e.target.value })} 
                        placeholder="e.g. devil37 | AI/ML Engineer & Backend Architect" 
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>SEO Keywords (Comma Separated)</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={bioForm.seo_keywords || ''} 
                        onChange={(e) => setBioForm({ ...bioForm, seo_keywords: e.target.value })} 
                        placeholder="AI Engineer, RAG, PyTorch, Django, FastAPI..." 
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: '12px', marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>SEO Meta Description (Search Engines &amp; Social Previews)</label>
                    <textarea 
                      className="form-control" 
                      style={{ minHeight: '70px', fontSize: '0.85rem' }} 
                      value={bioForm.seo_description || ''} 
                      onChange={(e) => setBioForm({ ...bioForm, seo_description: e.target.value })} 
                      placeholder="Engineering resilient distributed backends, intelligent multi-agent systems, and production AI architectures..." 
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Avatar Image URL</label>
                    <input type="url" className="form-control" value={bioForm.avatar_url || ''} onChange={(e) => setBioForm({ ...bioForm, avatar_url: e.target.value })} placeholder="https://..." />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">GitHub Profile URL</label>
                    <input type="url" className="form-control" value={bioForm.github_url || ''} onChange={(e) => setBioForm({ ...bioForm, github_url: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">LinkedIn Profile URL</label>
                    <input type="url" className="form-control" value={bioForm.linkedin_url || ''} onChange={(e) => setBioForm({ ...bioForm, linkedin_url: e.target.value })} />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary"><Save size={16} /> Save Profile Changes</button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: VISITOR MESSAGES INBOX */}
          {activeTab === 'messages' && (
            <div className="glass-panel main-panel-card">
              <div className="panel-header-row">
                <h2 className="panel-title">Received Visitor Inquiries ({messages.length})</h2>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
                Messages submitted through the Get In Touch section on your live portfolio. Automatic thank-you emails are dispatched to visitors via SMTP.
              </p>
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                  <Mail size={36} style={{ marginBottom: '12px', opacity: 0.5, color: 'var(--accent-red)' }} />
                  <h3>No messages received yet</h3>
                  <p>When visitors fill out the Get In Touch form, their inquiries will appear here.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>Visitor Name</th>
                        <th>Email Address</th>
                        <th>Subject</th>
                        <th>Message Content</th>
                        <th>Submitted Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {messages.map(msg => (
                        <tr key={msg.id}>
                          <td><strong>{msg.name}</strong></td>
                          <td>
                            <a href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Portfolio Inquiry')}`} style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                              {msg.email}
                            </a>
                          </td>
                          <td><span className="badge" style={{ textTransform: 'none' }}>{msg.subject || 'General'}</span></td>
                          <td>
                            <div style={{ fontSize: '0.84rem', color: 'var(--text-primary)', maxWidth: '340px', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
                              {msg.message}
                            </div>
                          </td>
                          <td>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {new Date(msg.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>
                          <td>
                            <div className="actions-cell">
                              <a 
                                href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Portfolio Inquiry')}`} 
                                className="action-btn edit-action" 
                                title="Reply via Email Client"
                              >
                                <Mail size={14} />
                              </a>
                              <button 
                                onClick={() => deleteMessage(msg.id)} 
                                className="action-btn delete-action" 
                                title="Delete Message"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TERMINAL COMMANDS */}
          {activeTab === 'terminal' && !addingItem && !editingItem && (
            <div className="glass-panel main-panel-card">
              <div className="panel-header-row">
                <h2 className="panel-title">Hero Terminal Prompts &amp; Output Responses ({commands.length})</h2>
                <button onClick={() => startAdd('terminal')} className="btn btn-primary btn-sm"><Plus size={15} /> Add Prompt &amp; Response</button>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
                Manage custom commands for <code>devil37@portfolio:~$</code>. Any prompt added here will be executed in real-time when visitors type it in the hero console.
              </p>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Prompt Command</th>
                      <th>Output Response Preview</th>
                      <th>Description</th>
                      <th>Order</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commands.map(cmd => (
                      <tr key={cmd.id}>
                        <td><strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-red)' }}>${cmd.command}</strong></td>
                        <td>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-secondary)', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {cmd.response}
                          </div>
                        </td>
                        <td>{cmd.description || 'Custom command'}</td>
                        <td>{cmd.order}</td>
                        <td className="actions-cell">
                          <button onClick={() => startEdit('terminal', cmd)} className="action-btn edit-action" title="Edit Prompt & Response"><Edit3 size={15} /></button>
                          <button onClick={() => deleteCmd(cmd.id)} className="action-btn delete-action" title="Delete Command"><Trash2 size={15} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: SKILLS */}
          {activeTab === 'skills' && !addingItem && !editingItem && (
            <div className="glass-panel main-panel-card">
              <div className="panel-header-row">
                <h2 className="panel-title">Skills &amp; Proficiency Meters ({skills.length})</h2>
                <button onClick={() => startAdd('skill')} className="btn btn-primary btn-sm"><Plus size={15} /> Add Skill</button>
              </div>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Skill Logo &amp; Name</th>
                      <th>Category</th>
                      <th>Color Theme</th>
                      <th>Proficiency % Bar</th>
                      <th>Order</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skills.map(skill => (
                      <tr key={skill.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {skill.logo_url ? (
                              <img src={skill.logo_url} alt={skill.name} style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                            ) : (
                              <TechBrandIcon name={skill.name} size={20} />
                            )}
                            <strong>{skill.name}</strong>
                          </div>
                        </td>
                        <td><span className="badge">{skill.category.replace('_', ' ')}</span></td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: skill.color_theme || '#F62440', display: 'inline-block' }} />
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{skill.color_theme || '#F62440'}</span>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '60px', height: '6px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ width: `${skill.percentage ?? 85}%`, height: '100%', backgroundColor: skill.color_theme || '#F62440' }} />
                            </div>
                            <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: skill.color_theme || '#F62440' }}>{skill.percentage ?? 85}%</strong>
                          </div>
                        </td>
                        <td>{skill.order}</td>
                        <td className="actions-cell">
                          <button onClick={() => startEdit('skill', skill)} className="action-btn edit-action" title="Edit Skill"><Edit3 size={15} /></button>
                          <button onClick={() => deleteSkill(skill.id)} className="action-btn delete-action" title="Delete Skill"><Trash2 size={15} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: PROJECTS */}
          {activeTab === 'projects' && !addingItem && !editingItem && (
            <div className="glass-panel main-panel-card">
              <div className="panel-header-row">
                <h2 className="panel-title">Portfolio Projects &amp; Spec Sheets ({projects.length})</h2>
                <button onClick={() => startAdd('project')} className="btn btn-primary btn-sm"><Plus size={15} /> Add Project</button>
              </div>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Title &amp; Image</th>
                      <th>Implemented Tech Stack</th>
                      <th>Order</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map(project => (
                      <tr key={project.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {project.image_url && (
                              <img src={project.image_url} alt={project.title} style={{ width: '36px', height: '36px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                            )}
                            <strong>{project.title}</strong>
                          </div>
                        </td>
                        <td>{project.tech_stack_list?.map((t, i) => <span key={i} className="tag tag-cyan" style={{ fontSize: '0.7rem', padding: '2px 8px', margin: '2px' }}>{t}</span>)}</td>
                        <td>{project.order}</td>
                        <td className="actions-cell">
                          <button onClick={() => startEdit('project', project)} className="action-btn edit-action" title="Edit Project Details"><Edit3 size={15} /></button>
                          <button onClick={() => deleteProject(project.id)} className="action-btn delete-action" title="Delete Project"><Trash2 size={15} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: BLOGS */}
          {activeTab === 'blogs' && !addingItem && !editingItem && (
            <div className="glass-panel main-panel-card">
              <div className="panel-header-row">
                <h2 className="panel-title">Articles &amp; Blog Posts ({blogs.length})</h2>
                <button onClick={() => startAdd('blog')} className="btn btn-primary btn-sm"><Plus size={15} /> Write Article</button>
              </div>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Tags</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map(blog => (
                      <tr key={blog.id}>
                        <td><strong>{blog.title}</strong></td>
                        <td>{blog.tags_list?.map((t, i) => <span key={i} className="tag" style={{ fontSize: '0.7rem', padding: '2px 8px', margin: '2px' }}>{t}</span>)}</td>
                        <td>
                          {blog.is_published ? (
                            <span className="badge" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}><Eye size={12} /> Published</span>
                          ) : (
                            <span className="badge" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}><EyeOff size={12} /> Draft</span>
                          )}
                        </td>
                        <td>{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        <td className="actions-cell">
                          <button onClick={() => startEdit('blog', blog)} className="action-btn edit-action"><Edit3 size={15} /></button>
                          <button onClick={() => deleteBlog(blog.id)} className="action-btn delete-action"><Trash2 size={15} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: EXPERIENCE */}
          {activeTab === 'experience' && !addingItem && !editingItem && (
            <div className="glass-panel main-panel-card">
              <div className="panel-header-row">
                <h2 className="panel-title">Work History Records ({experiences.length})</h2>
                <button onClick={() => startAdd('experience')} className="btn btn-primary btn-sm"><Plus size={15} /> Add Career Record</button>
              </div>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Role &amp; Company</th>
                      <th>Timeline</th>
                      <th>Order</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {experiences.map(exp => (
                      <tr key={exp.id}>
                        <td>
                          <strong>{exp.role}</strong>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{exp.company}</div>
                        </td>
                        <td>{new Date(exp.start_date).getFullYear()} - {exp.is_current ? 'Present' : new Date(exp.end_date).getFullYear()}</td>
                        <td>{exp.order}</td>
                        <td className="actions-cell">
                          <button onClick={() => startEdit('experience', exp)} className="action-btn edit-action"><Edit3 size={15} /></button>
                          <button onClick={() => deleteExp(exp.id)} className="action-btn delete-action"><Trash2 size={15} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUB-FORMS: Terminal Command Editor Form */}
          {(addingItem === 'terminal' || editingItem?.command !== undefined) && activeTab === 'terminal' && (
            <div className="glass-panel main-panel-card">
              <h2 className="panel-title">{editingItem ? `Edit Terminal Command '$ ${editingItem.command}'` : "Add New Terminal Prompt Command"}</h2>
              <form onSubmit={handleCmdSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Command Name (lowercase, no spaces) *</label>
                    <input type="text" className="form-control" value={cmdForm.command} onChange={(e) => setCmdForm({ ...cmdForm, command: e.target.value.toLowerCase().trim() })} required placeholder="e.g. neofetch, contact, status" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sort Weight Order</label>
                    <input type="number" className="form-control" value={cmdForm.order} onChange={(e) => setCmdForm({ ...cmdForm, order: parseInt(e.target.value) || 0 })} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Command Output Response (Returned when user types command in terminal) *</label>
                  <textarea className="form-control" style={{ minHeight: '180px', fontFamily: 'var(--font-mono)', fontSize: '0.88rem' }} value={cmdForm.response} onChange={(e) => setCmdForm({ ...cmdForm, response: e.target.value })} required placeholder="devil37@portfolio&#10;----------------&#10;OS: Debian GNU/Linux 12..."></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Command Description / Help text</label>
                  <input type="text" className="form-control" value={cmdForm.description || ''} onChange={(e) => setCmdForm({ ...cmdForm, description: e.target.value })} placeholder="e.g. Prints system neofetch details" />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary"><Save size={16} /> Save Command</button>
                  <button type="button" onClick={closeForms} className="btn btn-secondary"><X size={16} /> Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/* SUB-FORMS: Skill Editor Form */}
          {(addingItem === 'skill' || editingItem?.category !== undefined) && activeTab === 'skills' && (
            <div className="glass-panel main-panel-card">
              <h2 className="panel-title">{editingItem ? "Edit Skill Details" : "Create New Skill Tag"}</h2>
              <form onSubmit={handleSkillSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Skill Name *</label>
                    <input type="text" className="form-control" value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} required placeholder="e.g. Django, PyTorch, Go" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Skill Category *</label>
                    <select className="form-control" value={skillForm.category} onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}>
                      <option value="languages">Languages</option>
                      <option value="backend">Backend &amp; Systems</option>
                      <option value="frontend">Frontend</option>
                      <option value="ai_ml">AI/ML &amp; Data Science</option>
                      <option value="advanced_ai">Advanced AI (Agents, RAGs, Workflows)</option>
                      <option value="tools">Tools &amp; DevOps</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label className="form-label" style={{ margin: 0 }}>Proficiency Percentage Bar Amount (0% to 100%) *</label>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '1rem', color: skillForm.color_theme || '#F62440' }}>
                      {skillForm.percentage ?? 85}%
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      step="5"
                      style={{ flex: 1, accentColor: skillForm.color_theme || '#F62440', cursor: 'pointer', height: '8px' }}
                      value={skillForm.percentage ?? 85} 
                      onChange={(e) => setSkillForm({ ...skillForm, percentage: parseInt(e.target.value) || 0 })} 
                    />
                    <input 
                      type="number" 
                      min="0" 
                      max="100" 
                      className="form-control" 
                      style={{ width: '80px', textAlign: 'center' }}
                      value={skillForm.percentage ?? 85} 
                      onChange={(e) => setSkillForm({ ...skillForm, percentage: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })} 
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Logo Image URL (Optional custom image link)</label>
                    <input type="url" className="form-control" value={skillForm.logo_url || ''} onChange={(e) => setSkillForm({ ...skillForm, logo_url: e.target.value })} placeholder="https://..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Proficiency Text Tag</label>
                    <input type="text" className="form-control" value={skillForm.proficiency || ''} onChange={(e) => setSkillForm({ ...skillForm, proficiency: e.target.value })} placeholder="e.g. Expert, Advanced, Intermediate" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Skill Accent Color Theme</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <input 
                      type="color" 
                      className="form-control" 
                      style={{ width: '48px', height: '40px', padding: '2px', cursor: 'pointer' }}
                      value={skillForm.color_theme || '#F62440'} 
                      onChange={(e) => setSkillForm({ ...skillForm, color_theme: e.target.value })} 
                    />
                    <input 
                      type="text" 
                      className="form-control" 
                      style={{ width: '120px' }}
                      value={skillForm.color_theme || '#F62440'} 
                      onChange={(e) => setSkillForm({ ...skillForm, color_theme: e.target.value })} 
                    />

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {colorPresets.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setSkillForm({ ...skillForm, color_theme: color })}
                          style={{
                            width: '24px', height: '24px', borderRadius: '50%', backgroundColor: color,
                            border: skillForm.color_theme === color ? '2px solid #FFFFFF' : '1px solid rgba(255,255,255,0.2)',
                            cursor: 'pointer'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Skill Description &amp; Technical Notes (shown on hover and in detail popup modal when clicked, Markdown supported)</label>
                  <textarea className="form-control" rows={4} value={skillForm.description || ''} onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })} placeholder="e.g. Architected and deployed microservices with Django REST Framework, handling 10k+ rpm with Redis caching and PostgreSQL optimizations..." />
                </div>

                <div className="form-group">
                  <label className="form-label">Sorting Weight Order</label>
                  <input type="number" className="form-control" value={skillForm.order} onChange={(e) => setSkillForm({ ...skillForm, order: parseInt(e.target.value) || 0 })} />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary"><Save size={16} /> Save Skill</button>
                  <button type="button" onClick={closeForms} className="btn btn-secondary"><X size={16} /> Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/* SUB-FORMS: Project Editor Form */}
          {(addingItem === 'project' || editingItem?.tech_stack !== undefined) && activeTab === 'projects' && (
            <div className="glass-panel main-panel-card">
              <h2 className="panel-title">{editingItem ? "Edit Project Details & Architecture Specs" : "Add Project to Portfolio"}</h2>
              <form onSubmit={handleProjectSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Project Title *</label>
                    <input type="text" className="form-control" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} required placeholder="e.g. Agentic RAG Platform" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Slug (Optional, auto-generated)</label>
                    <input type="text" className="form-control" value={projectForm.slug} onChange={(e) => setProjectForm({ ...projectForm, slug: e.target.value })} placeholder="project-slug-name" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Short Summary Description (Displayed on Project Card) *</label>
                  <textarea className="form-control" value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} required placeholder="1-2 sentences outlining the core feature..."></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Detailed Architecture Specs (Markdown - Displayed inside Project Click Modal Sheet)</label>
                  <textarea className="form-control" style={{ minHeight: '200px' }} value={projectForm.long_description || ''} onChange={(e) => setProjectForm({ ...projectForm, long_description: e.target.value })} placeholder="### System Overview&#10;Detailed architecture specs, database models, and workflow steps..."></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Implemented Skills &amp; Tech Stack (Comma-separated list) *</label>
                  <input type="text" className="form-control" value={projectForm.tech_stack} onChange={(e) => setProjectForm({ ...projectForm, tech_stack: e.target.value })} required placeholder="e.g. Django, PyTorch, FastAPI, CrewAI, PostgreSQL" />
                </div>

                <div className="form-group">
                  <label className="form-label">Cover Image URL</label>
                  <input type="url" className="form-control" value={projectForm.image_url || ''} onChange={(e) => setProjectForm({ ...projectForm, image_url: e.target.value })} placeholder="https://images.unsplash.com/..." />
                  {projectForm.image_url && (
                    <div style={{ marginTop: '10px', height: '100px', width: '180px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                      <img src={projectForm.image_url} alt="Cover preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">GitHub Repository URL</label>
                    <input type="url" className="form-control" value={projectForm.github_url || ''} onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })} placeholder="https://github.com/..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Live System Demo URL</label>
                    <input type="url" className="form-control" value={projectForm.demo_url || ''} onChange={(e) => setProjectForm({ ...projectForm, demo_url: e.target.value })} placeholder="https://..." />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Sort Weight Order</label>
                  <input type="number" className="form-control" value={projectForm.order} onChange={(e) => setProjectForm({ ...projectForm, order: parseInt(e.target.value) || 0 })} />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary"><Save size={16} /> Save Project</button>
                  <button type="button" onClick={closeForms} className="btn btn-secondary"><X size={16} /> Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/* SUB-FORMS: Blog Editor Form */}
          {(addingItem === 'blog' || editingItem?.excerpt !== undefined) && activeTab === 'blogs' && (
            <div className="glass-panel main-panel-card">
              <h2 className="panel-title">{editingItem ? "Edit Blog Article" : "Write New Technical Post"}</h2>
              <form onSubmit={handleBlogSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Blog Title *</label>
                    <input type="text" className="form-control" value={blogForm.title} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Slug (Optional, auto-generated)</label>
                    <input type="text" className="form-control" value={blogForm.slug} onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })} placeholder="article-slug" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Excerpt Summary (Card preview) *</label>
                  <textarea className="form-control" value={blogForm.excerpt} onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })} required></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Article Body Content (Markdown supported) *</label>
                  <textarea className="form-control" style={{ minHeight: '300px' }} value={blogForm.content} onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })} required></textarea>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Tags (Comma-separated tags) *</label>
                    <input type="text" className="form-control" value={blogForm.tags} onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })} required placeholder="e.g. CrewAI, RAG, NLP" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cover Image URL</label>
                    <input type="url" className="form-control" value={blogForm.cover_image_url || ''} onChange={(e) => setBlogForm({ ...blogForm, cover_image_url: e.target.value })} placeholder="https://..." />
                  </div>
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '20px 0' }}>
                  <input type="checkbox" id="is_published" checked={blogForm.is_published} onChange={(e) => setBlogForm({ ...blogForm, is_published: e.target.checked })} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                  <label htmlFor="is_published" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>Publish immediately (visible to visitors)</label>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary"><Save size={16} /> Save Article</button>
                  <button type="button" onClick={closeForms} className="btn btn-secondary"><X size={16} /> Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/* SUB-FORMS: Experience Editor Form */}
          {(addingItem === 'experience' || editingItem?.role !== undefined) && activeTab === 'experience' && (
            <div className="glass-panel main-panel-card">
              <h2 className="panel-title">{editingItem ? "Edit Experience Record" : "Add Career Experience"}</h2>
              <form onSubmit={handleExpSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Job Role Title *</label>
                    <input type="text" className="form-control" value={expForm.role} onChange={(e) => setExpForm({ ...expForm, role: e.target.value })} required placeholder="e.g. Backend Software Engineer" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company Name *</label>
                    <input type="text" className="form-control" value={expForm.company} onChange={(e) => setExpForm({ ...expForm, company: e.target.value })} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Start Date *</label>
                    <input type="date" className="form-control" value={expForm.start_date} onChange={(e) => setExpForm({ ...expForm, start_date: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date (Leave blank if current)</label>
                    <input type="date" className="form-control" value={expForm.end_date || ''} onChange={(e) => setExpForm({ ...expForm, end_date: e.target.value })} disabled={expForm.is_current} />
                  </div>
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '14px 0' }}>
                  <input type="checkbox" id="is_current" checked={expForm.is_current} onChange={(e) => setExpForm({ ...expForm, is_current: e.target.checked })} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                  <label htmlFor="is_current" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>I currently work in this role</label>
                </div>

                <div className="form-group">
                  <label className="form-label">Key Accomplishments &amp; Bullet Points (One per line) *</label>
                  <textarea className="form-control" style={{ minHeight: '140px' }} value={expForm.description} onChange={(e) => setExpForm({ ...expForm, description: e.target.value })} required placeholder="Built distributed microservices in Go...&#10;Engineered RAG pipelines with PostgreSQL..."></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Sort Weight Order</label>
                  <input type="number" className="form-control" value={expForm.order} onChange={(e) => setExpForm({ ...expForm, order: parseInt(e.target.value) || 0 })} />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary"><Save size={16} /> Save Record</button>
                  <button type="button" onClick={closeForms} className="btn btn-secondary"><X size={16} /> Cancel</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .admin-dashboard-page { padding-top: 100px; text-align: left; }
        .admin-header {
          padding: 24px 30px; margin-bottom: 30px;
          display: flex; justify-content: space-between; align-items: center;
          border-left: 4px solid var(--accent-red);
        }
        .admin-title { font-family: var(--font-sans); font-size: 1.8rem; font-weight: 800; color: #FFFFFF; }
        .admin-subtitle { color: var(--text-secondary); font-size: 0.88rem; }
        .admin-actions { display: flex; gap: 10px; }

        .toast {
          padding: 12px 20px; border-radius: var(--border-radius-sm); margin-bottom: 20px;
          display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 0.88rem;
          font-family: var(--font-mono);
          animation: slideIn 0.3s ease;
        }
        .toast-success { background: rgba(16,185,129,0.15); border: 1px solid #10b981; color: #10b981; }
        .toast-error { background: rgba(239,68,68,0.15); border: 1px solid #ef4444; color: #ef4444; }

        .admin-layout { display: grid; grid-template-columns: 240px 1fr; gap: 28px; }
        .admin-sidebar { padding: 12px; display: flex; flex-direction: column; gap: 4px; height: fit-content; }
        .admin-tab {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 16px; background: transparent; border: none;
          color: var(--text-secondary); font-family: var(--font-sans);
          font-weight: 600; font-size: 0.88rem; cursor: pointer;
          border-radius: var(--border-radius-sm); transition: var(--transition-smooth);
          width: 100%; text-align: left;
        }
        .admin-tab:hover { color: #FFFFFF; background: rgba(255,255,255,0.04); }
        .admin-tab.active {
          background: rgba(128, 10, 28, 0.25);
          color: #FFFFFF; border-left: 3px solid var(--accent-red);
        }

        .main-panel-card { padding: 32px; }
        .panel-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .panel-title { font-size: 1.3rem; font-weight: 800; color: #FFFFFF; margin-bottom: 20px; }

        .table-responsive { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem; }
        th { padding: 12px 16px; border-bottom: 1px solid var(--border-color); color: var(--text-muted); font-family: var(--font-mono); font-size: 0.72rem; text-transform: uppercase; }
        td { padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); color: var(--text-primary); }
        .actions-cell { display: flex; gap: 8px; }
        .action-btn {
          width: 30px; height: 30px; border-radius: 4px; border: 1px solid var(--border-color);
          background: transparent; color: var(--text-secondary); display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: var(--transition-smooth);
        }
        .edit-action:hover { color: var(--accent-cyan); border-color: var(--accent-cyan); }
        .delete-action:hover { color: var(--accent-red); border-color: var(--accent-red); }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .form-group { margin-bottom: 20px; text-align: left; }
        .form-label { display: block; font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px; }
        .form-control {
          width: 100%; padding: 12px 16px; background: rgba(0,0,0,0.4);
          border: 1px solid var(--border-color); border-radius: var(--border-radius-sm);
          color: #FFFFFF; font-family: var(--font-sans); font-size: 0.92rem;
          transition: var(--transition-smooth);
        }
        .form-control:focus { border-color: var(--accent-red); outline: none; box-shadow: 0 0 10px var(--accent-red-glow); }
        textarea.form-control { min-height: 100px; resize: vertical; line-height: 1.5; }
        .form-actions { display: flex; gap: 12px; margin-top: 24px; }

        @media (max-width: 900px) {
          .admin-layout { grid-template-columns: 1fr; }
          .form-row { grid-template-columns: 1fr; gap: 0; }
          .admin-header { flex-direction: column; align-items: flex-start; gap: 16px; }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
