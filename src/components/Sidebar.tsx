
import { Link, useLocation } from "react-router-dom";
import { HomeIcon, PackageIcon, UsersIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();
  
  const menuItems = [
    { name: "Dashboard", path: "/", icon: HomeIcon },
    { name: "Shipments", path: "/shipments", icon: PackageIcon },
    { name: "User Management", path: "/users", icon: UsersIcon },
  ];

  return (
    <aside
      className={cn(
        "bg-card border-r border-border h-screen transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-20"
      )}
    >
      <div className="p-4 h-16 border-b border-border flex items-center justify-center">
        {isOpen ? (
          <img src={'viaz-logo-large.svg'} alt={"viaz-logo"} />
        ) : (
          <img src={'viaz-logo-small.svg'} alt={"viaz-logo"} width={47}/>
        )}
      </div>
      <nav className="p-2">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center p-3 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                  location.pathname === item.path && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                  !isOpen && "justify-center"
                )}
              >
                <item.icon className="h-5 w-5" />
                {isOpen && <span className="ml-3">{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
