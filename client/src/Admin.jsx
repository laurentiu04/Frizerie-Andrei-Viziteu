import { useState } from "react";
import Navbar from "./Navbar";
import "./admin.css";
import Logo from "./assets/Logo.svg";
import axios from "axios";
import { useEffect } from "react";
import { useRef } from "react";

function Admin() {
	let days = [];
	const options = { day: "numeric", month: "short" };
	const [tableDay, setTableDay] = useState(
		new Date().toLocaleDateString("ro-RO", options).replace(".", ""),
	);
	const [entries, setEntries] = useState([]);
	let ref;

	// ----- Get all 31 days from the current one -----
	const now = new Date();

	for (let i = 0; i <= 31; i++) {
		const d = new Date(now);
		d.setDate(now.getDate() + i);
		days.push(d.toLocaleDateString("ro-RO", options).replace(".", ""));
	}
	// ------------------------------------------------

	function handleDaySelect(e) {
		const day = e.currentTarget.dataset.value;
		setTableDay(day);
	}

	useEffect(() => {
		const getTodaysEntries = async () => {
			try {
				const entries_data = await axios.get("/api/bookings", {
					params: { day: tableDay },
				});

				if (entries_data) {
					setEntries(entries_data.data);
				}
			} catch (e) {
				console.log(e);
			}
		};

		getTodaysEntries();
	}, [tableDay]);

	return (
		<>
			<div className="nav">
				<img src={Logo} />
				<h1 className="page-title">ADMIN PANEL</h1>
			</div>
			<div className="admin-ct">
				<h1>Programări</h1>
				<div className="reservations-table">
					<div className="res-table-days">
						{days.map((day) => (
							<span
								className={tableDay == day ? "selected" : null}
								key={day}
								data-value={day}
								onClick={handleDaySelect}
							>
								{day}
							</span>
						))}
					</div>
					<h1 className="total-entries">{entries.length}</h1>
					<div className="res-table-entries">
						{entries.map((e) => (
							<span className="res-entry-info" key={e._id}>
								<b className="name">{e.name}</b>
								<div>
									<b>Ora:</b>
									<p>{e.time}</p>
								</div>
								<div>
									<b>Serviciu:</b>
									<p>{e.service.name}</p>
								</div>
								<div>
									<b>Detalii:</b>
									<p>{e.details}</p>
								</div>
								<div>
									<b>Plasat la:</b>
									<p>
										{e.bookedAt.split("T")[1].slice(0, 5) +
											" | " +
											e.bookedAt.split("T")[0]}
									</p>
								</div>
							</span>
						))}
					</div>
				</div>
			</div>
		</>
	);
}

export default Admin;
