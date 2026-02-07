import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Phone,
  Clock,
  Send,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartModal from "@/components/cart/CartModal";
import FloatingCart from "@/components/cart/FloatingCart";
import { restaurantInfo } from "@/data/restaurantData";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const Contact: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setIsSubmitting(true);

    try {
      await emailjs.sendForm(
        "service_bf3fnya",
        "template_3jb6ome",
        formRef.current,
        "yvWssWWx94ibEP33n"
      );
      setIsSubmitted(true);
      toast.success("Message sent successfully!");
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: "", phone: "", subject: "", message: "" });
      }, 3000);
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          {/* ================= HEADER ================= */}
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
            {/* ================= FORM ================= */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <div className="glass-card p-10 rounded-3xl">
                <h2 className="font-serif text-2xl mb-8">
                  Send Us a Message
                </h2>

                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-14"
                    >
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                      </div>
                      <h3 className="font-serif text-xl mb-2">
                        Message Sent
                      </h3>
                      <p className="text-muted-foreground">
                        Our team will contact you shortly.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      ref={formRef}
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      <input
                        name="name"
                        required
                        placeholder="Full Name *"
                        value={formData.name}
                        onChange={handleChange}
                        className="luxury-input"
                      />

                      <input
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        className="luxury-input"
                      />

                      <select
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="luxury-input cursor-pointer"
                      >
                        <option value="">Select a subject *</option>
                        <option value="reservation">Reservation</option>
                        <option value="private-event">Private Event</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>

                      <textarea
                        name="message"
                        rows={5}
                        required
                        placeholder="Your Message *"
                        value={formData.message}
                        onChange={handleChange}
                        className="luxury-input resize-none"
                      />

                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="btn-gold w-full py-4 flex justify-center gap-2 disabled:opacity-60"
                      >
                        {isSubmitting ? (
                          "Sending..."
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Send Message
                          </>
                        )}
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* ================= INFO + MAP ================= */}
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
                        <h3 className="font-medium mb-1">
                          {item.title}
                        </h3>
                        {item.lines.map((line, i) => (
                          <p
                            key={i}
                            className="text-sm text-muted-foreground"
                          >
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
                <span className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-4 py-1 rounded-full text-xs">
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
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
};

export default Contact;
