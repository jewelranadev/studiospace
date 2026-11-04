import { connection } from "next/server";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Star,
  Users,
  ShieldCheck,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Camera,
} from "lucide-react";
import BookingForm from "@/app/components/studios/BookingForm";

async function StudioDetailsContent({ params }) {
  await connection();
  const { id } = await params;

  let studio = null;
  let errorMessage = "";

  try {
    const res = await fetch(`${process.env.SERVER_API_URL}/api/studios/${id}`, {
      headers: {
        "x-internal-api-key": process.env.INTERNAL_API_SECRET,
      },
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      errorMessage = result.message || "Studio not found";
    } else {
      studio = result.data;
    }
  } catch (error) {
    console.error("Studio Details Error:", error);
    errorMessage = "Unable to load studio details.";
  }

  if (!studio) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <Camera size={35} className="text-gray-400" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900">Studio Not Found</h2>

        <p className="mt-3 max-w-md text-gray-500">
          {errorMessage || "The studio you are looking for does not exist."}
        </p>

        <Link
          href="/studios"
          className="mt-6 rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
        >
          Explore Studios
        </Link>
      </section>
    );
  }

  const amenities = Array.isArray(studio.amenities) ? studio.amenities : [];

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Back Navigation */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/studios"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-black"
        >
          <ArrowLeft size={18} />
          Back to Studios
        </Link>
      </div>

      <div className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Studio Image */}
        <div className="relative h-[300px] overflow-hidden rounded-2xl bg-gray-200 sm:h-[450px]">
          {studio.image ? (
            <Image
              src={studio.image}
              alt={studio.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Camera size={50} className="text-gray-400" />
            </div>
          )}

          <div className="absolute left-5 top-5">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow">
              {studio.category}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Left Content */}
          <div className="space-y-10 lg:col-span-2">
            {/* Title and Basic Information */}
            <section>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  {studio.title}
                </h1>

                <div className="flex items-center gap-1 rounded-lg bg-yellow-50 px-3 py-2">
                  <Star size={18} className="fill-yellow-400 text-yellow-400" />

                  <span className="font-bold text-gray-900">
                    {studio.rating || "New"}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-5 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <MapPin size={18} />
                  {studio.location}
                </span>

                <span className="flex items-center gap-2">
                  <Users size={18} />
                  Up to {studio.maxCapacity} people
                </span>
              </div>
            </section>

            {/* Overview */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900">
                About This Studio
              </h2>

              <p className="mt-4 leading-8 text-gray-600">
                {studio.overview || "No description available for this studio."}
              </p>
            </section>

            {/* Amenities */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Studio Amenities
              </h2>

              {amenities.length > 0 ? (
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {amenities.map((amenity, index) => (
                    <div
                      key={`${amenity}-${index}`}
                      className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4"
                    >
                      <CheckCircle2
                        size={20}
                        className="shrink-0 text-green-600"
                      />

                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-gray-500">No amenities listed.</p>
              )}
            </section>

            {/* Host Information */}
            <section className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900">Hosted By</h2>

              <div className="mt-5 flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-xl font-bold text-gray-700">
                  {studio.hostName?.charAt(0)?.toUpperCase() || "H"}
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    {studio.hostName || "Studio Host"}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">Studio Host</p>
                </div>

                <ShieldCheck size={24} className="ml-auto text-green-600" />
              </div>
            </section>
          </div>

          {/* Booking Card */}
          <aside>
            <div className="sticky top-28 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  ${studio.hourlyRate}
                </span>

                <span className="pb-1 text-gray-500">/ hour</span>
              </div>

              <div className="mt-6 space-y-4 border-y border-gray-100 py-5">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Hourly Rate</span>

                  <span className="font-semibold text-gray-900">
                    ${studio.hourlyRate}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Security Deposit</span>

                  <span className="font-semibold text-gray-900">
                    ${studio.securityDeposit || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Maximum Capacity</span>

                  <span className="font-semibold text-gray-900">
                    {studio.maxCapacity} People
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 text-sm text-gray-500">
                <Clock size={17} />
                Flexible hourly booking
              </div>

              <BookingForm studio={studio} />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function StudioDetailsPage({ params }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-gray-500">Loading studio details...</p>
        </div>
      }
    >
      <StudioDetailsContent params={params} />
    </Suspense>
  );
}
