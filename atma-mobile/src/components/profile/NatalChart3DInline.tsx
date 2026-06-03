/**
 * Atma Vedika — NatalChart3DInline (web)
 *
 * Versão compacta da cena 3D do mapa natal, para ser embedada
 * como visual dentro de um ThemeLayerCard. Tamanho fixo, sem sheet.
 * Tap em planeta apenas destaca visualmente (sem abrir info).
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';

import { palette } from '@/theme/colors';
import {
  buildPlanetPlacements,
  type PlanetPlacement,
} from '@/services/natalChart3d';
import type { BirthChart } from '@/types/chart';

export interface NatalChart3DInlineProps {
  chart: BirthChart;
  size?: number;
}

export function NatalChart3DInline({
  chart,
  size = 320,
}: NatalChart3DInlineProps) {
  const placements = useMemo(() => buildPlanetPlacements(chart), [chart]);
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <View style={[styles.placeholder, { width: size, height: size }]} />;

  return (
    <View style={{ width: size, height: size }}>
      <Canvas
        style={{ width: size, height: size } as object}
        camera={{ position: [0, 6.5, 14.5], fov: 48, near: 0.1, far: 100 }}
        onPointerMissed={() => setSelected(null)}
      >
        <ambientLight intensity={0.18} />
        <pointLight
          position={[0, 0, 0]}
          intensity={3}
          color={palette.gold.glow}
          distance={20}
          decay={1.5}
        />
        <pointLight
          position={[8, 6, 6]}
          intensity={0.6}
          color={palette.mystic.soul}
        />
        <Starfield count={200} />
        <Universe
          placements={placements}
          selected={selected}
          onSelect={setSelected}
        />
      </Canvas>
    </View>
  );
}

// ─── Universo rotativo ─────────────────────────────────

interface UniverseProps {
  placements: PlanetPlacement[];
  selected: string | null;
  onSelect: (name: string | null) => void;
}

function Universe({ placements, selected, onSelect }: UniverseProps) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.06;
    }
  });

  return (
    <group ref={groupRef}>
      <AtmaCore />
      {placements.map((p) => (
        <OrbitRing key={`ring-${p.name}`} radius={p.visual.ringRadius} />
      ))}
      {placements.map((p) => (
        <Planet
          key={p.name}
          placement={p}
          isSelected={selected === p.name}
          onClick={() => onSelect(p.name)}
        />
      ))}
    </group>
  );
}

function AtmaCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const breathe = 1 + Math.sin(t * 1.4) * 0.08;
    if (meshRef.current) meshRef.current.scale.setScalar(breathe);
    if (haloRef.current) {
      haloRef.current.scale.setScalar(breathe * 1.4);
      haloRef.current.rotation.y = t * 0.4;
    }
  });
  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.4, 24, 24]} />
        <meshStandardMaterial
          color={palette.gold.bright}
          emissive={palette.gold.pure}
          emissiveIntensity={2.4}
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshBasicMaterial
          color={palette.gold.glow}
          transparent
          opacity={0.22}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

interface OrbitRingProps {
  radius: number;
}
function OrbitRing({ radius }: OrbitRingProps) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.008, 8, 96]} />
      <meshBasicMaterial color={palette.gold.deep} transparent opacity={0.22} />
    </mesh>
  );
}

interface PlanetProps {
  placement: PlanetPlacement;
  isSelected: boolean;
  onClick: () => void;
}
function Planet({ placement, isSelected, onClick }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetScale = isSelected ? 1.35 : 1;
  useFrame(() => {
    if (meshRef.current) {
      const cur = meshRef.current.scale.x;
      const next = cur + (targetScale - cur) * 0.12;
      meshRef.current.scale.setScalar(next);
    }
  });
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick();
  };
  return (
    <group position={placement.position}>
      <mesh>
        <sphereGeometry args={[placement.visual.sphereRadius * 1.5, 12, 12]} />
        <meshBasicMaterial
          color={placement.visual.emissive}
          transparent
          opacity={0.18}
          side={THREE.BackSide}
        />
      </mesh>
      <mesh ref={meshRef} onClick={handleClick} onPointerDown={handleClick}>
        <sphereGeometry args={[placement.visual.sphereRadius, 20, 20]} />
        <meshStandardMaterial
          color={placement.visual.color}
          emissive={placement.visual.emissive}
          emissiveIntensity={isSelected ? 1.6 : 0.7}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}

interface StarfieldProps {
  count: number;
}
function Starfield({ count }: StarfieldProps) {
  const ref = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 28 + Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [count]);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.005;
  });
  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        color={palette.silver.soft}
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.85}
      />
    </points>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: 'rgba(2,1,8,0.5)',
    borderRadius: 8,
  },
});
