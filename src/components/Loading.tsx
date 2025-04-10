
import { Plane } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Plane className="h-12 w-12 text-flyindia-primary animate-bounce-gentle" />
      <p className="mt-4 text-flyindia-primary font-medium">Loading...</p>
    </div>
  );
};

export default Loading;
