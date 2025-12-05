# QGENOME: Quantum DNA Sequence Analysis

A quantum genomics simulation platform featuring PhysioQ encoding and quantum algorithms for DNA sequence analysis.

## Features

- **PhysioQ Encoding**: 3-qubit biologically-aware DNA representation
- **VQE Alignment**: Variational quantum eigensolver for sequence alignment
- **QAOA Motif Discovery**: Quantum approximate optimization for finding conserved patterns
- **QCNN Variant Detection**: Quantum convolutional neural network for pathogenicity prediction
- **3D Visualization**: Interactive DNA helix rendering with Three.js
- **Real-time Updates**: WebSocket streaming of algorithm convergence

## Technology Stack

### Backend
- FastAPI 0.104.1
- PennyLane 0.33.1 (quantum simulation)
- Qiskit 0.45.0
- NumPy, SciPy, BioPython

### Frontend
- React 18.2.0
- Three.js + React Three Fiber
- Recharts (data visualization)
- Axios (API communication)

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
python main.py
```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### GET /
Health check and service information

### POST /encode
Get PhysioQ encoding information for a DNA sequence
```json
{
  "sequence": "ATGC"
}
```

### POST /align
Perform VQE-based sequence alignment
```json
{
  "sequence1": "ATGC",
  "sequence2": "ATCC"
}
```

### POST /find-motifs
Discover conserved motifs using QAOA
```json
{
  "sequences": ["ATGCTATA", "GCGCTATA", "TTGCTATA"],
  "motif_length": 6
}
```

### POST /detect-variant
Classify DNA variants using QCNN
```json
{
  "sequence": "ATGCGATC"
}
```

### WebSocket /ws
Real-time streaming of VQE convergence data

## Usage Examples

### Testing Backend Manually

1. Check API status:
```bash
curl http://localhost:8000/
```

2. Test PhysioQ encoding:
```bash
curl -X POST http://localhost:8000/encode?sequence=ATGC
```

3. Test VQE alignment:
```bash
curl -X POST http://localhost:8000/align \
  -H "Content-Type: application/json" \
  -d '{"sequence1": "ATGC", "sequence2": "ATCC"}'
```

## Project Structure

```
qgenome/
├── backend/
│   ├── main.py                 # FastAPI server
│   ├── requirements.txt        # Python dependencies
│   ├── core/                   # Quantum algorithms
│   │   ├── physioq_encoder.py
│   │   ├── vqe_alignment.py
│   │   ├── qaoa_motif.py
│   │   └── qcnn_variant.py
│   ├── api/                    # API modules
│   └── data/                   # Test data
│
├── frontend/
│   ├── package.json
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── DNAHelix3D.jsx
│   │   │   ├── VQEDashboard.jsx
│   │   │   ├── QAOADashboard.jsx
│   │   │   └── QCNNDashboard.jsx
│   │   └── utils/
│   │       └── api.js
│   └── public/
│
└── README.md
```

## PhysioQ Encoding

Each DNA base is encoded using 3 qubits:
- **Qubit 0**: Chemical class (Purine=0, Pyrimidine=1)
- **Qubit 1**: H-bond strength (rotation angle)
- **Qubit 2**: Base-specific identity

Encodings:
- A (Adenine): [0, 0, 0] - Purine, 2 H-bonds
- G (Guanine): [0, 1, 0] - Purine, 3 H-bonds
- C (Cytosine): [1, 0, 0] - Pyrimidine, 3 H-bonds
- T (Thymine): [1, 1, 0] - Pyrimidine, 2 H-bonds

## Development Notes

- Maximum sequence length: 4 bases (12 qubits)
- VQE iterations: 50 (configurable)
- QAOA layers: 2 (configurable)
- All quantum computations are simulated (no real quantum hardware required)
- Optimized for systems with 16GB RAM

## License

MIT License

## Authors

QGENOME Development Team
