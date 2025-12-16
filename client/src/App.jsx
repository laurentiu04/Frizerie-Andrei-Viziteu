import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./Navbar";
import Home from "./Home";
import Reserve from "./Reserve";
import Admin from "./Admin";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/programare" element={<Reserve />} />
				<Route path="/admin" element={<Admin />} />
			</Routes>
		</>
	);
}

export default App;
