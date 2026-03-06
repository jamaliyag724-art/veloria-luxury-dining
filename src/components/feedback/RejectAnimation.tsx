import React, { Suspense } from "react";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";

const RejectScene3D = React.lazy(() => import("./RejectScene3D"));

const Fallback = () => (
  <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
    <XCircle className="w-10 h-10 text-destructive" strokeWidth={2} />
  </div>
);

const RejectAnimation: React.FC = () => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1, x: [0, -5, 5, -5, 5, 0] }}
    transition={{ duration: 0.6 }}
    className="flex flex-col items-center"
  >
    <Suspense fallback={<Fallback />}>
      <RejectScene3D />
    </Suspense>
  </motion.div>
);

export default RejectAnimation;
