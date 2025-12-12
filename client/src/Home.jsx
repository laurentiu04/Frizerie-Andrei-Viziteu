import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Fundal from "./assets/Fundal.png";
import "./home.css";

function Home() {
	return (
		<>
			<Navbar />
			<div className="home-container">
				<div className="fundal-mask">
					<img id="fundal" src={Fundal} />
				</div>
				<span id="overlay"></span>
				<h1>
					<b>BARBER</b>
					ANDREI VIZITEU
				</h1>
				<h1>
					<b>TUNSORI</b>
					MODERNE
				</h1>
				<h1>
					<b>STIL</b>
					PERSONALIZAT
				</h1>
				<span className="reserveButton">
					<Link to="/programare">PROGRAMEAZĂ-TE</Link>
				</span>
			</div>
		</>
	);
}

export default Home;
