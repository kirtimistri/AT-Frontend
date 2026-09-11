import assert from "node:assert/strict";
import { create } from "zustand";
//#region src/data/airports.ts
const AIRPORTS = [
	{
		iataCode: "PNQ",
		city: "Pune",
		airportName: "Pune International Airport",
		country: "India"
	},
	{
		iataCode: "BOM",
		city: "Mumbai",
		airportName: "Chhatrapati Shivaji Maharaj International Airport",
		country: "India"
	},
	{
		iataCode: "DEL",
		city: "New Delhi",
		airportName: "Indira Gandhi International Airport",
		country: "India"
	},
	{
		iataCode: "BLR",
		city: "Bengaluru",
		airportName: "Kempegowda International Airport",
		country: "India"
	},
	{
		iataCode: "HYD",
		city: "Hyderabad",
		airportName: "Rajiv Gandhi International Airport",
		country: "India"
	},
	{
		iataCode: "MAA",
		city: "Chennai",
		airportName: "Chennai International Airport",
		country: "India"
	},
	{
		iataCode: "CCU",
		city: "Kolkata",
		airportName: "Netaji Subhas Chandra Bose International Airport",
		country: "India"
	},
	{
		iataCode: "AMD",
		city: "Ahmedabad",
		airportName: "Sardar Vallabhbhai Patel International Airport",
		country: "India"
	},
	{
		iataCode: "GOI",
		city: "Goa",
		airportName: "Dabolim Goa International Airport",
		country: "India"
	},
	{
		iataCode: "COK",
		city: "Kochi",
		airportName: "Cochin International Airport",
		country: "India"
	},
	{
		iataCode: "JAI",
		city: "Jaipur",
		airportName: "Jaipur International Airport",
		country: "India"
	},
	{
		iataCode: "LKO",
		city: "Lucknow",
		airportName: "Chaudhary Charan Singh International Airport",
		country: "India"
	},
	{
		iataCode: "BBI",
		city: "Bhubaneswar",
		airportName: "Biju Patnaik International Airport",
		country: "India"
	},
	{
		iataCode: "IXC",
		city: "Chandigarh",
		airportName: "Chandigarh International Airport",
		country: "India"
	},
	{
		iataCode: "GAU",
		city: "Guwahati",
		airportName: "Lokpriya Gopinath Bordoloi International Airport",
		country: "India"
	},
	{
		iataCode: "PAT",
		city: "Patna",
		airportName: "Jay Prakash Narayan Airport",
		country: "India"
	},
	{
		iataCode: "NAG",
		city: "Nagpur",
		airportName: "Dr. Babasaheb Ambedkar International Airport",
		country: "India"
	},
	{
		iataCode: "SXR",
		city: "Srinagar",
		airportName: "Sheikh ul-Alam International Airport",
		country: "India"
	},
	{
		iataCode: "VNS",
		city: "Varanasi",
		airportName: "Lal Bahadur Shastri Airport",
		country: "India"
	},
	{
		iataCode: "TRV",
		city: "Thiruvananthapuram",
		airportName: "Trivandrum International Airport",
		country: "India"
	},
	{
		iataCode: "IDR",
		city: "Indore",
		airportName: "Devi Ahilyabai Holkar Airport",
		country: "India"
	},
	{
		iataCode: "ATQ",
		city: "Amritsar",
		airportName: "Sri Guru Ram Dass Jee International Airport",
		country: "India"
	},
	{
		iataCode: "IXR",
		city: "Ranchi",
		airportName: "Birsa Munda Airport",
		country: "India"
	},
	{
		iataCode: "CJB",
		city: "Coimbatore",
		airportName: "Coimbatore International Airport",
		country: "India"
	},
	{
		iataCode: "DXB",
		city: "Dubai",
		airportName: "Dubai International Airport",
		country: "United Arab Emirates"
	},
	{
		iataCode: "AUH",
		city: "Abu Dhabi",
		airportName: "Zayed International Airport",
		country: "United Arab Emirates"
	},
	{
		iataCode: "SHJ",
		city: "Sharjah",
		airportName: "Sharjah International Airport",
		country: "United Arab Emirates"
	},
	{
		iataCode: "SIN",
		city: "Singapore",
		airportName: "Changi Airport",
		country: "Singapore"
	},
	{
		iataCode: "BKK",
		city: "Bangkok",
		airportName: "Suvarnabhumi Airport",
		country: "Thailand"
	},
	{
		iataCode: "DMK",
		city: "Bangkok",
		airportName: "Don Mueang International Airport",
		country: "Thailand"
	},
	{
		iataCode: "HKT",
		city: "Phuket",
		airportName: "Phuket International Airport",
		country: "Thailand"
	},
	{
		iataCode: "CNX",
		city: "Chiang Mai",
		airportName: "Chiang Mai International Airport",
		country: "Thailand"
	},
	{
		iataCode: "LHR",
		city: "London",
		airportName: "Heathrow Airport",
		country: "United Kingdom"
	},
	{
		iataCode: "LGW",
		city: "London",
		airportName: "Gatwick Airport",
		country: "United Kingdom"
	},
	{
		iataCode: "MAN",
		city: "Manchester",
		airportName: "Manchester Airport",
		country: "United Kingdom"
	},
	{
		iataCode: "EDI",
		city: "Edinburgh",
		airportName: "Edinburgh Airport",
		country: "United Kingdom"
	},
	{
		iataCode: "JFK",
		city: "New York",
		airportName: "John F. Kennedy International Airport",
		country: "United States"
	},
	{
		iataCode: "EWR",
		city: "New York",
		airportName: "Newark Liberty International Airport",
		country: "United States"
	},
	{
		iataCode: "LGA",
		city: "New York",
		airportName: "LaGuardia Airport",
		country: "United States"
	},
	{
		iataCode: "LAX",
		city: "Los Angeles",
		airportName: "Los Angeles International Airport",
		country: "United States"
	},
	{
		iataCode: "SFO",
		city: "San Francisco",
		airportName: "San Francisco International Airport",
		country: "United States"
	},
	{
		iataCode: "ORD",
		city: "Chicago",
		airportName: "O'Hare International Airport",
		country: "United States"
	},
	{
		iataCode: "IAD",
		city: "Washington",
		airportName: "Washington Dulles International Airport",
		country: "United States"
	},
	{
		iataCode: "BOS",
		city: "Boston",
		airportName: "Boston Logan International Airport",
		country: "United States"
	},
	{
		iataCode: "MIA",
		city: "Miami",
		airportName: "Miami International Airport",
		country: "United States"
	},
	{
		iataCode: "SEA",
		city: "Seattle",
		airportName: "Seattle–Tacoma International Airport",
		country: "United States"
	},
	{
		iataCode: "ATL",
		city: "Atlanta",
		airportName: "Hartsfield–Jackson Atlanta International Airport",
		country: "United States"
	},
	{
		iataCode: "DFW",
		city: "Dallas",
		airportName: "Dallas/Fort Worth International Airport",
		country: "United States"
	},
	{
		iataCode: "CDG",
		city: "Paris",
		airportName: "Charles de Gaulle Airport",
		country: "France"
	},
	{
		iataCode: "ORY",
		city: "Paris",
		airportName: "Orly Airport",
		country: "France"
	},
	{
		iataCode: "FRA",
		city: "Frankfurt",
		airportName: "Frankfurt Airport",
		country: "Germany"
	},
	{
		iataCode: "MUC",
		city: "Munich",
		airportName: "Munich Airport",
		country: "Germany"
	},
	{
		iataCode: "AMS",
		city: "Amsterdam",
		airportName: "Amsterdam Airport Schiphol",
		country: "Netherlands"
	},
	{
		iataCode: "MAD",
		city: "Madrid",
		airportName: "Adolfo Suárez Madrid–Barajas Airport",
		country: "Spain"
	},
	{
		iataCode: "BCN",
		city: "Barcelona",
		airportName: "Josep Tarradellas Barcelona–El Prat Airport",
		country: "Spain"
	},
	{
		iataCode: "FCO",
		city: "Rome",
		airportName: "Leonardo da Vinci–Fiumicino Airport",
		country: "Italy"
	},
	{
		iataCode: "ZRH",
		city: "Zurich",
		airportName: "Zurich Airport",
		country: "Switzerland"
	},
	{
		iataCode: "VIE",
		city: "Vienna",
		airportName: "Vienna International Airport",
		country: "Austria"
	},
	{
		iataCode: "CPH",
		city: "Copenhagen",
		airportName: "Copenhagen Airport",
		country: "Denmark"
	},
	{
		iataCode: "LIS",
		city: "Lisbon",
		airportName: "Humberto Delgado Airport",
		country: "Portugal"
	},
	{
		iataCode: "IST",
		city: "Istanbul",
		airportName: "Istanbul Airport",
		country: "Turkey"
	},
	{
		iataCode: "SYD",
		city: "Sydney",
		airportName: "Sydney Airport",
		country: "Australia"
	},
	{
		iataCode: "MEL",
		city: "Melbourne",
		airportName: "Melbourne Airport",
		country: "Australia"
	},
	{
		iataCode: "BNE",
		city: "Brisbane",
		airportName: "Brisbane Airport",
		country: "Australia"
	},
	{
		iataCode: "PER",
		city: "Perth",
		airportName: "Perth Airport",
		country: "Australia"
	},
	{
		iataCode: "HKG",
		city: "Hong Kong",
		airportName: "Hong Kong International Airport",
		country: "Hong Kong"
	},
	{
		iataCode: "NRT",
		city: "Tokyo",
		airportName: "Narita International Airport",
		country: "Japan"
	},
	{
		iataCode: "HND",
		city: "Tokyo",
		airportName: "Haneda Airport",
		country: "Japan"
	},
	{
		iataCode: "ICN",
		city: "Seoul",
		airportName: "Incheon International Airport",
		country: "South Korea"
	},
	{
		iataCode: "KUL",
		city: "Kuala Lumpur",
		airportName: "Kuala Lumpur International Airport",
		country: "Malaysia"
	},
	{
		iataCode: "CGK",
		city: "Jakarta",
		airportName: "Soekarno–Hatta International Airport",
		country: "Indonesia"
	},
	{
		iataCode: "DPS",
		city: "Bali",
		airportName: "Ngurah Rai International Airport",
		country: "Indonesia"
	},
	{
		iataCode: "MNL",
		city: "Manila",
		airportName: "Ninoy Aquino International Airport",
		country: "Philippines"
	},
	{
		iataCode: "SGN",
		city: "Ho Chi Minh City",
		airportName: "Tan Son Nhat International Airport",
		country: "Vietnam"
	},
	{
		iataCode: "HAN",
		city: "Hanoi",
		airportName: "Noi Bai International Airport",
		country: "Vietnam"
	}
];
const rankAirport = (a, q) => {
	const iata = a.iataCode.toLowerCase();
	const city = a.city.toLowerCase();
	const name = a.airportName.toLowerCase();
	const country = a.country.toLowerCase();
	if (iata === q) return 0;
	if (city === q) return 1;
	if (city.startsWith(q)) return 2;
	if (name.startsWith(q)) return 3;
	if (iata.startsWith(q) || city.includes(q) || name.includes(q) || country.includes(q)) return 4;
	return null;
};
/**
* Case-insensitive search over iataCode, city, airportName and country.
* Results are ranked 0 → 4 per the priority list and capped at `limit`.
*/
const searchAirports = (rawQuery, limit = 12) => {
	const query = rawQuery.trim().toLowerCase();
	if (!query) return Promise.resolve([]);
	const hits = [];
	for (const airport of AIRPORTS) {
		const rank = rankAirport(airport, query);
		if (rank !== null) hits.push({
			airport,
			rank
		});
	}
	hits.sort((x, y) => {
		if (x.rank !== y.rank) return x.rank - y.rank;
		if (x.airport.iataCode !== y.airport.iataCode) return x.airport.iataCode < y.airport.iataCode ? -1 : 1;
		return x.airport.city < y.airport.city ? -1 : 1;
	});
	return Promise.resolve(hits.slice(0, limit).map((h) => h.airport));
};
/** Direct lookup by IATA code (used to seed selections from stored labels). */
const airportByCode = (code) => AIRPORTS.find((a) => a.iataCode.toUpperCase() === code.toUpperCase());
/** Parse a "CODE - City" label into an Airport, falling back to a best-effort object. */
const airportFromLabel = (label) => {
	const [code, city = ""] = label.split(" - ");
	const trimmedCode = code.trim();
	const known = airportByCode(trimmedCode);
	if (known) return known;
	const trimmedCity = city.trim() || trimmedCode;
	return {
		iataCode: trimmedCode,
		city: trimmedCity,
		airportName: trimmedCity,
		country: ""
	};
};
//#endregion
//#region src/components/toastStore.ts
let seq = 0;
let active = [];
const subscribers = /* @__PURE__ */ new Set();
const notify = () => subscribers.forEach((s) => s([...active]));
function dismissToast(id) {
	active = active.filter((t) => t.id !== id);
	notify();
}
const defaults = {
	error: "Error",
	success: "Success",
	info: "Info",
	warning: "Warning"
};
function toast(input) {
	const cfg = typeof input === "string" ? { message: input } : input;
	const kind = cfg.kind ?? "info";
	const duration = cfg.duration ?? 4500;
	const item = {
		id: ++seq,
		kind,
		code: cfg.code,
		title: cfg.title ?? defaults[kind],
		message: cfg.message,
		duration
	};
	active = [...active, item];
	notify();
	window.setTimeout(() => dismissToast(item.id), duration);
}
//#endregion
//#region src/store/globalLoader.ts
function parseContent(content) {
	if (!content) return {
		message: null,
		messages: []
	};
	if (typeof content === "string") return {
		message: content,
		messages: []
	};
	if (Array.isArray(content)) return {
		message: null,
		messages: content
	};
	return {
		message: content.message ?? null,
		messages: content.messages ?? []
	};
}
const useGlobalLoaderStore = create()((set) => ({
	counter: 0,
	message: null,
	messages: [],
	contentVersion: 0,
	loaderMode: "global",
	flightSearchMeta: null,
	showLoader: (content) => set((state) => {
		const parsed = parseContent(content);
		return {
			counter: state.counter + 1,
			message: parsed.message,
			messages: parsed.messages,
			contentVersion: state.contentVersion + 1
		};
	}),
	setLoaderContent: (content) => set((state) => {
		const parsed = parseContent(content);
		return {
			message: parsed.message,
			messages: parsed.messages,
			contentVersion: state.contentVersion + 1
		};
	}),
	hideLoader: () => set((state) => ({ counter: Math.max(0, state.counter - 1) })),
	setFlightSearchMode: (meta) => set({
		loaderMode: "flight-search",
		flightSearchMeta: meta
	}),
	clearFlightSearchMode: () => set({
		loaderMode: "global",
		flightSearchMeta: null
	})
}));
//#endregion
//#region src/store/flightStore.ts
const DEFAULT_TRAVELLERS = {
	adults: 1,
	children: 0,
	infants: 0
};
const travellersTotal = (t) => t.adults + t.children + t.infants;
const travellersLabel = (t) => {
	const total = travellersTotal(t);
	return `${total} ${total === 1 ? "Traveller" : "Travellers"}`;
};
const onwardFlights = [
	{
		badge: "BEST VALUE",
		badgeBg: "bg-[#7ac143]",
		airline: "INDIGO",
		code: "6E 6602",
		departure: {
			time: "10:30 AM",
			airport: "PNQ Terminal 1"
		},
		arrival: {
			time: "1:55 PM",
			airport: "DEL Terminal 2"
		},
		via: "via NAG",
		duration: "3h 25m",
		stops: "1 Stop",
		baggage: "15 kg baggage",
		price: 5430,
		checkedAgo: "Price checked 18 sec ago."
	},
	{
		badge: "FASTEST",
		badgeBg: "bg-[#1aa6e4]",
		airline: "AIR INDIA",
		code: "AI 247",
		departure: {
			time: "9:40 AM",
			airport: "PNQ Terminal 2"
		},
		arrival: {
			time: "11:45 AM",
			airport: "DEL Terminal 3"
		},
		duration: "2h 5m",
		stops: "Non-stop",
		baggage: "25 kg baggage",
		price: 6250,
		checkedAgo: "Price checked 22 sec ago."
	},
	{
		badge: "MOST FLEXIBLE",
		badgeBg: "bg-[#e4007c]",
		airline: "AKASA",
		code: "QP 1385",
		departure: {
			time: "7:55 AM",
			airport: "PNQ Terminal 1"
		},
		arrival: {
			time: "10:15 AM",
			airport: "DEL Terminal 1"
		},
		duration: "2h 20m",
		stops: "Non-stop",
		baggage: "20 kg baggage",
		price: 5980,
		checkedAgo: "Price checked 38 sec ago."
	},
	{
		badge: "LOW",
		badgeBg: "bg-[#f39200]",
		airline: "SPICEJET",
		code: "SG 815",
		departure: {
			time: "11:20 AM",
			airport: "PNQ Terminal 1"
		},
		arrival: {
			time: "1:40 PM",
			airport: "DEL Terminal 1"
		},
		duration: "2h 20m",
		stops: "Non-stop",
		baggage: "15 kg baggage",
		price: 4980,
		checkedAgo: "Price checked 48 sec ago."
	},
	{
		badge: "CHEAPEST",
		badgeBg: "bg-[#f39200]",
		airline: "SPICEJET",
		code: "SG 819",
		departure: {
			time: "6:05 AM",
			airport: "PNQ Terminal 1"
		},
		arrival: {
			time: "8:25 AM",
			airport: "DEL Terminal 1"
		},
		duration: "2h 20m",
		stops: "Non-stop",
		baggage: "15 kg baggage",
		price: 4210,
		checkedAgo: "Price checked 11 sec ago."
	},
	{
		badge: "ECO",
		badgeBg: "bg-[#7ac143]",
		airline: "AKASA",
		code: "QP 1373",
		departure: {
			time: "2:15 PM",
			airport: "PNQ Terminal 1"
		},
		arrival: {
			time: "4:30 PM",
			airport: "DEL Terminal 1"
		},
		duration: "2h 15m",
		stops: "Non-stop",
		baggage: "20 kg baggage",
		price: 6480,
		checkedAgo: "Price checked 5 sec ago."
	},
	{
		badge: "EARLY BIRD",
		badgeBg: "bg-[#1aa6e4]",
		airline: "AIR INDIA",
		code: "AI 610",
		departure: {
			time: "5:30 AM",
			airport: "PNQ Terminal 2"
		},
		arrival: {
			time: "7:35 AM",
			airport: "DEL Terminal 3"
		},
		duration: "2h 5m",
		stops: "Non-stop",
		baggage: "25 kg baggage",
		price: 7850,
		checkedAgo: "Price checked 2 min ago."
	},
	{
		badge: "REDEYE",
		badgeBg: "bg-[#e4007c]",
		airline: "INDIGO",
		code: "6E 6214",
		departure: {
			time: "11:25 PM",
			airport: "PNQ Terminal 1"
		},
		arrival: {
			time: "1:35 AM",
			airport: "DEL Terminal 2"
		},
		duration: "2h 10m",
		stops: "Non-stop",
		baggage: "15 kg baggage",
		price: 5120,
		checkedAgo: "Price checked 3 min ago."
	},
	{
		badge: "2 STOPS",
		badgeBg: "bg-[#f39200]",
		airline: "INDIGO",
		code: "6E 6573",
		departure: {
			time: "3:10 PM",
			airport: "PNQ Terminal 1"
		},
		arrival: {
			time: "9:15 PM",
			airport: "DEL Terminal 2"
		},
		via: "via HYD, IDR",
		duration: "6h 5m",
		stops: "2 Stops",
		baggage: "15 kg baggage",
		price: 5460,
		checkedAgo: "Price checked 9 sec ago."
	},
	{
		badge: "VALUE HOP",
		badgeBg: "bg-[#1aa6e4]",
		airline: "AIR INDIA",
		code: "AI 854",
		departure: {
			time: "8:50 AM",
			airport: "PNQ Terminal 2"
		},
		arrival: {
			time: "12:30 PM",
			airport: "DEL Terminal 3"
		},
		via: "via NAG",
		duration: "3h 40m",
		stops: "1 Stop",
		baggage: "25 kg baggage",
		price: 6890,
		checkedAgo: "Price checked 14 sec ago."
	},
	{
		badge: "BUDGET 2 STOP",
		badgeBg: "bg-[#f39200]",
		airline: "SPICEJET",
		code: "SG 947",
		departure: {
			time: "9:35 AM",
			airport: "PNQ Terminal 1"
		},
		arrival: {
			time: "3:25 PM",
			airport: "DEL Terminal 1"
		},
		via: "via NAG, JAI",
		duration: "5h 50m",
		stops: "2 Stops",
		baggage: "15 kg baggage",
		price: 4630,
		checkedAgo: "Price checked 27 sec ago."
	},
	{
		badge: "3 STOPS",
		badgeBg: "bg-[#e4007c]",
		airline: "INDIGO",
		code: "6E 6329",
		departure: {
			time: "5:45 AM",
			airport: "PNQ Terminal 1"
		},
		arrival: {
			time: "1:25 PM",
			airport: "DEL Terminal 2"
		},
		via: "via NAG, IDR, JAI",
		duration: "7h 40m",
		stops: "3 Stops",
		baggage: "15 kg baggage",
		price: 4350,
		checkedAgo: "Price checked 16 sec ago."
	},
	{
		badge: "EVENING HOP",
		badgeBg: "bg-[#7ac143]",
		airline: "INDIGO",
		code: "6E 6608",
		departure: {
			time: "6:40 PM",
			airport: "PNQ Terminal 1"
		},
		arrival: {
			time: "10:55 PM",
			airport: "DEL Terminal 2"
		},
		via: "via AMD",
		duration: "4h 15m",
		stops: "1 Stop",
		baggage: "15 kg baggage",
		price: 5290,
		checkedAgo: "Price checked 21 sec ago."
	},
	{
		badge: "VALUE CONNECT",
		badgeBg: "bg-[#f39200]",
		airline: "AIR INDIA",
		code: "AI 953",
		departure: {
			time: "7:20 AM",
			airport: "PNQ Terminal 2"
		},
		arrival: {
			time: "1:05 PM",
			airport: "DEL Terminal 3"
		},
		via: "via NAG, JAI",
		duration: "5h 45m",
		stops: "2 Stops",
		baggage: "25 kg baggage",
		price: 4950,
		checkedAgo: "Price checked 35 sec ago."
	}
];
const returnFlightData = [
	{
		badge: "CHEAPEST",
		badgeBg: "bg-[#f39200]",
		airline: "SPICEJET",
		code: "SG 836",
		departure: {
			time: "6:00 AM",
			airport: "DEL Terminal 1"
		},
		arrival: {
			time: "8:20 AM",
			airport: "PNQ Terminal 1"
		},
		duration: "2h 20m",
		stops: "Non-stop",
		baggage: "15 kg baggage",
		price: 4480,
		checkedAgo: "Price checked 12 sec ago."
	},
	{
		badge: "EARLIEST",
		badgeBg: "bg-[#1aa6e4]",
		airline: "INDIGO",
		code: "6E 6213",
		departure: {
			time: "5:30 AM",
			airport: "DEL Terminal 2"
		},
		arrival: {
			time: "7:40 AM",
			airport: "PNQ Terminal 1"
		},
		duration: "2h 10m",
		stops: "Non-stop",
		baggage: "15 kg baggage",
		price: 5120,
		checkedAgo: "Price checked 8 sec ago."
	},
	{
		badge: "FASTEST",
		badgeBg: "bg-[#7ac143]",
		airline: "AIR INDIA",
		code: "AI 2440",
		departure: {
			time: "8:15 AM",
			airport: "DEL Terminal 3"
		},
		arrival: {
			time: "10:20 AM",
			airport: "PNQ Terminal 2"
		},
		duration: "2h 5m",
		stops: "Non-stop",
		baggage: "25 kg baggage",
		price: 6250,
		checkedAgo: "Price checked 25 sec ago."
	},
	{
		badge: "BEST VALUE",
		badgeBg: "bg-[#e4007c]",
		airline: "AKASA",
		code: "QP 1368",
		departure: {
			time: "4:35 PM",
			airport: "DEL Terminal 1"
		},
		arrival: {
			time: "6:55 PM",
			airport: "PNQ Terminal 1"
		},
		duration: "2h 20m",
		stops: "Non-stop",
		baggage: "20 kg baggage",
		price: 5980,
		checkedAgo: "Price checked 31 sec ago."
	},
	{
		badge: "REDEYE",
		badgeBg: "bg-[#1aa6e4]",
		airline: "INDIGO",
		code: "6E 6444",
		departure: {
			time: "11:20 PM",
			airport: "DEL Terminal 2"
		},
		arrival: {
			time: "1:30 AM",
			airport: "PNQ Terminal 1"
		},
		duration: "2h 10m",
		stops: "Non-stop",
		baggage: "15 kg baggage",
		price: 4980,
		checkedAgo: "Price checked 42 sec ago."
	},
	{
		badge: "2 STOPS",
		badgeBg: "bg-[#f39200]",
		airline: "SPICEJET",
		code: "SG 930",
		departure: {
			time: "2:45 PM",
			airport: "DEL Terminal 1"
		},
		arrival: {
			time: "8:50 PM",
			airport: "PNQ Terminal 1"
		},
		via: "via JAI, IDR",
		duration: "6h 5m",
		stops: "2 Stops",
		baggage: "15 kg baggage",
		price: 4560,
		checkedAgo: "Price checked 19 sec ago."
	},
	{
		badge: "3 STOPS",
		badgeBg: "bg-[#e4007c]",
		airline: "INDIGO",
		code: "6E 6531",
		departure: {
			time: "10:10 AM",
			airport: "DEL Terminal 2"
		},
		arrival: {
			time: "5:05 PM",
			airport: "PNQ Terminal 1"
		},
		via: "via JAI, IDR, HYD",
		duration: "6h 55m",
		stops: "3 Stops",
		baggage: "20 kg baggage",
		price: 4290,
		checkedAgo: "Price checked 24 sec ago."
	},
	{
		badge: "EVENING 2 STOP",
		badgeBg: "bg-[#1aa6e4]",
		airline: "AIR INDIA",
		code: "AI 875",
		departure: {
			time: "5:55 PM",
			airport: "DEL Terminal 3"
		},
		arrival: {
			time: "12:50 AM",
			airport: "PNQ Terminal 1"
		},
		via: "via NAG, HYD",
		duration: "6h 55m",
		stops: "2 Stops",
		baggage: "25 kg baggage",
		price: 6140,
		checkedAgo: "Price checked 37 sec ago."
	}
];
const KNOWN_DAY_FARES = {
	"2026-9-16": 7153,
	"2026-9-17": 7032,
	"2026-9-18": 7153,
	"2026-9-19": 7154,
	"2026-9-20": 7154,
	"2026-9-21": 7072,
	"2026-9-22": 7153
};
const stripLabel = (d) => {
	const wd = d.toLocaleDateString("en-US", { weekday: "short" });
	const mo = d.toLocaleDateString("en-US", { month: "short" });
	return `${wd}, ${d.getDate()} ${mo}`;
};
const stripPriceFor = (d) => {
	const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
	const known = KNOWN_DAY_FARES[key];
	if (known) return known;
	const raw = 7e3 + (d.getDate() * 173 + (d.getMonth() + 1) * 97 + 41) % 260;
	return Math.round(raw / 10) * 10;
};
const datePoolData = Array.from({ length: 28 }, (_, i) => {
	const day = new Date(2026, 8, 9 + i);
	return {
		label: stripLabel(day),
		price: stripPriceFor(day)
	};
});
const useFlightStore = create()((set, get) => ({
	flights: onwardFlights,
	returnFlights: returnFlightData,
	datePool: datePoolData,
	fromCity: "PNQ - Pune",
	toCity: "DEL - New Delhi",
	fromAirports: [airportFromLabel("PNQ - Pune")],
	toAirports: [airportFromLabel("DEL - New Delhi")],
	returnOpen: false,
	filtersOpen: false,
	monthOffset: 0,
	returnDate: null,
	searching: false,
	searched: false,
	selectedOnward: null,
	selectedReturn: null,
	selectedOnwardTier: null,
	selectedReturnTier: null,
	onwardSort: "price",
	returnSort: "price",
	stripStart: 7,
	stripSel: 1,
	openFilters: Array(8).fill(false),
	activePriceBreakdownId: null,
	travellers: { ...DEFAULT_TRAVELLERS },
	setTravellers: (t) => set(() => ({ travellers: {
		adults: Math.min(9, Math.max(1, t.adults)),
		children: Math.min(8, Math.max(0, t.children)),
		infants: Math.min(Math.min(9, Math.max(1, t.adults)), Math.max(0, t.infants))
	} })),
	setReturnOpen: (v) => set({ returnOpen: v }),
	setFiltersOpen: (v) => set({ filtersOpen: v }),
	toggleFilterGroup: (i) => set((s) => ({ openFilters: s.openFilters.map((v, idx) => idx === i ? !v : v) })),
	clearFilters: () => {
		set({
			openFilters: Array(8).fill(false),
			returnDate: null,
			selectedOnward: null,
			selectedReturn: null,
			selectedOnwardTier: null,
			selectedReturnTier: null,
			onwardSort: "price",
			returnSort: "price",
			monthOffset: 0,
			stripStart: 7,
			stripSel: 1
		});
		toast({
			kind: "info",
			code: 200,
			title: "Filters Cleared",
			message: "All filters have been reset."
		});
	},
	shiftMonth: (dir) => set((s) => ({ monthOffset: Math.max(-12, Math.min(12, s.monthOffset + dir)) })),
	pickReturnDate: (label) => set({
		returnDate: label,
		returnOpen: false
	}),
	setSelectedOnward: (f) => set({ selectedOnward: f }),
	setSelectedReturn: (f) => set({ selectedReturn: f }),
	setSelectedOnwardTier: (t) => set({ selectedOnwardTier: t }),
	setSelectedReturnTier: (t) => set({ selectedReturnTier: t }),
	setOnwardSort: (k) => set({ onwardSort: k }),
	setReturnSort: (k) => set({ returnSort: k }),
	setStripSel: (i) => set({ stripSel: i }),
	setActivePriceBreakdownId: (id) => set({ activePriceBreakdownId: id }),
	shiftStrip: (dir) => set((s) => ({ stripStart: dir < 0 ? Math.max(0, s.stripStart - 7) : Math.min(s.datePool.length - 7, s.stripStart + 7) })),
	addFromAirport: (a) => set((s) => {
		if (s.fromAirports.some((x) => x.iataCode === a.iataCode)) return {};
		const next = [...s.fromAirports, a];
		return {
			fromAirports: next,
			fromCity: `${next[0].iataCode} - ${next[0].city}`
		};
	}),
	removeFromAirport: (iata) => set((s) => {
		const next = s.fromAirports.filter((x) => x.iataCode !== iata);
		if (next.length === s.fromAirports.length) return {};
		return next.length === 0 ? { fromAirports: next } : {
			fromAirports: next,
			fromCity: `${next[0].iataCode} - ${next[0].city}`
		};
	}),
	addToAirport: (a) => set((s) => {
		if (s.toAirports.some((x) => x.iataCode === a.iataCode)) return {};
		const next = [...s.toAirports, a];
		return {
			toAirports: next,
			toCity: `${next[0].iataCode} - ${next[0].city}`
		};
	}),
	removeToAirport: (iata) => set((s) => {
		const next = s.toAirports.filter((x) => x.iataCode !== iata);
		if (next.length === s.toAirports.length) return {};
		return next.length === 0 ? { toAirports: next } : {
			toAirports: next,
			toCity: `${next[0].iataCode} - ${next[0].city}`
		};
	}),
	swapCities: () => set((s) => ({
		fromCity: s.toCity,
		toCity: s.fromCity,
		fromAirports: s.toAirports,
		toAirports: s.fromAirports
	})),
	restoreSearch: (snapshot) => set({
		searched: snapshot.searched,
		selectedOnward: snapshot.selectedOnward,
		selectedReturn: snapshot.selectedReturn,
		fromCity: snapshot.fromCity,
		toCity: snapshot.toCity,
		fromAirports: [airportFromLabel(snapshot.fromCity)],
		toAirports: [airportFromLabel(snapshot.toCity)],
		returnDate: snapshot.returnDate,
		returnOpen: snapshot.returnOpen,
		onwardSort: snapshot.onwardSort,
		returnSort: snapshot.returnSort,
		stripStart: snapshot.stripStart,
		stripSel: snapshot.stripSel,
		monthOffset: snapshot.monthOffset,
		filtersOpen: snapshot.filtersOpen,
		travellers: snapshot.travellers ?? { ...DEFAULT_TRAVELLERS }
	}),
	doSearch: () => {
		const { searching, fromCity, toCity, returnDate, travellers } = get();
		if (searching) return;
		const fromCode = fromCity.split(" - ")[0];
		const toCode = toCity.split(" - ")[0];
		if (fromCode === toCode) {
			toast({
				kind: "error",
				code: 400,
				title: "Bad Request",
				message: "From and To cities must be different."
			});
			return;
		}
		if (!returnDate) toast({
			kind: "warning",
			code: 400,
			title: "No Return Date",
			message: "Showing one-way results — select a return date for round-trip pricing."
		});
		const searchRequest = {
			fromCode,
			toCode,
			returnDate,
			travellers: { ...travellers }
		};
		set({
			selectedOnward: null,
			selectedReturn: null,
			searching: true
		});
		useGlobalLoaderStore.getState().setFlightSearchMode({
			fromCity,
			toCity,
			fromCode,
			toCode
		});
		window.setTimeout(() => {
			set({
				searching: false,
				searched: true
			});
			useGlobalLoaderStore.getState().clearFlightSearchMode();
			const { fromCity: fc, toCity: tc } = get();
			toast({
				kind: "success",
				code: 200,
				title: "Search Complete",
				message: `${fc} → ${tc} flights loaded for ${travellersLabel(searchRequest.travellers).toLowerCase()}.`
			});
		}, 1400);
	}
}));
//#endregion
//#region scripts/airport-search.test.mts
const codes = (list) => list.map((a) => a.iataCode);
let r = await searchAirports("pune");
assert.equal(r[0].iataCode, "PNQ", "pune → PNQ first");
assert.ok(!codes(r).includes("BOM"), "pune does not match unrelated airports");
r = await searchAirports("PNQ");
assert.equal(r[0].iataCode, "PNQ", "PNQ exact IATA first");
assert.equal(r[0].city, "Pune");
r = await searchAirports("pnq");
assert.equal(r[0].iataCode, "PNQ", "lowercase pnq works");
r = await searchAirports("Mumbai");
assert.equal(r[0].iataCode, "BOM", "Mumbai → BOM");
r = await searchAirports("india");
assert.equal(r.length, 12, "India results capped at the display limit");
assert.ok(r.every((a) => a.country === "India"), "all results are Indian");
r = await searchAirports("Dubai");
assert.equal(r[0].iataCode, "DXB", "Dubai → DXB");
r = await searchAirports("London");
assert.ok(r.some((a) => a.iataCode === "LHR"), "London includes LHR");
assert.ok(r.every((a) => a.country === "United Kingdom"), "London → UK airports only");
r = await searchAirports("Indira Gandhi");
assert.equal(r[0].iataCode, "DEL", "airport name search → DEL");
r = await searchAirports("xyzzy123");
assert.deepEqual(r, [], "invalid query → no results");
r = await searchAirports("   ");
assert.deepEqual(r, [], "blank query → no results");
assert.equal(airportByCode("dx b".replace(" ", ""))?.city, "Dubai");
assert.equal(airportFromLabel("DEL - New Delhi").iataCode, "DEL");
assert.equal(airportFromLabel("PNQ - Pune").city, "Pune");
const s = useFlightStore.getState();
assert.equal(s.fromCity, "PNQ - Pune");
assert.deepEqual(codes(s.fromAirports), ["PNQ"]);
s.addFromAirport(airportByCode("BOM"));
s.addFromAirport(airportByCode("DEL"));
s.addFromAirport(airportByCode("BOM"));
const after = useFlightStore.getState();
assert.deepEqual(codes(after.fromAirports), [
	"PNQ",
	"BOM",
	"DEL"
], "multi-select, no duplicates");
assert.equal(after.fromCity, "PNQ - Pune", "first selection stays primary");
after.removeFromAirport("BOM");
let now = useFlightStore.getState();
assert.deepEqual(codes(now.fromAirports), ["PNQ", "DEL"]);
assert.equal(now.fromCity, "PNQ - Pune");
now.removeFromAirport("PNQ");
now = useFlightStore.getState();
assert.deepEqual(codes(now.fromAirports), ["DEL"]);
assert.equal(now.fromCity, "DEL - New Delhi", "primary follows first remaining");
now.addToAirport(airportByCode("BOM"));
now = useFlightStore.getState();
assert.deepEqual(codes(now.toAirports), ["DEL", "BOM"], "multi-select on To side");
assert.equal(now.toCity, "DEL - New Delhi", "primary To stays first selection");
now.swapCities();
now = useFlightStore.getState();
assert.deepEqual(codes(now.fromAirports), ["DEL", "BOM"], "swap swaps lists");
assert.deepEqual(codes(now.toAirports), ["DEL"]);
assert.equal(now.fromCity, "DEL - New Delhi");
assert.equal(now.toCity, "DEL - New Delhi");
assert.equal(now.fromCity.split(" - ")[0], "DEL");
console.log("✅ All airport search + store multi-select tests passed");
//#endregion
export {};
