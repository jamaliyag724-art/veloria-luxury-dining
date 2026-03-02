import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

interface EmailData {
  type: "order_confirmation" | "reservation_confirmation" | "order_status_update";
  data: Record<string, any>;
}

export const sendEmail = async ({ type, data }: EmailData): Promise<boolean> => {
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_KEY}`,
        apikey: SUPABASE_KEY,
      },
      body: JSON.stringify({ type, data }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("Email failed:", err);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Email service error:", err);
    return false;
  }
};
