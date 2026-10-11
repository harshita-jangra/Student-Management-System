
const express = require('express');
const router = express.Router();
const {
  getStudents,
  addStudent,
  deleteStudent
} = require('../controllers/studentController');

// GET /api/students - Get all students
router.get('/', getStudents);
const { addStudent, getStudents } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/students - Fetch all students
router.get('/', getStudents);

const {
  addStudent,
  getStudents
} = require('../controllers/studentController');

router.get('/', getStudents);
// POST /api/students - Add a new student (Protected: Requires login)
router.post('/', protect, addStudent);
const {addStudent,getStudents,updateStudent} = require('../controllers/studentController');


router.get('/', getStudents);


router.post('/', addStudent);

// DELETE /api/students/:id - Delete a student
router.delete('/:id', deleteStudent);

router.put('/:id', updateStudent);

module.exports = router;

