import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🎓 Student Management System
        </Link>
        <ul className="navbar-links">
          <li>
            <Link
              to="/"
              className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/view-students"
              className={
                location.pathname === '/view-students' || location.pathname === '/all-students'
                  ? 'nav-link active'
                  : 'nav-link'
              }
            >
              View Students
            </Link>
          </li>
          <li>
            <Link
              to="/students"
              className={location.pathname === '/students' ? 'nav-link active' : 'nav-link'}
            >
              Add Student
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
