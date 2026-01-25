import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* 🔁 BACKGROUND IMAGES */
const HERO_IMAGES = [
  "/home-1.webp",
  "/home-2.webp",
  "/home-3.webp",
];

const HeroSection: React.FC = () => {
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 7000); // luxury pacing

    return () => clearInterval(interval);
  }, []);

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 🌄 BACKGROUND LOOP */}
      <AnimatePresence>
        <motion.div
          key={bgIndex}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img
            src={HERO_IMAGES[bgIndex]}
            alt="Veloria fine dining ambiance"
            loading={bgIndex === 0 ? "eager" : "lazy"}
            decoding="async"
            className="w-full h-full object-cover"
          />

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/70" />
        </motion.div>
      </AnimatePresence>

      {/* 🌟 CONTENT */}
      <div className="relative z-10 section-container text-center px-4 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          {/* Prestige Badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="inline-block mb-6 px-5 py-2
                       bg-primary/10 backdrop-blur-md
                       border border-primary/20
                       rounded-full text-primary
                       text-xs sm:text-sm tracking-wide"
          >
            ✦ Curated Fine Dining Experience ✦
          </motion.span>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.8 }}
            className="
              font-serif font-medium text-foreground leading-tight mb-6
              text-4xl sm:text-5xl md:text-7xl lg:text-8xl
            "
          >
            <span className="block">Veloria</span>
            <span className="
              block mt-2 font-light text-muted-foreground
              text-xl sm:text-2xl md:text-4xl lg:text-5xl
            ">
              Where Timeless European Flavors
              <br className="hidden sm:block" />
              Meet Modern Elegance
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="
              text-muted-foreground max-w-2xl mx-auto mb-10
              text-base sm:text-lg md:text-xl
            "
          >
            Handcrafted dishes inspired by European traditions,
            thoughtfully prepared and served with refined sophistication.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
           {/* PRIMARY CTA */}
     <motion.button
  type="button"
  whileHover={{ scale: 1.04 }}
  whileTap={{ scale: 0.96 }}
  className="btn-gold w-full sm:w-auto py-4 sm:py-3 cursor-pointer"
  onClick={() => {
    console.log("Reserve clicked"); // 👈 test log

    document.dispatchEvent(
      new CustomEvent("route-loader", {
        detail: { type: "reservation" },
      })
    );

    setTimeout(() => {
      navigate("/reservations");
    }, 700);
  }}
>
  Reserve a Table
  <ArrowRight className="inline-block ml-2 w-4 h-4" />
</motion.button>


            {/* SECONDARY CTA */}
            <Link to="/menu" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-brown w-full sm:w-auto py-4 sm:py-3"
              >
                Explore Menu
               <ArrowRight className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.8 }}
          onClick={scrollToAbout}
          aria-label="Scroll to discover more"
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 text-primary/60 hover:text-primary"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-7 h-7 sm:w-8 sm:h-8" />
          </motion.div>
        </motion.button>
      </div>
    </section>
  );
};

export default HeroSection;
