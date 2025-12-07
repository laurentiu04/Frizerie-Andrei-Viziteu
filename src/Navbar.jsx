import "./navbar.css";
import Logo from "./assets/Logo.svg";
import { Link } from "react-router-dom";

function Navbar() {
	return (
		<>
			<div className="navbar">
				<img id="logo" src={Logo} />
				<div className="links">
					<Link to="/">ACASĂ</Link>
					<Link to="/">SERVICII</Link>
					<Link to="/">PROGREAMEAZĂ-TE</Link>
					<Link to="/">CONTACT</Link>
				</div>
				<div className="meniu-cont">
					<img />
					CONTUL MEU
				</div>
			</div>
		</>
	);
}

export default Navbar;
