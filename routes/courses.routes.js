const express = require('express');
const {
	getCourses,
	getCourse,
	addCourse,
	updateCourse,
	deleteCourse
} = require('../controllers/courses.controllers');

const Course = require('../models/Course.model');
const advancedResults = require('../middleware/advancedResults');

// Router setup:
const router = express.Router({ mergeParams: true });

router
	.route('/')
	.get(
		advancedResults(Course, {
			path: 'bootcamp',
			select: 'name description'
		}),
		getCourses
	)
	.post(addCourse);
router
	.route('/:id')
	.get(getCourse)
	.put(updateCourse)
	.delete(deleteCourse);

module.exports = router;
