import "./adminSchedule.css";

import { useEffect, useRef, useState } from "react";
import Select from "./Select";
import axios from "axios";

import clock_img from "./assets/clock.png";
import free_day_img from "./assets/free_day.png";
import plus_img from "./assets/plus.png";
import scissors_img from "./assets/scissors.png";
import delete_img from "./assets/delete.png";

function AdminSchedule() {
	function restrictLetter(e) {
		// Permitem tastele de control (Backspace, Delete, Tab, Escape, Enter, Săgeți)
		const isControlKey = [
			"Backspace",
			"Delete",
			"Tab",
			"Escape",
			"Enter",
			"ArrowLeft",
			"ArrowRight",
			"ArrowUp",
			"ArrowDown",
		].includes(e.key);

		// Dacă nu este tastă de control și nu este cifră (0-9), blocăm acțiunea
		if (!isControlKey && !/[0-9]/.test(e.key)) {
			e.preventDefault();
		}
	}

	const start_hour_ref = useRef(null);
	const end_hour_ref = useRef(null);

	const [dataLoaded, setDataLoaded] = useState();
	const [saving, setSaving] = useState(false);

	const [currentWorkData, setCurrentWorkData] = useState(null);

	// >>--------> work time vars <--------<<
	const [startHour, setStartHour] = useState("");
	const [endHour, setEndHour] = useState("");

	// >>-------> free days vars <---------<<
	const [yearOps, setYearOps] = useState(null);
	const [monthOps, setMonthOps] = useState(null);
	const [dayOps, setDayOps] = useState(null);

	const [year, setYear] = useState(null);
	const [yearDisplay, showYear] = useState(false);
	const [month, setMonth] = useState(null);
	const [day, setDay] = useState(null);

	const [freeDays, setFreeDays] = useState(null);
	const [deletedFreeDays, setDeleted] = useState(null);
	const [addDayMenu, setAddDayMenu] = useState(false);

	const [services, setUpdatedServices] = useState([]);
	const [newEdit, setNewEdit] = useState(false);

	useEffect(() => {
		const getWorkData = async () => {
			try {
				const workData = await axios.get("/api/work-info");

				if (workData.data == null) console.log("no work data found");
				else {
					setCurrentWorkData(workData.data);
					console.log("Loaded data:", workData.data);
				}

				setDataLoaded(true);
			} catch (error) {
				console.log("Error while trying to retrieve work data: ", error);
			}
		};

		getWorkData();
	}, []);

	function setVarToDefault() {
		start_hour_ref.current.value = "";
		end_hour_ref.current.value = "";
		setStartHour("");
		setEndHour("");
		setFreeDays(null);
		setDeleted(null);
		setUpdatedServices([]);
	}

	function handleStartTime() {
		var start_hour = start_hour_ref.current.value;
		if (parseInt(start_hour) > 24) {
			start_hour = "24";
			setStartHour("24");
		} else {
			setStartHour(start_hour);
		}
	}

	function handleEndTime() {
		let end_hour = end_hour_ref.current.value;
		if (parseInt(end_hour) > 24) {
			end_hour = "24";
			setEndHour("24");
		} else {
			setEndHour(end_hour);
		}
	}

	function isInvalidTime() {
		const sh = parseInt(startHour);
		const eh = parseInt(endHour);

		if (startHour !== "" && endHour === "") {
			if (currentWorkData != null) {
				return sh >= parseInt(currentWorkData.end_hour);
			} else {
				return true;
			}
		} else if (startHour !== "" && endHour !== "") {
			// console.log(startHour + " > " + endHour, startHour > endHour)
			return sh >= eh;
		} else if (startHour === "" && endHour !== "") {
			if (currentWorkData != null) {
				return parseInt(currentWorkData.start_hour) > eh;
			} else {
				return true;
			}
		} else {
			return false;
		}
	}

	const isNewTime = () => {
		if (currentWorkData != null) {
			if (startHour === "" && endHour === "") return false;
			else if (
				startHour !== currentWorkData.start_hour ||
				endHour !== currentWorkData.end_hour
			)
				return true;
			else return false;
		} else {
			if (startHour !== "" || endHour !== "") return true;
			else return false;
		}
	};

	const handleDayDelete = (ev) => {
		const parentText = ev.target.parentElement.innerText;

		if (deletedFreeDays === null) setDeleted([parentText]);
		else {
			if (!deletedFreeDays.includes(parentText))
				setDeleted((prev) => prev.concat([parentText]));
			else setDeleted(deletedFreeDays.filter((el) => el != parentText));
		}
	};

	//TODO: fa ca zilele libere care au trecut sa fie sterse din baza de date

	useEffect(() => {
		const getYearOps = () => {
			const currYear = new Date(Date.now()).getFullYear();
			const years = [{ value: currYear.toString(), label: <p>{currYear}</p> }];

			for (let i = 1; i <= 10; i++) {
				years.push({
					value: (currYear + i).toString(),
					label: <p>{currYear + i}</p>,
				});
			}
			setYearOps(years);
		};

		getYearOps();
	}, [addDayMenu]);

	useEffect(() => {
		const getMonthOps = () => {
			const months = [
				"ian",
				"feb",
				"mar",
				"apr",
				"mai",
				"iun",
				"iul",
				"aug",
				"sep",
				"oct",
				"noi",
				"dec",
			];

			setMonthOps(
				months.map((month) => ({
					value: month,
					label: <p>{month}</p>,
				})),
			);
		};

		getMonthOps();
	}, [addDayMenu]);

	useEffect(() => {
		const getDayOps = () => {
			// how data looks inside db: "12 ian" or "12 ian 2026"
			const months = [
				"ian",
				"feb",
				"mar",
				"apr",
				"mai",
				"iun",
				"iul",
				"aug",
				"sep",
				"oct",
				"noi",
				"dec",
			];

			const days = [];
			let currFreeDays = freeDays || [];

			if (currentWorkData?.free_days)
				currFreeDays = currentWorkData.free_days.concat(currFreeDays);
			const monthIndex = months.indexOf(month);

			const lastDayOfMonth = new Date(2026, monthIndex + 1, 0).getDate();

			for (let i = 1; i <= lastDayOfMonth; i++) {
				if (yearDisplay) {
					if (
						!currFreeDays.includes(
							`${i} ${month}${year == null ? "" : " " + year}`,
						)
					)
						days.push({ value: i.toString(), label: <p>{i}</p> });
				} else {
					if (!currFreeDays.includes(`${i} ${month}`))
						days.push({ value: i.toString(), label: <p>{i}</p> });
				}
			}

			setDayOps(days);
		};

		if (month != null) getDayOps();
	}, [month, year, yearDisplay, freeDays, currentWorkData]);

	useEffect(() => {
		const checkNewEdit = () => {
			setNewEdit(
				document.getElementsByClassName("new").length != 0 &&
					document.getElementsByClassName("invalid").length == 0,
			);
		};

		checkNewEdit();
	}, [startHour, endHour, freeDays, deletedFreeDays, services]);

	const handleServiceUpdate = (ev, index) => {
		const updatedService = document.getElementsByClassName("service")[index];
		const serviceName =
			updatedService.getElementsByClassName("name-input")[0].value;
		const servicePrice =
			updatedService.getElementsByClassName("price-input")[0].value;
		const serviceTime =
			updatedService.getElementsByClassName("time-input")[0].value;
		
		if (serviceName == "" && servicePrice == "" && serviceTime == "" && services.includes(index))
		{
			const updatedServices = services.filter(el => el != index);
			setUpdatedServices(updatedServices);
		}
		else if (!services.includes(index)){
			setUpdatedServices(prev => prev.concat(index))
		}

		setTimeout(null, 10);
	};

	async function saveEdit() {
		setSaving(true);
		const changes = {};

		if (startHour != "") changes.start_hour = startHour;
		if (endHour != "") changes.end_hour = endHour;

		// Daca am zile noi, si am date in database
		if (freeDays != null && currentWorkData?.free_days) {
			if (deletedFreeDays != null)
				changes.free_days = currentWorkData?.free_days
					.concat(freeDays)
					.filter((item) => !deletedFreeDays.includes(item));
			else changes.free_days = currentWorkData?.free_days.concat(freeDays);
		} else if (freeDays != null) {
			changes.free_days = freeDays;
		} else if (deletedFreeDays != null) {
			changes.free_days = currentWorkData?.free_days.filter(
				(item) => !deletedFreeDays.includes(item),
			);
		}

		if (services.length != 0) {
			const newServiceDetails = [0, 1, 2, 3].map(index => {
				const service = document.getElementsByClassName("service")[index];
				const inputFields = service.getElementsByTagName("input");

				const dbServiceInfo = currentWorkData.services[index];

				const name = inputFields[0].value != "" ? inputFields[0].value : dbServiceInfo.name;
				const price = inputFields[1].value != "" ? parseInt(inputFields[1].value) : dbServiceInfo.price;
				const time = inputFields[2].value != "" ? parseInt(inputFields[2].value) : dbServiceInfo.time;
				const imageURL = dbServiceInfo.imageURL;

				return {
					name: name,
					price: price,
					time: time,
					imageURL: imageURL
				}
			})

			changes.services = newServiceDetails;
		}

		console.log(changes);

		try {
			const response = await axios.post("/api/work-info", changes);
			if (response.status == 200) {
				setSaving(false);
				window.location.reload();
			}
		} catch (error) {
			console.log(error);
		}
	}

	return !dataLoaded ? (
		<>
			<p>loading data...</p>
		</>
	) : (
		<>
			<div className="schedule-ct">
				{/* >==============> WORK TIME <=================< */}
				<div className="edit work-time">
					<div className="title">
						<img className="icon" src={clock_img} />
						<p>Interval orar</p>
					</div>
					<div>
						<p>de la</p>
						<input
							className={
								isInvalidTime()
									? "start-time invalid"
									: isNewTime()
										? "start-time new"
										: "start-time"
							}
							maxLength={2}
							ref={start_hour_ref}
							placeholder={
								currentWorkData ? currentWorkData.start_hour + ":00" : null
							}
							onFocus={() => {
								start_hour_ref.current.value = startHour;
							}}
							onBlur={() => {
								if (startHour) start_hour_ref.current.value = startHour + ":00";
							}}
							onKeyDown={restrictLetter}
							onChange={handleStartTime}
						></input>
					</div>
					<div>
						<p>până la</p>
						<input
							className={
								isInvalidTime()
									? "end-time invalid"
									: isNewTime()
										? "end-time new"
										: "end-time"
							}
							maxLength={2}
							ref={end_hour_ref}
							placeholder={
								currentWorkData ? currentWorkData.end_hour + ":00" : null
							}
							onFocus={() => {
								end_hour_ref.current.value = endHour;
							}}
							onBlur={() => {
								if (endHour) end_hour_ref.current.value = endHour + ":00";
							}}
							onKeyDown={restrictLetter}
							onChange={handleEndTime}
						></input>
					</div>
				</div>
				{/* >==============> WORK DAYS <=================< */}
				<div className="edit work-days">
					<div className="title">
						<img className="icon" src={free_day_img} />
						<p>Zile libere</p>
					</div>
					{addDayMenu ? (
						<>
							<div className="select-day">
								<div style={{ display: "inline-flex", alignItems: "center" }}>
									<Select
										className={yearDisplay == false ? " disable" : null}
										options={yearOps}
										onChange={(val) => {
											setYear(val);
											setTimeout(null, 10);
										}}
									/>
									<input
										className="displayYear"
										type="checkbox"
										onClick={(ev) => {
											showYear(ev.target.checked);
										}}
									></input>
								</div>
								<Select
									options={monthOps}
									onChange={(val) => {
										setMonth(val);
										setTimeout(null, 10);
									}}
								/>
								{month && (
									<Select
										options={dayOps}
										onChange={(val) => {
											setDay(val);
											setTimeout(null, 10);
										}}
									/>
								)}
							</div>
							<div className="actions">
								<span
									className={day != "" && month != "" ? "add" : "add disabled"}
									onClick={() => {
										freeDays != null
											? setFreeDays((prev) =>
													prev.concat(
														`${day} ${month}${year == null ? "" : " " + year}`,
													),
												)
											: setFreeDays([
													`${day} ${month}${year == null ? "" : " " + year}`,
												]);
										setAddDayMenu(false);
										setDay(null);
										setMonth(null);
										setYear(null);
									}}
								>
									<p>Ok</p>
								</span>
								<span
									className="cancel"
									onClick={() => {
										setAddDayMenu(false);
										setDay(null);
										setMonth(null);
										setYear(null);
									}}
								>
									<p>X</p>
								</span>
							</div>
						</>
					) : (
						<span className="add-day" onClick={() => setAddDayMenu(true)}>
							<img className="icon" src={plus_img} />
						</span>
					)}
					<div className="freeDays">
						{currentWorkData.free_days?.map((day) => (
							<span
								className={
									deletedFreeDays != null && deletedFreeDays.includes(day)
										? "elem delete new"
										: "elem"
								}
								key={day}
							>
								{day}
								<img src={delete_img} onClick={handleDayDelete} />
							</span>
						))}
					</div>
					{freeDays != null && (
						<div className="newFreeDays">
							{freeDays.map((day) => (
								<span className="elem new" key={day}>
									{day}
									<img
										src={plus_img}
										onClick={(event) => {
											if (freeDays.length == 1) {
												setFreeDays(null);
												return;
											}

											const elemLabel =
												event.currentTarget.parentElement.textContent;
											const newList = freeDays.filter(
												(item) => item != elemLabel,
											);
											setFreeDays(newList);
										}}
									/>
								</span>
							))}
						</div>
					)}
				</div>

				{/* >==============> SERVICE DETAILS <=================< */}
				<div className="edit service-details">
					<div className="title">
						<img className="icon" src={scissors_img} />
						<p>Detalii servicii</p>
					</div>
					{currentWorkData != null && currentWorkData.services ? (
						<div className="services">
							{currentWorkData.services.map((service, index) => (
								<div key={service.name} className={services.includes(index) ? "service new" : "service"}>
									<div className="name">
										<p className="label">Denumire</p>
										<input
											className="name-input"
											placeholder={service.name}
											onChange={(ev) => handleServiceUpdate(ev, index)}
										></input>
									</div>
									<div className="price">
										<p className="label">Preț</p>
										<input
											className="price-input"
											maxLength={3}
											placeholder={service.price}
											onChange={(ev) => handleServiceUpdate(ev, index)}
										></input>
									</div>
									<div className="time">
										<p className="label">Durată</p>
										<div>
											<input
												className="time-input"
												maxLength={2}
												placeholder={service.time}
												onChange={(ev) =>
													handleServiceUpdate(ev, index)
												}
											></input>
										</div>
									</div>
								</div>
							))}
						</div>
					) : null}
				</div>
				<div className={newEdit ? "edit-actions" : "edit-actions disabled"}>
					<span
						onClick={saveEdit}
						className={saving ? "save-edit saving" : "save-edit"}
					>
						Salvează
					</span>
					<span
						className={saving ? "cancel-edit saving" : "cancel-edit"}
						onClick={setVarToDefault}
					>
						Anulează
					</span>
				</div>
			</div>
		</>
	);
}

export default AdminSchedule;
