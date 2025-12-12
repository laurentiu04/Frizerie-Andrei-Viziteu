import "./navbar.css";
import Logo from "./assets/Logo.svg";
import { Link } from "react-router-dom";
import MenuIcon from "./assets/menu-icon.svg";
import { useState } from "react";

function Navbar() {
	const [show_menu, setMenu] = useState(false);

	const toggleMenu = () => {
		setMenu(!show_menu);
	};

	return (
		<>
			<div className="navbar">
				<img id="logo" src={Logo} />
				<img className="meniu-mobile" src={MenuIcon} onClick={toggleMenu} />
				<div className={show_menu ? "menu show" : "menu"}>
					<div className="links">
						<Link to="/">ACASĂ</Link>
						<Link to="/servicii">SERVICII</Link>
						<Link to="/programare">PROGRAMEAZĂ-TE</Link>
						<Link to="/contact">CONTACT</Link>
					</div>
				</div>
			</div>
		</>
	);
}

export default Navbar;
