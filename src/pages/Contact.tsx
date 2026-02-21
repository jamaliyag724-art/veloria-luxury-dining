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

      {/* Soft luxury gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20 pointer-events-none" />

      <Navbar onCartClick={() => setIsCartOpen(true)} />

      <main className="relative z-10 pt-40 pb-40">
        <div className="max-w-7xl mx-auto px-6">

          {/* HEADER */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7 }}
            className="text-center mb-28"
          >
            <span className="text-primary tracking-[0.35em] text-xs uppercase">
              Get in Touch
            </span>

            <h1 className="font-serif text-5xl md:text-6xl mt-6 mb-6 leading-tight">
              Speak With Our Concierge
            </h1>

            <div className="w-20 h-[2px] bg-primary mx-auto mb-6 rounded-full" />

            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              For reservations, private events, or general inquiries,
              our team is delighted to assist you.
            </p>
          </motion.div>

          {/* GRID */}
          <div className="grid lg:grid-cols-2 gap-24 items-start">

            {/* LEFT – FORM */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative"
            >
              {/* soft glow */}
              <div className="absolute -inset-2 bg-primary/5 blur-3xl opacity-40 rounded-[40px]" />

              <div className="relative bg-card border border-border rounded-[36px] p-14 shadow-[0_25px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
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
              {/* Info Cards */}
              <div className="space-y-6">

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
                    className="bg-card border border-border rounded-2xl p-7 transition-all hover:border-primary/40 hover:shadow-lg"
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

              </div>

              {/* MAP */}
              <div className="overflow-hidden h-[430px] rounded-[36px] border border-border shadow-lg relative bg-card">
                <span className="absolute top-5 left-5 z-10 bg-card/90 backdrop-blur px-4 py-1 rounded-full text-xs text-primary border border-border">
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
