
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type MessageRole = "user" | "bot";

export interface ChatMessageProps {
  message: string;
  role: MessageRole;
  isLoading?: boolean;
  timestamp?: string;
  userPhotoUrl?: string;
}

const ChatMessage = ({ message, role, isLoading = false, timestamp, userPhotoUrl }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex w-full mb-4",
        role === "user" ? "justify-end" : "justify-start"
      )}
    >
      {role === "bot" && (
        <Avatar className="h-8 w-8 mr-2">
          <AvatarFallback className="bg-flyindia-primary text-white">FI</AvatarFallback>
          <AvatarImage src="/logo.png" alt="FlyIndia" />
        </Avatar>
      )}
      
      <div
        className={cn(
          "chat-bubble relative max-w-[80%]",
          role === "user" ? "chat-bubble-user" : "chat-bubble-bot"
        )}
      >
        {isLoading ? (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        ) : (
          <>
            <div className="whitespace-pre-wrap">{message}</div>
            {timestamp && (
              <div className="text-xs text-gray-500 mt-1 text-right">
                {timestamp}
              </div>
            )}
          </>
        )}
      </div>
      
      {role === "user" && (
        <Avatar className="h-8 w-8 ml-2">
          <AvatarFallback className="bg-flyindia-secondary text-white">
            {userPhotoUrl ? "" : "U"}
          </AvatarFallback>
          {userPhotoUrl && <AvatarImage src={userPhotoUrl} alt="User" />}
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
