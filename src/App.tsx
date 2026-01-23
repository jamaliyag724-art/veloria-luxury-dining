import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { CartProvider } from "@/context/CartContext";
import { AdminProvider } from "@/context/AdminContext";
import { ReservationProvider } from "@/context/ReservationContext";
import { OrderProvider } from "@/context/OrderContext";

import Index from "./pages/Index";
import Menu from "./pages/Menu";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Admin from "./pages/Admin";
import AdminOrders from "./pages/AdminOrders";
import AdminReservations from "./pages/AdminReservations";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import Reservations from "./pages/Reservations";
import ReservationSuccess from "./pages/ReservationSuccess";
import ReservationStatus from "./pages/ReservationStatus";
import TrackOrder from "@/pages/TrackOrder";

import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <OrderProvider>
          <ReservationProvider>
            <CartProvider>
              <AdminProvider>
                <Toaster />
                <Sonner position="top-center" />

                <BrowserRouter>
                  <Routes>
                    {/* Admin Auth */}
                    <Route path="/admin/login" element={<AdminLogin />} />

                    {/* Protected Admin Routes */}
                    <Route
                      path="/admin"
                      element={
                        <ProtectedAdminRoute>
                          <Admin />
                        </ProtectedAdminRoute>
                      }
                    />
                    <Route
                      path="/admin/orders"
                      element={
                        <ProtectedAdminRoute>
                          <AdminOrders />
                        </ProtectedAdminRoute>
                      }
                    />
                    <Route
                      path="/admin/reservations"
                      element={
                        <ProtectedAdminRoute>
                          <AdminReservations />
                        </ProtectedAdminRoute>
                      }
                    />

                    {/* Public Routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/reservations" element={<Reservations />} />
                    <Route path="/reservation-success/:id" element={<ReservationSuccess />} />
                    <Route path="/reservation-status" element={<ReservationStatus />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-success/:orderId" element={<OrderSuccess />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/track-order" element={<TrackOrder />} />
                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </AdminProvider>
            </CartProvider>
          </ReservationProvider>
        </OrderProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
