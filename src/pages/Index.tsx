
import { useState } from "react";
import ChatBot from "@/components/ChatBot";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plane, MessageSquare, BookOpen } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      
      <div className="flex-1 overflow-hidden container mx-auto max-w-6xl p-4">
        <Tabs 
          defaultValue="chat" 
          className="h-full flex flex-col"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="mx-auto mb-4">
            <TabsTrigger value="chat" className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              <span>Chat Assistant</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              <span>About</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-hidden">
            <TabsContent value="chat" className="rounded-lg bg-white border shadow-sm h-full">
              <ChatBot />
            </TabsContent>
            
            <TabsContent value="about" className="rounded-lg bg-white border shadow-sm p-6 h-full overflow-auto">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 gradient-text">Welcome to FlyIndia AI Chat Assistant</h2>
                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-3 text-flyindia-primary">How to Use</h3>
                  <p className="mb-4 text-gray-700">
                    Our AI chat assistant makes booking flights simple. Just chat naturally and tell us what you need.
                  </p>
                  
                  <div className="bg-flyindia-accent rounded-lg p-4 mb-4">
                    <h4 className="font-medium mb-2">Example Queries:</h4>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                      <li>"Find flights from Delhi to Mumbai tomorrow"</li>
                      <li>"Search for flights between Chennai and Bangalore"</li>
                      <li>"How much is a ticket from Kolkata to Hyderabad?"</li>
                      <li>"Book this flight for Priya Sharma"</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-3 text-flyindia-primary">Features</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 rounded-full bg-flyindia-light flex items-center justify-center mr-3">
                          <Plane className="text-flyindia-primary h-5 w-5" />
                        </div>
                        <h4 className="font-medium">Flight Search</h4>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Search flights between major Indian cities with flexible dates
                      </p>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 rounded-full bg-flyindia-light flex items-center justify-center mr-3">
                          <MessageSquare className="text-flyindia-primary h-5 w-5" />
                        </div>
                        <h4 className="font-medium">Natural Language</h4>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Simply chat naturally - no need for complicated forms
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-flyindia-primary">Supported Cities</h3>
                  <p className="mb-4 text-gray-700">
                    We currently support flights between major Indian cities including:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <div className="bg-flyindia-light rounded p-2 text-center">Delhi</div>
                    <div className="bg-flyindia-light rounded p-2 text-center">Mumbai</div>
                    <div className="bg-flyindia-light rounded p-2 text-center">Bangalore</div>
                    <div className="bg-flyindia-light rounded p-2 text-center">Chennai</div>
                    <div className="bg-flyindia-light rounded p-2 text-center">Kolkata</div>
                    <div className="bg-flyindia-light rounded p-2 text-center">Hyderabad</div>
                    <div className="bg-flyindia-light rounded p-2 text-center">Kochi</div>
                    <div className="bg-flyindia-light rounded p-2 text-center">Jaipur</div>
                    <div className="bg-flyindia-light rounded p-2 text-center">Ahmedabad</div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
