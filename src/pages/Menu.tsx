import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartModal from "@/components/cart/CartModal";
import FloatingCart from "@/components/cart/FloatingCart";
import CategoryTabs from "@/components/menu/CategoryTabs";
import MenuItemCard from "@/components/menu/MenuItemCard";
import { menuCategories, getItemsByCategory } from "@/data/menuData";

// 🔁 Background images (loop)
const BACKGROUNDS = [
  "./foo1.jpg",
  "./foo2.jpg",
  "./foo3.jpg",
];

const Menu: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("starters");
  const [bgIndex, setBgIndex] = useState(0);

  const items = getItemsByCategory(activeCategory);
  const currentCategory = menuCategories.find(
    (c) => c.id === activeCategory
  );

  // 🔁 Auto background loop
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BACKGROUNDS.length);
    }, 7000); // ⏱️ slow luxury pace

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 🔥 Background loop */}
      <AnimatePresence mode="wait">
        <motion.div
          key={bgIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${BACKGROUNDS[bgIndex]})` }}
        />
      </AnimatePresence>

      {/* 🕊️ Light overlay for readability */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />

      {/* 🌟 CONTENT */}
      <div className="relative z-10">
        <Navbar onCartClick={() => setIsCartOpen(true)} />

        <main className="pt-32 pb-24">
          <div className="section-container">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <span className="text-primary font-medium tracking-wider text-sm uppercase">
                Culinary Excellence
              </span>
              <h1 className="font-serif text-4xl md:text-5xl font-medium text-foreground mt-4 mb-4">
                Our Menu
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover our carefully curated selection of dishes, each crafted with the finest ingredients.
              </p>
            </motion.div>

            {/* Category Tabs */}
            <div className="mb-8">
              <CategoryTabs
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>

            {/* Category Description */}
            <motion.p
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-muted-foreground mb-8"
            >
              {currentCategory?.description}
            </motion.p>

            {/* Menu Grid */}
            <motion.div
              layout
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </main>

        <Footer />
        <FloatingCart onClick={() => setIsCartOpen(true)} />
        <CartModal
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />
      </div>
    </div>
  );
};

export default Menu;
