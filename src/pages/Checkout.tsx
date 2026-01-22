import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Wallet, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
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
      // Confetti burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#c9a55c', '#d4af37', '#8b7355'],
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
        });
      }, 200);
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
        });
      }, 400);
      clearCart();
    }, 2500);
  };

  if (items.length === 0 && step === 'payment') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onCartClick={() => {}} />
        <main className="pt-32 pb-24">
          <div className="section-container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="font-serif text-3xl font-medium text-foreground mb-4">Your Cart is Empty</h1>
              <p className="text-muted-foreground mb-8">Add some delicious items from our menu</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/menu')}
                className="btn-gold"
              >
                Browse Menu
              </motion.button>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const tax = totalPrice * 0.1;
  const total = totalPrice + tax;

  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full mx-auto mb-6"
          />
          <h2 className="font-serif text-2xl font-medium text-foreground mb-2">Processing Payment</h2>
          <p className="text-muted-foreground">Please wait while we process your order...</p>
        </motion.div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onCartClick={() => {}} />
        <main className="pt-32 pb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="section-container max-w-lg mx-auto text-center"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="relative inline-block mb-6"
            >
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <motion.div
                initial={{ scale: 0.8, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 w-24 h-24 rounded-full border-2 border-green-400"
              />
            </motion.div>

            <h1 className="font-serif text-3xl font-medium text-foreground mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-8">Thank you for your order. Show this QR code when you arrive.</p>
            
            <div className="glass-card p-6 mb-8">
              <p className="text-sm text-muted-foreground mb-2">Order ID</p>
              <p className="font-serif text-2xl font-bold text-primary mb-6">{orderId}</p>
              <div className="bg-white p-4 rounded-xl inline-block shadow-soft">
                <QRCodeSVG value={`VELORIA-${orderId}`} size={150} level="H" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/menu')}
                className="btn-gold"
              >
                Order More
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="btn-outline-gold"
              >
                Back to Home
              </motion.button>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCartClick={() => {}} />
      <main className="pt-24 pb-24">
        <div className="section-container max-w-3xl mx-auto">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/menu')}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Menu
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-serif text-3xl md:text-4xl font-medium text-foreground">Checkout</h1>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-3 glass-card p-6"
            >
              <h2 className="font-serif text-xl font-semibold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-border">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-serif font-semibold text-primary">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-border font-serif text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 glass-card p-6"
            >
              <h2 className="font-serif text-xl font-semibold mb-6">Payment Method</h2>
              <div className="space-y-3 mb-6">
                {[
                  { id: 'card', icon: CreditCard, label: 'Credit/Debit Card' },
                  { id: 'upi', icon: Smartphone, label: 'UPI' },
                  { id: 'wallet', icon: Wallet, label: 'Digital Wallet' },
                ].map((method) => (
                  <motion.button
                    key={method.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      paymentMethod === method.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <method.icon
                      className={`w-5 h-5 ${
                        paymentMethod === method.id ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    />
                    <span className={paymentMethod === method.id ? 'text-foreground' : 'text-muted-foreground'}>
                      {method.label}
                    </span>
                  </motion.button>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePayment}
                className="btn-gold w-full py-4"
              >
                Pay ${total.toFixed(2)}
              </motion.button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                This is a demo checkout. No actual payment will be processed.
              </p>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
