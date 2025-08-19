import {Toaster} from "@/components/ui/toaster";
import {Toaster as Sonner} from "@/components/ui/sonner";
import {TooltipProvider} from "@/components/ui/tooltip";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
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
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { SessionManager } from "./components/SessionManager";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

const ProtectedRoute = ({children}: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }

    return <SessionManager>{children}</SessionManager>;
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
