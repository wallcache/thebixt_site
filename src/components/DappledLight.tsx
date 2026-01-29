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

// Rain-on-pavement ripple effect — more rain near mouse, fluid & liquidy
const fragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  uniform float uMouseInfluence;

  varying vec2 vUv;

  // Hash functions for pseudo-random per-cell values
  vec2 hash22(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
  }
  float hash12(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  // Single raindrop ripple layer at a given grid scale
  float rippleLayer(vec2 uv, float t, float scale, float speed) {
    float result = 0.0;
    vec2 p = uv * scale;
    vec2 cell = floor(p);
    vec2 f = fract(p);

    // Check 3x3 neighbourhood for drops
    for (int x = -1; x <= 1; x++) {
      for (int y = -1; y <= 1; y++) {
        vec2 neighbour = vec2(float(x), float(y));
        vec2 id = cell + neighbour;

        // Random drop position within cell and time phase
        vec2 dropOffset = hash22(id);
        float phase = hash12(id + 0.5);

        vec2 diff = neighbour + dropOffset - f;
        float dist = length(diff);

        // Repeating drop cycle — each drop restarts at a random phase
        float cycle = fract(t * speed + phase);

        // Expanding ring radius
        float radius = cycle * 0.9;

        // Ring shape: thin band at the expanding edge
        float ring = 1.0 - smoothstep(0.0, 0.06, abs(dist - radius));

        // Fade out as ripple expands
        float fade = (1.0 - cycle) * (1.0 - cycle);

        // Only show if drop has "landed" (dist < max radius)
        float visible = smoothstep(0.9, 0.0, dist);

        result += ring * fade * visible;
      }
    }
    return result;
  }

  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 uvAspect = uv * aspect;

    // Mouse proximity — controls rain density/brightness
    vec2 mouseNorm = uMouse * aspect;
    float mouseDist = length(mouseNorm - uvAspect);
    float mouseProximity = smoothstep(1.0, 0.0, mouseDist) * uMouseInfluence;

    float t = uTime;

    // Multiple ripple layers at different scales and speeds for depth
    float r1 = rippleLayer(uvAspect, t, 5.0, 0.4);
    float r2 = rippleLayer(uvAspect + 3.7, t, 8.0, 0.55);
    float r3 = rippleLayer(uvAspect + 7.3, t, 12.0, 0.7);

    // Combine — larger scale (r1) is bolder, smaller scales are subtler
    float ripples = r1 * 0.6 + r2 * 0.45 + r3 * 0.3;

    // Apply mouse proximity — more rain near cursor
    float intensity = ripples * (0.15 + mouseProximity * 1.2);

    // Wet pavement highlight colour — brighter cool blue-white
    vec3 color = vec3(0.7, 0.82, 0.95);

    float alpha = clamp(intensity * 1.2, 0.0, 1.0);
    gl_FragColor = vec4(color * alpha, alpha);
  }
`;

interface DappledLightProps {
  className?: string;
  style?: React.CSSProperties;
  speed?: number;
  mouseInfluence?: number;
}

export default function DappledLight({
  className = "",
  style = {},
  speed = 1.0,
  mouseInfluence = 1.0,
}: DappledLightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 });

  // Track mouse on window so the effect works even when hovering elements above (e.g. nav)
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

    // Listen on window so the effect tracks the mouse even over elements above (nav, etc.)
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
