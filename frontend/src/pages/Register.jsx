import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

// Beginner-friendly Register Component
// Demonstrates useState for managing form inputs and handling submission
function Register() {
  const navigate = useNavigate();

  // 1. Form state using React useState
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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

  // 3. Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const { name, email, password, confirmPassword } = formData;

    // Client-side validation: Check empty fields
    if (!name || !email || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    // Client-side validation: Password length
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    // Client-side validation: Password match
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    try {
      setLoading(true);

      // Send POST request to /api/auth/register
      const response = await api.post('/auth/register', {
        name,
        email,
        password
      });

      // Save token and user info to localStorage
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      setSuccessMessage('Registration successful! Redirecting to Dashboard...');

      // Redirect user to dashboard after 1 second
      setTimeout(() => {
        navigate('/');
        // Trigger a custom event or window reload so Navbar updates
        window.dispatchEvent(new Event('authChange'));
      }, 1000);
    } catch (error) {
      console.error('Registration error:', error);
      const msg =
        error.response?.data?.message ||
        'Registration failed. Please verify the backend is running.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <h2>Create an Account</h2>
        <p className="subtitle">
          Register to access and manage students in the system.
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
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="e.g. Rahul Sharma"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

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
            <label htmlFor="password">Password (min 6 characters) *</label>
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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
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
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
