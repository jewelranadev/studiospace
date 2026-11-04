export default function Loading() {
return ( <div className="flex min-h-[60vh] items-center justify-center bg-gray-50"> <div className="text-center"> <div className="relative mx-auto h-12 w-12"> <div className="absolute inset-0 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>


      <div className="absolute inset-2 rounded-full bg-gray-50"></div>
    </div>

    <h2 className="mt-5 text-lg font-semibold text-gray-900">
      StudioSpace
    </h2>

    <p className="mt-1 text-sm text-gray-500">
      Preparing your creative space...
    </p>
  </div>
</div>


);
}
