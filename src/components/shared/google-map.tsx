"use client"

import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import type { Map, Marker } from 'leaflet';
import type { MapReport } from '@/lib/data';

// Leaflet's CSS is included in the root layout (layout.tsx)

interface GoogleMapProps {
    reports?: MapReport[];
    selectedReportId?: string | null;
    onMarkerSelect?: (report: MapReport | null) => void;
}

const createMarkerIcon = (L: any, color: string, isSelected: boolean) => {
    const markerHtml = `
      <div style="
        position: relative;
        transform: translate(-50%, -100%);
      ">
        <svg width="32" height="42" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 0C7.02944 0 3 4.02944 3 9C3 15.75 12 32 12 32C12 32 21 15.75 21 9C21 4.02944 16.9706 0 12 0ZM12 13C14.2091 13 16 11.2091 16 9C16 6.79086 14.2091 5 12 5C9.79086 5 8 6.79086 8 9C8 11.2091 9.79086 13 12 13Z" fill="${color}"/>
        </svg>
        ${isSelected ? `<div style="position: absolute; top: 3px; left: 3px; right: 3px; bottom: 13px; border: 2px solid white; border-radius: 50%;"></div>` : ''}
      </div>
    `;

    return L.divIcon({
        html: markerHtml,
        className: 'custom-leaflet-marker', // an empty class name is required
        iconSize: [32, 42],
        iconAnchor: [16, 42], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -42] // point from which the popup should open relative to the iconAnchor
    });
};

const pinColors: Record<string, string> = {
    "Still There": "#ef4444", // red-500
    "Cleaned": "#22c55e", // green-500
    "Hazardous": "#f59e0b", // yellow-500
    "Recyclable": "#3b82f6", // blue-500
};

// We are keeping the component name as GoogleMap to avoid changing imports in parent components,
// but the implementation is now using Leaflet and OpenStreetMap.
export function GoogleMap({ reports = [], selectedReportId, onMarkerSelect = () => {} }: GoogleMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const markersRef = useRef<Record<string, Marker>>({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Run only on client and if the container is available
    if (isClient && mapContainerRef.current && !mapInstanceRef.current) {
      import('leaflet').then(L => {
        const map = L.map(mapContainerRef.current!).setView([13.0827, 80.2707], 12);
        mapInstanceRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Handle clicking outside a marker to deselect
        map.on('click', () => {
            onMarkerSelect(null);
        });
      });
    }
    
    // Cleanup map instance on component unmount
    return () => {
        if(mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }
    }
  }, [isClient, onMarkerSelect]);


  useEffect(() => {
      if(!mapInstanceRef.current) return;
      
      import('leaflet').then(L => {
        const map = mapInstanceRef.current!;
        const currentMarkers = markersRef.current;
        
        // Get a Set of report IDs for efficient lookup
        const newReportIds = new Set(reports.map(r => r.id));

        // Remove markers that are no longer in the reports list
        Object.keys(currentMarkers).forEach(markerId => {
          if (!newReportIds.has(markerId)) {
            currentMarkers[markerId].remove();
            delete currentMarkers[markerId];
          }
        });

        // Add new markers or update existing ones
        reports.forEach(report => {
            const isSelected = report.id === selectedReportId;
            const color = pinColors[report.category] || '#71717a'; // default to gray-500
            const icon = createMarkerIcon(L, color, isSelected);
            
            if (currentMarkers[report.id]) {
              // Marker exists, just update icon
              currentMarkers[report.id].setIcon(icon);
            } else {
              // Create new marker
              const marker = L.marker([report.lat, report.lng], { icon })
                .addTo(map)
                .bindPopup(`<b>${report.location}</b><br>${report.category}`);
              
              marker.on('click', (e) => {
                  L.DomEvent.stopPropagation(e); // prevent map click event from firing
                  onMarkerSelect(report);
                  marker.openPopup();
              });

              markersRef.current[report.id] = marker;
            }
        });

        // Update popup and pan for selected marker
        if(selectedReportId && markersRef.current[selectedReportId]) {
            const selectedMarker = markersRef.current[selectedReportId];
            selectedMarker.openPopup();
            map.panTo(selectedMarker.getLatLng());
        }
      });

  }, [reports, selectedReportId, onMarkerSelect]);

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
