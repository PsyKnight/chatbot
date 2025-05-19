import { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { FaImage, FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { IconContext } from "react-icons";
import { type MessageType, useMessage } from "../context/MessageContext.tsx";
import * as React from "react";
import { getReply } from "../utils/gemini.ts";

const ChatInput = () => {
  const [textareaState, setTextareaState] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>();
  const [loading, setLoading] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { setMessages } = useMessage();

  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  useEffect(() => {
    setTextareaState((prevState) => prevState + transcript);
  }, [listening]);

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

  const handleSend = async () => {
    setLoading(true);
    try {
      const image = imagePreview?.split(",")[1];
      const userMessage: MessageType = {
        role: "user",
        text: textareaState.trim(),
        image: image,
      };

      setMessages((prevState) => [...prevState, userMessage]);
      const botReply = await getReply(userMessage);
      setMessages((prevState) => [
        ...prevState,
        { role: "chatbot", text: botReply },
      ]);
      setImagePreview(null);
      setTextareaState("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Invalid file type. Please select an image file");
      setImagePreview(null);
    }
  };

  return (
    <section className="fixed bottom-4 left-0 right-0 px-4">
      <div className="w-full flex gap-2 items-center justify-center backdrop-blur-xl rounded-full bg-gray-900 px-4 py-2">
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

        {imagePreview && (
          <div className="w-16 h-16">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover rounded"
            />
          </div>
        )}

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

        <div className="px-4 py-2 bg-gray-800 rounded-full cursor-pointer hover:bg-gray-800/80 active:bg-gray-800 transition-all relative">
          <FaImage size={20} />
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
            onChange={handleFileChange}
          />
        </div>

        <button
          className={`px-4 py-2 ${loading ? "cursor-not-allowed" : "bg-blue-500  cursor-pointer"} border-blue-500 rounded-tr-md rounded-tl-full rounded-b-full hover:border-green-200 border-1  hover:text-green-200 transition-all`}
          disabled={loading}
          onClick={handleSend}
        >
          {loading ? (
            <img src="/loader.svg" alt="Loading..." className="w-6 right-12" />
          ) : (
            <p>Send</p>
          )}
        </button>
      </div>
    </section>
  );
};

export default ChatInput;
