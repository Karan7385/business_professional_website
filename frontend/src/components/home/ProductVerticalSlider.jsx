import React, { memo, useCallback, useState } from "react";

// ================== COMPONENT ==================
const BASE_SERVER_URL = "http://localhost:3000";

function ProductVerticalSliderBase(props) {

  const DEFAULT_PRODUCTS = props.data.map((item) => {
    return {
      id: item.id,
      name: item.name,
      type: item.category,
      grade: item.grade,
      description: item.description,
      imageUrl: [...item.images],
      imageAlt: item.name,
    };
  });


  const [activeIndex, setActiveIndex] = useState(0);
  const total = DEFAULT_PRODUCTS.length;

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  }, [total]);

  const getPositionClass = useCallback(
    (index) => {
      let diff = index - activeIndex;
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;

      if (diff === 0) {
        return `
          z-30 scale-100 translate-x-0
          shadow-2xl
          bg-white/95
          opacity-100
        `;
      }

      if (diff === -1) {
        return `
          z-20 -translate-x-24 sm:-translate-x-40 scale-95
          opacity-90
          shadow-lg
          bg-white/90
        `;
      }

      if (diff === 1) {
        return `
          z-20 translate-x-24 sm:translate-x-40 scale-95
          opacity-90
          shadow-lg
          bg-white/90
        `;
      }

      if (diff === -2 || diff === 2) {
        return `
          z-10 scale-90
          opacity-0
          pointer-events-none
        `;
      }

      return "opacity-0 pointer-events-none";
    },
    [activeIndex, total]
  );

  if (!total) return null;

  return (
    <section className="w-full px-4 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2 font-extrabold">
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="#7A1F1F"
              strokeWidth="1.6"
              viewBox="0 0 24 24"
            >
              <path
                d="M6 7l1.5-4h9L18 7m-12 0h12l1 14H5L6 7zm3 0V5a3 3 0 116 0v2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <h2 className="text-3xl sm:text-4xl text-[#7A1F1F] sanchez-regular">
              OUR TOP PRODUCTS
            </h2>
          </div>
          <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Browse our featured export products and request pricing for your country today.
          </p>
        </div>

        {/* Slider */}
        <div
          className="
            relative
            h-[520px] sm:h-[580px]
            rounded-3xl
            bg-linear-to-br from-[#FFFDF5] via-[#FFF7E3] to-[#FDE7B0]
            shadow-xl
            overflow-hidden
            flex items-center justify-center
            perspective-[1000px]
          "
        >
          <div className="relative w-full h-[440px] sm:h-[500px] flex items-center justify-center">
            {DEFAULT_PRODUCTS.map((product, index) => (
              <article
                key={product.id}
                className={`
                  absolute w-[92%] max-w-2xl
                  top-1/2 -translate-y-1/2
                  rounded-2xl
                  p-6 sm:p-8
                  transform-gpu
                  transition-all duration-500 ease-out
                  cursor-pointer
                  flex flex-col sm:flex-row gap-6 sm:gap-8
                  ${getPositionClass(index)}
                `}
                onClick={() => setActiveIndex(index)}
              >
                {/* Image area */}
                <div className="w-full sm:w-2/5 flex items-center justify-center p-4 border border-gray-100 rounded-lg bg-gray-50/70 flex-shrink-0 aspect-video sm:aspect-square">
                  {product.imageUrl ? (
                    <img
                      src={BASE_SERVER_URL + product.imageUrl}
                      alt={product.imageAlt || product.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <span className="text-xs sm:text-sm font-medium text-gray-400 text-center">
                      Product image / pack-shot
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="w-full sm:w-3/5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs sm:text-sm uppercase tracking-wide px-4 py-1.5 rounded-full font-bold text-[#7A1F1F] bg-[#FAE7E7] unbounded-subHeading">
                        {product.type}
                      </span>
                      <div className="text-xs sm:text-sm text-gray-500 text-right">
                        <div className="font-semibold text-gray-700 sanchez-regular">
                          {product.grade}
                        </div>
                        <div>Grade</div>
                      </div>
                    </div>

                    <h3 className="text-xl sm:text-2xl text-gray-900 mb-3 roboto-text font-semibold">
                      {product.name}
                    </h3>

                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed roboto-text">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#F4DEC3] flex items-center justify-between text-xs sm:text-sm text-gray-500">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#7A1F1F]" />
                      PT INDO BUSINESS EXPORTS
                    </span>
                    <span className="uppercase tracking-wide">
                      {index + 1} / {total}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Controls */}
          <div className="absolute inset-y-0 left-3 sm:left-6 flex items-center">
            <button
              type="button"
              onClick={goPrev}
              className="
                w-10 h-10 sm:w-12 sm:h-12
                rounded-full bg-white/95 hover:bg-white
                shadow-xl flex items-center justify-center
                transition-all duration-200 hover:-translate-x-0.5
              "
              aria-label="Previous product"
            >
              <svg
                className="w-5 h-5 text-[#7A1F1F]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 18l-6-6 6-6"
                />
              </svg>
            </button>
          </div>
          <div className="absolute inset-y-0 right-3 sm:right-6 flex items-center">
            <button
              type="button"
              onClick={goNext}
              className="
                w-10 h-10 sm:w-12 sm:h-12
                rounded-full bg-white/95 hover:bg-white
                shadow-xl flex items-center justify-center
                transition-all duration-200 hover:translate-x-0.5
              "
              aria-label="Next product"
            >
              <svg
                className="w-5 h-5 text-[#7A1F1F]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 18l6-6-6-6"
                />
              </svg>
            </button>
          </div>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {DEFAULT_PRODUCTS.map((_, i) => {
              const isActive = activeIndex === i;
              return (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`
                    w-3 h-3 rounded-full transition-all duration-300
                    ${isActive
                      ? "bg-[#7A1F1F] scale-125 shadow-md"
                      : "bg-[#F4DEC3] hover:bg-[#EED0AA]"
                    }
                  `}
                  aria-label={`Go to product ${i + 1}`}
                  aria-current={isActive ? "true" : "false"}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// Memoized for performance
const ProductVerticalSlider = memo(ProductVerticalSliderBase);

export default ProductVerticalSlider;