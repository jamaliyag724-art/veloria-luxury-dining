import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const SuccessAnimation: React.FC = () => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
    className="flex flex-col items-center"
  >
    <motion.div
      animate={{
        boxShadow: [
          "0 0 0 0 rgba(212,175,55,0)",
          "0 0 0 20px rgba(212,175,55,0.15)",
          "0 0 0 0 rgba(212,175,55,0)",
        ],
      }}
      transition={{ duration: 2, repeat: Infinity }}
      className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4"
    >
      <motion.div
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <CheckCircle className="w-10 h-10 text-primary" strokeWidth={2} />
      </motion.div>
    </motion.div>
  </motion.div>
);

export default SuccessAnimation;
