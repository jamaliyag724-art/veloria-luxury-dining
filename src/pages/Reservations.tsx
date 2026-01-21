import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Clock, Users, CheckCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartModal from '@/components/cart/CartModal';
import { useReservations } from '@/context/ReservationContext';

const Reservations: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderId, setOrderId] = useState('');
  const { addReservation } = useReservations();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    address: '',
    location: '',
    pincode: '',
    guests: 2,
    date: '',
    time: '',
    specialRequest: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = addReservation(formData);
    setOrderId(id);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onCartClick={() => setIsCartOpen(true)} />
        <main className="pt-32 pb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="section-container max-w-lg mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-green-600" />
            </motion.div>
            <h1 className="font-serif text-3xl font-medium text-foreground mb-4">
              Reservation Confirmed!
            </h1>
            <p className="text-muted-foreground mb-6">
              Your table has been reserved. We look forward to welcoming you.
            </p>
            <div className="glass-card p-6 mb-6">
              <p className="text-sm text-muted-foreground">Reservation ID</p>
              <p className="font-serif text-2xl font-bold text-primary">{orderId}</p>
            </div>
            <button onClick={() => navigate('/')} className="btn-gold">
              Back to Home
            </button>
          </motion.div>
        </main>
        <Footer />
        <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCartClick={() => setIsCartOpen(true)} />
      <main className="pt-32 pb-24">
        <div className="section-container max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <span className="text-primary font-medium tracking-wider text-sm uppercase">Book a Table</span>
            <h1 className="font-serif text-4xl md:text-5xl font-medium text-foreground mt-4 mb-4">Make a Reservation</h1>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="glass-card p-8 space-y-6"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <input name="fullName" placeholder="Full Name" required className="luxury-input" onChange={handleChange} />
              <input name="email" type="email" placeholder="Email" required className="luxury-input" onChange={handleChange} />
              <input name="mobile" placeholder="Mobile Number" required className="luxury-input" onChange={handleChange} />
              <input name="location" placeholder="City" required className="luxury-input" onChange={handleChange} />
              <input name="address" placeholder="Address" required className="luxury-input" onChange={handleChange} />
              <input name="pincode" placeholder="Pincode" required className="luxury-input" onChange={handleChange} />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select name="guests" className="luxury-input pl-10" onChange={handleChange} defaultValue="2">
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Guest{n>1?'s':''}</option>)}
                </select>
              </div>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input name="date" type="date" required className="luxury-input pl-10" onChange={handleChange} />
              </div>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input name="time" type="time" required className="luxury-input pl-10" onChange={handleChange} />
              </div>
            </div>
            <textarea name="specialRequest" placeholder="Special Requests (optional)" rows={3} className="luxury-input" onChange={handleChange} />
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn-gold w-full py-4">
              Confirm Reservation
            </motion.button>
          </motion.form>
        </div>
      </main>
      <Footer />
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default Reservations;
