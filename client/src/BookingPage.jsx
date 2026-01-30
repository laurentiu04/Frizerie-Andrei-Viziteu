import { useEffect, useState } from "react";
import Select from "react-select";
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
import arrow from "./assets/arrow.png";
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

	const services = [
		{
			name: "Tuns clasic",
			icon: classic_cut_img,
			time: 30,
			price: 40,
		},
		{
			name: "Tuns modern",
			icon: modern_cut_img,
			time: 40,
			price: 50,
		},
		{
			name: "Tuns barbă",
			icon: beard_cut_img,
			time: 15,
			price: 30,
		},
		{
			name: "Tuns + barbă",
			icon: beard_and_hair_img,
			time: 50,
			price: 65,
		},
	];

	// >============== TIME AND DATE SELECTION SETUP <=====================<

	const [selectedTime, setTime] = useState({ value: "", index: 0 });
	const [selectedDay, setDay] = useState({ value: "", index: 0 });

	var dayOptions = [];
	const [timeOptions, setTimeOptions] = useState([]);

	const dateOptions = {
		month: "short",
		day: "numeric",
		weekday: "long",
	};

	for (var i = 0; i < 31; i++) {
		const fullDate = new Date(
			new Date().getTime() + i * (1000 * 60 * 60 * 24),
		).toLocaleDateString("ro-RO", dateOptions);
		const date = fullDate.split(",")[1].replace(".", "");
		const weekday = fullDate.split(",")[0];

		if (weekday == "duminică") continue;
		dayOptions.push({ date: date, weekday: weekday });
	}

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
			const openHour = 9;
			const closeHour = 17;
			const timeInterval = 10;
			const totalTime = (closeHour - openHour) * 60;

			const newTimeStamps = [];

			const bookings = await axios.get("/api/bookings", {
				params: { day: selectedDay.value },
			});

			const data = bookings.data;

			console.log(data);

			for (let passed = 0; passed < totalTime; passed += timeInterval) {
				let hourPassed = Math.floor(passed / 60);
				let minutesPassed = passed % 60;

				const timeStamp =
					(openHour + hourPassed).toString() +
					":" +
					minutesPassed.toString().padStart(2, "0");

				if (data) {
					const d = data.find((e) => e.time === timeStamp);
					if (!d) newTimeStamps.push(timeStamp);
					else {
						for (
							let i = 0;
							i < Math.round(selectedService.time / timeInterval);
							i++
						) {
							if (newTimeStamps.length != 0) newTimeStamps.pop();
						}
						passed +=
							(Math.round(d.service.time / timeInterval) - 1) * timeInterval;
					}
				}
			}

			setTimeOptions(newTimeStamps);
		};



		getTimeIntervals();
	}, [selectedDay.value, selectedService]);

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

	function handleTimeSelect(e) {
		setTime({
			value: e.currentTarget.dataset.value,
			index: parseInt(e.currentTarget.dataset.index),
		});
	}

	function handleDaySelect(e) {
		setDay({
			value: e.currentTarget.dataset.value,
			index: parseInt(e.currentTarget.dataset.index),
		});
	}

	function selectNext(e) {
		if (e.currentTarget.className === "next d") {
			if (selectedDay.value === "") {
				setDay({
					value: dayOptions[0].date,
					index: 0,
				});
			} else if (selectedDay.index + 1 < dayOptions.length) {
				const nextIndex = selectedDay.index + 1;
				setDay({
					value: dayOptions[nextIndex].date,
					index: nextIndex,
				});
			}
		}

		if (e.currentTarget.className === "next t") {
			if (selectedTime.value === "") {
				setTime({
					value: timeOptions[0],
					index: 0,
				});
			} else if (selectedTime.index + 1 < timeOptions.length) {
				const nextIndex = selectedTime.index + 1;
				setTime({
					value: timeOptions[nextIndex],
					index: nextIndex,
				});
			}
		}
	}

	function selectPrevious(e) {
		if (e.currentTarget.className === "prev d") {
			if (selectedDay.value === "") {
				setDay({
					value: dayOptions[0].date,
					index: 0,
				});
			} else if (selectedDay.index - 1 >= 0) {
				const nextIndex = selectedDay.index - 1;
				setDay({
					value: dayOptions[nextIndex].date,
					index: nextIndex,
				});
			}
		}

		if (e.currentTarget.className === "prev t") {
			if (selectedTime.value === "") {
				setTime({
					value: timeOptions[0],
					index: 0,
				});
			} else if (selectedTime.index - 1 >= 0) {
				const nextIndex = selectedTime.index - 1;
				setTime({
					value: timeOptions[nextIndex],
					index: nextIndex,
				});
			}
		}
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
			day: selectedDay.value,
			time: selectedTime.value,
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
								<img src={s.icon} />
								<p className="service-title">{s.name}</p>
								<p className="info">{s.time + " min | " + s.price + " ron"}</p>
							</div>
						))}
					</div>
					{/* =========================================== */}
					{/* >=====================< TIME AND DATE SELECTION <=======================< */}
					<div
						className="date select"
						onMouseLeave={() => {
							if (selectedDay.value === "") return;
							document
								.getElementsByClassName("option selected")[0]
								.scrollIntoView({
									behavior: "smooth",
									inline: "center",
								});
						}}
					>
						<img className="icon" src={calendar_img} />
						<img className="prev d" src={arrow} onClick={selectPrevious} />
						<div className="options-ct">
							{dayOptions.map((option, index) => (
								<span
									data-value={option.date}
									data-index={index}
									key={option.date}
									onClick={handleDaySelect}
									className={
										selectedDay.value === option.date
											? "option selected"
											: "option"
									}
								>
									<p>{option.date}</p>
									<p>{option.weekday}</p>
								</span>
							))}
						</div>
						<img className="next d" src={arrow} onClick={selectNext} />
					</div>
					{/* =----------------------------------------------------------------------=  */}
					<div
						className="time select"
						onMouseLeave={() => {
							if (selectedTime.value === "") return;
							document
								.getElementsByClassName("option selected")[1]
								.scrollIntoView({
									behavior: "smooth",
									inline: "center",
								});
						}}
					>
						<img className="icon" src={clock_img} />
						<img className="prev t" src={arrow} onClick={selectPrevious} />
						<div className="options-ct">
							{selectedDay.value === "" ? (
								<p className="no-day-selected">Selectează o zi</p>
							) : timeOptions.length == 0 ? (
								<p className="no-space-available">Nu mai sunt locuri disponibile</p>
							) : (
								timeOptions.map((option, index) => (
									<span
										data-value={option}
										data-index={index}
										key={option}
										onClick={handleTimeSelect}
										className={
											selectedTime.value === option
												? "option selected"
												: "option"
										}
									>
										<p>{option}</p>
									</span>
								))
							)}
						</div>
						<img className="next t" src={arrow} onClick={selectNext} />
					</div>
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
					<p>{selectedDay.value.toUpperCase() + " ora " + selectedTime.value}</p>
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
