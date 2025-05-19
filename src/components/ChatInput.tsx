import { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { IconContext } from "react-icons";
const ChatInput = () => {
  const [textareaState, setTextareaState] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  useEffect(() => {
    setTextareaState(transcript);
  }, [transcript]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.code === "Space" &&
        !listening &&
        document.activeElement !== textareaRef.current
      ) {
        SpeechRecognition.startListening({ language: "en-IN" });
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (
        event.code === "Space" &&
        listening &&
        document.activeElement !== textareaRef.current
      ) {
        SpeechRecognition.stopListening();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [listening]);

  const handleSpeechRecognition = () => {
    if (!listening) {
      SpeechRecognition.startListening({ language: "en-IN" });
    } else {
      SpeechRecognition.stopListening();
    }
  };

  return (
    <section className="fixed bottom-4 left-0 right-0 px-4">
      <div className="w-full flex gap-2 items-center justify-center backdrop-blur-xl rounded-full bg-gray-900">
        <textarea
          className="field-sizing-content w-full outline-hidden border-1 rounded-sm resize-none overflow-hidden hover:border-blue-500 focus:border-blue-400 transition-all"
          ref={textareaRef}
          value={textareaState}
          onChange={(event) => {
            setTextareaState(event.target.value);
            //   Auto adjust height
            event.target.style.height = "auto";
            event.target.style.height = `${event.target.scrollHeight}px`;
          }}
          rows={1}
        />

        {!browserSupportsSpeechRecognition && (
          <div className="p-2 border-1 border-dashed border-red-500 cursor-not-allowed">
            <IconContext.Provider value={{ color: "red" }}>
              <FaMicrophoneSlash size={20} />
            </IconContext.Provider>
          </div>
        )}

        {!isMicrophoneAvailable && (
          <div className="p-2 border-1 border-yellow-500 cursor-not-allowed">
            <IconContext.Provider value={{ color: "yellow" }}>
              <FaMicrophoneSlash size={20} />
            </IconContext.Provider>
          </div>
        )}

        {browserSupportsSpeechRecognition && isMicrophoneAvailable && (
          <button onClick={handleSpeechRecognition}>
            {listening ? (
              <div className="p-2 border-1  cursor-pointer rounded-full bg-gray-800 transition-all">
                <IconContext.Provider value={{ color: "red" }}>
                  <FaMicrophoneSlash size={20} />
                </IconContext.Provider>
              </div>
            ) : (
              <div className="p-2 border-1 border-green-500 cursor-pointer hover:border-blue-500 rounded-full">
                <FaMicrophone size={20} />
              </div>
            )}
          </button>
        )}
      </div>
    </section>
  );
};

export default ChatInput;
