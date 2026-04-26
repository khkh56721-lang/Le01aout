"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";

/* Main rotating torus (the big ring) */
function GoldTorus() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.18;
    ref.current.rotation.y += delta * 0.28;
  });
  return (
    <mesh ref={ref} castShadow>
      <torusGeometry args={[1.4, 0.38, 64, 128]} />
      <meshStandardMaterial
        color="#C9A84C"
        metalness={0.95}
        roughness={0.08}
        envMapIntensity={2.5}
      />
    </mesh>
  );
}

/* Small orbiting knot */
function GoldKnot() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.x = Math.sin(t * 0.4) * 2.6;
    ref.current.position.y = Math.cos(t * 0.4) * 1.2;
    ref.current.position.z = Math.cos(t * 0.4) * 1.0;
    ref.current.rotation.x += 0.008;
    ref.current.rotation.z += 0.006;
  });
  return (
    <mesh ref={ref} scale={0.22}>
      <torusKnotGeometry args={[1, 0.35, 128, 32]} />
      <meshStandardMaterial
        color="#E8C96A"
        metalness={0.98}
        roughness={0.05}
        envMapIntensity={3}
      />
    </mesh>
  );
}

/* Second orbiting ring at a different angle */
function OrbitRing() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + 2;
    ref.current.position.x = Math.cos(t * 0.3) * 2.2;
    ref.current.position.y = Math.sin(t * 0.3) * 0.8;
    ref.current.position.z = Math.sin(t * 0.3) * 1.5;
    ref.current.rotation.y += 0.01;
    ref.current.rotation.x += 0.005;
  });
  return (
    <mesh ref={ref} scale={0.18}>
      <torusGeometry args={[1, 0.4, 32, 64]} />
      <meshStandardMaterial
        color="#B8943C"
        metalness={0.9}
        roughness={0.12}
        envMapIntensity={2}
      />
    </mesh>
  );
}

/* Floating diamond/octahedron */
function GoldDiamond() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * 0.5;
    ref.current.position.y = Math.sin(t) * 0.4 - 0.8;
    ref.current.position.x = Math.cos(t * 0.7) * 0.3 - 1.8;
    ref.current.rotation.y += 0.012;
    ref.current.rotation.x += 0.007;
  });
  return (
    <mesh ref={ref} scale={0.28}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#D4AF50"
        metalness={1}
        roughness={0.04}
        envMapIntensity={3.5}
      />
    </mesh>
  );
}

/* Scene lighting */
function Lights() {
  return (
    <>
      <ambientLight intensity={0.3} color="#1A1A2E" />
      <directionalLight position={[4, 6, 3]} intensity={3} color="#FFD700" castShadow />
      <directionalLight position={[-4, -2, -4]} intensity={1.5} color="#4040AA" />
      <pointLight position={[0, -4, 2]} intensity={2} color="#C9A84C" distance={10} />
      <pointLight position={[5, 0, -2]} intensity={1} color="#FF9900" distance={8} />
    </>
  );
}

export default function LuxuryScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
      dpr={[1, 2]}
    >
      <Lights />
      <Environment preset="city" />

      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
        <GoldTorus />
      </Float>

      <GoldKnot />
      <OrbitRing />
      <GoldDiamond />
    </Canvas>
  );
}
