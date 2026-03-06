import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface StarRatingProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ label, value, onChange }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="space-y-1.5">
      <span className="text-sm text-muted-foreground font-medium">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const active = star <= (hover || value);
          return (
            <motion.button
              key={star}
              type="button"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => onChange(star)}
              className="focus:outline-none"
            >
              <Star
                size={28}
                className={`transition-all duration-200 ${
                  active
                    ? "fill-primary text-primary drop-shadow-[0_0_6px_rgba(212,175,55,0.5)]"
                    : "text-muted-foreground/30"
                }`}
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default StarRating;
