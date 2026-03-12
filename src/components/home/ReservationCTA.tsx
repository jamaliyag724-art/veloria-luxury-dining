import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Users, Gift, Copy } from "lucide-react";
import { toast } from "sonner";

const ReservationCTA = () => {
  const navigate = useNavigate();
  const [reward, setReward] = useState<string | null>(null);
  const [coupon, setCoupon] = useState<string | null>(null);

  useEffect(() => {
    const r = localStorage.getItem("veloria-claimed-reward");
    const c = localStorage.getItem("veloria-coupon-code");
    if (r && c) {
      setReward(r);
      setCoupon(c);
    }
    // Listen for storage changes (claim happens on same page)
    const onStorage = () => {
      setReward(localStorage.getItem("veloria-claimed-reward"));
      setCoupon(localStorage.getItem("veloria-coupon-code"));
    };
    window.addEventListener("storage", onStorage);
    // Also poll once after a short delay for same-tab updates
    const t = setTimeout(onStorage, 500);
    return () => { window.removeEventListener("storage", onStorage); clearTimeout(t); };
  }, []);

  // Re-check on scroll into view
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setReward(localStorage.getItem("veloria-claimed-reward"));
        setCoupon(localStorage.getItem("veloria-coupon-code"));
      }
    });
    const el = document.getElementById("reservation-cta");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="reservation-cta" className="relative py-32 bg-secondary overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">

        <span className="text-primary uppercase tracking-[0.3em] text-xs">
          Reserve Your Experience
        </span>

        <h2 className="font-serif text-5xl mt-6 mb-6 text-foreground">
          Create Unforgettable Moments
        </h2>

        <p className="max-w-2xl mx-auto text-muted-foreground text-lg mb-10">
          Whether it's an intimate dinner or a grand celebration, we curate
          experiences tailored to your every need.
        </p>

        {/* Reward Coupon Banner */}
        {reward && coupon && (
          <div className="max-w-md mx-auto mb-12 rounded-2xl border border-primary/30 bg-primary/5 p-5">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Gift className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">Your Reward: {reward}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <code className="bg-primary/10 text-primary font-mono text-sm px-3 py-1.5 rounded-lg tracking-wider">
                {coupon}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(coupon);
                  toast.success("Coupon copied!");
                }}
                className="text-muted-foreground hover:text-primary transition"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Use this code when making your reservation</p>
          </div>
        )}

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="rounded-3xl bg-card shadow-md p-8 border border-border/50">
            <Calendar className="mx-auto text-primary mb-4" />
            <h4 className="font-serif text-xl mb-2 text-foreground">Easy Booking</h4>
            <p className="text-muted-foreground text-sm">Reserve your table in seconds</p>
          </div>
          <div className="rounded-3xl bg-card shadow-md p-8 border border-border/50">
            <Clock className="mx-auto text-primary mb-4" />
            <h4 className="font-serif text-xl mb-2 text-foreground">Flexible Timing</h4>
            <p className="text-muted-foreground text-sm">Lunch & dinner slots available</p>
          </div>
          <div className="rounded-3xl bg-card shadow-md p-8 border border-border/50">
            <Users className="mx-auto text-primary mb-4" />
            <h4 className="font-serif text-xl mb-2 text-foreground">Private Events</h4>
            <p className="text-muted-foreground text-sm">Perfect for celebrations & gatherings</p>
          </div>
        </div>

        <button onClick={() => navigate("/reservations")} className="btn-gold px-10 py-4">
          Book Your Table
        </button>
      </div>
    </section>
  );
};

export default ReservationCTA;
