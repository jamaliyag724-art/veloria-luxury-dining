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
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email.";
    if (formData.phone && !phoneRegex.test(formData.phone))
      newErrors.phone = "Invalid phone number.";
    if (!formData.subject) newErrors.subject = "Select a subject.";
    if (!formData.message.trim()) newErrors.message = "Message required.";

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

      toast.success("Message sent successfully ✨");
      setIsSubmitted(true);

      setTimeout(() => {
        setIsSubmitted(false);
        setFormData(initialForm);
      }, 4000);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-input border border-border rounded-xl px-5 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none transition";

  return (
    <div>
      <h2 className="font-serif text-2xl mb-8">
        Speak With Our Concierge
      </h2>

      <AnimatePresence mode="wait">
        {isSubmitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-14"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-serif text-xl mb-2">
              Message Sent ✨
            </h3>
            <p className="text-muted-foreground">
              Our concierge team will respond shortly.
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
          >
            {/* Name */}
            <input
              name="name"
              placeholder="Full Name *"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}

            {/* Email */}
            <input
              name="email"
              placeholder="Email Address *"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}

            {/* Phone */}
            <input
              name="phone"
              placeholder="Phone Number (+91)"
              value={formData.phone}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone}</p>
            )}

            {/* Subject */}
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
            {errors.subject && (
              <p className="text-sm text-destructive">{errors.subject}</p>
            )}

            {/* Message */}
            <textarea
              name="message"
              rows={5}
              placeholder="Your Message *"
              value={formData.message}
              onChange={handleChange}
              className={`${inputClass} resize-none`}
            />
            {errors.message && (
              <p className="text-sm text-destructive">{errors.message}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gold w-full py-4 flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : (
                <>
                  <Send size={18} /> Send Message
                </>
              )}
            </button>

            {/* Privacy */}
            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-2">
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
