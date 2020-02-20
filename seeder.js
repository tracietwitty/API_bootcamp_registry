const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');
const asyncHandler = require('./middleware/async');

// load env variables:
dotenv.config({ path: './config/config.env' });

// load models:
const Bootcamp = require('./models/Bootcamp.model');

// connect to db:
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true
});

// read JSON files:
const bootcamps = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

// import into db:
const importData = asyncHandler(async () => {
	await Bootcamp.create(bootcamps);
	console.log('Data Imported'.green.inverse);
	process.exit();
});

// delete data:
const deleteData = asyncHandler(async () => {
	await Bootcamp.deleteMany();
	console.log('Data Deleted'.red.inverse);
	process.exit();
});

if (process.argv[2] === '-i') {
	importData();
} else if (process.argv[2] === '-d') {
	deleteData();
}
