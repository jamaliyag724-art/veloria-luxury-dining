import { useState } from "react";

export default function ChatbotRoot() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* BUTTON */}
      <div
        onClick={() => {
          console.log("CHATBOT CLICKED");
          setOpen((v) => !v);
        }}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 999999,
          background: "gold",
          color: "black",
          padding: "14px",
          borderRadius: "50%",
          cursor: "pointer",
        }}
      >
        ✦
      </div>

      {/* PANEL */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 80,
            right: 20,
            zIndex: 999999,
            width: 300,
            height: 200,
            background: "black",
            color: "white",
            padding: 16,
            borderRadius: 12,
          }}
        >
          CHATBOT PANEL OPEN  
          <br />
          <br />
          Agar ye dikh raha hai → React kaam kar raha hai.
        </div>
      )}
    </>
  );
}
