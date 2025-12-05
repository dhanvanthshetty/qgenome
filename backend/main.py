"""
FastAPI Backend Server
Provides REST API and WebSocket for quantum genomics simulation
"""
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json

from core.physioq_encoder import PhysioQEncoder
from core.vqe_alignment import VQEAlignment
from core.qaoa_motif import QAOAMotifFinder
from core.qcnn_variant import QCNNVariantDetector

app = FastAPI(title="QGENOME API", version="1.0.0")

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize quantum engines
encoder = PhysioQEncoder()
vqe = VQEAlignment()
qaoa = QAOAMotifFinder()
qcnn = QCNNVariantDetector()

# Request models
class AlignmentRequest(BaseModel):
    sequence1: str
    sequence2: str

class MotifRequest(BaseModel):
    sequences: list[str]
    motif_length: int = 6

class VariantRequest(BaseModel):
    sequence: str

# API Endpoints
@app.get("/")
def root():
    return {
        "service": "QGENOME API",
        "status": "running",
        "algorithms": ["VQE", "QAOA", "QCNN"],
        "encoding": "PhysioQ"
    }

@app.post("/encode")
async def encode_dna(sequence: str):
    """Get PhysioQ encoding information for DNA sequence"""
    encoding_info = encoder.get_encoding_info(sequence)
    return {
        "sequence": sequence,
        "encoding": encoding_info,
        "total_qubits": len(sequence) * 3
    }

@app.post("/align")
async def align_sequences(request: AlignmentRequest):
    """VQE-based sequence alignment"""
    result = vqe.align(request.sequence1, request.sequence2)
    return {
        "algorithm": "VQE",
        "seq1": request.sequence1,
        "seq2": request.sequence2,
        "results": result
    }

@app.post("/find-motifs")
async def find_motifs(request: MotifRequest):
    """QAOA-based motif discovery"""
    result = qaoa.find_motif(request.sequences, request.motif_length)
    return {
        "algorithm": "QAOA",
        "sequences": request.sequences,
        "results": result
    }

@app.post("/detect-variant")
async def detect_variant(request: VariantRequest):
    """QCNN variant pathogenicity prediction"""
    # Train on dummy data (replace with real ClinVar data)
    training_data = [
        ("ATGC", 1),  # Pathogenic
        ("GCTA", 0),  # Benign
    ]
    qcnn.train(training_data, epochs=10)

    result = qcnn.predict(request.sequence)
    return {
        "algorithm": "QCNN",
        "sequence": request.sequence,
        "results": result
    }

# WebSocket for real-time updates
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    try:
        while True:
            data = await websocket.receive_text()
            request = json.loads(data)

            if request['type'] == 'vqe_stream':
                # Stream VQE convergence in real-time
                for step in vqe.convergence_history:
                    await websocket.send_json({
                        'type': 'vqe_update',
                        'data': step
                    })

    except Exception as e:
        print(f"WebSocket error: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
