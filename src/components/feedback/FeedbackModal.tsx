import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import FeedbackForm from "./FeedbackForm";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "order" | "reservation";
  referenceId: string;
  status: "success" | "rejected";
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, type, referenceId, status }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-card border border-primary/20 rounded-3xl p-6 shadow-2xl"
          >
            {/* Gold pattern */}
            <div
              className="absolute inset-0 pointer-events-none opacity-5 rounded-3xl hidden dark:block"
              style={{
                backgroundImage: "url('/gold-pattern.svg')",
                backgroundRepeat: "repeat",
                backgroundSize: "140px 140px",
              }}
            />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-1.5 rounded-full hover:bg-muted transition"
            >
              <X size={18} className="text-muted-foreground" />
            </button>

            <div className="relative z-10">
              <FeedbackForm
                type={type}
                referenceId={referenceId}
                status={status}
                onClose={onClose}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackModal;
