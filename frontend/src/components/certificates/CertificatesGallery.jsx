import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  memo,
} from "react";

/* ---------- Helpers ---------- */

const isImageUrl = (url) => {
  if (!url) return false;
  const clean = url.split("?")[0].toLowerCase();
  return /\.(png|jpe?g|gif|webp|svg)$/.test(clean);
};

const isPdfUrl = (url) => {
  if (!url) return false;
  const clean = url.split("?")[0].toLowerCase();
  return clean.endsWith(".pdf");
};

/* ---------- Sub-components: Timeline (ENHANCED) ---------- */

const CertificateTimeline = memo(function CertificateTimeline({
  certificates,
  highlightId,
  onYearClick,
}) {
  const total = certificates.length;

  return (
    <div className="mb-8 md:mb-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4 gap-3">
          <div>
            <h2 className="text-base md:text-lg font-bold text-[#7A1F1F] tracking-tight unbounded-subHeading">
              Certification Timeline
            </h2>
            <p className="text-[11px] md:text-xs text-[#4b2b2b]/60 mt-0.5 unbounded-subHeading">
              Tap or click on any year to navigate
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-[#4b2b2b]/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{total} Active Certifications</span>
          </div>
        </div>

        <div className="relative rounded-3xl bg-linear-to-br from-white via-[#fffbf5] to-[#fff8ed] border border-[#7A1F1F]/10 shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden backdrop-blur-xl">
          {/* Noise texture */}
          <div className="absolute inset-0 noise-texture opacity-30" />

          {/* linear blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-72 h-72 bg-linear-to-br from-[#EAC97C]/20 to-transparent rounded-full blur-3xl opacity-60" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-linear-to-tl from-[#7A1F1F]/10 to-transparent rounded-full blur-3xl opacity-40" />
          </div>

          <div className="relative flex items-center gap-2 overflow-x-auto py-3 md:py-4 px-4 md:px-5 scrollbar-thin scrollbar-thumb-[#7A1F1F]/20 scrollbar-track-transparent">
            {certificates.map((c, i) => {
              const isActive = highlightId === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onYearClick(i)}
                  className={`relative flex-shrink-0 group inline-flex items-center gap-3 px-4 md:px-5 py-2.5 md:py-3 rounded-2xl transition-all duration-500 text-xs md:text-sm font-medium ${
                    isActive
                      ? "bg-linear-to-r from-[#7A1F1F] to-[#9a2f2f] text-white shadow-[0_8px_30px_rgba(122,31,31,0.4)] scale-105"
                      : "bg-white/80 text-[#4b2b2b] hover:bg-white hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)] hover:scale-105"
                  }`}
                  style={{ transitionDelay: `${i * 50}ms` }}
                  aria-label={`Go to certificate from year ${c.year}`}
                >
                  {isActive && (
                    <span className="absolute inset-0 rounded-2xl bg-white/30 ripple-effect" />
                  )}

                  <div
                    className={`w-2 h-2 rounded-full ${
                      isActive
                        ? "bg-white glow-pulse"
                        : `bg-linear-to-br ${c.color}`
                    }`}
                  />

                  <div className="flex items-center gap-2">
                    <span className="font-bold">{c.year}</span>
                    <span className="hidden sm:inline text-[11px] md:text-xs opacity-80 max-w-[160px] truncate">
                      {c.title}
                    </span>
                  </div>

                  <div
                    className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full transition-all duration-300 ${
                      isActive
                        ? "bg-white w-12"
                        : "bg-[#7A1F1F]/0 group-hover:bg-[#7A1F1F]/50 group-hover:w-12"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});

/* ---------- Sub-components: Grid (ENHANCED) ---------- */

const CertificateGrid = memo(function CertificateGrid({
  certificates,
  mounted,
  highlightId,
  cardRefs,
  onOpen,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6 mt-4 md:mt-6">
      {certificates.map((cert, idx) => {
        const highlighted = highlightId === cert.id;
        const previewUrl = cert.logo || cert.src;
        const isImage = isImageUrl(previewUrl);

        return (
          <button
            key={cert.id}
            ref={(el) => {
              cardRefs.current[idx] = el;
            }}
            type="button"
            onClick={() => onOpen(cert)}
            className={`group relative rounded-3xl overflow-hidden bg-white border border-[#7A1F1F]/10 shadow-[0_16px_40px_rgba(0,0,0,0.08)] backdrop-blur-sm transition-all duration-700 transform origin-center hover:-translate-y-3 hover:shadow-[0_28px_70px_rgba(0,0,0,0.16)] hover:scale-[1.02] ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            } ${highlighted ? "ring-4 ring-[#EAC97C] ring-offset-2" : ""}`}
            style={{ transitionDelay: `${idx * 80}ms` }}
          >
            {/* Border glow */}
            <div
              className={`pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-br ${cert.color} opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-xl`}
            />

            {/* Image / preview area */}
            <div className="relative aspect-[4/5] overflow-hidden bg-linear-to-br from-[#fcf9f2] to-[#f4ede3]">
              {/* Category badge */}
              <div className="absolute top-2.5 left-2.5 md:top-3 md:left-3 z-10 flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-white/50">
                <span
                  className={`w-1.5 h-1.5 rounded-full bg-linear-to-br ${cert.color}`}
                />
                <span className="text-2xs md:text-2xs font-bold text-[#7A1F1F] unbounded-subHeading">
                  {cert.category || "Certificate"}
                </span>
              </div>

              {/* Year badge */}
              <div className="absolute top-2.5 right-2.5 md:top-3 md:right-3 z-10 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-linear-to-br from-[#7A1F1F] to-[#9a2f2f] shadow-xl border-2 border-white/50 float-animation">
                <span className="text-[11px] md:text-xs font-bold text-white sanchez-regular">
                  {cert.year}
                </span>
              </div>

              {/* Proper preview for images / fallback for PDFs */}
              {isImage ? (
                <img
                  src={previewUrl}
                  alt={cert.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain transition-all duration-1000 group-hover:scale-105 group-hover:rotate-1"
                />
              ) : isPdfUrl(previewUrl) ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-[11px] md:text-xs text-[#7A1F1F]/80 px-4 text-center">
                  <div className="mb-2 font-semibold">PDF Document</div>
                  <div className="opacity-80">
                    Tap to open the full certificate
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[11px] md:text-xs text-[#7A1F1F]/70 px-4 text-center">
                  Preview not available
                </div>
              )}

              {/* Shimmer overlay */}
              <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              {/* linear overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Content */}
            <div className="relative p-3.5 md:p-4 bg-linear-to-b from-white via-[#fffdfb] to-[#fff9f3]">
              <div className="mb-2 md:mb-2.5">
                <h3 className="text-sm md:text-base font-bold text-[#7A1F1F] leading-tight mb-1.5 md:mb-2 line-clamp-2 group-hover:text-[#9a2f2f] transition-colors unbounded-heading">
                  {cert.title}
                </h3>
                <p className="text-[11px] md:text-xs text-[#4b2b2b]/70 line-clamp-2 leading-relaxed unbounded-subHeading">
                  {cert.issuer}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 md:pt-2.5 border-t border-[#7A1F1F]/10">
                <div className="flex items-center gap-1.5 px-2 md:px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                  <svg
                    className="w-3 h-3 text-emerald-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-2xs font-semibold text-emerald-700 unbounded-subHeading">
                    Verified
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] md:text-xs text-[#7A1F1F] font-semibold">
                  <span className="hidden sm:inline unbounded-subHeading">
                    View
                  </span>
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-xl bg-linear-to-br from-[#7A1F1F]/10 to-[#7A1F1F]/5 group-hover:from-[#7A1F1F] group-hover:to-[#9a2f2f] flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <svg
                      className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#7A1F1F] group-hover:text-white transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Corner accent */}
            <div
              className={`absolute top-0 right-0 w-20 h-20 md:w-24 md:h-24 bg-linear-to-bl ${cert.color} opacity-10 group-hover:opacity-20 transition-opacity blur-2xl`}
            />
          </button>
        );
      })}
    </div>
  );
});

/* ---------- Sub-components: Modal (ENHANCED) ---------- */

const CertificateModal = memo(function CertificateModal({ cert, onClose }) {
  if (!cert) return null;

  const isImage = isImageUrl(cert.src);
  const isPdf = isPdfUrl(cert.src);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
      onClick={onClose}
      style={{ animation: "fadeIn 0.3s ease-out" }}
    >
      {/* Wrapper to control width + side padding + vertical spacing */}
      <div
        className="w-full max-w-5xl mx-auto px-3 sm:px-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal card */}
        <div
          className="relative flex flex-col max-h-[90vh] bg-linear-to-br from-white via-white to-[#fffefb] rounded-2xl sm:rounded-3xl shadow-[0_40px_120px_rgba(0,0,0,0.6)] border border-white/60 overflow-hidden"
          style={{
            animation: "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-black/80 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black hover:scale-110 transition-all duration-300 shadow-xl"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Header (fixed height / non-scrollable) */}
          <div
            className={`shrink-0 bg-linear-to-r ${cert.color} px-5 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-40 sm:w-64 h-40 sm:h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-black/10 rounded-full blur-2xl" />

            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-2.5 sm:mb-3">
                  <span className="w-2 h-2 rounded-full bg-slate-800" />
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-800 unbounded-subHeading">
                    {cert.category || "Certificate"} • {cert.year}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 mb-1.5 sm:mb-2 unbounded-heading">
                  {cert.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-800 unbounded-subHeading">
                  {cert.issuer}
                </p>
              </div>

              <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-none">
                <a
                  href={cert.src}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-white text-[#7A1F1F] text-xs sm:text-sm font-bold hover:bg-white/95 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 whitespace-nowrap text-center unbounded-subHeading"
                >
                  Open Full Size
                </a>
              </div>
            </div>
          </div>

          {/* Body (scrollable on overflow) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-linear-to-b from-[#fdfdfc] to-[#f4f2f0]">
            {/* Preview container */}
            <div className="rounded-2xl border-2 border-[#7A1F1F]/10 bg-white shadow-inner overflow-hidden">
              <div className="flex items-center justify-center bg-[#f7f5f2] max-h-[60vh]">
                {isImage ? (
                  <img
                    src={cert.src}
                    alt={cert.title}
                    className="w-full h-auto max-h-[60vh] object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                ) : isPdf ? (
                  <iframe
                    src={cert.src}
                    title={cert.title}
                    className="w-full h-[60vh]"
                  />
                ) : (
                  <div className="p-6 text-sm text-[#4b2b2b]/80 text-center">
                    Preview not available.{" "}
                    <a
                      href={cert.src}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#7A1F1F] font-semibold underline"
                    >
                      Click here to open the file.
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Footer info */}
            <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-between gap-3 sm:gap-4 px-3 sm:px-4 py-3 rounded-xl bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-200 unbounded-subHeading">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs font-semibold text-emerald-900">
                    Certificate Verified
                  </div>
                  <div className="text-[11px] sm:text-xs text-emerald-700">
                    Authenticity confirmed by issuing authority
                  </div>
                </div>
              </div>
              <div className="text-[11px] sm:text-xs text-emerald-700 font-medium">
                Valid until: Active
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});


/* ---------- Parent: CertificatesGallery (ENHANCED STYLES) ---------- */

function CertificatesGalleryBase({ certificates }) {
  const [activeCert, setActiveCert] = useState(null);
  const [mounted, setMounted] = useState(true);
  const [highlightId, setHighlightId] = useState(null);
  const cardRefs = useRef([]);

  const openCert = useCallback((cert) => setActiveCert(cert), []);
  const closeCert = useCallback(() => setActiveCert(null), []);

  const gotoCard = useCallback(
    (idx) => {
      const target = certificates[idx];
      if (!target) return;
      setHighlightId(target.id);
      cardRefs.current[idx]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
      setTimeout(() => setHighlightId(null), 1200);
    },
    [certificates]
  );

  const sortedCertificates = useMemo(
    () =>
      [...certificates].sort((a, b) => Number(b.year) - Number(a.year)),
    [certificates]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Shared animations and noise texture CSS */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          @keyframes glow {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
          @keyframes ripple {
            0% { transform: scale(0.8); opacity: 1; }
            100% { transform: scale(2.4); opacity: 0; }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          .float-animation {
            animation: float 6s ease-in-out infinite;
          }
          .shimmer-effect {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
            background-size: 200% 100%;
            animation: shimmer 3s linear infinite;
          }
          .glow-pulse {
            animation: glow 2s ease-in-out infinite;
          }
          .ripple-effect {
            animation: ripple 1.2s cubic-bezier(0, 0.2, 0.8, 1);
          }
          .noise-texture {
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
            opacity: 0.1;
            pointer-events: none;
            mix-blend-mode: multiply;
          }
        `}
      </style>

      <CertificateTimeline
        certificates={sortedCertificates}
        highlightId={highlightId}
        onYearClick={gotoCard}
      />

      <CertificateGrid
        certificates={sortedCertificates}
        mounted={mounted}
        highlightId={highlightId}
        cardRefs={cardRefs}
        onOpen={openCert}
      />

      <CertificateModal cert={activeCert} onClose={closeCert} />
    </>
  );
}

const CertificatesGallery = memo(CertificatesGalleryBase);
export default CertificatesGallery;