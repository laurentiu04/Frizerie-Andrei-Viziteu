import { useEffect, useState } from "react";
import Select from "./Select";
import Navbar from "./Navbar";
import "./bookingPage.css";

// >===============> IMAGE IMPORT <================<
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

	useEffect(() => {
		const toMin = (timeStr) => {
			if (!timeStr) return 0;
			const [h, m] = timeStr.split(":").map(Number);
			return h * 60 + m;
		};

		const formatTime = (totalMinutes) => {
			const h = Math.floor(totalMinutes / 60);
			const m = totalMinutes % 60;
			return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
		};

		const getTimeIntervals = async () => {
			try {
				const dbData = (await axios.get("/api/work-info")).data;
				const openHour = parseInt(dbData.start_hour);
				const closeHour = parseInt(dbData.end_hour);
				const gridInterval = 45;
				const serviceDuration = Number(selectedService.time);

				const bookingsResponse = await axios.get("/api/bookings", {
					params: { day: selectedDay },
				});

				// 1. Pregătire date
				const existingBookings = bookingsResponse.data
					.map((b) => {
						const start = toMin(b.time);
						return {
							...b,
							startMin: start,
							endMin: start + Number(b.service?.time || 0),
						};
					})
					.sort((a, b) => a.startMin - b.startMin);

				const workStartMin = openHour * 60;
				const workEndMin = closeHour * 60;
				const availableMinutes = new Set();

				// 2. Parcurgere Grid
				for (
					let gridStart = workStartMin;
					gridStart <= workEndMin - serviceDuration;
					gridStart += gridInterval
				) {
					const gridEnd = gridStart + gridInterval;

					const bookingsInGrid = existingBookings.filter(
						(b) => b.startMin < gridEnd && b.endMin > gridStart,
					);

					let potentialStart;

					if (bookingsInGrid.length > 0) {
						// Dacă avem programări în acest interval de 45 min, încercăm să lipim de ultima
						potentialStart = bookingsInGrid.at(-1).endMin;

						// Verificăm dacă mai rămâne timp măcar pentru serviciul curent în acest grid
						// (Aceasta e regula ta de bază pentru a nu sări peste grilă)
						if (gridEnd - potentialStart < serviceDuration) continue;
					} else {
						// Dacă grid-ul e gol, ora de start este începutul grid-ului
						potentialStart = gridStart;
					}

					// --- REZOLVAREA OVERLAPPING-ULUI ---
					// Verificăm dacă intervalul nostru se ciocnește de ORICE altă programare din zi
					const hasOverlap = existingBookings.some((b) => {
						const potentialEnd = potentialStart + serviceDuration;
						// Verificăm coliziunea: noul start e înainte de un final existent
						// ȘI noul final e după un start existent
						return potentialStart < b.endMin && potentialEnd > b.startMin;
					});

					if (!hasOverlap) {
						availableMinutes.add(potentialStart);
					}
				}

				// 3. Formatare finală
				const finalSlots = [...availableMinutes]
					.sort((a, b) => a - b)
					.map((a) => {
						const formattedTime = formatTime(a);
						return { value: formattedTime, label: <p>{formattedTime}</p> };
					});

				setTimeOptions(finalSlots);
			} catch (error) {
				console.error("Eroare la calcul overlapping:", error);
			}
		};

		selectedDay && selectedService ? getTimeIntervals() : null;
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

		if (selectedDay == "") {
			setWarning("Nu ai ales o dată pentru programare!");
			return;
		}

		if (selectedTime == "") {
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
			alert("Programare esuată! Încercati din nou.");
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
