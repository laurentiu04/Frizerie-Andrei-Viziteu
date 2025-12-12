import { StrictMode } from "react";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import * as ReactDOM from "react-dom/client";
import * as React from "react";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter basename="/Frizerie-Andrei-Viziteu">
			<App />
		</BrowserRouter>
	</React.StrictMode>,
);
