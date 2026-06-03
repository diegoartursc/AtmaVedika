/**
 * Atma Vedika — NatalChart3D (web)
 *
 * Cena Three.js do mapa natal:
 *   - Centro: atma core (glow dourado pulsante)
 *   - 9 anéis orbitais sutis
 *   - 9 esferas planetárias com cores/glows próprios
 *   - Starfield denso de fundo
 *   - Rotação automática lenta
 *   - Tap em planeta → callback
 *
 * Implementação web/SSR via @react-three/fiber.
 * Versão native: ver NatalChart3D.native.tsx (placeholder até dev build).
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';

import { palette } from '@/theme/colors';
import {
  buildPlanetPlacements,
  type PlanetPlacement,
} from '@/services/natalChart3d';
import type { BirthChart } from '@/types/chart';

export interface NatalChart3DProps {
  chart: BirthChart;
  selectedPlanetName: PlanetPlacement['name'] | null;
  onSelectPlanet: (planet: PlanetPlacement | null) => void;
}

export function NatalChart3D({
  chart,
  selectedPlanetName,
  onSelectPlanet,
}: NatalChart3DProps) {
  const placements = useMemo(() => buildPlanetPlacements(chart), [chart]);
  const [mounted, setMounted] = useState(false);

  // Garante que o Canvas só monta no client (Expo Router faz static SSR).
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <Canvas
      style={{ flex: 1, width: '100%', height: '100%' } as object}
      camera={{ position: [0, 6.5, 14.5], fov: 48, near: 0.1, far: 100 }}
      onPointerMissed={() => onSelectPlanet(null)}
      gl={{ alpha: false, antialias: true }}
    >
      <color attach="background" args={[palette.void.abyss]} />
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

      <Starfield count={420} />

      <Universe
        placements={placements}
        selectedPlanetName={selectedPlanetName}
        onSelectPlanet={onSelectPlanet}
      />
    </Canvas>
  );
}

// ─── Universo rotativo ─────────────────────────────────

interface UniverseProps {
  placements: PlanetPlacement[];
  selectedPlanetName: PlanetPlacement['name'] | null;
  onSelectPlanet: (planet: PlanetPlacement | null) => void;
}

function Universe({
  placements,
  selectedPlanetName,
  onSelectPlanet,
}: UniverseProps) {
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
          isSelected={selectedPlanetName === p.name}
          onClick={() => onSelectPlanet(p)}
        />
      ))}
    </group>
  );
}

// ─── Atma Core (centro) ────────────────────────────────

function AtmaCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const breathe = 1 + Math.sin(t * 1.4) * 0.08;
    if (meshRef.current) {
      meshRef.current.scale.setScalar(breathe);
    }
    if (haloRef.current) {
      haloRef.current.scale.setScalar(breathe * 1.4);
      haloRef.current.rotation.y = t * 0.4;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color={palette.gold.bright}
          emissive={palette.gold.pure}
          emissiveIntensity={2.4}
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.55, 24, 24]} />
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

// ─── Anel orbital ─────────────────────────────────────

interface OrbitRingProps {
  radius: number;
}

function OrbitRing({ radius }: OrbitRingProps) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.008, 8, 128]} />
      <meshBasicMaterial
        color={palette.gold.deep}
        transparent
        opacity={0.22}
      />
    </mesh>
  );
}

// ─── Planeta ──────────────────────────────────────────

interface PlanetProps {
  placement: PlanetPlacement;
  isSelected: boolean;
  onClick: () => void;
}

function Planet({ placement, isSelected, onClick }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  const targetScale = isSelected ? 1.35 : 1;

  useFrame(() => {
    if (meshRef.current) {
      const cur = meshRef.current.scale.x;
      const next = cur + (targetScale - cur) * 0.12;
      meshRef.current.scale.setScalar(next);
    }
    if (haloRef.current) {
      const cur = haloRef.current.scale.x;
      const next = cur + (targetScale * 1.5 - cur) * 0.12;
      haloRef.current.scale.setScalar(next);
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <group position={placement.position}>
      {/* Halo */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[placement.visual.sphereRadius * 1.6, 16, 16]} />
        <meshBasicMaterial
          color={placement.visual.emissive}
          transparent
          opacity={0.18}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Planeta */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerDown={handleClick}
      >
        <sphereGeometry args={[placement.visual.sphereRadius, 24, 24]} />
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

// ─── Starfield (background) ────────────────────────────

interface StarfieldProps {
  count: number;
}

function Starfield({ count }: StarfieldProps) {
  const ref = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribuição em casca esférica grande
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
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.005;
    }
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        color={palette.silver.soft}
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.85}
      />
    </points>
  );
}
