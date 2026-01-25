import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartModal from "@/components/cart/CartModal";
import FloatingCart from "@/components/cart/FloatingCart";
import CategoryTabs from "@/components/menu/CategoryTabs";
import MenuItemCard from "@/components/menu/MenuItemCard";
import MenuItemSkeleton from "@/components/menu/MenuItemSkeleton";

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

const ALL_BACKGROUNDS = Object.values(CATEGORY_BACKGROUNDS);

const Menu: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("starters");
  const [loading, setLoading] = useState(false);

  /* Preload backgrounds */
  useEffect(() => {
    ALL_BACKGROUNDS.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  /* Items */
  const items = useMemo(
    () => getItemsByCategory(activeCategory),
    [activeCategory]
  );

  const currentCategory = menuCategories.find(
    (c) => c.id === activeCategory
  );

  /* Category change with skeleton */
  const handleCategoryChange = (category: string) => {
    if (category === activeCategory) return;
    setLoading(true);
    setActiveCategory(category);
    setTimeout(() => setLoading(false), 400);
  };

  /* Parallax */
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], ["0%", "12%"]);

  const background =
    CATEGORY_BACKGROUNDS[activeCategory] || CATEGORY_BACKGROUNDS.starters;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
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
      <div className="fixed inset-0 bg-black/40 z-[2]" />
      <div className="fixed inset-0 bg-black/20 z-[3]" />

      {/* Content */}
      <div className="relative z-20">
        <Navbar onCartClick={() => setIsCartOpen(true)} />

        <main className="pt-32 pb-32">
          <div className="section-container">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
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

            {/* Categories */}
            <CategoryTabs
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
            />

            {currentCategory?.description && (
              <p className="text-center text-muted-foreground mb-10">
                {currentCategory.description}
              </p>
            )}

            {/* Grid */}
            <motion.div
              layout
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <MenuItemSkeleton key={i} index={i} />
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
      <section className="relative z-30 bg-background">
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
