import { useState } from 'react';
import PromptCard from './components/PromptCard';
import ResultsDashboard from './components/ResultsDashboard';

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

  const handleRecording = async (promptNumber: number, audioBlob: Blob) => {
    try {
      // TODO: Implement Whisper transcription
      const transcription = "Sample transcription";
      
      // TODO: Implement OpenAI evaluation
      const mockEvaluation: EvaluationResult = {
        responseLength: Math.random() * 10,
        lexicalRichness: Math.random() * 10,
        topicRelevance: Math.random() * 10
      };

      if (promptNumber === 1) {
        setPrompt1Results(mockEvaluation);
      } else {
        setPrompt2Results(mockEvaluation);
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
