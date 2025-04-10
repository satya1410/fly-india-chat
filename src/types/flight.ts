
export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: number; // in minutes
  price: number;
  available: boolean;
  aircraft: string;
  seatAvailability: number;
  class: "Economy" | "Premium Economy" | "Business" | "First";
  amenities: string[];
  layovers?: {
    airport: string;
    duration: number; // in minutes
  }[];
  logo?: string;
  refundable: boolean;
  baggage: {
    cabin: string;
    checkin: string;
  };
}
