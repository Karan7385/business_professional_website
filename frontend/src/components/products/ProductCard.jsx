import React, { memo } from "react";

const BASE_SERVER_URL="http://localhost:3000";

function ProductCard({ product, onView }) {
  return (
    <article
      className="
        group relative bg-white/90 border border-[#F3DFC4]
        rounded-2xl shadow-sm hover:shadow-xl
        transition-all duration-300
        overflow-hidden flex flex-col
        hover:-translate-y-1
      "
    >
      <div className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#EAC97C]/35 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={BASE_SERVER_URL + product.images?.[0]}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/85 border border-[#F3DFC4] text-[11px] font-semibold text-[#7A1F1F] shadow-sm unbounded-subHeading">
          {product.category}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-semibold text-lg text-[#3A211F] line-clamp-1 sanchez-regular">
            {product.name}
          </h2>
          <span className="text-[11px] px-2 py-1 rounded-full bg-[#FFF3E0] text-[#A15A2E] border border-[#F4DEC3]">
            {product.origin}
          </span>
        </div>

        {product.description && (
          <p className="text-sm text-[#5C4234] line-clamp-2 sanchez-regular text-justify">{product.description}</p>
        )}

        <div className="mt-1 grid grid-cols-3 gap-8 text-[11px] text-[#6B4B3A]">
          <div>
            <div className="font-semibold text-[#7A1F1F]">Grade</div>
            <div className="line-clamp-1">{product.grade}</div>
          </div>
          <div>
            <div className="font-semibold text-[#7A1F1F]">Moisture</div>
            <div>{product.moisture}</div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#F3DFC4]">
          <p className="text-[11px] text-[#6B4B3A] max-w-[60%]">
            MOQ: <span className="font-semibold">{product.min_order_qty}</span>
          </p>

          <button
            type="button"
            onClick={() => onView(product)}
            className="
              inline-flex items-center gap-1.5
              text-xs font-semibold
              px-3 py-1.5 rounded-full
              bg-[#7A1F1F] text-[#FFF7E3]
              hover:bg-[#8f2b2b]
              transition-all duration-200
              shadow-sm hover:shadow-md
            "
          >
            View Details
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}

export default memo(ProductCard);