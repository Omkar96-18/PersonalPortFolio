import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, AlertCircle, Key } from 'lucide-react';
import { api } from '../services/api';

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
      navigate('/admin/dashboard');
    } catch (err) {
      console.error("Login failed", err);
      setError("Invalid username or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page container section">
      <div className="login-card glass-panel">
        <div className="login-header">
          <div className="icon-wrapper">
            <Key size={24} />
          </div>
          <h2>Admin Authentication</h2>
          <p>Sign in to edit your profile, skills, projects, and blogs.</p>
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
                placeholder="Enter username"
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
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary login-btn"
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>

      <style>{`
        .login-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 80vh;
          padding-top: 120px;
        }
        .login-card {
          width: 100%;
          max-width: 420px;
          padding: 40px;
          text-align: left;
        }
        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }
        .icon-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(139, 92, 246, 0.1);
          color: var(--accent-primary);
          margin-bottom: 16px;
          border: 1px solid rgba(139, 92, 246, 0.2);
        }
        .login-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .login-header p {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        .login-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #ef4444;
          padding: 12px 16px;
          border-radius: var(--border-radius-sm);
          font-size: 0.9rem;
          margin-bottom: 24px;
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
          margin-top: 10px;
          padding: 14px;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
