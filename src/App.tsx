import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OwnerDashboard from "./pages/owner/Dashboard";
import ManageRenters from "./pages/owner/ManageRenters";
import OwnerProfile from "./pages/owner/Profile";
import RenterDashboard from "./pages/renter/Dashboard";
import MyOwner from "./pages/renter/MyOwner";
import RenterPayments from "./pages/renter/Payments";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Owner Routes */}
              <Route element={<DashboardLayout requiredRole="owner" />}>
                <Route path="/owner/dashboard" element={<OwnerDashboard />} />
                <Route path="/owner/renters" element={<ManageRenters />} />
                <Route path="/owner/profile" element={<OwnerProfile />} />
                <Route path="/owner/notifications" element={<Notifications />} />
              </Route>

              {/* Renter Routes */}
              <Route element={<DashboardLayout requiredRole="renter" />}>
                <Route path="/renter/dashboard" element={<RenterDashboard />} />
                <Route path="/renter/my-owner" element={<MyOwner />} />
                <Route path="/renter/payments" element={<RenterPayments />} />
                <Route path="/renter/notifications" element={<Notifications />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
