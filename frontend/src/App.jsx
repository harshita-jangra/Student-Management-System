import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import ViewStudents from './pages/ViewStudents';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/view-students" element={<ViewStudents />} />
          <Route path="/all-students" element={<ViewStudents />} />
          <Route path="/students" element={<Students />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
