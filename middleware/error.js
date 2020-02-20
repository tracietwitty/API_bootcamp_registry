const errorHandler = (err, req, res, next) => {
	// Log to console for developer happiness
	console.log(err.stack.blue);

	res.status(err.statusCode || 500).json({
		success: false,
		error: err.message || 'Server Error'
	});
};

module.exports = errorHandler;
