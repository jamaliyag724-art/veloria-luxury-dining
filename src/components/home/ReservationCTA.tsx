import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Users } from "lucide-react";

const ReservationCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-32 bg-secondary overflow-hidden">
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        
        <span className="text-primary uppercase tracking-[0.3em] text-xs">
          Reserve Your Experience
        </span>

        <h2 className="font-serif text-5xl mt-6 mb-6 text-foreground">
          Create Unforgettable Moments
        </h2>

        <p className="max-w-2xl mx-auto text-muted-foreground text-lg mb-16">
          Whether it's an intimate dinner or a grand celebration, we curate
          experiences tailored to your every need.
        </p>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          
          <div className="rounded-3xl bg-card shadow-md p-8 border border-border/50">
            <Calendar className="mx-auto text-primary mb-4" />
            <h4 className="font-serif text-xl mb-2 text-foreground">Easy Booking</h4>
            <p className="text-muted-foreground text-sm">
              Reserve your table in seconds
            </p>
          </div>

          <div className="rounded-3xl bg-card shadow-md p-8 border border-border/50">
            <Clock className="mx-auto text-primary mb-4" />
            <h4 className="font-serif text-xl mb-2 text-foreground">Flexible Timing</h4>
            <p className="text-muted-foreground text-sm">
              Lunch & dinner slots available
            </p>
          </div>

          <div className="rounded-3xl bg-card shadow-md p-8 border border-border/50">
            <Users className="mx-auto text-primary mb-4" />
            <h4 className="font-serif text-xl mb-2 text-foreground">Private Events</h4>
            <p className="text-muted-foreground text-sm">
              Perfect for celebrations & gatherings
            </p>
          </div>

        </div>

        {/* CTA Button */}
        <button
          onClick={() => navigate("/reservations")}
          className="btn-gold px-10 py-4"
        >
          Book Your Table
        </button>

      </div>
    </section>
  );
};

export default ReservationCTA;
