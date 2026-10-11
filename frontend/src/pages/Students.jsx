import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import React, { useState, useEffect } from 'react';
import api from '../services/api';

const emptyForm = {
  name: '',
  rollNo: '',
  email: '',
  course: '',
  semester: '',
  phone: ''
};

function Students() {
  // Check if user is logged in
  const token = localStorage.getItem('token');

  // Form state for student details
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    email: '',
    course: '',
    semester: '',
    phone: ''
  });

  // State for list of students
  const [students, setStudents] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // State for submission feedback and loading indicator
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Fetch students from backend on mount
  const fetchStudents = async () => {
    try {
      setFetching(true);
      const response = await api.get('/students');
      setStudents(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setFetching(false);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Get students from the backend
  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      setStudents(response.data.data);
    } catch (err) {
      setError('Could not load students');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Update form fields on input change
  // Update form values when typing
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Open the form with existing student details
  const handleEdit = (student) => {
    setEditId(student._id);

    setFormData({
      name: student.name,
      rollNo: student.rollNo,
      email: student.email,
      course: student.course,
      semester: student.semester,
      phone: student.phone
    });

    setMessage('');
    setError('');
  };

  // Cancel editing
  const handleCancel = () => {
    setEditId(null);
    setFormData(emptyForm);
    setMessage('');
    setError('');
  };

  // Add or update a student
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure user is authenticated
    if (!token) {
      setStatusMessage({
        type: 'error',
        text: 'Access denied. Please log in before adding a student.'
      });
      return;
    }

    // Client-side validation: ensure no empty fields
    const { name, rollNo, email, course, semester, phone } = formData;
    if (!name || !rollNo || !email || !course || !semester || !phone) {
      setStatusMessage({
        type: 'error',
        text: 'Please fill in all the required fields.'
      });
      return;
    }
    setMessage('');
    setError('');


    try {
      setLoading(true);

      // Send POST request to backend API
      const response = await api.post('/students', formData);

      // Show success feedback
      setStatusMessage({
        type: 'success',
        text: response.data.message || 'Student added successfully!'
      });

      // Clear the form fields after successful submission
      setFormData({
        name: '',
        rollNo: '',
        email: '',
        course: '',
        semester: '',
        phone: ''
      });

      // Refresh list to show newly added student
      fetchStudents();
    } catch (error) {
      // Show backend error message (e.g. duplicate roll number or validation error)
      const errorMessage =
        error.response?.data?.message ||
        'Failed to connect to the server. Please ensure the backend is running.';

      setStatusMessage({
        type: 'error',
        text: errorMessage
      });
    } finally {
      setLoading(false);
      let response;

      if (editId) {
        // Update the selected student
        response = await api.put(
          `/students/${editId}`,
          formData
        );
      } else {
        // Add a new student
        response = await api.post('/students', formData);
      }

      setMessage(response.data.message);

      setFormData(emptyForm);
      setEditId(null);

      // Refresh the student list
      await fetchStudents();
    } catch (err) {
      setError(
        err.response?.data?.message || 'Something went wrong'
      );
    }
  };

  // Handle student deletion with confirmation
  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${name}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      const response = await api.delete(`/students/${id}`);

      // Update the displayed list only after successful deletion
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student._id !== id)
      );

      setStatusMessage({
        type: 'success',
        text: response.data?.message || 'Student deleted successfully!'
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        'Failed to delete the student. Please try again.';

      setStatusMessage({
        type: 'error',
        text: errorMessage
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <h2>{editId ? 'Edit Student' : 'Add New Student'}</h2>

        {/* Authentication Warning if not logged in */}
        {!token && (
          <div className="alert alert-error" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <span>🔒 <strong>Login Required:</strong> You must be logged in to add a student record.</span>
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
              Log In Now
            </Link>
          </div>
        )}

        {/* Success or error message notification */}
        {statusMessage.text && (
          <div className={`alert alert-${statusMessage.type}`}>
            {statusMessage.text}
          </div>
        {message && (
          <div className="alert alert-success">{message}</div>
        )}

        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="student-form">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading || !token}
              required
            />
          </div>

          <div className="form-group">
            <label>Roll Number *</label>
            <input
              name="rollNo"
              value={formData.rollNo}
              onChange={handleChange}
              disabled={loading || !token}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading || !token}
              required
            />
          </div>

          <div className="form-group">
            <label>Course *</label>
            <input
              name="course"
              value={formData.course}
              onChange={handleChange}
              disabled={loading || !token}
              required
            />
          </div>

          <div className="form-group">
            <label>Semester *</label>
            <input
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              disabled={loading || !token}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading || !token}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading || !token}>
            {loading ? 'Adding Student...' : !token ? '🔒 Please Log In to Submit' : 'Submit Student'}
          <button type="submit" className="btn btn-primary">
            {editId ? 'Update Student' : 'Add Student'}
          </button>

          {editId && (
            <button
              type="button"
              className="btn"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </form>

      </div>

      {/* Existing Students List */}
      <div className="card student-list-card">
        <h2>Existing Students</h2>
        <p className="subtitle">
          View all registered students or delete a record.
        </p>

        {fetching ? (
          <p className="status-text">Loading students...</p>
        ) : students.length === 0 ? (
          <div className="empty-state">
            <p>No student records found. Add a student using the form above.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="student-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Roll No</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Semester</th>
                  <th>Phone</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.name}</td>
                    <td>{student.rollNo}</td>
                    <td>{student.email}</td>
                    <td>{student.course}</td>
                    <td>{student.semester}</td>
                    <td>{student.phone}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(student._id, student.name)}
                        disabled={deletingId === student._id}
                      >
                        {deletingId === student._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      <div className="card" style={{ marginTop: '24px' }}>
        <h2>Student List</h2>

        {students.length === 0 ? (
          <p>No students found.</p>
        ) : (
          students.map((student) => (
            <div
              key={student._id}
              style={{
                borderBottom: '1px solid #ddd',
                padding: '16px 0'
              }}
            >
              <h3>{student.name}</h3>
              <p>Roll Number: {student.rollNo}</p>
              <p>Email: {student.email}</p>
              <p>Course: {student.course}</p>
              <p>Semester: {student.semester}</p>
              <p>Phone: {student.phone}</p>

              <button
                className="btn btn-primary"
                onClick={() => handleEdit(student)}
              >
                Edit
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Students;

