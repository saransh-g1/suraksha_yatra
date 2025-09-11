"use client";

import { useEffect, useRef } from "react";
import { useLoadGoogleMaps } from "@/lib/useLoadGoogleMaps";

type LatLng = { lat: number; lng: number };

type Zone = {
  center: LatLng;
  radiusMeters: number;
  level: "low" | "medium" | "high";
};

export type GoogleMapViewProps = {
  center?: LatLng;
  zoom?: number;
  zones?: Zone[];
  showHeatmap?: boolean;
};

export default function GoogleMapView({ center = { lat: 28.6139, lng: 77.209 }, zoom = 11, zones = [], showHeatmap = false }: GoogleMapViewProps) {
  const loaded = useLoadGoogleMaps();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);
  const heatmapRef = useRef<any>(null);

  useEffect(() => {
    if (!loaded || !mapRef.current) return;
    if (!mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });
    } else {
      mapInstance.current.setCenter(center);
      mapInstance.current.setZoom(zoom);
    }
  }, [loaded, center, zoom]);

  useEffect(() => {
    if (!loaded || !mapInstance.current) return;
    // Clear previous shapes
    if ((mapInstance.current as any).__circles) {
      (mapInstance.current as any).__circles.forEach((c: any) => c.setMap(null));
    }
    (mapInstance.current as any).__circles = [];

    zones.forEach((z) => {
      const color = z.level === "high" ? "#ef4444" : z.level === "medium" ? "#f59e0b" : "#22c55e";
      const circle = new window.google.maps.Circle({
        strokeColor: color,
        strokeOpacity: 0.7,
        strokeWeight: 1,
        fillColor: color,
        fillOpacity: 0.18,
        map: mapInstance.current,
        center: z.center,
        radius: z.radiusMeters,
      });
      (mapInstance.current as any).__circles.push(circle);
    });
  }, [loaded, zones]);

  useEffect(() => {
    if (!loaded || !mapInstance.current) return;
    if (!showHeatmap) {
      if (heatmapRef.current) heatmapRef.current.setMap(null);
      return;
    }
    const points = zones.flatMap((z) => {
      const base = new window.google.maps.LatLng(z.center.lat, z.center.lng);
      const weight = z.level === "high" ? 3 : z.level === "medium" ? 2 : 1;
      return Array.from({ length: 10 }).map(() => ({ location: base, weight }));
    });
    heatmapRef.current = new window.google.maps.visualization.HeatmapLayer({
      data: points,
      radius: 30,
    });
    heatmapRef.current.setMap(mapInstance.current);
  }, [loaded, zones, showHeatmap]);

  return <div ref={mapRef} className="h-full w-full" />;
}


