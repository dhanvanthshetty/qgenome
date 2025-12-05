# QGENOME Backend Setup Guide

## Quick Setup (Automated)

```bash
cd backend
bash setup.sh
```

Then run the server:
```bash
bash run.sh
```

---

## Manual Setup (Step by Step)

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Create Virtual Environment
```bash
python -m venv venv
```

### Step 3: Activate Virtual Environment

**For Git Bash on Windows (MINGW64):**
```bash
source venv/Scripts/activate
```

**For Linux/Mac:**
```bash
source venv/bin/activate
```

**For Windows CMD:**
```cmd
venv\Scripts\activate.bat
```

**For Windows PowerShell:**
```powershell
venv\Scripts\Activate.ps1
```

### Step 4: Upgrade Pip (Optional but Recommended)
```bash
python -m pip install --upgrade pip
```

### Step 5: Install Dependencies
```bash
pip install -r requirements.txt
```

This will install:
- fastapi==0.104.1
- uvicorn[standard]==0.24.0
- pennylane==0.33.1
- qiskit==0.45.0
- numpy==1.24.3
- scipy==1.11.3
- biopython==1.81
- websockets==12.0
- python-multipart==0.0.6

### Step 6: Run the Server
```bash
python main.py
```

---

## Verification

Once running, you should see:
```
INFO:     Started server process [XXXX]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

Test the API:
```bash
curl http://localhost:8000/
```

Expected response:
```json
{
  "service": "QGENOME API",
  "status": "running",
  "algorithms": ["VQE", "QAOA", "QCNN"],
  "encoding": "PhysioQ"
}
```

---

## Troubleshooting

### Issue: "python: command not found"
**Solution:** Use `python3` instead of `python`:
```bash
python3 -m venv venv
```

### Issue: "No module named 'pennylane'"
**Solution:** Make sure virtual environment is activated:
```bash
source venv/Scripts/activate
pip install -r requirements.txt
```

### Issue: "Permission denied: setup.sh"
**Solution:** Make script executable:
```bash
chmod +x setup.sh run.sh
bash setup.sh
```

### Issue: Port 8000 already in use
**Solution:** Change port in main.py (last line):
```python
uvicorn.run(app, host="0.0.0.0", port=8001)  # Changed to 8001
```

### Issue: Installation takes too long
**Solution:** Use pip with no-cache-dir:
```bash
pip install --no-cache-dir -r requirements.txt
```

---

## Daily Usage

### Starting the Server
```bash
cd backend
source venv/Scripts/activate  # Activate venv
python main.py                 # Run server
```

### Stopping the Server
Press `Ctrl+C` in the terminal

### Deactivating Virtual Environment
```bash
deactivate
```

---

## Testing Endpoints

### Test PhysioQ Encoding
```bash
curl -X POST "http://localhost:8000/encode?sequence=ATGC"
```

### Test VQE Alignment
```bash
curl -X POST "http://localhost:8000/align" \
  -H "Content-Type: application/json" \
  -d '{"sequence1": "ATGC", "sequence2": "ATCC"}'
```

### Test QAOA Motif Discovery
```bash
curl -X POST "http://localhost:8000/find-motifs" \
  -H "Content-Type: application/json" \
  -d '{"sequences": ["ATGCTATA", "GCGCTATA", "TTGCTATA"], "motif_length": 6}'
```

### Test QCNN Variant Detection
```bash
curl -X POST "http://localhost:8000/detect-variant" \
  -H "Content-Type: application/json" \
  -d '{"sequence": "ATGCGATC"}'
```

---

## API Documentation

Once the server is running, access interactive API docs at:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
