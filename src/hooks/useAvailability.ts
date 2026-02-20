import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAvailability = (date: string) => {
  const [slots, setSlots] = useState<any[]>([]);

  const fetchSlots = async () => {
    if (!date) return;

    const { data } = await supabase
      .from("table_availability")
      .select("*")
      .eq("date", date)
      .order("time_slot");

    setSlots(data || []);
  };

  useEffect(() => {
    fetchSlots();

    const channel = supabase
      .channel("availability-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "table_availability" },
        fetchSlots
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [date]);

  return slots;
};
