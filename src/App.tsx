import ChatInput from "./components/ChatInput.tsx";
import Body from "./components/Body.tsx";
import Header from "./components/Header.tsx";

const App = () => {
  return (
    <main>
      {/* HEADER */}
      <Header />

      <div className="md:px-16 px-8">
        {/* BODY */}
        <Body />

        {/* CHAT INPUT */}
        <ChatInput />
      </div>
    </main>
  );
};

export default App;
