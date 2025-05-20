import Message from "./Message.tsx";
import { useMessage } from "../context/MessageContext.tsx";

const Body = () => {
  const { messages } = useMessage();
  return (
    <section className="h-[calc(75vh)] lg:mx-12 md:mx-6 overflow-y-auto relative flex flex-col gap-2">
      {messages.map((message, index) => (
        <Message
          key={`${index}-${message.text.length}`}
          role={message.role}
          text={message.text}
          image={message.image}
        />
      ))}
    </section>
  );
};

export default Body;
