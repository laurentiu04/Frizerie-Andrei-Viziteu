import { useState, useEffect } from "react";
import "./Booking.css";

function Booking({ onBookingChange }) {
	const [daySelection, setDay] = useState("");
	const [timeSelection, setTime] = useState("");

	function handleDaySelection(event) {
		let value = event.currentTarget.dataset.value;
		setDay(value);

		if (onBookingChange) {
			onBookingChange(value, timeSelection);
		}
	}

	function handleTimeSelection(event) {
		let value = event.currentTarget.dataset.value;
		setTime(value);

		if (onBookingChange) {
			onBookingChange(daySelection, value);
		}
	}

	const options = { day: "numeric", month: "short" };
	const days = [];
	const now = new Date();

	for (let i = 0; i <= 31; i++) {
		const d = new Date(now);
		d.setDate(now.getDate() + i);
		days.push(d.toLocaleDateString("ro-RO", options).replace(".", ""));
	}

	const openHour = 10,
		closeHour = 20;
	const timeInterval = 10;
	const totalTime = (closeHour - openHour) * 60;
	const timeStamps = [];

	for (let passed = 0; passed < totalTime; passed += timeInterval) {
		let hourPassed = Math.floor(passed / 60);
		let minutesPassed = passed % 60;

		timeStamps.push(
			(openHour + hourPassed).toString() +
				":" +
				minutesPassed.toString().padStart(2, "0"),
		);
	}

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
