import { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import VeloriaLoader from "@/components/ui/VeloriaLoader";
import PageLoader from "@/components/ui/PageLoader";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { CartProvider } from "@/context/CartContext";
import { AdminProvider } from "@/context/AdminContext";
import { ReservationProvider } from "@/context/ReservationContext";
import { OrderProvider } from "@/context/OrderContext";

import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

/* -------- Lazy Pages -------- */
const Index = lazy(() => import("./pages/Index"));
const Menu = lazy(() => import("./pages/Menu"));
const Reservations = lazy(() => import("./pages/Reservations"));
const ReservationSuccess = lazy(() => import("./pages/ReservationSuccess"));
const ReservationStatus = lazy(() => import("./pages/ReservationStatus"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const TrackOrder = lazy(() => import("./pages/TrackOrder"));
const NotFound = lazy(() => import("./pages/NotFound"));

/* Admin */
const Admin = lazy(() => import("./pages/Admin"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const AdminReservations = lazy(() => import("./pages/AdminReservations"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));

const queryClient = new QueryClient();

const App = () => {
  /* 🌟 ONE-TIME WEBSITE LOADER */
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setAppLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (appLoading) {
    return <VeloriaLoader />;
  }

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
                  {/* ✅ PAGE LOADER (manual, hidden by default) */}
                  <PageLoader />

                  {/* ❌ NO loader in Suspense */}
                  <Suspense fallback={null}>
                    <Routes>
                      {/* Public */}
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

                      {/* Admin */}
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

                      {/* 404 */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
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
