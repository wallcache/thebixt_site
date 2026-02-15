'use client';

import { useState } from 'react';
import DappledLight, { DappledLightDark } from './DappledLight';

/**
 * Demo page for the DappledLight component
 * Shows both light and dark variants with interactive controls
 */

export default function DappledLightDemo() {
  const [variant, setVariant] = useState('light');
  const [speed, setSpeed] = useState(1.0);
  const [mouseInfluence, setMouseInfluence] = useState(1.0);
  const [showControls, setShowControls] = useState(true);

  return (
    <div style={{ 
      position: 'relative', 
      width: '100vw', 
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* The shader background */}
      <DappledLight 
        variant={variant}
        speed={speed}
        mouseInfluence={mouseInfluence}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0
        }}
      />
      
      {/* Demo content overlay */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(2rem, 5vw, 4rem)',
          fontWeight: 400,
          letterSpacing: '-0.02em',
          color: variant === 'dark' ? '#e8e6e3' : '#2a2826',
          textAlign: 'center',
          marginBottom: '1rem',
          textShadow: variant === 'dark' 
            ? '0 2px 20px rgba(0,0,0,0.5)' 
            : '0 2px 20px rgba(255,255,255,0.5)'
        }}>
          Long Form Press
        </h1>
        
        <p style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          fontStyle: 'italic',
          color: variant === 'dark' ? '#a8a6a3' : '#5a5856',
          textAlign: 'center',
          letterSpacing: '0.05em'
        }}>
          Better read than dead
        </p>
      </div>

      {/* Control panel */}
      {showControls && (
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          background: variant === 'dark' 
            ? 'rgba(20, 22, 28, 0.9)' 
            : 'rgba(255, 253, 250, 0.9)',
          backdropFilter: 'blur(10px)',
          padding: '1.5rem 2rem',
          borderRadius: '12px',
          boxShadow: variant === 'dark'
            ? '0 4px 30px rgba(0,0,0,0.4)'
            : '0 4px 30px rgba(0,0,0,0.1)',
          display: 'flex',
          gap: '2rem',
          alignItems: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '0.875rem',
          color: variant === 'dark' ? '#e8e6e3' : '#2a2826'
        }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Theme:
            <select 
              value={variant} 
              onChange={(e) => setVariant(e.target.value)}
              style={{
                padding: '0.5rem',
                borderRadius: '6px',
                border: `1px solid ${variant === 'dark' ? '#3a3c42' : '#ddd'}`,
                background: variant === 'dark' ? '#2a2c32' : '#fff',
                color: 'inherit',
                cursor: 'pointer'
              }}
            >
              <option value="light">Light (Sunlight)</option>
              <option value="dark">Dark (Moonlight)</option>
            </select>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Speed: {speed.toFixed(1)}x
            <input 
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              style={{ width: '100px', cursor: 'pointer' }}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Mouse: {(mouseInfluence * 100).toFixed(0)}%
            <input 
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={mouseInfluence}
              onChange={(e) => setMouseInfluence(parseFloat(e.target.value))}
              style={{ width: '100px', cursor: 'pointer' }}
            />
          </label>
        </div>
      )}

      {/* Toggle controls button */}
      <button
        onClick={() => setShowControls(!showControls)}
        style={{
          position: 'absolute',
          bottom: '2rem',
          right: '2rem',
          zIndex: 10,
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          border: 'none',
          background: variant === 'dark' 
            ? 'rgba(20, 22, 28, 0.9)' 
            : 'rgba(255, 253, 250, 0.9)',
          color: variant === 'dark' ? '#e8e6e3' : '#2a2826',
          cursor: 'pointer',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '0.875rem',
          backdropFilter: 'blur(10px)',
          boxShadow: variant === 'dark'
            ? '0 4px 30px rgba(0,0,0,0.4)'
            : '0 4px 30px rgba(0,0,0,0.1)'
        }}
      >
        {showControls ? 'Hide Controls' : 'Show Controls'}
      </button>
    </div>
  );
}
