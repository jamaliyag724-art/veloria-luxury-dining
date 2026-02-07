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

  const contactDetails = [
    {
      icon: MapPin,
      title: "Visit Us",
      lines: [restaurantInfo.address, restaurantInfo.city],
    },
    {
      icon: Phone,
      title: "Call Us",
      lines: [restaurantInfo.phone],
    },
    {
      icon: Clock,
      title: "Hours",
      lines: [
        restaurantInfo.hours.lunch,
        restaurantInfo.hours.dinner,
        restaurantInfo.hours.brunch,
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCartClick={() => setIsCartOpen(true)} />

      <main className="pt-28 pb-28">
        <div className="section-container">
          {/* HEADER */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7 }}
            className="text-center mb-20"
          >
            <span className="text-primary tracking-[0.3em] text-xs uppercase">
              Get in Touch
            </span>
            <h1 className="font-serif text-5xl md:text-6xl mt-6 mb-6">
              Contact Us
            </h1>
            <div className="w-20 h-[2px] bg-primary mx-auto mb-6 rounded-full" />
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              For reservations, private events, or general inquiries,
              our team is happy to assist you.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* FORM */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <ContactForm />
            </motion.div>

            {/* INFO + MAP */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.7, delay: 0.2 }}
              className="space-y-10"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                {contactDetails.map((item) => (
                  <motion.div
                    key={item.title}
                    whileHover={{ y: -4 }}
                    className="glass-card p-6 rounded-2xl"
                  >
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">{item.title}</h3>
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
              <div className="glass-card overflow-hidden h-[420px] rounded-3xl relative">
                <span className="absolute top-4 left-4 z-10 bg-card/90 backdrop-blur px-4 py-1 rounded-full text-xs">
                  Our Location
                </span>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3674.198765552834!2d72.58717017527744!3d22.94290581929658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e8f74f93d9c77%3A0xf94ed8d1e20ffd54!2sPLATINUM%20BLUE%20SKY!5e0!3m2!1sen!2sin!4v1769183628515"
                  width="100%"
                  height="100%"
                  loading="lazy"
                />
              </div>

              <div className="glass-card p-8 rounded-2xl">
                <h3 className="font-serif text-lg mb-3">
                  Planning a Private Event?
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Our elegant dining space is perfect for celebrations
                  and corporate gatherings.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-outline-gold text-sm px-6 py-2.5"
                >
                  Inquire About Events
                </motion.button>
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
