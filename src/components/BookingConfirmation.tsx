
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatTime } from "@/lib/dateUtils";
import { Flight } from "@/types/flight";
import { Check, Plane, ArrowRight, Calendar, Clock, IndianRupee, User } from "lucide-react";

interface BookingConfirmationProps {
  flight: Flight;
  passengerName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const BookingConfirmation = ({ 
  flight, 
  passengerName, 
  onConfirm, 
  onCancel 
}: BookingConfirmationProps) => {
  return (
    <Card className="w-full border-2 border-flyindia-light">
      <CardHeader className="bg-flyindia-accent">
        <CardTitle className="text-xl flex items-center">
          <Plane className="mr-2 h-5 w-5 text-flyindia-primary" />
          Flight Booking Summary
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b">
            <div className="flex flex-col">
              <p className="text-sm text-gray-500">Airline</p>
              <p className="font-medium">{flight.airline}</p>
              <p className="text-xs text-gray-400">{flight.flightNumber}</p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-sm text-gray-500">Passenger</p>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1 text-gray-400" /> 
                <p className="font-medium">{passengerName}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between pb-4 border-b">
            <div className="flex items-start space-x-4 mb-4 md:mb-0">
              <div className="flex flex-col items-center">
                <Calendar className="h-5 w-5 text-flyindia-primary mb-1" />
                <p className="text-sm">{formatDate(flight.departureTime)}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3 flex-1">
              <div className="text-center">
                <p className="font-bold text-lg">{formatTime(flight.departureTime)}</p>
                <p className="text-sm">{flight.origin}</p>
              </div>
              
              <div className="flex flex-col items-center mx-6">
                <div className="relative w-20 md:w-32">
                  <div className="border-t-2 border-dashed border-flyindia-primary absolute w-full top-1/2"></div>
                  <ArrowRight className="absolute right-0 top-1/2 h-4 w-4 text-flyindia-primary transform -translate-y-1/2" />
                </div>
                <div className="flex items-center mt-1">
                  <Clock className="h-3 w-3 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-500">{flight.duration} min</span>
                </div>
              </div>
              
              <div className="text-center">
                <p className="font-bold text-lg">{formatTime(flight.arrivalTime)}</p>
                <p className="text-sm">{flight.destination}</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <div className="text-sm text-gray-500">Total Amount</div>
            <div className="flex items-center">
              <IndianRupee className="h-5 w-5 text-flyindia-primary mr-1" />
              <span className="font-bold text-xl">{flight.price.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between space-x-4 bg-gray-50 mt-4 p-4">
        <Button 
          variant="outline" 
          className="flex-1" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          className="flex-1 bg-flyindia-primary hover:bg-flyindia-secondary"
          onClick={onConfirm}
        >
          <Check className="mr-2 h-4 w-4" /> Confirm Booking
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingConfirmation;
