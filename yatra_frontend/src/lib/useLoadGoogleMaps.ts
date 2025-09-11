"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    google?: any;
    __googleMapsLoaded?: boolean;
    __googleMapsLoadingPromise?: Promise<void>;
  }
}

export function useLoadGoogleMaps() {
  const [loaded, setLoaded] = useState<boolean>(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||  "AIzaSyCvllQdzYY3NateNUXArrTtcrW7_BdXAzA";

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.google && window.google.maps) {
      setLoaded(true);
      return;
    }
    if (window.__googleMapsLoaded) {
      setLoaded(true);
      return;
    }

    // Reuse existing script if present or use a singleton promise to prevent duplicates
    const existing = document.querySelector(
      'script[data-google-maps="true"]'
    ) as HTMLScriptElement | null;

    const load = () => {
      if (window.google && window.google.maps) {
        window.__googleMapsLoaded = true;
        setLoaded(true);
      }
    };

    if (existing) {
      existing.addEventListener("load", load, { once: true });
      existing.addEventListener("error", () => {
        // eslint-disable-next-line no-console
        console.error("Failed to load Google Maps script (existing)");
      }, { once: true });
      return;
    }

    if (!apiKey) {
      // eslint-disable-next-line no-console
      console.error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing");
      return;
    }

    if (!window.__googleMapsLoadingPromise) {
      window.__googleMapsLoadingPromise = new Promise<void>((resolve, reject) => {
        const src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=visualization`;
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.defer = true;
        script.setAttribute("data-google-maps", "true");
        script.onload = () => {
          window.__googleMapsLoaded = true;
          resolve();
        };
        script.onerror = () => reject(new Error("Google Maps failed to load"));
        document.head.appendChild(script);
      });
    }

    window.__googleMapsLoadingPromise
      ?.then(() => {
        setLoaded(true);
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error(e);
      });
  }, [apiKey]);

  return loaded;
}


