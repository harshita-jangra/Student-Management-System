
const mongoose = require('mongoose');
const Student = require('../models/Student');

// @desc    Get all students

// @desc    Get all students from database
// @route   GET /api/students
// @access  Public
const getStudents = async (req, res, next) => {
  try {
    // Find all students in MongoDB and sort them with newest first
    const students = await Student.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new student
// @route   POST /api/students
// @access  Public
const addStudent = async (req, res, next) => {
  try {
    const { name, rollNo, email, course, semester, phone } = req.body;

    // Validate required fields
   
    if (!name || !rollNo || !email || !course || !semester || !phone) {
      return res.status(400).json({
        success: false,
        message:
          'All fields (name, rollNo, email, course, semester, phone) are required'
      });
    }

    // Check whether the roll number already exists
    const existingStudent = await Student.findOne({
      rollNo: rollNo.trim()
    });

    
    const existingStudent = await Student.findOne({ rollNo: rollNo.trim() });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: `Student with roll number "${rollNo.trim()}" already exists`
      });
    }

    // Create the student
   
    const student = await Student.create({
      name: name.trim(),
      rollNo: rollNo.trim(),
      email: email.trim(),
      course: course.trim(),
      semester: semester.trim(),
      phone: phone.trim()
    });

    return res.status(201).json({
      success: true,
      message: 'Student added successfully',
      data: student
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all students
// @route   GET /api/students
// @access  Public
const getStudents = async (req, res, next) => {
  try {
    const students = await Student.find().sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: students.length,
// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Public
const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verify valid MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: `Student with id "${id}" not found`
      });
    }

    // Find and delete the student record
    const student = await Student.findByIdAndDelete(id);


const getStudents = async (req, res, next) => {
  try {
    const students = await Student.find();

    res.status(200).json({
      success: true,
      data: students
    });
  } catch (error) {
    next(error);
  }
};

// Export controller functions
const updateStudent = async (req, res, next) => {
  try {
    const { name, rollNo, email, course, semester, phone } = req.body;

   
    if (
      !name?.trim() ||
      !rollNo?.trim() ||
      !email?.trim() ||
      !course?.trim() ||
      !semester?.trim() ||
      !phone?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all fields'
      });
    }

    
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student with id "${id}" not found`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
        message: 'Student not found'
      });
    }

   
    const existingStudent = await Student.findOne({
      rollNo: rollNo.trim(),
      _id: { $ne: student._id }
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'This roll number already exists'
      });
    }

    // Update student details
    student.name = name.trim();
    student.rollNo = rollNo.trim();
    student.email = email.trim();
    student.course = course.trim();
    student.semester = semester.trim();
    student.phone = phone.trim();

    await student.save();

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addStudent,
  getStudents
  getStudents,
  addStudent,
  deleteStudent
  addStudent,
  getStudents,
  updateStudent
};


  getStudents,
  addStudent
};

