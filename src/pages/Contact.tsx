import React from "react";
import { motion } from "framer-motion";
import ContactForm from "@/components/contact/ContactForm";

const Contact = () => {
  return (
    <main className="relative z-10 pt-40 pb-40">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-28"
        >
          <span className="text-yellow-400 tracking-[0.4em] text-xs uppercase">
            Get in Touch
          </span>

          <h1 className="font-serif text-6xl md:text-7xl mt-6 mb-6 text-white leading-tight">
            Speak With Our Concierge
          </h1>

          <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mb-6" />

          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            For reservations, private events, or general inquiries,
            our team is delighted to assist you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-24 items-start">

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-transparent blur-2xl opacity-30 rounded-3xl" />
            <div className="relative bg-white/5 backdrop-blur-2xl border border-yellow-400/20 rounded-[32px] p-14 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
              <ContactForm />
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default Contact;
