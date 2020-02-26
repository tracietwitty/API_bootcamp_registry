const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// replaced by morgan:
// const logger = require('./middleware/logger.middleware');
// app.use(logger);

// load env vars:
dotenv.config({ path: './config/config.env' });

// route files:
const bootcamps = require('./routes/bootcamps.routes');
const courses = require('./routes/courses.routes');

// connect to database:
connectDB();

const app = express();

// body parser:
app.use(express.json());

// use morgan to create dev logging middleware:
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// file uploading middleware:
app.use(fileupload());

// Set static folder to public:
app.use(express.static(path.join(__dirname, 'public')));

// mount routers for more readable endpoints in controllers file:
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use(errorHandler);

const PORT = process.env.PORT || 7000;

const server = app.listen(
	PORT,
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.bgGrey
	)
);

// Handle unhandled promise rejections:
process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: Unhandled Rejection ${err.message}`.red);
	// if this is the case, shut down the app and close the process:
	server.close(() => {
		process.exit(1);
	});
});
