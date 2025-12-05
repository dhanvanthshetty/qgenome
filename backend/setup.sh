#!/bin/bash
# QGENOME Backend Setup Script
# Run with: bash setup.sh

echo "=== QGENOME Backend Setup ==="
echo ""

# Step 1: Create virtual environment
echo "[1/4] Creating virtual environment..."
python -m venv venv

if [ $? -ne 0 ]; then
    echo "Error: Failed to create virtual environment"
    echo "Make sure Python 3.8+ is installed: python --version"
    exit 1
fi
echo "✓ Virtual environment created"
echo ""

# Step 2: Activate virtual environment
echo "[2/4] Activating virtual environment..."
source venv/Scripts/activate

if [ $? -ne 0 ]; then
    echo "Error: Failed to activate virtual environment"
    exit 1
fi
echo "✓ Virtual environment activated"
echo ""

# Step 3: Upgrade pip
echo "[3/4] Upgrading pip..."
python -m pip install --upgrade pip

if [ $? -ne 0 ]; then
    echo "Warning: Failed to upgrade pip, continuing anyway..."
fi
echo "✓ Pip upgraded"
echo ""

# Step 4: Install dependencies
echo "[4/4] Installing dependencies from requirements.txt..."
pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "Error: Failed to install dependencies"
    exit 1
fi
echo "✓ All dependencies installed"
echo ""

echo "=== Setup Complete! ==="
echo ""
echo "To run the backend server:"
echo "  1. Activate venv: source venv/Scripts/activate"
echo "  2. Run server: python main.py"
echo ""
echo "The API will be available at: http://localhost:8000"
