import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  memo,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const getInitialRadius = () => {
  if (typeof window === "undefined") return 650;
  const width = window.innerWidth;
  if (width < 640) return 380;
  if (width < 1024) return 500;
  return 550;
};

const TeamCarousel3D = memo(function TeamCarousel3D({ members }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [radius, setRadius] = useState(getInitialRadius);

  const numItems = members.length;

  const angle = useMemo(() => {
    if (!numItems) return 0;
    return 360 / numItems;
  }, [numItems]);

  useEffect(() => {
    const handleResize = () => setRadius(getInitialRadius());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextCard = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % numItems);
  }, [numItems]);

  const prevCard = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + numItems) % numItems);
  }, [numItems]);

  if (!numItems) return null;

  return (
    <div className="relative flex flex-col items-center w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Side fade edges */}
      <div className="pointer-events-none absolute inset-y-6 left-0 w-12 sm:w-20 lg:w-24 bg-linear-to-r from-[#fffaf5] via-[#fffaf5]/80 to-transparent z-20" />
      <div className="pointer-events-none absolute inset-y-6 right-0 w-12 sm:w-20 lg:w-24 bg-linear-to-l from-[#fffaf5] via-[#fffaf5]/80 to-transparent z-20" />

      <div className="relative w-full max-w-7xl h-[500px] sm:h-[580px] md:h-[620px] lg:h-[660px] perspective-[1000px] sm:perspective-[1400px] lg:perspective-[1800px] overflow-visible">
        <div
          className="absolute inset-0 m-auto w-full h-full transform-3d transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateZ(-${radius}px) rotateY(${activeIndex * -angle}deg)`,
          }}
          aria-live="polite"
        >
          {members.map((member, index) => {
            const rotation = index * angle;
            const isActive = index === activeIndex;
            const distanceTransform = `rotateY(${rotation}deg) translateZ(${radius}px)`;
            const scaleFactor = isActive ? 1.03 : 0.9;
            const transform = `${distanceTransform} scale(${scaleFactor})`;

            return (
              <div
                key={member.name}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  transform,
                  opacity: isActive ? 1 : 0.35,
                  zIndex: isActive ? 10 : 1,
                  transition: "opacity 0.7s ease, transform 0.7s ease",
                }}
              >
                <div className="relative flex flex-col items-center">
                  <article className="bg-white rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden w-[85vw] max-w-[340px] sm:max-w-[400px] md:max-w-[450px] lg:max-w-[500px]">
                    <div className="relative w-full aspect-16/10 bg-linear-to-br from-[#7A1F1F]/5 to-[#EAC97C]/10 overflow-hidden">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-contain bg-white transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-[#7A1F1F]/20">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/5 to-transparent pointer-events-none" />
                    </div>

                    <div className="px-5 sm:px-6 md:px-8 py-5 sm:py-6 text-center bg-white">
                      <h5 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#7A1F1F] mb-1.5 sm:mb-2 leading-tight unbounded-subHeading">
                        {member.name}
                      </h5>

                      <p className="text-xs sm:text-sm md:text-base text-[#4b2b2b]/80 leading-relaxed sanchez-regular text-justify">
                        {member.bio}
                      </p>
                    </div>

                    <div className="h-1 bg-linear-to-r from-transparent via-[#EAC97C] to-transparent" />
                  </article>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="mt-6 sm:mt-10 flex gap-3 sm:gap-5 items-center z-30">
        <button
          type="button"
          onClick={prevCard}
          className="group p-2.5 sm:p-3 md:p-4 rounded-full bg-white border-2 border-[#EAC97C] text-[#7A1F1F] hover:bg-[#EAC97C] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95"
          aria-label="Previous team member"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-transform group-hover:-translate-x-0.5" />
        </button>

        <div className="flex gap-1.5 sm:gap-2">
          {members.map((_, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-[#7A1F1F] w-6 sm:w-8 shadow-md"
                    : "bg-[#EAC97C]/40 w-2 sm:w-2.5 hover:bg-[#EAC97C] hover:w-4"
                }`}
                aria-label={`Go to member ${index + 1}`}
                aria-current={isActive ? "true" : "false"}
              />
            );
          })}
        </div>

        <button
          type="button"
          onClick={nextCard}
          className="group p-2.5 sm:p-3 md:p-4 rounded-full bg-white border-2 border-[#EAC97C] text-[#7A1F1F] hover:bg-[#EAC97C] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95"
          aria-label="Next team member"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Counter */}
      <div className="mt-4 sm:mt-6 text-center">
        <p className="text-xs sm:text-sm font-semibold text-[#7A1F1F]/60">
          <span className="text-base sm:text-lg font-bold text-[#7A1F1F]">
            {activeIndex + 1}
          </span>
          <span className="mx-1.5 text-[#EAC97C]">/</span>
          <span className="text-[#7A1F1F]/70">{numItems}</span>
        </p>
      </div>
    </div>
  );
});

export default TeamCarousel3D;