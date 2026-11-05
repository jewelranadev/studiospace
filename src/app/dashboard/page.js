import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import {
  Building2,
  PlusCircle,
  MapPin,
  CalendarDays,
  ArrowRight,
} from "lucide-react";

import { auth } from "@/lib/auth";

export const metadata = {
  title: "Dashboard | StudioSpace",
  description: "Manage your studios and bookings on StudioSpace.",
};

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50 px-4 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="h-44 animate-pulse rounded-2xl bg-gray-200" />

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="h-11 w-40 animate-pulse rounded-lg bg-gray-200" />
              <div className="h-11 w-44 animate-pulse rounded-lg bg-gray-200" />
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              <div className="h-80 animate-pulse rounded-2xl bg-gray-200" />
              <div className="h-80 animate-pulse rounded-2xl bg-gray-200" />
            </div>
          </div>
        </main>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  await connection();

  let session = null;
  let sessionFailed = false;

  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.error("Dashboard session error:", error);
    sessionFailed = true;
  }

  if (sessionFailed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            We couldn&apos;t verify your session
          </h1>
          <p className="mt-2 text-gray-500">
            Something went wrong on our side. Please try again in a moment.
          </p>
          <a
            href="/dashboard"
            className="mt-5 inline-block rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            Try Again
          </a>
        </div>
      </main>
    );
  }

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;
  const firstName = user.name?.split(" ")[0] || "there";

  let studios = [];

  try {
    const res = await fetch(`${process.env.SERVER_API_URL}/api/studios/mine`, {
      headers: {
        "x-internal-api-key": process.env.INTERNAL_API_SECRET,
        "x-user-email": user.email,
      },
      cache: "no-store",

      signal: AbortSignal.timeout(25000),
    });

    const result = await res.json();

    if (res.ok && result.success) {
      studios = result.data || [];
    } else {
      console.error("Dashboard Studios API error:", res.status, result);
    }
  } catch (error) {
    console.error("Dashboard Studios Error:", error);
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard", active: true },
    { name: "My Studio Listings", href: "/my-listings" },
    { name: "Add New Studio", href: "/add-studio" },
  ];

  const latestStudios = studios.slice(0, 3);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Welcome Section */}
        <section className="flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between md:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-violet-100 text-2xl font-bold text-violet-600">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "Profile"}
                  width={64}
                  height={64}
                  unoptimized
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                user.name?.charAt(0)?.toUpperCase() || "U"
              )}
            </div>

            <div>
              <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-gray-500">
                Dashboard
              </p>

              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                Welcome back, {firstName}!
              </h1>

              <p className="mt-1 text-gray-500">{user.email}</p>
            </div>
          </div>

          <Link
            href="/add-studio"
            className="flex w-fit items-center gap-2 rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700"
          >
            <PlusCircle size={18} />
            Add New Studio
          </Link>
        </section>

        {/* Dashboard Navigation */}
        <nav className="mt-6 flex flex-wrap gap-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`rounded-lg border px-5 py-3 text-sm font-semibold transition ${
                item.active
                  ? "border-violet-600 bg-violet-600 text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-violet-400 hover:text-violet-600"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Dashboard Sections */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* My Studio Listings */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-900">
                <Building2 size={20} className="text-violet-600" />
                <h2 className="text-xl font-bold">My Studio Listings</h2>
              </div>

              {studios.length > 0 && (
                <Link
                  href="/my-listings"
                  className="flex items-center gap-1 text-sm font-semibold text-violet-600 transition hover:gap-2"
                >
                  View All
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>

            {latestStudios.length > 0 ? (
              <div className="space-y-4">
                {latestStudios.map((studio) => (
                  <div
                    key={studio._id}
                    className="flex items-center gap-4 rounded-xl border border-gray-100 p-3"
                  >
                    <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={studio.image}
                        alt={studio.title}
                        fill
                        sizes="96px"
                        unoptimized
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-bold text-gray-900">
                        {studio.title}
                      </h3>

                      <p className="mt-1 flex items-center gap-1 truncate text-sm text-gray-500">
                        <MapPin size={14} className="shrink-0" />
                        {studio.location}
                      </p>
                    </div>

                    <p className="shrink-0 text-lg font-bold text-violet-600">
                      ${studio.hourlyRate}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-200 py-10 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                  <Building2 size={26} className="text-gray-400" />
                </div>

                <h3 className="font-bold text-gray-800">No studios yet</h3>

                <p className="mt-1 text-sm text-gray-500">
                  Add your first studio and start earning.
                </p>

                <Link
                  href="/add-studio"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
                >
                  <PlusCircle size={17} />
                  Add New Studio
                </Link>
              </div>
            )}
          </section>

          {/* My Bookings */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2 text-gray-900">
              <CalendarDays size={20} className="text-violet-600" />
              <h2 className="text-xl font-bold">My Bookings</h2>
            </div>

            <div className="rounded-xl border border-dashed border-gray-200 py-10 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <CalendarDays size={26} className="text-gray-400" />
              </div>

              <h3 className="font-bold text-gray-800">No bookings yet</h3>

              <p className="mt-1 text-sm text-gray-500">
                Booking will be available soon. Your bookings will appear here.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
