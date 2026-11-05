"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import ConfirmDialog from "@/app/components/shared/ConfirmDialog";
import {
  apiErrorMessage,
  describeError,
  notifyError,
  notifyLoading,
  notifySuccess,
  SESSION_EXPIRED_MESSAGE,
} from "@/lib/notify";

export default function ConfirmBookingButton({ bookingId }) {
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const router = useRouter();

  const handleConfirm = async () => {
    if (loading) return;

    const loadingId = notifyLoading("Confirming booking...");

    try {
      setLoading(true);

      const res = await fetch(`/api/bookings/${bookingId}/confirm`, {
        method: "PATCH",
      });

      if (res.status === 401) {
        notifyError(SESSION_EXPIRED_MESSAGE, { id: loadingId });
        setConfirmOpen(false);
        router.push("/login");
        return;
      }

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(
          apiErrorMessage(res.status, result.message, "Failed to confirm booking.")
        );
      }

      notifySuccess("Booking confirmed successfully!", { id: loadingId });

      setConfirmOpen(false);
      router.refresh();
    } catch (error) {
      notifyError(describeError(error, "Failed to confirm booking."), {
        id: loadingId,
      });
      // Keep the dialog open so the user can retry.
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setConfirmOpen(true)}
        disabled={loading}
        className="mt-4 w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Confirming..." : "Confirm Booking"}
      </button>

      <ConfirmDialog
        open={confirmOpen}
        title="Confirm this booking?"
        description="Confirm that the booking is approved. The guest will be notified that their booking is confirmed."
        confirmLabel="Confirm Booking"
        cancelLabel="Not Yet"
        onConfirm={handleConfirm}
        onClose={() => !loading && setConfirmOpen(false)}
        icon={<CheckCircle2 size={24} />}
      />
    </>
  );
}
