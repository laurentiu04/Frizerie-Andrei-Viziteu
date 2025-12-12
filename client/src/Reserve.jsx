import { useState } from "react";
import Navbar from "./Navbar";
import "./reserve.css";
import classic_cut_img from "./assets/classic-cut.svg";
import modern_cut_img from "./assets/modern-cut.svg";
import beard_cut_img from "./assets/beard-cut.svg";
import beard_and_hair_img from "./assets/beard_and_hair.svg";
import { useNavigate } from "react-router";
import axios from "axios";
import Booking from "./Booking";

function Reserve() {
	const [_name, setName] = useState("");
	const [_phone, setPhone] = useState("");
	const [_details, setDetails] = useState("");
	const [_service, setService] = useState({});
	const [submitted, setSubmit] = useState(false);
	const [bookingDetails, setBookingDetails] = useState({
		day: "",
		time: "",
	});

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

	const navigate = useNavigate();

	function handleName(e) {
		if (e.target.value === "") e.target.style.borderColor = "red";
		else e.target.style.borderColor = "rgb(30, 30, 30)";
		setName(e.target.value);
	}

	function handlePhone(e) {
		if (e.target.value.length != 10) e.target.style.borderColor = "red";
		else e.target.style.borderColor = "rgb(30, 30, 30)";
		setPhone(e.target.value);
	}

	function handleDetails(e) {
		setDetails(e.target.value);
	}

	function handleService(e) {
		setService(e);
	}

	function handleSubmit(e) {
		e.preventDefault();
		if (
			_name !== "" &&
			_phone.length == 10 &&
			_service != {} &&
			bookingDetails.day !== "" &&
			bookingDetails.time !== ""
		) {
			setSubmit(true);
		}
	}

	const handleBookingComplete = (day, time) => {
		setBookingDetails({ day, time });
	};

	async function saveBooking() {
		// 1. Define the data object to send (must match your Mongoose Schema fields)
		const bookingData = {
			name: _name,
			phone: _phone,
			service: {
				name: _service.name,
				time: _service.time,
				price: _service.price,
			},
			details: _details,
			day: bookingDetails.day,
			time: bookingDetails.time,
		};

		try {
			// 2. Send the POST request to your running server endpoint
			const response = await axios.post(
				"http://localhost:3000/api/bookings",
				bookingData,
			);

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
			<Navbar />
			<form
				className={submitted ? "reserve-form hide" : "reserve-form"}
				onSubmit={handleSubmit}
			>
				<h1 className="title">PROGRAMARE</h1>
				{/* ============ NAME INPUT ================ */}
				<p>Nume complet:</p>
				<input
					name="full-name"
					maxLength={25}
					onBlur={handleName}
					onKeyPress={(event) => {
						if (/[0-9]/.test(event.key)) {
							event.preventDefault();
						}
					}}
				/>
				{/* ========================================== */}
				{/* ============ PHONE NUMBER INPUT ============ */}
				<p>Număr de telefon:</p>
				<input
					name="phone-number"
					maxLength={10}
					onBlur={handlePhone}
					onKeyPress={(event) => {
						if (!/[0-9]/.test(event.key)) {
							event.preventDefault();
						}
					}}
				/>
				{/* ============================================= */}
				{/* ============ SERVICE OPTIONS ============ */}
				<p>Selectează un serviciu:</p>
				<div className="options-container">
					{services.map((s) => (
						<div
							className={
								_service.name === s.name
									? "option-card selected"
									: "option-card"
							}
							onClick={() => handleService(s)}
							key={s.name}
						>
							<img src={s.icon} />
							<p className="title">{s.name}</p>
							<p className="info">{s.time + " min | " + s.price + " ron"}</p>
						</div>
					))}
				</div>
				{/* =========================================== */}
				{/* ========== TIME AND DAY SELECTION =============== */}
				<p>Selectează data și ora:</p>
				<Booking
					onBookingChange={handleBookingComplete}
					selectedService={_service}
				/>
				{/* ================================================= */}
				{/* ============== ADDITIONAL DETAILS INPUT ============= */}
				<p>Detalii suplimentare:</p>
				<textarea
					name="details"
					maxLength={100}
					rows={4}
					onChange={handleDetails}
				/>
				{/* ==================================================== */}
				<input type="submit" value="Rezervă" /> {/* SUBMIT FOR CONFIRMATION */}
			</form>

			<div
				className={
					submitted ? "reserve-succes-info show" : "reserve-succes-info"
				}
			>
				<h1>Confirmi programarea?</h1>
				<b>Nume:</b>
				<p>{_name}</p>
				<b>Telefon:</b>
				<p>{_phone}</p>
				<b>Serviciul ales:</b>
				<p>{_service.name}</p>
				<b>Data și ora:</b>
				<p>{bookingDetails.day + " ora " + bookingDetails.time}</p>
				<b>Detalii suplimentare:</b>
				<p>{_details}</p>

				<span className="confirm-button" onClick={handleConfirm}>
					CONFIRM
				</span>
				<span className="cancel-button" onClick={handleCancel}>
					ANULEAZĂ
				</span>
			</div>
		</>
	);
}

export default Reserve;
