import React from 'react';
import '../styles/main.css';

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
  // Calculate average score if available
  const getAverageScore = (results: EvaluationResult | null): number | null => {
    if (!results) return null;
    const scores = [results.responseLength, results.lexicalRichness, results.topicRelevance];
    return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
  };

  const prompt1Avg = getAverageScore(prompt1Results);
  const prompt2Avg = getAverageScore(prompt2Results);

  const renderMetric = (label: string, value1: number | null, value2: number | null) => {
    return (
      <div className="metric-container">
        <div className="metric-header">
          <h3 className="metric-title">{label}</h3>
          <div className="metric-scale">Score out of 10</div>
        </div>
        <div className="metric-grid">
          {[{ label: 'Prompt 1', value: value1 }, { label: 'Prompt 2', value: value2 }].map((prompt) => (
            <div key={prompt.label} className="metric-card">
              <div className="metric-card-header">
                <p className="metric-card-title">{prompt.label}</p>
              </div>
              <div className="metric-card-content">
                {prompt.value !== null ? (
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${(prompt.value / 10) * 100}%` }}
                      />
                    </div>
                    <span className="progress-value">{prompt.value}</span>
                  </div>
                ) : (
                  <div className="no-data">
                    <span>No data yet</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">
            <span>Evaluation</span> Results
          </h2>
          <p className="dashboard-subtitle">Compare performance metrics between prompts</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {[{ label: 'Prompt 1', value: prompt1Avg }, { label: 'Prompt 2', value: prompt2Avg }].map((prompt) => (
            <div key={prompt.label} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '0.625rem', height: '0.625rem', borderRadius: '50%', backgroundColor: '#1c49ff', marginRight: '0.5rem' }}></div>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#4b5563', marginRight: '0.375rem' }}>{prompt.label}:</span>
              <span style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1f2937' }}>{prompt.value ?? '-'}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
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
    </div>
  );
};

export default ResultsDashboard;
