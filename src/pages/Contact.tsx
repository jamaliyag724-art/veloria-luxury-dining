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
    <div className="relative min-h-screen bg-background text-foreground">
      <Navbar onCartClick={() => setIsCartOpen(true)} />

      <main className="pt-36 pb-36">
        <div className="max-w-7xl mx-auto px-6">

          {/* HEADER */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7 }}
            className="text-center mb-24"
          >
            <span className="text-primary tracking-[0.4em] text-xs uppercase block mb-4">
              Get in Touch
            </span>

            <h1 className="font-serif text-3xl text-white mb-6 tracking-wide">
              Speak With Our Concierge
            </h1>

            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
              For reservations, private events, or general inquiries,
              our team is delighted to assist you.
            </p>
          </motion.div>

          {/* GRID */}
          <div className="grid lg:grid-cols-2 gap-20 items-start">

            {/* LEFT – FORM (Luxury Card Same As Track Order) */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative"
            >
              <div
                className="relative rounded-3xl 
                bg-gradient-to-b from-[#1a1a1d] to-[#111113]
                border border-yellow-500/20
                shadow-[0_0_60px_rgba(250,204,21,0.06)]
                p-12"
              >
                {/* Gold Pattern Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-5 rounded-3xl"
                  style={{
                    backgroundImage: "url('/gold-pattern.svg')",
                    backgroundRepeat: "repeat",
                    backgroundSize: "140px 140px",
                  }}
                />

                <div className="relative z-10">
                  <ContactForm />
                </div>
              </div>
            </motion.div>

            {/* RIGHT – INFO */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.7, delay: 0.2 }}
              className="space-y-10"
            >
              {[{
                icon: MapPin,
                title: "Visit Us",
                lines: [restaurantInfo.address, restaurantInfo.city],
              },{
                icon: Phone,
                title: "Call Us",
                lines: [restaurantInfo.phone],
              },{
                icon: Clock,
                title: "Hours",
                lines: [
                  restaurantInfo.hours.lunch,
                  restaurantInfo.hours.dinner,
                  restaurantInfo.hours.brunch,
                ],
              }].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -6 }}
                  className="
                    rounded-2xl p-7 border 
                    bg-gradient-to-b from-[#1a1a1d] to-[#111113]
                    border-yellow-500/20
                    shadow-[0_0_40px_rgba(250,204,21,0.04)]
                    transition-all"
                >
                  <div className="flex gap-5">
                    <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white mb-2">
                        {item.title}
                      </h3>
                      {item.lines.map((line, i) => (
                        <p key={i} className="text-sm text-zinc-400">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* MAP */}
              <div className="overflow-hidden h-[420px] rounded-3xl border border-yellow-500/20 shadow-[0_0_40px_rgba(250,204,21,0.04)] relative">
                <span className="absolute top-4 left-4 z-10 bg-[#111113]/80 backdrop-blur px-4 py-1 rounded-full text-xs text-yellow-400 border border-yellow-500/20">
                  Our Location
                </span>

                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3674.198765552834!2d72.58717017527744!3d22.94290581929658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e8f74f93d9c77%3A0xf94ed8d1e20ffd54!2sPLATINUM%20BLUE%20SKY!5e0!3m2!1sen!2sin!4v1769183628515"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  className="contrast-110"
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
