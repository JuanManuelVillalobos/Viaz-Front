
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserRound, Mail, Phone, MapPin, Edit, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface User {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  position?: string;
  company?: string;
  bio?: string;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching user data
    const fetchUser = () => {
      setIsLoading(true);
      // Get user from localStorage or use a placeholder
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          setUser(userData);
        } catch (e) {
          console.error("Error parsing user data", e);
          // Fallback to demo user
          setUser({
            name: "Alex Johnson",
            email: "alex.johnson@example.com",
            phone: "+1 (555) 123-4567",
            address: "123 Shipment St, Logistics City, 90210",
            position: "Logistics Manager",
            company: "Global Shipping Co.",
            bio: "Experienced logistics professional with over 10 years in the industry."
          });
        }
      } else {
        // Demo user if no user in localStorage
        setUser({
          name: "Alex Johnson",
          email: "alex.johnson@example.com",
          phone: "+1 (555) 123-4567",
          address: "123 Shipment St, Logistics City, 90210",
          position: "Logistics Manager",
          company: "Global Shipping Co.",
          bio: "Experienced logistics professional with over 10 years in the industry."
        });
      }
      setIsLoading(false);
    };

    fetchUser();
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleEditProfile = () => {
    toast({
      title: "Coming Soon",
      description: "Profile editing will be available in a future update.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse text-primary">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="text-xl">User not found</div>
        <Button asChild>
          <Link to="/login">Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Profile</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/settings">
              <Lock className="mr-2 h-4 w-4" /> Account Settings
            </Link>
          </Button>
          <Button onClick={handleEditProfile}>
            <Edit className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Profile Summary Card */}
        <Card className="md:col-span-3">
          <CardHeader className="flex flex-col items-center space-y-4 pb-2">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1 text-center">
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription>{user.position}</CardDescription>
              <CardDescription>{user.company}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span>{user.phone}</span>
              </div>
            )}
            {user.address && (
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>{user.address}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile Details Card */}
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="bio" className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="bio">Biography</TabsTrigger>
                <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              </TabsList>
              <TabsContent value="bio" className="mt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">About Me</h3>
                  <p className="text-muted-foreground">{user.bio || "No biography available."}</p>
                </div>
              </TabsContent>
              <TabsContent value="activity" className="mt-4">
                <ScrollArea className="h-[300px] rounded-md border p-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Recent Activity</h3>
                    <div className="space-y-4">
                      <div className="rounded-lg border p-3">
                        <div className="font-medium">Added a new shipment</div>
                        <div className="text-sm text-muted-foreground">2 days ago</div>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="font-medium">Updated shipment status</div>
                        <div className="text-sm text-muted-foreground">3 days ago</div>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="font-medium">Added file to shipment #1234</div>
                        <div className="text-sm text-muted-foreground">1 week ago</div>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="font-medium">Created a new user account</div>
                        <div className="text-sm text-muted-foreground">2 weeks ago</div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
