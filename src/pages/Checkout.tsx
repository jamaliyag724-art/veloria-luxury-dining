import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Wallet, CheckCircle, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';

const Checkout: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<'payment' | 'processing' | 'success'>('payment');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderId] = useState('VLO-' + Math.random().toString(36).substring(2, 8).toUpperCase());

  const handlePayment = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      clearCart();
    }, 2500);
  };

  if (items.length === 0 && step === 'payment') {
    navigate('/menu');
    return null;
  }

  const total = totalPrice * 1.1;

  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
          <p className="font-serif text-xl text-foreground">Processing your payment...</p>
        </motion.div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onCartClick={() => {}} />
        <main className="pt-32 pb-24">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="section-container max-w-lg mx-auto text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </motion.div>
            <h1 className="font-serif text-3xl font-medium text-foreground mb-4">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-6">Thank you for your order. Show this QR code when you arrive.</p>
            <div className="glass-card p-6 mb-6">
              <p className="text-sm text-muted-foreground mb-2">Order ID</p>
              <p className="font-serif text-2xl font-bold text-primary mb-4">{orderId}</p>
              <div className="bg-white p-4 rounded-xl inline-block">
                <QRCodeSVG value={orderId} size={150} />
              </div>
            </div>
            <button onClick={() => navigate('/')} className="btn-gold">Back to Home</button>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCartClick={() => {}} />
      <main className="pt-32 pb-24">
        <div className="section-container max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-serif text-4xl font-medium text-foreground">Checkout</h1>
          </motion.div>

          <div className="grid gap-6">
            {/* Order Summary */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
              <h2 className="font-serif text-xl font-semibold mb-4">Order Summary</h2>
              {items.map(item => (
                <div key={item.id} className="flex justify-between py-2 border-b border-border">
                  <span>{item.name} x{item.quantity}</span>
                  <span className="text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-4 font-serif text-lg font-bold">
                <span>Total (incl. tax)</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
              <h2 className="font-serif text-xl font-semibold mb-4">Payment Method</h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { id: 'card', icon: CreditCard, label: 'Card' },
                  { id: 'upi', icon: Smartphone, label: 'UPI' },
                  { id: 'wallet', icon: Wallet, label: 'Wallet' },
                ].map(method => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${paymentMethod === method.id ? 'border-primary bg-primary/10' : 'border-border'}`}
                  >
                    <method.icon className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === method.id ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-sm">{method.label}</span>
                  </button>
                ))}
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handlePayment} className="btn-gold w-full py-4">
                Pay ${total.toFixed(2)}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
