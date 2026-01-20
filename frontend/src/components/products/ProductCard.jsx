import { useState } from "react";
import { useContactModal } from "../../context/ContactModalContext.jsx";

const BASE_SERVER_URL = import.meta.env.VITE_BASE_SERVER_URL;

export default function ProductShowcase({ product, index }) {
  const { openContactModal } = useContactModal();

  // FIRST product image on RIGHT, then alternate
  const isReverse = index % 2 === 0;

  const [open, setOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const images = product.images || [];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <section
      className={`
        w-full flex flex-col lg:flex-row md:m-4 rounded-2xl shadow-lg shadow-red-200
        ${isReverse ? "lg:flex-row-reverse" : ""}
        min-h-[60vh]
        bg-amber-50
        border-b border-[#F3DFC4]
      `}
    >
      {/* IMAGE SECTION (FIXED HEIGHT) */}
      <div className="relative lg:w-1/2 w-full h-[45vh] lg:h-[60vh] overflow-hidden rounded-2xl flex-shrink-0">
        {images.length > 0 && (
          <>
            <img
              src={BASE_SERVER_URL + images[currentImage]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-black/30 via-transparent to-black/30" />

            {/* Category Badge */}
            <div className="absolute top-5 left-5 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur border border-[#F3DFC4] text-xs font-semibold text-[#7A1F1F]">
              {product.category}
            </div>

            {/* Slider Controls */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#7A1F1F] p-2 rounded-full shadow"
                >
                  ‹
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#7A1F1F] p-2 rounded-full shadow"
                >
                  ›
                </button>

                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`w-2.5 h-2.5 rounded-full transition ${
                        i === currentImage
                          ? "bg-[#7A1F1F]"
                          : "bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* TEXT CONTENT SECTION */}
      <div
        className={`lg:w-1/2 w-full flex items-start ${
          isReverse ? "lg:justify-start" : "lg:justify-end"
        }`}
      >
        <div className="w-full px-5 md:px-10 lg:px-14 py-8">
          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#3A211F] sanchez-regular">
            {product.name}
          </h2>

          {/* Origin */}
          <p className="mt-1.5 text-xs uppercase tracking-widest text-[#A15A2E] font-semibold">
            Origin: {product.origin}
          </p>

          {/* Short description */}
          {product.description && (
            <p className="mt-4 text-sm leading-relaxed text-[#5C4234] max-w-2xl">
              {product.description}
            </p>
          )}

          {/* SUMMARY SPECS */}
          <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-3 text-sm max-w-xl">
            <Spec label="Grade" value={product.grade} />
            <Spec label="Moisture" value={product.moisture} />
            <Spec label="MOQ" value={product.min_order_qty} />
            <Spec label="Category" value={product.category} />
          </div>

          {/* BUTTONS */}
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#7A1F1F] text-[#FFF7E3] font-semibold text-xs transition-all duration-300 hover:bg-[#8f2b2b] shadow-md hover:shadow-lg sanchez-regular"
            >
              {open ? "Hide Product Details" : "View Product Details"}
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${
                  open ? "rotate-180" : ""
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

            <button
              onClick={openContactModal}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#EAC97C] text-[#7A1F1F] font-semibold text-xs transition-all duration-300 hover:bg-[#d8b569] shadow-md hover:shadow-lg border border-[#EAC97C] sanchez-regular"
            >
              Enquiry Now
            </button>
          </div>

          {/* ACCORDION – TEXT ONLY */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              open ? "max-h-[1600px] opacity-100 mt-6" : "max-h-0 opacity-0"
            }`}
          >
            <div className="rounded-2xl bg-[#FFF7E3] border border-[#F3DFC4] p-5 space-y-5">
              <DetailBlock title="Detailed Description">
                {product.description}
              </DetailBlock>

              <Detail label="Origin" value={product.origin} />

              <div className="grid sm:grid-cols-2 gap-5 text-sm">
                <Detail label="Grade" value={product.grade} />
                <Detail label="Moisture" value={product.moisture} />
                <Detail label="MOQ" value={product.min_order_qty} />
                <Detail label="Colour" value={product.colour} />
                <Detail label="HS Code" value={product.hs_code} />
                <Detail label="Loading Capacity" value={product.loading} />
                {/* <Detail label="Stems" value={product.stems} />
                <Detail label="Size" value={product.size} /> */}
                <Detail
                  label="Port of Loading"
                  value={product.port_of_loading}
                />
              </div>

              {/* <Detail
                label="Additional Information"
                value={product.additional_info}
              /> */}

              {product.packaging?.length > 0 && (
                <DetailBlock title="Packaging Options">
                  <ul className="space-y-2">
                    {product.packaging.map((p) => (
                      <li key={p} className="flex gap-2 items-start">
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-[#7A1F1F]" />
                        <span className="bg-linear-to-br from-red-200 via-rose-50 to-red-200 p-1 text-[#7A1F1F] sanchez-regular rounded-md">
                          {p}
                        </span>
                      </li>
                    ))}
                  </ul>
                </DetailBlock>
              )}

              {product.certifications?.length > 0 && (
                <DetailBlock title="Certifications & Compliance">
                  <div className="flex flex-wrap gap-2">
                    {product.certifications.map((c) => (
                      <span
                        key={c}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-white text-[#7A1F1F] border border-[#F3DFC4]"
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
      <p className="font-semibold text-[#7A1F1F] text-xs">{label}</p>
      <p className="text-[#5C4234] text-sm">{value}</p>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="bg-white border border-[#F3DFC4] rounded-xl p-3">
      <p className="text-[11px] text-[#7A1F1F] sanchez-regular mb-1">
        {label}
      </p>
      <p className="text-[#4B2B2B] sanchez-regular text-sm">
        {value ? value : "NA"}
      </p>
    </div>
  );
}

function DetailBlock({ title, children }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-[#7A1F1F] mb-2 sanchez-regular">
        {title}
      </h3>
      <div className="text-sm text-[#4B2B2B] leading-relaxed sanchez-regular">
        {children}
      </div>
    </div>
  );
}
