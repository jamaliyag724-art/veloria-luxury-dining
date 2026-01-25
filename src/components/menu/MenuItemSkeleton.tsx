import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const MenuItemSkeleton: React.FC<{ index?: number }> = ({ index = 0 }) => {
  const prefersReducedMotion = useReducedMotion();

  const shimmer = {
    initial: { backgroundPosition: "200% 0%" },
    animate: {
      backgroundPosition: "-200% 0%",
      transition: {
        duration: prefersReducedMotion ? 0 : 2.4,
        repeat: prefersReducedMotion ? 0 : Infinity,
        ease: "linear",
        delay: index * 0.04, // 👈 luxury stagger
      },
    },
  };

  const shimmerBg = (
    gold = 0.22,
    light = 0.08
  ) => ({
    background: `linear-gradient(
      110deg,
      rgba(255,255,255,${light}) 25%,
      rgba(212,162,76,${gold}) 45%,
      rgba(255,255,255,${light}) 65%
    )`,
    backgroundSize: "200% 100%",
  });

  return (
    <div className="relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 shadow-soft">
      {/* IMAGE */}
      <div className="relative h-56 w-full overflow-hidden">
        <motion.div
          variants={shimmer}
          initial="initial"
          animate="animate"
          className="absolute inset-0"
          style={shimmerBg(0.18, 0.06)}
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
          style={shimmerBg()}
        />

        {/* DESCRIPTION */}
        <motion.div
          variants={shimmer}
          initial="initial"
          animate="animate"
          className="h-4 w-full rounded-full"
          style={shimmerBg(0.18, 0.06)}
        />
        <motion.div
          variants={shimmer}
          initial="initial"
          animate="animate"
          className="h-4 w-5/6 rounded-full"
          style={shimmerBg(0.18, 0.06)}
        />

        {/* PRICE + BUTTON */}
        <div className="flex items-center justify-between pt-3">
          <motion.div
            variants={shimmer}
            initial="initial"
            animate="animate"
            className="h-6 w-20 rounded-full"
            style={shimmerBg(0.35, 0.1)}
          />

          <motion.div
            variants={shimmer}
            initial="initial"
            animate="animate"
            className="h-10 w-24 rounded-xl"
            style={shimmerBg(0.28, 0.08)}
          />
        </div>
      </div>
    </div>
  );
};

export default MenuItemSkeleton;
