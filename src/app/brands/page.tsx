"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import TypewriterText from "@/components/TypewriterText";

// Dynamically import map to avoid SSR issues with Leaflet
const BrandMap = dynamic(() => import("@/components/BrandMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-burgundy/5 flex items-center justify-center">
      <p className="text-burgundy/40 text-sm">Loading map...</p>
    </div>
  ),
});

const featuredBrands = [
  {
    id: "1",
    name: "The Pineapple",
    category: "Pub",
    location: "Kentish Town",
    description: "A cozy corner pub where the Silver Spooners gather for their Thursday drinks.",
    coordinates: [51.5505, -0.1437] as [number, number],
  },
  {
    id: "2",
    name: "Broadway Market",
    category: "Market",
    location: "Hackney",
    description: "Maya's Sunday ritual - fresh bread, coffee, and people-watching.",
    coordinates: [51.5362, -0.0608] as [number, number],
  },
  {
    id: "3",
    name: "Peckham Rye",
    category: "Neighbourhood",
    location: "South London",
    description: "Where Liv found the café that changed everything.",
    coordinates: [51.4689, -0.068] as [number, number],
  },
  {
    id: "4",
    name: "London Fields",
    category: "Park",
    location: "Hackney",
    description: "Sunday strolls with market haul in hand.",
    coordinates: [51.5413, -0.0596] as [number, number],
  },
  {
    id: "5",
    name: "The Attendant",
    category: "Café",
    location: "Fitzrovia",
    description: "Coffee in a converted Victorian toilet. Only in London.",
    coordinates: [51.5185, -0.1385] as [number, number],
  },
  {
    id: "6",
    name: "Columbia Road",
    category: "Market",
    location: "Bethnal Green",
    description: "Sunday flowers and the smell of fresh blooms.",
    coordinates: [51.5293, -0.0726] as [number, number],
  },
  {
    id: "7",
    name: "V&A East Museum",
    category: "Museum",
    location: "E20 1GY",
    description: "The final piece of the Stratford Olympic Park puzzle. Huge, angular, and kicks off with a massive exhibition on Black British music. Opening April 18, 2026.",
    coordinates: [51.5435, -0.0066] as [number, number],
  },
  {
    id: "8",
    name: "London Museum",
    category: "Museum",
    location: "Smithfield, EC1A 9PS",
    description: "The old Museum of London has rebranded and moved into the historic Smithfield Market. The first phase opens late 2026 with a \"24-hour city\" vibe.",
    coordinates: [51.5194, -0.1018] as [number, number],
  },
  {
    id: "9",
    name: "Admiralty Arch",
    category: "Hotel",
    location: "SW1A 2WH",
    description: "The iconic archway is finally opening as a luxury Waldorf Astoria hub this spring. Includes a rooftop café and high-end dining from Michelin-starred chefs.",
    coordinates: [51.5064, -0.1288] as [number, number],
  },
  {
    id: "10",
    name: "The David Bowie Centre",
    category: "Museum",
    location: "E20",
    description: "Part of the V&A East project, this houses the superstar's entire archive. It's the new pilgrimage site for music fans.",
    coordinates: [51.542, -0.007] as [number, number],
  },
  {
    id: "11",
    name: "Burro",
    category: "Restaurant",
    location: "Covent Garden, WC2E 9FB",
    description: "Conor Gadd (from the legendary Trullo) takes over Floral Court. Italian-Irish fusion with a hidden, tucked-away terrace.",
    coordinates: [51.5125, -0.1225] as [number, number],
  },
  {
    id: "12",
    name: "DakaDaka",
    category: "Restaurant",
    location: "Mayfair, W1B 4BR",
    description: "Mayfair's new Georgian obsession. Open-fire cooking and a massive natural wine list in a swish townhouse.",
    coordinates: [51.5152, -0.139] as [number, number],
  },
  {
    id: "13",
    name: "MA/NA",
    category: "Restaurant",
    location: "Mayfair, W1K 7PH",
    description: "A massive, theatrical Japanese restaurant and late-night lounge with a dragon-shaped banquette. Very \"see and be seen.\"",
    coordinates: [51.5095, -0.1485] as [number, number],
  },
  {
    id: "14",
    name: "Plates",
    category: "Restaurant",
    location: "Clerkenwell, EC1V 9AY",
    description: "The hottest plant-based ticket in town. It recently shot into the UK's Top 100 and remains incredibly difficult to book.",
    coordinates: [51.5285, -0.102] as [number, number],
  },
  {
    id: "15",
    name: "Tortello",
    category: "Restaurant",
    location: "Hyde Park, W2 2TY",
    description: "Regional Italian pasta experts opening right on the edge of Hyde Park this month. Great for date nights.",
    coordinates: [51.5135, -0.1785] as [number, number],
  },
  {
    id: "16",
    name: "JP's Cafe",
    category: "Café",
    location: "Chrisp Street, E14 6AQ",
    description: "Located in Chrisp Street Market. An old-school greasy spoon that has become the \"ironic-cool\" spot for the fashion crowd.",
    coordinates: [51.5125, -0.0135] as [number, number],
  },
  {
    id: "17",
    name: "E5 Bakehouse",
    category: "Bakery",
    location: "Poplar, E14 0JU",
    description: "The second outpost of London's favorite sourdough kings. Located in the Poplar Works fashion hub.",
    coordinates: [51.5085, -0.0175] as [number, number],
  },
  {
    id: "18",
    name: "The Azuki Room",
    category: "Café",
    location: "Chancery Lane, WC2A 1QS",
    description: "A tiny, intimate Korean-Japanese \"coffee and sando\" spot near Chancery Lane.",
    coordinates: [51.516, -0.1115] as [number, number],
  },
  {
    id: "19",
    name: "Canary Wharf Sea Lanes",
    category: "Lido",
    location: "Canary Wharf, E14",
    description: "Not just a café—a brand new open-air heated swimming lido and boardwalk cafe opening for the Summer 2026 season.",
    coordinates: [51.5055, -0.0235] as [number, number],
  },
];

