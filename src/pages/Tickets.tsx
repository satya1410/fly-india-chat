
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { Booking } from '@/types/flight';
import { ArrowLeft, Plane, CalendarDays, Clock, MapPin, Users, CreditCard, Download, Printer, QrCode, Phone } from 'lucide-react';

const Tickets = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('id');
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loadingBooking, setLoadingBooking] = useState(true);
  
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    } else if (user) {
      if (bookingId) {
        fetchBooking(bookingId);
      } else {
        fetchLatestBooking();
      }
    }
  }, [user, loading, bookingId, navigate]);
  
  const fetchBooking = async (id: string) => {
    try {
      setLoadingBooking(true);
      
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .eq('userId', user?.id)
        .single();
        
      if (error) throw error;
      
      setBooking(data);
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoadingBooking(false);
    }
  };
  
  const fetchLatestBooking = async () => {
    try {
      setLoadingBooking(true);
      
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('userId', user?.id)
        .order('bookingDate', { ascending: false })
        .limit(1)
        .single();
        
      if (error) throw error;
      
      setBooking(data);
    } catch (error) {
      console.error('Error fetching latest booking:', error);
      setBooking(null);
    } finally {
      setLoadingBooking(false);
    }
  };
  
  if (loading || loadingBooking) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-flyindia-primary border-b-flyindia-primary border-r-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading ticket information...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="container mx-auto py-6 px-4 flex-1">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              className="flex items-center" 
              onClick={() => navigate('/profile')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Profile
            </Button>
          </div>
          
          <div className="text-center max-w-md mx-auto py-12">
            <div className="mb-6">
              <Plane className="h-16 w-16 text-gray-300 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Ticket Found</h2>
            <p className="text-gray-500 mb-6">
              We couldn't find the ticket you're looking for. It may have been cancelled or doesn't exist.
            </p>
            <Button onClick={() => navigate('/')}>
              Book a Flight
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  const departureDate = new Date(booking.flight.departureTime).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const departureTime = new Date(booking.flight.departureTime).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const arrivalTime = new Date(booking.flight.arrivalTime).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="container mx-auto py-6 px-4 flex-1">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="flex items-center" 
            onClick={() => navigate('/profile')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Profile
          </Button>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-flyindia-light">
            <CardHeader className="bg-flyindia-primary text-white">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Boarding Pass</CardTitle>
                <div className="rounded-full bg-white p-1">
                  <img 
                    src="/logo.png" 
                    alt="FlyIndia Logo" 
                    className="h-8 w-8"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/32?text=FI';
                    }}
                  />
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="p-6 border-b relative">
                <div className="absolute top-0 left-0 w-full h-4 bg-flyindia-primary"></div>
                
                <div className="flex flex-col md:flex-row justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Airline</p>
                    <p className="font-medium">{booking.flight.airline}</p>
                    <p className="text-sm text-gray-500">Flight {booking.flight.flightNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Passenger</p>
                    <p className="font-medium">{booking.passengerDetails.name}</p>
                    <p className="text-sm text-gray-500">{booking.seatNumber || 'Seat TBA'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Class</p>
                    <p className="font-medium">{booking.flight.class}</p>
                    <p className="text-sm text-gray-500">{booking.flight.refundable ? 'Refundable' : 'Non-refundable'}</p>
                  </div>
                </div>
                
                <div className="mb-6 flex items-center">
                  <CalendarDays className="h-5 w-5 text-flyindia-primary mr-2" />
                  <span className="font-medium">{departureDate}</span>
                </div>
                
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="text-center md:text-left mb-4 md:mb-0">
                    <p className="text-3xl font-bold">{booking.flight.origin}</p>
                    <div className="flex items-center justify-center md:justify-start">
                      <Clock className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-gray-500">{departureTime}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center mx-2 mb-4 md:mb-0">
                    <div className="relative w-32 md:w-48">
                      <div className="border-t-2 border-dashed border-flyindia-primary absolute w-full top-1/2"></div>
                      <Plane className="absolute right-0 top-1/2 h-5 w-5 text-flyindia-primary transform -translate-y-1/2" />
                    </div>
                    <div className="mt-2 text-center">
                      <span className="text-sm text-gray-500">{booking.flight.duration} min</span>
                    </div>
                  </div>
                  
                  <div className="text-center md:text-right">
                    <p className="text-3xl font-bold">{booking.flight.destination}</p>
                    <div className="flex items-center justify-center md:justify-end">
                      <Clock className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-gray-500">{arrivalTime}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 relative">
                <div className="absolute left-0 top-0 h-full w-4 bg-flyindia-primary"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="flex items-center mb-2">
                      <MapPin className="h-4 w-4 text-flyindia-primary mr-2" />
                      <span className="text-sm font-medium">Terminal Info</span>
                    </div>
                    <p className="text-sm">
                      Terminal: {booking.flight.terminal || 'TBA'}<br />
                      Gate: {booking.flight.gate || 'TBA'}<br />
                      Boarding: 45 min before departure
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-2">
                      <Users className="h-4 w-4 text-flyindia-primary mr-2" />
                      <span className="text-sm font-medium">Baggage Info</span>
                    </div>
                    <p className="text-sm">
                      Cabin: {booking.flight.baggage.cabin}<br />
                      Check-in: {booking.flight.baggage.checkin}<br />
                      Drop-off: 90 min before departure
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-2">
                      <CreditCard className="h-4 w-4 text-flyindia-primary mr-2" />
                      <span className="text-sm font-medium">Booking Info</span>
                    </div>
                    <p className="text-sm">
                      Reference: {booking.bookingReference}<br />
                      Status: {booking.status}<br />
                      Payment: {booking.paymentStatus}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-4 md:mb-0">
                    <QrCode className="h-24 w-24" />
                  </div>
                  
                  <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                    <Button variant="outline" className="flex items-center">
                      <Printer className="mr-2 h-4 w-4" /> Print
                    </Button>
                    <Button variant="outline" className="flex items-center">
                      <Download className="mr-2 h-4 w-4" /> Save
                    </Button>
                    <Button className="flex items-center bg-flyindia-primary hover:bg-flyindia-secondary">
                      <Phone className="mr-2 h-4 w-4" /> Support
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Tickets;
