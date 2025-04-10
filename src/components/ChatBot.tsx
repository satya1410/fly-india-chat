
import { useState, useRef, useEffect } from "react";
import ChatMessage, { MessageRole } from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import FlightList from "@/components/FlightList";
import BookingConfirmation from "@/components/BookingConfirmation";
import { Flight } from "@/types/flight";
import { processUserMessage } from "@/lib/nlpService";
import { searchFlights } from "@/lib/flightService";
import { useToast } from "@/hooks/use-toast";

export interface Message {
  id: string;
  text: string;
  role: MessageRole;
}

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  text: "Hello! I'm your FlyIndia assistant. I can help you search for flights, check prices, and book tickets. How can I assist you today?",
  role: "bot",
};

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [passengerName, setPassengerName] = useState<string>("");
  const [showFlightResults, setShowFlightResults] = useState(false);
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, flights, showBookingConfirmation]);

  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      role: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Process message with NLP service
      const response = await processUserMessage(text);

      if (response.intent === "search_flights") {
        // Search for flights
        const searchResults = await searchFlights(
          response.entities.origin,
          response.entities.destination,
          response.entities.date
        );

        setFlights(searchResults);
        setShowFlightResults(true);
        
        // Add bot response
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: searchResults.length 
            ? `I found ${searchResults.length} flights from ${response.entities.origin} to ${response.entities.destination}. Here are the results:` 
            : `I couldn't find any flights from ${response.entities.origin} to ${response.entities.destination} on the selected date. Would you like to try different dates or destinations?`,
          role: "bot",
        };
        
        setMessages((prev) => [...prev, botResponse]);
      } 
      else if (response.intent === "book_flight" && response.entities.name) {
        setPassengerName(response.entities.name);
        
        if (selectedFlight) {
          setShowBookingConfirmation(true);
          
          const botResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: `Great! I've prepared a booking for ${response.entities.name} on the selected flight. Please review the details and confirm your booking.`,
            role: "bot",
          };
          
          setMessages((prev) => [...prev, botResponse]);
        } else {
          const botResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: `I'll need you to select a flight first before I can book it for ${response.entities.name}. Would you like to search for flights?`,
            role: "bot",
          };
          
          setMessages((prev) => [...prev, botResponse]);
        }
      } 
      else {
        // General responses
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: response.reply,
          role: "bot",
        };
        
        setMessages((prev) => [...prev, botResponse]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I encountered an error processing your request. Please try again.",
        role: "bot",
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      console.error("Error processing message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFlight = (flight: Flight) => {
    setSelectedFlight(flight);
    setShowFlightResults(false);
    
    const botResponse: Message = {
      id: Date.now().toString(),
      text: `You've selected ${flight.airline} flight ${flight.flightNumber} from ${flight.origin} to ${flight.destination} for ₹${flight.price.toLocaleString('en-IN')}. Would you like to proceed with booking? Please provide the passenger name.`,
      role: "bot",
    };
    
    setMessages((prev) => [...prev, botResponse]);
  };

  const handleConfirmBooking = () => {
    // In a real app, this would call an API to create a booking
    setShowBookingConfirmation(false);
    
    const botResponse: Message = {
      id: Date.now().toString(),
      text: `Congratulations! Your flight from ${selectedFlight?.origin} to ${selectedFlight?.destination} has been booked successfully. A confirmation email has been sent to your registered email address. Your booking reference is ${Math.random().toString(36).substring(2, 10).toUpperCase()}.`,
      role: "bot",
    };
    
    setMessages((prev) => [...prev, botResponse]);
    
    toast({
      title: "Booking Confirmed!",
      description: "Your flight has been booked successfully.",
    });
    
    // Reset the booking flow
    setSelectedFlight(null);
    setPassengerName("");
  };

  const handleCancelBooking = () => {
    setShowBookingConfirmation(false);
    
    const botResponse: Message = {
      id: Date.now().toString(),
      text: "I've cancelled this booking. Would you like to search for different flights or make any other changes?",
      role: "bot",
    };
    
    setMessages((prev) => [...prev, botResponse]);
  };

  return (
    <div className="flex flex-col h-full max-w-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.text}
              role={message.role}
            />
          ))}
          
          {isLoading && (
            <ChatMessage
              message=""
              role="bot"
              isLoading={true}
            />
          )}
          
          {showFlightResults && flights.length > 0 && (
            <div className="w-full my-4">
              <FlightList 
                flights={flights} 
                onSelectFlight={handleSelectFlight} 
              />
            </div>
          )}
          
          {showBookingConfirmation && selectedFlight && (
            <div className="w-full my-4">
              <BookingConfirmation
                flight={selectedFlight}
                passengerName={passengerName}
                onConfirm={handleConfirmBooking}
                onCancel={handleCancelBooking}
              />
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="border-t p-4 bg-white">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          disabled={isLoading} 
        />
      </div>
    </div>
  );
};

export default ChatBot;
