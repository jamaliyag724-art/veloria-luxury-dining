import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Heart, Leaf, Users, Star } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartModal from '@/components/cart/CartModal';
import FloatingCart from '@/components/cart/FloatingCart';
import chefImage from '@/assets/chef.jpg';
import aboutDish from '@/assets/about-dish.jpg';

const teamMembers = [
  {
    name: 'Chef Alessandro Rossi',
    role: 'Executive Chef',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400',
    description: 'Trained in Michelin-starred kitchens across Europe, Chef Alessandro brings 20 years of culinary excellence.',
  },
  {
    name: 'Maria Santos',
    role: 'Pastry Chef',
    image: 'https://images.unsplash.com/photo-1595257841889-eca2678454e2?w=400',
    description: 'A master of French pastry arts, Maria creates desserts that are both visual masterpieces and flavor explosions.',
  },
  {
    name: 'James Chen',
    role: 'Sommelier',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
    description: 'With expertise in rare vintages, James curates our award-winning wine collection from around the world.',
  },
  {
    name: 'Sophie Laurent',
    role: 'Restaurant Manager',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    description: 'Sophie ensures every guest experiences the warmth and elegance that defines Veloria hospitality.',
  },
];

const values = [
  {
    icon: Award,
    title: 'Excellence',
    description: 'We strive for perfection in every dish, every service, every moment.',
  },
  {
    icon: Leaf,
    title: 'Sustainability',
    description: 'Locally sourced, seasonally inspired ingredients that respect our planet.',
  },
  {
    icon: Heart,
    title: 'Passion',
    description: 'Our love for culinary arts drives everything we create.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Building lasting relationships with our guests and local partners.',
  },
];

const About: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCartClick={() => setIsCartOpen(true)} />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <span className="text-primary font-medium tracking-wider text-sm uppercase">
                Our Story
              </span>
              <h1 className="font-serif text-4xl md:text-6xl font-medium text-foreground mt-4 mb-6">
                A Legacy of Culinary Excellence
              </h1>
              <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
                Since 2010, Veloria has been a beacon of fine dining in New York City, 
                where tradition meets innovation and every meal becomes a cherished memory.
              </p>
            </motion.div>

            {/* Story Grid */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h2 className="font-serif text-3xl font-medium text-foreground">
                  Where Every Dish Tells a Story
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Veloria was born from a simple dream: to create a space where culinary artistry 
                  meets heartfelt hospitality. Our founder, Chef Alessandro Rossi, envisioned a 
                  restaurant that would honor classic techniques while embracing modern creativity.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Today, we continue that vision by sourcing the finest ingredients from local 
                  farms and global purveyors, transforming them into dishes that delight all 
                  senses. Our commitment to excellence has earned us recognition from critics 
                  and diners alike, but our greatest reward remains the smiles of our guests.
                </p>
                <div className="flex items-center gap-6 pt-4">
                  <div className="text-center">
                    <span className="font-serif text-4xl font-bold text-primary">15+</span>
                    <p className="text-sm text-muted-foreground">Years of Excellence</p>
                  </div>
                  <div className="w-px h-12 bg-border" />
                  <div className="text-center">
                    <span className="font-serif text-4xl font-bold text-primary">50K+</span>
                    <p className="text-sm text-muted-foreground">Happy Guests</p>
                  </div>
                  <div className="w-px h-12 bg-border" />
                  <div className="text-center">
                    <span className="font-serif text-4xl font-bold text-primary">5</span>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Star className="w-3 h-3 fill-primary text-primary" /> Star Rating
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-lift">
                  <img
                    src={aboutDish}
                    alt="Signature dish at Veloria"
                    className="w-full h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 to-transparent" />
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="absolute -bottom-6 -left-6 glass-card p-4 max-w-xs"
                >
                  <p className="font-serif text-lg text-foreground italic">
                    "Cooking is love made visible"
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">— Chef Alessandro</p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-secondary/30">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-primary font-medium tracking-wider text-sm uppercase">
                Our Philosophy
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mt-4">
                Values That Guide Us
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="glass-card p-6 text-center"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-primary font-medium tracking-wider text-sm uppercase">
                Meet The Team
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mt-4">
                The Artisans Behind Veloria
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="glass-card overflow-hidden group"
                >
                  <div className="relative h-64 overflow-hidden">
                    <motion.img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-lg font-semibold text-foreground">
                      {member.name}
                    </h3>
                    <p className="text-primary text-sm font-medium mb-2">{member.role}</p>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {member.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Chef Spotlight */}
        <section className="py-20 bg-secondary/30">
          <div className="section-container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-2 lg:order-1"
              >
                <span className="text-primary font-medium tracking-wider text-sm uppercase">
                  Chef Spotlight
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mt-4 mb-6">
                  Chef Alessandro Rossi
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  With over two decades of experience in world-renowned kitchens, Chef Alessandro 
                  brings a unique perspective that blends Italian heritage with global influences. 
                  His journey began in Rome, continued through Paris and Tokyo, and culminated 
                  here at Veloria.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  "My philosophy is simple: respect the ingredient, honor the tradition, but never 
                  be afraid to innovate. Every plate that leaves my kitchen carries a piece of 
                  my heart and years of learning."
                </p>
                <div className="flex flex-wrap gap-3">
                  {['Michelin Trained', 'James Beard Nominee', 'Le Cordon Bleu'].map((badge) => (
                    <span
                      key={badge}
                      className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-1 lg:order-2"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-lift">
                  <img
                    src={chefImage}
                    alt="Chef Alessandro Rossi"
                    className="w-full h-[500px] object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingCart onClick={() => setIsCartOpen(true)} />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default About;
