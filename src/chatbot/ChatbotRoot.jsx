import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import ChatbotButton from "./ChatbotButton";
import ChatbotPanel from "./ChatbotPanel";

export default function ChatbotRoot() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <>
      <ChatbotButton />
      <ChatbotPanel />
    </>,
    document.body
  );
}
