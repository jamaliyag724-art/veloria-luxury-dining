import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, Clock, Users } from 'lucide-react';

const ReservationCTA: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block mb-6 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium"
          >
            Reserve Your Experience
          </motion.span>

          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-foreground mb-6">
            Create Unforgettable Moments
          </h2>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Whether it's an intimate dinner, a celebration, or a business
            gathering, we craft experiences tailored to your every need.
          </p>

          {/* Features */}
          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: CalendarDays,
                title: 'Easy Booking',
                description: 'Reserve in seconds',
              },
              {
                icon: Clock,
                title: 'Flexible Timing',
                description: 'Lunch & dinner slots',
              },
              {
                icon: Users,
                title: 'Private Events',
                description: 'Up to 50 guests',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6"
              >
                <feature.icon className="w-10 h-10 text-primary mx-auto mb-3" />
                <h4 className="font-serif font-semibold text-foreground mb-1">
                  {feature.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <Link to="/reservations">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-gold text-lg py-4 px-10"
            >
              Book Your Table
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ReservationCTA;
