"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ConfirmBookingButton({ bookingId }) {
const [loading, setLoading] = useState(false);
const router = useRouter();

const handleConfirm = async () => {
const confirmAction = window.confirm(
"Are you sure you want to confirm this booking?"
);


if (!confirmAction) return;

try {
  setLoading(true);

  const res = await fetch(`/api/bookings/${bookingId}/confirm`, {
    method: "PATCH",
  });

  const result = await res.json();

  if (!res.ok || !result.success) {
    throw new Error(result.message || "Failed to confirm booking");
  }

  toast.success("Booking confirmed successfully!");
  router.refresh();
} catch (error) {
  toast.error(error.message || "Failed to confirm booking");
} finally {
  setLoading(false);
}


};

return ( <button
   onClick={handleConfirm}
   disabled={loading}
   className="mt-4 w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
 >
{loading ? "Confirming..." : "Confirm Booking"} </button>
);
}
