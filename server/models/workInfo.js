const mongoose = require("mongoose");

const workInfoSchema = new mongoose.Schema(
	{
		start_hour: {
			type: String,
		},

		end_hour: {
			type: String,
		},

		free_days: {
			type: Array,
		},

		services: {
			type: Array,
			name: { type: String },
			price: { type: Number },
			time: { type: Number },
		},
	},
	{ collection: "work_info" },
);

module.exports = mongoose.connection.useDb("work-info").model("WorkInfo", workInfoSchema);
