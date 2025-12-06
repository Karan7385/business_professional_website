import React, { memo } from "react";
import {
  WHY_US_SECTION,
  WHY_US_FEATURES,
  WHY_US_STATS,
} from "../../data/aboutConfig";

function WhyUsBase({ mounted, sectionBase, sectionActive }) {
  const section = WHY_US_SECTION;
  const features = WHY_US_FEATURES;
  const stats = WHY_US_STATS;

  return (
    <>
      {/* Local animation styles — no need to modify Tailwind config */}
      <style>
        {`
          @keyframes dropletBlob {
            0%, 100% {
              transform: translate3d(0,0,0) scale(1);
            }
            33% {
              transform: translate3d(12px,-14px,0) scale(1.05);
            }
            66% {
              transform: translate3d(-14px,10px,0) scale(0.96);
            }
          }
          @keyframes morphBlob {
            0%, 100% {
              border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
              transform: translate(0, 0) scale(1);
            }
            25% {
              border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
              transform: translate(8px, -8px) scale(1.02);
            }
            50% {
              border-radius: 50% 60% 30% 60% / 30% 60% 70% 40%;
              transform: translate(-8px, 8px) scale(0.98);
            }
            75% {
              border-radius: 60% 40% 60% 40% / 70% 30% 50% 60%;
              transform: translate(6px, 6px) scale(1.01);
            }
          }
          @keyframes shimmer {
            0% {
              background-position: -200% center;
            }
            100% {
              background-position: 200% center;
            }
          }
          .droplet-animate-slow {
            animation: dropletBlob 24s ease-in-out infinite;
          }
          .droplet-animate-fast {
            animation: dropletBlob 16s ease-in-out infinite;
          }
          .morph-slow {
            animation: morphBlob 20s ease-in-out infinite;
          }
          .morph-medium {
            animation: morphBlob 15s ease-in-out infinite reverse;
          }
          .morph-fast {
            animation: morphBlob 12s ease-in-out infinite;
          }
          .shimmer-effect {
            background-size: 200% 100%;
            animation: shimmer 8s linear infinite;
          }
        `}
      </style>

      <section
        id={section.id}
        className="
          w-full
          bg-linear-to-br from-orange-50 via-orange-50 to-slate-100"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div
            className={`${sectionBase} ${
              mounted ? sectionActive : ""
            } flex flex-col gap-3 text-center`}
            style={{ transitionDelay: "450ms" }}
          >
            {section.eyebrow && (
              <p className="text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase text-[#B2501F] unbounded-subHeading">
                {section.eyebrow}
              </p>
            )}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#7A1F1F] sanchez-regular">
              {section.title}
            </h2>
            {section.subtitle && (
              <p className="text-sm sm:text-base text-[#4A372B] max-w-3xl mx-auto mt-1 robot-text">
                {section.subtitle}
              </p>
            )}
          </div>

          {/* Content */}
          <div
            className={`${sectionBase} ${
              mounted ? sectionActive : ""
            } mt-8 grid grid-cols-1 gap-8`}
            style={{ transitionDelay: "500ms" }}
          >
            {/* Droplet animated cards */}
            <ul className="grid gap-5 sm:gap-6 sm:grid-cols-2">
              {features.map((feature) => (
                <li
                  key={feature.key}
                  className="
                    group relative overflow-hidden
                    rounded-3xl
                    border border-white/40
                    backdrop-blur-xl
                    shadow-[0_18px_45px_rgba(122,31,31,0.15)]
                    transition-all duration-500
                    hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(122,31,31,0.25)]
                  "
                >
                  {/* Morphing background blobs */}
                  <div
                    className="
                      pointer-events-none absolute inset-0
                      bg-linear-to-br from-white/50 via-white/30 to-white/20
                    "
                  />
                  <div
                    className="
                      pointer-events-none absolute top-0 right-0
                      h-40 w-40 opacity-60
                      bg-linear-to-br from-white/70 via-white/40 to-transparent
                      morph-slow
                    "
                  />
                  <div
                    className="
                      pointer-events-none absolute bottom-0 left-0
                      h-36 w-36 opacity-50
                      bg-linear-to-tr from-[#FDE7B0]/70 via-[#FFEFC7]/50 to-transparent
                      morph-medium
                    "
                    style={{ animationDelay: "3s" }}
                  />
                  <div
                    className="
                      pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      h-32 w-32 opacity-40
                      bg-linear-to-br from-white/60 to-transparent
                      morph-fast
                    "
                    style={{ animationDelay: "6s" }}
                  />
                  
                  {/* Shimmer overlay */}
                  <div
                    className="
                      pointer-events-none absolute inset-0
                      bg-linear-to-r from-transparent via-white/20 to-transparent
                      shimmer-effect
                      opacity-0 group-hover:opacity-100
                      transition-opacity duration-700
                    "
                  />

                  {/* Card content */}
                  <div className="relative z-10 px-5 py-4 sm:px-6 sm:py-5">
                    <div className="flex gap-3 sm:gap-4 items-start">
                      <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/60 shadow-inner shadow-white/40 shrink-0">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#7A1F1F]" />
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <h3 className="text-sm sm:text-base md:text-lg text-[#3A211F] sanchez-regular">
                            {feature.label}
                          </h3>
                          {feature.tag && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-2xs sm:text-xs font-semibold bg-[#7A1F1F]/8 text-[#7A1F1F] border border-white/60 unbounded-subHeading">
                              {feature.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-[#5C4234] leading-relaxed text-justify">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Stats row */}
            {/* <div className="grid grid-cols-3 gap-4 rounded-3xl bg-white/40 backdrop-blur-lg border border-white/50 px-4 py-4 sm:px-6 sm:py-5 shadow-md">
              {stats.map((item) => (
                <div key={item.label} className="text-left">
                  <div className="text-lg sm:text-xl font-extrabold text-[#7A1F1F]">
                    {item.value}
                  </div>
                  <div className="text-[11px] sm:text-xs text-[#6B4B3A] leading-snug">
                    {item.label}
                  </div>
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </section>
    </>
  );
}

const WhyUs = memo(WhyUsBase);
export default WhyUs;