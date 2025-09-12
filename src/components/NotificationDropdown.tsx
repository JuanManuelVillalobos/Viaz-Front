import {Bell, Check, Clock} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Badge} from "@/components/ui/badge";
import {ScrollArea} from "@/components/ui/scroll-area";
import {useNotifications} from "@/hooks/useNotifications";
import {formatDistanceToNow} from "date-fns";
import {es} from "date-fns/locale";
import {Tabs, TabsList, TabsTrigger, TabsContent} from "@/components/ui/tabs"; // <- Make sure you have this

import {useState} from "react";
import {useAuth} from "@/contexts/AuthContext.tsx";

export const NotificationDropdown = () => {
    const {
        notifications,
        unreadCount,
        markAsRead,
        isLoading,
        isWebSocketConnected,
        markAllAsRead
    } = useNotifications();

    const [activeTab, setActiveTab] = useState("unread");

    const formatTime = (timestamp: string) => {
        return formatDistanceToNow(new Date(timestamp), {addSuffix: true, locale: es});
    };

    const {user} = useAuth();

    const unreadNotifications = notifications.filter((n) => !n.read);
    const readNotifications = notifications.filter((n) => n.read);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5"/>
                    {unreadCount > 0 && (
                        <Badge
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
                            variant="destructive"
                        >
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80 p-0">
                <DropdownMenuLabel className="flex items-center justify-between px-4 pt-3 pb-2">
                    <span>Notifications</span>
                    <div className="flex items-center gap-2">
                        {isWebSocketConnected && (
                            <div
                                className="h-2 w-2 bg-green-500 rounded-full"
                                title="Connected"
                            />
                        )}
                        {unreadCount > 0 && (
                            <Badge variant="secondary" className="text-xs">
                                {unreadCount} new
                            </Badge>
                        )}
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator/>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="flex items-center justify-between px-4 border-b py-2">
                        <TabsList className="flex space-x-2">
                            <TabsTrigger value="unread" className="text-sm">
                                Unread
                            </TabsTrigger>
                            <TabsTrigger value="read" className="text-sm">
                                Read
                            </TabsTrigger>
                        </TabsList>
                        {unreadNotifications.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-muted-foreground hover:text-primary px-2 h-6"
                                onClick={() =>
                                    markAllAsRead(user.user.userId)
                                }
                            >
                                Mark all as read
                            </Button>
                        )}
                    </div>


                    <TabsContent value="unread">
                        {isLoading ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                                Loading notifications...
                            </div>
                        ) : unreadNotifications.length === 0 ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                                No unread notifications
                            </div>
                        ) : (
                            <>
                                <ScrollArea className="max-h-64 overflow-auto">
                                    <div className="flex flex-col">
                                        {unreadNotifications.map((notification) => (
                                            <div
                                                key={notification.notificationId}
                                                className="flex items-start gap-3 p-3 cursor-pointer hover:bg-muted transition-colors"
                                                onClick={() => markAsRead(notification.notificationId)}
                                            >
                                                <div className="flex-shrink-0 mt-0.5">
                                                    <Clock className="h-4 w-4 text-blue-500"/>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {formatTime(notification.timestamp)}
                                                    </p>
                                                </div>
                                                <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"/>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </>
                        )}
                    </TabsContent>


                    <TabsContent value="read">
                        {isLoading ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                                Loading notifications...
                            </div>
                        ) : readNotifications.length === 0 ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                                No read notifications
                            </div>
                        ) : (
                            <ScrollArea className="max-h-64 overflow-auto">
                                <div className="flex flex-col">
                                    {readNotifications.map((notification) => (
                                        <div
                                            key={notification.notificationId}
                                            className="flex items-start gap-3 p-3"
                                        >
                                            <div className="flex-shrink-0 mt-0.5">
                                                <Check className="h-4 w-4 text-green-500"/>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm">{notification.message}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {formatTime(notification.timestamp)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        )}
                    </TabsContent>
                </Tabs>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
