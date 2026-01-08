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

module.exports = (connection) => connection.model("Admin", admin_info);
