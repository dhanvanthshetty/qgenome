import React, { useState } from 'react';
import DNAHelix3D from './components/DNAHelix3D';
import VQEDashboard from './components/VQEDashboard';
import QAOADashboard from './components/QAOADashboard';
import QCNNDashboard from './components/QCNNDashboard';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('vqe');
  const [dnaSequence, setDnaSequence] = useState('ATGCATGC');
  const [alignmentData, setAlignmentData] = useState(null);

  const handleAlignmentUpdate = (seq1, seq2, results) => {
    setDnaSequence(seq1);
    setAlignmentData({
      sequence1: seq1,
      sequence2: seq2,
      results: results
    });
  };

  return (
    <div className="app">
      <header>
        <h1>🧬 QGENOME: Quantum DNA Sequence Analysis</h1>
        <p>PhysioQ Encoding | VQE | QAOA | QCNN</p>
      </header>

      <nav>
        <button
          className={activeTab === 'vqe' ? 'active' : ''}
          onClick={() => setActiveTab('vqe')}
        >
          VQE Alignment
        </button>
        <button
          className={activeTab === 'qaoa' ? 'active' : ''}
          onClick={() => setActiveTab('qaoa')}
        >
          QAOA Motifs
        </button>
        <button
          className={activeTab === 'qcnn' ? 'active' : ''}
          onClick={() => setActiveTab('qcnn')}
        >
          QCNN Variants
        </button>
      </nav>

      <main>
        <section className="dna-viz">
          <h2>3D DNA Structure</h2>
          <DNAHelix3D
            sequence={dnaSequence}
            alignmentData={alignmentData}
          />
          {alignmentData && activeTab === 'vqe' && (
            <div className="visualization-info">
              <h4>What's Happening?</h4>
              <p>
                <strong>VQE (Variational Quantum Eigensolver)</strong> aligned two DNA sequences
                by finding the optimal quantum state that minimizes energy.
              </p>
              <p>
                🟢 <strong>Green bases:</strong> Matched positions between sequences<br/>
                🔴 <strong>Red bases:</strong> Mismatched positions<br/>
                📊 <strong>Alignment Score:</strong> {alignmentData.results.alignment_score.toFixed(1)}%
              </p>
              <p className="explanation">
                The quantum algorithm optimized the alignment through {alignmentData.results.convergence.length} iterations,
                achieving final energy of {alignmentData.results.final_energy.toFixed(4)}.
              </p>
            </div>
          )}
        </section>

        <section className="algorithm-view">
          {activeTab === 'vqe' && <VQEDashboard onAlignmentComplete={handleAlignmentUpdate} />}
          {activeTab === 'qaoa' && <QAOADashboard />}
          {activeTab === 'qcnn' && <QCNNDashboard />}
        </section>
      </main>
    </div>
  );
}

export default App;
