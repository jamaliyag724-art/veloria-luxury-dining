import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Utensils,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Clock,
} from "lucide-react";
import { restaurantInfo } from "@/data/restaurantData";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="text-white/90 py-20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="section-container"
      >
        {/* Gold Divider */}
        <div className="w-16 h-[2px] bg-primary mx-auto mb-16 rounded-full" />

        {/* Grid */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <motion.div variants={itemVariants} className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <Utensils className="w-8 h-8 text-primary" />
              <span className="font-serif text-2xl font-semibold text-white">
                Veloria
              </span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed">
              {restaurantInfo.tagline}
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <motion.a
                  key={i}
                  whileHover={{ scale: 1.1, y: -2 }}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h4 className="font-serif text-lg font-semibold text-white">
              Quick Links
            </h4>
            <nav className="space-y-3">
              {[
                { name: "Home", path: "/" },
                { name: "Our Menu", path: "/menu" },
                { name: "Reservations", path: "/reservations" },
                { name: "Private Events", path: "/#contact" },
                { name: "Gift Cards", path: "/#contact" },
              ].map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block text-white/70 hover:text-primary transition-colors text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </motion.div>

          {/* Hours */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h4 className="font-serif text-lg font-semibold text-white">
              Hours
            </h4>
            <div className="space-y-4 text-sm">
              {[
                { label: "Lunch", value: restaurantInfo.hours.lunch },
                { label: "Dinner", value: restaurantInfo.hours.dinner },
                { label: "Brunch", value: restaurantInfo.hours.brunch },
              ].map((h) => (
                <div key={h.label} className="flex gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-white">{h.label}</p>
                    <p className="text-white/70">{h.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h4 className="font-serif text-lg font-semibold text-white">
              Contact
            </h4>
            <div className="space-y-4 text-sm">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <div className="text-white/70">
                  <p>{restaurantInfo.address}</p>
                  <p>{restaurantInfo.city}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <a
                  href={`tel:${restaurantInfo.phone}`}
                  className="text-white/70 hover:text-primary transition-colors"
                >
                  {restaurantInfo.phone}
                </a>
              </div>
              <div className="flex gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <a
                  href={`mailto:${restaurantInfo.email}`}
                  className="text-white/70 hover:text-primary transition-colors"
                >
                  {restaurantInfo.email}
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-sm text-white/60">
            © {currentYear} Veloria. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-white/60">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
