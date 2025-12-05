import React, { useState } from 'react';
import axios from 'axios';

export default function QCNNDashboard() {
  const [sequence, setSequence] = useState('ATGCGATC');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const detectVariant = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/detect-variant', {
        sequence: sequence
      });
      setResults(response.data.results);
    } catch (error) {
      console.error('Variant detection error:', error);
      alert('Error detecting variants. Make sure the backend is running on port 8000.');
    }
    setLoading(false);
  };

  return (
    <div className="dashboard">
      <h2>🔍 QCNN Variant Detection</h2>

      <div className="input-section">
        <label>DNA Sequence:</label>
        <input
          value={sequence}
          onChange={(e) => setSequence(e.target.value.toUpperCase())}
          placeholder="ATGC..."
        />

        <button onClick={detectVariant} disabled={loading}>
          {loading ? 'Analyzing...' : 'Detect Variants'}
        </button>
      </div>

      {results && (
        <div className="results-section">
          <h3>Variant Analysis Results</h3>

          <div className={`classification-card ${results.classification.toLowerCase()}`}>
            <h4>{results.classification}</h4>
            <div className="probability-bar">
              <div
                className="probability-fill"
                style={{ width: `${results.pathogenic_probability * 100}%` }}
              />
            </div>
            <p>Pathogenicity: {(results.pathogenic_probability * 100).toFixed(1)}%</p>
          </div>

          <div className="metrics">
            <div className="metric">
              <span>Certainty Score:</span>
              <strong>{(results.certainty_score * 100).toFixed(1)}%</strong>
            </div>
            <div className="metric">
              <span>Algorithm:</span>
              <strong>QCNN (12 qubits)</strong>
            </div>
          </div>

          <div className="interpretation">
            <h4>Clinical Interpretation</h4>
            <p>
              {results.classification === 'Pathogenic'
                ? '⚠️ This variant is predicted to be disease-causing. Further validation recommended.'
                : '✅ This variant is predicted to be benign.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
