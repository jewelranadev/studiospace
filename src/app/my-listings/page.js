import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PlusCircle, MapPin, Building2 } from "lucide-react";

import { auth } from "@/lib/auth";
import DeleteStudioButton from "../dashboard/DeleteStudioButton";

export const metadata = {
  title: "My Studio Listings | StudioSpace",
};

export default function MyListingsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50 px-4 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="h-10 w-64 animate-pulse rounded bg-gray-200" />
            <div className="mt-8 h-72 animate-pulse rounded-xl bg-gray-200" />
          </div>
        </main>
      }
    >
      <MyListingsContent />
    </Suspense>
  );
}

async function MyListingsContent() {
  // Check logged-in user
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  let studios = [];

  try {
    const res = await fetch(`${process.env.SERVER_API_URL}/api/studios/mine`, {
      headers: {
        "x-internal-api-key": process.env.INTERNAL_API_SECRET,
        "x-user-email": session.user.email,
      },
      cache: "no-store",
    });

    const result = await res.json();

    if (res.ok && result.success) {
      studios = result.data || [];
    }
  } catch (error) {
    console.error("My Listings Error:", error);
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Studio Listings
            </h1>

            <p className="mt-2 text-gray-500">
              Manage all your studio listings.
            </p>
          </div>

          <Link
            href="/add-studio"
            className="flex w-fit items-center gap-2 rounded-lg bg-violet-600 px-5 py-3 font-semibold text-white hover:bg-violet-700"
          >
            <PlusCircle size={18} />
            Add New Studio
          </Link>
        </div>

        {/* Studio Count */}
        <div className="mt-8 flex items-center gap-3 rounded-xl border bg-white p-5">
          <Building2 className="text-violet-600" size={28} />

          <div>
            <p className="text-sm text-gray-500">Total Studios</p>
            <h2 className="text-2xl font-bold text-gray-900">
              {studios.length}
            </h2>
          </div>
        </div>

        {/* Studio Cards */}
        {studios.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <div
                key={studio._id}
                className="overflow-hidden rounded-xl border bg-white shadow-sm"
              >
                <div className="relative h-52 w-full">
                  <Image
                    src={studio.image}
                    alt={studio.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>

                <div className="p-5">
                  <span className="text-sm font-semibold text-violet-600">
                    {studio.category}
                  </span>

                  <h2 className="mt-2 text-xl font-bold text-gray-900">
                    {studio.title}
                  </h2>

                  <p className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                    <MapPin size={16} />
                    {studio.location}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t pt-4">
                    <p className="font-bold text-violet-600">
                      ${studio.hourlyRate} / hr
                    </p>

                    <Link
                      href={`/studios/${studio._id}`}
                      className="text-sm font-semibold text-gray-700 hover:text-violet-600"
                    >
                      View Details
                    </Link>

                    <Link
                      href={`/edit-studio/${studio._id}`}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Edit
                    </Link>
                    <DeleteStudioButton studioId={studio._id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-xl border border-dashed bg-white py-16 text-center">
            <Building2 size={40} className="mx-auto text-gray-400" />

            <h2 className="mt-4 text-xl font-bold text-gray-800">
              No Studios Found
            </h2>

            <p className="mt-2 text-gray-500">
              You haven't added any studios yet.
            </p>

            <Link
              href="/add-studio"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-3 font-semibold text-white hover:bg-violet-700"
            >
              <PlusCircle size={18} />
              Add Your First Studio
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
