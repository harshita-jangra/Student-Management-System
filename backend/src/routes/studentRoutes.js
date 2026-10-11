
const express = require('express');
const router = express.Router();

const {
  addStudent,
  getStudents
} = require('../controllers/studentController');

router.get('/', getStudents);
router.post('/', addStudent);

module.exports = router;
