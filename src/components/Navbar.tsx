
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onMenuToggle: () => void;
}

const Navbar = ({ onMenuToggle }: NavbarProps) => {
  return (
    <header className="h-16 border-b border-border bg-card">
      <div className="h-full px-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={onMenuToggle}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
            <span className="text-sm font-medium">AB</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
