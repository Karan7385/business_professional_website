import React, { useEffect, useState, useCallback, memo } from "react";
import DummyImage from "../../assets/images/dummy-image.png";

const AUTOPLAY_INTERVAL = 5000; // ms
const BASE_SERVER_URL = "http://localhost:3000";

// =================== CAROUSEL COMPONENT ===================

function CarouselBase(props) {
  const rawSlides = Array.isArray(props?.data) ? props.data : [];

  const SLIDES = rawSlides.map((item, index) => ({
    id: item.id ?? index,
    src: item.src ? BASE_SERVER_URL + item.src : DummyImage,
    alt: item.alt || "PT INDO banner image",
    label: item.label || "Premium global spices and herbs",
  }));

  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = SLIDES.length;

  const goToSlide = useCallback(
    (index) => {
      if (!totalSlides) return;
      const normalized = ((index % totalSlides) + totalSlides) % totalSlides;
      setActiveIndex(normalized);
    },
    [totalSlides]
  );

  const handleNext = useCallback(() => {
    goToSlide(activeIndex + 1);
  }, [activeIndex, goToSlide]);

  const handlePrev = useCallback(() => {
    goToSlide(activeIndex - 1);
  }, [activeIndex, goToSlide]);

  // Autoplay
  useEffect(() => {
    if (!totalSlides) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => ((prev + 1) % totalSlides));
    }, AUTOPLAY_INTERVAL);

    return () => window.clearInterval(timer);
  }, [totalSlides]);

  if (!totalSlides) return null;

  return (
    <>
      <section className="relative bg-linear-to-b from-slate-100 via-orange-50 to-slate-100">
        <main className="pt-5 md:pt-5 pb-10 md:pb-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* 🔹 HEADING + SVG ICON */}
            <div className="text-center mb-8 mt-10">
              <div className="flex items-center justify-center gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl text-[#7A1F1F] sanchez-regular">
                  Discover the Finest Global Spices
                </h1>
              </div>

              {/* 🔹 SUBTITLE */}
              <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                Exporting Indonesia’s finest spices to the world.
              </p>
            </div>

            <div className="relative w-full">
              {/* SLIDES WRAPPER */}
              <div
                className="
                relative
                h-[260px] sm:h-[340px] md:h-[460px] lg:h-[560px]
                overflow-hidden
                rounded-3xl
                shadow-[0_18px_50px_rgba(15,23,42,0.35)]
                bg-black/5
              "
              >
                {SLIDES.map((slide, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <div
                      key={slide.id}
                      className={`
                      group
                      absolute inset-0
                      transition-opacity duration-700 ease-out
                      ${isActive ? "opacity-100 z-20" : "opacity-0 z-10"}
                    `}
                      aria-hidden={!isActive}
                    >
                      {/* IMAGE + ZOOM EFFECT */}
                      <div
                        className={`
                        absolute inset-0
                        transform
                        transition-transform duration-1200 ease-out
                        ${isActive ? "scale-105" : "scale-100"}
                      `}
                      >
                        <img
                          src={slide.src || DummyImage}
                          alt={slide.alt}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />

                        {/* DARK linear OVERLAY */}
                        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/55 to-black/20" />
                      </div>

                      {/* LABEL & TEXT OVERLAY */}
                      <div
                        className={`
                        absolute inset-x-6 sm:inset-x-10 md:inset-x-12
                        bottom-8 sm:bottom-10 md:bottom-14
                        max-w-xl sm:max-w-2xl
                        text-left
                        text-amber-50
                        transform
                        transition-all duration-700 ease-out
                        ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
                      `}
                      >
                        {/* Small pill */}
                        <span className="inline-flex items-center px-3 py-1 mb-3 text-[11px] sm:text-xs uppercase tracking-[0.2em] rounded-full bg-amber-400/90 text-zinc-900 shadow-md unbounded-heading">
                          Global Export • PT INDO
                        </span>

                        {/* Main label */}
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight drop-shadow-[0_12px_40px_rgba(0,0,0,0.65)] sanchez-regular">
                          {slide.label}
                        </h2>

                        {/* Sub text */}
                        <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-amber-100/90 max-w-xl sanchez-regular">
                          {slide.alt}
                        </p>

                        {/* Little accent underline */}
                        <div className="mt-4 sm:mt-5 h-[3px] w-20 rounded-full bg-linear-to-r from-amber-400 via-yellow-300 to-orange-300 shadow-[0_0_16px_rgba(250,204,21,0.8)]" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* INDICATORS */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
                {SLIDES.map((slide, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => goToSlide(index)}
                      className={`
                      relative
                      h-2.5 rounded-full
                      transition-all duration-300 ease-out
                      ${isActive ? "w-7 bg-amber-400 shadow-md" : "w-2.5 bg-white/70 hover:bg-white"}
                    `}
                      aria-label={`Go to slide ${index + 1}`}
                      aria-current={isActive ? "true" : "false"}
                    >
                      {/* subtle glowing dot */}
                      {isActive && (
                        <span className="absolute inset-0 rounded-full animate-ping bg-amber-300/60" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* PREV */}
              <button
                type="button"
                onClick={handlePrev}
                className="
                absolute inset-y-0 left-0 z-30
                flex items-center
                px-3 sm:px-4
                focus:outline-none
              "
                aria-label="Previous slide"
              >
                <span
                  className="
                  inline-flex items-center justify-center
                  w-9 h-9 sm:w-10 sm:h-10
                  rounded-full
                  bg-black/35 hover:bg-black/60
                  backdrop-blur-sm
                  shadow-lg
                  transition
                "
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </span>
              </button>

              {/* NEXT */}
              <button
                type="button"
                onClick={handleNext}
                className="
                absolute inset-y-0 right-0 z-30
                flex items-center
                px-3 sm:px-4
                focus:outline-none
              "
                aria-label="Next slide"
              >
                <span
                  className="
                  inline-flex items-center justify-center
                  w-9 h-9 sm:w-10 sm:h-10
                  rounded-full
                  bg-black/35 hover:bg-black/60
                  backdrop-blur-sm
                  shadow-lg
                  transition
                "
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </main>
      </section>
    </>
  );
}

// Memoized to avoid re-renders when parent updates
const Carousel = memo(CarouselBase);

export default Carousel;