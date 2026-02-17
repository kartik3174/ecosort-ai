"use client"

import React, { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';

// IMPORTANT: Replace with your actual Google Maps API key.
// You can get one from the Google Cloud Console.
const API_KEY = "YOUR_GOOGLE_MAPS_API_KEY_HERE";

let scriptLoadingPromise: Promise<void> | null = null;

const loadGoogleMapsScript = (apiKey: string) => {
  if (window.google && window.google.maps) {
    return Promise.resolve();
  }

  if (scriptLoadingPromise) {
    return scriptLoadingPromise;
  }

  scriptLoadingPromise = new Promise((resolve, reject) => {
    const scriptId = 'google-maps-script';
    const existingScript = document.getElementById(scriptId);

    if (existingScript) {
        // If script is already loading or loaded, attach to its promise
        existingScript.addEventListener('load', () => resolve());
        existingScript.addEventListener('error', (e) => reject(e));
        return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      resolve();
      scriptLoadingPromise = null;
    };
    script.onerror = (error) => {
      reject(error);
      scriptLoadingPromise = null;
      document.getElementById(scriptId)?.remove();
    };

    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
};

export function GoogleMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (API_KEY === "YOUR_GOOGLE_MAPS_API_KEY_HERE") {
      toast({
        variant: 'destructive',
        title: 'Google Maps API Key Missing',
        description: 'Please add your API key in src/components/shared/google-map.tsx to display the map.',
        duration: 9000,
      });
      return;
    }

    loadGoogleMapsScript(API_KEY)
      .then(() => {
        if (mapRef.current && !mapRef.current.hasChildNodes()) { // Prevent re-initialization
          const chennai = { lat: 13.0827, lng: 80.2707 };
          const map = new window.google.maps.Map(mapRef.current, {
            zoom: 12,
            center: chennai,
            disableDefaultUI: true,
            zoomControl: true,
          });
          new window.google.maps.Marker({
            position: chennai,
            map: map,
            title: "Chennai",
          });
        }
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          title: 'Map Error',
          description: 'Could not load the Google Map. Check your API key and internet connection.',
        });
      });
  }, [toast]);

  if (API_KEY === "YOUR_GOOGLE_MAPS_API_KEY_HERE") {
    return (
      <Card className="aspect-video w-full flex items-center justify-center bg-muted">
        <p className="text-muted-foreground p-4 text-center">
          Google Maps API Key is missing. Please add your key to 
          <code className="mx-1 p-1 bg-primary/10 rounded-sm">src/components/shared/google-map.tsx</code>
          to enable the map.
        </p>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden shadow-lg">
      <div className="aspect-video w-full bg-muted">
        <div ref={mapRef} className="w-full h-full" />
      </div>
    </Card>
  );
}
