import WorldMap from "../../assets/images/world-map.jpg";

export default function About() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-slate-100 via-orange-50 to-slate-100 px-4 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-7xl rounded-3xl from-amber-200 via-orange-100 to-amber-200 p-8 sm:p-12 lg:p-16 shadow-xl shadow-red-100/70">
        <div className="flex flex-col gap-16 lg:flex-row lg:items-center">
          <div className="flex-1 lg:order-2">
            <div className="relative mx-auto max-w-lg">
              {/* Clean, subtle card design */}
              <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white/70 shadow-2xl shadow-blue-100/50 backdrop-blur-md transition-transform duration-500 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-200/70">
                <div className="overflow-hidden">
                  <img
                    src={WorldMap}
                    alt="A world map showing global trade routes"
                    className="aspect-4/3 w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* Simple overlay label */}
                <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-lg">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  Global Sourcing
                </div>
              </div>

              {/* Minimalist floating badge */}
              <div className="absolute -right-4 bottom-8 hidden sm:block rounded-xl border border-red-200 bg-white/90 p-3 text-sm font-semibold text-red-600 shadow-lg backdrop-blur-sm">
                PT INDO BUSINESS EXPORTS
              </div>
            </div>
          </div>

          {/* Text side (Order 1 - Left on desktop) */}
          <div className="flex-1 space-y-8 lg:order-1">
            {/* Minimalist tag (using red tones to match the inner card) */}
            <p className="inline-block rounded-full bg-red-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-red-600">
              OUR MISSION
            </p>

            {/* Minimalist, clean header (using red accent) */}
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-gray-900">
              Dedicated to{" "}
              <span className="font-semibold text-red-600">quality</span>,
              transparency, and global supply.
            </h2>

            {/* Minimalist body text */}
            <p className="text-base text-gray-600 leading-relaxed max-w-xl">
              PT INDO Business Exports specializes in premium spices, herbs, gums resins, and natural essential oils, sourced directly from trusted farmers and certified processors. We offer consistent purity, aroma, and quality with safe packaging and on-time global delivery for importers, manufacturers, and wholesale buyers.
            </p>

            {/* Minimalist stats section (using white/red tones) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-xl pt-4">
              <div className="rounded-xl border border-red-200 bg-white/70 p-4 text-center">
                <p className="text-2xl font-semibold text-gray-900">150+</p>
                <p className="mt-1 text-xs text-gray-500">Product SKUs</p>
              </div>
              <div className="rounded-xl border border-red-200 bg-white/70 p-4 text-center">
                <p className="text-2xl font-semibold text-gray-900">20+</p>
                <p className="mt-1 text-xs text-gray-500">Global Markets</p>
              </div>
              <div className="rounded-xl border border-red-200 bg-white/70 p-4 text-center">
                <p className="text-2xl font-semibold text-gray-900">500 MT</p>
                <p className="mt-1 text-xs text-gray-500">Annual Capacity</p>
              </div>
              <div className="rounded-xl border border-red-200 bg-white/70 p-4 text-center">
                <p className="text-2xl font-semibold text-gray-900">100%</p>
                <p className="mt-1 text-xs text-gray-500">Verified Sourcing</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* --- End Main Content Card Wrapper --- */}

    </section>
  );
}