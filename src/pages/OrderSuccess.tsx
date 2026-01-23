import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Clock, ChefHat, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useOrders } from '@/context/OrderContext';
import CartModal from '@/components/cart/CartModal';

const OrderSuccess: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { getOrderById } = useOrders();
  const [cartOpen, setCartOpen] = useState(false);
  
  const order = orderId ? getOrderById(orderId) : undefined;

  const handleDownloadQR = () => {
    const svg = document.getElementById('order-qr');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `veloria-${orderId}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onCartClick={() => setCartOpen(true)} />
        <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        <main className="pt-32 pb-24">
          <div className="section-container text-center">
            <h1 className="font-serif text-3xl font-medium text-foreground mb-4">Order Not Found</h1>
            <p className="text-muted-foreground mb-8">The order you're looking for doesn't exist.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/menu')}
              className="btn-gold"
            >
              Browse Menu
            </motion.button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (order.orderStatus) {
      case 'Preparing':
        return <ChefHat className="w-6 h-6" />;
      case 'Completed':
        return <CheckCircle className="w-6 h-6" />;
      default:
        return <Clock className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCartClick={() => setCartOpen(true)} />
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <main className="pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="section-container max-w-2xl mx-auto text-center"
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
          <p className="text-muted-foreground mb-8">Your order is confirmed & being prepared</p>
          
          <div className="glass-card p-6 mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Package className="w-5 h-5 text-primary" />
              <p className="text-sm text-muted-foreground">Order ID</p>
            </div>
            <p className="font-serif text-3xl font-bold text-primary mb-6">{order.orderId}</p>
            
            <div className="bg-white p-4 rounded-xl inline-block shadow-soft mb-4">
              <QRCodeSVG id="order-qr" value={`VELORIA-${order.orderId}`} size={150} level="H" />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownloadQR}
              className="w-full max-w-xs mx-auto py-2 bg-secondary text-foreground rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-secondary/80 transition-colors mb-6"
            >
              <Download className="w-4 h-4" />
              Download QR Code
            </motion.button>

            {/* Order Status */}
            <div className="flex items-center justify-center gap-2 p-3 bg-primary/10 rounded-xl mb-6">
              {getStatusIcon()}
              <span className="font-medium text-primary">{order.orderStatus}</span>
            </div>

            {/* Order Items */}
            <div className="text-left border-t border-border pt-4">
              <h3 className="font-serif font-semibold mb-3">Order Summary</h3>
              <div className="space-y-2 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm border-t border-border pt-2">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>₹{order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-serif font-bold text-lg pt-2 border-t border-border mt-2">
                <span>Total</span>
                <span className="text-primary">₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="text-left border-t border-border pt-4 mt-4">
              <h3 className="font-serif font-semibold mb-3">Delivery Details</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><span className="text-foreground font-medium">{order.fullName}</span></p>
                <p>{order.address}</p>
                <p>{order.city} - {order.pincode}</p>
                <p>{order.mobile}</p>
                <p>{order.email}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/menu')}
              className="btn-gold"
            >
          {/* Action Buttons */}
<div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => navigate('/menu')}
    className="btn-gold"
  >
    Order More
  </motion.button>

  <Link to={`/track-order?orderId=${order.orderId}`}>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="btn-outline-gold w-full"
    >
      Track Your Order
    </motion.button>
  </Link>

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
};

export default OrderSuccess;
