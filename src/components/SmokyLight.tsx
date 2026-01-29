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

// Volumetric god rays through smoke — fBM noise haze with radial light shafts
const fragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  uniform float uMouseInfluence;

  varying vec2 vUv;

  // Hash for noise
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  // Smooth value noise
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

  // Fractal Brownian Motion — 5 octaves for rich organic smoke
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 uvAspect = uv * aspect;

    float t = uTime;

    // Light source position — upper center, partially tracks mouse
    vec2 lightPos = vec2(0.5 * aspect.x, 0.85);
    vec2 mouseNorm = uMouse * aspect;
    lightPos += (mouseNorm - lightPos) * 0.3 * uMouseInfluence;

    // Vector from pixel to light
    vec2 toLight = lightPos - uvAspect;
    float distToLight = length(toLight);
    float angle = atan(toLight.y, toLight.x);

    // --- God rays ---
    // Angular noise breaks beams into irregular shafts
    float rayNoise = fbm(vec2(angle * 3.0, t * 0.15));
    float rays = smoothstep(0.35, 0.7, rayNoise);
    // Rays fade with distance from source
    float rayFalloff = exp(-distToLight * 1.2);
    rays *= rayFalloff;

    // Additional angular variation for shaft width
    float shaftDetail = noise(vec2(angle * 8.0 + t * 0.1, distToLight * 2.0));
    rays *= smoothstep(0.3, 0.6, shaftDetail);

    // --- Smoke / haze (fBM) ---
    vec2 smokeUV = uvAspect * 2.0;
    // Slow drift
    smokeUV += vec2(t * 0.04, t * 0.02);

    // Mouse parts the smoke — push smoke coords away from cursor
    vec2 mouseDelta = uvAspect - mouseNorm;
    float mouseDist = length(mouseDelta);
    float mouseRepel = smoothstep(0.4, 0.0, mouseDist) * uMouseInfluence * 0.6;
    smokeUV += normalize(mouseDelta + 0.001) * mouseRepel;

    float smoke = fbm(smokeUV);
    // Second layer at different scale for depth
    float smoke2 = fbm(smokeUV * 1.8 + vec2(5.2, 3.7) + t * 0.03);
    smoke = smoke * 0.6 + smoke2 * 0.4;

    // Smoke density — creates gaps and thick patches
    float smokeDensity = smoothstep(0.25, 0.65, smoke);

    // --- Combine: light through smoke ---
    // Light is visible where rays exist AND smoke is thin (or at edges of smoke)
    float lightThrough = rays * (1.0 - smokeDensity * 0.7);

    // Ambient haze glow near light source
    float haze = exp(-distToLight * 0.8) * 0.3;
    haze *= smokeDensity;

    // Mouse proximity brightens nearby area subtly
    float mouseGlow = smoothstep(0.35, 0.0, mouseDist) * uMouseInfluence * 0.15;

    float intensity = lightThrough + haze + mouseGlow;

    // Warm cream/amber color
    vec3 lightColor = vec3(0.95, 0.88, 0.65);
    // Slightly cooler at edges
    vec3 edgeColor = vec3(0.7, 0.75, 0.82);
    vec3 color = mix(edgeColor, lightColor, rayFalloff);

    float alpha = clamp(intensity * 0.85, 0.0, 1.0);
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

      // Smooth mouse interpolation
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.06;

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
