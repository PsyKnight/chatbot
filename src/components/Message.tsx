import { IconContext } from "react-icons";
import { FaUserCircle } from "react-icons/fa";
import { RiRobot3Line } from "react-icons/ri";
import type { MessageType } from "../context/MessageContext.tsx";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { generateAudio, generateImage } from "../utils/huggingface.ts";
import { useState } from "react";

const Message = ({ role, text, image }: MessageType) => {
  const [imageUrl, setImageUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateAudio = async () => {
    setLoading(true);
    try {
      const audioBlob = await generateAudio(text);
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    setLoading(true);
    try {
      const imageBlob = await generateImage(text);

      // @ts-ignore
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imageUrl);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div
        className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`bg-blue-800 p-2 max-w-[50vw] rounded-2xl inline-block ${role === "user" ? `rounded-tr-sm` : `rounded-tl-sm right-0`}`}
        >
          <div className="flex gap-2">
            {role === "chatbot" && (
              <RiRobot3Line size={20} className="min-w-12" />
            )}
            {role === "user" && (
              <IconContext.Provider value={{ color: "white" }}>
                <FaUserCircle size={20} />
              </IconContext.Provider>
            )}
            <div className="markdown-body">
              <Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>
            </div>
          </div>
          {image && <img src={image} alt="image" />}
          {role === "chatbot" && imageUrl && (
            <img src={imageUrl} alt="generated image" />
          )}
          {role === "chatbot" && audioUrl && (
            <audio controls src={audioUrl} autoPlay>
              Your browser do not support audio element
            </audio>
          )}
        </div>
      </div>
      {role === "chatbot" && (
        <button
          className="p-2 hover:font-bold hover:text-blue-400 active:text-sm transition-all"
          onClick={handleGenerateAudio}
          disabled={loading}
        >
          Generate Audio
        </button>
      )}
      {role === "chatbot" && (
        <button
          className="p-2 hover:font-bold hover:text-blue-400 active:text-sm transition-all"
          onClick={handleGenerateImage}
          disabled={loading}
        >
          Generate Image
        </button>
      )}
    </div>
  );
};

export default Message;
