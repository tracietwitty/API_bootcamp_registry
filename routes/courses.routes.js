const express = require('express');
const { getCourses } = require('../controllers/courses.controllers');

// Router setup:
const router = express.Router({ mergeParams: true });

router.route('/').get(getCourses);
module.exports = router;