export default function BrandsPage() {
  const [hoveredBrandId, setHoveredBrandId] = useState<string | null>(null);
  const [lockedBrandId, setLockedBrandId] = useState<string | null>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const targetOffset = useRef({ x: 0, y: 0 });
  const currentOffset = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const brandsGridRef = useRef<HTMLDivElement>(null);

  // The active brand is either locked or hovered
  const activeBrandId = lockedBrandId || hoveredBrandId;

  // Track scroll to transition map from top-aligned to center
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = 300; // Pixels to scroll before map is fully "free"
      const progress = Math.min(1, scrollY / threshold);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBrandHover = (brandId: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (!lockedBrandId) {
      setHoveredBrandId(brandId);
    }
  };

  const handleBrandLeave = () => {
    if (!lockedBrandId) {
      hoverTimeoutRef.current = setTimeout(() => {
        setHoveredBrandId(null);
      }, 150);
    }
  };

  const handleBrandClick = (brandId: string) => {
    setLockedBrandId(brandId);
    setHoveredBrandId(null);
  };

  const handlePageClick = (e: React.MouseEvent) => {
    // Only unlock if clicking on the page background (not on a brand card)
    if ((e.target as HTMLElement).closest('[data-brand-card]')) {
      return;
    }
    setLockedBrandId(null);
  };

  // Smooth animation loop
  useEffect(() => {
    const animate = () => {
      const lerp = 0.08; // Smoothing factor (lower = smoother but slower)

      currentOffset.current.x += (targetOffset.current.x - currentOffset.current.x) * lerp;
      currentOffset.current.y += (targetOffset.current.y - currentOffset.current.y) * lerp;

      // Only update state if there's meaningful change
      const dx = Math.abs(currentOffset.current.x - mouseOffset.x);
      const dy = Math.abs(currentOffset.current.y - mouseOffset.y);

      if (dx > 0.5 || dy > 0.5) {
        setMouseOffset({
          x: currentOffset.current.x,
          y: currentOffset.current.y
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Track mouse position always
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Update target offset based on active brand and mouse position
  useEffect(() => {
    if (!activeBrandId) {
      targetOffset.current = { x: 0, y: 0 };
      return;
    }

    const updateTarget = () => {
      const mapHomeX = window.innerWidth * 0.75;
      const mapHomeY = window.innerHeight * 0.5;
      const deltaX = mousePos.current.x - mapHomeX;
      const deltaY = mousePos.current.y - mapHomeY;

      const followStrength = 0.25;
      const maxOffset = 120;

      let offsetX = deltaX * followStrength;
      let offsetY = deltaY * followStrength;

      offsetX = Math.max(-maxOffset, Math.min(maxOffset, offsetX));
      offsetY = Math.max(-maxOffset, Math.min(maxOffset, offsetY));

      targetOffset.current = { x: offsetX, y: offsetY };
    };

    // Update immediately and then on interval while active
    updateTarget();
    const interval = setInterval(updateTarget, 16);
    return () => clearInterval(interval);
  }, [activeBrandId]);

  return (
    <div className="min-h-screen bg-cream" onClick={handlePageClick}>
      {/* Header */}
      <section className="px-6 md:px-12 pt-12 pb-8 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl md:text-5xl text-burgundy mb-3">
            <TypewriterText text="Featured Brands" wordByWord />
          </h1>
          <p className="text-burgundy/60 text-base max-w-xl mx-auto">
            The places that make London feel like home.
          </p>
        </div>
      </section>

      {/* Main Content with Sticky Map */}
      <section className="px-6 md:px-12 pb-24 max-w-[1600px] mx-auto relative">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_600px] gap-8">
          {/* Brand List - Left/Scrollable (Two Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 order-2 xl:order-1">
            {featuredBrands.map((brand) => (
              <div
                key={brand.id}
                data-brand-card
                className="relative p-1 cursor-pointer"
                onMouseEnter={() => handleBrandHover(brand.id)}
                onMouseLeave={handleBrandLeave}
                onClick={() => handleBrandClick(brand.id)}
              >
                <div
                  className={`
                    border p-5 transition-all duration-500 ease-out bg-cream h-full
                    ${activeBrandId === brand.id
                      ? "border-hot-pink bg-hot-pink/5 shadow-lg shadow-hot-pink/10"
                      : "border-burgundy/20 hover:border-burgundy/40"
                    }
                    ${lockedBrandId === brand.id ? "ring-2 ring-hot-pink ring-offset-2" : ""}
                  `}
                >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-xs text-burgundy/40 uppercase tracking-wider mb-1">
                      {brand.category}
                    </p>
                    <h2
                      className={`font-serif text-lg transition-colors duration-300 ${
                        activeBrandId === brand.id ? "text-hot-pink" : "text-burgundy"
                      }`}
                    >
                      {brand.name}
                    </h2>
                  </div>
                </div>
                <p className="text-burgundy/50 text-xs mb-2">
                  {brand.location}
                </p>
                <p className="text-burgundy/60 text-sm leading-relaxed">
                  {brand.description}
                </p>
                </div>
              </div>
            ))}
          </div>

          {/* Map - Fixed position, top layer above everything including header */}
          {/* Starts aligned with brands grid (320px), transitions to center (50vh - 275px) */}
          <div
            className="order-1 xl:order-2 xl:fixed xl:right-[5%] pointer-events-none"
            style={{
              zIndex: 10000,
              top: `calc(${320 * (1 - scrollProgress)}px + ${scrollProgress * 50}vh - ${scrollProgress * 275}px)`,
            }}
          >
            <div
              style={{
                transform: `translate(${mouseOffset.x}px, ${mouseOffset.y}px)`,
              }}
            >
              <div className="flex justify-center">
                <div className="relative">
                  {/* Pink glow behind */}
                  <div
                    className="absolute inset-0 rounded-full -z-10"
                    style={{
                      background: "radial-gradient(circle, rgba(255, 16, 240, 0.35) 0%, rgba(255, 16, 240, 0.15) 40%, transparent 70%)",
                      transform: "scale(1.3)",
                      filter: "blur(40px)",
                    }}
                  />
                  {/* Map container */}
                  <div
                    className="relative border-2 border-white/50 overflow-hidden rounded-full"
                    style={{
                      width: "min(550px, 85vw)",
                      height: "min(550px, 85vw)",
                      boxShadow: "0 30px 100px -20px rgba(255, 16, 240, 0.5), 0 15px 50px -10px rgba(0, 0, 0, 0.15)",
                    }}
                  >
                    <BrandMap brands={featuredBrands} hoveredBrandId={activeBrandId} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
