import ChatbotButton from "./ChatbotButton";
import ChatbotPanel from "./ChatbotPanel";
import ChatbotPortal from "./ChatbotPortal";

export default function ChatbotRoot() {
  return (
    <ChatbotPortal>
      <ChatbotButton />
      <ChatbotPanel />
    </ChatbotPortal>
  );
}
