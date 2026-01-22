import React, { useState, useMemo } from "react";
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
   CATEGORY → BACKGROUND MAP (WebP)
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
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("starters");

  const items = getItemsByCategory(activeCategory);
  const currentCategory = menuCategories.find(
    (c) => c.id === activeCategory
  );

  /* ---------------------------------------
     PARALLAX SCROLL (NUMERIC ONLY)
  ---------------------------------------- */
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 80]); // ✅ px only

  /* ---------------------------------------
     ACTIVE BACKGROUND (SAFE)
  ---------------------------------------- */
  const background = useMemo(() => {
    return (
      CATEGORY_BACKGROUNDS[activeCategory] ??
      CATEGORY_BACKGROUNDS.starters
    );
  }, [activeCategory]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 🌄 BACKGROUND (MENU ONLY) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={background}
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1.08 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.5 },
            scale: { duration: 14, ease: "linear" },
          }}
          style={{
            backgroundImage: `url(${background})`,
            y,
          }}
          className="fixed inset-0 bg-cover bg-center z-0"
        />
      </AnimatePresence>

      {/* 🌑 OVERLAY (ENDS BEFORE FOOTER) */}
      <div className="fixed inset-0 bg-black/20 z-10 pointer-events-none" />

      {/* 🌟 MENU CONTENT */}
      <div className="relative z-20">
        <Navbar onCartClick={() => setIsCartOpen(true)} />

        <main className="pt-32 pb-32">
          <div className="section-container bg-background/90 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-xl">
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
                Discover our carefully curated selection of dishes, each crafted
                with the finest ingredients.
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
      </div>

      {/* 🌅 FOOTER — CLEAN, SEPARATE CHAPTER */}
      <section className="relative z-30 bg-gradient-to-b from-background via-background to-muted/40">
        <div className="w-24 h-[2px] bg-primary mx-auto mt-10 mb-12 rounded-full" />
        <Footer />
      </section>

      {/* Cart UI */}
      <FloatingCart onClick={() => setIsCartOpen(true)} />
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
};

export default Menu;
