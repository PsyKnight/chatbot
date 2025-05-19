import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useState,
} from "react";

export interface MessageType {
  role: "user" | "chatbot";
  text: string;
  image?: string | null;
}

interface MessageContextType {
  messages: MessageType[];
  setMessages: Dispatch<SetStateAction<MessageType[]>>;
}

export const MessageContext = createContext<MessageContextType | null>(null);

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);

  return (
    <MessageContext.Provider value={{ messages, setMessages }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessage must be used inside MessageProvider");
  }

  return context;
};
