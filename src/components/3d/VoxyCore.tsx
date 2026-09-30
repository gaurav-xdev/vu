"use client";

import { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// ─── Device capability detection ───────────────────────────────────────────────

function useDeviceCapability() {
  const [tier, setTier] = useState<"high" | "medium" | "low" | "none">("high");

  useEffect(() => {
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      setTier("none");
      return;
    }

    // Check mobile
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

    // Check hardware concurrency
    const cores = navigator.hardwareConcurrency ?? 4;

    // Attempt WebGL context
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) {
      setTier("none");
      return;
    }

    // Check renderer
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = debugInfo
      ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      : "";
    const isIntegrated =
      /intel|llvmpipe|software/i.test(renderer) && !/iris|arc/i.test(renderer);

    if (isMobile) {
      setTier("low");
    } else if (isIntegrated || cores < 4) {
      setTier("medium");
    } else {
      setTier("high");
    }
  }, []);

  return tier;
}

// ─── Vertex Shader ─────────────────────────────────────────────────────────────

const vertexShader = `
  uniform float uTime;
  uniform float uMouse;
  uniform vec2 uMousePos;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;

  // Simplex-style noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vUv = uv;
    vNormal = normal;

    vec3 pos = position;

    float slowTime = uTime * 0.3;
    float n1 = snoise(vec3(pos.x * 1.8 + slowTime * 0.5, pos.y * 1.8, pos.z * 1.8));
    float n2 = snoise(vec3(pos.x * 3.2 - slowTime * 0.3, pos.y * 3.2 + slowTime * 0.2, pos.z * 3.2));
    float n3 = snoise(vec3(pos.x * 0.8 + slowTime * 0.15, pos.y * 0.8, pos.z * 0.8 - slowTime * 0.1));

    float combinedNoise = n1 * 0.06 + n2 * 0.025 + n3 * 0.04;

    // Mouse influence
    vec3 mouseDir = normalize(vec3(uMousePos, 0.5) - vec3(0.5));
    float mouseDot = dot(normalize(pos), mouseDir);
    float mouseEffect = pow(max(0.0, mouseDot), 3.0) * uMouse * 0.08;

    pos += normal * (combinedNoise + mouseEffect);

    vPosition = pos;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// ─── Fragment Shader ──────────────────────────────────────────────────────────

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform float uOpacity;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition - vPosition);

    // Fresnel
    float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 3.0);

    // Base gradient from normal
    float rim = dot(normal, vec3(0.0, 1.0, 0.3));
    float energyGlow = dot(normal, normalize(vec3(0.3, 0.5, 1.0)));

    // Time-based color shift
    float t = sin(uTime * 0.2 + vPosition.y * 2.0) * 0.5 + 0.5;
    float t2 = sin(uTime * 0.15 + vPosition.x * 3.0) * 0.5 + 0.5;

    vec3 col = mix(uColorA, uColorB, t);
    col = mix(col, uColorC, t2 * 0.4);

    // Fresnel rim
    col += uColorC * fresnel * 0.8;

    // Specular
    vec3 lightDir = normalize(vec3(1.0, 1.5, 2.0));
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), 64.0);
    col += vec3(0.9, 0.85, 1.0) * spec * 0.5;

    // Internal glow
    float internalGlow = pow(max(energyGlow, 0.0), 2.0);
    col += uColorC * internalGlow * 0.15;

    // Opacity with fresnel boost
    float alpha = uOpacity + fresnel * 0.15;

    gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
  }
`;

// ─── The Core Mesh ─────────────────────────────────────────────────────────────

