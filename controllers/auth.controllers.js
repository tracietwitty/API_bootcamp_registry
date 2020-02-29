const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User.model');

// @ desc           Register User
// @route           GET /api/v1/auth/register
// @access          Public
exports.register = asyncHandler(async (req, res, next) => {
	// Pull user input out and create the user:
	const { name, email, password, role } = req.body;
	const user = await User.create({
		name,
		email,
		password,
		role
	});

	// Create token:
	const token = user.getSignedToken;

	// Send the token in the response
	res.status(200).json({ success: true, token: token });
});
