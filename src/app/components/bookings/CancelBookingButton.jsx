"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ban } from "lucide-react";
import ConfirmDialog from "@/app/components/shared/ConfirmDialog";
import {
  apiErrorMessage,
  describeError,
  notifyError,
  notifyLoading,
  notifySuccess,
  SESSION_EXPIRED_MESSAGE,
} from "@/lib/notify";

export default function CancelBookingButton({ bookingId }) {
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    if (loading) return;

    const loadingId = notifyLoading("Cancelling booking...");

    try {
      setLoading(true);

      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
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
          apiErrorMessage(res.status, result.message, "Failed to cancel booking.")
        );
      }

      notifySuccess("Booking cancelled successfully!", { id: loadingId });

      setConfirmOpen(false);
      router.refresh();
    } catch (error) {
      notifyError(describeError(error, "Failed to cancel booking."), {
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
        className="mt-5 w-full rounded-lg bg-red-600 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
      >
        {loading ? "Cancelling..." : "Cancel Booking"}
      </button>

      <ConfirmDialog
        open={confirmOpen}
        variant="destructive"
        icon={<Ban size={24} />}
        title="Cancel this booking?"
        description="The booking will be cancelled and cannot be restored. You may need to book again later."
        confirmLabel="Cancel Booking"
        cancelLabel="Keep Booking"
        onConfirm={handleCancel}
        onClose={() => !loading && setConfirmOpen(false)}
      />
    </>
  );
}
