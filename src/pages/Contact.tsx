import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success('Message sent successfully!');

    // Reset after showing success
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 3000);
  };

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
      icon: Mail,
      title: 'Email Us',
      lines: [restaurantInfo.email],
      href: `mailto:${restaurantInfo.email}`,
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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium tracking-wider text-sm uppercase">
              Get in Touch
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-medium text-foreground mt-4 mb-4">
              Contact Us
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We'd love to hear from you. Whether you have a question, feedback, 
              or want to plan a special event, our team is here to help.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="glass-card p-8">
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
                  Send Us a Message
                </h2>

                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="text-center py-12"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.1 }}
                        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                      >
                        <CheckCircle className="w-10 h-10 text-green-600" />
                      </motion.div>
                      <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-muted-foreground">
                        We'll get back to you within 24 hours.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-5"
                    >
                      {/* Name */}
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          required
                          className="luxury-input peer pt-6 pb-2"
                          placeholder=" "
                        />
                        <label
                          htmlFor="name"
                          className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                            formData.name || focusedField === 'name'
                              ? 'top-2 text-xs text-primary'
                              : 'top-1/2 -translate-y-1/2 text-muted-foreground'
                          }`}
                        >
                          Full Name *
                        </label>
                      </div>

                      {/* Email & Phone */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="relative">
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            required
                            className="luxury-input peer pt-6 pb-2"
                            placeholder=" "
                          />
                          <label
                            htmlFor="email"
                            className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                              formData.email || focusedField === 'email'
                                ? 'top-2 text-xs text-primary'
                                : 'top-1/2 -translate-y-1/2 text-muted-foreground'
                            }`}
                          >
                            Email Address *
                          </label>
                        </div>

                        <div className="relative">
                          <input
                            type="tel"
                            name="phone"
                            id="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('phone')}
                            onBlur={() => setFocusedField(null)}
                            className="luxury-input peer pt-6 pb-2"
                            placeholder=" "
                          />
                          <label
                            htmlFor="phone"
                            className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                              formData.phone || focusedField === 'phone'
                                ? 'top-2 text-xs text-primary'
                                : 'top-1/2 -translate-y-1/2 text-muted-foreground'
                            }`}
                          >
                            Phone (Optional)
                          </label>
                        </div>
                      </div>

                      {/* Subject */}
                      <div className="relative">
                        <select
                          name="subject"
                          id="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="luxury-input appearance-none cursor-pointer"
                        >
                          <option value="">Select a subject *</option>
                          <option value="general">General Inquiry</option>
                          <option value="reservation">Reservation Question</option>
                          <option value="private-event">Private Event</option>
                          <option value="feedback">Feedback</option>
                          <option value="careers">Careers</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      {/* Message */}
                      <div className="relative">
                        <textarea
                          name="message"
                          id="message"
                          value={formData.message}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('message')}
                          onBlur={() => setFocusedField(null)}
                          required
                          rows={5}
                          className="luxury-input peer pt-6 pb-2 resize-none"
                          placeholder=" "
                        />
                        <label
                          htmlFor="message"
                          className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                            formData.message || focusedField === 'message'
                              ? 'top-2 text-xs text-primary'
                              : 'top-4 text-muted-foreground'
                          }`}
                        >
                          Your Message *
                        </label>
                      </div>

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                        className="btn-gold w-full py-4 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                            />
                            Sending...
                          </>
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

            {/* Contact Info & Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              {/* Contact Cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                {contactDetails.map((detail, index) => (
                  <motion.div
                    key={detail.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    whileHover={{ y: -3 }}
                    className="glass-card p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <detail.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground mb-1">{detail.title}</h3>
                        {detail.lines.map((line, i) => (
                          detail.href ? (
                            <a
                              key={i}
                              href={detail.href}
                              className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                              {line}
                            </a>
                          ) : (
                            <p key={i} className="text-sm text-muted-foreground">{line}</p>
                          )
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Map Placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card overflow-hidden h-80"
              >
                <div className="w-full h-full bg-secondary/50 relative">
                  {/* Decorative map placeholder */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-primary/30 rounded-lg transform rotate-12" />
                    <div className="absolute top-1/3 right-1/4 w-24 h-24 border border-primary/30 rounded-lg transform -rotate-6" />
                    <div className="absolute bottom-1/4 left-1/3 w-40 h-28 border border-primary/30 rounded-lg transform rotate-3" />
                  </div>
                  
                  {/* Map pin */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="text-center"
                    >
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto shadow-gold">
                        <MapPin className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div className="mt-4 glass-card px-4 py-2">
                        <p className="font-serif text-sm font-semibold text-foreground">Veloria</p>
                        <p className="text-xs text-muted-foreground">421 Madison Avenue</p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Grid lines */}
                  <svg className="absolute inset-0 w-full h-full opacity-10">
                    {[...Array(10)].map((_, i) => (
                      <React.Fragment key={i}>
                        <line
                          x1={`${i * 10}%`}
                          y1="0"
                          x2={`${i * 10}%`}
                          y2="100%"
                          stroke="currentColor"
                          strokeWidth="1"
                          className="text-primary"
                        />
                        <line
                          x1="0"
                          y1={`${i * 10}%`}
                          x2="100%"
                          y2={`${i * 10}%`}
                          stroke="currentColor"
                          strokeWidth="1"
                          className="text-primary"
                        />
                      </React.Fragment>
                    ))}
                  </svg>
                </div>
              </motion.div>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card p-6"
              >
                <h3 className="font-serif text-lg font-semibold text-foreground mb-3">
                  Planning a Private Event?
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Our private dining room and terrace are perfect for intimate gatherings, 
                  corporate events, and celebrations. Contact our events team for customized packages.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-outline-gold text-sm py-2.5 px-6"
                >
                  Inquire About Events
                </motion.button>
              </motion.div>
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
