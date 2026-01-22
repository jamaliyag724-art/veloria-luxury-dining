import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { MenuItem } from '@/data/menuData';

interface MenuItemCardProps {
  item: MenuItem;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  const { addItem, items } = useCart();
  const [added, setAdded] = React.useState(false);

  const isInCart = items.some((i) => i.id === item.id);

  const handleAdd = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="menu-card group"
    >
      {/* Image */}
      <div className="relative w-full overflow-hidden rounded-xl aspect-[4/3]">
  <img
    src={item.image}
    alt={item.name}
    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
    loading="lazy"
  />
</div>
        {item.featured && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
            Chef's Pick
          </span>
        )}
        {item.dietary && (
          <div className="absolute top-3 right-3 flex gap-1">
            {item.dietary.map((diet) => (
              <span
                key={diet}
                className="bg-secondary/90 text-foreground text-xs px-2 py-1 rounded-full capitalize"
              >
                {diet}
              </span>
            ))}
          </div>
        )}
        
        {/* Overlay on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent flex items-end justify-center pb-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium text-sm transition-all ${
              added || isInCart
                ? 'bg-accent text-accent-foreground'
                : 'bg-primary text-primary-foreground'
            }`}
          >
            {added || isInCart ? (
              <>
                <Check className="w-4 h-4" />
                Added
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add to Order
              </>
            )}
          </motion.button>
        </motion.div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {item.name}
          </h3>
          <span className="font-serif text-lg font-bold text-primary whitespace-nowrap">
            ${item.price}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {item.description}
        </p>
      </div>

      {/* Mobile Add Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAdd}
        className={`mt-4 w-full py-2.5 rounded-lg font-medium text-sm transition-all md:hidden ${
          added || isInCart
            ? 'bg-accent/20 text-accent border border-accent'
            : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground'
        }`}
      >
        {added || isInCart ? 'Added to Order' : 'Add to Order'}
      </motion.button>
    </motion.div>
  );
};

export default MenuItemCard;
