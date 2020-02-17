const express = require('express');
const dotenv = require('dotenv');

// route files
const bootcamps = require('./routes/bootcamps.routes');
// load env vars
dotenv.config({ path: './config/config.env' });

const app = express();

// mount routers
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 7000;

app.listen(
	PORT,
	console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
