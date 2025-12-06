import React, { memo, useEffect, useState } from "react";

function ProductDetailsSheet({ product, isOpen, onClose }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [product]);

  if (!product) return null;

  const hasImages = product.images && product.images.length > 0;

  const nextImage = () => {
    if (!hasImages) return;
    setActiveImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    if (!hasImages) return;
    setActiveImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const BASE_SERVER_URL="http://localhost:3000";

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`
          fixed top-0 right-0 z-50 h-full w-full sm:w-[440px] lg:w-[480px]
          bg-gradient-to-b from-white via-[#FFF7E3] to-[#FFEBD2]
          shadow-[0_0_40px_rgba(0,0,0,0.35)]
          border-l border-[#F3DFC4]
          transform transition-transform duration-300 ease-out
          flex flex-col
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="relative px-5 pt-5 pb-4 border-b border-[#F3DFC4]">
          <div className="absolute -top-10 right-0 w-32 h-32 rounded-full bg-[#EAC97C]/50 blur-3xl pointer-events-none" />

          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#B2501F] mb-1 unbounded-subHeading">
                Spice Details
              </p>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#7A1F1F] leading-snug unbounded-heading">
                {product.name}
              </h2>
              <p className="text-[12px] text-[#6B4B3A] mt-1">
                {product.origin} • <span className="unbounded-subHeading">{product.category}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="
                inline-flex items-center justify-center
                w-9 h-9 rounded-full
                bg-white/90 border border-[#F3DFC4]
                text-[#7A1F1F]
                hover:bg-white hover:shadow-md
                transition-all duration-200
              "
              aria-label="Close details"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Scroll content */}
        <div className="flex-1 overflow-y-auto px-5 pb-6 pt-4 space-y-5">
          {/* Image slider */}
          <div className="relative rounded-2xl overflow-hidden border border-[#F3DFC4] bg-white shadow-sm">
            <div className="relative aspect-[4/3]">
              {hasImages ? (
                <img
                  key={product.images[activeImageIndex]}
                  src={BASE_SERVER_URL + product.images[activeImageIndex]}
                  alt={`${product.name} – image ${activeImageIndex + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-opacity duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-[#6B4B3A] bg-[#FFF7E3]">
                  Image coming soon
                </div>
              )}

              {hasImages && product.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="
                      absolute left-2 top-1/2 -translate-y-1/2
                      w-8 h-8 rounded-full bg-white/85
                      flex items-center justify-center
                      shadow-sm hover:shadow-md
                      hover:bg-white transition-all
                    "
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 18l-6-6 6-6"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="
                      absolute right-2 top-1/2 -translate-y-1/2
                      w-8 h-8 rounded-full bg-white/85
                      flex items-center justify-center
                      shadow-sm hover:shadow-md
                      hover:bg-white transition-all
                    "
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 6l6 6-6 6"
                      />
                    </svg>
                  </button>

                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {product.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`
                          w-2 h-2 rounded-full
                          transition-all duration-200
                          ${
                            idx === activeImageIndex
                              ? "bg-[#7A1F1F] scale-110"
                              : "bg-white/70"
                          }
                        `}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Overview */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[#7A1F1F] sanchez-regular">
              Description
            </h3>
            {product.description && (
              <p className="text-xs sm:text-sm text-[#6B4B3A] leading-relaxed text-justify">
                {product.description}
              </p>
            )}
          </div>

          {/* Specs */}
          <div className="rounded-2xl bg-white/90 border border-[#F3DFC4] p-4 space-y-3">
            <h3 className="text-sm font-semibold text-[#7A1F1F] mb-3 unbounded-subHeading">
              Technical Snapshot
            </h3>
            <div className="grid grid-cols-2 gap-3 text-[11px] sm:text-xs text-[#4B2B2B]">
              <div>
                <div className="font-semibold text-[#7A1F1F] mb-0.5">
                  Grade
                </div>
                <div>{product.grade}</div>
              </div>
              <div>
                <div className="font-semibold text-[#7A1F1F] mb-0.5">
                  Moisture
                </div>
                <div>{product.moisture}</div>
              </div>
              <div>
                <div className="font-semibold text-[#7A1F1F] mb-0.5">MOQ</div>
                <div>{product.min_order_qty}</div>
              </div>
              <div>
                <div className="font-semibold text-[#7A1F1F] mb-0.5">
                  Category
                </div>
                <div>{product.category}</div>
              </div>
            </div>
          </div>

          {/* Applications + Packaging */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/90 border border-[#F3DFC4] p-4">
              <h3 className="text-sm font-semibold text-[#7A1F1F] mb-2">
                Packaging Options
              </h3>
              <ul className="space-y-1.5 text-xs text-[#4B2B2B]">
                {product.packaging?.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-[3px] w-1.5 h-1.5 rounded-full bg-[#B2501F]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Certifications */}
          {product.certifications?.length > 0 && (
            <div className="rounded-2xl bg-white/90 border border-[#F3DFC4] p-4">
              <h3 className="text-sm font-semibold text-[#7A1F1F] mb-2">
                Certifications & Compliance
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.certifications.map((c) => (
                  <span
                    key={c}
                    className="
                      inline-flex items-center gap-1.5
                      px-3 py-1 rounded-full
                      text-[11px] font-medium
                      bg-[#FFF3E0] text-[#7A1F1F]
                      border border-[#F4DEC3]
                    "
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7A1F1F]" />
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default memo(ProductDetailsSheet);