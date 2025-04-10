
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plane, Clock, IndianRupee } from "lucide-react";
import { formatTime, formatDuration } from "@/lib/dateUtils";
import { Flight } from "@/types/flight";

interface FlightCardProps {
  flight: Flight;
  onSelect: (flight: Flight) => void;
}

const FlightCard = ({ flight, onSelect }: FlightCardProps) => {
  return (
    <Card className="w-full mb-4 overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-flyindia-light flex items-center justify-center mr-3">
              <Plane className="text-flyindia-primary h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{flight.airline}</p>
              <p className="text-xs text-gray-400">{flight.flightNumber}</p>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center space-x-3">
            <div className="text-center">
              <p className="font-bold">{formatTime(flight.departureTime)}</p>
              <p className="text-sm text-gray-500">{flight.origin}</p>
            </div>
            
            <div className="flex flex-col items-center mx-2">
              <div className="relative w-20 md:w-32">
                <div className="border-t border-gray-300 absolute w-full top-1/2"></div>
                <div className="absolute -left-1 top-1/2 w-2 h-2 rounded-full bg-flyindia-primary transform -translate-y-1/2"></div>
                <div className="absolute -right-1 top-1/2 w-2 h-2 rounded-full bg-flyindia-primary transform -translate-y-1/2"></div>
              </div>
              <div className="flex items-center mt-1">
                <Clock className="h-3 w-3 text-gray-400 mr-1" />
                <span className="text-xs text-gray-400">{formatDuration(flight.duration)}</span>
              </div>
            </div>
            
            <div className="text-center">
              <p className="font-bold">{formatTime(flight.arrivalTime)}</p>
              <p className="text-sm text-gray-500">{flight.destination}</p>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="flex items-center mb-2">
              <IndianRupee className="h-4 w-4 text-flyindia-primary mr-1" />
              <span className="font-bold text-lg">{flight.price.toLocaleString('en-IN')}</span>
            </div>
            <Button 
              className="bg-flyindia-primary hover:bg-flyindia-secondary"
              onClick={() => onSelect(flight)}
            >
              Select
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlightCard;
