import {Menu, LogOut, Settings, UserRound} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";
import {toast} from "@/hooks/use-toast";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {Link} from "react-router-dom";
import {authService} from "@/services/api/authService";
import {useAuth} from "@/contexts/AuthContext.tsx";
import {NotificationDropdown} from "./NotificationDropdown";

interface NavbarProps {
    onMenuToggle: () => void;
}

interface User {
    name: string;
    email: string;
}

const Navbar = ({onMenuToggle}: NavbarProps) => {
    const navigate = useNavigate();
    const {refreshAuth, user} = useAuth();


    const handleLogout = async () => {
        try {
            await authService.logout();
            await refreshAuth();
            toast({
                title: "Logged out",
                description: "You have been successfully logged out.",
            });
            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error);
            // The apiClient will handle the toast for errors
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    return (
        <header className="h-16 border-b border-border bg-card">
            <div className="h-full px-4 flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={onMenuToggle}>
                    <Menu className="h-5 w-5"/>
                </Button>
                <div className="flex items-center space-x-4">
                    <NotificationDropdown />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <Avatar>
                                    <AvatarFallback>
                                        {user ? getInitials(user.user.username) : "AB"}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                                <div className="flex flex-col">
                                    <span>{user?.user.username || "User not found"}</span>
                                    <span
                                        className="text-xs text-muted-foreground">{user?.user.email || "email not found"}</span>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            {/*<DropdownMenuItem asChild>*/}
                            {/*    <Link to="/profile" className="cursor-pointer">*/}
                            {/*        <UserRound className="mr-2 h-4 w-4"/>*/}
                            {/*        <span>Profile</span>*/}
                            {/*    </Link>*/}
                            {/*</DropdownMenuItem>*/}
                            {/*<DropdownMenuItem asChild>*/}
                            {/*    <Link to="/settings" className="cursor-pointer">*/}
                            {/*        <Settings className="mr-2 h-4 w-4"/>*/}
                            {/*        <span>Settings</span>*/}
                            {/*    </Link>*/}
                            {/*</DropdownMenuItem>*/}
                            {/*<DropdownMenuSeparator/>*/}
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4"/>
                                <span>Cerrar Sesión</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
