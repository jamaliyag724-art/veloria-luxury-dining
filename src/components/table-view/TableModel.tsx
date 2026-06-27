import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { TableData, TableStatus } from "@/hooks/useTableLayout";
import { fmtINR } from "@/lib/finance";

interface TableModelProps {
  table: TableData;
  onSelect: (table: TableData) => void;
  isSelected: boolean;
  theme: "light" | "dark";
}

const STATUS_COLOR: Record<TableStatus, string> = {
  available: "#3fb27f",
  reserved:  "#D4AF37",
  occupied:  "#c0392b",
  cleaning:  "#3a8fd8",
};

const TableModel: React.FC<TableModelProps> = ({ table, onSelect, isSelected, theme }) => {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const statusColor = new THREE.Color(STATUS_COLOR[table.status]);
  const woodColor = theme === "dark" ? "#2a1a10" : "#6b4a2b";

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const target = isSelected ? 1.12 : hovered ? 1.05 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(target, target, target), delta * 6);

    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      const pulse = Math.sin(Date.now() * 0.003) * 0.1 + 0.25;
      mat.opacity = isSelected ? 0.55 : hovered ? 0.4 : pulse;
    }
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * (isSelected ? 1.2 : 0.2);
      const mat = ringRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = isSelected ? 1 : 0;
    }
  });

  const radius = table.capacity >= 8 ? 0.7 : table.capacity >= 6 ? 0.6 : table.capacity >= 4 ? 0.5 : 0.38;
  const seats = Math.min(table.capacity, 10);

  return (
    <group
      ref={groupRef}
      position={table.position}
      onClick={(e) => { e.stopPropagation(); onSelect(table); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = "auto"; }}
    >
      {/* Table top */}
      <mesh position={[0, 0.46, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, 0.06, 28]} />
        <meshStandardMaterial color={woodColor} metalness={0.35} roughness={0.45} />
      </mesh>

      {/* Gold edge ring */}
      <mesh position={[0, 0.49, 0]}>
        <torusGeometry args={[radius - 0.005, 0.012, 8, 36]} />
        <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={hovered || isSelected ? 0.6 : 0.2} metalness={0.95} roughness={0.15} />
      </mesh>

      {/* Centerpiece (candle / vase) */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.07, 0.18, 12]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
      </mesh>
      <pointLight position={[0, 0.78, 0]} intensity={0.25} color="#ffd27a" distance={1.2} decay={2} />

      {/* Pedestal */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.08, 0.44, 10]} />
        <meshStandardMaterial color={woodColor} metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <cylinderGeometry args={[0.22, 0.24, 0.03, 18]} />
        <meshStandardMaterial color={woodColor} metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Status glow disc */}
      <mesh ref={glowRef} position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius + 0.25, 28]} />
        <meshStandardMaterial color={statusColor} emissive={statusColor} emissiveIntensity={1} transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>

      {/* Selection ring */}
      <mesh ref={ringRef} position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius + 0.32, radius + 0.42, 48]} />
        <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={1.4} transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>

      {/* Chairs */}
      {Array.from({ length: seats }).map((_, i) => {
        const angle = (i / seats) * Math.PI * 2;
        const cd = radius + 0.32;
        const cx = Math.cos(angle) * cd;
        const cz = Math.sin(angle) * cd;
        return (
          <group key={i} position={[cx, 0, cz]} rotation={[0, -angle + Math.PI / 2, 0]}>
            <mesh position={[0, 0.18, 0]} castShadow>
              <boxGeometry args={[0.22, 0.06, 0.22]} />
              <meshStandardMaterial color={woodColor} metalness={0.3} roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.34, -0.09]} castShadow>
              <boxGeometry args={[0.22, 0.28, 0.04]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.6} roughness={0.4} emissive="#D4AF37" emissiveIntensity={0.05} />
            </mesh>
          </group>
        );
      })}

      {/* Floating label */}
      <Html position={[0, 0.95, 0]} center distanceFactor={9} style={{ pointerEvents: "none" }}>
        <div className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider whitespace-nowrap shadow-lg"
             style={{ background: STATUS_COLOR[table.status], color: "#0a0a0a" }}>
          {table.tableNumber}
        </div>
      </Html>

      {/* Hover tooltip */}
      {(hovered || isSelected) && (
        <Html position={[0, 1.5, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
          <div className="px-3 py-2 rounded-xl text-[10px] whitespace-nowrap shadow-2xl border border-primary/40 bg-black/80 text-white backdrop-blur-md min-w-[140px]">
            <div className="font-serif text-primary text-sm leading-tight">{table.tableNumber} · {table.category}</div>
            <div className="opacity-80 mt-0.5">{table.capacity} seats · {table.area}</div>
            <div className="text-primary font-semibold mt-0.5">Min spend {formatINR(table.minSpend)}</div>
            <div className="capitalize mt-0.5" style={{ color: STATUS_COLOR[table.status] }}>● {table.status}</div>
          </div>
        </Html>
      )}
    </group>
  );
};

export default TableModel;
