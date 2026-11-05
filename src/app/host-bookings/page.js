import { Suspense } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ConfirmBookingButton from "@/app/components/bookings/ConfirmBookingButton";
import BookingStatus from "@/app/components/bookings/BookingStatus";

export default function HostBookingsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-gray-500">
          Loading bookings...
        </div>
      }
    >
      <HostBookingsContent />
    </Suspense>
  );
}

async function HostBookingsContent() {
  await connection();

  let session = null;

  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.error("Host Bookings session error:", error);
    session = null;
  }

  if (!session?.user) {
    redirect("/login");
  }

  let bookings = [];

  try {
    const response = await fetch(
      `${process.env.SERVER_API_URL}/api/bookings/host-bookings`,
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

    bookings = result.success ? result.data || [] : [];
  } catch (error) {
    console.error("Host Bookings Page Error:", error);
  }

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Manage Bookings</h1>

      <p className="mb-8 text-gray-500">
        View and manage bookings for your studios.
      </p>

      {bookings.length === 0 ? (
        <div className="rounded-xl border border-gray-200 p-10 text-center">
          <h2 className="text-xl font-semibold">No bookings yet</h2>
          <p className="mt-2 text-gray-500">
            You haven't received any studio bookings.
          </p>

          <Link
            href="/my-listings"
            className="mt-5 inline-block rounded-lg bg-black px-5 py-3 text-white"
          >
            My Studio Listings
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="rounded-xl border border-gray-200 p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-bold">{booking.studioTitle}</h2>

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

              <div className="mt-5 grid gap-3 text-gray-600 sm:grid-cols-2">
                <p>Date: {booking.date}</p>
                <p>
                  Time: {booking.startTime} - {booking.endTime}
                </p>
                <p>Total Hours: {booking.totalHours}</p>
                <p>Total Price: ${booking.totalPrice}</p>
                <p>Customer: {booking.userEmail}</p>
                {booking.status === "pending" && (
                  <ConfirmBookingButton bookingId={booking._id.toString()} />
                )}
              </div>

              {booking.status === "pending" && (
                <p className="mt-4 text-sm text-yellow-700">
                  This booking is waiting for your approval.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
