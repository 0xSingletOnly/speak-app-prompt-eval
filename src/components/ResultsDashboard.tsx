import React from 'react';

interface EvaluationResult {
  responseLength: number;
  lexicalRichness: number;
  topicRelevance: number;
}

interface ResultsDashboardProps {
  prompt1Results: EvaluationResult | null;
  prompt2Results: EvaluationResult | null;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ prompt1Results, prompt2Results }) => {
  const renderMetric = (label: string, value1: number | null, value2: number | null) => {
    return (
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">{label}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#1c49ff]/5 p-4 rounded-lg border border-[#1c49ff]/10 hover:border-[#1c49ff]/30 transition-colors duration-200">
            <p className="text-sm font-medium text-[#1c49ff]">Prompt 1</p>
            <p className="text-2xl font-bold text-gray-800">{value1 ? `${value1}/10` : 'N/A'}</p>
          </div>
          <div className="bg-[#1c49ff]/5 p-4 rounded-lg border border-[#1c49ff]/10 hover:border-[#1c49ff]/30 transition-colors duration-200">
            <p className="text-sm font-medium text-[#1c49ff]">Prompt 2</p>
            <p className="text-2xl font-bold text-gray-800">{value2 ? `${value2}/10` : 'N/A'}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-8 rounded-xl border-2 border-gray-100 hover:border-[#1c49ff] transition-colors duration-200">
      <h2 className="text-2xl font-bold mb-8 text-[#1c49ff]">Evaluation Results</h2>
      {renderMetric(
        'Response Length',
        prompt1Results?.responseLength ?? null,
        prompt2Results?.responseLength ?? null
      )}
      {renderMetric(
        'Lexical Richness',
        prompt1Results?.lexicalRichness ?? null,
        prompt2Results?.lexicalRichness ?? null
      )}
      {renderMetric(
        'Topic Relevance',
        prompt1Results?.topicRelevance ?? null,
        prompt2Results?.topicRelevance ?? null
      )}
    </div>
  );
};

export default ResultsDashboard;
