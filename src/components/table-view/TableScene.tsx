import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Html } from "@react-three/drei";
import * as THREE from "three";
import TableModel from "./TableModel";
import { useTableLayout, TableData, cameraPresets } from "@/hooks/useTableLayout";
import { useTheme } from "@/context/ThemeContext";


interface TableSceneProps {
  onSelectTable: (table: TableData | null) => void;
  selectedTable: TableData | null;
  cameraPreset: keyof typeof cameraPresets;
}

const LightFloor: React.FC<{ theme: "light" | "dark" }> = ({ theme }) => {
  const marble = theme === "dark" ? "#15110d" : "#e9e2d4";
  return (
    <>
      {/* Indoor marble */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[22, 14]} />
        <meshStandardMaterial color={marble} metalness={0.2} roughness={0.35} />
      </mesh>
      {/* Outdoor wood deck */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-8, 0.01, 5.5]} receiveShadow>
        <planeGeometry args={[6, 5]} />
        <meshStandardMaterial color={theme === "dark" ? "#2a1c10" : "#8b5e3c"} roughness={0.85} />
      </mesh>
      {/* Garden grass */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-8, 0.005, 8]} receiveShadow>
        <planeGeometry args={[7, 3.5]} />
        <meshStandardMaterial color={theme === "dark" ? "#1a2a18" : "#5b8a4b"} roughness={1} />
      </mesh>
      {/* Pool */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[8.5, 0.01, 6.5]} receiveShadow>
        <planeGeometry args={[5, 4]} />
        <meshStandardMaterial color={theme === "dark" ? "#0a3a4a" : "#3aa7c4"} metalness={0.6} roughness={0.15} emissive={theme === "dark" ? "#0a3a4a" : "#1a5566"} emissiveIntensity={0.15} />
      </mesh>
      {/* Gold inlay strip */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.011, -4.4]} receiveShadow>
        <planeGeometry args={[22, 0.05]} />
        <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={0.4} />
      </mesh>
    </>
  );
};

const Walls: React.FC<{ theme: "light" | "dark" }> = ({ theme }) => {
  const wall = theme === "dark" ? "#1a120c" : "#d8c7a8";
  const wood = theme === "dark" ? "#2a1a10" : "#7a5230";
  return (
    <>
      {/* Back wall */}
      <mesh position={[0, 2.2, -7]} receiveShadow>
        <planeGeometry args={[22, 4.4]} />
        <meshStandardMaterial color={wall} roughness={0.95} />
      </mesh>
      {/* Right wall (between indoor and pool) */}
      <mesh position={[11, 2.2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[14, 4.4]} />
        <meshStandardMaterial color={wall} roughness={0.95} />
      </mesh>
      {/* Glass partition to outdoor (left) */}
      <mesh position={[-5, 1.3, 4]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[6, 2.6]} />
        <meshStandardMaterial color="#88aacc" transparent opacity={0.18} metalness={0.7} roughness={0.05} />
      </mesh>
      {/* VIP room divider */}
      <mesh position={[5, 1.4, -1]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[5, 2.8]} />
        <meshStandardMaterial color={wood} roughness={0.6} />
      </mesh>
      {/* Wine cellar shelves */}
      {[0, 0.7, 1.4, 2.1].map((y) => (
        <mesh key={y} position={[10.4, y + 0.5, -1]} castShadow>
          <boxGeometry args={[0.15, 0.05, 4]} />
          <meshStandardMaterial color={wood} roughness={0.5} />
        </mesh>
      ))}
      {/* Bar counter */}
      <mesh position={[9.8, 0.55, 2]} castShadow receiveShadow>
        <boxGeometry args={[1, 1.1, 3]} />
        <meshStandardMaterial color={wood} metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[9.8, 1.13, 2]}>
        <boxGeometry args={[1.05, 0.04, 3.05]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.15} emissive="#D4AF37" emissiveIntensity={0.2} />
      </mesh>
      {/* Reception desk */}
      <mesh position={[0, 0.5, -5.7]} castShadow>
        <boxGeometry args={[3, 1, 0.7]} />
        <meshStandardMaterial color={wood} metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.05, -5.7]}>
        <boxGeometry args={[3.1, 0.04, 0.75]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.15} />
      </mesh>
    </>
  );
};

const Chandeliers: React.FC = () => (
  <>
    {[[-3, 0], [3, 0], [0, -3], [0, 3], [-7, 0], [7, 0]].map(([x, z], i) => (
      <group key={i} position={[x, 3.2, z]}>
        <mesh>
          <sphereGeometry args={[0.16, 14, 14]} />
          <meshStandardMaterial color="#D4AF37" emissive="#ffcb6b" emissiveIntensity={1.6} metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 0.9, 4]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <pointLight color="#ffd27a" intensity={0.7} distance={6} decay={2} />
      </group>
    ))}
  </>
);

