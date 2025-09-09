import {Toaster} from "@/components/ui/toaster";
import {Toaster as Sonner} from "@/components/ui/sonner";
import {TooltipProvider} from "@/components/ui/tooltip";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {AuthProvider, useAuth} from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Shipments from "./pages/Shipments";
import ShipmentDetail from "./pages/ShipmentDetail";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import SetPassword from "./pages/SetPassword";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./layouts/DashboardLayout";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import {LoaderCircle} from "lucide-react";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

const ProtectedRoute = ({children}: { children: React.ReactNode }) => {
    const {user, loading} = useAuth();


    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen w-full">
                <LoaderCircle className="w-20 h-20 animate-spin"/>
            </div>
        );
    }


    if (!user || user.user.status !== "ACTIVE") {
        return <Navigate to="/login" replace/>;
    }

    return <>{children}</>;
};


const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <BrowserRouter>
                    <TooltipProvider>
                        <Toaster/>
                        <Sonner/>
                        <Routes>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/forgot-password" element={<ForgotPassword/>}/>
                            <Route path="/auth/set-password" element={<SetPassword/>}/>
                            <Route path="/" element={
                                <ProtectedRoute>
                                    <DashboardLayout/>
                                </ProtectedRoute>
                            }>
                                <Route index element={<Index/>}/>
                                <Route path="shipments" element={<Shipments/>}/>
                                <Route path="shipments/:id" element={<ShipmentDetail/>}/>
                                <Route path="admin" element={<AdminDashboard/>}/>
                                <Route path="profile" element={<Profile/>}/>
                                <Route path="settings" element={<Settings/>}/>
                            </Route>
                            <Route path="*" element={<NotFound/>}/>
                        </Routes>
                    </TooltipProvider>
                </BrowserRouter>
            </AuthProvider>
        </QueryClientProvider>
    );
};

export default App;
