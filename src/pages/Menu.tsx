import React, { useState, useMemo, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";

import MenuItemSkeleton from "@/components/menu/MenuItemSkeleton";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartModal from "@/components/cart/CartModal";
import FloatingCart from "@/components/cart/FloatingCart";
import CategoryTabs from "@/components/menu/CategoryTabs";
import MenuItemCard from "@/components/menu/MenuItemCard";

import { useMenu } from "@/context/MenuContext";

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

const ALL_BACKGROUNDS = Object.values(CATEGORY_BACKGROUNDS);

const Menu: React.FC = () => {
  /* ---------------------------------------
     STATE
  ---------------------------------------- */
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("starters");

  /* ---------------------------------------
     MENU CONTEXT
  ---------------------------------------- */
  const { items, categories, loading } = useMenu();

  /* ---------------------------------------
     PRELOAD BACKGROUNDS
  ---------------------------------------- */
  useEffect(() => {
    ALL_BACKGROUNDS.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  /* ---------------------------------------
     FILTER ITEMS
  ---------------------------------------- */
  const filteredItems = useMemo(() => {
    return items.filter(
      (item) =>
        item.category === activeCategory && item.available !== false
    );
  }, [items, activeCategory]);

  const currentCategory = categories.find(
    (c) => c.id === activeCategory
  );

  /* ---------------------------------------
     PARALLAX
  ---------------------------------------- */
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], ["0%", "12%"]);

  const background =
    CATEGORY_BACKGROUNDS[activeCategory] ||
    CATEGORY_BACKGROUNDS.starters;

  /* ---------------------------------------
     RENDER
  ---------------------------------------- */
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 🌄 BACKGROUND */}
      <AnimatePresence mode="wait">
        <motion.img
          key={background}
          src={background}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{ y }}
          className="fixed inset-0 z-0 w-full h-full object-cover scale-105"
        />
      </AnimatePresence>

      {/* Overlays */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[2]" />
      <div className="fixed inset-0 bg-black/25 z-[3]" />

      {/* CONTENT */}
      <div className="relative z-20">
        <Navbar onCartClick={() => setIsCartOpen(true)} />

        <main className="pt-32 pb-32">
          <div className="section-container">
            {/* HEADER */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <span className="text-primary tracking-wider text-sm uppercase">
                Culinary Excellence
              </span>
              <h1 className="font-serif text-4xl md:text-5xl mt-4 mb-4">
                Our Menu
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover our carefully curated selection of dishes.
              </p>
            </motion.div>

            {/* CATEGORY TABS */}
            <CategoryTabs
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />

            {/* DESCRIPTION */}
            {currentCategory?.description && (
              <motion.p
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-muted-foreground mb-10"
              >
                {currentCategory.description}
              </motion.p>
            )}

            {/* MENU GRID */}
            <motion.div
              layout
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <MenuItemSkeleton key={i} index={i} />
                    ))
                  : filteredItems.map((item) => (
                      <MenuItemCard key={item.id} item={item} />
                    ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </main>
      </div>

      {/* FOOTER */}
      <section className="relative z-30 bg-gradient-to-b from-background via-background to-muted/40">
        <div className="w-24 h-[2px] bg-primary mx-auto mb-12 rounded-full" />
        <Footer />
      </section>

      {/* CART */}
      <FloatingCart onClick={() => setIsCartOpen(true)} />
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
};

export default Menu;
