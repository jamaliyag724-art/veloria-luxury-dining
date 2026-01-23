import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Wallet, ArrowLeft, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrderContext';
import CartModal from '@/components/cart/CartModal';
import { z } from 'zod';

// Validation schema
const checkoutSchema = z.object({
  fullName: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Invalid email address'),
  mobile: z.string().trim().regex(/^[6-9]\d{9}$/, 'Invalid mobile number (10 digits starting with 6-9)'),
  address: z.string().trim().min(5, 'Address must be at least 5 characters').max(200),
  city: z.string().trim().min(2, 'City must be at least 2 characters').max(50),
  pincode: z.string().trim().regex(/^\d{6}$/, 'Invalid pincode (6 digits)'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const Checkout: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { addOrder } = useOrders();
  const navigate = useNavigate();
  const [step, setStep] = useState<'payment' | 'processing' | 'success'>('payment');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cartOpen, setCartOpen] = useState(false);
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    email: '',
    mobile: '',
    address: '',
    city: '',
    pincode: '',
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof CheckoutFormData, boolean>>>({});

  const validateField = (field: keyof CheckoutFormData, value: string) => {
    try {
      checkoutSchema.shape[field].parse(value);
      setErrors(prev => ({ ...prev, [field]: undefined }));
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [field]: err.errors[0].message }));
      }
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name as keyof CheckoutFormData]) {
      validateField(name as keyof CheckoutFormData, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name as keyof CheckoutFormData, value);
  };

  const isFormValid = (): boolean => {
    const result = checkoutSchema.safeParse(formData);
    return result.success && items.length > 0;
  };

  const handlePayment = () => {
    // Validate all fields
    const result = checkoutSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {};
      result.error.errors.forEach(err => {
        const field = err.path[0] as keyof CheckoutFormData;
        newErrors[field] = err.message;
      });
      setErrors(newErrors);
      setTouched({
        fullName: true,
        email: true,
        mobile: true,
        address: true,
        city: true,
        pincode: true,
      });
      return;
    }

    setStep('processing');
    setTimeout(() => {
      // Create order
      const tax = totalPrice * 0.1;
      const orderId = addOrder({
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal: totalPrice,
        tax: tax,
        totalAmount: totalPrice + tax,
      });

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
      navigate(`/order-success/${orderId}`);
    }, 2500);
  };

  if (items.length === 0 && step === 'payment') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onCartClick={() => setCartOpen(true)} />
        <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />
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

  const inputClass = (field: keyof CheckoutFormData) => 
    `luxury-input ${touched[field] && errors[field] ? 'border-destructive ring-2 ring-destructive/20' : ''}`;
  return (
    <div className="min-h-screen bg-background">
      <Navbar onCartClick={() => setCartOpen(true)} />
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <main className="pt-24 pb-24">
        <div className="section-container max-w-5xl mx-auto">
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

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Customer Details Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 glass-card p-6"
            >
              <h2 className="font-serif text-xl font-semibold mb-6">Delivery Details</h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="John Doe"
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
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="john@example.com"
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
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="9876543210"
                    maxLength={10}
                    className={inputClass('mobile')}
                  />
                  {touched.mobile && errors.mobile && (
                    <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.mobile}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Mumbai"
                    className={inputClass('city')}
                  />
                  {touched.city && errors.city && (
                    <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.city}
                    </p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="123 Main Street, Apartment 4B"
                    className={inputClass('address')}
                  />
                  {touched.address && errors.address && (
                    <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.address}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="400001"
                    maxLength={6}
                    className={inputClass('pincode')}
                  />
                  {touched.pincode && errors.pincode && (
                    <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.pincode}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <h2 className="font-serif text-xl font-semibold mb-4 pt-4 border-t border-border">Order Summary</h2>
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 pb-3 border-b border-border/50">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ₹{item.price.toFixed(2)}</p>
                    </div>
                    <p className="font-serif font-semibold text-primary">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-border font-serif text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6 h-fit"
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
                whileHover={isFormValid() ? { scale: 1.02 } : {}}
                whileTap={isFormValid() ? { scale: 0.98 } : {}}
                onClick={handlePayment}
                disabled={!isFormValid()}
                className={`w-full py-4 rounded-full font-medium transition-all ${
                  isFormValid()
                    ? 'btn-gold'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                {isFormValid() ? `Pay ₹${total.toFixed(2)}` : 'Fill All Fields to Pay'}
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
