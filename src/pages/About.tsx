import React, { useState } from "react";
import { motion } from "framer-motion";
import { Award, Heart, Leaf, Users } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartModal from "@/components/cart/CartModal";
import FloatingCart from "@/components/cart/FloatingCart";

import chefImage from "@/assets/chef.jpg";
import aboutDish from "@/assets/about-dish.jpg";

/* -----------------------------
   TEAM DATA
------------------------------ */
const teamMembers = [
  {
    name: "Chef Alessandro Rossi",
    role: "Executive Chef",
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400",
    description:
      "Trained in Michelin-starred kitchens across Europe, Chef Alessandro brings 20 years of culinary excellence.",
  },
  {
    name: "Maria Santos",
    role: "Pastry Chef",
    image: "https://images.unsplash.com/photo-1595257841889-eca2678454e2?w=400",
    description:
      "A master of French pastry arts, Maria creates desserts that are both visual masterpieces and flavor explosions.",
  },
  {
    name: "James Chen",
    role: "Sommelier",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400",
    description:
      "With expertise in rare vintages, James curates our award-winning wine collection from around the world.",
  },
  {
    name: "Sophie Laurent",
    role: "Restaurant Manager",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
    description:
      "Sophie ensures every guest experiences the warmth and elegance that defines Veloria hospitality.",
  },
];

/* -----------------------------
   VALUES DATA
------------------------------ */
const values = [
  {
    icon: Award,
    title: "Excellence",
    description:
      "We strive for perfection in every dish, every service, every moment.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description:
      "Locally sourced, seasonally inspired ingredients that respect our planet.",
  },
  {
    icon: Heart,
    title: "Passion",
    description:
      "Our love for culinary arts drives everything we create.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "Building lasting relationships with our guests and local partners.",
  },
];

const About: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCartClick={() => setIsCartOpen(true)} />

      <main className="pt-24">
        {/* ================= HERO ================= */}
        <section className="relative py-20 overflow-hidden">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <span className="text-primary text-sm tracking-wider uppercase">
                Our Story
              </span>
              <h1 className="font-serif text-4xl md:text-6xl mt-4 mb-6">
                A Legacy of Culinary Excellence
              </h1>
              <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
                Since 2010, Veloria has been a beacon of fine dining, where
                tradition meets innovation and every meal becomes a memory.
              </p>
            </motion.div>

            {/* STORY GRID */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h2 className="font-serif text-3xl">
                  Where Every Dish Tells a Story
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Veloria was born from a dream to create a space where
                  culinary artistry meets heartfelt hospitality.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Today, we continue that vision by sourcing the finest
                  ingredients and transforming them into unforgettable
                  experiences.
                </p>

                <div className="flex items-center gap-6 pt-4">
                  <Stat label="Years" value="15+" />
                  <Divider />
                  <Stat label="Guests" value="50K+" />
                  <Divider />
                  <Stat label="Rating" value="5★" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="rounded-2xl overflow-hidden shadow-lift">
                  <img
                    src={aboutDish}
                    alt="Signature dish"
                    className="w-full h-[500px] object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ================= VALUES ================= */}
        <section className="py-20 bg-secondary/30">
          <div className="section-container grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif text-xl mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {v.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================= TEAM ================= */}
        <section className="py-20">
          <div className="section-container grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card overflow-hidden"
              >
                <img
                  src={m.image}
                  alt={m.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-5">
                  <h3 className="font-serif text-lg">{m.name}</h3>
                  <p className="text-primary text-sm">{m.role}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {m.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <FloatingCart onClick={() => setIsCartOpen(true)} />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

/* -----------------------------
   HELPERS
------------------------------ */
const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="text-center">
    <p className="font-serif text-4xl text-primary">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

const Divider = () => <div className="w-px h-12 bg-border" />;

export default About;
