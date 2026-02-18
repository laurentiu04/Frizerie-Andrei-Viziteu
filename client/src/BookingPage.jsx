import { useEffect, useState } from "react";
import Select from "./Select";
import Navbar from "./Navbar";
import "./bookingPage.css";

// >===============> IMAGE IMPORT <================<
import classic_cut_img from "./assets/classic-cut.svg";
import modern_cut_img from "./assets/modern-cut.svg";
import beard_cut_img from "./assets/beard-cut.svg";
import beard_and_hair_img from "./assets/beard_and_hair.svg";
import barber_img from "./assets/barber_img.png";
import calendar_img from "./assets/calendar.png";
import clock_img from "./assets/clock.png";
import info_img from "./assets/info.png";
// <===============================================>

import { useNavigate } from "react-router";
import axios from "axios";

function BookingPage() {
	const navigate = useNavigate();

	const [_name, setName] = useState("");
	const [_phone, setPhone] = useState("");
	const [_details, setDetails] = useState("");
	const [selectedService, setService] = useState(0);
	const [warning, setWarning] = useState("");
	const [submitted, setSubmit] = useState(false);

	const [services, setServicesData] = useState([]);

	// >============== TIME AND DATE SELECTION SETUP <=====================<

	const [selectedTime, setTime] = useState("");
	const [selectedDay, setDay] = useState("");
	const [dayOps, setDayOps] = useState(null);
	const [timeOptions, setTimeOptions] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			const dbData = (await axios.get("/api/work-info/")).data;

			setServicesData(dbData.services);

			const dateOptions = {
				month: "short",
				day: "numeric",
				weekday: "long",
			};

			const freeDays = dbData.free_days;
			const dayOptions = [];

			for (var i = 0; i < 31; i++) {
				const fullDate = new Date(
					new Date().getTime() + i * (1000 * 60 * 60 * 24),
				).toLocaleDateString("ro-RO", dateOptions);
				const date = fullDate.split(",")[1].replace(".", "").replace(" ", "");
				const weekday = fullDate.split(",")[0];

				if (weekday == "duminică") continue;
				if (
					freeDays != undefined &&
					(freeDays.includes(date) ||
						freeDays.includes(date + " " + new Date().getFullYear().toString()))
				)
					continue;

				// console.log(date.substring(1, 7), date.length, freeDays[2].length);

				dayOptions.push({
					value: date,
					label: (
						<>
							<p>{date}</p> <p className="subtitle">{weekday}</p>
						</>
					),
				});
			}
			setDayOps(dayOptions);
		};

		fetchData();
	}, []);
	// console.log(dayOptions) // FOR DEBUG

	// <================================================================>

	// ~~~~ Scroll into view selected date option ~~~~

	useEffect(() => {
		const selectedElement =
			document.getElementsByClassName("option selected")[0];

		if (selectedElement)
			selectedElement.scrollIntoView({
				behavior: "smooth",
				inline: "center",
			});
	}, [selectedDay.value]);

	// ~~~~ Scroll into view selected time option ~~~~

	useEffect(() => {
		const selectedElement =
			document.getElementsByClassName("option selected")[1];

		if (selectedElement)
			selectedElement.scrollIntoView({
				behavior: "smooth",
				inline: "center",
			});
	}, [selectedTime.value]);

	useEffect(() => {
		const getTimeIntervals = async () => {
			const dbData = (await axios.get("/api/work-info")).data;
			const openHour = parseInt(dbData.start_hour);
			const closeHour = parseInt(dbData.end_hour);
			const timeInterval = 10; // The step (9:00, 9:10, 9:20...)
			const serviceDuration = selectedService.time; // e.g., 15 mins

			const bookings = await axios.get("/api/bookings", {
				params: { day: selectedDay },
			});
			const existingBookings = bookings.data; // Expecting [{time: "09:00", service: {time: 30}}, ...]

			const availableSlots = [];

			// Helper to convert "HH:mm" to total minutes from midnight
			const toMin = (timeStr) => {
				const [h, m] = timeStr.split(":").map(Number);
				return h * 60 + m;
			};

			const startMin = openHour * 60;
			const endMin = closeHour * 60;

			for (
				let current = startMin;
				current <= endMin - serviceDuration;
				current += timeInterval
			) {
				const slotStart = current;
				const slotEnd = current + serviceDuration;

				// Check if this slot overlaps with ANY existing booking
				const isOverlap = existingBookings.some((booking) => {
					const bStart = toMin(booking.time);
					const bEnd = bStart + booking.service.time;

					// Overlap math: (StartA < EndB) AND (EndA > StartB)
					return slotStart < bEnd && slotEnd > bStart;
				});

				if (!isOverlap) {
					const h = Math.floor(current / 60);
					const m = current % 60;
					const value = `${h}:${m.toString().padStart(2, "0")}`;
					availableSlots.push({ value: value, label: <p>{value}</p> });
				}
			}

			setTimeOptions(availableSlots);
		};

		getTimeIntervals();
	}, [selectedDay, selectedService]);

	// <================================================================>

	function handleName(e) {
		if (e.target.value === "") e.target.style.borderColor = "red";
		else e.target.style.borderColor = "#313b44";
		setName(e.target.value);
	}

	function handlePhone(e) {
		if (e.target.value.length != 10) {
			e.target.style.borderColor = "red";
			return;
		} else e.target.style.borderColor = "#313b44";
		setPhone(e.target.value);
	}

	function restrictLetter(e) {
		// Permitem tastele de control (Backspace, Delete, Tab, Escape, Enter, Săgeți)
		const isControlKey = [
			"Backspace",
			"Delete",
			"Tab",
			"Escape",
			"Enter",
			"ArrowLeft",
			"ArrowRight",
			"ArrowUp",
			"ArrowDown",
		].includes(e.key);

		// Dacă nu este tastă de control și nu este cifră (0-9), blocăm acțiunea
		if (!isControlKey && !/[0-9]/.test(e.key)) {
			e.preventDefault();
		}
	}

	function handleDetails(e) {
		setDetails(e.target.value);
	}

	function handleService(e) {
		setService(e);
	}

	function handleSubmit(e) {
		e.preventDefault();
		if (_phone == "") {
			setWarning("Nu ai introdus un numar de telefon valid!");
			return;
		}

		if (selectedService == 0) {
			setWarning("Nu ai ales un serviciu!");
			return;
		}

		if (selectedDay.value == "") {
			setWarning("Nu ai ales o dată pentru programare!");
			return;
		}

		if (selectedTime.value == "") {
			setWarning("Nu ai ales o oră pentru programare!");
			return;
		}

		setSubmit(true);
	}

	async function saveBooking() {
		const bookingData = {
			name: _name,
			phone: _phone,
			service: {
				name: selectedService.name,
				time: selectedService.time,
				price: selectedService.price,
			},
			details: _details,
			day: selectedDay,
			time: selectedTime,
		};

		try {
			// 2. Send the POST request to your running server endpoint
			const response = await axios.post("/api/bookings", bookingData);

			console.log("✅ Booking successfully saved:", response.data);
			alert("Programare confirmată!");
		} catch (error) {
			console.error(
				"❌ Error saving booking:",
				error.response ? error.response.data : error.message,
			);
			alert("Failed to save booking. Please try again.");
		}
	}

	function handleConfirm() {
		saveBooking();
		navigate("/");
	}

	function handleCancel() {
		setSubmit(false);
	}

	return (
		<>
			<div className="booking-page-ct">
				<Navbar />
				<form
					className={submitted ? "booking-form hide" : "booking-form"}
					onSubmit={handleSubmit}
				>
					<h1 className="title">PROGRAMARE</h1>
					<p className="subtitle">
						Completează datele de mai jos pentru a face o programare.
					</p>
					{/* ============ NAME INPUT ================ */}
					<input
						name="full-name"
						maxLength={25}
						placeholder="Nume și prenume"
						onBlur={handleName}
						onKeyDown={(event) => {
							if (/[0-9]/.test(event.key)) {
								event.preventDefault();
							}
						}}
						required={true}
					/>
					{/* ========================================== */}
					{/* ============ PHONE NUMBER INPUT ============ */}
					<input
						name="phone-number"
						maxLength={10}
						placeholder="Număr de telefon"
						onBlur={handlePhone}
						onKeyDown={restrictLetter}
						required={true}
					/>
					{/* ============================================= */}
					{/* ============ SERVICE OPTIONS ============ */}
					<div className="options-container">
						{services.map((s) => (
							<div
								className={
									selectedService.name === s.name
										? "option-card selected"
										: "option-card"
								}
								onClick={() => handleService(s)}
								key={s.name}
							>
								<img src={s.imageURL} />
								<p className="service-title">{s.name}</p>
								<p className="info">{s.time + " min | " + s.price + " ron"}</p>
							</div>
						))}
					</div>
					{/* =========================================== */}
					{/* >=====================< TIME AND DATE SELECTION <=======================< */}
					<Select options={dayOps} icon={calendar_img} onChange={setDay} />
					<Select options={timeOptions} icon={clock_img} onChange={setTime} />
					<div className="time-date-info">
						<img src={info_img} />
						<p>
							Orele afișate sunt calculate in functie de programarile existente
							și serviciul selectat!
						</p>
					</div>
					{/* <=======================================================================> */}
					{/* ============== ADDITIONAL DETAILS INPUT ============= */}
					<input
						className="details"
						name="details"
						placeholder="Detalii suplimentare"
						maxLength={50}
						onChange={handleDetails}
					/>
					{/* ==================================================== */}
					{/* >======> SUBMIT FOR CONFIRMATION <==========<*/}
					{warning !== "" ? (
						<p className="warning">
							{" "}
							<img src={info_img} />
							{warning}
						</p>
					) : null}
					<input type="submit" value="Programează-mă" />{" "}
				</form>
				<img src={barber_img} className="bg-img" />

				<div className={submitted ? "booking-confirm show" : "booking-confirm"}>
					<h1>DETALII PROGRAMARE</h1>
					<b>Nume</b>
					<p>{_name}</p>
					<b>Telefon</b>
					<p>{_phone}</p>
					<b>Serviciul ales</b>
					<p>{selectedService.name}</p>
					<b>Data și ora</b>
					<p>{selectedDay.toUpperCase() + " ora " + selectedTime}</p>
					<b>Detalii suplimentare</b>
					<p>{_details}</p>

					<span className="confirm-button" onClick={handleConfirm}>
						CONFIRMĂ
					</span>
					<span className="cancel-button" onClick={handleCancel}>
						ANULEAZĂ
					</span>
				</div>
			</div>
		</>
	);
}

export default BookingPage;
