// @desc        sets up middleware that shows the method and the url that was hit

// This was replaced when morgan was installed:
const logger = (req, res, next) => {
	console.log(
		`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`
	);
	next();
};

module.exports = logger;
