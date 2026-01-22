import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { CartProvider } from "@/context/CartContext";
import { ReservationProvider } from "@/context/ReservationContext";
import { AdminProvider } from "@/context/AdminContext";

import Index from "./pages/Index";
import Menu from "./pages/Menu";
import Reservations from "./pages/Reservations";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Admin from "./pages/Admin";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";

import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ReservationSuccess from "@/components/ReservationSuccess";


const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <ReservationProvider>
            <AdminProvider>
              <Toaster />
              <Sonner position="top-center" />

              <BrowserRouter>
                <Routes>
                  {/* ✅ Admin Auth */}
                  <Route path="/admin/login" element={<AdminLogin />} />

                  {/* ✅ Protected Admin Route */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedAdminRoute>
                        <Admin />
                      </ProtectedAdminRoute>
                    }
                  />

                  {/* 🌐 Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/reservations" element={<Reservations />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-success" element={<OrderSuccess />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/reservations" element={<Reservations />} />
<Route path="/reservation-success/:id" element={<ReservationSuccess />} />

                  {/* ❌ 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>

            </AdminProvider>
          </ReservationProvider>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
