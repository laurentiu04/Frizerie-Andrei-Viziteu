import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "./admin.css";
import Logo from "./assets/Logo.svg";
import axios from "axios";
axios.defaults.withCredentials = true;

import { useNavigate } from "react-router-dom";

function Admin() {
	const [loading, setLoading] = useState(true);
	const [loggedIn, setLogged] = useState(false);
	const [spinner, setSpinner] = useState(false);
	const navigate = useNavigate();

	let days = [];
	const options = { day: "numeric", month: "short" };
	const [tableDay, setTableDay] = useState(
		new Date().toLocaleDateString("ro-RO", options).replace(".", ""),
	);
	const [entries, setEntries] = useState([]);

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
		const initializeAdmin = async () => {
			try {
				if (!loggedIn) {
					const authResponse = await axios.get(
						`/api/check-login?t=${new Date().getTime()}`,
					);

					if (!authResponse.data.authenticated) {
						navigate("/admin-login");
						setLogged(false);
						return; // Stop here if not logged in
					} else {
						setLogged(true);
					}
				}

				// Load selected day bookings

				setSpinner(true);
				setEntries([]);
				const entries_data = await axios.get("/api/bookings", {
					params: { day: tableDay },
				});

				if (entries_data) {
					setSpinner(false);
					setEntries(entries_data.data);
					setLoading(false); // Authentication and Data are both ready
				}
			} catch (e) {
				console.log("Error in Admin initialization:", e);
				// If the error is a 401, redirect to login
				if (e.response && e.response.status === 401) {
					navigate("/admin-login");
				}
			}
		};

		initializeAdmin();
	}, [tableDay, navigate]); // Re-run when the selected day changes

	// Prevent the rest of the component from rendering while checking auth
	if (loading) {
		return <div>Loading...</div>;
	}

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
						<p
							className="data-spinner"
							style={{ display: spinner ? "block" : "none" }}
						>
							loading data...
						</p>
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
