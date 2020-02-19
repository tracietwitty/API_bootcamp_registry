const Bootcamp = require('../models/Bootcamp.model');

// set up middleware functions:
// @ desc           GET all bootcamps
// @route           GET /api/v1/bootcamps
// @access          Public
exports.getBootcamps = (req, res, next) => {
	res.status(200).json({ success: true, msg: `This will show all bootcamps.` });
};

// @ desc           Get a specific bootcamp
// @route           GET /api/v1/bootcamps/:id
// @access          Public
exports.getBootcamp = (req, res, next) => {
	res.status(200).json({
		success: true,
		msg: `This will show Bootcamp #${req.params.id}`
	});
};

// @ desc           Create a new bootcamp
// @route           POST /api/v1/bootcamps
// @access          Private
exports.createBootcamp = async (req, res, next) => {
	const bootcamp = await Bootcamp.create(req.body);
	res.status(201).json({
		success: true,
		data: bootcamp
	});
};

// @ desc           Update a specific bootcamp
// @route           PUT /api/v1/bootcamps/:id
// @access          Private
exports.updateBootcamp = (req, res, next) => {
	res
		.status(200)
		.json({ success: true, msg: `Updated Bootcamp #${req.params.id}` });
};

// @ desc           Remove a specific bootcamp
// @route           DELETE /api/v1/bootcamps/:id
// @access          Private
exports.deleteBootcamp = (req, res, next) => {
	res
		.status(200)
		.json({ success: true, msg: `Deleted Bootcamp #${req.params.id}!` });
};
