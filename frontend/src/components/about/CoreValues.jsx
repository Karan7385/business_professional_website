import React from "react";
import { CORE_VALUES } from "../../data/aboutConfig";
import spicesBg2 from "../../assets/images/spices2.jpg";

function CoreValues({ mounted, sectionBase, sectionActive }) {
  return (
    <div
      className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-cover bg-center bg-no-repeat shadow-black shadow-md"
      style={{ backgroundImage: `url(${spicesBg2})` }}
    >
      <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/50 to-black/85" />

      <div className="relative z-10 flex items-center justify-center min-h-[520px] md:min-h-[620px] lg:min-h-[700px] px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div
          className={`${sectionBase} ${
            mounted ? sectionActive : ""
          } w-full max-w-6xl`}
          style={{ transitionDelay: "550ms" }}
        >
          <h4 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-10 drop-shadow-xl bg-linear-to-r from-[#F7D07A] via-[#EAC97C] to-[#F9E4B4] text-transparent bg-clip-text tracking-wide sanchez-regular">
            Core Values
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 sm:gap-8 md:gap-10">
            {CORE_VALUES.map((value) => (
              <div
                key={value.title}
                className="group relative h-full p-7 sm:p-8 md:p-10 rounded-3xl border border-white/25
                  bg-linear-to-br from-white/30 via-white/15 to-amber-200/20
                  backdrop-blur-xl shadow-xl shadow-black/40
                  hover:shadow-2xl hover:shadow-black/60 hover:-translate-y-3
                  transition-all duration-500"
              >
                <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 
                  bg-linear-to-br from-[#F7D07A]/30 via-transparent to-[#7A1F1F]/30 transition-opacity duration-500" />

                <div className="relative z-10 flex flex-col items-center text-center">
                  <h5
                    className="text-2xl sm:text-3xl font-extrabold tracking-wide bg-linear-to-r
                      from-[#F7D07A] via-[#F4C670] to-[#D9A23A] text-transparent bg-clip-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)] unbounded-heading"
                  >
                    {value.title}
                  </h5>

                  <p className="mt-4 text-sm sm:text-base md:text-lg leading-relaxed font-medium text-[#fffceb] drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)] unbounded-subHeading">
                    {value.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoreValues;