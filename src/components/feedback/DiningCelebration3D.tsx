import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import * as THREE from "three";

// Golden plate
const GoldenPlate = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.3;
  });
  return (
    <mesh ref={ref} position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[1.2, 1.2, 0.08, 64]} />
      <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.15} />
    </mesh>
  );
};

// Plate rim
const PlateRim = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.3;
  });
  return (
    <mesh ref={ref} position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1.15, 0.06, 16, 64]} />
      <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
    </mesh>
  );
};

// Knife
const Knife = () => (
  <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
    <group position={[1.6, 0.3, 0]} rotation={[0, 0, -0.1]}>
      {/* handle */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[0.08, 0.6, 0.04]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* blade */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.06, 0.7, 0.015]} />
        <meshStandardMaterial color="#E8E8E8" metalness={0.95} roughness={0.05} />
      </mesh>
    </group>
  </Float>
);

// Fork
const Fork = () => (
  <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
    <group position={[-1.6, 0.3, 0]} rotation={[0, 0, 0.1]}>
      {/* handle */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[0.08, 0.6, 0.04]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* tines */}
      {[-0.025, -0.008, 0.008, 0.025].map((x, i) => (
        <mesh key={i} position={[x, 0.35, 0]}>
          <boxGeometry args={[0.012, 0.5, 0.012]} />
          <meshStandardMaterial color="#E8E8E8" metalness={0.95} roughness={0.05} />
        </mesh>
      ))}
    </group>
  </Float>
);

// Sparkle particles
const Sparkles = () => {
  const ref = useRef<THREE.Points>(null);
  const count = 60;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 0.8 + Math.random() * 1.2;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = (Math.random() - 0.3) * 1.5;
      pos[i * 3 + 2] = Math.sin(angle) * r;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.2;
      const posArr = ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        posArr[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 2 + i) * 0.002;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#FFD700" transparent opacity={0.8} sizeAttenuation />
    </points>
  );
};

// Camera zoom
const CameraAnimation = () => {
  useFrame((state) => {
    const t = Math.min(state.clock.elapsedTime / 2, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    state.camera.position.z = 6 - ease * 1.5;
    state.camera.position.y = 2 - ease * 0.5;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};

const DiningCelebration3D: React.FC = () => (
  <div className="w-full h-48 rounded-2xl overflow-hidden">
    <Canvas camera={{ position: [0, 2, 6], fov: 40 }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 2]} intensity={1.2} color="#FFF8DC" />
      <pointLight position={[-2, 3, -1]} intensity={0.6} color="#D4AF37" />
      <Environment preset="studio" />
      <CameraAnimation />
      <GoldenPlate />
      <PlateRim />
      <Knife />
      <Fork />
      <Sparkles />
    </Canvas>
  </div>
);

export default DiningCelebration3D;
