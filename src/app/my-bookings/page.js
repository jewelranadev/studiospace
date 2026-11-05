import { headers } from "next/headers";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { auth } from "@/lib/auth";
import { Suspense } from "react";
import CancelBookingButton from "@/app/components/bookings/CancelBookingButton";
import BookingStatus from "@/app/components/bookings/BookingStatus";

export default function MyBookingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-gray-500">Loading bookings...</p>
        </div>
      }
    >
      <MyBookingsContent />
    </Suspense>
  );
}

async function MyBookingsContent() {
  await connection();

  let session = null;

  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.error("My Bookings session error:", error);
    session = null;
  }

  if (!session?.user) {
    redirect("/login");
  }

  let bookings = [];

  try {
    const response = await fetch(
      `${process.env.SERVER_API_URL}/api/bookings/my-bookings`,
      {
        headers: {
          "x-internal-api-key": process.env.INTERNAL_API_SECRET,
          "x-user-email": session.user.email,
          "x-user-id": session.user.id,
          "x-user-name": encodeURIComponent(session.user.name || ""),
        },
        cache: "no-store",
        signal: AbortSignal.timeout(25000),
      },
    );

    const text = await response.text();
    let result;

    try {
      result = JSON.parse(text);
    } catch {
      throw new Error("Invalid response from API server");
    }

    if (result.success) {
      bookings = result.data || [];
    }
  } catch (error) {
    console.error("My Bookings Page Error:", error);
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>

          <p className="mt-2 text-gray-500">
            Manage and track your studio bookings.
          </p>
        </div>

        {bookings.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {booking.studioTitle}
                  </h2>

                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      booking.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : booking.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    <BookingStatus status={booking.status} />
                  </span>
                </div>

                <div className="mt-6 space-y-4 text-sm text-gray-600">
                  <div className="flex items-center gap-3">
                    <CalendarDays size={18} />
                    <span>{booking.date}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock size={18} />
                    <span>
                      {booking.startTime} - {booking.endTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t pt-4">
                    <span>Total Hours</span>
                    <span className="font-semibold text-gray-900">
                      {booking.totalHours} hours
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Total Price</span>
                    <span className="text-lg font-bold text-gray-900">
                      ${booking.totalPrice}
                    </span>
                  </div>

                  {booking.status === "pending" && (
                    <CancelBookingButton bookingId={booking._id.toString()} />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
            <CalendarDays size={45} className="mx-auto text-gray-400" />

            <h2 className="mt-5 text-xl font-bold text-gray-900">
              No Bookings Yet
            </h2>

            <p className="mt-2 text-gray-500">
              You haven't booked any studios yet.
            </p>

            <Link
              href="/studios"
              className="mt-6 inline-block rounded-xl bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800"
            >
              Explore Studios
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
