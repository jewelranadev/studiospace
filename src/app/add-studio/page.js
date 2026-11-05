"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  apiErrorMessage,
  describeError,
  notifyError,
  notifyLoading,
  notifySuccess,
  SESSION_EXPIRED_MESSAGE,
} from "@/lib/notify";

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

export default function AddStudioPage() {
  const router = useRouter();

  const [formData, setFormData] = useState(initialForm);
  const [amenities, setAmenities] = useState([]);
  const [amenityInput, setAmenityInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addAmenity = () => {
    const value = amenityInput.trim();
    if (!value) return;

    if (amenities.some((item) => item.toLowerCase() === value.toLowerCase())) {
      notifyError("This amenity has already been added.");
      setAmenityInput("");
      return;
    }

    setAmenities((prev) => [...prev, value]);
    setAmenityInput("");

    notifySuccess("Amenity added successfully!");
  };

  const removeAmenity = (itemToRemove) => {
    setAmenities((prev) => prev.filter((item) => item !== itemToRemove));
    notifySuccess("Amenity removed.");
  };

  const handleAmenityKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addAmenity();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (amenities.length === 0) {
      notifyError("Please add at least one studio amenity.");
      return;
    }

    setLoading(true);

    const loadingId = notifyLoading("Creating studio...");

    try {
      const response = await fetch("/api/studios", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          hourlyRate: Number(formData.hourlyRate),
          securityDeposit: Number(formData.securityDeposit),
          maxCapacity: Number(formData.maxCapacity),
          amenities,
        }),
      });

      if (response.status === 401) {
        notifyError(SESSION_EXPIRED_MESSAGE, { id: loadingId });
        router.push("/login");
        return;
      }

      const contentType = response.headers.get("content-type") || "";
      const text = await response.text();

      if (!text.trim()) {
        throw new Error(
          apiErrorMessage(
            response.status,
            null,
            "The server returned an empty response. Please try again."
          )
        );
      }

      if (!contentType.includes("application/json")) {
        throw new Error(
          apiErrorMessage(
            response.status,
            null,
            "The server returned an unexpected response. Please try again."
          )
        );
      }

      const result = JSON.parse(text);

      if (!response.ok || !result.success) {
        throw new Error(
          apiErrorMessage(response.status, result.message, "Failed to create studio.")
        );
      }

      notifySuccess("Your studio has been created successfully!", {
        id: loadingId,
      });
      setFormData(initialForm);
      setAmenities([]);

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Create Studio Error:", err);
      notifyError(describeError(err, "Failed to create studio."), {
        id: loadingId,
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10";
  const labelClass = "mb-2 block text-sm font-semibold text-gray-800";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Host Your Space
          </p>
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Add Your Studio
          </h1>
          <p className="mt-3 text-gray-600">
            Share your creative space with creators and start earning by
            hosting your studio.
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.image}
                    alt="Studio Preview"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black px-6 py-4 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Studio..." : "Create Studio"}
          </button>
        </form>
      </div>
    </main>
  );
}