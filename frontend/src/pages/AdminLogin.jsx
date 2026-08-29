import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, AlertCircle, Key, ArrowLeft, ShieldCheck, Server } from 'lucide-react';
import { api, API_BASE_URL } from '../services/api';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (api.isAuthenticated()) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.login(username, password);
      // Success: redirect to dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      console.error("Login failed", err);
      setError("Invalid username or password. Please verify your Django superuser credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page container section">
      <div className="login-card glass-panel">
        <Link to="/" className="back-link">
          <ArrowLeft size={15} /> Return to Portfolio
        </Link>

        <div className="login-header">
          <div className="icon-wrapper">
            <ShieldCheck size={26} className="accent-red-icon" />
          </div>
          <h2>Admin Authentication</h2>
          <p>Sign in to edit your profile, skills, projects, resume, and technical articles.</p>
        </div>

        {error && (
          <div className="login-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input 
                type="text" 
                className="form-control" 
                required 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter superuser username"
                autoComplete="username"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                className="form-control" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary login-btn"
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Access Control Matrix"}
          </button>
        </form>

        <div className="login-footer-info">
          <span className="api-endpoint-badge">
            <Server size={12} /> Target API: {API_BASE_URL}
          </span>
          <p className="hint-text">
            To create or reset credentials, run: <code>python manage.py createsuperuser</code>
          </p>
        </div>
      </div>

      <style>{`
        .login-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 85vh;
          padding-top: 100px;
        }
        .login-card {
          width: 100%;
          max-width: 440px;
          padding: 36px 32px;
          text-align: left;
          border: 1px solid rgba(246, 36, 64, 0.25);
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.9);
          position: relative;
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 0.76rem;
          color: var(--text-muted);
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          transition: var(--transition-smooth);
        }
        .back-link:hover {
          color: var(--accent-red);
        }
        .login-header {
          text-align: center;
          margin-bottom: 26px;
        }
        .icon-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: rgba(128, 10, 28, 0.2);
          border: 1px solid rgba(246, 36, 64, 0.35);
          color: var(--accent-red);
          margin-bottom: 14px;
          box-shadow: 0 0 20px rgba(246, 36, 64, 0.2);
        }
        .login-header h2 {
          font-family: var(--font-sans);
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 8px;
          color: var(--text-primary);
        }
        .login-header p {
          color: var(--text-secondary);
          font-size: 0.86rem;
          line-height: 1.5;
        }
        .login-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(246, 36, 64, 0.12);
          border: 1px solid rgba(246, 36, 64, 0.35);
          color: var(--accent-red);
          padding: 12px 14px;
          border-radius: var(--border-radius-sm);
          font-size: 0.85rem;
          margin-bottom: 22px;
          font-weight: 500;
        }
        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
        }
        .input-with-icon .form-control {
          padding-left: 44px;
        }
        .login-btn {
          width: 100%;
          justify-content: center;
          margin-top: 14px;
          padding: 13px;
          font-weight: 700;
        }
        .login-footer-info {
          margin-top: 24px;
          padding-top: 18px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          flex-direction: column;
          gap: 8px;
          text-align: center;
        }
        .api-endpoint-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--text-muted);
          background: rgba(255, 255, 255, 0.03);
          padding: 4px 10px;
          border-radius: 4px;
          word-break: break-all;
        }
        .hint-text {
          font-size: 0.74rem;
          color: var(--text-muted);
          margin: 0;
        }
        .hint-text code {
          background: rgba(246, 36, 64, 0.1);
          color: var(--accent-red);
          padding: 2px 6px;
          border-radius: 3px;
          font-family: var(--font-mono);
          font-size: 0.72rem;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
