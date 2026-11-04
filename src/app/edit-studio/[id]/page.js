"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";

const initialForm = {
  title: "",
  category: "",
  hourlyRate: "",
  securityDeposit: "",
  maxCapacity: "",
  location: "",
  image: "",
  overview: "",
};

const categories = [
  "Photo Studios",
  "Sound Stages",
  "Podcast Rooms",
  "Music Suites",
  "Art Workshops",
];

export default function EditStudioPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-gray-50">
          <p className="text-lg font-medium text-gray-600">
            Loading studio information...
          </p>
        </main>
      }
    >
      <EditStudioContent />
    </Suspense>
  );
}

function EditStudioContent() {
  const router = useRouter();
  const { id } = useParams();

  const [formData, setFormData] = useState(initialForm);
  const [amenities, setAmenities] = useState([]);
  const [amenityInput, setAmenityInput] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  // Get Existing Studio Data
  useEffect(() => {
    const fetchStudio = async () => {
      try {
        const response = await fetch(`/api/studios/${id}`, {
          cache: "no-store",
        });

        const result = await response.json();

        if (response.status === 401) {
          toast.error("Please login to continue.");
          router.push("/login");
          return;
        }

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch studio");
        }

        const studio = result.data;

        setFormData({
          title: studio.title || "",
          category: studio.category || "",
          hourlyRate: String(studio.hourlyRate ?? ""),
          securityDeposit: String(studio.securityDeposit ?? ""),
          maxCapacity: String(studio.maxCapacity ?? ""),
          location: studio.location || "",
          image: studio.image || "",
          overview: studio.overview || "",
        });

        setAmenities(studio.amenities || []);
      } catch (err) {
        setError(err.message || "Something went wrong.");
        toast.error(err.message || "Failed to load studio information.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudio();
    }
  }, [id, router]);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add Amenity
  const addAmenity = () => {
    const value = amenityInput.trim();

    if (!value) return;

    if (amenities.some((item) => item.toLowerCase() === value.toLowerCase())) {
      toast.error("This amenity has already been added.");
      setAmenityInput("");
      return;
    }

    setAmenities((prev) => [...prev, value]);
    setAmenityInput("");

    toast.success("Amenity added successfully!");
  };

  // Remove Amenity
  const removeAmenity = (itemToRemove) => {
    setAmenities((prev) => prev.filter((item) => item !== itemToRemove));
    toast.success("Amenity removed.");
  };

  // Enter Key
  const handleAmenityKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addAmenity();
    }
  };

  // Update Studio
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (amenities.length === 0) {
      toast.error("Please add at least one studio amenity.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/studios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          hourlyRate: Number(formData.hourlyRate),
          securityDeposit: Number(formData.securityDeposit),
          maxCapacity: Number(formData.maxCapacity),
          amenities,
        }),
      });

      const text = await response.text();

      if (!text) {
        throw new Error("Server returned an empty response.");
      }

      let result;

      try {
        result = JSON.parse(text);
      } catch {
        throw new Error("Server returned an invalid JSON response.");
      }

      if (response.status === 401) {
        toast.error("Please login to continue.");
        router.push("/login");
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update studio.");
      }

      toast.success("Your studio has been updated successfully!");

      setTimeout(() => {
        router.push("/my-listings");
      }, 1500);
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10";

  const labelClass = "mb-2 block text-sm font-semibold text-gray-800";

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg font-medium text-gray-600">
          Loading studio information...
        </p>
      </main>
    );
  }

  if (error && !formData.title) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="mb-4 text-red-600">{error}</p>

          <button
            onClick={() => router.push("/my-listings")}
            className="rounded-lg bg-black px-5 py-3 font-semibold text-white"
          >
            Back to My Listings
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Host Your Space
          </p>

          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Edit Your Studio
          </h1>

          <p className="mt-3 text-gray-600">
            Update your studio information and keep your listing up to date.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8"
        >
          {/* Basic Information */}
          <section>
            <h2 className="mb-5 text-xl font-bold text-gray-900">
              Basic Information
            </h2>

            <div className="space-y-5">
              <div>
                <label className={labelClass}>Studio Title *</label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Creative Photography Studio"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Studio Category *</label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={inputClass}
                  required
                >
                  <option value="">Select a category</option>

                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Studio Overview *</label>

                <textarea
                  name="overview"
                  value={formData.overview}
                  onChange={handleChange}
                  placeholder="Describe your studio and what makes it special..."
                  rows={5}
                  className={inputClass}
                  required
                />
              </div>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Pricing and Capacity */}
          <section>
            <h2 className="mb-5 text-xl font-bold text-gray-900">
              Pricing & Capacity
            </h2>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className={labelClass}>Hourly Rate ($) *</label>

                <input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  placeholder="45"
                  min="1"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Security Deposit ($) *</label>

                <input
                  type="number"
                  name="securityDeposit"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  placeholder="100"
                  min="0"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Maximum Capacity *</label>

                <input
                  type="number"
                  name="maxCapacity"
                  value={formData.maxCapacity}
                  onChange={handleChange}
                  placeholder="8"
                  min="1"
                  step="1"
                  className={inputClass}
                  required
                />
              </div>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Location and Image */}
          <section>
            <h2 className="mb-5 text-xl font-bold text-gray-900">
              Location & Image
            </h2>

            <div className="space-y-5">
              <div>
                <label className={labelClass}>Studio Location *</label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Gulshan, Dhaka"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Studio Image URL *</label>

                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/studio-image.jpg"
                  className={inputClass}
                  required
                />

                <p className="mt-2 text-xs text-gray-500">
                  Provide a publicly accessible image URL.
                </p>
              </div>

              {formData.image && (
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-700">
                    Image Preview
                  </p>

                  <Image
                    src={formData.image}
                    alt="Studio Preview"
                    width={800}
                    height={400}
                    className="h-52 w-full rounded-xl object-cover"
                  />
                </div>
              )}
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Amenities */}
          <section>
            <h2 className="mb-2 text-xl font-bold text-gray-900">
              Studio Amenities
            </h2>

            <p className="mb-5 text-sm text-gray-500">
              Add the equipment and facilities available in your studio.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                onKeyDown={handleAmenityKeyDown}
                placeholder="e.g. Professional Lighting"
                className={inputClass}
              />

              <button
                type="button"
                onClick={addAmenity}
                className="rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-700"
              >
                Add
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800"
                >
                  {amenity}

                  <button
                    type="button"
                    onClick={() => removeAmenity(amenity)}
                    className="font-bold text-red-500 hover:text-red-700"
                    aria-label={`Remove ${amenity}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </section>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-black px-6 py-4 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Updating Studio..." : "Update Studio"}
          </button>
        </form>
      </div>
    </main>
  );
}
