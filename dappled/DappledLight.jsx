'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

/**
 * DappledLight - A WebGL shader component creating organic, 
 * mouse-reactive dappled sunlight effects
 * 
 * For Next.js/React - drops in as a full-screen background or container fill
 */

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  uniform float uMouseInfluence;
  
  varying vec2 vUv;
  
  // Simplex 2D noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                     + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                            dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  // Fractal Brownian Motion for organic layering
  float fbm(vec2 p, int octaves) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 6; i++) {
      if (i >= octaves) break;
      value += amplitude * snoise(p * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
  
  // Soft caustic pattern - like light through water or leaves
  float caustic(vec2 uv, float time) {
    vec2 p = uv * 3.0;
    float c = 0.0;
    
    // Layer 1 - slow drift
    c += sin(p.x * 3.1 + time * 0.3 + sin(p.y * 2.7 + time * 0.2) * 2.0);
    c += sin(p.y * 2.9 + time * 0.25 + sin(p.x * 3.3 + time * 0.15) * 2.0);
    
    // Layer 2 - medium movement  
    c += sin(p.x * 5.2 - time * 0.4 + cos(p.y * 4.1 + time * 0.3) * 1.5) * 0.5;
    c += sin(p.y * 4.8 - time * 0.35 + cos(p.x * 5.5 + time * 0.25) * 1.5) * 0.5;
    
    // Layer 3 - fine detail
    c += sin(p.x * 8.1 + time * 0.5 + sin(p.y * 7.3 - time * 0.4) * 1.0) * 0.25;
    
    return c / 4.0;
  }
  
  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 uvAspect = uv * aspect;
    
    // Mouse influence - creates gentle warping toward cursor
    vec2 mouseNorm = uMouse * aspect;
    vec2 toMouse = mouseNorm - uvAspect;
    float mouseDist = length(toMouse);
    float mouseEffect = smoothstep(0.8, 0.0, mouseDist) * uMouseInfluence;
    
    // Warp UV based on mouse position
    vec2 warpedUv = uv + toMouse * mouseEffect * 0.05;
    
    // Time variations
    float slowTime = uTime * 0.15;
    float medTime = uTime * 0.3;
    
    // Base noise layer - large scale movement
    float noise1 = fbm(warpedUv * 2.0 + vec2(slowTime * 0.5, slowTime * 0.3), 4);
    
    // Secondary noise - different scale and speed
    float noise2 = fbm(warpedUv * 4.0 - vec2(slowTime * 0.3, slowTime * 0.4), 3);
    
    // Caustic light patterns
    float caustic1 = caustic(warpedUv + noise1 * 0.1, slowTime);
    float caustic2 = caustic(warpedUv * 1.5 + noise2 * 0.05, slowTime * 1.3);
    
    // Combine patterns
    float pattern = noise1 * 0.4 + noise2 * 0.3 + caustic1 * 0.5 + caustic2 * 0.3;
    
    // Add mouse-reactive bright spot
    float mouseGlow = smoothstep(0.5, 0.0, mouseDist) * 0.3 * uMouseInfluence;
    pattern += mouseGlow;
    
    // Normalize and create light intensity
    float light = pattern * 0.5 + 0.5;
    light = smoothstep(0.2, 0.8, light);
    
    // Color palette - warm dappled sunlight
    // Base: warm cream/off-white
    vec3 shadowColor = vec3(0.92, 0.90, 0.85);  // Warm shadow
    vec3 lightColor = vec3(1.0, 0.98, 0.94);     // Bright warm light
    vec3 accentColor = vec3(1.0, 0.95, 0.80);    // Golden accent
    
    // Mix colors based on light intensity
    vec3 color = mix(shadowColor, lightColor, light);
    
    // Add golden tint to brightest areas
    float goldenMask = smoothstep(0.6, 0.9, light);
    color = mix(color, accentColor, goldenMask * 0.3);
    
    // Subtle vignette
    float vignette = 1.0 - smoothstep(0.4, 1.4, length(uv - 0.5) * 1.5);
    color *= 0.95 + vignette * 0.05;
    
    // Very subtle grain for organic feel
    float grain = snoise(uv * 500.0 + uTime) * 0.015;
    color += grain;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Dark variant shader - for dark mode sites
const fragmentShaderDark = `
  precision highp float;
  
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  uniform float uMouseInfluence;
  
  varying vec2 vUv;
  
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  float fbm(vec2 p, int octaves) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 6; i++) {
      if (i >= octaves) break;
      value += amplitude * snoise(p * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
  
  float caustic(vec2 uv, float time) {
    vec2 p = uv * 3.0;
    float c = 0.0;
    c += sin(p.x * 3.1 + time * 0.3 + sin(p.y * 2.7 + time * 0.2) * 2.0);
    c += sin(p.y * 2.9 + time * 0.25 + sin(p.x * 3.3 + time * 0.15) * 2.0);
    c += sin(p.x * 5.2 - time * 0.4 + cos(p.y * 4.1 + time * 0.3) * 1.5) * 0.5;
    c += sin(p.y * 4.8 - time * 0.35 + cos(p.x * 5.5 + time * 0.25) * 1.5) * 0.5;
    c += sin(p.x * 8.1 + time * 0.5 + sin(p.y * 7.3 - time * 0.4) * 1.0) * 0.25;
    return c / 4.0;
  }
  
  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 uvAspect = uv * aspect;
    
    vec2 mouseNorm = uMouse * aspect;
    vec2 toMouse = mouseNorm - uvAspect;
    float mouseDist = length(toMouse);
    float mouseEffect = smoothstep(0.8, 0.0, mouseDist) * uMouseInfluence;
    
    vec2 warpedUv = uv + toMouse * mouseEffect * 0.05;
    
    float slowTime = uTime * 0.15;
    
    float noise1 = fbm(warpedUv * 2.0 + vec2(slowTime * 0.5, slowTime * 0.3), 4);
    float noise2 = fbm(warpedUv * 4.0 - vec2(slowTime * 0.3, slowTime * 0.4), 3);
    
    float caustic1 = caustic(warpedUv + noise1 * 0.1, slowTime);
    float caustic2 = caustic(warpedUv * 1.5 + noise2 * 0.05, slowTime * 1.3);
    
    float pattern = noise1 * 0.4 + noise2 * 0.3 + caustic1 * 0.5 + caustic2 * 0.3;
    
    float mouseGlow = smoothstep(0.5, 0.0, mouseDist) * 0.3 * uMouseInfluence;
    pattern += mouseGlow;
    
    float light = pattern * 0.5 + 0.5;
    light = smoothstep(0.2, 0.8, light);
    
    // Dark palette - moonlight through trees
    vec3 shadowColor = vec3(0.06, 0.07, 0.09);   // Deep blue-black
    vec3 lightColor = vec3(0.12, 0.14, 0.18);    // Soft blue-grey
    vec3 accentColor = vec3(0.15, 0.17, 0.22);   // Silver accent
    
    vec3 color = mix(shadowColor, lightColor, light);
    
    float silverMask = smoothstep(0.6, 0.9, light);
    color = mix(color, accentColor, silverMask * 0.4);
    
    float vignette = 1.0 - smoothstep(0.4, 1.4, length(uv - 0.5) * 1.5);
    color *= 0.9 + vignette * 0.1;
    
    float grain = snoise(uv * 500.0 + uTime) * 0.02;
    color += grain;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function DappledLight({ 
  variant = 'light',  // 'light' or 'dark'
  className = '',
  style = {},
  intensity = 1.0,    // Overall effect intensity
  speed = 1.0,        // Animation speed multiplier
  mouseInfluence = 1.0 // How much mouse affects the pattern
}) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const materialRef = useRef(null);
  const frameRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 });
  
  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      targetMouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: 1.0 - (e.clientY - rect.top) / rect.height
      };
    }
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    targetMouseRef.current = { x: 0.5, y: 0.5 };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Camera
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;
    cameraRef.current = camera;
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Shader material
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: variant === 'dark' ? fragmentShaderDark : fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uResolution: { value: new THREE.Vector2(width, height) },
        uMouseInfluence: { value: mouseInfluence }
      }
    });
    materialRef.current = material;
    
    // Full-screen quad
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    // Animation loop
    let startTime = performance.now();
    
    const animate = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      
      // Smooth mouse interpolation
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.08;
      
      material.uniforms.uTime.value = elapsed * speed;
      material.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
      material.uniforms.uMouseInfluence.value = mouseInfluence;
      
      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Event listeners
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    
    // Resize handler
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      
      renderer.setSize(newWidth, newHeight);
      material.uniforms.uResolution.value.set(newWidth, newHeight);
    };
    
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(frameRef.current);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      resizeObserver.disconnect();
      
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [variant, speed, mouseInfluence, handleMouseMove, handleMouseLeave]);

  return (
    <div 
      ref={containerRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        ...style
      }}
    />
  );
}

// Named export for the dark variant as convenience
export function DappledLightDark(props) {
  return <DappledLight {...props} variant="dark" />;
}
