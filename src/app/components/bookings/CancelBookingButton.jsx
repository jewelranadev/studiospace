"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CancelBookingButton({ bookingId }) {
const [loading, setLoading] = useState(false);
const router = useRouter();

const handleCancel = async () => {
const confirmCancel = window.confirm(
"Are you sure you want to cancel this booking?"
);


if (!confirmCancel) return;

try {
  setLoading(true);

  const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
    method: "PATCH",
  });

  if (res.status === 401) {
    router.push("/login");
    return;
  }

  const result = await res.json();

  if (!res.ok || !result.success) {
    throw new Error(result.message || "Failed to cancel booking");
  }

  toast.success("Booking cancelled successfully!");
  router.refresh();
} catch (error) {
  toast.error(error.message || "Failed to cancel booking");
} finally {
  setLoading(false);
}


};

return ( <button
   onClick={handleCancel}
   disabled={loading}
   className="mt-5 w-full rounded-lg bg-red-600 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
 >
{loading ? "Cancelling..." : "Cancel Booking"} </button>
);
}
