import React, { useEffect, useState } from "react";
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
  const navigate = useNavigate(); // ✅ REQUIRED

  /* BACKGROUND LOOP */
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  /* 🔥 UNIVERSAL NAV HANDLER */
  const navigateWithLoader = (
    path: string,
    loaderType: "menu" | "reservation"
  ) => {
    document.dispatchEvent(
      new CustomEvent("route-loader", {
        detail: { type: loaderType },
      })
    );

    setTimeout(() => {
      navigate(path);
    }, 600);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 🌄 BACKGROUND LOOP */}
      <AnimatePresence mode="wait">
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
            className="w-full h-full object-cover"
            loading={bgIndex === 0 ? "eager" : "lazy"}
          />

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/70" />
        </motion.div>
      </AnimatePresence>

      {/* 🌟 CONTENT */}
      <div className="relative z-10 section-container text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          {/* BADGE */}
          <span className="inline-block mb-6 px-5 py-2 rounded-full bg-primary/10 text-primary text-sm tracking-wide">
            ✦ Curated Fine Dining Experience ✦
          </span>

          {/* HEADING */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl mb-6">
            Veloria
            <span className="block mt-2 text-xl sm:text-2xl md:text-3xl text-muted-foreground font-light">
              Where Timeless European Flavors Meet Modern Elegance
            </span>
          </h1>

          {/* DESCRIPTION */}
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
            Handcrafted dishes inspired by European traditions, thoughtfully
            prepared and served with refined sophistication.
          </p>

          {/* CTA BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* 🍽️ RESERVATION */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="btn-gold py-4 px-8"
              onClick={() =>
                navigateWithLoader("/reservations", "reservation")
              }
            >
              Reserve a Table
              <ArrowRight className="inline-block ml-2 w-4 h-4" />
            </motion.button>

            {/* 🍲 MENU */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-brown py-4 px-8"
              onClick={() => navigateWithLoader("/menu", "menu")}
            >
              Explore Menu
              <ArrowRight className="inline-block ml-2 w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* ⬇ SCROLL */}
        <motion.button
          onClick={scrollToAbout}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary/60 hover:text-primary"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-8 h-8" />
        </motion.button>
      </div>
    </section>
  );
};

export default HeroSection;
