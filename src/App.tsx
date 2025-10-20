import {Toaster} from "@/components/ui/toaster";
import {Toaster as Sonner} from "@/components/ui/sonner";
import {TooltipProvider} from "@/components/ui/tooltip";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {AuthProvider, useAuth} from "@/contexts/AuthContext";
import {LoaderCircle} from "lucide-react";
import {lazy, Suspense} from "react";

import DashboardLayout from "./layouts/DashboardLayout";


// Lazy-load route components
const Index = lazy(() => import("./pages/Index"));
const Shipments = lazy(() => import("./pages/Shipments"));
const ShipmentDetail = lazy(() => import("./pages/ShipmentDetail"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const SetPassword = lazy(() => import("./pages/SetPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));


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
                        <Suspense fallback={
                            <div className="flex items-center justify-center h-screen w-full">
                                <LoaderCircle className="w-20 h-20 animate-spin"/>
                            </div>
                        }>
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
                                    {/*TODO ADD PROFILE AND SETTINGS*/}
                                    <Route path="profile" element={<Profile/>}/>
                                    <Route path="settings" element={<Settings/>}/>
                                </Route>
                                <Route path="*" element={<NotFound/>}/>
                            </Routes>
                        </Suspense>
                    </TooltipProvider>
                </BrowserRouter>
            </AuthProvider>
        </QueryClientProvider>
    );
};

export default App;
