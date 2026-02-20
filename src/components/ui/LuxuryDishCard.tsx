import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef } from "react";

interface Props {
  image: string;
  title: string;
  price: string;
  description: string;
}

const LuxuryDishCard: React.FC<Props> = ({
  image,
  title,
  price,
  description,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [12, -12]);
  const rotateY = useTransform(x, [-100, 100], [-12, 12]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      style={{ rotateX, rotateY }}
      className="relative group rounded-3xl overflow-hidden
                 bg-card perspective-1000
                 transition-transform duration-300"
    >
      <motion.div
        className="relative h-[420px] w-full"
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover rounded-3xl"
        />

        {/* Glass Overlay */}
        <div
          className="absolute inset-0 rounded-3xl
                     bg-gradient-to-t from-black/60 via-black/20 to-transparent
                     opacity-0 group-hover:opacity-100
                     transition duration-500"
        />

        {/* Info Panel */}
        <div
          className="absolute bottom-0 left-0 right-0 p-6
                     backdrop-blur-md
                     bg-black/40 text-white
                     translate-y-10 opacity-0
                     group-hover:translate-y-0 group-hover:opacity-100
                     transition-all duration-500"
        >
          <h3 className="font-serif text-2xl">{title}</h3>
          <p className="text-sm opacity-80 mt-1">{description}</p>
          <p className="text-primary mt-2 font-medium">{price}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LuxuryDishCard;
