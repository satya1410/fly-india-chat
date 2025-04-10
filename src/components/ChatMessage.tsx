
import { cn } from "@/lib/utils";

export type MessageRole = "user" | "bot";

export interface ChatMessageProps {
  message: string;
  role: MessageRole;
  isLoading?: boolean;
  timestamp?: string;
}

const ChatMessage = ({ message, role, isLoading = false, timestamp }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex w-full mb-4",
        role === "user" ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "chat-bubble relative",
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
    </div>
  );
};

export default ChatMessage;
