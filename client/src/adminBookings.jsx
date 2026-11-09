import "./adminBookings.css";

// >=========> IMG IMPORT <==========<
import loading from "./assets/loading.svg"
import edit from "./assets/edit.png";
import Select from "./Select";
// <=================================>
import { useEffect, useState } from "react";
import axios from "axios";
import { getAvailableBookingSlots, getBookingDates, getBookingsFor } from "./DBUtils";

function AdminBookings() {
  const [reloadVar, setReloadVar] = useState(-1);
  const [loadingFlag, setLoading] = useState(false);
	const [dayOps, setDayOps] = useState(null);

	const [currentRowEdited, setCurrentEdited] = useState(-1);
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

	// >===================> Day options for booking viewing <=================<
	useEffect(() => {
		const fetchData = async () => {

      const dates = await getBookingDates();
			setDayOps(dates);
      setSelectedDay(dates[0].value);
      setTimeout(null, 10)
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
  let cancelled = false;

  async function loadBookings() {
    setBookings([]);
    setLoading(true);

    try {
      const entries_data = await getBookingsFor(selectedDay);
      if (cancelled) return;

      if (entries_data) {
        setBookings(
          [...entries_data].sort((a, b) => toMin(a.time) - toMin(b.time)),
        );
      }
    } finally {
      if (!cancelled) setLoading(false);
    }
  }

  loadBookings();

  return () => {
    cancelled = true;
  };
}, [selectedDay, reloadVar]);
	// <=================================================================>

	// >===================> Edit options loading <======================<
	useEffect(() => {
		const getServiceOps = async () => {
			const dbData = (await axios.get("/api/work-info/")).data; // Retrieve db data for work info

			setEditServiceOps(dbData.services); // Set Service Ops
		};

		if (currentRowEdited != -1) getServiceOps();
	}, [currentRowEdited, bookings]);

	useEffect(() => {
		const getEditTimeOptions = async () => {
      setEditTimeOps([])
      const hour_slots = await getAvailableBookingSlots(editServiceSelect, editDaySelect).then(
        
      );

      const final_slots = hour_slots.map((a) => ({
        value: formatTime(a),
        label: <p>{formatTime(a)}</p>
        })
      );
      
      setEditTimeOps(final_slots)
		};

		if (currentRowEdited != -1) getEditTimeOptions();
	}, [
    currentRowEdited,
    editDaySelect,
		editServiceSelect
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
    setTimeout(() => setShowEditWindow(true), 400);

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

	return (
		<>
			<div className="bookings-ct">
					{/* >===========================================================< */}
					<div className="day-slider-ct">
						<Select options={dayOps} selected={selectedDay} onChange={setSelectedDay}/>
					</div>
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
            {loadingFlag && <img className="bookingsLoadingAnim" src={ loading} />}
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
							options={dayOps}
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
							placeholder="Detalii suplimentare"
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
