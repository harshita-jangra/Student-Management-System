import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import StudentTable from '../components/StudentTable';

// Beginner-friendly ViewStudents Page Component
// Uses useState for state management and useEffect to fetch student records
function ViewStudents() {
  // 1. Define states using React useState hook
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // 2. Function to fetch all students from the backend GET /api/students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      // Send GET request to backend API
      const response = await api.get('/students');

      // Update students state with the data from the server
      if (response.data && response.data.data) {
        setStudents(response.data.data);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      const msg =
        error.response?.data?.message ||
        'Failed to connect to the server. Please make sure the backend is running.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // 3. useEffect hook runs automatically once when the page loads
  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="page-container page-container-wide">
      <div className="card">
        {/* Header section with title and quick actions */}
        <div className="page-header-row">
          <div>
            <h2>All Registered Students</h2>
            <p className="subtitle">
              View and verify all registered student records from the database.
            </p>
          </div>
          <div className="header-actions">
            <button
              onClick={fetchStudents}
              className="btn btn-secondary"
              disabled={loading}
            >
              🔄 Refresh
            </button>
            <Link to="/students" className="btn btn-primary">
              + Add Student
            </Link>
          </div>
        </div>

        {/* 1. Loading State */}
        {loading && (
          <div className="state-box loading-box">
            <div className="spinner"></div>
            <p>Loading students from database, please wait...</p>
          </div>
        )}

        {/* 2. Error State */}
        {!loading && errorMessage && (
          <div className="alert alert-error">
            <p><strong>Error:</strong> {errorMessage}</p>
            <button
              onClick={fetchStudents}
              className="btn btn-retry"
              style={{ marginTop: '0.75rem' }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* 3. Empty State (No students found) */}
        {!loading && !errorMessage && students.length === 0 && (
          <div className="state-box empty-box">
            <div className="empty-icon">📂</div>
            <h3>No Students Found</h3>
            <p>There are currently no student records in the database.</p>
            <Link to="/students" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Add Your First Student
            </Link>
          </div>
        )}

        {/* 4. Success State: Display Students Table */}
        {!loading && !errorMessage && students.length > 0 && (
          <div>
            <div className="table-summary-bar">
              <span>Total Students: <strong>{students.length}</strong></span>
            </div>
            {/* Pass students data down to StudentTable component via props */}
            <StudentTable students={students} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewStudents;
