import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import ChefRecommendations from "@/components/home/ChefRecommendations";
import PopularDishes from "@/components/home/PopularDishes";
import ReservationCTA from "@/components/home/ReservationCTA";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import LocationSection from "@/components/home/LocationSection";
import FAQSection from "@/components/home/FAQSection";
import CartModal from "@/components/cart/CartModal";
import FloatingCart from "@/components/cart/FloatingCart";
import WelcomePopup from "@/components/home/WelcomePopup";
import PageLoader from "@/components/ui/PageLoader";

const Index: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <PageLoader duration={2000}>
      {/* 🌐 FULL HOME PAGE */}
      <div className="min-h-screen bg-background">
        <Navbar onCartClick={() => setIsCartOpen(true)} />

        {/* Optional welcome popup */}
        <WelcomePopup />

        <main>
          <HeroSection />
          <ChefRecommendations />
          <AboutSection />
          <PopularDishes />
          <ReservationCTA />
          <TestimonialsSection />
          <LocationSection />
          <FAQSection />
        </main>

        <Footer />

        {/* 🛒 Cart UI */}
        <FloatingCart onClick={() => setIsCartOpen(true)} />
        <CartModal
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />
      </div>
    </PageLoader>
  );
};

export default Index;
