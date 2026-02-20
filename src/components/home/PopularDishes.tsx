import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { getFeaturedItems } from '@/data/menuData';
import { useCart } from '@/context/CartContext';
import LuxuryDishCard from '@/components/ui/LuxuryDishCard';

const PopularDishes: React.FC = () => {
  const featuredItems = getFeaturedItems();
  const { addItem } = useCart();

  return (
    <section className="py-24">
      <div className="section-container">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium tracking-wider text-sm uppercase">
            Chef's Selection
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-medium text-foreground mt-4 mb-4">
            Popular Dishes
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our most beloved creations, each crafted with passion and
            precision by our culinary artisans.
          </p>
        </motion.div>

        {/* 🔥 3D Dishes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {featuredItems.slice(0, 6).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <LuxuryDishCard
                image={item.image}
                title={item.name}
                description={item.description}
                price={`₹${item.price.toLocaleString("en-IN")}`}
                onAddToCart={() =>
                  addItem({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    category: item.category,
                  })
                }
              />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link to="/menu">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-outline-gold group"
            >
              View Full Menu
              <ArrowRight className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default PopularDishes;
