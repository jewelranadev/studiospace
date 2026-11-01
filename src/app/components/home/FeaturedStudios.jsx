import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, ArrowRight } from "lucide-react";

const FeaturedStudios = async () => {
  let studios = [];

  // Fetch Featured Studios from Backend API
  try {
    const res = await fetch(
      `${process.env.SERVER_API_URL}/api/studios/featured`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch studios");
    }

    const result = await res.json();

    studios = result.data || [];
  } catch (error) {
    console.error("Featured Studios Error:", error);
  }

  return (
    <section className="bg-gray-50 px-4 py-20 md:px-10 lg:px-20">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 font-semibold tracking-widest text-purple-600">
              DISCOVER YOUR SPACE
            </p>

            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Featured Studios
            </h2>

            <p className="mt-3 text-gray-500">
              Explore our most popular creative spaces.
            </p>
          </div>

          <Link
            href="/studios"
            className="flex items-center gap-2 font-semibold text-purple-600 transition hover:gap-3"
          >
            Explore All Studios
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Studio Cards */}
        {studios.length > 0 ? (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <div
                key={studio._id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                {/* Studio Image */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={studio.image}
                    alt={studio.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Rating Badge */}
                  <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow">
                    <Star
                      size={15}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    {studio.rating}
                  </div>
                </div>

                {/* Studio Information */}
                <div className="flex flex-1 flex-col p-5">
                  {/* Category */}
                  <div className="mb-3">
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
                      {studio.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-purple-700">
                    {studio.title}
                  </h3>

                  {/* Location */}
                  <p className="mb-5 flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={16} className="shrink-0" />
                    {studio.location}
                  </p>

                  {/* Price and Details Button */}
                  <div className="mt-auto flex items-center justify-between border-t border-gray-200 pt-4">
                    <div>
                      <p className="text-lg font-bold text-purple-600">
                        ${studio.hourlyRate}
                      </p>

                      <span className="text-sm text-gray-500">Per Hour</span>
                    </div>

                    <Link
                      href={`/studios/${studio._id}`}
                      className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-purple-700"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center">
            <h3 className="text-xl font-semibold text-gray-800">
              No Studios Available
            </h3>

            <p className="mt-2 text-gray-500">
              There are no featured studios available right now.
            </p>

            <Link
              href="/studios"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700"
            >
              Explore Studios
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedStudios;
