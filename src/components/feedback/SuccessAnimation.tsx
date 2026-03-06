import React, { Suspense } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const DiningCelebration3D = React.lazy(() => import("./DiningCelebration3D"));

const Fallback = () => (
  <motion.div
    animate={{
      boxShadow: [
        "0 0 0 0 rgba(212,175,55,0)",
        "0 0 0 20px rgba(212,175,55,0.15)",
        "0 0 0 0 rgba(212,175,55,0)",
      ],
    }}
    transition={{ duration: 2, repeat: Infinity }}
    className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto"
  >
    <CheckCircle className="w-10 h-10 text-primary" strokeWidth={2} />
  </motion.div>
);

const SuccessAnimation: React.FC = () => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: "spring", stiffness: 200, damping: 15 }}
    className="flex flex-col items-center"
  >
    <Suspense fallback={<Fallback />}>
      <DiningCelebration3D />
    </Suspense>
  </motion.div>
);

export default SuccessAnimation;
