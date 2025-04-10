
import { Plane } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Plane className="h-6 w-6 text-flyindia-primary mr-2" />
          <h1 className="text-2xl font-bold gradient-text">FlyIndia</h1>
        </div>
        <div className="text-sm text-gray-500">
          Your AI Flight Assistant
        </div>
      </div>
    </header>
  );
};

export default Header;
