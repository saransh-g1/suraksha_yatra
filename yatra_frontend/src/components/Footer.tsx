"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  const items = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/network", label: "My Network", icon: UsersIcon },
    { href: "/notifications", label: "Notifications", icon: BellIcon }
  ];

  return (
    <footer className="bg-white border-t md:relative fixed bottom-0 left-0 right-0 z-50 shadow-[0_-1px_6px_0_rgba(0,0,0,0.06)]">
      <nav className="mx-auto max-w-6xl">
        <ul className="grid grid-cols-3">
          {items.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <li key={href} className="text-center">
                <Link
                  href={href}
                  className={`flex flex-col items-center justify-center gap-1 py-2 text-[11px] sm:text-xs ${
                    active ? "text-orange-600" : "text-gray-500"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className={`h-5 w-5 ${active ? "fill-orange-600" : "fill-gray-500"}`} />
                  <span className="leading-none">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </footer>
  );
}

type IconProps = { className?: string };

function HomeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3 3 10v10a1 1 0 0 0 1 1h5v-6h6v6h5a1 1 0 0 0 1-1V10l-9-7z" />
    </svg>
  );
}

function UsersIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-8 2a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm8 2c-3.67 0-8 1.84-8 5v2h16v-2c0-3.16-4.33-5-8-5Zm-8 1c-2.76 0-6 1.38-6 3.75V20h6Z" />
    </svg>
  );
}

function BellIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22ZM20 17h-1V11a7 7 0 1 0-14 0v6H4v2h16Z" />
    </svg>
  );
}


