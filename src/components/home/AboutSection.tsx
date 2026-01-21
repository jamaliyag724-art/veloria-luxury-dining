import React from 'react';
import { motion } from 'framer-motion';
import { Award, Leaf, Wine } from 'lucide-react';
import chefImage from '@/assets/chef.jpg';
import aboutDish from '@/assets/about-dish.jpg';

const AboutSection: React.FC = () => {
  const features = [
    {
      icon: Award,
      title: 'Award Winning',
      description: 'Michelin-starred excellence',
    },
    {
      icon: Leaf,
      title: 'Farm Fresh',
      description: 'Locally sourced ingredients',
    },
    {
      icon: Wine,
      title: 'Curated Wines',
      description: '500+ rare vintages',
    },
  ];

  return (
    <section id="about" className="py-24 bg-secondary/30">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary font-medium tracking-wider text-sm uppercase">
              Our Story
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-foreground mt-4 mb-6">
              A Legacy of Culinary Excellence
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Since 2008, Veloria has been a sanctuary for those who appreciate
              the finer things in life. Our philosophy is simple: exceptional
              ingredients, masterful preparation, and an unwavering commitment
              to creating memorable dining experiences.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Every dish tells a story of tradition meeting innovation, where
              classic techniques are reimagined with contemporary flair. Our
              team of world-class chefs brings decades of experience from
              renowned kitchens across the globe.
            </p>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center p-4 bg-card rounded-xl"
                >
                  <feature.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h4 className="font-serif font-medium text-foreground text-sm">
                    {feature.title}
                  </h4>
                  <p className="text-muted-foreground text-xs mt-1">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Images */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Chef Image */}
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <img
                  src={chefImage}
                  alt="Executive Chef"
                  className="w-full h-80 object-cover rounded-2xl shadow-medium"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-card/90 backdrop-blur-sm p-4 rounded-xl">
                  <p className="font-serif font-semibold text-foreground">
                    Chef Alessandro
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Executive Chef
                  </p>
                </div>
              </motion.div>

              {/* Dish Image */}
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-8"
              >
                <img
                  src={aboutDish}
                  alt="Signature Dish"
                  className="w-full h-80 object-cover rounded-2xl shadow-medium"
                />
              </motion.div>
            </div>

            {/* Decorative Element */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-primary/20 rounded-2xl -z-10" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary/10 rounded-2xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