const Plants: React.FC = () => (
  <>
    {[[-9.5, 0.5, -3], [-9.5, 0.5, 3], [10.5, 0.5, -5], [-2, 0.5, -6], [2, 0.5, -6], [-7, 0.5, 7.5], [-9, 0.5, 7.5]].map(([x, y, z], i) => (
      <group key={i} position={[x, 0, z]}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.22, 0.4, 12]} />
          <meshStandardMaterial color="#3a2618" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.6, 0]} castShadow>
          <sphereGeometry args={[0.32, 12, 12]} />
          <meshStandardMaterial color="#2f5d2f" roughness={0.9} />
        </mesh>
      </group>
    ))}
  </>
);

const AreaLabels: React.FC = () => {
  const { areaMarkers } = useTableLayout();
  return (
    <>
      {areaMarkers.map((m) => (
        <Html key={m.label} position={[m.position[0], 0.05, m.position[2]]} center distanceFactor={14} style={{ pointerEvents: "none" }}>
          <div className="px-3 py-0.5 rounded-full text-[9px] font-medium tracking-[0.2em] uppercase border border-primary/30 bg-black/40 text-primary backdrop-blur-sm whitespace-nowrap">
            {m.label}
          </div>
        </Html>
      ))}
    </>
  );
};

const CameraRig: React.FC<{ preset: keyof typeof cameraPresets }> = ({ preset }) => {
  const { camera, controls } = useThree() as any;
  const animRef = useRef({ active: false, t: 0, fromPos: new THREE.Vector3(), toPos: new THREE.Vector3(), fromTarget: new THREE.Vector3(), toTarget: new THREE.Vector3() });

  useEffect(() => {
    const p = cameraPresets[preset];
    if (!p || !controls) return;
    animRef.current.active = true;
    animRef.current.t = 0;
    animRef.current.fromPos.copy(camera.position);
    animRef.current.toPos.set(...p.position);
    animRef.current.fromTarget.copy(controls.target);
    animRef.current.toTarget.set(...p.target);
  }, [preset, camera, controls]);

  

  React.useEffect(() => {
    let raf = 0;
    const tick = () => {
      const a = animRef.current;
      if (a.active && controls) {
        a.t = Math.min(1, a.t + 0.02);
        const e = 1 - Math.pow(1 - a.t, 3);
        camera.position.lerpVectors(a.fromPos, a.toPos, e);
        controls.target.lerpVectors(a.fromTarget, a.toTarget, e);
        controls.update();
        if (a.t >= 1) a.active = false;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [camera, controls]);

  return null;
};

const TableScene: React.FC<TableSceneProps> = ({ onSelectTable, selectedTable, cameraPreset }) => {
  const { tables } = useTableLayout();
  const { theme } = useTheme();
  const bg = theme === "dark" ? "#0a0805" : "#f4ecdc";

  return (
    <Canvas
      shadows
      camera={{ position: [0, 9, 13], fov: 45 }}
      style={{ background: bg }}
      gl={{ antialias: true }}
      dpr={[1, 1.6]}
    >
      <Suspense fallback={null}>
        <fog attach="fog" args={[bg, 18, 36]} />
        <ambientLight intensity={theme === "dark" ? 0.25 : 0.6} color={theme === "dark" ? "#ffd9a0" : "#fff5e0"} />
        <directionalLight position={[6, 10, 5]} intensity={theme === "dark" ? 0.45 : 0.9} color={theme === "dark" ? "#ffcc88" : "#fff8e6"} castShadow shadow-mapSize={[1024, 1024]} />
        <hemisphereLight args={[theme === "dark" ? "#3a2a15" : "#cfe0ff", "#0a0a0a", 0.25]} />

        <LightFloor theme={theme} />
        <Walls theme={theme} />
        <Chandeliers />
        <Plants />
        <AreaLabels />

        <ContactShadows position={[0, 0.015, 1]} opacity={0.45} scale={26} blur={2.5} far={8} />

        {tables.map((table) => (
          <TableModel
            key={table.id}
            table={table}
            onSelect={onSelectTable}
            isSelected={selectedTable?.id === table.id}
            theme={theme}
          />
        ))}

        <OrbitControls
          makeDefault
          enablePan
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={4}
          maxDistance={26}
          target={[0, 0, 1]}
          enableDamping
          dampingFactor={0.08}
        />
        <CameraRig preset={cameraPreset} />
      </Suspense>
    </Canvas>
  );
};

export default TableScene;
