"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 text-sm gap-3">
          <span className="text-gray-600">© {new Date().getFullYear()} Suraksha Yatra</span>
          <div className="grid grid-cols-2 sm:flex gap-2">
            <Link href="/aadhar-upload" className="rounded-md border border-orange-500 text-orange-600 px-3 py-1 hover:bg-orange-50">Aadhar upload</Link>
            <Link href="/settings" className="rounded-md border border-orange-500 text-orange-600 px-3 py-1 hover:bg-orange-50">Settings</Link>
            <Link href="/" className="rounded-md bg-orange-600 text-white px-3 py-1 hover:bg-orange-700">Home</Link>
            <Link href="/support" className="rounded-md border border-orange-500 text-orange-600 px-3 py-1 hover:bg-orange-50">Support</Link>
            <Link href="/profile" className="rounded-md border border-orange-500 text-orange-600 px-3 py-1 hover:bg-orange-50">Profile</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}


