"use client";

export default function Error({ error, reset }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Something went wrong!
        </h1>

        <p className="mt-3 text-gray-600">
          We couldn't load this page. Please try again.
        </p>

        <button
          onClick={() => reset()}
          className="mt-6 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}