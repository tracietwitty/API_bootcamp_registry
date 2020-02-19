const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');

// replaced by morgan:
// const logger = require('./middleware/logger.middleware');
// app.use(logger);

// route files:
const bootcamps = require('./routes/bootcamps.routes');

// load env vars:
dotenv.config({ path: './config/config.env' });

// connect to database:
connectDB();

const app = express();

// body parser:
app.use(express.json());

// use morgan to create dev logging middleware:
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// mount routers for more readable endpoints in controllers file:
app.use('/api/v1/bootcamps', bootcamps);

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
	// shut down the app and close the process in this case:
	server.close(() => {
		process.exit(1);
	});
});
