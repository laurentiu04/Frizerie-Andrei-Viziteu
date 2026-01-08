const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcrypt");

const Admin_ = require("./admin-model.js");
const Admin = Admin_(mongoose);

console.log(__dirname);

const app = express();

app.use(express.json());

app.post("/register-admin", async (req, res) => {
	const hashedPassword = await bcrypt.hash(req.body.password, 10);

	const admin_info = { user: req.body.user, password: hashedPassword };

	try {
		const newAdmin = new Admin(admin_info);
		console.log(req.body);
		const admin = await newAdmin.save();
		res.status(201).json(admin);
	} catch (err) {
		res.status(400).json({ msg: "Invalid data", error: err.message });
		console.log(err.message);
	}
});

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_ADMIN_URI);
		console.log("✅ MongoDB successfully connected to admin database!");
	} catch (err) {
		console.error("❌ MongoDB connection error:", err);
		// Exit process with failure code if connection fails
		process.exit(1);
	}
};

connectDB().then(() => {
	app.listen(2000, "0.0.0.0", () => {
		console.log(`Server listening on port: ${2000}`);
	});
});
