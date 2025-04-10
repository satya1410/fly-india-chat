
import { useState, useRef, useEffect } from "react";
import ChatMessage, { MessageRole } from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import FlightList from "@/components/FlightList";
import BookingConfirmation from "@/components/BookingConfirmation";
import { Flight } from "@/types/flight";
import { processUserMessage } from "@/lib/nlpService";
import { searchFlights } from "@/lib/flightService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { SaveIcon, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Message {
  id: string;
  text: string;
  role: MessageRole;
  timestamp: number;
}

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  text: "Hello! I'm your FlyIndia assistant. I can help you search for flights, check prices, and book tickets. How can I assist you today?",
  role: "bot",
  timestamp: Date.now(),
};

const STORAGE_KEY = "flyindia_chat_history";

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [passengerName, setPassengerName] = useState<string>("");
  const [showFlightResults, setShowFlightResults] = useState(false);
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  const [conversations, setConversations] = useState<{id: string, title: string, timestamp: number}[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load conversations from localStorage
  useEffect(() => {
    const savedConversations = localStorage.getItem('flyindia_conversations');
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations));
    }
    
    // Start a new conversation
    startNewConversation();
  }, []);

  // Load messages for current conversation
  useEffect(() => {
    if (currentConversationId) {
      const savedMessages = localStorage.getItem(`${STORAGE_KEY}_${currentConversationId}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        setMessages([INITIAL_MESSAGE]);
      }
    }
  }, [currentConversationId]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (currentConversationId && messages.length > 0) {
      localStorage.setItem(`${STORAGE_KEY}_${currentConversationId}`, JSON.stringify(messages));
      
      // Update conversation title based on first user message
      const userMessages = messages.filter(m => m.role === 'user');
      if (userMessages.length > 0) {
        const title = userMessages[0].text.substring(0, 30) + (userMessages[0].text.length > 30 ? '...' : '');
        updateConversationTitle(currentConversationId, title);
      }
    }
  }, [messages, currentConversationId]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, flights, showBookingConfirmation]);

  const startNewConversation = () => {
    const id = Date.now().toString();
    const newConvo = {
      id,
      title: "New conversation",
      timestamp: Date.now()
    };
    
    setConversations(prev => {
      const updated = [...prev, newConvo];
      localStorage.setItem('flyindia_conversations', JSON.stringify(updated));
      return updated;
    });
    
    setCurrentConversationId(id);
    setMessages([INITIAL_MESSAGE]);
    setFlights([]);
    setSelectedFlight(null);
    setPassengerName("");
    setShowFlightResults(false);
    setShowBookingConfirmation(false);
  };

  const loadConversation = (id: string) => {
    setCurrentConversationId(id);
    setFlights([]);
    setSelectedFlight(null);
    setPassengerName("");
    setShowFlightResults(false);
    setShowBookingConfirmation(false);
  };

  const updateConversationTitle = (id: string, title: string) => {
    setConversations(prev => {
      const updated = prev.map(convo => 
        convo.id === id ? { ...convo, title } : convo
      );
      localStorage.setItem('flyindia_conversations', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteConversation = (id: string) => {
    // Remove from localStorage
    localStorage.removeItem(`${STORAGE_KEY}_${id}`);
    
    // Update conversations list
    setConversations(prev => {
      const updated = prev.filter(convo => convo.id !== id);
      localStorage.setItem('flyindia_conversations', JSON.stringify(updated));
      return updated;
    });
    
    // If current conversation was deleted, start a new one
    if (id === currentConversationId) {
      if (conversations.length > 1) {
        // Load the most recent conversation
        const mostRecent = conversations
          .filter(convo => convo.id !== id)
          .sort((a, b) => b.timestamp - a.timestamp)[0];
        loadConversation(mostRecent.id);
      } else {
        startNewConversation();
      }
    }
  };

  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      role: "user",
      timestamp: Date.now(),
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
          timestamp: Date.now(),
        };
        
        setMessages((prev) => [...prev, botResponse]);
      } 
      else if (response.intent === "book_flight" && response.entities.name) {
        // Check if user is logged in
        if (!user) {
          const loginPrompt: Message = {
            id: Date.now().toString(),
            text: "You need to be logged in to book tickets. Would you like to go to the login page now?",
            role: "bot",
            timestamp: Date.now(),
          };
          
          setMessages((prev) => [...prev, loginPrompt]);
        } 
        else if (selectedFlight) {
          setPassengerName(response.entities.name);
          setShowBookingConfirmation(true);
          
          const botResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: `Great! I've prepared a booking for ${response.entities.name} on the selected flight. Please review the details and confirm your booking.`,
            role: "bot",
            timestamp: Date.now(),
          };
          
          setMessages((prev) => [...prev, botResponse]);
        } else {
          const botResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: `I'll need you to select a flight first before I can book it for ${response.entities.name}. Would you like to search for flights?`,
            role: "bot",
            timestamp: Date.now(),
          };
          
          setMessages((prev) => [...prev, botResponse]);
        }
      }
      // Add login intent handler
      else if (response.intent === "login" || 
               text.toLowerCase().includes("login") || 
               text.toLowerCase().includes("log in") ||
               text.toLowerCase().includes("sign in")) {
        // Redirect to login page
        navigate('/login');
      }
      else {
        // General responses
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: response.reply,
          role: "bot",
          timestamp: Date.now(),
        };
        
        setMessages((prev) => [...prev, botResponse]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I encountered an error processing your request. Please try again.",
        role: "bot",
        timestamp: Date.now(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      console.error("Error processing message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFlight = (flight: Flight) => {
    // Check if user is logged in before allowing selection
    if (!user) {
      const loginPrompt: Message = {
        id: Date.now().toString(),
        text: "You need to be logged in to proceed with booking. Would you like to go to the login page now?",
        role: "bot",
        timestamp: Date.now(),
      };
      
      setMessages((prev) => [...prev, loginPrompt]);
      setShowFlightResults(false);
      return;
    }
    
    setSelectedFlight(flight);
    setShowFlightResults(false);
    
    const botResponse: Message = {
      id: Date.now().toString(),
      text: `You've selected ${flight.airline} flight ${flight.flightNumber} from ${flight.origin} to ${flight.destination} for ₹${flight.price.toLocaleString('en-IN')}. This ${flight.class} class flight includes ${flight.baggage.checkin} checked baggage and ${flight.amenities.join(", ")}. Would you like to proceed with booking? Please provide the passenger name.`,
      role: "bot",
      timestamp: Date.now(),
    };
    
    setMessages((prev) => [...prev, botResponse]);
  };

  const handleConfirmBooking = () => {
    // In a real app, this would call an API to create a booking
    setShowBookingConfirmation(false);
    
    const bookingReference = Math.random().toString(36).substring(2, 10).toUpperCase();
    
    const botResponse: Message = {
      id: Date.now().toString(),
      text: `Congratulations! Your ${selectedFlight?.class} class flight from ${selectedFlight?.origin} to ${selectedFlight?.destination} has been booked successfully. A confirmation email has been sent to your registered email address. Your booking reference is ${bookingReference}. You're entitled to ${selectedFlight?.baggage.cabin} cabin baggage and ${selectedFlight?.baggage.checkin} checked baggage.`,
      role: "bot",
      timestamp: Date.now(),
    };
    
    setMessages((prev) => [...prev, botResponse]);
    
    toast({
      title: "Booking Confirmed!",
      description: `Booking reference: ${bookingReference}`,
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
      timestamp: Date.now(),
    };
    
    setMessages((prev) => [...prev, botResponse]);
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full max-w-full">
      <div className="py-2 px-4 border-b flex flex-wrap gap-2 bg-white">
        <Button 
          onClick={startNewConversation}
          size="sm" 
          variant="outline" 
          className="text-flyindia-primary"
        >
          New Chat
        </Button>
        
        {conversations.slice().sort((a, b) => b.timestamp - a.timestamp).map(convo => (
          <div 
            key={convo.id} 
            className={`flex items-center ${currentConversationId === convo.id ? 'bg-flyindia-light text-flyindia-primary font-medium' : 'bg-gray-100'} px-3 py-1.5 rounded-full text-sm cursor-pointer group hover:bg-flyindia-light transition-colors`}
            onClick={() => loadConversation(convo.id)}
          >
            {convo.title}
            {currentConversationId !== convo.id && (
              <Trash2 
                className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500" 
                onClick={(e) => {
                  e.stopPropagation();
                  deleteConversation(convo.id);
                }}
              />
            )}
          </div>
        ))}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!user && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
            <p className="text-yellow-700 mb-2 font-medium">Login Required for Booking</p>
            <p className="text-yellow-600 text-sm mb-3">
              You need to be logged in to book tickets. You can search for flights, but booking requires an account.
            </p>
            <Button 
              onClick={handleLoginRedirect} 
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
              size="sm"
            >
              Sign In Now
            </Button>
          </div>
        )}
        
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.text}
              role={message.role}
              timestamp={new Date(message.timestamp).toLocaleTimeString()}
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
