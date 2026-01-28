import { useState } from "react";
import ChatbotButton from "./ChatbotButton";
import ChatbotPanel from "./ChatbotPanel";

export default function ChatbotRoot() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ChatbotButton onClick={() => setOpen(true)} />
      <ChatbotPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
}
