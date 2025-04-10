
import { Flight } from "@/types/flight";

// Sample airports data (major Indian cities)
const airports = [
  { code: "DEL", city: "Delhi" },
  { code: "BOM", city: "Mumbai" },
  { code: "BLR", city: "Bangalore" },
  { code: "MAA", city: "Chennai" },
  { code: "CCU", city: "Kolkata" },
  { code: "HYD", city: "Hyderabad" },
  { code: "COK", city: "Kochi" },
  { code: "JAI", city: "Jaipur" },
  { code: "AMD", city: "Ahmedabad" },
  { code: "PNQ", city: "Pune" },
  { code: "GOI", city: "Goa" },
  { code: "IXC", city: "Chandigarh" },
  { code: "PAT", city: "Patna" },
  { code: "LKO", city: "Lucknow" },
  { code: "IXB", city: "Bagdogra" },
  { code: "GAU", city: "Guwahati" },
  { code: "BBI", city: "Bhubaneswar" },
  { code: "VTZ", city: "Visakhapatnam" },
  { code: "IXM", city: "Madurai" },
  { code: "TRV", city: "Thiruvananthapuram" },
];

// Sample airlines with their codes
const airlines = [
  { name: "Air India", code: "AI" },
  { name: "IndiGo", code: "6E" },
  { name: "SpiceJet", code: "SG" },
  { name: "Vistara", code: "UK" },
  { name: "GoAir", code: "G8" },
  { name: "AirAsia India", code: "I5" },
  { name: "Air India Express", code: "IX" },
  { name: "TruJet", code: "2T" },
  { name: "Alliance Air", code: "9I" },
  { name: "Star Air", code: "OG" },
];

// Sample aircraft models
const aircraftModels = [
  "Airbus A320",
  "Airbus A321",
  "Airbus A330",
  "Boeing 737-800",
  "Boeing 777-300ER",
  "Boeing 787-8 Dreamliner",
  "ATR 72-600",
  "Bombardier Q400",
  "Airbus A319",
  "Airbus A350",
];

// Sample amenities by class
const amenitiesByClass = {
  Economy: [
    "WiFi",
    "In-flight entertainment",
    "Complimentary meal",
    "USB charging port",
    "Reclining seats",
  ],
  "Premium Economy": [
    "WiFi",
    "In-flight entertainment",
    "Premium meal service",
    "Extra legroom",
    "Priority boarding",
    "USB and power outlets",
    "Amenity kit",
  ],
  Business: [
    "Lie-flat seats",
    "Gourmet meal service",
    "Lounge access",
    "Priority check-in",
    "Premium in-flight entertainment",
    "WiFi",
    "Power outlets",
    "Amenity kit",
    "Dedicated cabin crew",
  ],
  First: [
    "Private suite",
    "Fine dining",
    "Premium lounge access",
    "Chauffeur service",
    "Luxury amenity kit",
    "Premium bedding",
    "Personal cabin attendant",
    "Private screen",
    "Shower facility",
  ],
};

// Sample baggage allowance by class
const baggageByClass = {
  Economy: {
    cabin: "7 kg",
    checkin: "15 kg",
  },
  "Premium Economy": {
    cabin: "7 kg",
    checkin: "25 kg",
  },
  Business: {
    cabin: "10 kg",
    checkin: "35 kg",
  },
  First: {
    cabin: "14 kg",
    checkin: "40 kg",
  },
};

// Function to find airport code by city name
export const findAirportCode = (cityName: string): string | null => {
  const airport = airports.find(
    (a) => a.city.toLowerCase() === cityName.toLowerCase()
  );
  return airport?.code || null;
};

// Function to find city name by airport code
export const findCityName = (code: string): string | null => {
  const airport = airports.find(
    (a) => a.code.toLowerCase() === code.toLowerCase()
  );
  return airport?.city || null;
};

