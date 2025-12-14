import { useState, useEffect, process } from "react";
import axios from "axios";
import "./Booking.css";

function Booking({ onBookingChange, selectedService }) {
	const [daySelection, setDay] = useState("");
	const [timeSelection, setTime] = useState("");
	const [timeStamps, setTimeStamps] = useState([]);

	function handleDaySelection(event) {
		let _day = event.currentTarget.dataset.value;
		setDay(_day);

		if (onBookingChange) {
			onBookingChange(_day, timeSelection);
		}
	}

	useEffect(() => {
		const fetchData = async () => {
			const reservations = await axios.get("/api/bookings", {
				params: { day: daySelection },
			});

			// console.log(reservations);

			const data = reservations.data;

			const openHour = 9;
			const closeHour = 17;
			const timeInterval = 10;
			const totalTime = (closeHour - openHour) * 60;

			const newTimeStamps = [];

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

						console.log(d);
						// if ()
						passed +=
							(Math.round(d.service.time / timeInterval) - 1) * timeInterval;
					}
				}
			}

			setTimeStamps(newTimeStamps);
		};

		fetchData();
	}, [daySelection, selectedService]);

	function handleTimeSelection(event) {
		let value = event.currentTarget.dataset.value;
		setTime(value);

		if (onBookingChange) {
			onBookingChange(daySelection, value);
		}
	}

	// ----- Get all 31 days from the current one -----
	const options = { day: "numeric", month: "short" };
	const days = [];
	const now = new Date();

	for (let i = 0; i <= 31; i++) {
		const d = new Date(now);
		d.setDate(now.getDate() + i);
		days.push(d.toLocaleDateString("ro-RO", options).replace(".", ""));
	}
	// ------------------------------------------------

	return (
		<>
			<div className="calendar-ct">
				<div className="day-ct">
					{days.map((day) => (
						<span
							key={day}
							data-value={day}
							onClick={handleDaySelection}
							className={daySelection == day ? "selected" : null}
						>
							{day}
						</span>
					))}
				</div>
				<div className="time-ct">
					{timeStamps.map((timestamp) => (
						<p
							key={timestamp}
							data-value={timestamp}
							onClick={handleTimeSelection}
							className={timeSelection == timestamp ? "selected" : null}
						>
							{timestamp}
						</p>
					))}
				</div>
			</div>
		</>
	);
}

export default Booking;
