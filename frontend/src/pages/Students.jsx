
import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Students() {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    email: '',
    course: '',
    semester: '',
    phone: ''
  });

  // Student records and filters
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');

  // Submission feedback and loading
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({
    type: '',
    text: ''
  });

  // Update form fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Fetch students from the backend
  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      setStudents(response.data.data || []);
    } catch (error) {
      setStatusMessage({
        type: 'error',
        text: 'Failed to load students. Please check the backend.'
      });
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Get unique courses and semesters for dropdowns
  const courses = [
    ...new Set(
      students.map((student) => student.course).filter(Boolean)
    )
  ];

  const semesters = [
    ...new Set(
      students.map((student) => student.semester).filter(Boolean)
    )
  ];

  // Search and filter student records
  const filteredStudents = students.filter((student) => {
    const query = searchQuery.trim().toLowerCase();

    const matchesSearch =
      (student.name || '').toLowerCase().includes(query) ||
      (student.rollNo || '').toLowerCase().includes(query) ||
      (student.email || '').toLowerCase().includes(query);

    const matchesCourse =
      !courseFilter || student.course === courseFilter;

    const matchesSemester =
      !semesterFilter || student.semester === semesterFilter;

    return matchesSearch && matchesCourse && matchesSemester;
  });

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setCourseFilter('');
    setSemesterFilter('');
  };

  // Submit the new student form
  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatusMessage({ type: '', text: '' });

    const { name, rollNo, email, course, semester, phone } = formData;

    if (!name || !rollNo || !email || !course || !semester || !phone) {
      setStatusMessage({
        type: 'error',
        text: 'Please fill in all the required fields.'
      });
      return;
    }

    try {
      setLoading(true);

      const response = await api.post('/students', formData);

      setStatusMessage({
        type: 'success',
        text: response.data.message || 'Student added successfully!'
      });

      // Clear the form
      setFormData({
        name: '',
        rollNo: '',
        email: '',
        course: '',
        semester: '',
        phone: ''
      });

      // Refresh the student list
      await fetchStudents();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        'Failed to connect to the server. Please ensure the backend is running.';

      setStatusMessage({
        type: 'error',
        text: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      {/* Add Student Form */}
      <div className="card">
        <h2>Add New Student</h2>

        <p className="subtitle">
          Enter student information below to add a new record to MongoDB.
        </p>

        {statusMessage.text && (
          <div className={`alert alert-${statusMessage.type}`}>
            {statusMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="student-form">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="rollNo">Roll Number *</label>
            <input
              type="text"
              id="rollNo"
              name="rollNo"
              placeholder="e.g. 21CS001"
              value={formData.rollNo}
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
              placeholder="e.g. john@college.edu"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="course">Course *</label>
            <input
              type="text"
              id="course"
              name="course"
              placeholder="e.g. B.Tech CSE"
              value={formData.course}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="semester">Semester *</label>
            <input
              type="text"
              id="semester"
              name="semester"
              placeholder="e.g. 6th"
              value={formData.semester}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="e.g. 9876543210"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Adding Student...' : 'Submit Student'}
          </button>
        </form>
      </div>

      {/* Student Records, Search and Filters */}
      <div className="card">
        <h2>Student Records</h2>

        <p className="subtitle">
          Search by name, roll number, or email. Filter by course or semester.
        </p>

        <div className="student-filters">
          <input
            type="text"
            placeholder="Search name, roll number, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search students"
          />

          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            aria-label="Filter by course"
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>

          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            aria-label="Filter by semester"
          >
            <option value="">All Semesters</option>
            {semesters.map((semester) => (
              <option key={semester} value={semester}>
                {semester}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="btn btn-primary"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>

        <p>
          Showing {filteredStudents.length} of {students.length} students
        </p>

        {filteredStudents.length === 0 ? (
          <p>
            {students.length === 0
              ? 'No students found. Add a student using the form above.'
              : 'No students match your search or filters.'}
          </p>
        ) : (
          <div className="student-list">
            {filteredStudents.map((student) => (
              <div
                className="student-record"
                key={student._id || student.rollNo}
              >
                <h3>{student.name}</h3>
                <p><strong>Roll Number:</strong> {student.rollNo}</p>
                <p><strong>Email:</strong> {student.email}</p>
                <p><strong>Course:</strong> {student.course}</p>
                <p><strong>Semester:</strong> {student.semester}</p>
                <p><strong>Phone:</strong> {student.phone || 'Not provided'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Students;
