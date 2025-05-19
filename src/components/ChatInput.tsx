import { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { FaImage, FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { IconContext } from "react-icons";
import { useMessageContext } from "../context/MessageContext.tsx";
import * as React from "react";
const ChatInput = () => {
  const [textareaState, setTextareaState] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { setMessages } = useMessageContext();

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

  const handleSend = () => {
    setMessages((prevState) => [
      ...prevState,
      {
        role: "user",
        text: textareaState.trim(),
        image: imagePreview || undefined,
      },
    ]);
    setImagePreview(null);
    setTextareaState("");
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

        <button className="px-4 py-2 bg-gray-800 rounded-full cursor-pointer hover:bg-gray-800/80 active:bg-gray-800 transition-all">
          <FaImage size={20} />
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />
        </button>

        <button
          className="px-4 py-2 bg-blue-500 rounded-tr-md rounded-tl-full rounded-b-full cursor-pointer hover:border-green-200 border-1 border-blue-500 hover:text-green-200 transition-all"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </section>
  );
};

export default ChatInput;
