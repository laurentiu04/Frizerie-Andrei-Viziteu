const mongoose = require("mongoose");

const admin_info = new mongoose.Schema(
	{
		user: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{ collection: "admin-info" },
);

module.exports = mongoose.connection
	.useDb("admin-info")
	.model("Admin", admin_info);
