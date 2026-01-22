import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const ReservationSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-black text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url(/success-bg.webp)" }}
      />
      <div className="absolute inset-0 bg-black/70" />

      <Navbar />

      <main className="relative z-10 pt-40 pb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto bg-white/10 backdrop-blur-2xl rounded-3xl p-10 text-center"
        >
          <CheckCircle className="w-20 h-20 text-primary mx-auto mb-6" />

          <h1 className="font-serif text-4xl mb-4">
            Reservation Confirmed
          </h1>

          <p className="text-white/70 mb-8">
            We look forward to welcoming you at Veloria.
          </p>

          <div className="mb-8">
            <p className="text-sm text-white/50">Reservation ID</p>
            <p className="font-serif text-2xl text-primary">{id}</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/")}
            className="btn-gold px-10 py-3"
          >
            Back to Home
          </motion.button>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default ReservationSuccess;
