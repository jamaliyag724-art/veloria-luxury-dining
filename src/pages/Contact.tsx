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
<h1 className="font-serif text-3xl mb-6 relative inline-block">
  <span className="relative z-10">
    Speak With Our Concierge
  </span>

<span className="absolute left-0 -bottom-2 w-full h-[6px]
  bg-gradient-to-r
  from-transparent
  via-champagne
  to-transparent
  opacity-90
  blur-[2px]
  dark:via-primary"
/>
</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
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
              <div className="absolute -inset-1 bg-primary/10 blur-2xl opacity-30 rounded-3xl" />

              <div
                className="
                relative 
                rounded-3xl p-12 
                border 
                backdrop-blur-2xl
                bg-white/70 border-zinc-200 shadow-xl
                dark:bg-white/5 dark:border-yellow-400/20 dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)]
              "
              >
                <ContactForm />
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
                    rounded-2xl p-7 border transition-all
                    bg-white border-zinc-200 shadow-md
                    dark:bg-white/5 dark:border-white/10 dark:hover:border-yellow-400/40
                  "
                >
                  <div className="flex gap-5">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">
                        {item.title}
                      </h3>
                      {item.lines.map((line, i) => (
                        <p key={i} className="text-sm text-muted-foreground">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* MAP */}
              <div className="overflow-hidden h-[420px] rounded-3xl border border-border shadow-lg relative">
                <span className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur px-4 py-1 rounded-full text-xs text-primary border border-border">
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
