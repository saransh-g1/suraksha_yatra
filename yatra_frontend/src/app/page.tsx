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
    <div className="px-4 sm:px-6 lg:px-8 mx-auto max-w-6xl py-8 bg-white">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-orange-600">Welcome</h1>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((a) => (
          <Link
            key={a.id}
            href={a.href}
            id={a.id}
            className="border border-orange-200 rounded-xl p-4 flex items-center gap-3 hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <div className="h-10 w-10 flex items-center justify-center rounded-md bg-orange-50">
              <Image src={a.icon} alt="" width={22} height={22} />
            </div>
            <span className="font-medium text-gray-900">{a.title}</span>
          </Link>
        ))}
      </section>

      <section className="mt-8 flex justify-center">
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
