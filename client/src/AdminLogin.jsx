import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
		<form onSubmit={handleSubmit}>
			<input
				type="text"
				value={user}
				onChange={(e) => setUser(e.target.value)}
			/>
			<input
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<button type="submit">Loghează-te</button>
		</form>
	);
}

export default AdminLogin;
