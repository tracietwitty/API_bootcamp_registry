const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
	title: {
		type: String,
		trim: true,
		required: [true, 'Please add a course title.']
	},
	description: {
		type: String,
		required: [true, 'Please add a course description']
	},
	weeks: {
		type: String,
		required: [true, 'Please add number of weeks']
	},
	tuition: {
		type: Number,
		required: [true, 'Please add tuition cost.']
	},
	minimumSkill: {
		type: String,
		required: [true, 'Please add minimum expected skill level upon entry.'],
		enum: ['beginner', 'intermediate', 'advanced']
	},
	scholarshipsAvailable: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	bootcamp: {
		type: mongoose.Schema.ObjectId,
		ref: 'Bootcamp',
		required: true
	}
});

module.exports = mongoose.model('Course', CourseSchema);
