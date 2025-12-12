const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");

// GET /api/bookings (Read)
router.get("/", async (req, res) => {
	try {
		const day = req.query.day;
		const bookings = await Booking.find({ day: day });
		res.json(bookings);
	} catch (err) {
		res.status(500).send("Server Error");
	}
});

// POST /api/bookings (Create)
router.post("/", async (req, res) => {
	try {
		const newBooking = new Booking(req.body);
		console.log(req.body);
		const booking = await newBooking.save();
		res.status(201).json(booking);
	} catch (err) {
		res.status(400).json({ msg: "Invalid data", error: err.message });
	}
});

module.exports = router;
