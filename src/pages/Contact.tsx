import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Clock, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartModal from '@/components/cart/CartModal';
import FloatingCart from '@/components/cart/FloatingCart';
import { restaurantInfo } from '@/data/restaurantData';

const Contact: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success('Message sent successfully!');

    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', phone: '', subject: '', message: '' });
    }, 3000);
  };

  /* 🔥 EMAIL REMOVED HERE */
  const contactDetails = [
    {
      icon: MapPin,
      title: 'Visit Us',
      lines: [restaurantInfo.address, restaurantInfo.city],
    },
    {
      icon: Phone,
      title: 'Call Us',
      lines: [restaurantInfo.phone],
      href: `tel:${restaurantInfo.phone}`,
    },
    {
      icon: Clock,
      title: 'Hours',
      lines: [restaurantInfo.hours.lunch, restaurantInfo.hours.dinner],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCartClick={() => setIsCartOpen(true)} />

      <main className="pt-24 pb-24">
        <div className="section-container">
          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm tracking-widest uppercase">
              Get in Touch
            </span>
            <h1 className="font-serif text-4xl md:text-5xl mt-4 mb-4">
              Contact Us
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              For reservations, private events, or general inquiries, our team is happy to assist you.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-14">
            {/* ================= FORM ================= */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="glass-card p-8">
                <h2 className="font-serif text-2xl mb-6">Send Us a Message</h2>

                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                      </div>
                      <h3 className="font-serif text-xl mb-2">Message Sent</h3>
                      <p className="text-muted-foreground">
                        Our team will contact you shortly.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* NAME */}
                      <div className="relative">
                        <input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          required
                          className="luxury-input peer pt-6 pb-2"
                          placeholder=" "
                        />
                        <label
                          className={`absolute left-4 transition-all ${
                            formData.name || focusedField === 'name'
                              ? 'top-2 text-xs text-primary'
                              : 'top-1/2 -translate-y-1/2 text-muted-foreground'
                          }`}
                        >
                          Full Name *
                        </label>
                      </div>

                      {/* PHONE */}
                      <div className="relative">
                        <input
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="luxury-input peer pt-6 pb-2"
                          placeholder=" "
                        />
                        <label
                          className={`absolute left-4 transition-all ${
                            formData.phone || focusedField === 'phone'
                              ? 'top-2 text-xs text-primary'
                              : 'top-1/2 -translate-y-1/2 text-muted-foreground'
                          }`}
                        >
                          Phone Number
                        </label>
                      </div>

                      {/* SUBJECT */}
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

                      {/* MESSAGE */}
                      <textarea
                        name="message"
                        rows={5}
                        required
                        value={formData.message}
                        onChange={handleChange}
                        className="luxury-input resize-none"
                        placeholder="Your message *"
                      />

                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }}
                        className="btn-gold w-full py-4 flex justify-center gap-2"
                      >
                        {isSubmitting ? 'Sending...' : (
                          <>
                            <Send className="w-5 h-5" />
                            Send Message
                          </>
                        )}
                      </motion.button>
                    </form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* ================= INFO + MAP ================= */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              {/* INFO CARDS */}
              <div className="grid sm:grid-cols-2 gap-4">
                {contactDetails.map((item) => (
                  <div key={item.title} className="glass-card p-5">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
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
                  </div>
                ))}
              </div>

              {/* 🔥 WIDE MAP */}
              <div className="glass-card h-[420px] w-full overflow-hidden">
                <div className="relative w-full h-full flex items-center justify-center bg-secondary/40">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto shadow-gold">
                      <MapPin className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="mt-4 glass-card px-4 py-2">
                      <p className="font-serif text-sm font-semibold">Veloria</p>
                      <p className="text-xs text-muted-foreground">
                        {restaurantInfo.address}, {restaurantInfo.city}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* EVENTS */}
              <div className="glass-card p-6">
                <h3 className="font-serif text-lg mb-3">
                  Planning a Private Event?
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Our elegant dining space is perfect for celebrations and corporate gatherings.
                </p>
                <button className="btn-outline-gold text-sm px-6 py-2.5">
                  Inquire About Events
                </button>
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
