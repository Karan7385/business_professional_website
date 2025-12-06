import React, { memo, useMemo } from "react";

function CertificateContinuousBannerBase(props) {
  const BASE_SERVER_URL = "http://localhost:3000";

  const certificates = props.data.map((item) => {
    return {
      id: 1,
      name: item.title,
      logoSrc: BASE_SERVER_URL + item.logo,
      logoAlt: item.title,
    }
  })
  // Optional: heading config (also dynamic)
  const heading = {
    title: "Trusted Global Certifications",
    subtitle: "Verified global credentials ensuring trust and quality in every export.",
  };

  const { title, subtitle } = heading;

  // Duplicate certificates for seamless loop
  const loopedCertificates = useMemo(
    () => [...certificates, ...certificates],
    [certificates]
  );

  if (!certificates.length) return null;

  return (
    <section className="w-full py-6 bg-[#FFFDF7] border-y border-[#F8EFD9]">
      <div className="text-center mb-4">
        <h3 className="sanchez-regular text-3xl sm:text-4xl text-[#7A1F1F]">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      {/* Slider Container */}
      <div
        className="
          relative
          h-24 sm:h-32
          mx-auto max-w-full
          overflow-hidden
          bg-gradient-to-r from-[#FFF7E3] via-white to-[#FFF7E3]
          shadow-inner rounded-xl
        "
        aria-label="Continuous scrolling list of certifications"
      >
        {/* Scroll Track */}
        <div
          className="
            flex w-[200%] h-full items-center
            animate-[scroll-left_25s_linear_infinite]
          "
        >
          {loopedCertificates.map((cert, index) => (
            <div
              key={`${cert.id}-${index}`}
              className="
                flex-shrink-0 w-[28%] sm:w-[18%] md:w-[12%]
                h-full flex items-center justify-center
                p-3 sm:p-4
              "
            >
              <div
                className="
                  w-16 h-16 sm:w-20 sm:h-20
                  flex items-center justify-center
                  rounded-lg bg-white/90 shadow-md
                  border border-[#E8D9B8]
                  p-2 text-center
                "
              >
                {cert.logoSrc ? (
                  <img
                    src={cert.logoSrc}
                    alt={cert.logoAlt || cert.name}
                    loading="lazy"
                    decoding="async"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <span className="text-[10px] sm:text-xs text-[#7A1F1F] opacity-80 leading-snug">
                    {cert.name}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Left Fade */}
        <div
          className="
            pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-20
            bg-gradient-to-r from-[#FFF7E3] via-[#FFF7E3]/90 to-transparent
          "
        />

        {/* Right Fade */}
        <div
          className="
            pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-20
            bg-gradient-to-l from-[#FFF7E3] via-[#FFF7E3]/90 to-transparent
          "
        />
      </div>
    </section>
  );
}

// Memo for performance – no re-render unless props change
const CertificateContinuousBanner = memo(CertificateContinuousBannerBase);

export default CertificateContinuousBanner;