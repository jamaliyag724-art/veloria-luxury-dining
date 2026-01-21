import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone } from 'lucide-react';
import { restaurantInfo } from '@/data/restaurantData';

const LocationSection: React.FC = () => {
  return (
    <section id="contact" className="py-24">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Map Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[400px] rounded-2xl overflow-hidden shadow-medium"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1838349419906!2d-73.97506382426746!3d40.75797687138559!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c258e4a1c884e5%3A0x24fe1071086b36d5!2sMadison%20Ave%2C%20New%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1705847846959!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale hover:grayscale-0 transition-all duration-500"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary font-medium tracking-wider text-sm uppercase">
              Visit Us
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-foreground mt-4 mb-8">
              Location & Hours
            </h2>

            <div className="space-y-6">
              {/* Address */}
              <motion.div
                whileHover={{ x: 10 }}
                className="flex gap-4 p-4 bg-secondary/50 rounded-xl"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-foreground mb-1">
                    Address
                  </h4>
                  <p className="text-muted-foreground">
                    {restaurantInfo.address}
                  </p>
                  <p className="text-muted-foreground">{restaurantInfo.city}</p>
                </div>
              </motion.div>

              {/* Hours */}
              <motion.div
                whileHover={{ x: 10 }}
                className="flex gap-4 p-4 bg-secondary/50 rounded-xl"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-foreground mb-1">
                    Hours
                  </h4>
                  <p className="text-muted-foreground">
                    {restaurantInfo.hours.lunch}
                  </p>
                  <p className="text-muted-foreground">
                    {restaurantInfo.hours.dinner}
                  </p>
                  <p className="text-muted-foreground">
                    {restaurantInfo.hours.brunch}
                  </p>
                </div>
              </motion.div>

              {/* Phone */}
              <motion.div
                whileHover={{ x: 10 }}
                className="flex gap-4 p-4 bg-secondary/50 rounded-xl"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-foreground mb-1">
                    Reservations
                  </h4>
                  <a
                    href={`tel:${restaurantInfo.phone}`}
                    className="text-primary hover:underline"
                  >
                    {restaurantInfo.phone}
                  </a>
                  <p className="text-muted-foreground">
                    {restaurantInfo.email}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
