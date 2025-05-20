import { useState, useEffect } from 'react';
import PromptCard from './components/PromptCard';
import ResultsDashboard from './components/ResultsDashboard';
import './styles/main.css';

import { OpenAI } from "openai";
const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true 
});

interface EvaluationResult {
  responseLength: number;
  lexicalRichness: number;
  topicRelevance: number;
}

function App() {
  const [prompt1Results, setPrompt1Results] = useState<EvaluationResult | null>(null);
  const [prompt2Results, setPrompt2Results] = useState<EvaluationResult | null>(null);
  const [prompt1Audio, setPrompt1Audio] = useState<string | null>(null);
  const [prompt2Audio, setPrompt2Audio] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const prompts = {
    prompt1: "What did you do on the weekend?",
    prompt2: "Weekends are a great time to relax or do something fun! Did you get up to anything interesting this past weekend? Perhaps you met friends, tried a new hobby, or just chilled at home?"
  };

  // Function to generate speech from text using ElevenLabs
  async function generateSpeech(text: string): Promise<string> {
    try {
      const voiceId = "21m00Tcm4TlvDq8ikWAM"; // Default voice ID
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': import.meta.env.VITE_ELEVENLABS_API_KEY
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.5
            }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          `ElevenLabs API error: ${response.status} ${response.statusText}\n${JSON.stringify(errorData, null, 2)}`
        );
      }

      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error('Error generating speech:', error);
      throw error;
    }
  }

  // Generate audio for prompts on component mount
  useEffect(() => {
    async function generatePromptAudios() {
      setIsLoading(true);
      try {
        // Generate audios sequentially to avoid concurrent request limits
        const audio1 = await generateSpeech(prompts.prompt1);
        setPrompt1Audio(audio1);
        
        const audio2 = await generateSpeech(prompts.prompt2);
        setPrompt2Audio(audio2);
      } catch (error) {
        console.error('Error generating prompt audios:', error);
      } finally {
        setIsLoading(false);
      }
    }

    generatePromptAudios();
  }, []);

  // Function to transcribe audio using OpenAI Whisper API
  async function transcribeAudio(audioBlob: Blob): Promise<string> {
    try {
      // Convert Blob to File
      const audioFile = new File([audioBlob], 'audio.wav', { type: audioBlob.type });
      
      const transcription = await client.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: 'en'
      });

      return transcription.text;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  }

  async function evaluateResponse(transcription: string, prompt: string): Promise<EvaluationResult> {
    try {
      const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an evaluator. Analyze the response to the given prompt and provide numerical scores (0-10) for: response length, lexical richness, and topic relevance. Return only a JSON object with these three scores using the following keys: responseLength, lexicalRichness, topicRelevance.'
          },
          {
            role: 'user',
            content: `Prompt: ${prompt}\n\nResponse: ${transcription}\n\nProvide evaluation scores in JSON format.`
          }
        ],
      });

      const evaluationText = response.choices[0]?.message?.content || '';
      try {
        const scores = JSON.parse(evaluationText);
        console.log(scores);
        return {
          responseLength: scores.responseLength || 0,
          lexicalRichness: scores.lexicalRichness || 0,
          topicRelevance: scores.topicRelevance || 0
        };
      } catch (parseError) {
        console.error('Error parsing evaluation scores:', parseError);
        throw parseError;
      }
    } catch (error) {
      console.error('Error evaluating response:', error);
      throw error;
    }
  }

  const handleRecording = async (promptNumber: number, audioBlob: Blob) => {
    try {
      // Step 1: Transcribe audio using Whisper
      const transcription = await transcribeAudio(audioBlob);
      console.log('Transcription:', transcription);
      
      // Step 2: Evaluate the transcribed response
      const prompt = promptNumber === 1 ? prompts.prompt1 : prompts.prompt2;
      const evaluation = await evaluateResponse(transcription, prompt);

      // Step 3: Update results
      if (promptNumber === 1) {
        setPrompt1Results(evaluation);
      } else {
        setPrompt2Results(evaluation);
      }
    } catch (error) {
      console.error('Error processing recording:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#1c49ff] to-[#4169ff] bg-clip-text text-transparent">Prompt Evaluation App</h1>
          <p className="mt-4 text-lg text-gray-600">Compare and analyze different prompt responses</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <PromptCard
            prompt={prompts.prompt1}
            promptAudio={prompt1Audio}
            isLoading={isLoading}
            onRecordingComplete={(audioBlob) => handleRecording(1, audioBlob)}
          />
          <PromptCard
            prompt={prompts.prompt2}
            promptAudio={prompt2Audio}
            isLoading={isLoading}
            onRecordingComplete={(audioBlob) => handleRecording(2, audioBlob)}
          />
        </div>

        <ResultsDashboard
          prompt1Results={prompt1Results}
          prompt2Results={prompt2Results}
        />
      </div>
    </div>
  );
}

export default App;
