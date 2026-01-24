import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./admin-login.css";

function AdminLogin() {
	const [user, setUser] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch("/api/login", {
				// Vite proxy handles this
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ user, password }),
			});

			if (response.ok) {
				// Redirect manually on success
				navigate("/admin");
			} else {
				alert("Login failed. Check credentials.");
			}
		} catch (err) {
			console.error("Error during login:", err);
		}
	};
	return (
		<div className="login-container">
			<form onSubmit={handleSubmit}>
				<h1>
					<b>ADMIN</b> LOGIN
				</h1>
				<label htmlFor="user">Utilizator</label>
				<input
					name="user"
					type="text"
					value={user}
					onChange={(e) => setUser(e.target.value)}
				/>
				<label htmlFor="password">Parolă</label>
				<input
					name="password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button type="submit">Loghează-te</button>
			</form>
		</div>
	);
}

export default AdminLogin;
