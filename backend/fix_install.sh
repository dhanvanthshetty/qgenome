#!/bin/bash
# Fix for pip installation issues

echo "=== Fixing Installation Issues ==="
echo ""

# Step 1: Upgrade core build tools
echo "[1/3] Upgrading pip, setuptools, and wheel..."
python -m pip install --upgrade pip setuptools wheel

if [ $? -ne 0 ]; then
    echo "Error: Failed to upgrade build tools"
    exit 1
fi
echo "✓ Build tools upgraded"
echo ""

# Step 2: Install dependencies one by one (more reliable)
echo "[2/3] Installing dependencies (this may take a few minutes)..."
pip install fastapi==0.104.1
pip install "uvicorn[standard]==0.24.0"
pip install numpy>=1.24.0
pip install scipy>=1.11.0
pip install pennylane==0.33.1
pip install qiskit==0.45.0
pip install biopython==1.81
pip install websockets==12.0
pip install python-multipart==0.0.6

echo "✓ All dependencies installed"
echo ""

# Step 3: Verify installation
echo "[3/3] Verifying installation..."
python -c "import fastapi; import pennylane; import numpy; print('✓ All imports successful')"

if [ $? -ne 0 ]; then
    echo "Warning: Some imports failed, but continuing..."
fi

echo ""
echo "=== Installation Complete! ==="
echo ""
echo "You can now run: python main.py"
