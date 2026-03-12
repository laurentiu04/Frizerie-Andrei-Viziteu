import "./adminBookings.css";

// >=========> IMG IMPORT <==========<
import arrow from "./assets/arrow.png";
import edit from "./assets/edit.png";
import Select from "./Select";
// <=================================>
import { useEffect, useState } from "react";
import axios from "axios";

function AdminBookings() {
	const [reloadVar, setReloadVar] = useState(-1);
	const [dayOps, setDayOps] = useState(null);

	const [currentRowEdited, setCurrentEdited] = useState(-1);

	const [editDayOps, setEditDayOps] = useState(null);
	const [editDaySelect, setEditDaySelect] = useState(null);

	const [editID, setEditID] = useState("");
	const [editName, setEditName] = useState("");
	const [editPhone, setEditPhone] = useState("");
	const [editDetails, setEditDetails] = useState("");

	const [editTimeOps, setEditTimeOps] = useState(null);
	const [editTimeSelect, setEditTimeSelect] = useState(null);

	const [editServiceOps, setEditServiceOps] = useState(null);
	const [editServiceSelect, setEditServiceSelect] = useState(null);

	const [showEditWindow, setShowEditWindow] = useState(false);

	// >===================> Day options for booking viewing <=============<
	useEffect(() => {
		const fetchData = async () => {
			const dateOptions = {
				month: "short",
				day: "numeric",
				weekday: "long",
			};

			const freeDays = (await axios.get("/api/work-info/")).data.free_days;
			const dayOptions = [];

			for (var i = 0; i < 31; i++) {
				const fullDate = new Date(
					new Date().getTime() + i * (1000 * 60 * 60 * 24),
				).toLocaleDateString("ro-RO", dateOptions);
				const date = fullDate.split(",")[1].replace(".", "").replace(" ", "");
				const weekday = fullDate.split(",")[0];

				if (weekday == "duminică") continue;
				if (
					freeDays != undefined &&
					(freeDays.includes(date) ||
						freeDays.includes(date + " " + new Date().getFullYear().toString()))
				)
					continue;

				// console.log(date.substring(1, 7), date.length, freeDays[2].length);

				dayOptions.push(date);
			}
			setDayOps(dayOptions);
			setSelectedDay([dayOptions[0], 0]);
		};

		fetchData();
	}, []);

	// <==========================================================>

	const [selectedDay, setSelectedDay] = useState(["", -1]);

	const [bookings, setBookings] = useState([]);
	const toMin = (timeStr) => {
		if (!timeStr) return 0;
		const [h, m] = timeStr.split(":").map(Number);
		return h * 60 + m;
	};

	const formatTime = (totalMinutes) => {
		const h = Math.floor(totalMinutes / 60);
		const m = totalMinutes % 60;
		return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
	};

	// >=================> Bookings loading for selected day <===============<
	useEffect(() => {
		async function loadBookings() {
			setBookings([]);
			const entries_data = await axios.get("/api/bookings", {
				params: { day: selectedDay[0] },
			});

			if (entries_data) {
				setBookings(
					entries_data.data.sort((a, b) => {
						return toMin(a.time) - toMin(b.time);
					}),
				);
			}
		}

		loadBookings();
	}, [selectedDay, reloadVar]);
	// <=================================================================>

	// >===================> Edit options loading <======================<
	useEffect(() => {
		const getEditDayOptions = async () => {
			const dbData = (await axios.get("/api/work-info/")).data; // Retrieve db data for work info

			setEditServiceOps(dbData.services); // Set Service Ops

			const dateOptions = {
				month: "short",
				day: "numeric",
				weekday: "long",
			};

			const freeDays = dbData.free_days;
			const dayOptions = [];

			for (var i = 0; i < 31; i++) {
				const fullDate = new Date(
					new Date().getTime() + i * (1000 * 60 * 60 * 24),
				).toLocaleDateString("ro-RO", dateOptions);
				const date = fullDate.split(",")[1].replace(".", "").replace(" ", "");
				const weekday = fullDate.split(",")[0];

				if (weekday == "duminică") continue;
				if (
					freeDays != undefined &&
					(freeDays.includes(date) ||
						freeDays.includes(date + " " + new Date().getFullYear().toString()))
				)
					continue;

				// console.log(date.substring(1, 7), date.length, freeDays[2].length);

				dayOptions.push({
					value: date,
					label: (
						<>
							<p>{date}</p> <p className="subtitle">{weekday}</p>
						</>
					),
				});
			}
			setEditDayOps(dayOptions);
		};

		if (currentRowEdited != -1) getEditDayOptions();
	}, [currentRowEdited, bookings]);

	useEffect(() => {
		const getEditTimeOptions = async () => {
			try {
				setEditTimeOps([]);

				const dbData = (await axios.get("/api/work-info")).data;
				const openHour = parseInt(dbData.start_hour);
				const closeHour = parseInt(dbData.end_hour);

				const gridInterval = 15;
				const serviceDuration = Number(editServiceSelect.time);

				const bookingsResponse = await axios.get("/api/bookings", {
					params: { day: editDaySelect },
				});

				// EXCLUD programarea curentă
				const existingBookings = bookingsResponse.data
					.filter((b) => String(b._id) !== String(editID))
					.map((b) => {
						const start = toMin(b.time);
						return {
							...b,
							startMin: start,
							endMin: start + Number(b.service?.time || 0),
						};
					})
					.sort((a, b) => a.startMin - b.startMin);

				const workStartMin = openHour * 60;
				const workEndMin = closeHour * 60;

				const possibleSlots = [];

				// --- TIME CHECK (pentru azi) ---
				const now = new Date();
				const monthNames = [
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

				const todayStr = `${now.getDate()} ${monthNames[now.getMonth()]}`;
				const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();
				// --------------------------------

				let currentTime = workStartMin;

				while (currentTime <= workEndMin - serviceDuration) {
					const slotStart = currentTime;
					const slotEnd = slotStart + serviceDuration;

					if (slotEnd > workEndMin) break;

					// verificare overlap
					const hasOverlap = existingBookings.some(
						(b) => slotStart < b.endMin && slotEnd > b.startMin,
					);

					if (!hasOverlap) {
						const prevBooking = [...existingBookings]
							.reverse()
							.find((b) => b.endMin <= slotStart);

						const nextBooking = existingBookings.find(
							(b) => b.startMin >= slotEnd,
						);

						const gapBefore = prevBooking
							? slotStart - prevBooking.endMin
							: slotStart - workStartMin;

						const gapAfter = nextBooking
							? nextBooking.startMin - slotEnd
							: workEndMin - slotEnd;

						// REGULA ALGORITMULUI
						if (gapBefore !== 15 && gapAfter !== 15) {
							possibleSlots.push(slotStart);
						}
					}

					currentTime += gridInterval;
				}

				const finalSlots = possibleSlots
					.sort((a, b) => a - b)
					.filter((min) => {
						if (editDaySelect === todayStr) {
							return min > currentTotalMinutes + 5;
						}
						return true;
					})
					.map((a) => {
						const formattedTime = formatTime(a);
						return {
							value: formattedTime,
							label: <p>{formattedTime}</p>,
						};
					});

				setEditTimeOps(finalSlots);

				if (!finalSlots.some((e) => e.value === editTimeSelect)) {
					setEditTimeSelect("");
				}
			} catch (error) {
				console.error("Eroare la generarea sloturilor edit:", error);
			}
		};

		if (currentRowEdited != -1) getEditTimeOptions();
	}, [
		currentRowEdited,
		bookings,
		editDaySelect,
		editServiceSelect,
		editTimeSelect,
		editID,
	]);

	// <========================================================>

	const setToEdit = (index) => {
		const currentData = bookings[index];
		setEditID(currentData._id);
		setEditName(currentData.name);
		setEditPhone(currentData.phone);
		setEditDetails(currentData.details);
		setEditDaySelect(currentData.day);
		setEditTimeSelect(currentData.time);
		setEditServiceSelect(currentData.service);
		setCurrentEdited(index);
		setTimeout(() => setShowEditWindow(true), 350);
	};

	const cancelEdit = () => {
		setCurrentEdited(-1);
		setShowEditWindow(false);
	};

	const deleteBooking = async (ev, id) => {
		const className = ev.currentTarget.className;
		if (!className.includes("confirm")) {
			ev.currentTarget.className = "delete confirm";
			ev.currentTarget.innerText = "Confirmi?";
		} else {
			try {
				// Trimitem cererea DELETE către URL-ul specific cu ID-ul la final
				const response = await axios.delete(`api/bookings/${id}`);

				if (response.status === 200) {
					alert("Stergere efectuată cu succes!");
					setReloadVar(reloadVar * -1);
					cancelEdit();
				}
			} catch (error) {
				console.error(
					"Eroare la ștergere:",
					error.response?.data?.msg || error.message,
				);
				alert("Nu s-a putut șterge programarea.");
			}
		}
	};

	const saveEdit = async (el) => {
		el.preventDefault();

		if (editTimeSelect == "") return;

		const bookingData = {
			_id: editID,
			name: editName,
			phone: editPhone,
			service: editServiceSelect,
			details: editDetails,
			day: editDaySelect,
			time: editTimeSelect,
			timestamp: new Date().toISOString(),
		};

		try {
			// 2. Send the POST request to your running server endpoint
			const response = await axios.post("/api/bookings", bookingData);

			console.log("✅ Booking successfully saved:", response.data);
			alert("Editare efectuată cu succes!");
			setReloadVar(reloadVar * -1);
			cancelEdit();
		} catch (error) {
			console.error(
				"❌ Error saving booking:",
				error.response ? error.response.data : error.message,
			);
			alert("Editare esuată! Încearcă din nou.");
			cancelEdit();
		}
	};

	function handleDaySelect(e) {
		const tagName = e.target.tagName.toLowerCase();
		var day, index;

		if (tagName === "span") {
			day = e.currentTarget.dataset.value;
			index = e.currentTarget.dataset.index;
		} else {
			const iconName = e.target.className;

			if (iconName === "next" && selectedDay[1] < 31) {
				index = parseInt(selectedDay[1]) + 1;
			} else if (iconName === "previous" && selectedDay[1] > 0) {
				index = parseInt(selectedDay[1]) - 1;
			} else {
				return;
			}

			day = dayOps[index];
		}

		if (day == null) return;
		setSelectedDay([day, index]);

		setTimeout(() => {
			const slider = document.querySelector(".day-slider-elems");
			if (slider && slider.children[index]) {
				const selected = slider.children[index];
				selected.scrollIntoView({
					inline: "start",
					behavior: "smooth",
				});
			}
		}, 0);
	}

	return (
		<>
			<div className="bookings-ct">
				<div className="day-selector">
					{/* >===========================================================< */}
					<img src={arrow} className="previous" onClick={handleDaySelect} />

					<div className="day-slider-ct">
						<span
							className={selectedDay[1] >= 23 ? "overlay hidden" : "overlay"}
						></span>
						<div className="day-slider-elems">
							{dayOps != null
								? dayOps.map((day, index) => (
										<span
											key={index}
											data-value={day}
											data-index={index}
											className={selectedDay[0] === day ? "selected-day" : ""}
											onClick={handleDaySelect}
										>
											{day}
										</span>
									))
								: null}
						</div>
					</div>
					<img src={arrow} className="next" onClick={handleDaySelect} />
				</div>{" "}
				{/* <====================================================================================> */}
				<div className="booklist-ct">
					<div className="grid-headers">
						<p>#</p>
						<p>Nume</p>
						<p>Telefon</p>
						<p>Ora</p>
						<p>Serviciu</p>
						<p>Detalii</p>
						<p>Creat la</p>
						<p>Edit</p>
					</div>
					<div className="bookings-list">
						{bookings.map((book, index) => (
							<div className="grid-row" key={index}>
								<p>{index + 1}</p>
								<p>{book.name}</p>
								<p>
									{book.phone.substring(0, 4) +
										" " +
										book.phone.substring(4, 7) +
										" " +
										book.phone.substring(7, 10)}
								</p>
								<p>{book.time}</p>
								<p>{book.service.name}</p>
								<p>{book.details || "-"}</p>
								<p>
									{new Date(book.bookedAt).toLocaleDateString("ro-RO")}
									<br></br>
									{new Date(book.bookedAt).toLocaleTimeString("ro-RO")}
								</p>
								<div className="edit-options">
									<img
										src={edit}
										className="edit-icon"
										onClick={() => {
											setToEdit(index);
										}}
										dataset-id={book._id}
									/>
									{/* {currentRowEdited == index && (
										<>
											<img className="accept" src={accept_edit} />
											<img
												className="cancel"
												src={cancel_edit}
												onClick={cancelEdit}
											/>
											<img
												className="delete"
												src = {delete_icon}
											/>
										</>
									)} */}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{showEditWindow == true && (
				<>
					<div className="edit-window-background"></div>
					<form className="edit-booking-window" onSubmit={saveEdit}>
						<h1>
							Editare <br />
							programare
						</h1>
						<input
							defaultValue={editName}
							onChange={(ev) => setEditName(ev.currentTarget.value)}
							required={true}
						/>
						<input
							defaultValue={editPhone}
							onChange={(ev) => setEditPhone(ev.currentTarget.value)}
							required={true}
						/>

						<div className="options-container">
							{editServiceOps &&
								editServiceOps.map((s) => (
									<div
										className={
											editServiceSelect.name === s.name
												? "option-card selected"
												: "option-card"
										}
										onClick={() => {
											setEditServiceSelect(s);
										}}
										key={s.name}
									>
										<img src={s.imageURL} />
										<p className="service-title">{s.name}</p>
										<p className="info">
											{s.time + " min | " + s.price + " ron"}
										</p>
									</div>
								))}
						</div>
						<Select
							options={editDayOps}
							selected={editDaySelect}
							onChange={setEditDaySelect}
						/>
						<Select
							options={editTimeOps}
							selected={editTimeSelect}
							onChange={setEditTimeSelect}
						/>
						<input
							defaultValue={editDetails}
							onChange={(ev) => setEditDetails(ev.currentTarget.value)}
						/>
						<div className="actions">
							<div
								className="delete"
								onClick={(ev) => deleteBooking(ev, editID)}
							>
								Șterge programarea
							</div>
							<div className="cancel" onClick={cancelEdit}>
								Anulează
							</div>
							<input type="submit" className="save" value="Salvează" />
						</div>
					</form>
				</>
			)}
		</>
	);
}

export default AdminBookings;
