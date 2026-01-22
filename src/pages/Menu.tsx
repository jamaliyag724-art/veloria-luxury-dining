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
     PARALLAX SCROLL
  ---------------------------------------- */
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], ["0%", "12%"]);

  /* ---------------------------------------
     ACTIVE BACKGROUND (SAFE)
  ---------------------------------------- */
  const background = useMemo(() => {
    return (
      CATEGORY_BACKGROUNDS[activeCategory] ||
      CATEGORY_BACKGROUNDS["starters"]
    );
  }, [activeCategory]);

  return (
    <div className="relative">
      {/* 🌄 BACKGROUND (Ken Burns + Parallax) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
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

      {/* 🌑 BASE DARK OVERLAY */}
      <div className="fixed inset-0 bg-black/25 z-[5] pointer-events-none" />

      {/* 🌫️ AMBIENT FOG OVERLAY (STEP 5) */}
      <div className="pointer-events-none fixed inset-0 z-[8] overflow-hidden">
        {/* Fog layer 1 */}
        <motion.div
          className="absolute -top-1/3 -left-1/4 w-[140%] h-[140%]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,255,255,0.08), transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{
            x: ["-5%", "5%", "-5%"],
            y: ["-3%", "3%", "-3%"],
          }}
          transition={{
            duration: 90,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Fog layer 2 */}
        <motion.div
          className="absolute -bottom-1/3 -right-1/4 w-[140%] h-[140%]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(212,162,76,0.06), transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            x: ["4%", "-4%", "4%"],
            y: ["2%", "-2%", "2%"],
          }}
          transition={{
            duration: 120,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* 🌟 CONTENT */}
      <div className="relative z-20">
        <Navbar onCartClick={() => setIsCartOpen(true)} />

        <main className="pt-32 pb-32">
          <div className="section-container bg-background/90 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl">
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
              className="text-center text-muted-foreground mb-10"
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

      {/* 🌅 FOOTER — SEPARATE VISUAL CHAPTER */}
      <section className="relative z-30 bg-gradient-to-b from-background via-background to-muted/40">
        <div className="w-24 h-[2px] bg-primary mx-auto mb-12 rounded-full" />
        <Footer />
      </section>

      {/* 🛒 CART UI */}
      <FloatingCart onClick={() => setIsCartOpen(true)} />
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
};

export default Menu;
