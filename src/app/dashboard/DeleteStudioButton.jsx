"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to delete studio");
      }

      alert("Studio deleted successfully!");
      router.refresh();
    } catch (error) {
      alert(error.message);
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