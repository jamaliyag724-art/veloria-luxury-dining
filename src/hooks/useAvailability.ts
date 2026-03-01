import { useState } from "react";

// table_availability table doesn't exist yet - stub hook for future use
export const useAvailability = (_date: string) => {
  const [slots] = useState<any[]>([]);
  return slots;
};
