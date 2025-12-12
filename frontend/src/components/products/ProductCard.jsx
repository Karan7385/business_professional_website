import React, { useState } from "react";
import { useContactModal } from "../../context/ContactModalContext.jsx";

const BASE_SERVER_URL = "http://localhost:3000";

export default function ProductShowcase({ product, index }) {
  console.log(product);

  const { openContactModal } = useContactModal();

  // FIRST product image on RIGHT, then alternate
  const isReverse = index % 2 === 0;

  const [open, setOpen] = useState(false);

  return (
    <section
      className={`
        w-full flex flex-col lg:flex-row md:m-5 rounded-2xl shadow-lg shadow-red-200
        ${isReverse ? "lg:flex-row-reverse" : ""}
        min-h-[80vh]
        bg-amber-50
        border-b border-[#F3DFC4]
      `}
    >
      {/* IMAGE SECTION */}
      <div className="relative lg:w-1/2 w-full h-[55vh] lg:h-auto overflow-hidden rounded-2xl">
        <img
          src={BASE_SERVER_URL + product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1200 ease-out hover:scale-105"
        />

        <div className="absolute inset-0 bg-linear-to-r from-black/30 via-transparent to-black/30" />

        <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur border border-[#F3DFC4] text-xs font-semibold text-[#7A1F1F]">
          {product.category}
        </div>
      </div>

      {/* TEXT CONTENT SECTION */}
      <div
        className={`lg:w-1/2 w-full flex items-center ${isReverse ? "lg:justify-start" : "lg:justify-end"
          }`}
      >
        <div className="w-full px-6 md:px-12 lg:px-20 py-12">
          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#3A211F] sanchez-regular">
            {product.name}
          </h2>

          {/* Origin */}
          <p className="mt-2 text-sm uppercase tracking-widest text-[#A15A2E] font-semibold">
            Origin: {product.origin}
          </p>

          {/* Short description */}
          {product.description && (
            <p className="mt-6 text-base leading-relaxed text-[#5C4234] max-w-2xl">
              {product.description}
            </p>
          )}

          {/* SUMMARY SPECS */}
          <div className="mt-8 grid grid-cols-2 gap-x-10 gap-y-4 text-sm max-w-xl">
            <Spec label="Grade" value={product.grade} />
            <Spec label="Moisture" value={product.moisture} />
            <Spec label="MOQ" value={product.min_order_qty} />
            <Spec label="Category" value={product.category} />
          </div>

          {/* TOGGLE BUTTON */}
          <div className="mt-10 flex flex-wrap gap-4">
            {/* View Product Details */}
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="
      inline-flex items-center gap-3
      px-6 py-3 rounded-full
      bg-[#7A1F1F] text-[#FFF7E3]
      font-semibold text-sm
      transition-all duration-300
      hover:bg-[#8f2b2b]
      shadow-md hover:shadow-lg sanchez-regular
    "
            >
              {open ? "Hide Product Details" : "View Product Details"}
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${open ? "rotate-180" : ""
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 9l6 6 6-6"
                />
              </svg>
            </button>

            {/* Enquiry Now */}
            <button
              onClick={openContactModal}
              className="
      inline-flex items-center gap-3
      px-6 py-3 rounded-full
      bg-[#EAC97C] text-[#7A1F1F]
      font-semibold text-sm
      transition-all duration-300
      hover:bg-[#d8b569]
      shadow-md hover:shadow-lg
      border border-[#EAC97C] sanchez-regular
    "
            >
              Enquiry Now
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
                  d="M21 15a4 4 0 01-4 4H7l-4 4V7a4 4 0 014-4h10a4 4 0 014 4z"
                />
              </svg>
            </button>
          </div>


          {/* 🔽 ACCORDION — INSIDE TEXT AREA ONLY */}
          <div
            className={`
              overflow-hidden transition-all duration-500 ease-in-out
              ${open ? "max-h-[1200px] opacity-100 mt-8" : "max-h-0 opacity-0"}
            `}
          >
            <div className="rounded-2xl bg-[#FFF7E3] border border-[#F3DFC4] p-6 space-y-6">
              {/* Full description */}
              <DetailBlock title="Detailed Description">
                {product.description}
              </DetailBlock>

              <Detail label="Origin" value={product.origin} />
              {/* Technical & Export details */}
              <div className="grid sm:grid-cols-2 gap-6 text-sm">
                <Detail label="Grade" value={product.grade} />
                <Detail label="Moisture" value={product.moisture} />
                <Detail label="MOQ" value={product.min_order_qty} />

                <Detail label="Colour" value={product.colour} />
                <Detail label="HS Code" value={product.hs_code} />
                <Detail label="Loading Capacity" value={product.loading} />
                <Detail label="Stems" value={product.stems} />
                <Detail label="Size" value={product.size} />
                <Detail label="Port of Loading" value={product.port_of_loading} />
              </div>

              {/* Packaging */}
              {product.packaging?.length > 0 && (
                <DetailBlock title="Packaging Options">
                  <ul className="space-y-2">
                    {product.packaging.map((p) => (
                      <li key={p} className="flex gap-2 items-start">
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-[#7A1F1F]" />
                        <span className="bg-linear-to-br from-red-200 via-rose-50 to-red-200 p-1 text-[#7A1F1F] sanchez-regular rounded-md">{p}</span>
                      </li>
                    ))}
                  </ul>
                </DetailBlock>
              )}

              {/* Certifications */}
              {product.certifications?.length > 0 && (
                <DetailBlock title="Certifications & Compliance">
                  <div className="flex flex-wrap gap-2">
                    {product.certifications.map((c) => (
                      <span
                        key={c}
                        className="px-3 py-1 rounded-full text-xs font-medium
                          bg-white text-[#7A1F1F] border border-[#F3DFC4]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </DetailBlock>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Helpers */

function Spec({ label, value }) {
  return (
    <div>
      <p className="font-semibold text-[#7A1F1F]">{label}</p>
      <p className="text-[#5C4234]">{value}</p>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="bg-white border border-[#F3DFC4] rounded-xl p-4">
      <p className="text-xs text-[#7A1F1F] sanchez-regular mb-1">{label}</p>
      <p className="text-[#4B2B2B] sanchez-regular">{value ? value : "NA"}</p>
    </div>
  );
}

function DetailBlock({ title, children }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-[#7A1F1F] mb-3 sanchez-regular">
        {title}
      </h3>
      <div className="text-sm text-[#4B2B2B] leading-relaxed sanchez-regular">
        {children}
      </div>
    </div>
  );
}