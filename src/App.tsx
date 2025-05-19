import ChatInput from "./components/ChatInput.tsx";
import Body from "./components/Body.tsx";
import Header from "./components/Header.tsx";

const App = () => {
  return (
    <main>
      {/* HEADER */}
      <Header />

      {/* BODY */}
      <Body />

      {/* CHAT INPUT */}
      <ChatInput />
    </main>
  );
};

export default App;
