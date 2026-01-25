import "./adminBookings.css";
import arrow from "./assets/arrow.png";
import edit from "./assets/edit.png";

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
		const tagName = e.target.tagName.toLowerCase();
		var day, index;

		if (tagName === "span") {
			day = e.currentTarget.dataset.value;
			index = e.currentTarget.dataset.index;
		} else {
			const iconName = e.target.className;

			if (iconName === "next" && selectedDay[1] < 31) {
				index = parseInt(selectedDay[1]) + 1;
			} else if (iconName === "previous" && selectedDay[1] > 0) {
				index = parseInt(selectedDay[1]) - 1;
			} else {
				return;
			}

			day = days[index];
		}

		if (day == null) return;
		setSelectedDay([day, index]);

		setTimeout(() => {
			const slider = document.querySelector(".day-slider-elems");
			if (slider && slider.children[index]) {
				const selected = slider.children[index];
				selected.scrollIntoView({
					inline: "start",
					behavior: "smooth",
				});
			}
		}, 0);
	}

	useEffect(() => {
		async function loadBookings() {
			setSpinner(true);
			setBookings([]);
			const entries_data = await axios.get("/api/bookings", {
				params: { day: selectedDay[0] },
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
					{/* >===========================================================< */}
					<img src={arrow} className="previous" onClick={handleDaySelect} />

					<div className="day-slider-ct">
						<span
							className={selectedDay[1] >= 27 ? "overlay hidden" : "overlay"}
						></span>
						<div className="day-slider-elems">
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
					</div>
					<img src={arrow} className="next" onClick={handleDaySelect} />
				</div>{" "}
				{/* <====================================================================================> */}
				<div className="booklist-ct">
					<div className="grid-headers">
						<p>#</p>
						<p>Nume</p>
						<p>Telefon</p>
						<p>Ora</p>
						<p>Serviciu</p>
						<p>Detalii</p>
						<p>Creat la</p>
						<p>Edit</p>
					</div>
					<div className="bookings-list">
						{bookings.map((book, index) => (
							<div className="grid-row" key={index}>
								<p>{index + 1}</p>
								<p>{book.name}</p>
								<p>
									{book.phone.substring(0, 4) +
										" " +
										book.phone.substring(4, 7) +
										" " +
										book.phone.substring(7, 10)}
								</p>
								<p>{book.time}</p>
								<p>{book.service.name}</p>
								<p>{book.details}</p>
								<p>
									{new Date(book.bookedAt).toLocaleDateString("ro-RO")}
									<br></br>
									{new Date(book.bookedAt).toLocaleTimeString("ro-RO")}
								</p>
								<img src={edit} className="edit-icon" />
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
}

export default AdminBookings;
