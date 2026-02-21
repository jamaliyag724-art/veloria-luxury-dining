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

const phoneRegex = /^(\+91[\s-]?)?[6-9]\d{9}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const inputStyle =
    "w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/40 transition-all duration-300";

  const errorStyle =
    "border-red-400 focus:border-red-400 focus:ring-red-400/40";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required.";
    if (!formData.email.trim()) newErrors.email = "Email address is required.";
    else if (!emailRegex.test(formData.email.trim()))
      newErrors.email = "Please enter a valid email.";
    if (formData.phone.trim() && !phoneRegex.test(formData.phone.trim()))
      newErrors.phone = "Enter a valid Indian phone number.";
    if (!formData.subject)
      newErrors.subject = "Please select a subject.";
    if (!formData.message.trim())
      newErrors.message = "Message cannot be empty.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !formRef.current) return;

    setIsSubmitting(true);

    try {
      await emailjs.sendForm(
        "service_bf3fnya",
        "template_3jb6ome",
        formRef.current,
        "yvWssWWx94ibEP33n"
      );

      setIsSubmitted(true);
      toast.success("Message sent successfully ✨");

      setTimeout(() => {
        setIsSubmitted(false);
        setFormData(initialForm);
        setErrors({});
      }, 4000);
    } catch {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12">
      <div>
        <h2 className="font-serif text-3xl mb-6 relative inline-block">
  <span className="relative z-10">
    Speak With Our Concierge
  </span>
        <p className="text-sm text-zinc-400">
          We are delighted to assist you with reservations, events, or inquiries.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {isSubmitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-yellow-400/10 border border-yellow-400/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-yellow-400" />
            </div>
            <h3 className="font-serif text-xl text-white mb-2">
              Message Sent Successfully
            </h3>
            <p className="text-zinc-400 text-sm">
              Our team will respond to you shortly.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div>
              <input
                name="name"
                placeholder="Full Name *"
                value={formData.name}
                onChange={handleChange}
                className={`${inputStyle} ${errors.name ? errorStyle : ""}`}
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <input
                name="email"
                type="email"
                placeholder="Email Address *"
                value={formData.email}
                onChange={handleChange}
                className={`${inputStyle} ${errors.email ? errorStyle : ""}`}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                name="phone"
                placeholder="Phone Number (+91)"
                value={formData.phone}
                onChange={handleChange}
                className={`${inputStyle} ${errors.phone ? errorStyle : ""}`}
              />
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`${inputStyle} cursor-pointer ${
                  errors.subject ? errorStyle : ""
                }`}
              >
                <option value="">Select a Subject *</option>
                {subjectOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.subject && (
                <p className="text-red-400 text-xs mt-1">{errors.subject}</p>
              )}
            </div>

            <div>
              <textarea
                name="message"
                rows={5}
                placeholder="Your Message *"
                value={formData.message}
                onChange={handleChange}
                className={`${inputStyle} resize-none ${
                  errors.message ? errorStyle : ""
                }`}
              />
              {errors.message && (
                <p className="text-red-400 text-xs mt-1">{errors.message}</p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={isSubmitting ? {} : { scale: 1.02 }}
              whileTap={isSubmitting ? {} : { scale: 0.98 }}
              className="w-full py-4 rounded-xl font-medium text-sm tracking-wide bg-yellow-400 text-black hover:bg-yellow-300 transition-all duration-300 disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </motion.button>

            <p className="flex items-center justify-center gap-1.5 text-zinc-500 text-xs text-center pt-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Your information is kept private and secure.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactForm;
