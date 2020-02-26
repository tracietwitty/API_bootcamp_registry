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

const Bootcamp = '../models/Bootcamp.model.js';

// Advanced results mw:
const advancedResults = require('../middleware/advancedResults');

// Include other resource routers:
const courseRouter = require('./courses.routes');

// Router setup:
const router = express.Router();

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
