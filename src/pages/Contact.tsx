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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name.trim()) newErrors.name = "Full name required";
    if (!formData.email.trim()) newErrors.email = "Email required";
    else if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email";
    if (formData.phone && !phoneRegex.test(formData.phone))
      newErrors.phone = "Invalid phone";
    if (!formData.subject) newErrors.subject = "Select subject";
    if (!formData.message.trim()) newErrors.message = "Message required";
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
      toast.success("Message sent ✨");
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

  const inputStyle =
    "w-full rounded-xl px-5 py-3 bg-white dark:bg-white/5 border border-zinc-300 dark:border-white/10 text-zinc-800 dark:text-white placeholder:text-zinc-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition";

  return (
    <div>
      <h2 className="font-serif text-2xl mb-8">
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
            <h3 className="font-serif text-xl mb-2">
              Message Sent ✨
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400">
              Our concierge team will respond shortly.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <input
              name="name"
              placeholder="Full Name *"
              value={formData.name}
              onChange={handleChange}
              className={inputStyle}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

            <input
              name="email"
              placeholder="Email Address *"
              value={formData.email}
              onChange={handleChange}
              className={inputStyle}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

            <input
              name="phone"
              placeholder="Phone Number (+91)"
              value={formData.phone}
              onChange={handleChange}
              className={inputStyle}
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={inputStyle}
            >
              <option value="">Select a Subject *</option>
              {subjectOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.subject && <p className="text-red-500 text-sm">{errors.subject}</p>}

            <textarea
              name="message"
              rows={5}
              placeholder="Your Message *"
              value={formData.message}
              onChange={handleChange}
              className={`${inputStyle} resize-none`}
            />
            {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-medium shadow-md hover:shadow-lg transition disabled:opacity-50"
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
