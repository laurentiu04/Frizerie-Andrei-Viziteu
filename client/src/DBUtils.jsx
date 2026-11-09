import axios from "axios";

export async function getBookingsFor(day) {
  const bookings = (await axios.get("/api/bookings", { params: { day: day } })).data;

  return bookings;
}

export async function getBookings() {
  const bookings = (await axios.get("/api/bookings")).data;

  return bookings;
}

export const toMin = (timeStr) => {
			if (!timeStr) return 0;
			const [h, m] = timeStr.split(":").map(Number);
			return h * 60 + m;
		};

export const formatTime = (totalMinutes) => {
			const h = Math.floor(totalMinutes / 60);
			const m = totalMinutes % 60;
			return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

/**
 * This function calculates all the available booking slots
 * for the provided date and service
 * @returns The calculated hour slots
 */
export async function getAvailableBookingSlots(selectedService, selectedDay) {

  try {
    const [dbData, bookingsResponse] = await Promise.all([axios.get("/api/work-info").then((res) => res.data),
      getBookingsFor(selectedDay)])
				const openHour = parseInt(dbData.start_hour);
				const closeHour = parseInt(dbData.end_hour);

				const gridInterval = 15;
				const serviceDuration = Number(selectedService.time);

				const existingBookings = bookingsResponse
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

				// ---- CALCUL TIMP CURENT ----
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
				// -----------------------------

				let currentTime = workStartMin;

				while (currentTime <= workEndMin - serviceDuration) {
					const slotStart = currentTime;
					const slotEnd = slotStart + serviceDuration;

					if (slotEnd > workEndMin) break;

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

						if (gapBefore !== 15 && gapAfter !== 15) {
							possibleSlots.push(slotStart);
						}
					}

					currentTime += gridInterval;
				}

				const finalSlots = possibleSlots
					.sort((a, b) => a - b)
					.filter((min) => {
						// dacă ziua selectată este azi → eliminăm orele trecute
						if (selectedDay === todayStr) {
							return min > currentTotalMinutes + 5; // mic buffer
						}
						return true;
					})

        return finalSlots;
			} catch (error) {
				console.error("Eroare la generarea sloturilor:", error);
			}
}

/**
 * This function creates an array of strings containing the next 31 days from the current one,
 * all formated in the form of "{day} {month}"
 * @returns The next 31 dates from the current one
 */
export async function getBookingDates() {
  const freeDays = (await axios.get("/api/work-info")).data.free_days;

  const dayOptions = [];

  const dateOptions = {
				month: "short",
				day: "numeric",
				weekday: "long",
			};

  for (var i = 0; i < 31; i++) {
    const fullDate = new Date(
      new Date().getTime() + i * (1000 * 60 * 60 * 24),
    ).toLocaleDateString("ro-RO", dateOptions);
    const date = fullDate
      .split(",")[1]
      .replace(".", "")
      .replace(" ", "")
      .replace("sept", "sep");
    const weekday = fullDate.split(",")[0];

    if (weekday == "duminică") continue;
    if (
      freeDays != undefined &&
      (freeDays.includes(date) ||
        freeDays.includes(date + " " + new Date().getFullYear().toString()))
    )
      continue;

    dayOptions.push({
      value: date,
      label: (
        <>
          <p>{date}</p> <p className="subtitle">{weekday}</p>
        </>
      ),
    });
  }
  1
  return dayOptions;
}
