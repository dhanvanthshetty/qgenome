import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const BASE_COLORS = {
  'A': '#10b981', // Green
  'T': '#ef4444', // Red
  'G': '#f59e0b', // Amber
  'C': '#3b82f6'  // Blue
};

function DNAHelix({ sequence, alignmentData }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  const complementary = sequence.split('').map(b =>
    b === 'A' ? 'T' : b === 'T' ? 'A' : b === 'G' ? 'C' : 'G'
  ).join('');

  // Create DNA with spheres for bases
  const helixData = useMemo(() => {
    const bases = sequence.split('');
    const numBases = bases.length;
    const height = numBases * 0.35;
    const yOffset = -height / 2;
    const radius = 0.9;

    return bases.map((base, i) => {
      const y = (i / numBases) * height + yOffset;
      const angle = (i / numBases) * Math.PI * 5; // 2.5 full turns

      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;

      let isMatch = false;
      if (alignmentData && alignmentData.sequence2 && i < alignmentData.sequence2.length) {
        isMatch = base === alignmentData.sequence2[i];
      }

      return {
        base1: base,
        base2: complementary[i],
        pos1: [x1, y, z1],
        pos2: [x2, y, z2],
        isMatch: isMatch,
        nextPos1: i < numBases - 1 ? [
          Math.cos((i + 1) / numBases * Math.PI * 5) * radius,
          ((i + 1) / numBases) * height + yOffset,
          Math.sin((i + 1) / numBases * Math.PI * 5) * radius
        ] : null,
        nextPos2: i < numBases - 1 ? [
          Math.cos(((i + 1) / numBases * Math.PI * 5) + Math.PI) * radius,
          ((i + 1) / numBases) * height + yOffset,
          Math.sin(((i + 1) / numBases * Math.PI * 5) + Math.PI) * radius
        ] : null,
      };
    });
  }, [sequence, complementary, alignmentData]);

  return (
    <group ref={groupRef}>
      {helixData.map((data, i) => {
        const [x1, y1, z1] = data.pos1;
        const [x2, y2, z2] = data.pos2;

        const baseColor1 = alignmentData
          ? (data.isMatch ? '#22c55e' : '#ef4444')
          : BASE_COLORS[data.base1];
        const baseColor2 = BASE_COLORS[data.base2];

        // Base pair rung dimensions
        const dx = x2 - x1;
        const dz = z2 - z1;
        const distance = Math.sqrt(dx * dx + dz * dz);
        const rungAngle = Math.atan2(dz, dx);
        const midpoint = [(x1 + x2) / 2, y1, (z1 + z2) / 2];

        return (
          <group key={i}>
            {/* Base sphere 1 */}
            <mesh position={data.pos1}>
              <sphereGeometry args={[0.18, 20, 20]} />
              <meshStandardMaterial
                color={baseColor1}
                metalness={0.3}
                roughness={0.4}
                emissive={baseColor1}
                emissiveIntensity={0.25}
              />
            </mesh>

            {/* Base sphere 2 */}
            <mesh position={data.pos2}>
              <sphereGeometry args={[0.18, 20, 20]} />
              <meshStandardMaterial
                color={baseColor2}
                metalness={0.3}
                roughness={0.4}
                emissive={baseColor2}
                emissiveIntensity={0.25}
              />
            </mesh>

            {/* Base pair connector - flat box like DNA ladder rung */}
            <mesh position={midpoint} rotation={[0, rungAngle, Math.PI / 2]}>
              <boxGeometry args={[0.08, distance * 0.9, 0.08]} />
              <meshStandardMaterial
                color={alignmentData ? (data.isMatch ? '#86efac' : '#fca5a5') : '#cbd5e1'}
                metalness={0.2}
                roughness={0.6}
              />
            </mesh>

            {/* Backbone tube connections */}
            {data.nextPos1 && <BackboneTube start={data.pos1} end={data.nextPos1} color="#3b82f6" />}
            {data.nextPos2 && <BackboneTube start={data.pos2} end={data.nextPos2} color="#f59e0b" />}
          </group>
        );
      })}
    </group>
  );
}

function BackboneTube({ start, end, color }) {
  const [x1, y1, z1] = start;
  const [x2, y2, z2] = end;
  const midpoint = [(x1 + x2) / 2, (y1 + y2) / 2, (z1 + z2) / 2];
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dz = z2 - z1;
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz);

  const direction = new THREE.Vector3(dx, dy, dz).normalize();
  const axis = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, direction);
  const euler = new THREE.Euler().setFromQuaternion(quaternion);

  return (
    <mesh position={midpoint} rotation={euler}>
      <cylinderGeometry args={[0.08, 0.08, length, 12]} />
      <meshStandardMaterial
        color={color}
        metalness={0.4}
        roughness={0.3}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

export default function DNAHelix3D({ sequence, alignmentData }) {
  return (
    <div style={{
      width: '100%',
      height: '500px',
      background: 'radial-gradient(circle at center, #1e1b4b 0%, #0f172a 100%)',
      borderRadius: '8px',
      border: '1px solid #e5e7eb'
    }}>
      <Canvas
        camera={{ position: [3, 0, 3], fov: 50 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#0f172a']} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} />
        <pointLight position={[2, 2, 2]} intensity={0.8} color="#a78bfa" />
        <pointLight position={[-2, -2, -2]} intensity={0.8} color="#ec4899" />

        <DNAHelix sequence={sequence} alignmentData={alignmentData} />

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={2}
          maxDistance={8}
          target={[0, 0, 0]}
          autoRotate={false}
          dampingFactor={0.05}
          enableDamping={true}
        />
      </Canvas>
    </div>
  );
}
