import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";

const BASE_SERVER_URL = import.meta.env.VITE_BASE_SERVER_URL;

function ProductVerticalSliderBase({ data }) {
  const [preferences, setPreferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  /* ================= FETCH PREFERENCES ================= */
  useEffect(() => {
    async function fetchPreferences() {
      try {
        const res = await axios.get(
          `${BASE_SERVER_URL}/api/preferences`
        );
        setPreferences(res.data.data || []);
      } catch (err) {
        console.error("Preferences fetch failed", err);
        setPreferences([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPreferences();
  }, []);

  /* ================= FILTER PRODUCTS ================= */
  const SLIDER_PRODUCTS = useMemo(() => {
    if (!preferences.length || !data?.length) return [];

    const priorityMap = new Map(
      preferences.map((p) => [p.product_id ?? p.id, p.priority])
    );

    return data
      .filter((product) => priorityMap.has(product.id))
      .sort(
        (a, b) =>
          priorityMap.get(a.id) - priorityMap.get(b.id)
      )
      .map((item) => ({
        id: item.id,
        name: item.name,
        type: item.category,
        grade: item.grade,
        description: item.description,
        imageUrl: item.images?.[0] || null,
      }));
  }, [preferences, data]);

  useEffect(() => {
    if (SLIDER_PRODUCTS.length) setActiveIndex(0);
  }, [SLIDER_PRODUCTS]);

  const total = SLIDER_PRODUCTS.length;

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) =>
      prev === 0 ? total - 1 : prev - 1
    );
  }, [total]);

  /* ================= POSITION + ANIMATION ================= */
  const getPositionClass = useCallback(
    (index) => {
      const diff = index - activeIndex;

      if (diff === 0)
        return `
          z-30
          scale-100
          translate-x-0 translate-y-0
          opacity-100
          bg-white/95
          shadow-2xl
        `;

      if (diff === -1)
        return `
          z-20
          -translate-x-40 -translate-y-2
          scale-95
          opacity-80
          bg-white/80
          backdrop-blur
          shadow-lg
        `;

      if (diff === 1)
        return `
          z-20
          translate-x-40 translate-y-2
          scale-95
          opacity-80
          bg-white/80
          backdrop-blur
          shadow-lg
        `;

      return `
        opacity-0
        scale-90
        blur-sm
        pointer-events-none
      `;
    },
    [activeIndex]
  );

  /* ================= RENDER STATES ================= */
  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">
        Loading featured products…
      </div>
    );
  }

  if (!total) {
    return (
      <div className="py-20 text-center text-gray-500">
        No preferred products configured yet.
      </div>
    );
  }

  /* ================= MAIN RENDER ================= */
  return (
    <section className="w-full px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl text-center text-[#7A1F1F] mb-10 sanchez-regular">
          OUR TOP PRODUCTS
        </h2>

        <div className="relative h-[400px] flex items-center justify-center overflow-hidden rounded-3xl bg-linear-to-br from-[#FFFDF5] via-[#FFF7E3] to-[#FDE7B0] shadow-xl">
          {SLIDER_PRODUCTS.map((product, index) => (
            <article
              key={product.id}
              onClick={() => setActiveIndex(index)}
              className={`
                absolute w-[88%] max-w-2xl
                p-6 sm:p-8
                rounded-2xl
                cursor-pointer
                flex gap-6
                transform-gpu
                transition-all duration-700
                ease-[cubic-bezier(.22,1,.36,1)]
                hover:-translate-y-1
                ${getPositionClass(index)}
              `}
            >
              {/* Image */}
              <div className="w-2/5 aspect-square bg-gray-100 rounded-xl overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={BASE_SERVER_URL + product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400 text-sm">
                    No Image
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="w-3/5 flex flex-col justify-between">
                <div>
                  {/* <span className="text-xs font-bold uppercase text-[#7A1F1F]">
                    {product.type}
                  </span> */}
                  <h3 className="text-xl font-semibold mt-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t text-xs text-gray-500 flex justify-between">
                  <span>Grade: {product.grade}</span>
                  <span>
                    {index + 1} / {total}
                  </span>
                </div>
              </div>
            </article>
          ))}

          {/* Controls */}
          <button
            onClick={goPrev}
            className="absolute left-4 w-11 h-11 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition"
          >
            ‹
          </button>
          <button
            onClick={goNext}
            className="absolute right-4 w-11 h-11 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}

export default memo(ProductVerticalSliderBase);