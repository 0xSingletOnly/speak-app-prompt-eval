import { useState } from 'react';
import PromptCard from './components/PromptCard';
import ResultsDashboard from './components/ResultsDashboard';

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

  const prompts = {
    prompt1: "What did you do on the weekend?",
    prompt2: "Weekends are a great time to relax or do something fun! Did you get up to anything interesting this past weekend? Perhaps you met friends, tried a new hobby, or just chilled at home?"
  };

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
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Prompt Evaluation App</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <PromptCard
            prompt={prompts.prompt1}
            onRecordingComplete={(audioBlob) => handleRecording(1, audioBlob)}
          />
          <PromptCard
            prompt={prompts.prompt2}
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
