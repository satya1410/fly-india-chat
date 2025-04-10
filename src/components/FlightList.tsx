
import FlightCard from "@/components/FlightCard";
import { Flight } from "@/types/flight";

interface FlightListProps {
  flights: Flight[];
  onSelectFlight: (flight: Flight) => void;
}

const FlightList = ({ flights, onSelectFlight }: FlightListProps) => {
  return (
    <div className="w-full space-y-4">
      <h3 className="text-lg font-medium mb-2">Available Flights</h3>
      {flights.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No flights found</div>
      ) : (
        flights.map((flight) => (
          <FlightCard
            key={flight.id}
            flight={flight}
            onSelect={onSelectFlight}
          />
        ))
      )}
    </div>
  );
};

export default FlightList;
