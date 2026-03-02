import React, { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import TableModel from "./TableModel";
import { useTableLayout, TableData } from "@/hooks/useTableLayout";

interface TableSceneProps {
  onSelectTable: (table: TableData | null) => void;
  selectedTable: TableData | null;
}

/* -------- Floor -------- */
const Floor = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 1.5]} receiveShadow>
    <planeGeometry args={[14, 12]} />
    <meshStandardMaterial color="hsl(0, 0%, 8%)" metalness={0.2} roughness={0.9} />
  </mesh>
);

/* -------- Walls -------- */
const Walls = () => (
  <>
    {/* Back wall */}
    <mesh position={[0, 2, -4]} receiveShadow>
      <planeGeometry args={[14, 4]} />
      <meshStandardMaterial color="hsl(0, 0%, 10%)" metalness={0.1} roughness={0.95} />
    </mesh>
    {/* Left wall */}
    <mesh position={[-7, 2, 1.5]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
      <planeGeometry args={[12, 4]} />
      <meshStandardMaterial color="hsl(0, 0%, 9%)" metalness={0.1} roughness={0.95} />
    </mesh>
    {/* Right wall */}
    <mesh position={[7, 2, 1.5]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
      <planeGeometry args={[12, 4]} />
      <meshStandardMaterial color="hsl(0, 0%, 9%)" metalness={0.1} roughness={0.95} />
    </mesh>
  </>
);

/* -------- Decorative lights -------- */
const CeilingLights = () => (
  <>
    {[-2, 2].map((x) =>
      [-1, 3].map((z) => (
        <group key={`${x}-${z}`} position={[x, 3.2, z]}>
          <mesh>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial
              color="hsl(43, 76%, 52%)"
              emissive="hsl(43, 76%, 52%)"
              emissiveIntensity={2}
            />
          </mesh>
          <pointLight
            color="hsl(43, 70%, 60%)"
            intensity={0.6}
            distance={5}
            decay={2}
          />
        </group>
      ))
    )}
  </>
);

const TableScene: React.FC<TableSceneProps> = ({ onSelectTable, selectedTable }) => {
  const { tables } = useTableLayout();

  return (
    <Canvas
      shadows
      camera={{ position: [0, 7, 10], fov: 45 }}
      style={{ background: "transparent" }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
    >
      <Suspense fallback={null}>
        {/* Lighting */}
        <ambientLight intensity={0.15} color="hsl(43, 50%, 70%)" />
        <directionalLight
          position={[5, 8, 3]}
          intensity={0.4}
          color="hsl(43, 60%, 75%)"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[0, 4, 1]} intensity={0.3} color="hsl(43, 76%, 52%)" />

        {/* Environment & Room */}
        <Floor />
        <Walls />
        <CeilingLights />

        <ContactShadows
          position={[0, 0, 1.5]}
          opacity={0.4}
          scale={14}
          blur={2}
          far={6}
          color="hsl(0, 0%, 0%)"
        />

        {/* Tables */}
        {tables.map((table) => (
          <TableModel
            key={table.id}
            table={table}
            onSelect={onSelectTable}
            isSelected={selectedTable?.id === table.id}
          />
        ))}

        {/* Controls */}
        <OrbitControls
          makeDefault
          enablePan={false}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.5}
          minDistance={5}
          maxDistance={16}
          target={[0, 0, 1.5]}
          enableDamping
          dampingFactor={0.05}
        />
      </Suspense>
    </Canvas>
  );
};

export default TableScene;
