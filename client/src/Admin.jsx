import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./admin.css";
import AdminBookings from "./adminBookings";
import Logo from "./assets/Logo.svg";
import axios from "axios";
axios.defaults.withCredentials = true;

// =====> Images imports <=====

import appointments_icon from "./assets/appointments-icon.svg";
import schedule_icon from "./assets/schedule-icon.svg";
import statistics_icon from "./assets/statistics-icon.svg";

// <==========================>

function Admin() {
	document.querySelector("body").style.background = "#131619";
	document.querySelector("body").style.padding = "1rem 2rem";

	const [loading, setLoading] = useState(true);
	const [loggedIn, setLogged] = useState(false);
	const [currentTab, setTab] = useState("programari");
	const navigate = useNavigate();

	function handleTabSelect(e) {
		const tabName = e.currentTarget.dataset.value;
		setTab(tabName);
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

				setLoading(false); // Authentication ready
			} catch (e) {
				console.log("Error in Admin initialization:", e);
				// If the error is a 401, redirect to login
				if (e.response && e.response.status === 401) {
					navigate("/admin-login");
				}
			}
		};

		initializeAdmin();
	}, [navigate, loggedIn]); // Re-run when the selected day changes

	// Prevent the rest of the component from rendering while checking auth
	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<div className="page-ct">
				{/* =================> NAVBAR <================= */}
				<div className="nav">
					<img className="logo" src={Logo} />
					<ul>
						<li
							className={currentTab == "programari" ? "selected" : ""}
							onClick={handleTabSelect}
							data-value="programari"
						>
							<img src={appointments_icon} />
							Programări
						</li>
						<li
							className={currentTab == "edit_program" ? "selected" : ""}
							onClick={handleTabSelect}
							data-value="edit_program"
						>
							<img src={schedule_icon} />
							Editează Program
						</li>
						<li
							className={currentTab == "statistici" ? "selected" : ""}
							onClick={handleTabSelect}
							data-value="statistici"
						>
							<img src={statistics_icon} />
							Statistici
						</li>
					</ul>
				</div>

				{/* <======================================================> */}

				{/* >==================> MAIN CONTENT <====================< */}
				<div className="main-ct">
					{currentTab === "programari" ? <AdminBookings /> : null}
				</div>

				{/* <======================================================> */}
			</div>
		</>
	);
}

export default Admin;