function CoreMesh({
  mousePos,
  quality,
}: {
  mousePos: React.RefObject<{ x: number; y: number }>;
  quality: "high" | "medium" | "low";
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  const segments = quality === "high" ? 128 : quality === "medium" ? 64 : 32;

  const geometry = useMemo(
    () => new THREE.SphereGeometry(1, segments, segments),
    [segments]
  );

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: 0 },
      uMousePos: { value: new THREE.Vector2(0.5, 0.5) },
      uColorA: { value: new THREE.Color("#1a1040") },
      uColorB: { value: new THREE.Color("#2d1b6e") },
      uColorC: { value: new THREE.Color("#7c6aff") },
      uOpacity: { value: 0.88 },
    }),
    []
  );

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
        side: THREE.FrontSide,
        depthWrite: false,
      }),
    [uniforms]
  );

  useEffect(() => {
    // Position camera
    camera.position.set(0, 0, 3.5);
  }, [camera]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const elapsed = clock.getElapsedTime();

    uniforms.uTime.value = elapsed;

    // Smooth mouse tracking
    const mx = mousePos.current?.x ?? 0.5;
    const my = mousePos.current?.y ?? 0.5;

    uniforms.uMousePos.value.x += (mx - uniforms.uMousePos.value.x) * 0.06;
    uniforms.uMousePos.value.y += ((1 - my) - uniforms.uMousePos.value.y) * 0.06;

    const mouseDistance = Math.sqrt(
      (mx - 0.5) ** 2 + (my - 0.5) ** 2
    );
    uniforms.uMouse.value +=
      (mouseDistance * 2 - uniforms.uMouse.value) * 0.08;

    // Slow rotation
    meshRef.current.rotation.y = elapsed * 0.1;
    meshRef.current.rotation.x = Math.sin(elapsed * 0.08) * 0.1;

    // Subtle float
    meshRef.current.position.y = Math.sin(elapsed * 0.4) * 0.04;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} material={material} />
  );
}

// ─── Ambient Particles ────────────────────────────────────────────────────────

function Particles({ count = 80 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.4 + Math.random() * 1.2;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      sizes[i] = Math.random() * 2 + 0.5;
    }

    return { positions, sizes };
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.02;
    ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.01) * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#7c6aff"
        size={0.012}
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ─── Inner Ring ───────────────────────────────────────────────────────────────

function Ring() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.z = clock.getElapsedTime() * 0.15;
    ref.current.rotation.x = Math.PI / 2 + Math.sin(clock.getElapsedTime() * 0.2) * 0.1;
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[1.35, 0.004, 2, 120]} />
      <meshBasicMaterial
        color="#7c6aff"
        transparent
        opacity={0.25}
      />
    </mesh>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────

function Scene({
  mousePos,
  quality,
}: {
  mousePos: React.RefObject<{ x: number; y: number }>;
  quality: "high" | "medium" | "low";
}) {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[3, 3, 3]} intensity={0.8} color="#9580ff" />
      <pointLight position={[-3, -2, 2]} intensity={0.4} color="#4040cc" />
      <CoreMesh mousePos={mousePos} quality={quality} />
      {quality !== "low" && <Particles count={quality === "high" ? 80 : 40} />}
      <Ring />
    </>
  );
}

// ─── Static Fallback ──────────────────────────────────────────────────────────

function StaticFallback() {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      aria-hidden="true"
    >
      <div
        className="w-48 h-48 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 40% 35%, #2d1b6e 0%, #1a1040 50%, #080810 100%)",
          boxShadow: "0 0 80px -10px rgba(124, 106, 255, 0.4)",
        }}
      />
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

interface VoxyCoreProps {
  className?: string;
}

export function VoxyCore({ className }: VoxyCoreProps) {
  const tier = useDeviceCapability();
  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mousePos.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      aria-hidden="true"
      role="img"
    >
      {tier === "none" ? (
        <StaticFallback />
      ) : (
        <Canvas
          dpr={tier === "high" ? [1, 2] : [1, 1]}
          gl={{
            antialias: tier === "high",
            alpha: true,
            powerPreference: tier === "high" ? "high-performance" : "low-power",
            failIfMajorPerformanceCaveat: false,
          }}
          camera={{ position: [0, 0, 3.5], fov: 40 }}
          style={{ background: "transparent" }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <Suspense fallback={null}>
            <Scene mousePos={mousePos} quality={tier} />
          </Suspense>
          {tier === "high" && (
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate={false}
              enableRotate={false}
            />
          )}
        </Canvas>
      )}
    </div>
  );
}
