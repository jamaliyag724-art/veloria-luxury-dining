import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Utensils, 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  Twitter,
  Clock
} from 'lucide-react';
import { restaurantInfo } from '@/data/restaurantData';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
   <footer className="bg-transparent py-20 border-t border-border/60">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="section-container py-16"
      >
       <div className="w-16 h-[2px] bg-primary mx-auto mb-12 rounded-full" />
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <Utensils className="w-8 h-8 text-primary" />
              <span className="font-serif text-2xl font-semibold text-foreground">
                Veloria
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {restaurantInfo.tagline}
            </p>
            <div className="flex gap-4">
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="#"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="#"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="#"
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h4 className="font-serif text-lg font-semibold text-foreground">
              Quick Links
            </h4>
            <nav className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Our Menu', path: '/menu' },
                { name: 'Reservations', path: '/reservations' },
                { name: 'Private Events', path: '/#contact' },
                { name: 'Gift Cards', path: '/#contact' },
              ].map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </motion.div>

          {/* Hours */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h4 className="font-serif text-lg font-semibold text-foreground">
              Hours
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5" />
                <div className="text-sm">
                  <p className="text-foreground font-medium">Lunch</p>
                  <p className="text-muted-foreground">{restaurantInfo.hours.lunch}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5" />
                <div className="text-sm">
                  <p className="text-foreground font-medium">Dinner</p>
                  <p className="text-muted-foreground">{restaurantInfo.hours.dinner}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5" />
                <div className="text-sm">
                  <p className="text-foreground font-medium">Brunch</p>
                  <p className="text-muted-foreground">{restaurantInfo.hours.brunch}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h4 className="font-serif text-lg font-semibold text-foreground">
              Contact
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p>{restaurantInfo.address}</p>
                  <p>{restaurantInfo.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <a
                  href={`tel:${restaurantInfo.phone}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {restaurantInfo.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <a
                  href={`mailto:${restaurantInfo.email}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
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
          className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-sm text-muted-foreground">
            © {currentYear} Veloria. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
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
