import { motion } from "framer-motion";

interface ReservationUrgencyProps {
  message?: string;
}

const ReservationUrgency: React.FC<ReservationUrgencyProps> = ({
  message = "Only 2 tables remaining for this evening.",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mx-auto mt-6 max-w-fit px-5 py-2 rounded-full
                 bg-primary/10 text-primary text-sm
                 border border-primary/20 backdrop-blur"
    >
      {message}
    </motion.div>
  );
};

export default ReservationUrgency;
