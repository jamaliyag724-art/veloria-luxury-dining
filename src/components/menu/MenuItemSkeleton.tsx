import React from "react";
import { motion } from "framer-motion";

const shimmer = {
  initial: { backgroundPosition: "200% 0%" },
  animate: {
    backgroundPosition: "-200% 0%",
    transition: {
      duration: 2.2,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

const MenuItemSkeleton: React.FC = () => {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-soft">
      {/* IMAGE SKELETON */}
      <div className="relative h-56 w-full overflow-hidden">
        <motion.div
          variants={shimmer}
          initial="initial"
          animate="animate"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(110deg, rgba(255,255,255,0.08) 20%, rgba(212,162,76,0.35) 40%, rgba(255,255,255,0.08) 60%)",
            backgroundSize: "200% 100%",
          }}
        />
      </div>

      {/* CONTENT */}
      <div className="p-5 space-y-4">
        {/* TITLE */}
        <motion.div
          variants={shimmer}
          initial="initial"
          animate="animate"
          className="h-5 w-3/4 rounded-full"
          style={{
            background:
              "linear-gradient(110deg, rgba(255,255,255,0.1) 25%, rgba(212,162,76,0.35) 45%, rgba(255,255,255,0.1) 65%)",
            backgroundSize: "200% 100%",
          }}
        />

        {/* DESCRIPTION */}
        <motion.div
          variants={shimmer}
          initial="initial"
          animate="animate"
          className="h-4 w-full rounded-full"
          style={{
            background:
              "linear-gradient(110deg, rgba(255,255,255,0.08) 25%, rgba(212,162,76,0.25) 45%, rgba(255,255,255,0.08) 65%)",
            backgroundSize: "200% 100%",
          }}
        />
        <motion.div
          variants={shimmer}
          initial="initial"
          animate="animate"
          className="h-4 w-5/6 rounded-full"
          style={{
            background:
              "linear-gradient(110deg, rgba(255,255,255,0.08) 25%, rgba(212,162,76,0.25) 45%, rgba(255,255,255,0.08) 65%)",
            backgroundSize: "200% 100%",
          }}
        />

        {/* PRICE + BUTTON */}
        <div className="flex items-center justify-between pt-3">
          <motion.div
            variants={shimmer}
            initial="initial"
            animate="animate"
            className="h-6 w-20 rounded-full"
            style={{
              background:
                "linear-gradient(110deg, rgba(212,162,76,0.3) 30%, rgba(255,215,120,0.6) 50%, rgba(212,162,76,0.3) 70%)",
              backgroundSize: "200% 100%",
            }}
          />

          <motion.div
            variants={shimmer}
            initial="initial"
            animate="animate"
            className="h-10 w-24 rounded-xl"
            style={{
              background:
                "linear-gradient(110deg, rgba(255,255,255,0.1) 25%, rgba(212,162,76,0.4) 50%, rgba(255,255,255,0.1) 75%)",
              backgroundSize: "200% 100%",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MenuItemSkeleton;
