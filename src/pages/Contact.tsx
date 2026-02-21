import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartModal from "@/components/cart/CartModal";
import FloatingCart from "@/components/cart/FloatingCart";
import ContactForm from "@/components/contact/ContactForm";
import { restaurantInfo } from "@/data/restaurantData";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const Contact: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <Navbar onCartClick={() => setIsCartOpen(true)} />

      <main className="relative z-10 pt-36 pb-36">
        <div className="max-w-7xl mx-auto px-6">

          {/* HEADER */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7 }}
            className="text-center mb-24"
          >
            <span className="text-yellow-400 tracking-[0.4em] text-xs uppercase">
              Get in Touch
            </span>

            <h1 className="font-serif text-5xl md:text-6xl mt-6 mb-6 text-white">
              Speak With Our Concierge
            </h1>

            <div className="w-24 h-[2px] bg-yellow-400 mx-auto mb-6 rounded-full" />

            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
              For reservations, private events, or general inquiries,
              our team is delighted to assist you.
            </p>
          </motion.div>

          {/* GRID */}
          <div className="grid lg:grid-cols-2 gap-20 items-start">

            {/* LEFT – FORM */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative"
            >
              <div className="absolute -inset-1 bg-yellow-400/10 blur-2xl opacity-40 rounded-3xl" />

              <div className="relative bg-white/5 backdrop-blur-2xl border border-yellow-400/20 rounded-3xl p-12 shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
                <ContactForm />
              </div>
            </motion.div>

            {/* RIGHT – INFO */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.7, delay: 0.2 }}
              className="space-y-12"
            >

              {/* INFO GRID FIXED */}
              <div className="grid grid-cols-1 gap-6">

                {/* Visit Us */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-yellow-400/30 transition-all">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-yellow-400/10 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-2 text-white">Visit Us</h3>
                      <p className="text-sm text-zinc-400">
                        {restaurantInfo.address}
                      </p>
                      <p className="text-sm text-zinc-400">
                        {restaurantInfo.city}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Call Us */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-yellow-400/30 transition-all">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-yellow-400/10 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-2 text-white">Call Us</h3>
                      <p className="text-sm text-zinc-400">
                        {restaurantInfo.phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hours FULL WIDTH */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-yellow-400/30 transition-all">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-yellow-400/10 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-2 text-white">Hours</h3>
                      <p className="text-sm text-zinc-400">
                        {restaurantInfo.hours.lunch}
                      </p>
                      <p className="text-sm text-zinc-400">
                        {restaurantInfo.hours.dinner}
                      </p>
                      <p className="text-sm text-zinc-400">
                        {restaurantInfo.hours.brunch}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* COLORED MAP */}
              <div className="overflow-hidden h-[420px] rounded-3xl border border-yellow-400/20 shadow-xl relative">
                <span className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur px-4 py-1 rounded-full text-xs text-yellow-400 border border-yellow-400/20">
                  Our Location
                </span>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3674.198765552834!2d72.58717017527744!3d22.94290581929658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e8f74f93d9c77%3A0xf94ed8d1e20ffd54!2sPLATINUM%20BLUE%20SKY!5e0!3m2!1sen!2sin!4v1769183628515"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  className="contrast-110 brightness-95"
                />
              </div>

            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingCart onClick={() => setIsCartOpen(true)} />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default Contact;
