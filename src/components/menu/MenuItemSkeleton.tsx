import { motion } from "framer-motion";

const MenuItemSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card p-4 animate-pulse"
    >
      {/* Image */}
      <div className="h-48 rounded-xl bg-muted mb-4" />

      {/* Title */}
      <div className="h-4 bg-muted rounded w-2/3 mb-2" />

      {/* Description */}
      <div className="h-3 bg-muted rounded w-full mb-2" />
      <div className="h-3 bg-muted rounded w-5/6 mb-4" />

      {/* Price */}
      <div className="h-4 bg-muted rounded w-1/3" />
    </motion.div>
  );
};

export default MenuItemSkeleton;
