# Dappled Light Shader Component

A WebGL/Three.js shader creating organic, mouse-reactive dappled sunlight effects for React/Next.js.

## Installation

First, install Three.js if you haven't:

```bash
npm install three
# or
yarn add three
# or
pnpm add three
```

Then copy `DappledLight.jsx` into your components directory.

## Usage

### Basic Usage

```jsx
import DappledLight from '@/components/DappledLight';

export default function Page() {
  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      {/* Full-screen background */}
      <DappledLight 
        style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      />
      
      {/* Your content */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        <h1>Your content here</h1>
      </main>
    </div>
  );
}
```

### Dark Variant (Moonlight)

```jsx
import DappledLight from '@/components/DappledLight';

// Using the variant prop
<DappledLight variant="dark" />

// Or the convenience export
import { DappledLightDark } from '@/components/DappledLight';
<DappledLightDark />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'light'` \| `'dark'` | `'light'` | Light (warm sunlight) or dark (cool moonlight) theme |
| `speed` | `number` | `1.0` | Animation speed multiplier. 0.5 = half speed, 2.0 = double |
| `mouseInfluence` | `number` | `1.0` | How much the mouse affects the pattern. 0 = no effect |
| `className` | `string` | `''` | CSS class name |
| `style` | `object` | `{}` | Inline styles |

### Example with All Props

```jsx
<DappledLight 
  variant="light"
  speed={0.8}           // Slightly slower, more meditative
  mouseInfluence={1.5}  // More responsive to cursor
  className="shader-bg"
  style={{ 
    position: 'fixed', 
    inset: 0, 
    zIndex: -1 
  }}
/>
```

## Customising the Colours

The shader colours are defined in the fragment shader. Look for these sections:

### Light variant (warm sunlight):
```glsl
vec3 shadowColor = vec3(0.92, 0.90, 0.85);  // Warm shadow
vec3 lightColor = vec3(1.0, 0.98, 0.94);     // Bright warm light
vec3 accentColor = vec3(1.0, 0.95, 0.80);    // Golden accent
```

### Dark variant (cool moonlight):
```glsl
vec3 shadowColor = vec3(0.06, 0.07, 0.09);   // Deep blue-black
vec3 lightColor = vec3(0.12, 0.14, 0.18);    // Soft blue-grey
vec3 accentColor = vec3(0.15, 0.17, 0.22);   // Silver accent
```

You can modify these RGB values (0.0-1.0 range) to match your brand.

## For Long Form Press

Some suggested tweaks for the literary aesthetic:

**Warmer, more golden (afternoon reading light):**
```glsl
vec3 shadowColor = vec3(0.94, 0.91, 0.84);
vec3 lightColor = vec3(1.0, 0.97, 0.90);
vec3 accentColor = vec3(1.0, 0.92, 0.75);
```

**Cooler, more paper-like (overcast library):**
```glsl
vec3 shadowColor = vec3(0.93, 0.93, 0.91);
vec3 lightColor = vec3(0.98, 0.98, 0.97);
vec3 accentColor = vec3(0.96, 0.95, 0.92);
```

## Performance Notes

- Uses `requestAnimationFrame` for smooth animation
- Pixel ratio capped at 2 to prevent GPU strain on high-DPI displays
- ResizeObserver for efficient resize handling
- Proper cleanup on unmount

## TypeScript

If using TypeScript, you may want to add type definitions:

```tsx
interface DappledLightProps {
  variant?: 'light' | 'dark';
  className?: string;
  style?: React.CSSProperties;
  intensity?: number;
  speed?: number;
  mouseInfluence?: number;
}
```

## Browser Support

Requires WebGL support (all modern browsers).
