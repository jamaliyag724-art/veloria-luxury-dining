import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const animations = {
  home: {
    rotate: 360,
    duration: 3,
  },
  menu: {
    rotate: [0, 180, 360],
    duration: 1.2,
  },
  reservations: {
    rotate: 0,
    scale: [0.8, 1, 0.9],
    duration: 1,
  },
  default: {
    rotate: 360,
    duration: 2,
  },
};

const PageLoader = ({ label = "Preparing your experience" }) => {
  const { pathname } = useLocation();

  let anim = animations.default;

  if (pathname === "/") anim = animations.home;
  else if (pathname.startsWith("/menu")) anim = animations.menu;
  else if (pathname.startsWith("/reservations"))
    anim = animations.reservations;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0f0f0f]">
      <div className="text-center space-y-6">
        <motion.div
          className="w-28 h-28 rounded-full border-[3px] border-primary/40 relative mx-auto"
          animate={{ rotate: anim.rotate, scale: anim.scale }}
          transition={{
            repeat: Infinity,
            duration: anim.duration,
            ease: "linear",
          }}
        >
          <motion.div
            className="absolute top-1/2 left-1/2 w-10 h-[2px] bg-primary origin-left"
          />
        </motion.div>

        <p className="text-sm tracking-[0.3em] uppercase text-primary">
          {label}
        </p>
      </div>
    </div>
  );
};

export default PageLoader;
