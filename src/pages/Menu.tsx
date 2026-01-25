import React, { useState, useMemo, useEffect } from "react";
import VeloriaLoader from "@/components/ui/VeloriaLoader";
import MenuItemSkeleton from "@/components/menu/MenuItemSkeleton";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartModal from "@/components/cart/CartModal";
import FloatingCart from "@/components/cart/FloatingCart";
import CategoryTabs from "@/components/menu/CategoryTabs";
import MenuItemCard from "@/components/menu/MenuItemCard";
import { menuCategories, getItemsByCategory } from "@/data/menuData";

/* ---------------------------------------
   CATEGORY → BACKGROUND MAP
---------------------------------------- */
const CATEGORY_BACKGROUNDS: Record<string, string> = {
  starters: "/starters.webp",
  brunch: "/brunch.webp",
  lunch: "/lunch.webp",
  "main-course": "/main.webp",
  desserts: "/desert.webp",
  "wine-beverages": "/wine.webp",
};

const Menu: React.FC = () => {
  /* ---------------------------------------
     STATE
  ---------------------------------------- */
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("starters");

  // Page entry loader
  const [pageLoading, setPageLoading] = useState(true);

  // Category skeleton loader
  const [categoryLoading, setCategoryLoading] = useState(false);

  /* ---------------------------------------
     PAGE ENTRY LOADER
  ---------------------------------------- */
  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  /* ---------------------------------------
     CATEGORY SWITCH SKELETON
  ---------------------------------------- */
  useEffect(() => {
    setCategoryLoading(true);

    const timer = setTimeout(() => {
      setCategoryLoading(false);
    }, 600); // ✨ luxury delay

    return () => clearTimeout(timer);
  }, [activeCategory]);

  /* ---------------------------------------
     DATA
  ---------------------------------------- */
  const items = getItemsByCategory(activeCategory);
  const currentCategory = menuCategories.find(
    (c) => c.id === activeCategory
  );

  /* ---------------------------------------
     PARALLAX
  ---------------------------------------- */
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], ["0%", "12%"]);

  /* ---------------------------------------
     BACKGROUND SAFE MAP
  ---------------------------------------- */
  const background = useMemo(() => {
    return (
      CATEGORY_BACKGROUNDS[activeCategory] ||
      CATEGORY_BACKGROUNDS.starters
    );
  }, [activeCategory]);

  /* ---------------------------------------
     🔥 PAGE BLOCKING LOADER
  ---------------------------------------- */
  if (pageLoading) {
    return <VeloriaLoader />;
  }

  /* ---------------------------------------
     MAIN RENDER
  ---------------------------------------- */
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 🌄 BACKGROUND */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1.08 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.2 },
            scale: { duration: 14, ease: "linear" },
          }}
          style={{ y }}
          className="fixed inset-0 z-0 overflow-hidden"
        >
          <img
            src={background}
            alt=""
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        </motion.div>
      </AnimatePresence>

      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-black/25 z-[5] pointer-events-none" />

      {/* 🌟 CONTENT */}
      <div className="relative z-20">
        <Navbar onCartClick={() => setIsCartOpen(true)} />

        <main className="pt-32 pb-32">
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
              <h1 className="font-serif text-4xl md:text-5xl font-medium mt-4 mb-4">
                Our Menu
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover our carefully curated selection of dishes, crafted with
                the finest ingredients.
              </p>
            </motion.div>

            {/* Category Tabs */}
            <CategoryTabs
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />

            {/* Category Description */}
            <motion.p
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-muted-foreground mb-10"
            >
              {currentCategory?.description}
            </motion.p>

            {/* 🧱 MENU GRID */}
            <motion.div
              layout
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {categoryLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <MenuItemSkeleton key={`skeleton-${i}`} />
                    ))
                  : items.map((item) => (
                      <MenuItemCard key={item.id} item={item} />
                    ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <section className="relative z-30 bg-gradient-to-b from-background via-background to-muted/40">
        <div className="w-24 h-[2px] bg-primary mx-auto mb-12 rounded-full" />
        <Footer />
      </section>

      {/* Cart */}
      <FloatingCart onClick={() => setIsCartOpen(true)} />
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
};

export default Menu;
