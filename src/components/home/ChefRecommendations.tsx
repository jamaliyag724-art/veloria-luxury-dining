import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { getFeaturedItems } from "@/data/menuData";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { formatINR } from "@/lib/currency";

const AUTOPLAY_DELAY = 4500;

const ChefRecommendations: React.FC = () => {
  const featuredItems = useMemo(() => getFeaturedItems(), []);
  const { addItem } = useCart();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const itemsCount = featuredItems.length;

  const nextSlide = useCallback(() => {
    if (itemsCount < 2) return;
    setCurrentIndex((prev) => (prev + 1) % itemsCount);
  }, [itemsCount]);

  const prevSlide = useCallback(() => {
    if (itemsCount < 2) return;
    setCurrentIndex((prev) => (prev - 1 + itemsCount) % itemsCount);
  }, [itemsCount]);

  useEffect(() => {
    if (isPaused || itemsCount < 2) return;
    const interval = setInterval(nextSlide, AUTOPLAY_DELAY);
    return () => clearInterval(interval);
  }, [isPaused, itemsCount, nextSlide]);

  const handleAddToOrder = (item: typeof featuredItems[number]) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
    });

    toast.success(`${item.name} added to order`, {
      duration: 2000,
      icon: "🍽️",
    });
  };

  const visibleItems = useMemo(() => {
    if (itemsCount === 0) return [];
    return [-1, 0, 1].map((offset) => {
      const index = (currentIndex + offset + itemsCount) % itemsCount;
      return { ...featuredItems[index], offset };
    });
  }, [currentIndex, featuredItems, itemsCount]);

  return (
    <section className="py-28 bg-secondary/30 overflow-hidden">
      <div className="section-container">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm tracking-[0.25em] uppercase">
            Curated by Our Executive Chef
          </span>
          <h2 className="font-serif text-4xl md:text-5xl mt-4 mb-4">
            Signature Creations
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A refined selection of dishes that define Veloria’s culinary
            philosophy and seasonal inspiration.
          </p>
        </motion.div>

        {/* CAROUSEL */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* NAV */}
          <button
            aria-label="Previous dish"
            onClick={prevSlide}
            className="absolute left-0 md:left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-card/90 rounded-full shadow-soft flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition"
          >
            <ChevronLeft />
          </button>

          <button
            aria-label="Next dish"
            onClick={nextSlide}
            className="absolute right-0 md:right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-card/90 rounded-full shadow-soft flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition"
          >
            <ChevronRight />
          </button>

          {/* CARDS */}
          <div className="flex justify-center items-center gap-8 px-16 md:px-24">
            <AnimatePresence mode="popLayout">
              {visibleItems.map((item) => (
                <motion.div
                  key={`${item.id}-${item.offset}`}
                  layout
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{
                    opacity: item.offset === 0 ? 1 : 0.5,
                    scale: item.offset === 0 ? 1.05 : 0.85,
                    zIndex: item.offset === 0 ? 20 : 0,
                  }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className={`glass-card overflow-hidden ${
                    item.offset === 0
                      ? "w-80 md:w-[420px]"
                      : "hidden md:block w-72"
                  }`}
                >
                  {/* IMAGE */}
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />

                    {/* BADGE */}
                    <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow">
                      <Star className="w-3 h-3 fill-current" />
                      Chef’s Signature
                    </span>

                    {/* PRICE */}
                    {item.offset === 0 && (
                      <span className="absolute bottom-4 right-4 bg-background/90 backdrop-blur px-4 py-2 rounded-xl font-serif text-primary shadow">
                        {formatINR(item.price)}
                      </span>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="p-6 text-center">
                    <h3 className="font-serif text-xl mb-2">{item.name}</h3>
                    <p className="text-muted-foreground text-sm mb-5 line-clamp-2">
                      {item.description}
                    </p>

                    {item.offset === 0 && (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleAddToOrder(item)}
                        className="w-full py-3 rounded-xl bg-primary text-primary-foreground shadow-gold"
                      >
                        Add to Order →
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* DOTS */}
          <div className="flex justify-center gap-2 mt-10">
            {featuredItems.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Go to dish ${idx + 1}`}
                onClick={() => setCurrentIndex(idx)}
                className={`rounded-full transition-all ${
                  idx === currentIndex
                    ? "w-8 h-2 bg-primary"
                    : "w-2 h-2 bg-primary/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChefRecommendations;
