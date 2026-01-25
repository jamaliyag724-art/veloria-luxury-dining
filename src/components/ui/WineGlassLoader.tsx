import { motion } from "framer-motion";

const WineGlassLoader = () => {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* 🍷 GLASS */}
      <div className="relative w-24 h-40">
        {/* Bowl */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-24 border-2 border-primary rounded-b-full overflow-hidden">
          {/* 🍷 WINE LIQUID */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-primary/80"
            initial={{ height: "0%" }}
            animate={{ height: ["0%", "75%", "0%"] }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* LIQUID WAVE */}
          <motion.div
            className="absolute bottom-[70%] left-0 right-0 h-3 bg-primary/90 opacity-60"
            animate={{ x: ["-8%", "8%", "-8%"] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Stem */}
        <div className="absolute top-[96px] left-1/2 -translate-x-1/2 w-[2px] h-10 bg-primary" />

        {/* Base */}
        <div className="absolute top-[136px] left-1/2 -translate-x-1/2 w-14 h-[2px] bg-primary rounded-full" />
      </div>

      {/* TEXT */}
      <p className="text-primary tracking-[0.3em] text-xs uppercase">
        Pouring Wine
      </p>
    </div>
  );
};

export default WineGlassLoader;
