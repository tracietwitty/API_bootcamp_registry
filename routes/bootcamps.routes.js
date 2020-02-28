const express = require('express');
const {
	getBootcamp,
	getBootcamps,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	getBootcampsByRadius,
	bootcampPhotoUpload
} = require('../controllers/bootcamps.controllers');

const Bootcamp = require('../models/Bootcamp.model.js');

// Include other resource routers:
const courseRouter = require('./courses.routes');

// Router setup:
const router = express.Router();

// Advanced results middleware:
const advancedResults = require('../middleware/advancedResults');

// Re-route into other resource routers:
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsByRadius);

router.route('/:id/photo').put(bootcampPhotoUpload);

router
	.route('/')
	.get(advancedResults(Bootcamp, 'courses'), getBootcamps)
	.post(createBootcamp);

router
	.route('/:id')
	.get(getBootcamp)
	.put(updateBootcamp)
	.delete(deleteBootcamp);

module.exports = router;
