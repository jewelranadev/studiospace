export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"></div>

        <p className="mt-4 text-gray-600">
          Loading StudioSpace...
        </p>
      </div>
    </div>
  );
}