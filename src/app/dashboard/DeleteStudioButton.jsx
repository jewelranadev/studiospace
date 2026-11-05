"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import ConfirmDialog from "@/app/components/shared/ConfirmDialog";
import {
  apiErrorMessage,
  describeError,
  notifyError,
  notifyLoading,
  notifySuccess,
  SESSION_EXPIRED_MESSAGE,
} from "@/lib/notify";

export default function DeleteStudioButton({ studioId }) {
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (loading) return;

    const loadingId = notifyLoading("Deleting studio...");

    try {
      setLoading(true);

      const res = await fetch(`/api/studios/${studioId}`, {
        method: "DELETE",
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
          apiErrorMessage(res.status, result.message, "Failed to delete studio.")
        );
      }

      notifySuccess("Studio deleted successfully!", { id: loadingId });

      setConfirmOpen(false);
      router.refresh();
    } catch (error) {
      notifyError(describeError(error, "Failed to delete studio."), {
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
        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
      >
        {loading ? "Deleting..." : "Delete"}
      </button>

      <ConfirmDialog
        open={confirmOpen}
        variant="destructive"
        icon={<Trash2 size={24} />}
        title="Delete this studio?"
        description="This studio will be permanently deleted. This action cannot be undone."
        confirmLabel="Delete Studio"
        cancelLabel="Keep Studio"
        onConfirm={handleDelete}
        onClose={() => !loading && setConfirmOpen(false)}
      />
    </>
  );
}
