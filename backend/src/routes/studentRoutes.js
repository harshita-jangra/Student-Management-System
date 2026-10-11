
const express = require('express');
const router = express.Router();
const { addStudent, getStudents } = require('../controllers/studentController');

// GET /api/students - Fetch all students
router.get('/', getStudents);

const {
  addStudent,
  getStudents
} = require('../controllers/studentController');

router.get('/', getStudents);
router.post('/', addStudent);

module.exports = router;

