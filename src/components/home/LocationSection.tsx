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
             <div className="glass-card overflow-hidden h-[420px] w-full">
                <iframe
                  src="https://maps.app.goo.gl/x8LWX77PZCPQ7rdf7"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

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
