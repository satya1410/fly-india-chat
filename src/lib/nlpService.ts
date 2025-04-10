
interface NLPResponse {
  intent: string;
  entities: {
    origin?: string;
    destination?: string;
    date?: string;
    name?: string;
    [key: string]: string | undefined;
  };
  reply: string;
}

// Mock NLP service to process user messages
export const processUserMessage = async (message: string): Promise<NLPResponse> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const lowerMessage = message.toLowerCase();
  
  // Detect flight search intent
  if (
    lowerMessage.includes('flight') && 
    (lowerMessage.includes('search') || 
     lowerMessage.includes('find') || 
     lowerMessage.includes('book') || 
     lowerMessage.includes('from') || 
     lowerMessage.includes('to'))
  ) {
    // Extract origin and destination using regex pattern "from X to Y"
    const locationMatch = lowerMessage.match(/(?:from|between)\s+([a-z ]+)(?:to|and)\s+([a-z ]+)/i);
    
    if (locationMatch) {
      const origin = locationMatch[1].trim();
      const destination = locationMatch[2].trim();
      
      // Extract date if present
      const dateMatch = lowerMessage.match(/(?:on|for|date)\s+(\d{1,2}(?:st|nd|rd|th)?\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)(?:\w*)(?:\s+\d{4})?)/i);
      const todayMatch = lowerMessage.includes('today');
      const tomorrowMatch = lowerMessage.includes('tomorrow');
      
      let date = '';
      
      if (dateMatch) {
        // Convert written date to ISO format (simplified)
        date = new Date().toISOString().split('T')[0]; // A real NLP would parse the date properly
      } else if (todayMatch) {
        date = new Date().toISOString().split('T')[0];
      } else if (tomorrowMatch) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        date = tomorrow.toISOString().split('T')[0];
      } else {
        // Default to today
        date = new Date().toISOString().split('T')[0];
      }
      
      return {
        intent: 'search_flights',
        entities: {
          origin,
          destination,
          date
        },
        reply: `Searching for flights from ${origin} to ${destination}...`
      };
    }
  }
  
  // Detect booking intent
  if (
    (lowerMessage.includes('book') || lowerMessage.includes('reserve')) && 
    lowerMessage.includes('name')
  ) {
    // Extract passenger name
    const nameMatch = lowerMessage.match(/(?:my name is|for|passenger|name is|book for)\s+([a-z ]+)/i);
    
    if (nameMatch) {
      const name = nameMatch[1].trim();
      
      return {
        intent: 'book_flight',
        entities: {
          name
        },
        reply: `I'll book this flight for ${name}.`
      };
    }
  }
  
  // Detect greeting
  if (
    lowerMessage.includes('hello') || 
    lowerMessage.includes('hi') || 
    lowerMessage.includes('hey') ||
    lowerMessage.includes('greetings')
  ) {
    return {
      intent: 'greeting',
      entities: {},
      reply: "Hello! I'm your FlyIndia assistant. How can I help you today? You can ask me to search for flights or help with booking."
    };
  }
  
  // Detect pricing query
  if (
    lowerMessage.includes('price') || 
    lowerMessage.includes('cost') || 
    lowerMessage.includes('how much') ||
    lowerMessage.includes('fare') ||
    lowerMessage.includes('rupees') ||
    lowerMessage.includes('rs')
  ) {
    return {
      intent: 'price_query',
      entities: {},
      reply: "Flight prices vary based on the route, date, and availability. You can search for specific flights and I'll show you the current prices. Would you like to search for flights now?"
    };
  }
  
  // Detect thank you
  if (
    lowerMessage.includes('thank') || 
    lowerMessage.includes('thanks')
  ) {
    return {
      intent: 'thanks',
      entities: {},
      reply: "You're welcome! Is there anything else I can help you with?"
    };
  }
  
  // Detect help request
  if (
    lowerMessage.includes('help') || 
    lowerMessage.includes('how do') ||
    lowerMessage.includes('what can you do')
  ) {
    return {
      intent: 'help',
      entities: {},
      reply: "I can help you search for flights, check prices, and book tickets. Try saying something like 'Find flights from Delhi to Mumbai' or 'How much does a flight from Bangalore to Chennai cost?'"
    };
  }
  
  // Default response
  return {
    intent: 'unknown',
    entities: {},
    reply: "I'm not sure I understand. You can ask me to search for flights, check prices, or help with booking. For example, try asking 'Find flights from Delhi to Mumbai tomorrow'."
  };
};
