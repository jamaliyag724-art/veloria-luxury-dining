import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";

const subjectOptions = [
  { value: "general", label: "General Inquiry" },
  { value: "reservation", label: "Reservation Issue" },
  { value: "events", label: "Private Events" },
  { value: "order", label: "Order Support" },
  { value: "feedback", label: "Feedback / Complaint" },
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const initialForm: FormData = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSubmitting(true);
    try {
      await emailjs.sendForm(
        "service_bf3fnya",
        "template_3jb6ome",
        formRef.current,
        "yvWssWWx94ibEP33n"
      );
      toast.success("Message sent successfully ✨");
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData(initialForm);
      }, 4000);
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl px-5 py-3 bg-white dark:bg-white/5 border border-zinc-300 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all duration-300";

  return (
    <div>
      <h2 className="font-serif text-2xl mb-8 text-zinc-900 dark:text-white">
        Speak With Our Concierge
      </h2>

      <AnimatePresence mode="wait">
        {isSubmitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-14"
          >
            <div className="w-20 h-20 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-10 h-10 text-yellow-500" />
            </div>
            <h3 className="font-serif text-xl mb-2 text-zinc-900 dark:text-white">
              Message Sent ✨
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400">
              Our concierge team will respond shortly.
            </p>
          </motion.div>
        ) : (
          <motion.form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <input
              name="name"
              placeholder="Full Name *"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
            />

            <input
              name="email"
              type="email"
              placeholder="Email Address *"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
            />

            <input
              name="phone"
              placeholder="Phone Number (+91)"
              value={formData.phone}
              onChange={handleChange}
              className={inputClass}
            />

            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select a Subject *</option>
              {subjectOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <textarea
              name="message"
              rows={5}
              placeholder="Your Message *"
              value={formData.message}
              onChange={handleChange}
              className={`${inputClass} resize-none`}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-medium shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : (
                <>
                  <Send className="inline w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </button>

            <p className="flex items-center justify-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
              <ShieldCheck size={14} />
              Your information is kept private and secure.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactForm;
