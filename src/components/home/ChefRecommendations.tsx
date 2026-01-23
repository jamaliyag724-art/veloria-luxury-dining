import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { getFeaturedItems } from "@/data/menuData";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { formatINR } from "@/lib/currency";

const AUTOPLAY_DELAY = 4000;

const ChefRecommendations: React.FC = () => {
  // ✅ MEMOIZE DATA (CRITICAL FIX)
  const featuredItems = useMemo(() => getFeaturedItems(), []);
  const { addItem } = useCart();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const itemsCount = featuredItems.length;

  // ✅ SAFETY GUARD
  const nextSlide = useCallback(() => {
    if (itemsCount < 2) return;
    setCurrentIndex((prev) => (prev + 1) % itemsCount);
  }, [itemsCount]);

  const prevSlide = useCallback(() => {
    if (itemsCount < 2) return;
    setCurrentIndex((prev) => (prev - 1 + itemsCount) % itemsCount);
  }, [itemsCount]);

  // ✅ BULLETPROOF AUTOPLAY
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

    toast.success(`${item.name} added to order!`, {
      duration: 2000,
      icon: "🍽️",
    });
  };

  // ✅ VISIBLE ITEMS (CENTERED)
  const visibleItems = useMemo(() => {
    if (itemsCount === 0) return [];

    return [-1, 0, 1].map((offset) => {
      const index = (currentIndex + offset + itemsCount) % itemsCount;
      return { ...featuredItems[index], offset };
    });
  }, [currentIndex, featuredItems, itemsCount]);

  return (
    <section className="py-24 bg-secondary/30 overflow-hidden">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium tracking-wider text-sm uppercase">
            Chef&apos;s Selection
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium mt-4 mb-4">
            Recommended for You
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Handpicked favorites from our executive chef, featuring the finest seasonal ingredients.
          </p>
        </motion.div>

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevSlide}
            className="absolute left-0 md:left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-card/90 rounded-full shadow-medium flex items-center justify-center hover:bg-primary hover:text-primary-foreground"
          >
            <ChevronLeft />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextSlide}
            className="absolute right-0 md:right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-card/90 rounded-full shadow-medium flex items-center justify-center hover:bg-primary hover:text-primary-foreground"
          >
            <ChevronRight />
          </motion.button>

          {/* Cards */}
          <div className="flex justify-center items-center gap-6 px-16 md:px-20">
            <AnimatePresence mode="popLayout">
              {visibleItems.map((item) => (
                <motion.div
                  key={`${item.id}-${item.offset}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: item.offset === 0 ? 1 : 0.6,
                    scale: item.offset === 0 ? 1 : 0.85,
                    zIndex: item.offset === 0 ? 10 : 0,
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`glass-card overflow-hidden ${
                    item.offset === 0 ? "w-80 md:w-96" : "hidden md:block w-72"
                  }`}
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Chef&apos;s Pick
                    </span>
                   <span className="font-serif text-primary">
  {formatINR(item.price)}
</span>
                  </div>
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-serif text-xl mb-2">{item.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    {item.offset === 0 && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAddToOrder(item)}
                        className="w-full py-3 bg-primary text-primary-foreground rounded-xl"
                      >
                        Add to Order
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {featuredItems.map((_, idx) => (
              <button
                key={idx}
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
