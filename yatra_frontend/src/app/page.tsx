import Link from "next/link";
import Image from "next/image";

const actions = [
  { id: "plan", title: "Plan your trip", icon: "/globe.svg", href: "#plan" },
  { id: "hotel", title: "Book your hotel", icon: "/window.svg", href: "#hotel" },
  { id: "restaurant", title: "Get your restaurant", icon: "/file.svg", href: "#restaurant" },
  { id: "cab", title: "Book your cab", icon: "/vercel.svg", href: "#cab" },
];

export default function Home() {
  return (
    <div className="px-0 sm:px-0 lg:px-0 bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-orange-600 to-orange-500 text-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-5xl font-bold leading-tight">Discover Incredible India</h1>
              <p className="mt-3 sm:mt-4 text-white/90 text-sm sm:text-base">Plan journeys across forts, beaches, mountains and food trails with a seamless experience.</p>
              <div className="mt-6 flex gap-3">
                <Link href="#plan" className="px-5 py-2.5 rounded-md bg-white text-orange-600 hover:bg-orange-50 text-sm sm:text-base">Plan your trip</Link>
                <Link href="/map" className="px-5 py-2.5 rounded-md ring-1 ring-white/80 text-white hover:bg-white/10 text-sm sm:text-base">Explore map</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-gray-900">Get started</h2>
        <p className="text-gray-600 mb-6">Everything you need for a perfect trip.</p>
      </div>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((a) => (
          <Link
            key={a.id}
            href={a.href}
            id={a.id}
            className="border border-orange-200 rounded-xl p-4 flex items-start gap-3 hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
          >
            <div className="h-10 w-10 flex items-center justify-center rounded-md bg-orange-50 shrink-0">
              <Image src={a.icon} alt="" width={22} height={22} />
            </div>
            <div>
              <span className="font-medium text-gray-900">{a.title}</span>
              <p className="text-xs text-gray-600 mt-1">Curated options for popular destinations and budgets.</p>
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-8 flex justify-center pb-24 sm:pb-6">
        <Link
          href="/map"
          className="px-6 py-3 rounded-lg bg-orange-600 text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          Open Map
        </Link>
      </section>
    </div>
  );
}
