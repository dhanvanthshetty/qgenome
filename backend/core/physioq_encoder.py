"""
PhysioQ Encoding: Biologically-aware 3-qubit DNA encoding
Innovation: Preserves chemical structure, H-bonding, evolutionary relationships
"""
import pennylane as qml
import numpy as np

class PhysioQEncoder:
    """
    3-qubit per base encoding:
    - Qubit 0: Chemical class (Purine=0, Pyrimidine=1)
    - Qubit 1: H-bond strength (rotation angle)
    - Qubit 2: Specific identity within class
    """

    # H-bond angles (radians)
    H_BOND_ANGLES = {
        'A': np.pi/3,   # A-T: 2 bonds
        'T': np.pi/3,   # T-A: 2 bonds
        'G': np.pi/2,   # G-C: 3 bonds
        'C': np.pi/2    # C-G: 3 bonds
    }

    def __init__(self):
        self.base_to_encoding = {
            'A': [0, 0, 0],  # Purine, A-specific
            'G': [0, 1, 0],  # Purine, G-specific
            'C': [1, 0, 0],  # Pyrimidine, C-specific
            'T': [1, 1, 0]   # Pyrimidine, T-specific
        }

    def encode_sequence(self, sequence, qubits):
        """
        Encode DNA sequence into quantum circuit
        Args:
            sequence: DNA string (e.g., "ATGC")
            qubits: Starting qubit index
        Returns:
            Number of qubits used
        """
        operations = []

        for i, base in enumerate(sequence):
            base_qubits = qubits + (i * 3)

            # Qubit 0: Chemical class
            if base in ['C', 'T']:  # Pyrimidine
                operations.append(('PauliX', base_qubits))

            # Qubit 1: H-bond rotation
            theta = self.H_BOND_ANGLES[base]
            operations.append(('RY', base_qubits + 1, theta))

            # Qubit 2: Identity
            if base in ['G', 'T']:
                operations.append(('PauliX', base_qubits + 2))

        return operations, len(sequence) * 3

    def get_encoding_info(self, sequence):
        """Return human-readable encoding information"""
        info = []
        for i, base in enumerate(sequence):
            info.append({
                'base': base,
                'position': i,
                'chemical_class': 'Purine' if base in ['A', 'G'] else 'Pyrimidine',
                'h_bonds': 2 if base in ['A', 'T'] else 3,
                'qubits': [i*3, i*3+1, i*3+2]
            })
        return info
