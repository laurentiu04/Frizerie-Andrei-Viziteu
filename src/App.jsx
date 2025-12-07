import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./Navbar";
import Home from "./Home";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element=<Home /> />
			</Routes>
		</>
	);
}

export default App;
