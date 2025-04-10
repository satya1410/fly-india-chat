
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
  // New fields
  gate?: string;
  terminal?: string;
  cancellationFee?: number;
  mealOptions?: string[];
  wifiAvailable?: boolean;
  inFlightEntertainment?: boolean;
  powerOutlets?: boolean;
  status?: "Scheduled" | "Delayed" | "Boarding" | "In Air" | "Landed" | "Cancelled";
}

// New interface for ticket bookings
export interface Booking {
  id: string;
  userId: string;
  flightId: string;
  flight: Flight;
  passengerDetails: {
    name: string;
    email: string;
    phone?: string;
    dob?: string;
    passportNumber?: string;
  };
  bookingDate: string;
  status: "Confirmed" | "Cancelled" | "Completed";
  paymentStatus: "Paid" | "Pending" | "Failed" | "Refunded";
  paymentMethod?: string;
  totalAmount: number;
  seatNumber?: string;
  bookingReference: string;
  additionalServices?: {
    name: string;
    price: number;
  }[];
  checkInStatus?: "Not Available" | "Available" | "Completed";
}

// New interface for chat message with user ID
export interface ChatConversation {
  id: string;
  userId: string;
  title: string;
  timestamp: number;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  text: string;
  role: "user" | "bot";
  timestamp: number;
}
