import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StarRating from "./StarRating";
import SuccessAnimation from "./SuccessAnimation";
import RejectAnimation from "./RejectAnimation";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface FeedbackFormProps {
  type: "order" | "reservation";
  referenceId: string;
  status: "success" | "rejected";
  onClose: () => void;
}

const REJECTION_REASONS = [
  "Long waiting time",
  "Reservation not available",
  "Change of plans",
  "Other",
];

const FeedbackForm: React.FC<FeedbackFormProps> = ({ type, referenceId, status, onClose }) => {
  const [food, setFood] = useState(0);
  const [service, setService] = useState(0);
  const [ambience, setAmbience] = useState(0);
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    const { error } = await supabase.from("feedback").insert({
      type,
      reference_id: referenceId,
      food_rating: status === "success" ? food || null : null,
      service_rating: status === "success" ? service || null : null,
      ambience_rating: status === "success" ? ambience || null : null,
      reason: status === "rejected" ? reason || null : null,
      comment: comment || null,
    });

    if (error) {
      toast.error("Failed to submit feedback");
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);

    if (status === "success") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#D4AF37", "#FFD700", "#FFF8DC"],
      });
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8 space-y-3"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-4xl"
        >
          ✨
        </motion.div>
        <h3 className="font-serif text-xl text-foreground">Thank you for your feedback!</h3>
        <p className="text-muted-foreground text-sm">
          Your opinion helps us improve the Veloria experience.
        </p>
        <button onClick={onClose} className="btn-gold mt-4 px-6 py-2 text-sm">
          Close
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="text-center">
        {status === "success" ? <SuccessAnimation /> : <RejectAnimation />}
        <h2 className="font-serif text-2xl text-foreground mt-2">
          {status === "success"
            ? "Thank You for Dining with Veloria"
            : `${type === "order" ? "Order" : "Reservation"} Not Completed`}
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          {status === "success"
            ? `Your ${type} was successfully completed. We would love to hear your experience.`
            : `Unfortunately this ${type} was cancelled or rejected. We would still appreciate your feedback.`}
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4 bg-background/50 backdrop-blur-sm rounded-2xl p-5 border border-border/50">
        {status === "success" ? (
          <>
            <StarRating label="⭐ Food Rating" value={food} onChange={setFood} />
            <StarRating label="⭐ Service Rating" value={service} onChange={setService} />
            <StarRating label="⭐ Ambience Rating" value={ambience} onChange={setAmbience} />
          </>
        ) : (
          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground font-medium">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition"
            >
              <option value="">Select a reason</option>
              {REJECTION_REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-sm text-muted-foreground font-medium">
            {status === "success" ? "Share your experience with us..." : "Tell us what went wrong"}
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition resize-none"
            placeholder="Your thoughts..."
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="btn-gold flex-1 py-3 text-sm disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Feedback"}
        </button>
        {status === "success" && (
          <button
            onClick={onClose}
            className="flex-1 py-3 text-sm rounded-xl border border-border text-muted-foreground hover:bg-muted transition"
          >
            Skip
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default FeedbackForm;
