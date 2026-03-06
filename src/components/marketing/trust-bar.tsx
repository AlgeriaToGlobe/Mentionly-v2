export function TrustBar() {
  return (
    <section className="py-8 bg-white">
      <div className="mx-auto max-w-7xl px-6 flex flex-col items-center gap-3">
        <p className="text-sm text-gray-400 font-medium">
          Trusted by 200+ businesses
        </p>
        <div className="flex -space-x-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
