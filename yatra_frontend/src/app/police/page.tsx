"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
const GoogleMapView = dynamic(() => import("@/components/GoogleMapView"), { ssr: false });

type AlertLog = {
  id: string;
  time: string;
  title: string;
  location: string;
  severity: "low" | "medium" | "high";
};

const demoAlerts: AlertLog[] = [
  { id: "1", time: "10:24", title: "SOS triggered", location: "Connaught Place, Delhi", severity: "high" },
  { id: "2", time: "10:18", title: "Suspicious activity", location: "Bandra West, Mumbai", severity: "medium" },
  { id: "3", time: "10:10", title: "Assistance requested", location: "T Nagar, Chennai", severity: "low" },
  { id: "4", time: "09:58", title: "SOS triggered", location: "Banjara Hills, Hyderabad", severity: "high" },
  { id: "5", time: "09:41", title: "Harassment reported", location: "Park Street, Kolkata", severity: "medium" },
];

export default function PoliceDashboardPage() {
  const [showHeatmap, setShowHeatmap] = useState(true);
  const alerts = useMemo(() => demoAlerts, []);

  return (
    <div className="bg-white">
      {/* Header band reusing theme */}
      <section className="bg-gradient-to-br from-orange-600 to-orange-500 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Police Dashboard</h1>
          <p className="text-white/90 text-sm mt-1">Live field alerts and regional heatmap.</p>
        </div>
      </section>

      {/* Content: mobile stacked 50/50, desktop split */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-rows-[45vh_45vh] md:grid-rows-1 md:grid-cols-3 gap-4">
          {/* Map + Heatmap */}
          <div className="relative md:col-span-2 rounded-xl border border-orange-200 overflow-hidden bg-white">
            <div className="flex items-center justify-between px-3 py-2 border-b">
              <h2 className="font-medium text-gray-900">Map</h2>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={showHeatmap} onChange={() => setShowHeatmap((v) => !v)} />
                Heatmap
              </label>
            </div>
            <div className="absolute inset-0 top-10">
              <GoogleMapView
                center={{ lat: 19.076, lng: 72.8777 }}
                zoom={10}
                zones={[
                  { center: { lat: 19.076, lng: 72.8777 }, radiusMeters: 2500, level: "high" },
                  { center: { lat: 19.2183, lng: 72.9781 }, radiusMeters: 1800, level: "medium" },
                  { center: { lat: 18.9388, lng: 72.8354 }, radiusMeters: 1500, level: "low" },
                ] as any}
                showHeatmap={showHeatmap}
              />
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur rounded-md px-2 py-1 text-xs shadow">
                <span className="inline-block h-2 w-2 rounded-full bg-orange-300" /> Low
                <span className="inline-block h-2 w-2 rounded-full bg-orange-500" /> Medium
                <span className="inline-block h-2 w-2 rounded-full bg-orange-700" /> High
              </div>
              <div className="bg-white/90 backdrop-blur rounded-md px-2 py-1 text-xs shadow">Last 24h</div>
            </div>
          </div>

          {/* Alerts list */}
          <div className="rounded-xl border border-orange-200 overflow-hidden bg-white flex flex-col">
            <div className="px-3 py-2 border-b flex items-center justify-between">
              <h2 className="font-medium text-gray-900">Recent alerts</h2>
              <button className="text-orange-600 text-sm hover:underline">View all</button>
            </div>
            <ul className="divide-y overflow-y-auto" style={{ maxHeight: "100%" }}>
              {alerts.map((a) => (
                <li key={a.id} className="px-3 py-3 flex items-start gap-3">
                  <SeverityPill level={a.severity} />
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-gray-900 text-sm truncate">{a.title}</p>
                      <span className="text-xs text-gray-500 shrink-0">{a.time}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5 truncate">{a.location}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function SeverityPill({ level }: { level: AlertLog["severity"] }) {
  const color =
    level === "high" ? "bg-red-100 text-red-700 border-red-200" :
    level === "medium" ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
    "bg-green-100 text-green-700 border-green-200";
  const label = level === "high" ? "High" : level === "medium" ? "Medium" : "Low";
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${color}`}>{label}</span>
  );
}


