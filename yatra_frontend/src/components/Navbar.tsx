"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="font-semibold text-orange-600">Suraksha Yatra</Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="hover:text-orange-600">Home</Link>
            <div className="relative">
              <button className="hover:text-orange-600" onClick={() => setOpen((v) => !v)}>Services ▾</button>
              {open && (
                <div className="absolute right-0 mt-2 w-52 rounded-md border bg-white shadow-lg">
                  <div className="py-1 text-sm">
                    <Link href="#plan" className="block px-3 py-2 hover:bg-orange-50">Plan your trip</Link>
                    <Link href="#hotel" className="block px-3 py-2 hover:bg-orange-50">Book your hotel</Link>
                    <Link href="#restaurant" className="block px-3 py-2 hover:bg-orange-50">Get your restaurant</Link>
                    <Link href="#cab" className="block px-3 py-2 hover:bg-orange-50">Book your cab</Link>
                    <Link href="/map" className="block px-3 py-2 hover:bg-orange-50">Map</Link>
                  </div>
                </div>
              )}
            </div>
            <Link href="#about" className="hover:text-orange-600">About</Link>
            <Link href="#contact" className="hover:text-orange-600">Contact</Link>
          </div>
          <button aria-label="menu" className="md:hidden" onClick={() => setOpen((v) => !v)}>
            <span className="block h-0.5 w-6 bg-orange-600 mb-1" />
            <span className="block h-0.5 w-6 bg-orange-600 mb-1" />
            <span className="block h-0.5 w-6 bg-orange-600" />
          </button>
        </div>
        {open && (
          <div className="md:hidden border-t py-2 text-sm">
            <Link href="/" className="block px-2 py-2">Home</Link>
            <details>
              <summary className="px-2 py-2 cursor-pointer">Services</summary>
              <div className="pl-4">
                <Link href="#plan" className="block py-1">Plan your trip</Link>
                <Link href="#hotel" className="block py-1">Book your hotel</Link>
                <Link href="#restaurant" className="block py-1">Get your restaurant</Link>
                <Link href="#cab" className="block py-1">Book your cab</Link>
                <Link href="/map" className="block py-1">Map</Link>
              </div>
            </details>
            <Link href="#about" className="block px-2 py-2">About</Link>
            <Link href="#contact" className="block px-2 py-2">Contact</Link>
          </div>
        )}
      </nav>
    </header>
  );
}


