import { motion } from "framer-motion";
import { CalendarDays, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: CalendarDays,
    title: "Easy Booking",
    desc: "Reserve in seconds",
  },
  {
    icon: Clock,
    title: "Flexible Timing",
    desc: "Lunch & dinner slots",
  },
  {
    icon: Users,
    title: "Private Events",
    desc: "Up to 50 guests",
  },
];

export default function ReservationCTA() {
  return (
    <section className="relative py-28 text-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
      <div className="relative z-10 section-container">
        <span className="text-primary uppercase tracking-widest text-xs">
          Reserve Your Experience
        </span>

        <h2 className="font-serif text-4xl md:text-5xl text-white mt-4 mb-6">
          Create Unforgettable Moments
        </h2>

        <p className="text-white/70 max-w-2xl mx-auto mb-14">
          Whether it’s an intimate dinner or a grand celebration, we curate
          experiences tailored to your every need.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 text-white"
            >
              <f.icon className="w-8 h-8 text-primary mx-auto mb-4" />
              <h4 className="font-medium">{f.title}</h4>
              <p className="text-sm text-white/70 mt-1">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <Link to="/reservations" className="btn-gold px-12 py-4">
          Book Your Table
        </Link>
      </div>
    </section>
  );
}
