import { motion } from "framer-motion";
import { Calendar, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ReservationCTA = () => {
  const navigate = useNavigate();

  return (
     <section className="relative py-32 bg-[#FBF7F2] text-foreground">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-black" />

      <div className="relative z-10 max-w-6xl mx-auto text-center px-6">
        <span className="text-primary uppercase tracking-widest text-sm">
          Reserve Your Experience
        </span>

        <h2 className="font-serif text-5xl mt-6 mb-6">
          Create Unforgettable Moments
        </h2>

        <p className="text-white/70 max-w-2xl mx-auto mb-16">
          Whether it’s an intimate dinner or a grand celebration, we curate
          experiences tailored to your every need.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Calendar, title: "Easy Booking", desc: "Reserve in seconds" },
            { icon: Clock, title: "Flexible Timing", desc: "Lunch & dinner slots" },
            { icon: Users, title: "Private Events", desc: "Up to 50 guests" },
          ].map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8"
            >
              <f.icon className="w-8 h-8 text-primary mx-auto mb-4" />
              <h4 className="font-serif text-xl mb-1">{f.title}</h4>
              <p className="text-white/70 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/reservations")}
          className="btn-gold px-12 py-4 text-lg"
        >
          Book Your Table
        </motion.button>
      </div>
    </section>
  );
};

export default ReservationCTA;
