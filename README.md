# Prompt Evaluation App

A web application for evaluating the effectiveness of different conversation prompts in language learning contexts.

## Features

- Two different prompts for comparison
- Text-to-speech capabilities using ElevenLabs API
- Voice recording and transcription using OpenAI Whisper
- Prompt effectiveness evaluation using OpenAI
- Real-time results dashboard

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your API keys:
   ```
   VITE_ELEVENLABS_API_KEY=your_key_here
   VITE_OPENAI_API_KEY=your_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Technologies Used

- React + TypeScript
- Vite
- Tailwind CSS
- ElevenLabs API
- OpenAI API (Whisper + GPT-4)

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
