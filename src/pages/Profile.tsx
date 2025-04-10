
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/lib/supabaseClient';
import { CalendarDays, CreditCard, Plane, MessageSquare, LogOut, Ticket } from 'lucide-react';
import { Booking } from '@/types/flight';
import { ChatConversation } from '@/types/flight';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeTab, setActiveTab] = useState('account');
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    } else if (user) {
      fetchUserData();
    }
  }, [user, loading, navigate]);

  const fetchUserData = async () => {
    try {
      setLoadingData(true);
      
      // Fetch user bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('userId', user?.id)
        .order('bookingDate', { ascending: false });
        
      if (bookingsError) throw bookingsError;
      
      // Fetch user conversations
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select('*')
        .eq('userId', user?.id)
        .order('timestamp', { ascending: false });
        
      if (conversationsError) throw conversationsError;
      
      setBookings(bookingsData || []);
      setConversations(conversationsData || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-flyindia-primary border-b-flyindia-primary border-r-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="container mx-auto py-6 px-4 flex-1">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="text-2xl bg-flyindia-primary text-white">
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                      {user.user_metadata?.avatar_url && (
                        <AvatarImage src={user.user_metadata.avatar_url} />
                      )}
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">{user.user_metadata?.full_name || user.email}</CardTitle>
                      <CardDescription className="text-sm mt-1">{user.email}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Ticket className="h-5 w-5 text-flyindia-primary" />
                      <span className="text-sm font-medium">{bookings.length} Bookings</span>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/tickets">View All</Link>
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5 text-flyindia-primary" />
                      <span className="text-sm font-medium">{conversations.length} Conversations</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                      New Chat
                    </Button>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:w-2/3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="account" className="flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  <span>Account Activity</span>
                </TabsTrigger>
                <TabsTrigger value="bookings" className="flex items-center">
                  <Plane className="mr-2 h-4 w-4" />
                  <span>Recent Bookings</span>
                </TabsTrigger>
                <TabsTrigger value="conversations" className="flex items-center">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Chat History</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Your account details and activity</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Account Type</div>
                        <div className="font-medium">Google Account</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Member Since</div>
                        <div className="font-medium">
                          {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-md font-medium mb-2">Recent Activity</h3>
                      {loadingData ? (
                        <div className="text-center py-4">
                          <div className="w-6 h-6 border-2 border-t-flyindia-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-2"></div>
                          <p className="text-sm text-gray-500">Loading activity...</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {bookings.length > 0 || conversations.length > 0 ? (
                            <>
                              {bookings.slice(0, 2).map((booking) => (
                                <div key={booking.id} className="flex items-start space-x-3 p-2 rounded-md hover:bg-gray-50">
                                  <Plane className="h-5 w-5 text-flyindia-primary mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium">Booked a flight from {booking.flight.origin} to {booking.flight.destination}</p>
                                    <p className="text-xs text-gray-500">{new Date(booking.bookingDate).toLocaleString()}</p>
                                  </div>
                                </div>
                              ))}
                              
                              {conversations.slice(0, 2).map((convo) => (
                                <div key={convo.id} className="flex items-start space-x-3 p-2 rounded-md hover:bg-gray-50">
                                  <MessageSquare className="h-5 w-5 text-flyindia-primary mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium">{convo.title}</p>
                                    <p className="text-xs text-gray-500">{new Date(convo.timestamp).toLocaleString()}</p>
                                  </div>
                                </div>
                              ))}
                            </>
                          ) : (
                            <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="bookings">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Bookings</CardTitle>
                    <CardDescription>Recent flight bookings and their status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loadingData ? (
                      <div className="text-center py-8">
                        <div className="w-8 h-8 border-2 border-t-flyindia-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading your bookings...</p>
                      </div>
                    ) : bookings.length > 0 ? (
                      <div className="space-y-4">
                        {bookings.map((booking) => (
                          <div key={booking.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-medium">{booking.flight.airline} {booking.flight.flightNumber}</h3>
                                <p className="text-sm text-gray-500">
                                  {new Date(booking.flight.departureTime).toLocaleDateString()} • 
                                  {booking.passengerDetails.name}
                                </p>
                              </div>
                              <div className={`px-2 py-1 rounded text-xs font-medium ${
                                booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                                booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {booking.status}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mb-3">
                              <div className="text-center">
                                <p className="text-lg font-bold">{booking.flight.origin}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(booking.flight.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </p>
                              </div>
                              
                              <div className="flex-1 mx-4 relative">
                                <div className="border-t border-gray-300 absolute w-full top-1/2"></div>
                                <Plane className="h-4 w-4 text-flyindia-primary absolute right-0 top-1/2 transform -translate-y-1/2" />
                              </div>
                              
                              <div className="text-center">
                                <p className="text-lg font-bold">{booking.flight.destination}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(booking.flight.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center text-sm">
                              <div className="flex items-center">
                                <CreditCard className="h-4 w-4 text-gray-400 mr-1" />
                                <span>₹{booking.totalAmount.toLocaleString('en-IN')}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 mr-2">Ref:</span>
                                <span className="font-mono">{booking.bookingReference}</span>
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline"
                                asChild
                              >
                                <Link to={`/tickets?id=${booking.id}`}>View Ticket</Link>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="mb-4">
                          <Plane className="h-12 w-12 text-gray-300 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">No Bookings Yet</h3>
                        <p className="text-gray-500 mb-4">You haven't booked any flights with us yet.</p>
                        <Button onClick={() => navigate('/')}>
                          Book a Flight
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="conversations">
                <Card>
                  <CardHeader>
                    <CardTitle>Chat History</CardTitle>
                    <CardDescription>Your previous conversations with our assistant</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loadingData ? (
                      <div className="text-center py-8">
                        <div className="w-8 h-8 border-2 border-t-flyindia-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading your conversations...</p>
                      </div>
                    ) : conversations.length > 0 ? (
                      <div className="space-y-2">
                        {conversations.map((convo) => (
                          <div 
                            key={convo.id} 
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                            onClick={() => navigate(`/?conversation=${convo.id}`)}
                          >
                            <div className="flex items-center">
                              <MessageSquare className="h-5 w-5 text-flyindia-primary mr-3" />
                              <div>
                                <p className="font-medium">{convo.title}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(convo.timestamp).toLocaleString()} • 
                                  {convo.messages.length} messages
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              Continue
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="mb-4">
                          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">No Conversations Yet</h3>
                        <p className="text-gray-500 mb-4">You haven't chatted with our assistant yet.</p>
                        <Button onClick={() => navigate('/')}>
                          Start Chatting
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
