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

// Static method setup to get the average cost of course tuitions:
CourseSchema.statics.getAverageCost = async function(bootcampId) {
	// set up aggregation:
	const obj = await this.aggregate([
		{
			$match: { bootcamp: bootcampId }
		},
		{
			$group: {
				_id: '$bootcamp',
				averageCost: { $avg: '$tuition' }
			}
		}
	]);

	try {
		// grab the bootcamp model, update avg cost when a course is added/deleted
		await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
			// decimals are bad.
			averageCost: Math.ceil(obj[0].averageCost / 10) * 10
		});
	} catch (err) {
		console.log(err);
	}
	// check your work:
	// console.log(obj);
};

// Call getAverageCost after save:
CourseSchema.post('save', function() {
	this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost before remove:
CourseSchema.pre('remove', function() {
	this.constructor.getAverageCost(this.bootcamp);
});
module.exports = mongoose.model('Course', CourseSchema);
