export const API_BASE_URL = import.meta.env.VITE_API_URL || "https://personalportfolio-1u0r.onrender.com/api";
export const API_SERVER_URL = API_BASE_URL.replace(/\/api\/?$/, "");

export const normalizeMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('/media/')) {
    return `${API_SERVER_URL}${url}`;
  }
  if (url.includes('127.0.0.1:8000') || url.includes('localhost:8000')) {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocalhost) {
      return url.replace(/http:\/\/(127\.0\.0\.1|localhost):8000/, API_SERVER_URL);
    }
  }
  if (window.location.protocol === 'https:' && url.startsWith('http://') && !url.includes('localhost') && !url.includes('127.0.0.1')) {
    return url.replace('http://', 'https://');
  }
  return url;
};

const getHeaders = () => {
  const headers = {
    "Content-Type": "application/json",
  };
  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Token ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMsg = "Something went wrong";
    try {
      const errorData = await response.json();
      errorMsg = errorData.error || errorData.detail || JSON.stringify(errorData);
    } catch (e) {
      errorMsg = response.statusText;
    }
    throw new Error(errorMsg);
  }
  if (response.status === 204) return null;
  return response.json();
};

export const api = {
  // Auth
  login: async (username, password) => {
    const res = await fetch(`${API_BASE_URL}/token-auth/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await handleResponse(res);
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  getCurrentUser: async () => {
    const res = await fetch(`${API_BASE_URL}/me/`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  // Contact & SMTP Email
  sendContactMessage: async (data) => {
    const res = await fetch(`${API_BASE_URL}/contact/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  getContactMessages: async () => {
    const res = await fetch(`${API_BASE_URL}/messages/`, {
      headers: getHeaders(),
    });
    const data = await handleResponse(res);
    return Array.isArray(data) ? data : (data.results || []);
  },

  // Profile / Bio
  getProfile: async () => {
    const res = await fetch(`${API_BASE_URL}/profiles/`);
    const data = await handleResponse(res);
    const profiles = Array.isArray(data) ? data : (data.results || []);
    return profiles && profiles.length > 0 ? profiles[0] : null;
  },

  createProfile: async (data) => {
    const res = await fetch(`${API_BASE_URL}/profiles/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  updateProfile: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/profiles/${id}/`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  uploadResume: async (formData) => {
    const token = localStorage.getItem("token");
    const headers = {};
    if (token) {
      headers["Authorization"] = `Token ${token}`;
    }
    const res = await fetch(`${API_BASE_URL}/upload-resume/`, {
      method: "POST",
      headers,
      body: formData,
    });
    return handleResponse(res);
  },

  uploadFavicon: async (formData) => {
    const token = localStorage.getItem("token");
    const headers = {};
    if (token) {
      headers["Authorization"] = `Token ${token}`;
    }
    const res = await fetch(`${API_BASE_URL}/upload-favicon/`, {
      method: "POST",
      headers,
      body: formData,
    });
    return handleResponse(res);
  },

  // Skills
  getSkills: async () => {
    const res = await fetch(`${API_BASE_URL}/skills/`);
    const data = await handleResponse(res);
    return Array.isArray(data) ? data : (data.results || []);
  },

  createSkill: async (data) => {
    const res = await fetch(`${API_BASE_URL}/skills/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  updateSkill: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/skills/${id}/`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  deleteSkill: async (id) => {
    const res = await fetch(`${API_BASE_URL}/skills/${id}/`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Projects
  getProjects: async () => {
    const res = await fetch(`${API_BASE_URL}/projects/`);
    const data = await handleResponse(res);
    return Array.isArray(data) ? data : (data.results || []);
  },

  getProject: async (slugOrId) => {
    const res = await fetch(`${API_BASE_URL}/projects/${slugOrId}/`);
    return handleResponse(res);
  },

  createProject: async (data) => {
    const res = await fetch(`${API_BASE_URL}/projects/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  updateProject: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/projects/${id}/`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  deleteProject: async (id) => {
    const res = await fetch(`${API_BASE_URL}/projects/${id}/`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Blogs
  getBlogs: async () => {
    const res = await fetch(`${API_BASE_URL}/blogs/`, {
      headers: getHeaders(),
    });
    const data = await handleResponse(res);
    return Array.isArray(data) ? data : (data.results || []);
  },

  getBlog: async (slugOrId) => {
    const res = await fetch(`${API_BASE_URL}/blogs/${slugOrId}/`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  createBlog: async (data) => {
    const res = await fetch(`${API_BASE_URL}/blogs/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  updateBlog: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/blogs/${id}/`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  deleteBlog: async (id) => {
    const res = await fetch(`${API_BASE_URL}/blogs/${id}/`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Experience
  getExperiences: async () => {
    const res = await fetch(`${API_BASE_URL}/experiences/`);
    const data = await handleResponse(res);
    return Array.isArray(data) ? data : (data.results || []);
  },

  createExperience: async (data) => {
    const res = await fetch(`${API_BASE_URL}/experiences/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  updateExperience: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/experiences/${id}/`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  deleteExperience: async (id) => {
    const res = await fetch(`${API_BASE_URL}/experiences/${id}/`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Terminal Commands
  getTerminalCommands: async () => {
    const res = await fetch(`${API_BASE_URL}/terminal-commands/`);
    const data = await handleResponse(res);
    return Array.isArray(data) ? data : (data.results || []);
  },

  createTerminalCommand: async (data) => {
    const res = await fetch(`${API_BASE_URL}/terminal-commands/`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  updateTerminalCommand: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/terminal-commands/${id}/`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  deleteTerminalCommand: async (id) => {
    const res = await fetch(`${API_BASE_URL}/terminal-commands/${id}/`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};
