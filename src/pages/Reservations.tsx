import React, { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock, Users, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useReservations } from "@/context/ReservationContext";
import CartModal from "@/components/cart/CartModal";
import { z } from "zod";

// Validation schema
const reservationSchema = z.object({
  fullName: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Invalid email address'),
  mobile: z.string().trim().regex(/^[6-9]\d{9}$/, 'Invalid mobile number (10 digits starting with 6-9)'),
  guests: z.number().min(1).max(20),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  specialRequest: z.string().max(500).optional(),
});

type ReservationFormData = z.infer<typeof reservationSchema>;

const Reservations = () => {
  const navigate = useNavigate();
  const { addReservation } = useReservations();
  const [cartOpen, setCartOpen] = useState(false);

  const [formData, setFormData] = useState<ReservationFormData>({
    fullName: "",
    email: "",
    mobile: "",
    guests: 2,
    date: "",
    time: "",
    specialRequest: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ReservationFormData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ReservationFormData, boolean>>>({});

  const validateField = (field: keyof ReservationFormData, value: string | number) => {
    try {
      const fieldSchema = reservationSchema.shape[field];
      fieldSchema.parse(value);
      setErrors(prev => ({ ...prev, [field]: undefined }));
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [field]: err.errors[0].message }));
      }
      return false;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const parsedValue = name === 'guests' ? parseInt(value) : value;
    setFormData({ ...formData, [name]: parsedValue });
    if (touched[name as keyof ReservationFormData]) {
      validateField(name as keyof ReservationFormData, parsedValue);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const parsedValue = name === 'guests' ? parseInt(value) : value;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name as keyof ReservationFormData, parsedValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = reservationSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Partial<Record<keyof ReservationFormData, string>> = {};
      result.error.errors.forEach(err => {
        const field = err.path[0] as keyof ReservationFormData;
        newErrors[field] = err.message;
      });
      setErrors(newErrors);
      setTouched({
        fullName: true,
        email: true,
        mobile: true,
        guests: true,
        date: true,
        time: true,
      });
      return;
    }

    const id = addReservation({
      fullName: formData.fullName,
      email: formData.email,
      mobile: formData.mobile,
      guests: formData.guests,
      date: formData.date,
      time: formData.time,
      specialRequest: formData.specialRequest,
    });
    navigate(`/reservation-success/${id}`);
  };

  const inputClass = (field: keyof ReservationFormData) => 
    `luxury-input ${touched[field] && errors[field] ? 'border-destructive ring-2 ring-destructive/20' : ''}`;

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/main.webp)" }}
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <Navbar onCartClick={() => setCartOpen(true)} />
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <main className="relative z-10 pt-36 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto bg-white/95 backdrop-blur-xl rounded-[32px] p-10 shadow-2xl mx-4"
        >
          <div className="text-center mb-10">
            <span className="text-primary uppercase tracking-widest text-sm">
              Book a Table
            </span>
            <h1 className="font-serif text-4xl mt-3 text-foreground">
              Make a Reservation
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Full Name *</label>
                <input 
                  name="fullName" 
                  placeholder="John Doe" 
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass('fullName')} 
                />
                {touched.fullName && errors.fullName && (
                  <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.fullName}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email *</label>
                <input 
                  name="email" 
                  type="email" 
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass('email')} 
                />
                {touched.email && errors.email && (
                  <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.email}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Mobile Number *</label>
                <input 
                  name="mobile" 
                  placeholder="9876543210"
                  maxLength={10}
                  value={formData.mobile}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass('mobile')} 
                />
                {touched.mobile && errors.mobile && (
                  <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.mobile}
                  </p>
                )}
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-foreground mb-1">Guests *</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <select 
                    name="guests" 
                    value={formData.guests}
                    onChange={handleChange}
                    className="luxury-input pl-10"
                  >
                    {[1,2,3,4,5,6,7,8,10,12,15,20].map(n => (
                      <option key={n} value={n}>{n} Guest{n > 1 && "s"}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-foreground mb-1">Date *</label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input 
                    type="date" 
                    name="date" 
                    min={today}
                    value={formData.date}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${inputClass('date')} pl-10`}
                  />
                </div>
                {touched.date && errors.date && (
                  <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.date}
                  </p>
                )}
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-foreground mb-1">Time *</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input 
                    type="time" 
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${inputClass('time')} pl-10`}
                  />
                </div>
                {touched.time && errors.time && (
                  <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.time}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Special Requests (optional)</label>
              <textarea
                name="specialRequest"
                placeholder="Any dietary requirements, allergies, or special occasions..."
                className="luxury-input"
                rows={3}
                value={formData.specialRequest}
                onChange={handleChange}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="btn-gold w-full py-4 text-lg"
            >
              Confirm Reservation
            </motion.button>

            <p className="text-center text-sm text-muted-foreground">
              Already have a reservation?{' '}
              <button
                type="button"
                onClick={() => navigate('/reservation-status')}
                className="text-primary hover:underline font-medium"
              >
                Check Status
              </button>
            </p>
          </form>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Reservations;
