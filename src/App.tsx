import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { RouteLoaderProvider, useRouteLoader } from "@/context/RouteLoaderContext";
import FoodLoader from "@/components/ui/FoodLoader";
import RouteChangeListener from "@/components/ui/RouteChangeListener";

import { CartProvider } from "@/context/CartContext";
import { AdminProvider } from "@/context/AdminContext";
import { ReservationProvider } from "@/context/ReservationContext";
import { OrderProvider } from "@/context/OrderContext";

/* Pages */
const Index = lazy(() => import("./pages/Index"));
const Menu = lazy(() => import("./pages/Menu"));
const Reservations = lazy(() => import("./pages/Reservations"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const LoaderOverlay = () => {
  const { loading } = useRouteLoader();
  return loading ? <FoodLoader /> : null;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouteLoaderProvider>
        <LoaderOverlay />

        <BrowserRouter>
          <RouteChangeListener />

          <Suspense fallback={<FoodLoader />}>
            <OrderProvider>
              <ReservationProvider>
                <CartProvider>
                  <AdminProvider>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/menu" element={<Menu />} />
                      <Route path="/reservations" element={<Reservations />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AdminProvider>
                </CartProvider>
              </ReservationProvider>
            </OrderProvider>
          </Suspense>
        </BrowserRouter>
      </RouteLoaderProvider>
    </QueryClientProvider>
  );
};

export default App;
