"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  apiErrorMessage,
  describeError,
  notifyError,
  notifyLoading,
  notifySuccess,
} from "@/lib/notify";

export default function BookingForm({ studio }) {
const [date, setDate] = useState("");
const [startTime, setStartTime] = useState("");
const [endTime, setEndTime] = useState("");
const [loading, setLoading] = useState(false);
const router = useRouter();

const totalHours =
startTime && endTime
? Math.max(
0,
(new Date(`1970-01-01T${endTime}:00`) -
new Date(`1970-01-01T${startTime}:00`)) /
(1000 * 60 * 60)
)
: 0;

const totalPrice = totalHours * Number(studio.hourlyRate);

const handleBooking = async (e) => {
e.preventDefault();

if (loading) return;

if (!date || !startTime || !endTime) {
  notifyError("Please fill in all booking fields.");
  return;
}

if (totalHours <= 0) {
  notifyError("End time must be after start time.");
  return;
}

const loadingId = notifyLoading("Processing booking...");

try {
  setLoading(true);

  const res = await fetch("/api/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      studioId: studio._id,
      date,
      startTime,
      endTime,
    }),
  });

  if (res.status === 401) {
    notifyError(apiErrorMessage(401), { id: loadingId });
    router.push("/login");
    return;
  }

  const result = await res.json();

  if (!res.ok || !result.success) {
    throw new Error(
      apiErrorMessage(res.status, result.message, "Booking failed.")
    );
  }

  notifySuccess("Booking request submitted successfully!", { id: loadingId });

  setDate("");
  setStartTime("");
  setEndTime("");
} catch (error) {
  notifyError(describeError(error, "Booking failed."), {
    id: loadingId,
  });
} finally {
  setLoading(false);
}


};

return ( <form onSubmit={handleBooking} className="mt-6 space-y-5"> <div> <label className="mb-2 block text-sm font-medium text-gray-700">
Booking Date </label>


    <input
      type="date"
      min={new Date().toLocaleDateString("en-CA")}
      value={date}
      onChange={(e) => setDate(e.target.value)}
      className="w-full rounded-lg border border-gray-300 px-4 py-3"
      required
    />
  </div>

  <div>
    <label className="mb-2 block text-sm font-medium text-gray-700">
      Start Time
    </label>

    <input
      type="time"
      value={startTime}
      onChange={(e) => setStartTime(e.target.value)}
      className="w-full rounded-lg border border-gray-300 px-4 py-3"
      required
    />
  </div>

  <div>
    <label className="mb-2 block text-sm font-medium text-gray-700">
      End Time
    </label>

    <input
      type="time"
      value={endTime}
      onChange={(e) => setEndTime(e.target.value)}
      className="w-full rounded-lg border border-gray-300 px-4 py-3"
      required
    />
  </div>

  {totalHours > 0 && (
    <div className="rounded-lg bg-gray-50 p-4">
      <div className="flex justify-between text-sm">
        <span>Duration</span>
        <span>{totalHours} hours</span>
      </div>

      <div className="mt-2 flex justify-between font-bold">
        <span>Total Price</span>
        <span>${totalPrice}</span>
      </div>
    </div>
  )}

  <button
    type="submit"
    disabled={loading}
    className="w-full rounded-xl bg-black py-4 font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
  >
    {loading ? "Processing..." : "Book This Studio"}
  </button>
</form>

);
}
