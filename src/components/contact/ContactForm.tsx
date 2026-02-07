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
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required.";
    else if (formData.name.trim().length > 100) newErrors.name = "Name is too long.";

    if (!formData.email.trim()) newErrors.email = "Email address is required.";
    else if (!emailRegex.test(formData.email.trim())) newErrors.email = "Please enter a valid email.";

    if (formData.phone.trim() && !phoneRegex.test(formData.phone.trim()))
      newErrors.phone = "Enter a valid Indian phone number.";

    if (!formData.subject) newErrors.subject = "Please select a subject.";

    if (!formData.message.trim()) newErrors.message = "Message cannot be empty.";
    else if (formData.message.trim().length > 1000) newErrors.message = "Message is too long (max 1000 chars).";

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

  const fieldClass = (field: keyof FormData) =>
    `luxury-input ${errors[field] ? "!border-accent ring-1 ring-accent/30" : ""}`;

  return (
    <div className="glass-card p-10 rounded-3xl">
      <h2 className="font-serif text-2xl mb-8">Speak With Our Concierge</h2>

      <AnimatePresence mode="wait">
        {isSubmitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-14"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
              className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5"
            >
              <CheckCircle className="w-10 h-10 text-primary" />
            </motion.div>
            <h3 className="font-serif text-xl mb-2">Message Sent ✨</h3>
            <p className="text-muted-foreground">
              Our concierge team will respond to you shortly.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Name */}
            <div>
              <input
                name="name"
                placeholder="Full Name *"
                value={formData.name}
                onChange={handleChange}
                maxLength={100}
                className={fieldClass("name")}
              />
              {errors.name && <p className="text-accent text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <input
                name="email"
                type="email"
                placeholder="Email Address *"
                value={formData.email}
                onChange={handleChange}
                maxLength={255}
                className={fieldClass("email")}
              />
              {errors.email && <p className="text-accent text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <input
                name="phone"
                placeholder="Phone Number (+91)"
                value={formData.phone}
                onChange={handleChange}
                className={fieldClass("phone")}
              />
              {errors.phone && <p className="text-accent text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Subject */}
            <div>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`${fieldClass("subject")} cursor-pointer`}
              >
                <option value="">Select a Subject *</option>
                {subjectOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.subject && <p className="text-accent text-xs mt-1">{errors.subject}</p>}
            </div>

            {/* Message */}
            <div>
              <textarea
                name="message"
                rows={5}
                placeholder="Your Message *"
                value={formData.message}
                onChange={handleChange}
                maxLength={1000}
                className={`${fieldClass("message")} resize-none`}
              />
              <div className="flex justify-between">
                {errors.message && <p className="text-accent text-xs mt-1">{errors.message}</p>}
                <span className="text-muted-foreground text-xs ml-auto">
                  {formData.message.length}/1000
                </span>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={isSubmitting ? {} : { scale: 1.03 }}
              whileTap={isSubmitting ? {} : { scale: 0.97 }}
              className="btn-gold w-full py-4 flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="inline-block w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                  />
                  Sending…
                </span>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                </>
              )}
            </motion.button>

            {/* Privacy note */}
            <p className="flex items-center justify-center gap-1.5 text-muted-foreground text-xs text-center pt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              We respect your privacy. Your information is never shared.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactForm;