// Get a random element from an array
const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Get random subset of array
const getRandomSubset = <T>(array: T[], min: number, max: number): T[] => {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Generate a random flight
const generateRandomFlight = (
  origin: string,
  destination: string,
  date: string,
  id: number
): Flight => {
  // Parse the provided date and set a random departure time
  const departureDate = new Date(date);
  departureDate.setHours(Math.floor(Math.random() * 24));
  departureDate.setMinutes([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55][Math.floor(Math.random() * 12)]);

  // Generate random duration between 1-5 hours (in minutes)
  const duration = Math.floor(Math.random() * 240) + 60;

  // Calculate arrival time based on departure and duration
  const arrivalDate = new Date(departureDate.getTime() + duration * 60000);

  // Randomly determine if the flight has layovers
  const hasLayover = Math.random() > 0.7;
  let layovers = undefined;
  
  if (hasLayover) {
    const layoverCount = Math.floor(Math.random() * 2) + 1; // 1 or 2 layovers
    layovers = [];
    
    for (let i = 0; i < layoverCount; i++) {
      // Get a random airport that's neither the origin nor destination
      let layoverAirport;
      do {
        layoverAirport = getRandomElement(airports).city;
      } while (layoverAirport === origin || layoverAirport === destination);
      
      // Random layover duration between 30 mins and 3 hours
      const layoverDuration = Math.floor(Math.random() * 150) + 30;
      
      layovers.push({
        airport: layoverAirport,
        duration: layoverDuration,
      });
    }
  }

  // Select a random airline
  const airline = getRandomElement(airlines);

  // Generate a flight number
  const flightNumber = `${airline.code}${Math.floor(Math.random() * 9000) + 1000}`;

  // Select a random class with weighted probability
  const classOptions: Array<"Economy" | "Premium Economy" | "Business" | "First"> = [
    "Economy", "Economy", "Economy", "Economy", "Economy", "Economy", // 6/10 chance for Economy
    "Premium Economy", "Premium Economy", // 2/10 chance for Premium Economy
    "Business", // 1/10 chance for Business
    "First", // 1/10 chance for First
  ];
  const flightClass = getRandomElement(classOptions);
  
  // Generate a price based on class and distance
  let basePrice: number;
  switch (flightClass) {
    case "Economy":
      basePrice = Math.floor(Math.random() * 5000) + 3000;
      break;
    case "Premium Economy":
      basePrice = Math.floor(Math.random() * 8000) + 8000;
      break;
    case "Business":
      basePrice = Math.floor(Math.random() * 20000) + 15000;
      break;
    case "First":
      basePrice = Math.floor(Math.random() * 40000) + 30000;
      break;
    default:
      basePrice = Math.floor(Math.random() * 5000) + 3000;
  }
  
  // Adjust price for layovers and duration
  const price = basePrice + (layovers ? layovers.length * 1000 : 0) + (duration > 180 ? 2000 : 0);
  
  // Random seat availability
  const seatAvailability = Math.floor(Math.random() * 30) + 1;
  
  // Select random amenities based on class
  const amenities = getRandomSubset(amenitiesByClass[flightClass], 2, 5);
  
  // Select random aircraft
  const aircraft = getRandomElement(aircraftModels);
  
  // 70% chance of being refundable
  const refundable = Math.random() > 0.3;
  
  return {
    id: id.toString(),
    airline: airline.name,
    flightNumber,
    origin,
    destination,
    departureTime: departureDate.toISOString(),
    arrivalTime: arrivalDate.toISOString(),
    duration,
    price,
    available: true,
    aircraft,
    seatAvailability,
    class: flightClass,
    amenities,
    layovers,
    refundable,
    baggage: baggageByClass[flightClass],
  };
};

// Function to search for flights
export const searchFlights = async (
  origin: string,
  destination: string,
  date: string
): Promise<Flight[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Don't generate flights if origin and destination are the same
  if (
    origin.toLowerCase() === destination.toLowerCase() ||
    !origin ||
    !destination
  ) {
    return [];
  }

  // Format date if needed
  let formattedDate = date;
  if (!date) {
    const today = new Date();
    formattedDate = today.toISOString().split("T")[0];
  }

  // Generate 5-15 random flights
  const numFlights = Math.floor(Math.random() * 10) + 5;
  return Array.from({ length: numFlights }, (_, i) =>
    generateRandomFlight(origin, destination, formattedDate, i + 1)
  ).sort((a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime());
};
