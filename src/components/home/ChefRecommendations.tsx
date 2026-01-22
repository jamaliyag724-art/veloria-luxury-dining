import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { getFeaturedItems } from '@/data/menuData';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

const ChefRecommendations: React.FC = () => {
  const featuredItems = getFeaturedItems();
  const { addItem } = useCart();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
  }, [featuredItems.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
  }, [featuredItems.length]);

  // Auto-play functionality
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const handleAddToOrder = (item: typeof featuredItems[0]) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
    });
    toast.success(`${item.name} added to order!`, {
      duration: 2000,
      icon: '🍽️',
    });
  };

  // Get visible items (3 items centered around current)
  const getVisibleItems = () => {
    const items = [];
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + featuredItems.length) % featuredItems.length;
      items.push({ ...featuredItems[index], offset: i });
    }
    return items;
  };

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
            Chef's Selection
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium text-foreground mt-4 mb-4">
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
          {/* Navigation Buttons */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevSlide}
            className="absolute left-0 md:left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-card/90 backdrop-blur-sm rounded-full shadow-medium flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextSlide}
            className="absolute right-0 md:right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-card/90 backdrop-blur-sm rounded-full shadow-medium flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>

          {/* Cards Container */}
          <div className="flex justify-center items-center gap-6 px-16 md:px-20">
            <AnimatePresence mode="popLayout">
              {getVisibleItems().map((item, idx) => (
                <motion.div
                  key={`${item.id}-${idx}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8, x: item.offset * 100 }}
                  animate={{
                    opacity: item.offset === 0 ? 1 : 0.6,
                    scale: item.offset === 0 ? 1 : 0.85,
                    x: 0,
                    zIndex: item.offset === 0 ? 10 : 0,
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={`glass-card overflow-hidden flex-shrink-0 ${
                    item.offset === 0 ? 'w-80 md:w-96' : 'hidden md:block w-72'
                  }`}
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent" />
                    <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Chef's Pick
                    </span>
                    <span className="absolute bottom-4 right-4 font-serif text-2xl font-bold text-white">
                      ${item.price}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                      {item.name}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                      {item.description}
                    </p>
                    {item.offset === 0 && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAddToOrder(item)}
                        className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:brightness-110 transition-all"
                      >
                        Add to Order
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {featuredItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? 'w-8 h-2 bg-primary'
                    : 'w-2 h-2 bg-primary/30 hover:bg-primary/50'
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
