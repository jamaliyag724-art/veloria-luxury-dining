import { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import FoodLoader from "@/components/ui/FoodLoader";
import RouteFallback from "@/components/ui/RouteFallback";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { CartProvider } from "@/context/CartContext";
import { AdminProvider } from "@/context/AdminContext";
import { ReservationProvider } from "@/context/ReservationContext";
import { OrderProvider } from "@/context/OrderContext";

/* Pages */
const Index = lazy(() => import("./pages/Index"));
const Menu = lazy(() => import("./pages/Menu"));
const Reservations = lazy(() => import("./pages/Reservations"));
const Checkout = lazy(() => import("./pages/Checkout"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  const [routeLoading, setRouteLoading] = useState(false);

  useEffect(() => {
    setRouteLoading(true);
    const t = setTimeout(() => setRouteLoading(false), 700);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <>
      {routeLoading && <FoodLoader />}

      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};

const App = () => {
  const [bootLoading, setBootLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setBootLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  if (bootLoading) return <FoodLoader />;

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
                  <AppRoutes />
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
