import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const SEGMENTS = [
  { label: "10% Off", color: "hsl(43, 76%, 52%)", textColor: "#1a1a1a" },
  { label: "Free Dessert", color: "hsl(0, 0%, 15%)", textColor: "#D4AF37" },
  { label: "Free Drink", color: "hsl(43, 76%, 42%)", textColor: "#1a1a1a" },
  { label: "BOGO Pizza", color: "hsl(0, 0%, 20%)", textColor: "#D4AF37" },
  { label: "5% Off", color: "hsl(43, 76%, 52%)", textColor: "#1a1a1a" },
  { label: "Chef Special", color: "hsl(0, 0%, 15%)", textColor: "#D4AF37" },
];

const SEGMENT_ANGLE = 360 / SEGMENTS.length;

const SpinWheel: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const hasSpun = useRef(false);

  // Check session/localStorage
  const alreadySpun = typeof window !== "undefined" && localStorage.getItem("veloria-spin-done") === "true";

  const handleOpen = () => {
    if (!alreadySpun) setOpen(true);
  };

  const handleSpin = useCallback(() => {
    if (spinning || hasSpun.current) return;
    hasSpun.current = true;
    setSpinning(true);

    const winIndex = Math.floor(Math.random() * SEGMENTS.length);
    // Calculate rotation: multiple full spins + offset to land on segment
    const extraSpins = 5 + Math.floor(Math.random() * 3);
    const targetAngle = 360 - (winIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2);
    const totalRotation = extraSpins * 360 + targetAngle;

    setRotation(totalRotation);

    setTimeout(() => {
      setSpinning(false);
      setResult(SEGMENTS[winIndex].label);
      localStorage.setItem("veloria-spin-done", "true");
      localStorage.setItem("veloria-spin-reward", SEGMENTS[winIndex].label);

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ["#D4AF37", "#FFD700", "#B8860B", "#FFF8DC"],
      });
    }, 4500);
  }, [spinning]);

  const wheelRadius = 150;

  return (
    <>
      {/* Trigger Button */}
      {!alreadySpun && (
        <motion.button
          onClick={handleOpen}
          className="fixed bottom-24 right-6 z-50 flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
        >
          <Gift className="w-5 h-5" />
          <span className="text-sm font-semibold hidden sm:inline">Spin & Win</span>
        </motion.button>
      )}

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => !spinning && setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md rounded-3xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl p-6 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={() => !spinning && setOpen(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition"
                disabled={spinning}
              >
                <X className="w-5 h-5" />
              </button>

              {!result ? (
                <>
                  {/* Header */}
                  <div className="text-center mb-6">
                    <Sparkles className="w-6 h-6 text-primary mx-auto mb-2" />
                    <h2 className="font-serif text-2xl text-foreground">
                      Spin the Wheel
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Win a dining reward from Veloria
                    </p>
                  </div>

                  {/* Wheel */}
                  <div className="relative mx-auto" style={{ width: wheelRadius * 2 + 20, height: wheelRadius * 2 + 20 }}>
                    {/* Pointer */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10">
                      <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[18px] border-l-transparent border-r-transparent border-t-primary drop-shadow-lg" />
                    </div>

                    {/* Wheel SVG */}
                    <motion.div
                      animate={{ rotate: rotation }}
                      transition={{ duration: 4.5, ease: [0.17, 0.67, 0.12, 0.99] }}
                      className="w-full h-full"
                    >
                      <svg
                        viewBox={`0 0 ${wheelRadius * 2} ${wheelRadius * 2}`}
                        className="w-full h-full drop-shadow-xl"
                      >
                        {SEGMENTS.map((seg, i) => {
                          const startAngle = i * SEGMENT_ANGLE - 90;
                          const endAngle = startAngle + SEGMENT_ANGLE;
                          const startRad = (startAngle * Math.PI) / 180;
                          const endRad = (endAngle * Math.PI) / 180;
                          const x1 = wheelRadius + wheelRadius * Math.cos(startRad);
                          const y1 = wheelRadius + wheelRadius * Math.sin(startRad);
                          const x2 = wheelRadius + wheelRadius * Math.cos(endRad);
                          const y2 = wheelRadius + wheelRadius * Math.sin(endRad);
                          const largeArc = SEGMENT_ANGLE > 180 ? 1 : 0;

                          const midAngle = ((startAngle + endAngle) / 2) * (Math.PI / 180);
                          const textR = wheelRadius * 0.65;
                          const tx = wheelRadius + textR * Math.cos(midAngle);
                          const ty = wheelRadius + textR * Math.sin(midAngle);
                          const textRotation = (startAngle + endAngle) / 2;

                          return (
                            <g key={i}>
                              <path
                                d={`M${wheelRadius},${wheelRadius} L${x1},${y1} A${wheelRadius},${wheelRadius} 0 ${largeArc},1 ${x2},${y2} Z`}
                                fill={seg.color}
                                stroke="hsl(43,76%,52%)"
                                strokeWidth="1.5"
                              />
                              <text
                                x={tx}
                                y={ty}
                                fill={seg.textColor}
                                fontSize="11"
                                fontWeight="700"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                transform={`rotate(${textRotation}, ${tx}, ${ty})`}
                              >
                                {seg.label}
                              </text>
                            </g>
                          );
                        })}
                        {/* Center circle */}
                        <circle cx={wheelRadius} cy={wheelRadius} r="22" fill="hsl(43,76%,52%)" />
                        <circle cx={wheelRadius} cy={wheelRadius} r="18" fill="hsl(var(--card))" />
                        <text x={wheelRadius} y={wheelRadius} textAnchor="middle" dominantBaseline="middle" fill="hsl(43,76%,52%)" fontSize="10" fontWeight="800">V</text>
                      </svg>
                    </motion.div>
                  </div>

                  {/* Spin Button */}
                  <div className="mt-6 text-center">
                    <Button
                      onClick={handleSpin}
                      disabled={spinning}
                      className="px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-semibold shadow-lg shadow-primary/25"
                    >
                      {spinning ? "Spinning..." : "Spin Now"}
                    </Button>
                  </div>
                </>
              ) : (
                /* Result */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12 }}
                    className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4"
                  >
                    <Gift className="w-10 h-10 text-primary" />
                  </motion.div>

                  <h3 className="font-serif text-2xl text-foreground mb-2">
                    Congratulations!
                  </h3>
                  <p className="text-muted-foreground mb-1">You won:</p>
                  <p className="text-xl font-bold text-primary mb-6">
                    {result}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6"
                      onClick={() => setOpen(false)}
                    >
                      Claim Reward
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-full px-6"
                      onClick={() => setOpen(false)}
                    >
                      Close
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SpinWheel;
