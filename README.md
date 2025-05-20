# ChatBot Project

## Overview

This project is a React-based chatbot application that leverages the Gemini API for generating conversational responses and the Hugging Face API for generating images and audio based on user input. It features a clean and responsive user interface with speech recognition capabilities.

## Features

-   **Real-time Chat:** Engage in dynamic conversations with the chatbot.
-   **Gemini API Integration:** Utilizes the Gemini API to generate intelligent and context-aware responses.
-   **Hugging Face API Integration:**
    - Generates images from text prompts
    - Converts text to speech for audio playback
-   **Speech Recognition:** Supports voice input using `react-speech-recognition` library.
-   **Image Upload:** Allows users to upload images as part of their messages.
-   **Markdown Support:** Renders chatbot responses in Markdown format using `react-markdown`.
-   **Responsive Design:** Provides a seamless user experience across various devices.

## Technologies Used

-   React
-   TypeScript
-   Tailwind CSS
-   react-speech-recognition
-   react-icons
-   react-markdown
-   remark-gfm
-   @google/generative-ai
-   @huggingface/inference
-   dotenv

## Setup

### Prerequisites

-   Node.js (>=18)
-   npm (>=8)
-   WebStorm or any other IDE

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/PsyKnight/chatbot
    ```

2.  Navigate to the project directory:

    ```bash
    cd chatbot
    ```

3.  Install dependencies:

    ```bash
    npm install
    ```

4.  Create a `.env` file in the root directory and add your API keys:

    ```dotenv
    VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    VITE_HUGGINGFACE_API_KEY=YOUR_HUGGINGFACE_API_KEY
    ```

    Replace `YOUR_GEMINI_API_KEY` and `YOUR_HUGGINGFACE_API_KEY` with your actual API keys.

### Running the Application

```bash
npm run dev