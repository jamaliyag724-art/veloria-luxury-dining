import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export default function ChatbotPortal({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      id="veloria-chatbot-root"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        pointerEvents: "none", // 👈 key
      }}
    >
      <div style={{ pointerEvents: "auto" }}>
        {children}
      </div>
    </div>,
    document.body
  );
}
