const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const path = require("path");

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
		const { _id, day, time, service } = req.body;
		const updateData = { ...req.body };
		delete updateData._id;

		// 1. Convertim ora noii programări în minute pentru calcul
		const toMin = (timeStr) => {
			const [h, m] = timeStr.split(":").map(Number);
			return h * 60 + m;
		};

		const newStart = toMin(time);
		const newEnd = newStart + service.time;

		// 2. Căutăm programările existente în aceeași zi
		// Dacă edităm (_id există), excludem programarea curentă din căutare ca să nu se bată singură cap în cap
		const query = { day: day };
		if (_id) {
			query._id = { $ne: _id };
		}

		const existingBookings = await Booking.find(query);

		// 3. Verificăm suprapunerea
		const isOverlapping = existingBookings.some((booking) => {
			const bStart = toMin(booking.time);
			const bEnd = bStart + booking.service.time;

			return newStart < bEnd && newEnd > bStart;
		});

		if (isOverlapping) {
			return res.status(400).json({
				msg: "Intervalul orar este deja ocupat. Te rugăm să alegi altă oră.",
			});
		}

		// 4. Dacă nu sunt suprapuneri, mergem mai departe cu Upsert-ul original
		if (_id) {
			const updatedBooking = await Booking.findOneAndUpdate(
				{ _id: _id },
				{ $set: updateData },
				{ new: true, runValidators: true },
			);

			if (updatedBooking) {
				return res.status(200).json(updatedBooking);
			}
		}

		const newBooking = new Booking(req.body);
		const booking = await newBooking.save();
		res.status(201).json(booking);
	} catch (err) {
		console.error("Eroare server:", err);
		res.status(400).json({ msg: "Date invalide", error: err.message });
	}
});

// Ruta pentru ștergerea unei programări după ID
router.delete("/:id", async (req, res) => {
	try {
		const id = req.params.id;

		// Căutăm și ștergem documentul
		const deletedBooking = await Booking.findByIdAndDelete(id);

		if (!deletedBooking) {
			return res.status(404).json({ msg: "Programarea nu a fost găsită." });
		}

		res
			.status(200)
			.json({ msg: "Programarea a fost ștearsă cu succes!", deletedBooking });
	} catch (err) {
		res.status(500).json({ msg: "Eroare la ștergere", error: err.message });
	}
});

module.exports = router;
