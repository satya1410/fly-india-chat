
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plane, Clock, IndianRupee, Wifi, Briefcase, Coffee, Info } from "lucide-react";
import { formatTime, formatDuration } from "@/lib/dateUtils";
import { Flight } from "@/types/flight";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FlightCardProps {
  flight: Flight;
  onSelect: (flight: Flight) => void;
}

const FlightCard = ({ flight, onSelect }: FlightCardProps) => {
  // Function to get class color
  const getClassColor = (flightClass: string) => {
    switch (flightClass) {
      case "Economy": return "bg-green-100 text-green-800";
      case "Premium Economy": return "bg-blue-100 text-blue-800";
      case "Business": return "bg-purple-100 text-purple-800";
      case "First": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  // Get amenity icons
  const getAmenityIcon = (amenity: string) => {
    if (amenity.toLowerCase().includes("wifi")) return <Wifi className="h-3 w-3" />;
    if (amenity.toLowerCase().includes("meal")) return <Coffee className="h-3 w-3" />;
    if (amenity.toLowerCase().includes("baggage") || amenity.toLowerCase().includes("luggage")) return <Briefcase className="h-3 w-3" />;
    return <Info className="h-3 w-3" />;
  };

  return (
    <Card className="w-full mb-4 overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          {/* Airline and flight info */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-flyindia-light flex items-center justify-center mr-3">
                <Plane className="text-flyindia-primary h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">{flight.airline}</p>
                <p className="text-xs text-gray-500">{flight.flightNumber} • {flight.aircraft}</p>
              </div>
            </div>

            <div className="flex items-center">
              <Badge className={getClassColor(flight.class)}>
                {flight.class}
              </Badge>
              {flight.refundable ? (
                <Badge variant="outline" className="ml-2 border-green-300 text-green-700">
                  Refundable
                </Badge>
              ) : (
                <Badge variant="outline" className="ml-2 border-red-300 text-red-700">
                  Non-refundable
                </Badge>
              )}
              <Badge variant="outline" className="ml-2">
                {flight.seatAvailability} seats left
              </Badge>
            </div>
          </div>

          {/* Time and route */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-1 items-center justify-center space-x-3">
              <div className="text-center">
                <p className="font-bold text-lg">{formatTime(flight.departureTime)}</p>
                <p className="text-sm text-gray-700">{flight.origin}</p>
              </div>
              
              <div className="flex flex-col items-center mx-2">
                <div className="relative w-20 md:w-32">
                  <div className="border-t border-gray-300 absolute w-full top-1/2"></div>
                  <div className="absolute -left-1 top-1/2 w-2 h-2 rounded-full bg-flyindia-primary transform -translate-y-1/2"></div>
                  <div className="absolute -right-1 top-1/2 w-2 h-2 rounded-full bg-flyindia-primary transform -translate-y-1/2"></div>
                </div>
                <div className="flex items-center mt-1">
                  <Clock className="h-3 w-3 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-600">{formatDuration(flight.duration)}</span>
                </div>
                {flight.layovers && flight.layovers.length > 0 && (
                  <div className="text-xs text-orange-600 font-medium mt-1">
                    {flight.layovers.length === 1 
                      ? `1 stop at ${flight.layovers[0].airport}` 
                      : `${flight.layovers.length} stops`
                    }
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <p className="font-bold text-lg">{formatTime(flight.arrivalTime)}</p>
                <p className="text-sm text-gray-700">{flight.destination}</p>
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
          
          {/* Amenities and baggage */}
          <div className="flex flex-col md:flex-row justify-between items-start pt-2 border-t gap-2">
            <div className="flex flex-wrap gap-1">
              <TooltipProvider>
                {flight.amenities.map((amenity, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="flex items-center gap-1 text-xs">
                        {getAmenityIcon(amenity)}
                        {amenity}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{amenity}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
            <div className="text-xs text-gray-600">
              Baggage: {flight.baggage.cabin} (cabin) + {flight.baggage.checkin} (check-in)
            </div>
          </div>
          
          {/* Layover details */}
          {flight.layovers && flight.layovers.length > 0 && (
            <div className="text-xs bg-gray-50 p-2 rounded">
              <div className="font-medium mb-1">Layover details:</div>
              {flight.layovers.map((layover, index) => (
                <div key={index} className="flex justify-between">
                  <span>{layover.airport}</span>
                  <span>{formatDuration(layover.duration)} layover</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FlightCard;
