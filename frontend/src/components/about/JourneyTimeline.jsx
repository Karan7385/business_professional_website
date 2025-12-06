import React from "react";
import { Link } from "react-router-dom";
import { TIMELINE_EVENTS } from "../../data/aboutConfig";

function JourneyTimeline({ mounted, sectionBase, sectionActive }) {
  return (
    <div
      className={`${sectionBase} ${
        mounted ? sectionActive : ""
      } w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10`}
      style={{ transitionDelay: "750ms" }}
    >
      <h4 className="text-2xl sm:text-3xl font-bold text-[#7A1F1F] mb-6 text-center">
        Our Journey
      </h4>

      <ol className="relative border-l border-[#EAC97C]/70 ml-3 sm:ml-4 md:ml-6 space-y-7 sm:space-y-9">
        {TIMELINE_EVENTS.map((event, index) => (
          <li key={`${event.date}-${event.title}`} className="relative pl-7 sm:pl-8 md:pl-10">
            <span className="absolute -left-3 md:-left-3.5 flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#FDF5DF] border border-[#EAC97C] ring-4 ring-[#FFF8E8] shadow-sm">
              <svg
                className="w-3 h-3 text-[#7A1F1F]"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"
                />
              </svg>
            </span>

            <div
              className={`transition-all duration-700 ease-out transform ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${900 + index * 150}ms` }}
            >
              <time className="inline-block bg-[#FFF7E3] border border-[#EAC97C]/70 text-[#7A1F1F] text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-md">
                {event.date}
              </time>

              <h3 className="flex flex-wrap items-center gap-2 mt-2 mb-2 text-base sm:text-lg font-semibold text-[#3A211F]">
                {event.title}
                {event.badge && (
                  <span className="inline-flex items-center text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-[#7A1F1F]/5 border border-[#7A1F1F]/30 text-[#7A1F1F]">
                    {event.badge}
                  </span>
                )}
              </h3>

              <p className="text-xs sm:text-sm md:text-base text-[#4b2b2b] leading-relaxed bg-white rounded-xl shadow-sm px-3 sm:px-4 py-3 border border-[#EAC97C]/40">
                {event.description}
              </p>

              {event.ctaLabel && (
                <Link
                  to={event.ctaHref}
                  className="inline-flex items-center mt-3 text-xs sm:text-sm font-medium text-[#7A1F1F] bg-[#FFF3C8] border border-[#EAC97C]/70 hover:bg-[#F7D88F] hover:border-[#E0B961] rounded-full px-3 sm:px-4 py-1.5 shadow-sm transition-colors duration-200"
                >
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth={2}
                      d="M10 3v4a1 1 0 0 1-1 1H5m14-4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Zm-4 1h.01v.01H15V5Zm-2 2h.01v.01H13V7Zm2 2h.01v.01H15V9Zm-2 2h.01v.01H13V11Zm2 2h.01v.01H15V13Zm-2 2h.01v.01H13V15Zm2 2h.01v.01H15V17Zm-2 2h.01v.01H13V19Z"
                    />
                  </svg>
                  {event.ctaLabel}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default JourneyTimeline;