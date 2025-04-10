
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
];

// Sample airlines
const airlines = [
  "Air India",
  "IndiGo",
  "SpiceJet",
  "Vistara",
  "GoAir",
  "AirAsia India",
];

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
  departureDate.setMinutes([0, 15, 30, 45][Math.floor(Math.random() * 4)]);

  // Generate random duration between 1-5 hours (in minutes)
  const duration = Math.floor(Math.random() * 240) + 60;

  // Calculate arrival time based on departure and duration
  const arrivalDate = new Date(departureDate.getTime() + duration * 60000);

  // Generate a random price between ₹3,000 and ₹15,000
  const price = Math.floor(Math.random() * 12000) + 3000;

  // Select a random airline
  const airline = airlines[Math.floor(Math.random() * airlines.length)];

  // Generate a random flight number
  const flightNumber = `${airline.substring(0, 2).toUpperCase()}${
    Math.floor(Math.random() * 9000) + 1000
  }`;

  return {
    id: id.toString(),
    airline,
    flightNumber,
    origin,
    destination,
    departureTime: departureDate.toISOString(),
    arrivalTime: arrivalDate.toISOString(),
    duration,
    price,
    available: Math.random() > 0.2, // 80% chance of being available
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

  // Generate 0-8 random flights
  const numFlights = Math.floor(Math.random() * 8) + 1;
  return Array.from({ length: numFlights }, (_, i) =>
    generateRandomFlight(origin, destination, formattedDate, i + 1)
  ).sort((a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime());
};
