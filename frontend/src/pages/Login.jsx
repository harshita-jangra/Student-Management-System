import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

// Beginner-friendly Login Component
// Demonstrates form control and JWT token storage in localStorage
function Login() {
  const navigate = useNavigate();

  // 1. Form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // 2. Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // 3. Handle login submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const { email, password } = formData;

    // Client-side validation
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);

      // Send POST request to /api/auth/login
      const response = await api.post('/auth/login', {
        email,
        password
      });

      // Save token and user info to localStorage
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      setSuccessMessage('Login successful! Redirecting to Dashboard...');

      // Redirect to dashboard
      setTimeout(() => {
        navigate('/');
        // Trigger event so Navbar updates user status
        window.dispatchEvent(new Event('authChange'));
      }, 1000);
    } catch (error) {
      console.error('Login error:', error);
      const msg =
        error.response?.data?.message ||
        'Login failed. Please check your credentials and try again.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <h2>Log In</h2>
        <p className="subtitle">
          Sign in to access your student management dashboard.
        </p>

        {/* Success Alert */}
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="alert alert-error">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="student-form">
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="e.g. rahul@college.edu"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="auth-footer-text">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
