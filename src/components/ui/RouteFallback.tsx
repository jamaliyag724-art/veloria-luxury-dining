import { motion } from "framer-motion";

const RouteFallback = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background flex items-center justify-center"
    >
      <div className="w-full max-w-5xl px-6">
        {/* subtle shimmer */}
        <div className="h-10 w-1/3 bg-muted rounded mb-6 animate-pulse" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-56 bg-muted rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default RouteFallback;
