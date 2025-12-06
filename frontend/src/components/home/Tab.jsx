import React, { memo, useCallback, useState } from "react";

// ================== COMPONENT ==================

function TabBase(props) {  
  
  const TAB_CONFIG = [
    { id: "stats", label: "Statistics" },
    { id: "about", label: "Our Services" },
    { id: "faq", label: "FAQ" },
  ];

  const STAT_ITEMS = props.data.stats.map((item) => {
    return {
      title: item.title,
      desc: item.description,
    };
  });

  const SERVICE_ITEMS = props.data.services.map((item) => {
    return {
      title: item.title,
      desc: item.description,
    };
  });

  const FAQ_ITEMS = props.data.faqs.map((item, index) => {
    return {
      id: item.id ?? index,
      q: item.question,
      a: item.answer,
    };
  });

  const [active, setActive] = useState("stats");
  const [openFaq, setOpenFaq] = useState(null);

  const handleTabChange = useCallback((tabId) => {
    setActive(tabId);
  }, []);

  const handleFaqToggle = useCallback((id) => {
    setOpenFaq((prev) => (prev === id ? null : id));
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto my-10 px-4 sm:px-6">
      {/* SECTION HEADING */}
      <header className="mb-6 text-center">
        <h2 className="sanchez-regular text-3xl sm:text-4xl text-[#7A1F1F]">
          Why Choose PT Indo Business Exports
        </h2>
        <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
          Explore our key statistics, services, and frequently asked questions to understand us better.
        </p>
      </header>

      <div
        className="
          w-full
          rounded-xl shadow-sm
          bg-gradient-to-br from-[#FFFDF8] via-[#FFF9EE] to-[#FFF5E4]
          p-4 sm:p-6
        "
      >
        {/* MOBILE DROPDOWN */}
        <div className="sm:hidden mb-4">
          <select
            value={active}
            onChange={(e) => handleTabChange(e.target.value)}
            className="
              w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm
              focus:ring-2 focus:ring-amber-200 focus:outline-none roboto-text
            "
          >
            {TAB_CONFIG.map((tab) => (
              <option className="roboto-text" key={tab.id} value={tab.id}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>

        {/* DESKTOP TABS */}
        <ul
          className="hidden sm:flex text-sm font-medium rounded-md overflow-hidden shadow-sm unbounded-subHeading"
          role="tablist"
        >
          {TAB_CONFIG.map((tab) => {
            const isActive = active === tab.id;
            return (
              <li key={tab.id} className="flex-1">
                <button
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                    w-full p-3 transition-all duration-300
                    ${
                      isActive
                        ? "bg-amber-50 text-amber-900 shadow-inner"
                        : "bg-white text-gray-700 hover:bg-amber-50"
                    }
                  `}
                  role="tab"
                  aria-selected={isActive}
                >
                  {tab.label}
                </button>
              </li>
            );
          })}
        </ul>

        {/* TAB PANELS */}
        <div className="mt-4 border border-gray-100 rounded-md bg-white overflow-hidden">
          {/* Statistics Panel */}
          <div
            className={`
              p-6 transition-all duration-500 origin-top
              ${
                active === "stats"
                  ? "opacity-100 translate-y-0 max-h-[1200px]"
                  : "opacity-0 -translate-y-2 max-h-0 overflow-hidden"
              }
            `}
            role="tabpanel"
            hidden={active !== "stats"}
          >
            <dl className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-6">
              {STAT_ITEMS.map((item, index) => (
                <div key={index} className="flex flex-col">
                  <dt className="text-2xl font-semibold text-amber-900 sanchez-regular">
                    {item.title}
                  </dt>
                  <dd className="text-sm text-gray-600 unbounded-subHeading">
                    {item.desc}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Services Panel */}
          <div
            className={`
              p-6 transition-all duration-500 origin-top
              ${
                active === "about"
                  ? "opacity-100 translate-y-0 max-h-[1200px]"
                  : "opacity-0 -translate-y-2 max-h-0 overflow-hidden"
              }
            `}
            role="tabpanel"
            hidden={active !== "about"}
          >
            <h3 className="text-xl sm:text-2xl font-semibold text-amber-900 mb-4 sanchez-regular">
              What We Offer ?
            </h3>

            <ul className="grid gap-4 sm:grid-cols-2">
              {SERVICE_ITEMS.map((item, index) => (
                <li
                  key={index}
                  className="
                    flex gap-3 items-start p-4
                    rounded-md bg-amber-50 hover:bg-amber-100
                    transition
                  "
                >
                  {/* Check-circle icon */}
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 text-amber-700 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 12.75 11.25 15 15 9.75"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <div>
                    <div className="font-medium text-gray-800 unbounded-Heading text-sm sm:text-base md:text-lg">
                      {item.title}
                    </div>
                    <div className="text-xs sm:text-sm md:text-base text-gray-600 sanchez-regular mt-1">
                      {item.desc}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* FAQ Panel */}
          <div
            className={`
              p-6 transition-all duration-500 origin-top
              ${
                active === "faq"
                  ? "opacity-100 translate-y-0 max-h-[2000px]"
                  : "opacity-0 -translate-y-2 max-h-0 overflow-hidden"
              }
            `}
            role="tabpanel"
            hidden={active !== "faq"}
          >
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-amber-900 mb-3 sanchez-regular flex items-center gap-2">
              {/* Small question icon */}
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-amber-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M12 18h.01M9.09 9a3 3 0 0 1 5.82 1c0 1.5-1.2 2.25-2.1 2.7-.78.39-1.19.75-1.19 1.8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Frequently Asked Questions</span>
            </h3>

            <div className="space-y-3">
              {FAQ_ITEMS.map((f) => {
                const isOpen = openFaq === f.id;
                return (
                  <div
                    key={f.id}
                    className="border border-gray-100 rounded-md"
                  >
                    <button
                      type="button"
                      onClick={() => handleFaqToggle(f.id)}
                      className="
                        w-full flex justify-between items-center gap-3
                        px-4 py-3
                        bg-white hover:bg-amber-50
                        transition
                      "
                    >
                      <span className="text-gray-800 sanchez-regular font-extrabold text-sm sm:text-base text-left">
                        {f.q}
                      </span>

                      {/* Plus / minus icon */}
                      <svg
                        className="
                          w-5 h-5 sm:w-6 sm:h-6
                          text-amber-700
                          transform transition-transform
                        "
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        {isOpen ? (
                          // minus
                          <path
                            d="M6 12h12"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        ) : (
                          // plus
                          <>
                            <path
                              d="M12 6v12"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M6 12h12"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </>
                        )}
                      </svg>
                    </button>

                    <div
                      className={`
                        px-4 transition-all
                        ${
                          isOpen
                            ? "max-h-[400px] sm:max-h-[500px] py-3 opacity-100 overflow-y-auto"
                            : "max-h-0 py-0 opacity-0 overflow-hidden"
                        }
                      `}
                    >
                      <p className="text-sm sm:text-base text-gray-600 sanchez-regular leading-relaxed">
                        {f.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Memoized for performance
export const Tab = memo(TabBase);