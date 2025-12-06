import { memo } from "react";
import { Link } from "react-router-dom";

// This image will come from server and this is default image
// import ExportImage from "../../assets/images/exportImages.jpg";

const BASE_SERVER_URL = "http://localhost:3000/";

// =================== COMPONENT ===================

function JumbotronBase(props) {

  const JUMBOTRON_CONTENT = {
    backgroundImageUrl: BASE_SERVER_URL + props.data.background_image,
    backgroundAlt: props.data.alt,
    title: props.data.title,
    intro: (
      <>
        {props.data.intro}
      </>
    ),
    body: (
      <>
        {props.data.body}
      </>
    ),
    primaryCta: {
      label: "Explore Our Products",
      to: "/products",
    },
    secondaryCta: {
      label: "Learn More About PT INDO",
      to: "/about",
    },
  };

  return (
    <section
      className="
    flex items-center justify-center
    min-h-screen
    pb-12
    bg-black
    overflow-hidden
  "
    >

      {/* BACKGROUND IMAGE (lazy) */}
      <div className="absolute inset-0">
        <img
          src={JUMBOTRON_CONTENT.backgroundImageUrl}
          alt={JUMBOTRON_CONTENT.backgroundAlt}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-black/80 via-black/70 to-black/85" />
      </div>

      {/* FOREGROUND CONTENT */}
      <div className="relative w-full max-w-7xl px-4">
        <div
          className="
            w-full max-w-2xl mx-auto
            text-center
            bg-black/30 backdrop-blur-sm
            rounded-2xl shadow-2xl
            px-6 py-8 sm:px-8 sm:py-10
          "
        >
          {/* GRADIENT MAIN HEADING */}
          <h1
            className="
              mb-4 text-3xl sm:text-4xl lg:text-5xl
              font-medium sanchez-regular tracking-tight
              bg-linear-to-r from-amber-300 via-amber-200 to-yellow-100
              bg-clip-text text-transparent
              drop-shadow-[0_0_18px_rgba(0,0,0,0.45)]
            "
          >
            {JUMBOTRON_CONTENT.title}
          </h1>

          <p className="mb-5 text-sm sm:text-base md:text-lg text-amber-50/90 text-justify leading-relaxed roboto-text">
            {JUMBOTRON_CONTENT.intro}
          </p>

          <p className="mb-8 text-xs sm:text-sm text-amber-100/80 text-justify roboto-text">
            {JUMBOTRON_CONTENT.body}
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            {/* PRIMARY CTA */}
            <Link
              to={JUMBOTRON_CONTENT.primaryCta.to}
              className="
                inline-flex items-center justify-center unbounded-subHeading
                px-5 py-2.5
                rounded-full
                text-sm sm:text-base font-medium
                bg-amber-400 text-[#7A1F1F]
                shadow-md hover:shadow-lg
                hover:bg-amber-300
                transition-all duration-200
                hover:-translate-y-0.5
                focus:outline-none focus:ring-2 focus:ring-amber-200
                focus:ring-offset-2 focus:ring-offset-black/40
              "
            >
              {JUMBOTRON_CONTENT.primaryCta.label}
              <svg
                className="w-4 h-4 ms-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12h14m0 0-4-4m4 4-4 4"
                />
              </svg>
            </Link>

            {/* SECONDARY CTA */}
            <Link
              to={JUMBOTRON_CONTENT.secondaryCta.to}
              className="
                inline-flex items-center justify-center unbounded-subHeading
                px-5 py-2.5
                rounded-full
                text-sm sm:text-base font-medium
                border border-amber-200/70
                bg-transparent text-amber-50
                hover:bg-amber-50/10
                hover:border-amber-100
                transition-all duration-200
                hover:-translate-y-0.5
                focus:outline-none focus:ring-2 focus:ring-amber-200
                focus:ring-offset-2 focus:ring-offset-black/40
              "
            >
              {JUMBOTRON_CONTENT.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Memoized for performance
const Jumbotron = memo(JumbotronBase);

export default Jumbotron;