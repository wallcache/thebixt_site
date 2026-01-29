"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Domain-warped smoke — large organic shapes that fold and rotate, light through trees
const fragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  uniform float uMouseInfluence;

  varying vec2 vUv;

  // 2D rotation matrix
  mat2 rot(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // fBM with rotation per octave — produces folding, turbulent shapes
  float fbm(vec2 p) {
    float value = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amp * noise(p);
      p = rot(0.75) * p * 2.0 + vec2(1.7, 9.2);
      amp *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;
    float ar = uResolution.x / uResolution.y;
    vec2 p = vec2((uv.x - 0.5) * ar, uv.y - 0.5);

    float t = uTime;

    // Mouse in same coordinate space
    vec2 mouse = vec2((uMouse.x - 0.5) * ar, uMouse.y - 0.5);

    // --- Domain warping (Inigo Quilez style) ---

    // Base coordinates — large scale, slow drift
    vec2 q = p * 1.2;
    q += mouse * uMouseInfluence * 0.35;
    q += vec2(t * 0.03, t * 0.02);

    // First warp — large shapes
    float n1 = fbm(q);
    vec2 warp1 = vec2(n1, fbm(q + vec2(5.2, 1.3)));

    // Mouse rotation of warp field
    float mouseAngle = atan(mouse.y, mouse.x + 0.001);
    warp1 = rot(mouseAngle * 0.3 * uMouseInfluence) * warp1;

    // Second warp — folding
    vec2 r = q + warp1 * 1.6 + vec2(t * 0.04, -t * 0.03);
    r += mouse * uMouseInfluence * 0.2;
    float n2 = fbm(r);
    vec2 warp2 = vec2(n2, fbm(r + vec2(8.3, 2.8)));

    // Third warp — deep folding
    vec2 s = q + warp2 * 1.4 + vec2(-t * 0.02, t * 0.05);
    float n3 = fbm(s);

    // --- Smoke pattern ---
    float smoke = n3;
    float lightThrough = smoothstep(0.55, 0.3, smoke);
    float shadow = smoothstep(0.3, 0.6, smoke) * 0.4;

    // Edge glow where light meets shadow
    float edgeGlow = 1.0 - smoothstep(0.0, 0.08, abs(smoke - 0.42));
    edgeGlow *= 0.3;

    // --- Radial light from top-right ---
    // Light source in top-right corner
    vec2 lightSrc = vec2(0.5 * ar, 0.5);  // top-right in centered coords
    vec2 toLight = lightSrc - p;
    float distFromLight = length(toLight);
    float angleFromLight = atan(toLight.y, toLight.x);

    // Radial falloff — brighter near source, fades across screen
    float radialFalloff = exp(-distFromLight * 1.0);

    // --- Light streaks ---
    // Radial rays spreading out from the top-right light source
    // Use angle from light + noise to create irregular shafts
    float rayAngle = angleFromLight;
    vec2 streakUV = vec2(rayAngle * 3.0, distFromLight * 1.5);
    streakUV += mouse * uMouseInfluence * 0.2;
    streakUV.x += t * 0.03;

    float streakNoise = fbm(streakUV);
    // Wide bright shafts
    float streaks = smoothstep(0.3, 0.5, streakNoise) * smoothstep(0.7, 0.5, streakNoise);
    // Broader soft glow
    float softStreaks = smoothstep(0.2, 0.45, streakNoise) * smoothstep(0.8, 0.55, streakNoise);

    // Streaks follow radial falloff and show through smoke gaps
    float streakMask = smoothstep(0.55, 0.3, smoke) * radialFalloff;
    streaks *= streakMask;
    softStreaks *= streakMask;

    // Mouse proximity glow
    float pMouseDist = length(p - mouse);
    float mouseGlow = smoothstep(0.5, 0.0, pMouseDist) * uMouseInfluence * 0.15;

    // Final intensity — radial light + smoke + streaks
    float intensity = lightThrough * 0.22 * (0.4 + radialFalloff * 0.6);
    intensity += edgeGlow * (0.5 + radialFalloff * 0.5);
    intensity += mouseGlow;
    intensity += streaks * 0.4 + softStreaks * 0.15;
    intensity -= shadow * 0.12;
    intensity = clamp(intensity, 0.0, 1.0);

    // Warm cream/amber palette — warmer near light source
    vec3 warmLight = vec3(0.95, 0.88, 0.65);
    vec3 coolHaze = vec3(0.55, 0.6, 0.65);
    vec3 streakColor = vec3(1.0, 0.92, 0.72);
    vec3 color = mix(coolHaze, warmLight, radialFalloff * 0.7 + lightThrough * 0.3);
    color = mix(color, streakColor, (streaks + softStreaks * 0.3) * streakMask);

    float alpha = intensity * 0.7;
    gl_FragColor = vec4(color * alpha, alpha);
  }
`;

interface SmokyLightProps {
  className?: string;
  style?: React.CSSProperties;
  speed?: number;
  mouseInfluence?: number;
}

export default function SmokyLight({
  className = "",
  style = {},
  speed = 1.0,
  mouseInfluence = 1.0,
}: SmokyLightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      targetMouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: 1.0 - (e.clientY - rect.top) / rect.height,
      };
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uResolution: { value: new THREE.Vector2(width, height) },
        uMouseInfluence: { value: mouseInfluence },
      },
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const startTime = performance.now();

    const animate = () => {
      const elapsed = (performance.now() - startTime) / 1000;

      // Smooth mouse interpolation — steady but responsive
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.035;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.035;

      material.uniforms.uTime.value = elapsed * speed;
      material.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);

      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      material.uniforms.uResolution.value.set(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [speed, mouseInfluence, handleMouseMove]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height: "100%", overflow: "hidden", ...style }}
    />
  );
}
