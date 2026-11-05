import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import {
MapPin,
Star,
ArrowRight,
SlidersHorizontal,
} from "lucide-react";

const categories = [
"All Studios",
"Photo Studios",
"Sound Stages",
"Podcast Rooms",
"Music Suites",
"Art Workshops",
];

// Fetch Studios
const StudiosContent = async ({ searchParams }) => {
await connection();
const params = await searchParams;
const selectedCategory = params?.category || "";

let studios = [];

try {
const query = selectedCategory
? `?category=${encodeURIComponent(selectedCategory)}`
: "";

const res = await fetch(
  `${process.env.SERVER_API_URL}/api/studios${query}`,
  {
    headers: {
      "x-internal-api-key": process.env.INTERNAL_API_SECRET,
      "x-user-email": "",
      "x-user-id": "",
      "x-user-name": "",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(25000),
  }
);

if (!res.ok) {
  throw new Error("Failed to fetch studios");
}

const text = await res.text();
let result;

try {
  result = JSON.parse(text);
} catch {
  throw new Error("Invalid response from API server");
}

studios = result.data || [];


} catch (error) {
console.error("Explore Studios Error:", error);
}

return (
<>
{/* Results Heading */} <div className="mb-6 flex items-center justify-between"> <h2 className="text-xl font-bold text-gray-900 dark:text-white">
{selectedCategory || "All Studios"} </h2>


    <p className="text-sm text-gray-500 dark:text-gray-400">
      {studios.length} Studios Found
    </p>
  </div>

  {/* Studio Cards */}
  {studios.length > 0 ? (
    <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
      {studios.map((studio) => (
        <div
          key={studio._id}
          className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="relative h-60 overflow-hidden">
            <Image
              src={studio.image}
              alt={studio.title}
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />

            <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow">
              <Star
                size={15}
                className="fill-yellow-400 text-yellow-400"
              />
              {studio.rating}
            </div>
          </div>

          <div className="flex flex-1 flex-col p-5">
            <span className="mb-3 w-fit rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
              {studio.category}
            </span>

            <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-purple-700 dark:text-white dark:group-hover:text-purple-400">
              {studio.title}
            </h3>

            <p className="mb-5 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <MapPin size={16} className="shrink-0" />
              {studio.location}
            </p>

            <div className="mt-auto flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
              <div>
                <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  ${studio.hourlyRate}
                </p>

                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Per Hour
                </span>
              </div>

              <Link
                href={`/studios/${studio._id}`}
                className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
              >
                View Details
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="rounded-2xl border border-gray-200 bg-white py-20 text-center dark:border-gray-800 dark:bg-gray-900">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white">
        No Studios Found
      </h3>

      <p className="mt-2 text-gray-500 dark:text-gray-400">
        No studios are available in this category right now.
      </p>

      <Link
        href="/studios"
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700"
      >
        View All Studios
        <ArrowRight size={17} />
      </Link>
    </div>
  )}
</>

);
};

// Explore Studios Page
const ExploreStudios = ({ searchParams }) => {
return ( <main className="min-h-screen bg-gray-50 px-4 py-16 dark:bg-gray-950 md:px-10 lg:px-20"> <div className="mx-auto max-w-7xl">
{/* Page Heading */} <div className="mb-10"> <p className="mb-3 font-semibold tracking-widest text-purple-600 dark:text-purple-400">
FIND YOUR CREATIVE SPACE </p>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
        Explore Studios
      </h1>

      <p className="mt-3 text-gray-500 dark:text-gray-400">
        Discover the perfect studio for your next creative project.
      </p>
    </div>

    {/* SearchParams-dependent UI */}
    <Suspense
      fallback={
        <div className="py-20 text-center text-gray-500 dark:text-gray-400">
          Loading studios...
        </div>
      }
    >
      <ExploreStudiosContent searchParams={searchParams} />
    </Suspense>
  </div>
</main>


);
};

// Filter + Results
const ExploreStudiosContent = async ({ searchParams }) => {
const params = await searchParams;
const selectedCategory = params?.category || "";

return (
<>
{/* Category Filter */} <div className="mb-10"> <div className="mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-300"> <SlidersHorizontal size={19} /> <h2 className="font-semibold">Filter by Category</h2> </div>


    <div className="flex flex-wrap gap-3">
      {categories.map((category) => {
        const isActive =
          category === "All Studios"
            ? !selectedCategory
            : selectedCategory === category;

        const href =
          category === "All Studios"
            ? "/studios"
            : `/studios?category=${encodeURIComponent(category)}`;

        return (
          <Link
            key={category}
            href={href}
            className={`rounded-full border px-5 py-2.5 text-sm font-medium transition ${
              isActive
                ? "border-purple-600 bg-purple-600 text-white"
                : "border-gray-200 bg-white text-gray-600 hover:border-purple-400 hover:text-purple-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-purple-500 dark:hover:text-purple-400"
            }`}
          >
            {category}
          </Link>
        );
      })}
    </div>
  </div>

  {/* Studios */}
  <Suspense
    fallback={
      <div className="py-20 text-center text-gray-500 dark:text-gray-400">
        Loading studios...
      </div>
    }
  >
    <StudiosContent searchParams={searchParams} />
  </Suspense>
</>


);
};

export default ExploreStudios;
