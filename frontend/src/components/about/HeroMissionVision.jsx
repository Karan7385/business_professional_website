import React from "react";
import { HERO_CONTENT, HERO_MISSION_VISION } from "../../data/aboutConfig.js";
import spicesBg from "../../assets/images/spices.jpg";

function HeroMissionVision({ mounted, sectionBase, sectionActive }) {
  return (
    <div
      className="relative w-full min-h-[520px] md:min-h-[620px] lg:h-screen bg-cover bg-center bg-no-repeat shadow-black shadow-md"
      style={{ backgroundImage: `url(${spicesBg})` }}
    >
      <div className="absolute inset-0 bg-black/55 md:bg-black/45 backdrop-blur-[1px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 flex flex-col gap-10 md:gap-12">
        {/* HERO TEXT */}
        <div
          className={`${sectionBase} ${mounted ? sectionActive : ""} w-full`}
          style={{ transitionDelay: "100ms" }}
        >
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide 
              text-transparent bg-clip-text bg-linear-to-r from-[#F7D07A] to-[#EAC97C] 
              drop-shadow-[0_0_18px_rgba(0,0,0,0.55)] sanchez-regular"
          >
            {HERO_CONTENT.title}
          </h2>

          <p
            className="mt-5 sm:mt-6 max-w-3xl text-sm sm:text-base md:text-lg leading-relaxed 
              text-[#FFF6E5] border-l-4 border-[#F7D07A] pl-3 sm:pl-4 
              bg-white/10 rounded-r-md py-2.5 sm:py-3 shadow-sm unbounded-subHeading"
          >
            {HERO_CONTENT.intro}
          </p>
        </div>

        {/* MISSION / VISION */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full ${sectionBase} ${mounted ? sectionActive : ""
            }`}
          style={{ transitionDelay: "250ms" }}
        >
          {HERO_MISSION_VISION.map((item) => (
            <div
              key={item.key}
              className="group p-6 sm:p-7 md:p-8 rounded-2xl shadow-xl 
                bg-linear-to-br from-[#FFF3C8]/85 via-[#F3DDA5]/70 to-[#EED08A]/85 
                backdrop-blur-md border border-white/30 transition-all duration-300 
                hover:shadow-[0_0_30px_rgba(240,200,120,0.45)] hover:-translate-y-1 hover:scale-[1.01]"
            >
              <h3 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-[#8A2E1F] to-[#B2501F] bg-clip-text text-transparent sanchez-regular">
                {item.label}
              </h3>
              <p className="mt-3 text-sm sm:text-base text-[#2B1F1C] leading-relaxed text-justify">
                {item.text}
              </p>
              <div
                className="mt-4 sm:mt-5 mx-3 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#8A2E1F]/20
                  text-[#8A2E1F] font-semibold text-xs sm:text-sm group-hover:bg-[#8A2E1F]/30 transition-colors sanchez-regular"
              >
                {item.tag}
              </div>
              <div
                className="mt-4 sm:mt-5 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#8A2E1F]/20
                  text-[#8A2E1F] font-semibold text-xs sm:text-sm group-hover:bg-[#8A2E1F]/30 transition-colors sanchez-regular"
              >
                {item.highlight}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HeroMissionVision;