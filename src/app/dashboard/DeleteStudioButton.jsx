"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DeleteStudioButton({ studioId }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this studio?"
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/studios/${studioId}`, {
        method: "DELETE",
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to delete studio");
      }

      toast.success("Studio deleted successfully!");

      router.refresh();
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
