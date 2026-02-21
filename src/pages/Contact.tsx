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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialForm);
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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

      setIsSubmitted(true);
      toast.success("Message sent successfully ✨");

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

  return (
    <div>
      <h2 className="font-serif text-2xl mb-3 text-foreground">
        Speak With Our Concierge
      </h2>

      <p className="text-muted-foreground mb-8 text-sm">
        We are delighted to assist you with reservations, events, or inquiries.
      </p>

      <AnimatePresence mode="wait">
        {isSubmitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-14"
          >
            <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="font-serif text-xl mb-2 text-foreground">
              Message Sent ✨
            </h3>
            <p className="text-muted-foreground text-sm">
              Our concierge team will respond shortly.
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
          >
            {/* INPUT STYLE FIXED */}
            {[
              ["name", "Full Name *"],
              ["email", "Email Address *"],
              ["phone", "Phone Number (+91)"],
            ].map(([key, label]) => (
              <input
                key={key}
                name={key}
                placeholder={label}
                value={(formData as any)[key]}
                onChange={handleChange}
                className="
                  w-full px-5 py-4 rounded-xl
                  bg-muted
                  border border-border
                  text-foreground
                  placeholder:text-muted-foreground
                  focus:border-primary
                  focus:ring-2 focus:ring-primary/20
                  transition
                "
              />
            ))}

            {/* SUBJECT */}
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="
                w-full px-5 py-4 rounded-xl
                bg-muted
                border border-border
                text-foreground
                focus:border-primary
                focus:ring-2 focus:ring-primary/20
                transition
              "
            >
              <option value="">Select a Subject *</option>
              {subjectOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* MESSAGE */}
            <textarea
              name="message"
              rows={5}
              placeholder="Your Message *"
              value={formData.message}
              onChange={handleChange}
              className="
                w-full px-5 py-4 rounded-xl
                bg-muted
                border border-border
                text-foreground
                placeholder:text-muted-foreground
                focus:border-primary
                focus:ring-2 focus:ring-primary/20
                transition
              "
            />

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                w-full mt-4 py-4 rounded-xl font-medium
                bg-primary text-primary-foreground
                hover:opacity-90 transition
              "
            >
              {isSubmitting ? "Sending..." : (
                <span className="flex items-center justify-center gap-2">
                  <Send size={18} />
                  Send Message
                </span>
              )}
            </button>

            {/* PRIVACY */}
            <p className="flex items-center justify-center gap-1.5 text-muted-foreground text-xs pt-2">
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
