import Navbar from "./Navbar";
import Fundal from "./assets/Fundal.png";
import "./home.css";

function Home() {
	const message = () => {
		console.log("message");
	};
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
				<span className="button" onClick={message}>
					<p>PROGRAMEAZĂ-TE</p>
				</span>
			</div>
		</>
	);
}

export default Home;
