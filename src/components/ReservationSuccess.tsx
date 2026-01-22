import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  reservationId: string;
}

const ReservationSuccess: React.FC<Props> = ({ reservationId }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-background/90 backdrop-blur-xl rounded-3xl p-12 text-center shadow-[0_40px_120px_rgba(0,0,0,0.35)]"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle className="w-10 h-10 text-green-500" />
      </motion.div>

      <h2 className="font-serif text-3xl mb-3">
        Reservation Confirmed
      </h2>

      <p className="text-muted-foreground mb-6">
        We look forward to welcoming you at Veloria.
      </p>

      <div className="border border-border rounded-xl p-4 mb-6">
        <p className="text-sm text-muted-foreground">Reservation ID</p>
        <p className="font-serif text-2xl text-primary font-semibold">
          {reservationId}
        </p>
      </div>

      <Link
        to="/"
        className="btn-gold inline-block px-10 py-3"
      >
        Back to Home
      </Link>
    </motion.div>
  );
};

export default ReservationSuccess;
