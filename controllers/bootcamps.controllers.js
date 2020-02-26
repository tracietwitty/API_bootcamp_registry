const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp.model');

// set up middleware functions:
// @ desc           GET all bootcamps
// @route           GET /api/v1/bootcamps
// @access          Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
	let query;

	const requestQueryCopy = { ...req.query };

	let queryString = JSON.stringify(requestQueryCopy);

	// Set up fields to exclude:
	const removeFields = ['select', 'sort', 'page', 'limit'];

	// Loop over removeFields and delete from requestQueryCopy:
	removeFields.forEach(param => delete requestQueryCopy[param]);

	// Checkpoint:
	// console.log(requestQueryCopy)

	// Create operators like $gt (greater than), $lte (less than/equal to):
	queryString = queryString.replace(
		/\b(gt|gte|lt|lte|in)\b/g,
		match => `$${match}`
	);

	// Find resource:
	query = Bootcamp.find(JSON.parse(queryString)).populate('courses');

	// Select specific fields:
	if (req.query.select) {
		const fields = req.query.select.split(',').join(' ');
		query = query.select(fields);
	}

	// Sort by query or by date as default:
	if (req.query.sort) {
		const sortBy = req.query.sort.split(',').join(' ');
		query = query.sort(sortBy);
	} else {
		query = query.sort('-createdAt');
	}

	// Set up pagination with page 1 and 25 results showing per page as default:
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 25;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const total = await Bootcamp.countDocuments();

	query = query.skip(startIndex).limit(limit);

	const bootcamps = await query;

	// Pagination result:
	const pagination = {};
	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit
		};
	}
	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1,
			limit
		};
	}

	res.status(200).json({
		success: true,
		count: bootcamps.length,
		pagination,
		data: bootcamps
	});
});

// @ desc           Get a specific bootcamp
// @route           GET /api/v1/bootcamps/:id
// @access          Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);

	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}

	res.status(200).json({ success: true, data: bootcamp });
});

// @ desc           Create a new bootcamp
// @route           POST /api/v1/bootcamps
// @access          Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.create(req.body);

	res.status(201).json({
		success: true,
		data: bootcamp
	});
});

// @ desc           Update a specific bootcamp
// @route           PUT /api/v1/bootcamps/:id
// @access          Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	});

	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}

	res.status(200).json({ success: true, data: bootcamp });
});

// @desc            Remove a specific bootcamp
// @route           DELETE /api/v1/bootcamps/:id
// @access          Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);

	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}

	bootcamp.remove();

	res.status(200).json({ success: true, data: {} });
});

// @desc            Get bootcamps within a certain radius
// @route           GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access          Private
exports.getBootcampsByRadius = asyncHandler(async (req, res, next) => {
	const { zipcode, distance } = req.params;

	// Get lat & long from geocoder:
	const loc = await geocoder.geocode(zipcode);
	const lat = loc[0].latitude;
	const long = loc[0].longitude;

	// Calc radius using radians
	// BIG MATH BRAIN TIME = divide distance by radius of Earth (3,963 miles/6,378 km)
	const radius = distance / 3963;

	const bootcamps = await Bootcamp.find({
		location: { $geoWithin: { $centerSphere: [[long, lat], radius] } }
	});

	res.status(200).json({
		success: true,
		count: bootcamps.length,
		data: bootcamps
	});
});

// @desc            Upload photo for bootcamp
// @route           PUT /api/v1/bootcamps/:id/photo
// @access          Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);

	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}

	if (!req.files) {
		return next(new ErrorResponse(`Please upload a file`, 400));
	}

	const file = req.files.file;

	// Make sure the image is actually a photo:
	if (!file.mimetype.startsWith('image')) {
		return next(new ErrorResponse(`Please upload a jpg file`, 400));
	}

	// Check the file size:
	if (file.size > process.env.MAX_FILE_UPLOAD) {
		return next(new ErrorResponse(`Please upload a smaller jpg image`, 400));
	}

	// Create custom filename and save it to photo:
	file.name = `photo_${bootcamp.slug}${path.parse(file.name).ext}`;
	file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
		if (err) {
			console.error(err);
			return next(new ErrorResponse(`Issue with file upload`, 500));
		}

		await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

		res.status(200).json({
			success: true,
			data: file.name
		});
	});
});
