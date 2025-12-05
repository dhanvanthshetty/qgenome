import React, { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function VQEDashboard({ onAlignmentComplete }) {
  const [seq1, setSeq1] = useState('ATGC');
  const [seq2, setSeq2] = useState('ATCC');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runAlignment = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/align', {
        sequence1: seq1,
        sequence2: seq2
      });
      setResults(response.data.results);
      if (onAlignmentComplete) {
        onAlignmentComplete(seq1, seq2, response.data.results);
      }
    } catch (error) {
      console.error('Alignment error:', error);
      alert('Error running alignment. Make sure the backend is running on port 8000.');
    }
    setLoading(false);
  };

  return (
    <div className="dashboard">
      <h2>🔬 VQE Sequence Alignment</h2>

      <div className="input-section">
        <div>
          <label>Sequence 1:</label>
          <input
            value={seq1}
            onChange={(e) => setSeq1(e.target.value.toUpperCase())}
            placeholder="ATGC..."
          />
        </div>

        <div>
          <label>Sequence 2:</label>
          <input
            value={seq2}
            onChange={(e) => setSeq2(e.target.value.toUpperCase())}
            placeholder="ATGC..."
          />
        </div>

        <button onClick={runAlignment} disabled={loading}>
          {loading ? 'Running...' : 'Run VQE Alignment'}
        </button>
      </div>

      {results && (
        <div className="results-section">
          <h3>Results</h3>

          <div className="metrics">
            <div className="metric">
              <span>Alignment Score:</span>
              <strong>{results.alignment_score.toFixed(2)}%</strong>
            </div>
            <div className="metric">
              <span>Final Energy:</span>
              <strong>{results.final_energy.toFixed(4)}</strong>
            </div>
            <div className="metric">
              <span>Iterations:</span>
              <strong>{results.convergence.length}</strong>
            </div>
          </div>

          <h4>Energy Convergence</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={results.convergence}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="iteration" label={{ value: 'Iteration', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Energy', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="energy" stroke="#4A90E2" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>

          <div className="alignment-viz">
            <h4>Alignment Visualization</h4>
            <div className="sequences">
              <div className="seq">{seq1}</div>
              <div className="match-line">
                {seq1.split('').map((base, i) => (
                  <span key={i}>{base === seq2[i] ? '|' : ' '}</span>
                ))}
              </div>
              <div className="seq">{seq2}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
