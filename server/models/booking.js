const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	phone: {
		type: String,
		required: true,
	},
	service: {
		name: { type: String },
		time: { type: Number },
		price: { type: Number },
	},
	details: {
		type: String,
		required: false,
	},
	day: {
		type: String,
		required: true,
		trim: true,
	},
	time: {
		type: String,
		required: true,
	},
	bookedAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Booking", bookingSchema);
