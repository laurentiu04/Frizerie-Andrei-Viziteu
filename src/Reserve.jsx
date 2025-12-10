import { useState } from "react";
import Navbar from "./Navbar";
import "./reserve.css";
import classic_cut_img from "./assets/classic-cut.svg";

function Reserve() {
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [details, setDetails] = useState("");
	const [service, setService] = useState("");
	const [submitted, setSubmit] = useState(false);

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
		window.location.replace("http://localhost:5173/Frizerie-Andrei-Viziteu/");
		alert("Rezervare confirmata!");
		document.getElementsByClassName("reserve-form").reset();
	}

	function handleCancel() {
		setSubmit(false);
	}

	function handleSubmit(e) {
		e.preventDefault();
		if (name !== "" && phone.length == 10 && service !== "") {
			setSubmit(true);
		}
	}

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
						<img src={classic_cut_img} />
						<p className="title">Tuns modern</p>
						<p className="info">40 min | 50 ron</p>
					</div>
					<div
						className={
							service === "Tuns barbă" ? "option-card selected" : "option-card"
						}
						onClick={handleService}
					>
						<img src={classic_cut_img} />
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
						<img src={classic_cut_img} />
						<p className="title">Tuns + barbă</p>
						<p className="info">50 min | 65 ron</p>
					</div>
				</div>
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
				<p>Nume: {name}</p>
				<p>Telefon: {phone}</p>
				<p>Serviciul ales: {service}</p>
				<p>Detalii suplimentare: {details}</p>

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
