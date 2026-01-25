import { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import VeloriaLoader from "@/components/ui/VeloriaLoader";
import PageLoader from "@/components/ui/PageLoader";
import PageWrapper from "@/components/layout/PageWrapper";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { CartProvider } from "@/context/CartContext";
import { AdminProvider } from "@/context/AdminContext";
import { ReservationProvider } from "@/context/ReservationContext";
import { OrderProvider } from "@/context/OrderContext";

import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

/* -------- LAZY PAGES -------- */
const Index = lazy(() => import("./pages/Index"));
const Menu = lazy(() => import("./pages/Menu"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const Reservations = lazy(() => import("./pages/Reservations"));
const ReservationSuccess = lazy(() => import("./pages/ReservationSuccess"));
const ReservationStatus = lazy(() => import("./pages/ReservationStatus"));
const TrackOrder = lazy(() => import("./pages/TrackOrder"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

/* Admin */
const Admin = lazy(() => import("./pages/Admin"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const AdminReservations = lazy(() => import("./pages/AdminReservations"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));

/* -------- QUERY CLIENT -------- */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  /* 🌟 ONE-TIME WEBSITE LOADER */
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setAppLoading(false), 1800);
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
                  {/* 🔥 ROUTE LOADER */}
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      {/* Admin Auth */}
                      <Route path="/admin/login" element={<AdminLogin />} />

                      {/* Protected Admin */}
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

                      {/* Public Pages */}
                      <Route
                        path="/"
                        element={
                          <PageWrapper>
                            <Index />
                          </PageWrapper>
                        }
                      />
                      <Route
                        path="/menu"
                        element={
                          <PageWrapper>
                            <Menu />
                          </PageWrapper>
                        }
                      />
                      <Route
                        path="/reservations"
                        element={
                          <PageWrapper>
                            <Reservations />
                          </PageWrapper>
                        }
                      />
                      <Route
                        path="/reservation-success/:id"
                        element={
                          <PageWrapper>
                            <ReservationSuccess />
                          </PageWrapper>
                        }
                      />
                      <Route
                        path="/reservation-status"
                        element={
                          <PageWrapper>
                            <ReservationStatus />
                          </PageWrapper>
                        }
                      />
                      <Route
                        path="/checkout"
                        element={
                          <PageWrapper>
                            <Checkout />
                          </PageWrapper>
                        }
                      />
                      <Route
                        path="/order-success/:orderId"
                        element={
                          <PageWrapper>
                            <OrderSuccess />
                          </PageWrapper>
                        }
                      />
                      <Route
                        path="/about"
                        element={
                          <PageWrapper>
                            <About />
                          </PageWrapper>
                        }
                      />
                      <Route
                        path="/contact"
                        element={
                          <PageWrapper>
                            <Contact />
                          </PageWrapper>
                        }
                      />
                      <Route
                        path="/track-order"
                        element={
                          <PageWrapper>
                            <TrackOrder />
                          </PageWrapper>
                        }
                      />

                      {/* 404 */}
                      <Route
                        path="*"
                        element={
                          <PageWrapper>
                            <NotFound />
                          </PageWrapper>
                        }
                      />
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
