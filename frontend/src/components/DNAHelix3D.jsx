import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function DNAHelix({ sequence }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  // Create DNA helix structure matching the reference image
  const helixData = useMemo(() => {
    const bases = sequence.split('');
    const numBases = bases.length;
    const height = numBases * 0.4; // Vertical spacing between base pairs
    const yOffset = -height / 2;
    const radius = 1.2; // Helix radius

    return bases.map((base, i) => {
      const t = i / numBases;
      const y = t * height + yOffset;
      const angle = t * Math.PI * 6; // 3 full turns

      // First strand (blue/cyan)
      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;

      // Second strand (red) - opposite side
      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;

      // Next positions for backbone connections
      const nextAngle = ((i + 1) / numBases) * Math.PI * 6;
      const nextY = ((i + 1) / numBases) * height + yOffset;

      return {
        pos1: [x1, y, z1],
        pos2: [x2, y, z2],
        nextPos1: i < numBases - 1 ? [
          Math.cos(nextAngle) * radius,
          nextY,
          Math.sin(nextAngle) * radius
        ] : null,
        nextPos2: i < numBases - 1 ? [
          Math.cos(nextAngle + Math.PI) * radius,
          nextY,
          Math.sin(nextAngle + Math.PI) * radius
        ] : null,
      };
    });
  }, [sequence]);

  return (
    <group ref={groupRef}>
      {helixData.map((data, i) => {
        const [x1, y1, z1] = data.pos1;
        const [x2, y2, z2] = data.pos2;

        return (
          <group key={i}>
            {/* First strand sphere (Cyan/Blue) */}
            <mesh position={data.pos1}>
              <sphereGeometry args={[0.22, 32, 32]} />
              <meshStandardMaterial
                color="#00d4ff"
                metalness={0.4}
                roughness={0.3}
                emissive="#00a8cc"
                emissiveIntensity={0.3}
              />
            </mesh>

            {/* Second strand sphere (Red) */}
            <mesh position={data.pos2}>
              <sphereGeometry args={[0.22, 32, 32]} />
              <meshStandardMaterial
                color="#ff3333"
                metalness={0.4}
                roughness={0.3}
                emissive="#cc0000"
                emissiveIntensity={0.3}
              />
            </mesh>

            {/* Base pair connector (horizontal gray cylinder) */}
            <CylinderBetweenPoints
              start={data.pos1}
              end={data.pos2}
              color="#909090"
              radius={0.06}
            />

            {/* Backbone connections (diagonal gray cylinders) */}
            {data.nextPos1 && (
              <CylinderBetweenPoints
                start={data.pos1}
                end={data.nextPos1}
                color="#a0a0a0"
                radius={0.06}
              />
            )}
            {data.nextPos2 && (
              <CylinderBetweenPoints
                start={data.pos2}
                end={data.nextPos2}
                color="#a0a0a0"
                radius={0.06}
              />
            )}
          </group>
        );
      })}
    </group>
  );
}

// Helper component to create a cylinder between two points
function CylinderBetweenPoints({ start, end, color, radius = 0.06 }) {
  const [x1, y1, z1] = start;
  const [x2, y2, z2] = end;

  // Calculate midpoint
  const midpoint = [(x1 + x2) / 2, (y1 + y2) / 2, (z1 + z2) / 2];

  // Calculate distance (cylinder height)
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dz = z2 - z1;
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz);

  // Calculate rotation to align cylinder with the two points
  const direction = new THREE.Vector3(dx, dy, dz).normalize();
  const axis = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, direction);
  const euler = new THREE.Euler().setFromQuaternion(quaternion);

  return (
    <mesh position={midpoint} rotation={euler}>
      <cylinderGeometry args={[radius, radius, length, 16]} />
      <meshStandardMaterial
        color={color}
        metalness={0.5}
        roughness={0.4}
      />
    </mesh>
  );
}

export default function DNAHelix3D({ sequence = 'ATCGATCGATCGATCGATCGATCGATCG', alignmentData }) {
  return (
    <div style={{
      width: '100%',
      height: '600px',
      background: 'radial-gradient(circle at center, #2a2a3e 0%, #1a1a2e 100%)',
      borderRadius: '12px',
      border: '2px solid #e5e7eb',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <Canvas
        camera={{ position: [4, 0, 4], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
      >
        {/* Dark background */}
        <color attach="background" args={['#1a1a2e']} />

        {/* Lighting setup for realistic rendering */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
        <directionalLight position={[-5, -5, -5]} intensity={0.6} />
        <pointLight position={[3, 3, 3]} intensity={0.8} color="#ffffff" />
        <pointLight position={[-3, -3, -3]} intensity={0.5} color="#8888ff" />
        <spotLight position={[0, 5, 0]} intensity={0.5} angle={0.6} penumbra={1} />

        {/* DNA Helix */}
        <DNAHelix sequence={sequence} />

        {/* Camera controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          minDistance={3}
          maxDistance={10}
          target={[0, 0, 0]}
          autoRotate={false}
          dampingFactor={0.05}
          enableDamping={true}
          rotateSpeed={0.5}
        />
      </Canvas>

      {/* Info overlay */}
      <div style={{
        position: 'absolute',
        top: '15px',
        left: '15px',
        background: 'rgba(0, 0, 0, 0.6)',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '8px',
        fontSize: '14px',
        fontFamily: 'monospace',
        backdropFilter: 'blur(5px)'
      }}>
        <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>3D DNA Double Helix</div>
        <div style={{ fontSize: '12px', opacity: 0.9 }}>
          <span style={{ color: '#00d4ff' }}>●</span> Strand 1 (5' → 3') •
          <span style={{ color: '#ff3333' }}> ●</span> Strand 2 (3' → 5')
        </div>
        <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '5px' }}>
          Base pairs: {sequence.length}
        </div>
      </div>

      {/* Controls hint */}
      <div style={{
        position: 'absolute',
        bottom: '15px',
        right: '15px',
        background: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '11px',
        fontFamily: 'sans-serif',
        backdropFilter: 'blur(5px)'
      }}>
        🖱️ Drag to rotate • Scroll to zoom • Right-click to pan
      </div>
    </div>
  );
}
