import React, { useState } from 'react';
import axios from 'axios';

export default function QAOADashboard() {
  const [sequences, setSequences] = useState(['ATGCTATA', 'GCGCTATA', 'TTGCTATA']);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const findMotifs = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/find-motifs', {
        sequences: sequences,
        motif_length: 6
      });
      setResults(response.data.results);
    } catch (error) {
      console.error('Motif finding error:', error);
      alert('Error finding motifs. Make sure the backend is running on port 8000.');
    }
    setLoading(false);
  };

  const updateSequence = (index, value) => {
    const newSeqs = [...sequences];
    newSeqs[index] = value.toUpperCase();
    setSequences(newSeqs);
  };

  const addSequence = () => {
    setSequences([...sequences, 'ATGC']);
  };

  return (
    <div className="dashboard">
      <h2>🧩 QAOA Motif Discovery</h2>

      <div className="input-section">
        <label>DNA Sequences:</label>
        {sequences.map((seq, i) => (
          <input
            key={i}
            value={seq}
            onChange={(e) => updateSequence(i, e.target.value)}
            placeholder={`Sequence ${i + 1}`}
          />
        ))}

        <button onClick={addSequence} className="secondary">
          Add Sequence
        </button>

        <button onClick={findMotifs} disabled={loading}>
          {loading ? 'Finding Motifs...' : 'Run QAOA'}
        </button>
      </div>

      {results && (
        <div className="results-section">
          <h3>Discovered Motifs</h3>

          <div className="motif-card">
            <h4>Conserved Motif: {results.motif_sequence}</h4>
            <div className="metric">
              <span>Conservation Score:</span>
              <strong>{(results.conservation_score * 100).toFixed(1)}%</strong>
            </div>
            <div className="metric">
              <span>Circuit Depth:</span>
              <strong>{results.circuit_depth} layers</strong>
            </div>
          </div>

          <h4>Motif Positions in Sequences</h4>
          {sequences.map((seq, i) => (
            <div key={i} className="sequence-highlight">
              {seq.split('').map((base, j) => (
                <span
                  key={j}
                  className={results.motif_positions.includes(j) ? 'highlight' : ''}
                >
                  {base}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
