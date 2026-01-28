import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { CartProvider } from "@/context/CartContext";
import { AdminProvider } from "@/context/AdminContext";
import { ReservationProvider } from "@/context/ReservationContext";
import { OrderProvider } from "@/context/OrderContext";
import { RouteLoaderProvider, useRouteLoader } from "@/context/RouteLoaderContext";
import { MenuProvider } from "@/context/MenuContext";

import { VeloriaBrandLoader, RouteLoaderRenderer } from "@/components/ui/loaders";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";

/* ✅ CHATBOT (ONLY ROOT SHOULD BE USED) */
import ChatbotRoot from "@/chatbot/ChatbotRoot";

/* Pages */
import Index from "@/pages/Index";
import Menu from "@/pages/Menu";
import Reservations from "@/pages/Reservations";
import Checkout from "@/pages/Checkout";
import OrderSuccess from "@/pages/OrderSuccess";
import ReservationSuccess from "@/pages/ReservationSuccess";
import ReservationStatus from "@/pages/ReservationStatus";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import TrackOrder from "@/pages/TrackOrder";
import NotFound from "@/pages/NotFound";

/* Admin */
import Admin from "@/pages/Admin";
import AdminOrders from "@/pages/AdminOrders";
import AdminReservations from "@/pages/AdminReservations";
import AdminLogin from "@/pages/AdminLogin";
import AdminMenu from "@/pages/AdminMenu";

const queryClient = new QueryClient();

/* ---------------------------------------
   INNER APP
---------------------------------------- */
const AppContent = () => {
  const { hasShownBrandLoader, markBrandLoaderShown } = useRouteLoader();
  const [showBrandLoader, setShowBrandLoader] = useState(!hasShownBrandLoader);

  const handleBrandLoaderComplete = () => {
    setShowBrandLoader(false);
    markBrandLoaderShown();
  };

  return (
    <>
      {/* Brand Loader (first visit only) */}
      <AnimatePresence>
        {showBrandLoader && (
          <VeloriaBrandLoader onComplete={handleBrandLoaderComplete} />
        )}
      </AnimatePresence>

      {/* Route specific loaders */}
      <RouteLoaderRenderer />

      <Toaster />
      <Sonner position="top-center" />

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Index />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/reservation-status" element={<ReservationStatus />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success/:orderId" element={<OrderSuccess />} />
        <Route path="/reservation-success/:id" element={<ReservationSuccess />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/track-order" element={<TrackOrder />} />

        {/* ADMIN */}
        <Route path="/admin/login" element={<AdminLogin />} />
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
        <Route
          path="/admin/menu"
          element={
            <ProtectedAdminRoute>
              <AdminMenu />
            </ProtectedAdminRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* ✅ CHATBOT ROOT (THIS WAS MISSING) */}
      <ChatbotRoot />
    </>
  );
};

/* ---------------------------------------
   ROOT APP
---------------------------------------- */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <OrderProvider>
          <ReservationProvider>
            <CartProvider>
              <AdminProvider>
                <MenuProvider>
                  <RouteLoaderProvider>
                    <BrowserRouter>
                      <AppContent />
                    </BrowserRouter>
                  </RouteLoaderProvider>
                </MenuProvider>
              </AdminProvider>
            </CartProvider>
          </ReservationProvider>
        </OrderProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
