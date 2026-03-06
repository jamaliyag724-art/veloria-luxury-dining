import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

const FadingPlate = () => {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.005;
      // Gentle wobble
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.05 - 0.1;
    }
    if (matRef.current) {
      // Pulse opacity
      matRef.current.opacity = 0.4 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
    }
  });

  return (
    <mesh ref={ref} position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[1.2, 1.2, 0.08, 64]} />
      <meshStandardMaterial
        ref={matRef}
        color="#8B0000"
        metalness={0.6}
        roughness={0.3}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
};

const RedGlow = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      ref.current.scale.set(s, s, s);
    }
  });
  return (
    <mesh ref={ref} position={[0, 0.2, 0]}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial color="#FF4444" emissive="#FF0000" emissiveIntensity={0.5} transparent opacity={0.3} />
    </mesh>
  );
};

const RejectScene3D: React.FC = () => (
  <div className="w-full h-48 rounded-2xl overflow-hidden">
    <Canvas camera={{ position: [0, 2, 5], fov: 40 }}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[2, 4, 2]} intensity={0.8} color="#FFE4E1" />
      <pointLight position={[0, 2, 0]} intensity={0.5} color="#FF4444" />
      <Environment preset="studio" />
      <FadingPlate />
      <RedGlow />
    </Canvas>
  </div>
);

export default RejectScene3D;
