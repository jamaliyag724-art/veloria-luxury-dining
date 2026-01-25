import { useState } from "react";
import ReservationLoader from "@/components/ui/ReservationLoader";

const Reservations = () => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);

    // API / Supabase call
    await new Promise((r) => setTimeout(r, 1500));

    setSubmitting(false);
  };

  if (submitting) {
    return <ReservationLoader />;
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* reservation form */}
    </form>
  );
};

export default Reservations;
