import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg text-center">
        <h1 className="text-8xl font-extrabold text-indigo-600">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-bold text-gray-900">
          Page Not Found
        </h2>

        <p className="mt-3 text-gray-600">
          Sorry! The page you are looking for doesn't exist
          or has been moved.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            <Home size={18} />
            Back to Home
          </Link>

          <Link
            href="/studios"
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            <Search size={18} />
            Explore Studios
          </Link>
        </div>
      </div>
    </main>
  );
}