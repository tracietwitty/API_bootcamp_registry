const advancedResults = (model, populate) => async (req, res, next) => {
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
	query = model.find(JSON.parse(queryString));

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
	const total = await model.countDocuments();

	query = query.skip(startIndex).limit(limit);

	if (populate) {
		query = query.populate(populate);
	}

	// Execute the query:
	const results = await query;

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

	res.advancedResults = {
		success: true,
		count: results.length,
		pagination,
		data: results
	};

	next();
};

module.exports = advancedResults;
