#!/bin/bash
# QGENOME Backend Run Script
# Run with: bash run.sh

echo "=== Starting QGENOME Backend ==="
echo ""

# Check if venv exists
if [ ! -d "venv" ]; then
    echo "Error: Virtual environment not found!"
    echo "Please run setup first: bash setup.sh"
    exit 1
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/Scripts/activate

if [ $? -ne 0 ]; then
    echo "Error: Failed to activate virtual environment"
    exit 1
fi

echo "✓ Virtual environment activated"
echo ""

# Run the server
echo "Starting FastAPI server on http://localhost:8000..."
echo "Press Ctrl+C to stop"
echo ""
python main.py
