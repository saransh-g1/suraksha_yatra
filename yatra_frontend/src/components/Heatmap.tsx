"use client";

import { useEffect, useRef, useState } from "react";

// TypeScript declaration for Google Maps
declare global {
  interface Window {
    google: any;
  }
}

// Fallback sample data for heatmap visualization
const fallbackHeatmapData = [
  { lat: 28.6139, lng: 77.2090, weight: 0.8 },
  { lat: 28.7041, lng: 77.1025, weight: 0.6 },
  { lat: 28.5355, lng: 77.3910, weight: 0.9 },
  { lat: 28.4595, lng: 77.0266, weight: 0.7 },
  { lat: 28.6129, lng: 77.2295, weight: 0.5 },
  { lat: 28.7041, lng: 77.1025, weight: 0.8 },
  { lat: 28.5355, lng: 77.3910, weight: 0.6 },
  { lat: 28.4595, lng: 77.0266, weight: 0.9 },
  { lat: 28.6139, lng: 77.2090, weight: 0.4 },
  { lat: 28.6129, lng: 77.2295, weight: 0.7 },
];

// Placeholder function for API integration
// TODO: Replace this with actual API call to fetch real heatmap data
export const fetchHeatmapData = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return fallbackHeatmapData;
};

const Heatmap = () => {
  const mapRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        // Check if Google Maps is already loaded
        if (window.google && window.google.maps) {
          initializeMap();
          return;
        }

        // Load Google Maps script with Visualization library
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=visualization`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
          initializeMap();
        };

        script.onerror = () => {
          setError("Failed to load Google Maps. Please check your API key.");
        };

        document.head.appendChild(script);
      } catch (err: any) {
        setError("Error loading Google Maps: " + err.message);
      }
    };

    const initializeMap = async () => {
      try {
        if (!mapRef.current) return;

        // Fetch heatmap data
        const heatmapData = await fetchHeatmapData();

        // Initialize map centered on New Delhi
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 28.6139, lng: 77.2090 },
          zoom: 10,
          mapTypeId: "roadmap",
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        });

        // Create heatmap data points
        const heatmapPoints = heatmapData.map(point => ({
          location: new window.google.maps.LatLng(point.lat, point.lng),
          weight: point.weight,
        }));

        // Configure heatmap
        const heatmap = new window.google.maps.visualization.HeatmapLayer({
          data: heatmapPoints,
          radius: 20,
          opacity: 0.7,
          gradient: [
            "rgba(0, 255, 0, 0)", // Green (transparent)
            "rgba(255, 255, 0, 1)", // Yellow
            "rgba(255, 0, 0, 1)", // Red
          ],
        });

        // Add heatmap to map
        heatmap.setMap(map);

        setIsLoaded(true);
      } catch (err: any) {
        setError("Error initializing map: " + err.message);
      }
    };

    loadGoogleMaps();

    // Cleanup function
    return () => {
      const scripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
      scripts.forEach(script => script.remove());
    };
  }, []);

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <div className="text-red-500 text-xl mb-2">⚠️ Error</div>
          <p className="text-gray-700">{error}</p>
          <p className="text-sm text-gray-500 mt-2">
            Make sure to set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment variables.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative">
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{ minHeight: "400px" }}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-700">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Heatmap;
