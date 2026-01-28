"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Brand {
  id: string;
  name: string;
  category: string;
  location: string;
  description: string;
  coordinates: [number, number];
}

interface BrandMapProps {
  brands: Brand[];
  hoveredBrandId: string | null;
}

// Custom pink marker icon with optional label
const createPinkIcon = (isActive: boolean, label?: string) => {
  const size = isActive ? 20 : 14;
  const labelHtml = isActive && label ? `
    <div style="
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-bottom: 8px;
      background: #FD05A0;
      color: white;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(253, 5, 160, 0.4);
    ">${label}</div>
  ` : "";

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="position: relative;">
        ${labelHtml}
        <div style="
          width: ${size}px;
          height: ${size}px;
          background-color: #FD05A0;
          border: 2px solid #fff;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(253, 5, 160, ${isActive ? "0.6" : "0.4"});
          transition: all 0.3s ease;
        "></div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Component to handle map animations
function MapController({ hoveredBrandId, brands }: { hoveredBrandId: string | null; brands: Brand[] }) {
  const map = useMap();

  useEffect(() => {
    if (hoveredBrandId) {
      const brand = brands.find((b) => b.id === hoveredBrandId);
      if (brand) {
        map.flyTo(brand.coordinates, 16, {
          duration: 2,
          easeLinearity: 0.1,
        });
      }
    } else {
      // Zoom out to show all of London
      map.flyTo([51.5074, -0.08], 12, {
        duration: 1.5,
        easeLinearity: 0.1,
      });
    }
  }, [hoveredBrandId, brands, map]);

  return null;
}

export default function BrandMap({ brands, hoveredBrandId }: BrandMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-full bg-burgundy/10 flex items-center justify-center">
        <p className="text-burgundy/40">Loading map...</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={[51.5074, -0.1]}
      zoom={12}
      style={{ width: "100%", height: "100%" }}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}{r}.png"
      />
      <MapController hoveredBrandId={hoveredBrandId} brands={brands} />
      {brands.map((brand) => (
        <Marker
          key={brand.id}
          position={brand.coordinates}
          icon={createPinkIcon(hoveredBrandId === brand.id, brand.name)}
        />
      ))}
    </MapContainer>
  );
}
