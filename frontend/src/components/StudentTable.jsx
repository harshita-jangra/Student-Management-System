import React from 'react';

// Beginner-friendly StudentTable Component
// This component receives "students" data from its parent component via "props"
function StudentTable(props) {
  const { students } = props;

  return (
    <div className="table-responsive">
      <table className="student-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Roll Number</th>
            <th>Email</th>
            <th>Course</th>
            <th>Semester</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {/* We loop through each student in the array using javascript .map() */}
          {students.map((student, index) => (
            <tr key={student._id || index}>
              <td>{index + 1}</td>
              <td className="student-name">{student.name}</td>
              <td>
                <span className="badge badge-roll">{student.rollNo}</span>
              </td>
              <td>{student.email}</td>
              <td>{student.course}</td>
              <td>
                <span className="badge badge-sem">{student.semester}</span>
              </td>
              <td>{student.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentTable;
