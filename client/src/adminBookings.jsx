import "./adminBookings.css";
import arrow from "./assets/arrow.png";
import edit from "./assets/edit.png";

import { useEffect, useState } from "react";
import axios from "axios";

function AdminBookings() {
	const [dayOps, setDayOps] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			const dateOptions = {
				month: "short",
				day: "numeric",
				weekday: "long",
			};

			const freeDays = (await axios.get("/api/work-info/")).data.free_days;
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

				dayOptions.push(date);
			}
			setDayOps(dayOptions);
		};

		fetchData();
	}, []);

	const [selectedDay, setSelectedDay] = useState([
		"",
		-1,
	]);

	const [bookings, setBookings] = useState([]);
	
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

			day = dayOps[index];
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
			setBookings([]);
			const entries_data = await axios.get("/api/bookings", {
				params: { day: selectedDay[0] },
			});

			if (entries_data) {
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
							{dayOps != null ? dayOps.map((day, index) => (
								<span
									key={index}
									data-value={day}
									data-index={index}
									className={selectedDay[0] === day ? "selected-day" : ""}
									onClick={handleDaySelect}
								>
									{day}
								</span>
							)) : null}
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
								<input placeholder={book.name}/>
								<p>
									{book.phone.substring(0, 4) +
										" " +
										book.phone.substring(4, 7) +
										" " +
										book.phone.substring(7, 10)}
								</p>
								<p>{book.time}</p>
								<p>{book.service.name}</p>
								<p>{book.details || "-"}</p>
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
