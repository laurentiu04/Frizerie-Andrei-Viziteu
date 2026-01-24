import { Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import Reserve from "./Reserve";
import Admin from "./Admin";
import AdminLogin from "./AdminLogin";
import axios from "axios";
import { useState } from "react";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/programare" element={<Reserve />} />
				<Route path="/admin" element={<Admin />} />
				<Route path="/admin-login" element={<AdminLogin />} />
			</Routes>
		</>
	);
}

export default App;
