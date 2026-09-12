// airports.ts
// Local airport/city dataset used by the From/To airport search.
// Keep this file as pure data – no UI, no logic. The search ranking lives in
// src/services/airportSearch.ts, which is the only consumer, so the dataset can
// later be replaced by a real airport/flight API without touching the UI.

export interface Airport {
  /** IATA airport code, e.g. "PNQ" */
  iataCode: string;
  /** City name, e.g. "Pune" */
  city: string;
  /** Full airport name, e.g. "Pune International Airport" */
  airportName: string;
  /** Country name, e.g. "India" */
  country: string;
}

/** Sentinel used in the From/To search fields when nothing is selected yet. */
export const EMPTY_AIRPORT: Airport = { iataCode: '', city: '', airportName: '', country: '' };

export const AIRPORTS: readonly Airport[] = [
  // ── India ────────────────────────────────────────────────────────────
  { iataCode: 'PNQ', city: 'Pune', airportName: 'Pune International Airport', country: 'India' },
  { iataCode: 'BOM', city: 'Mumbai', airportName: 'Chhatrapati Shivaji Maharaj International Airport', country: 'India' },
  { iataCode: 'DEL', city: 'New Delhi', airportName: 'Indira Gandhi International Airport', country: 'India' },
  { iataCode: 'BLR', city: 'Bengaluru', airportName: 'Kempegowda International Airport', country: 'India' },
  { iataCode: 'HYD', city: 'Hyderabad', airportName: 'Rajiv Gandhi International Airport', country: 'India' },
  { iataCode: 'MAA', city: 'Chennai', airportName: 'Chennai International Airport', country: 'India' },
  { iataCode: 'CCU', city: 'Kolkata', airportName: 'Netaji Subhas Chandra Bose International Airport', country: 'India' },
  { iataCode: 'AMD', city: 'Ahmedabad', airportName: 'Sardar Vallabhbhai Patel International Airport', country: 'India' },
  { iataCode: 'GOI', city: 'Goa', airportName: 'Dabolim Goa International Airport', country: 'India' },
  { iataCode: 'COK', city: 'Kochi', airportName: 'Cochin International Airport', country: 'India' },
  { iataCode: 'JAI', city: 'Jaipur', airportName: 'Jaipur International Airport', country: 'India' },
  { iataCode: 'LKO', city: 'Lucknow', airportName: 'Chaudhary Charan Singh International Airport', country: 'India' },
  { iataCode: 'BBI', city: 'Bhubaneswar', airportName: 'Biju Patnaik International Airport', country: 'India' },
  { iataCode: 'IXC', city: 'Chandigarh', airportName: 'Chandigarh International Airport', country: 'India' },
  { iataCode: 'GAU', city: 'Guwahati', airportName: 'Lokpriya Gopinath Bordoloi International Airport', country: 'India' },
  { iataCode: 'PAT', city: 'Patna', airportName: 'Jay Prakash Narayan Airport', country: 'India' },
  { iataCode: 'NAG', city: 'Nagpur', airportName: 'Dr. Babasaheb Ambedkar International Airport', country: 'India' },
  { iataCode: 'SXR', city: 'Srinagar', airportName: 'Sheikh ul-Alam International Airport', country: 'India' },
  { iataCode: 'VNS', city: 'Varanasi', airportName: 'Lal Bahadur Shastri Airport', country: 'India' },
  { iataCode: 'TRV', city: 'Thiruvananthapuram', airportName: 'Trivandrum International Airport', country: 'India' },
  { iataCode: 'IDR', city: 'Indore', airportName: 'Devi Ahilyabai Holkar Airport', country: 'India' },
  { iataCode: 'ATQ', city: 'Amritsar', airportName: 'Sri Guru Ram Dass Jee International Airport', country: 'India' },
  { iataCode: 'IXR', city: 'Ranchi', airportName: 'Birsa Munda Airport', country: 'India' },
  { iataCode: 'CJB', city: 'Coimbatore', airportName: 'Coimbatore International Airport', country: 'India' },

  // ── UAE ───────────────────────────────────────────────────────────────
  { iataCode: 'DXB', city: 'Dubai', airportName: 'Dubai International Airport', country: 'United Arab Emirates' },
  { iataCode: 'AUH', city: 'Abu Dhabi', airportName: 'Zayed International Airport', country: 'United Arab Emirates' },
  { iataCode: 'SHJ', city: 'Sharjah', airportName: 'Sharjah International Airport', country: 'United Arab Emirates' },

  // ── Singapore ─────────────────────────────────────────────────────────
  { iataCode: 'SIN', city: 'Singapore', airportName: 'Changi Airport', country: 'Singapore' },

  // ── Thailand ──────────────────────────────────────────────────────────
  { iataCode: 'BKK', city: 'Bangkok', airportName: 'Suvarnabhumi Airport', country: 'Thailand' },
  { iataCode: 'DMK', city: 'Bangkok', airportName: 'Don Mueang International Airport', country: 'Thailand' },
  { iataCode: 'HKT', city: 'Phuket', airportName: 'Phuket International Airport', country: 'Thailand' },
  { iataCode: 'CNX', city: 'Chiang Mai', airportName: 'Chiang Mai International Airport', country: 'Thailand' },

  // ── United Kingdom ────────────────────────────────────────────────────
  { iataCode: 'LHR', city: 'London', airportName: 'Heathrow Airport', country: 'United Kingdom' },
  { iataCode: 'LGW', city: 'London', airportName: 'Gatwick Airport', country: 'United Kingdom' },
  { iataCode: 'MAN', city: 'Manchester', airportName: 'Manchester Airport', country: 'United Kingdom' },
  { iataCode: 'EDI', city: 'Edinburgh', airportName: 'Edinburgh Airport', country: 'United Kingdom' },

  // ── USA ───────────────────────────────────────────────────────────────
  { iataCode: 'JFK', city: 'New York', airportName: 'John F. Kennedy International Airport', country: 'United States' },
  { iataCode: 'EWR', city: 'New York', airportName: 'Newark Liberty International Airport', country: 'United States' },
  { iataCode: 'LGA', city: 'New York', airportName: 'LaGuardia Airport', country: 'United States' },
  { iataCode: 'LAX', city: 'Los Angeles', airportName: 'Los Angeles International Airport', country: 'United States' },
  { iataCode: 'SFO', city: 'San Francisco', airportName: 'San Francisco International Airport', country: 'United States' },
  { iataCode: 'ORD', city: 'Chicago', airportName: "O'Hare International Airport", country: 'United States' },
  { iataCode: 'IAD', city: 'Washington', airportName: 'Washington Dulles International Airport', country: 'United States' },
  { iataCode: 'BOS', city: 'Boston', airportName: 'Boston Logan International Airport', country: 'United States' },
  { iataCode: 'MIA', city: 'Miami', airportName: 'Miami International Airport', country: 'United States' },
  { iataCode: 'SEA', city: 'Seattle', airportName: 'Seattle–Tacoma International Airport', country: 'United States' },
  { iataCode: 'ATL', city: 'Atlanta', airportName: 'Hartsfield–Jackson Atlanta International Airport', country: 'United States' },
  { iataCode: 'DFW', city: 'Dallas', airportName: 'Dallas/Fort Worth International Airport', country: 'United States' },

  // ── Europe ────────────────────────────────────────────────────────────
  { iataCode: 'CDG', city: 'Paris', airportName: 'Charles de Gaulle Airport', country: 'France' },
  { iataCode: 'ORY', city: 'Paris', airportName: 'Orly Airport', country: 'France' },
  { iataCode: 'FRA', city: 'Frankfurt', airportName: 'Frankfurt Airport', country: 'Germany' },
  { iataCode: 'MUC', city: 'Munich', airportName: 'Munich Airport', country: 'Germany' },
  { iataCode: 'AMS', city: 'Amsterdam', airportName: 'Amsterdam Airport Schiphol', country: 'Netherlands' },
  { iataCode: 'MAD', city: 'Madrid', airportName: 'Adolfo Suárez Madrid–Barajas Airport', country: 'Spain' },
  { iataCode: 'BCN', city: 'Barcelona', airportName: 'Josep Tarradellas Barcelona–El Prat Airport', country: 'Spain' },
  { iataCode: 'FCO', city: 'Rome', airportName: 'Leonardo da Vinci–Fiumicino Airport', country: 'Italy' },
  { iataCode: 'ZRH', city: 'Zurich', airportName: 'Zurich Airport', country: 'Switzerland' },
  { iataCode: 'VIE', city: 'Vienna', airportName: 'Vienna International Airport', country: 'Austria' },
  { iataCode: 'CPH', city: 'Copenhagen', airportName: 'Copenhagen Airport', country: 'Denmark' },
  { iataCode: 'LIS', city: 'Lisbon', airportName: 'Humberto Delgado Airport', country: 'Portugal' },
  { iataCode: 'IST', city: 'Istanbul', airportName: 'Istanbul Airport', country: 'Turkey' },

  // ── Australia ─────────────────────────────────────────────────────────
  { iataCode: 'SYD', city: 'Sydney', airportName: 'Sydney Airport', country: 'Australia' },
  { iataCode: 'MEL', city: 'Melbourne', airportName: 'Melbourne Airport', country: 'Australia' },
  { iataCode: 'BNE', city: 'Brisbane', airportName: 'Brisbane Airport', country: 'Australia' },
  { iataCode: 'PER', city: 'Perth', airportName: 'Perth Airport', country: 'Australia' },

  // ── Asia ──────────────────────────────────────────────────────────────
  { iataCode: 'HKG', city: 'Hong Kong', airportName: 'Hong Kong International Airport', country: 'Hong Kong' },
  { iataCode: 'NRT', city: 'Tokyo', airportName: 'Narita International Airport', country: 'Japan' },
  { iataCode: 'HND', city: 'Tokyo', airportName: 'Haneda Airport', country: 'Japan' },
  { iataCode: 'ICN', city: 'Seoul', airportName: 'Incheon International Airport', country: 'South Korea' },
  { iataCode: 'KUL', city: 'Kuala Lumpur', airportName: 'Kuala Lumpur International Airport', country: 'Malaysia' },
  { iataCode: 'CGK', city: 'Jakarta', airportName: 'Soekarno–Hatta International Airport', country: 'Indonesia' },
  { iataCode: 'DPS', city: 'Bali', airportName: 'Ngurah Rai International Airport', country: 'Indonesia' },
  { iataCode: 'MNL', city: 'Manila', airportName: 'Ninoy Aquino International Airport', country: 'Philippines' },
  { iataCode: 'SGN', city: 'Ho Chi Minh City', airportName: 'Tan Son Nhat International Airport', country: 'Vietnam' },
  { iataCode: 'HAN', city: 'Hanoi', airportName: 'Noi Bai International Airport', country: 'Vietnam' },
];