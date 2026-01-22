import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Download, Calendar, ArrowRight } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || 'VLO-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const type = searchParams.get('type') || 'order'; // 'order' or 'reservation'
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    if (showConfetti) {
      // First burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#c9a55c', '#d4af37', '#8b7355'],
      });

      // Second burst with delay
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: ['#c9a55c', '#d4af37', '#8b7355'],
        });
      }, 200);

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: ['#c9a55c', '#d4af37', '#8b7355'],
        });
      }, 400);

      setShowConfetti(false);
    }
  }, [showConfetti]);

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCartClick={() => {}} />
      
      <main className="pt-32 pb-24">
        <div className="section-container max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="relative inline-block mb-8"
            >
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                >
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </motion.div>
              </div>
              {/* Animated rings */}
              <motion.div
                initial={{ scale: 0.8, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="absolute inset-0 w-24 h-24 rounded-full border-2 border-green-400"
              />
              <motion.div
                initial={{ scale: 0.8, opacity: 1 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 1.2, delay: 0.4 }}
                className="absolute inset-0 w-24 h-24 rounded-full border-2 border-green-300"
              />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-4"
            >
              {type === 'reservation' ? 'Reservation Confirmed!' : 'Order Confirmed!'}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground mb-8"
            >
              {type === 'reservation' 
                ? 'Your table has been reserved. Show this QR code when you arrive.'
                : 'Thank you for your order. Present this QR code to collect your order.'}
            </motion.p>

            {/* Order Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card p-8 mb-8"
            >
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-1">
                  {type === 'reservation' ? 'Reservation ID' : 'Order ID'}
                </p>
                <p className="font-serif text-2xl font-bold text-primary">{orderId}</p>
              </div>

              {/* QR Code */}
              <div className="bg-white p-6 rounded-xl inline-block shadow-soft mb-6">
                <QRCodeSVG
                  id="order-qr"
                  value={`VELORIA-${orderId}`}
                  size={180}
                  level="H"
                  includeMargin
                  fgColor="#3d3d3d"
                />
              </div>

              {/* Download Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownloadQR}
                className="w-full py-3 bg-secondary text-foreground rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-secondary/80 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download QR Code
              </motion.button>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/menu')}
                className="btn-gold group"
              >
                View Menu
                <ArrowRight className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/reservations')}
                className="btn-outline-gold flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Book Another Table
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccess;
