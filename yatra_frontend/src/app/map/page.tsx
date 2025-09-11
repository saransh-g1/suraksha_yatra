"use client";

import dynamic from "next/dynamic";

const GoogleMapView = dynamic(() => import("@/components/GoogleMapView"), { ssr: false });

export default function MapPage() {
  const zones = [
    { center: { lat: 28.6139, lng: 77.2090 }, radiusMeters: 2500, level: "high" },
    { center: { lat: 28.5355, lng: 77.3910 }, radiusMeters: 1800, level: "medium" },
    { center: { lat: 28.7041, lng: 77.1025 }, radiusMeters: 1500, level: "low" },
  ] as const;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 bg-white">
      <h1 className="text-2xl font-semibold mb-4 text-orange-600">Live Map</h1>
      <div className="h-[60vh] border border-orange-200 rounded-xl overflow-hidden">
        <GoogleMapView center={{ lat: 28.6139, lng: 77.2090 }} zoom={10} zones={zones as any} showHeatmap />
      </div>
    </div>
  );
}