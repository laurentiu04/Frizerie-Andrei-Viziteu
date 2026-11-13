import "./navbar.css";
import Logo from "./assets/Logo.svg";
import { Link } from "react-router-dom";
import MenuIcon from "./assets/menu-icon.svg";
import { useEffect, useState } from "react";

function Navbar() {
	const [show_menu, setMenu] = useState(false);
	const [activeLink, setActiveLink] = useState("");

	const toggleMenu = () => {
		setMenu(!show_menu);
	};

	useEffect(() => {
		const retrieveActiveLink = () => {
			const windowURL = window.location.href;
			const splitURL = windowURL.split("/"); 
			setActiveLink(splitURL[splitURL.length-1])
		}

		retrieveActiveLink()
	})

	return (
		<>
			<div className="navbar">
				<Link to="/"><img id="logo" src={Logo} /></Link>
				<img className="meniu-mobile" src={MenuIcon} onClick={toggleMenu} />
				<div className={show_menu ? "menu show" : "menu"}>
					<div className="links">
						<Link className={activeLink == "" ? "active" : ""} to="/">ACASĂ</Link>
						<Link className={activeLink == "servicii" ? "active" : ""} to="/servicii">SERVICII</Link>
						<Link className={activeLink == "programare" ? "active" : ""}to="/programare">PROGRAMEAZĂ-TE</Link>
						<Link className={activeLink == "contact" ? "active" : ""}to="/contact">CONTACT</Link>
					</div>
				</div>
			</div>
		</>
	);
}

export default Navbar;
