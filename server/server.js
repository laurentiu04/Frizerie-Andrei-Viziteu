// server/server.js

// 1. Load environment variables immediately
require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");

// Import the router file you created
const bookingRoutes = require("./routes/bookingRoutes");

const app = express(); // Create express server

// >================> Passport init <===================

// // ===========> Connect main DB and start express server <============
const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("✅ MongoDB successfully connected!");
	} catch (err) {
		console.error("❌ MongoDB connection error:", err);
		// Exit process with failure code if connection fails
		process.exit(1);
	}
};

const PORT = process.env.PORT || 5000; // Get server PORT from .env or use fallback

// Connect to the DB first, then start the Express server
connectDB().then(() => {
	app.listen(PORT, () => {
		console.log(`Server listening on port:${PORT}`);
	});
});
// <=========================================================>

const Admin = require("./loginSystem/admin-model");

const passportInit = require("./loginSystem/passport-config");
passportInit(passport, Admin);

// >==================================================<

// >==============> Middleware <================<
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// >===========================================<

// // >===========> STATIC <==============<
app.use(express.static(path.join(__dirname, "dist")));
// >===================================<

// >===========> Session && passport <============<
app.use(flash());
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 24 * 60 * 60 * 1000, // Session lasts for 1 day
			secure: false, // Set to true if using HTTPS
		},
	}),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate("session"));
// >============================================<

// >==========> Handle login auth post <===============<

app.post("/api/login", (req, res, next) => {
	passport.authenticate("local", (err, user, info) => {
		if (err) return next(err);
		if (!user) return res.status(401).json({ message: info.message });

		req.logIn(user, (err) => {
			if (err) return next(err);
			// Instead of successRedirect, send a 200 OK
			return res.status(200).json({ message: "Login successful" });
		});
	})(req, res, next);
});

// >=================================================<

// >=============> Routes <=================<
app.use("/api/bookings", bookingRoutes);
// >========================================<

// ==== Prevent /admin acces if no login was made =====
app.get("/api/check-login", (req, res) => {
	res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");

	if (req.isAuthenticated()) {
		res.json({ authenticated: true, user: req.user });
	} else {
		res.json({ authenticated: false });
	}
});
// ======================================================
//
// // >===============> SPA Catch-All <================<
app.get(/.*/, (req, res) => {
	res.sendFile(path.join(__dirname, "dist", "index.html"));
});
// >================================================<
