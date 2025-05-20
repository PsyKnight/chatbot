import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient(import.meta.env.VITE_HUGGINGFACE_API_KEY);

export const generateImage = async (text: string) => {
  try {
    const image = await client.textToImage({
      provider: "replicate",
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      inputs: text,
    });
    if (!image) throw new Error("No response from huggingface");

    return image;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data from huggingface");
  }
};

export const generateAudio = async (text: string) => {
  try {
    const audio = await client.textToSpeech({
      provider: "fal-ai",
      model: "hexgrad/Kokoro-82M",
      inputs: text,
    });
    if (!audio) throw new Error("No response from huggingface");

    return audio;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch data from huggingface");
  }
};
