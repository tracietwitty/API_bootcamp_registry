const express = require('express');
const {
	getBootcamp,
	getBootcamps,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	getBootcampsByRadius
} = require('../controllers/bootcamps.controllers');

// Router setup:
const router = express.Router();

router.route('/radius/:zipcode/:distance').get(getBootcampsByRadius);

router
	.route('/')
	.get(getBootcamps)
	.post(createBootcamp);

router
	.route('/:id')
	.get(getBootcamp)
	.put(updateBootcamp)
	.delete(deleteBootcamp);

module.exports = router;
