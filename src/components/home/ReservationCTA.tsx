import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Users } from "lucide-react";

const ReservationCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-32 bg-[#FBF7F2] text-[#1c1917] overflow-hidden">
      
      {/* Subtle Luxury Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#fbf7f2] via-[#f5efe7] to-[#efe6db]" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        
        <span className="text-[#c9a24d] uppercase tracking-[0.3em] text-xs">
          Reserve Your Experience
        </span>

        <h2 className="font-serif text-5xl mt-6 mb-6">
          Create Unforgettable Moments
        </h2>

        <p className="max-w-2xl mx-auto text-stone-600 text-lg mb-16">
          Whether it’s an intimate dinner or a grand celebration, we curate
          experiences tailored to your every need.
        </p>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          
          <div className="rounded-3xl bg-white shadow-md p-8">
            <Calendar className="mx-auto text-[#c9a24d] mb-4" />
            <h4 className="font-serif text-xl mb-2">Easy Booking</h4>
            <p className="text-stone-500 text-sm">
              Reserve your table in seconds
            </p>
          </div>

          <div className="rounded-3xl bg-white shadow-md p-8">
            <Clock className="mx-auto text-[#c9a24d] mb-4" />
            <h4 className="font-serif text-xl mb-2">Flexible Timing</h4>
            <p className="text-stone-500 text-sm">
              Lunch & dinner slots available
            </p>
          </div>

          <div className="rounded-3xl bg-white shadow-md p-8">
            <Users className="mx-auto text-[#c9a24d] mb-4" />
            <h4 className="font-serif text-xl mb-2">Private Events</h4>
            <p className="text-stone-500 text-sm">
              Perfect for celebrations & gatherings
            </p>
          </div>

        </div>

        {/* CTA Button */}
        <button
          onClick={() => navigate("/reservations")}
          className="px-10 py-4 rounded-full bg-[#c9a24d] text-white font-medium hover:bg-[#b8923e] transition"
        >
          Book Your Table
        </button>

      </div>
    </section>
  );
};

export default ReservationCTA;
