import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { TableData } from "@/hooks/useTableLayout";

interface TableModelProps {
  table: TableData;
  onSelect: (table: TableData) => void;
  isSelected: boolean;
}

const GOLD = new THREE.Color("hsl(43, 76%, 52%)");
const RED = new THREE.Color("hsl(0, 60%, 45%)");
const DARK = new THREE.Color("hsl(0, 0%, 12%)");

const TableModel: React.FC<TableModelProps> = ({ table, onSelect, isSelected }) => {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const baseColor = table.isReserved ? RED : GOLD;

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Smooth scale animation
    const targetScale = isSelected ? 1.12 : hovered ? 1.06 : 1;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      delta * 6
    );

    // Glow pulse
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      const pulse = Math.sin(Date.now() * 0.003) * 0.15 + 0.35;
      mat.opacity = isSelected ? 0.6 : hovered ? 0.45 : table.isReserved ? pulse : 0.15;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    onSelect(table);
  };

  // Table dimensions based on capacity
  const radius = table.capacity >= 6 ? 0.55 : table.capacity >= 4 ? 0.45 : 0.35;
  const isLargeTable = table.capacity >= 6;

  return (
    <group
      ref={groupRef}
      position={table.position}
      onClick={handleClick}
      onPointerOver={() => {
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      {/* Table top */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        {isLargeTable ? (
          <cylinderGeometry args={[radius, radius, 0.06, 24]} />
        ) : (
          <cylinderGeometry args={[radius, radius, 0.06, 20]} />
        )}
        <meshStandardMaterial
          color={DARK}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Table edge accent ring */}
      <mesh position={[0, 0.46, 0]}>
        <torusGeometry args={[radius - 0.01, 0.012, 8, 32]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={baseColor}
          emissiveIntensity={hovered || isSelected ? 0.8 : 0.3}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Table leg */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, 0.44, 8]} />
        <meshStandardMaterial color={DARK} metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Base */}
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <cylinderGeometry args={[0.2, 0.22, 0.02, 16]} />
        <meshStandardMaterial color={DARK} metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Glow disc underneath */}
      <mesh ref={glowRef} position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius + 0.15, 24]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={baseColor}
          emissiveIntensity={1}
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Chairs */}
      {Array.from({ length: Math.min(table.capacity, 6) }).map((_, i) => {
        const angle = (i / Math.min(table.capacity, 6)) * Math.PI * 2;
        const chairDist = radius + 0.25;
        const cx = Math.cos(angle) * chairDist;
        const cz = Math.sin(angle) * chairDist;

        return (
          <mesh key={i} position={[cx, 0.2, cz]} castShadow>
            <boxGeometry args={[0.12, 0.22, 0.12]} />
            <meshStandardMaterial
              color={DARK}
              metalness={0.5}
              roughness={0.4}
            />
          </mesh>
        );
      })}

      {/* Table number label */}
      <Html
        position={[0, 0.7, 0]}
        center
        distanceFactor={8}
        style={{ pointerEvents: "none" }}
      >
        <div
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider transition-all duration-300 whitespace-nowrap ${
            table.isReserved
              ? "bg-red-500/80 text-white"
              : "bg-primary/80 text-primary-foreground"
          } ${isSelected || hovered ? "scale-110" : ""}`}
        >
          T{table.tableNumber}
        </div>
      </Html>
    </group>
  );
};

export default TableModel;
