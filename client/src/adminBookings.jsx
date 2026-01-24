import "./adminBookings.css";
import arrow from "./assets/arrow.png";

import { useEffect, useState } from "react";
import axios from "axios";

function AdminBookings() {
	const [spinner, setSpinner] = useState(false);

	let days = [];
	const options = { day: "numeric", month: "short" };
	const [selectedDay, setSelectedDay] = useState([
		new Date().toLocaleDateString("ro-RO", options).replace(".", ""),
		0,
	]);
	const [bookings, setBookings] = useState([]);

	// >==========> Get all 31 days from the current one <===========<
	const now = new Date();

	for (let i = 0; i <= 31; i++) {
		const d = new Date(now);
		d.setDate(now.getDate() + i);
		days.push(d.toLocaleDateString("ro-RO", options).replace(".", ""));
	}
	// <=============================================================>

	function handleDaySelect(e) {
		const day = e.currentTarget.dataset.value;
		const index = e.currentTarget.dataset.index;
		setSelectedDay([day, index]);

		// Folosim un mic delay pentru a permite layout-ului să se actualizeze
		setTimeout(() => {
			const slider = document.querySelector(".day-slider");
			if (slider && slider.children[index]) {
				const selected = slider.children[index];
				selected.scrollIntoView({
					inline: "start",
					behavior: "smooth",
				});
			}
		}, 10); // Ajustează timpul în funcție de viteza animației tale CSS
	}

	useEffect(() => {
		async function loadBookings() {
			// Load selected day bookings

			setSpinner(true);
			setBookings([]);
			const entries_data = await axios.get("/api/bookings", {
				params: { day: selectedDay },
			});

			if (entries_data) {
				setSpinner(false);
				setBookings(entries_data.data);
			}
		}

		loadBookings();
	}, [selectedDay]);

	return (
		<>
			<div className="bookings-ct">
				<div className="day-selector">
					<img src={arrow} />
					<span className="overlay"></span>
					<div className="day-slider">
						{days.map((day, index) => (
							<span
								key={index}
								data-value={day}
								data-index={index}
								className={selectedDay[0] === day ? "selected-day" : ""}
								onClick={handleDaySelect}
							>
								{day}
							</span>
						))}
					</div>
					<img src={arrow} />
				</div>
			</div>
		</>
	);
}

export default AdminBookings;
