import { useState } from "react";
import Navbar from "./Navbar";
import "./reserve.css";
import classic_cut_img from "./assets/classic-cut.svg";
import modern_cut_img from "./assets/modern-cut.svg";
import beard_cut_img from "./assets/beard-cut.svg";
import { useNavigate } from "react-router";
import Booking from "./Booking";

function Reserve() {
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [details, setDetails] = useState("");
	const [service, setService] = useState("");
	const [submitted, setSubmit] = useState(false);
	const [bookingDetails, setBookingDetails] = useState({
		day: "",
		time: "",
	});

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
		setService(e.target.children[1].textContent);
	}

	function handleConfirm() {
		alert("Rezervare confirmata!");
		navigate("/");
	}

	function handleCancel() {
		setSubmit(false);
	}

	function handleSubmit(e) {
		e.preventDefault();
		if (
			name !== "" &&
			phone.length == 10 &&
			service !== "" &&
			bookingDetails.day !== "" &&
			bookingDetails.time !== ""
		) {
			setSubmit(true);
		}
	}

	const handleBookingComplete = (day, time) => {
		setBookingDetails({ day, time });
	};

	return (
		<>
			<Navbar />
			<form
				className={submitted ? "reserve-form hide" : "reserve-form"}
				onSubmit={handleSubmit}
			>
				<h1 className="title">PROGRAMARE</h1>
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
				<p>Selectează un serviciu:</p>
				<div className="options-container">
					<div
						className={
							service === "Tuns clasic" ? "option-card selected" : "option-card"
						}
						onClick={handleService}
					>
						<img src={classic_cut_img} />
						<p className="title">Tuns clasic</p>
						<p className="info">30 min | 40 ron</p>
					</div>
					<div
						className={
							service === "Tuns modern" ? "option-card selected" : "option-card"
						}
						onClick={handleService}
					>
						<img src={modern_cut_img} />
						<p className="title">Tuns modern</p>
						<p className="info">40 min | 50 ron</p>
					</div>
					<div
						className={
							service === "Tuns barbă" ? "option-card selected" : "option-card"
						}
						onClick={handleService}
					>
						<img src={beard_cut_img} />
						<p className="title">Tuns barbă</p>
						<p className="info">15 min | 30 ron</p>
					</div>
					<div
						className={
							service === "Tuns + barbă"
								? "option-card selected"
								: "option-card"
						}
						onClick={handleService}
					>
						<img src={beard_cut_img} />
						<p className="title">Tuns + barbă</p>
						<p className="info">50 min | 65 ron</p>
					</div>
				</div>
				<p>Selectează data și ora:</p>
				<Booking onBookingChange={handleBookingComplete} />
				<p>Detalii suplimentare:</p>
				<textarea
					name="details"
					maxLength={100}
					rows={4}
					onChange={handleDetails}
				/>
				<input type="submit" value="Rezervă" />
			</form>
			<div
				className={
					submitted ? "reserve-succes-info show" : "reserve-succes-info"
				}
			>
				<h1>Confirmi rezervarea?</h1>
				<b>Nume:</b>
				<p>{name}</p>
				<b>Telefon:</b>
				<p>{phone}</p>
				<b>Serviciul ales:</b>
				<p>{service}</p>
				<b>Data și ora:</b>
				<p>{bookingDetails.day + " ora " + bookingDetails.time}</p>
				<b>Detalii suplimentare:</b>
				<p>{details}</p>

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
