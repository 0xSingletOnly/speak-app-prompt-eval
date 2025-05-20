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
        <h3 className="text-lg font-semibold mb-2">{label}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-100 p-4 rounded">
            <p className="text-sm text-gray-600">Prompt 1</p>
            <p className="text-xl font-bold">{value1 ? `${value1}/10` : 'N/A'}</p>
          </div>
          <div className="bg-green-100 p-4 rounded">
            <p className="text-sm text-gray-600">Prompt 2</p>
            <p className="text-xl font-bold">{value2 ? `${value2}/10` : 'N/A'}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Evaluation Results</h2>
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
