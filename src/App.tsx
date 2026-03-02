import { useState, Suspense } from "react";
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
import { ThemeProvider } from "@/context/ThemeContext";

import { VeloriaBrandLoader, RouteLoaderRenderer } from "@/components/ui/loaders";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";

import Index from "./pages/Index";
import Menu from "./pages/Menu";
import Reservations from "./pages/Reservations";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import ReservationSuccess from "./pages/ReservationSuccess";
import ReservationStatus from "./pages/ReservationStatus";
import About from "./pages/About";
import Contact from "./pages/Contact";
import TrackOrder from "./pages/TrackOrder";
import NotFound from "./pages/NotFound";

/* Lazy loaded */
import { lazy } from "react";
const TableLayout = lazy(() => import("./pages/TableLayout"));

/* Admin */
import Admin from "./pages/Admin";
import AdminOrders from "./pages/AdminOrders";
import AdminReservations from "./pages/AdminReservations";
import AdminLogin from "./pages/AdminLogin";
import AdminMenu from "./pages/AdminMenu";

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
    <div className="relative min-h-screen bg-gradient-to-b from-[#0b0b0d] via-[#111111] to-[#0b0b0d]">

  {/* GOLD PATTERN BACKGROUND */}
  <div className="pointer-events-none absolute inset-0 opacity-[0.08]">
    <div
  className="absolute inset-0 pointer-events-none"
  style={{
    backgroundImage: "url('/gold-pattern.svg')",
    backgroundRepeat: "repeat",
    backgroundSize: "140px 140px",
    opacity: 0.08,
  }}
/>
  </div>


      {/* Main Content Layer */}
      <div className="relative z-10">

        {/* Brand Loader (first visit only) */}
        <AnimatePresence>
          {showBrandLoader && (
            <VeloriaBrandLoader onComplete={handleBrandLoaderComplete} />
          )}
        </AnimatePresence>

        {/* Route Loaders */}
        <RouteLoaderRenderer />

        {/* Toasts */}
        <Toaster />
        <Sonner position="top-center" />

        {/* Routes */}
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
          <Route path="/table-layout" element={<Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" /></div>}><TableLayout /></Suspense>} />

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

      </div>
    </div>
  );
};
/* ---------------------------------------
   ROOT APP
---------------------------------------- */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
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
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
