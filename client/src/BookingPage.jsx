import { useEffect, useState } from "react";
import Select from "./Select";
import Navbar from "./Navbar";
import "./bookingPage.css";

// >===============> IMAGE IMPORT <================<
import barber_img from "./assets/barber_img.webp";
import calendar_img from "./assets/calendar.png";
import clock_img from "./assets/clock.png";
import info_img from "./assets/info.png";
// <===============================================>

import axios from "axios";
import { formatTime, getAvailableBookingSlots, getBookingDates} from "./DBUtils";
import { color } from "@mui/system";

function BookingPage() {

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
	const [timeOptions, setTimeOptions] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			const dbData = (await axios.get("/api/work-info/")).data;

			setServicesData(dbData.services);

      const dates = await getBookingDates();
			setDayOps(dates);
		};

		fetchData();
	}, []);
	// console.log(dayOptions) // FOR DEBUG

	// <================================================================>

	useEffect(() => {

    const fetchSlots = async () => {
      setTimeOptions(null)
      const availableHours = (await getAvailableBookingSlots(selectedService, selectedDay))
        .map((min) => ({
						value: formatTime(min),
						label: <p>{formatTime(min)}</p>,
					}));
      setTimeOptions(availableHours);
    }

    (selectedDay && selectedService) && fetchSlots();
  }, [selectedDay, selectedService]);


	 // When a date is selected, the current time selection is removed
  useEffect(() => {
    const removeTimeSelection = () => {
      setTime("")
    }

    removeTimeSelection();
  }, [selectedDay])

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

		saveBooking();
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
			await axios.post("/api/bookings", bookingData);
				setSubmit(true);
		} catch (error) {
			console.error(
				"❌ Error saving booking:",
				error.response ? error.response.data : error.message,
			);
			alert("Programare esuată! Încercati din nou.");
		}
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
						onChange={handleName}
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
						placeholder="07XXXXXXX"
						onChange={handlePhone}
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
					<Select options={timeOptions} icon={clock_img} onChange={setTime} onEmptyMessage="Nu mai sunt locuri pentru acest serviciu."/>
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
          <div className="title">
            <h1>PROGRAMARE <b style={{color: "var(--color_light_blue)", fontSize: "2rem", fontWeight: "700"}}>REALIZATĂ!</b></h1>
          </div>
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
				</div>
			</div>
		</>
	);
}

export default BookingPage;
