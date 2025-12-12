// server/server.js

// 1. Load environment variables immediately
require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Import the router file you created
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

// ==========================================================
// 2. MIDDLEWARE SETUP
// ==========================================================

// Allows the server to accept JSON data in the request body
app.use(express.json());

// Allows requests from your React frontend (crucial for local development)
app.use(cors());

app.use(express.static(path.join(__dirname, "dist")));

// ==========================================================
// 3. ROUTE INTEGRATION
// ==========================================================

// app.get("*", (req, res) => {
// 	// Verifică dacă cererea este pentru o rută API. Dacă nu, trimite index.html.
// 	if (!req.url.startsWith("/api")) {
// 		// Ajustează prefixul API-ului tău
// 		res.sendFile(path.join(__dirname, "dist", "index.html"));
// 	}
// });

// Integrate the booking routes, prefixing all endpoints with /api/bookings
app.use("/api/bookings", bookingRoutes);

// ==========================================================
// 4. DATABASE CONNECTION & SERVER START
// ==========================================================

// Define the database connection function
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

const PORT = process.env.PORT || 5000;

// Connect to the DB first, then start the Express server
connectDB().then(() => {
	app.listen(PORT, () => {
		console.log(`Server listening on port:${PORT}`);
	});
});
