import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { getFeaturedItems } from '@/data/menuData';
import { useCart } from '@/context/CartContext';

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

        {/* Dishes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredItems.slice(0, 6).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group glass-card overflow-hidden"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-56">
                <motion.img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                  Chef's Pick
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <span className="font-serif text-xl font-bold text-primary whitespace-nowrap">
                 <p className="text-primary font-semibold">
                ₹{item.price.toLocaleString("en-IN")}
                </p>
                 </span>
                </div>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                  {item.description}
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    addItem({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      image: item.image,
                      category: item.category,
                    })
                  }
                  className="w-full py-2.5 bg-primary/10 text-primary rounded-lg font-medium text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Add to Order
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
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
