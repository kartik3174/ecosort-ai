"use client"

import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import L, { Map } from 'leaflet';

// Leaflet's CSS is included in the root layout (layout.tsx)
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

// We are keeping the component name as GoogleMap to avoid changing imports in parent components,
// but the implementation is now using Leaflet and OpenStreetMap.
export function GoogleMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Run only on client and if the container is available
    if (isClient && mapContainerRef.current && !mapInstanceRef.current) {
      
      const DefaultIcon = L.icon({
          iconRetinaUrl,
          iconUrl,
          shadowUrl,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          tooltipAnchor: [16, -28],
          shadowSize: [41, 41]
      });

      const map = L.map(mapContainerRef.current).setView([13.0827, 80.2707], 12);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      L.marker([13.0827, 80.2707], { icon: DefaultIcon })
        .addTo(map)
        .bindPopup("Chennai")
        .openPopup();
    }
    
    // Cleanup map instance on component unmount
    return () => {
        if(mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }
    }
  }, [isClient]);

  if (!isClient) {
    return (
      <Card className="w-full overflow-hidden shadow-lg">
        <div className="bg-muted flex items-center justify-center" style={{ height: '500px' }}>
          <p>Loading map...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden shadow-lg z-0">
      <div ref={mapContainerRef} style={{ height: '500px', width: '100%' }}></div>
    </Card>
  );
}
