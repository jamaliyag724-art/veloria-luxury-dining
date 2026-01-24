import { motion } from "framer-motion";

export default function VeloriaLoader() {
  return (
    <div className="fixed inset-0 bg-ivory flex items-center justify-center z-[9999]">
      <div className="flex flex-col items-center gap-6">
        
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: [0.92, 1, 0.96, 1], opacity: 1 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary via-amber-400 to-primary flex items-center justify-center shadow-gold overflow-hidden"
        >
          <span className="font-serif text-3xl text-primary-foreground">
            V
          </span>

          {/* Gold shimmer sweep */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{ x: ["-120%", "120%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {/* Luxury text */}
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity }}
          className="text-sm tracking-wide text-muted-foreground font-serif"
        >
          Preparing a fine experience…
        </motion.p>
      </div>
    </div>
  );
}
