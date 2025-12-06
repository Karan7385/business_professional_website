import { Link } from "react-router-dom";
import LogoSrc from "../assets/logos/logo.png";

import InstaLogo from "../assets/logos/insta-logo.png";
import FbLogo from "../assets/logos/fb-logo.png";
import WhatsappLogo from "../assets/logos/whatsapp-logo.png";
import LinkedinLogo from "../assets/logos/linkedin-logo.png";

function Footer() {
  return (
    <footer className="bg-linear-to-r from-amber-100 via-orange-50 to-amber-100 text-[#5b2f2f]">
      <div className="mx-auto w-full max-w-7xl px-6 py-10 sm:py-12 lg:py-16">
        <div className="bg-white/75 backdrop-blur-sm rounded-2xl shadow-md p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <Link to="/" className="inline-flex items-center gap-4">
                <img
                  src={LogoSrc}
                  alt="PT INDO BUSINESS EXPORTS"
                  className="h-20 sm:h-24 md:h-28 w-auto object-contain"
                />
              </Link>

              <p className="mt-3 text-sm text-[#4b2a2a] max-w-sm sanchez-regular text-justify">
                PT INDO BUSINESS EXPORT — exporters of premium spices, herbs and
                dry fruits. Trusted sourcing, ethical practices and global
                deliveries.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide unbounded-subHeading">
                Quick Links
              </h3>
              <ul className="space-y-2 text-sm">
                {[
                  ["Home", "/"],
                  ["About Us", "/about"],
                  ["Products", "/products"],
                  ["Certificates", "/certs"],
                ].map(([label, path]) => (
                  <li key={path}>
                    <Link
                      className="
                        inline-block sanchez-regular
                        transition-transform duration-200
                        hover:translate-x-1 hover:text-[#7a1f1f]
                      "
                      to={path}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Details */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide unbounded-subHeading">
                Contact
              </h3>

              <ul className="space-y-3 text-sm sanchez-regular">
                <li>
                  <a
                    href="tel:+9173859844164"
                    className="inline-flex items-center gap-3 px-2 py-1 rounded-md hover:bg-amber-50 transition"
                  >
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-[#ffb57b] to-[#ff8a3c] shadow-sm">
                      <svg
                        className="w-4 h-4 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 5.25A3.25 3.25 0 0 1 6.25 2h.5a2 2 0 0 1 1.98 1.605l.36 1.66a2 2 0 0 1-.49 1.77l-1.02 1.02a15.056 15.056 0 0 0 6.586 6.586l1.02-1.02a2 2 0 0 1 1.77-.49l1.66.36A2 2 0 0 1 22 17.25v.5A3.25 3.25 0 0 1 18.75 21h-.5A17.75 17.75 0 0 1 3 5.25z"
                        />
                      </svg>
                    </span>

                    <div className="text-left text-xs text-[#5b2f2f]">
                      +91 73859 844164
                    </div>
                  </a>
                </li>

                <li>
                  <a
                    href="tel:+6285926424213"
                    className="inline-flex items-center gap-3 px-2 py-1 rounded-md hover:bg-amber-50 transition"
                  >
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-[#ffd29b] to-[#ffb57b] shadow-sm">
                      <svg
                        className="w-4 h-4 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z"
                        />
                      </svg>
                    </span>

                    <div className="text-left text-xs text-[#5b2f2f]">
                      +62 859-2642-4213
                    </div>
                  </a>
                </li>

                <li>
                  <a
                    href="mailto:karanvishwakarma7385@gmail.com"
                    className="inline-flex items-center gap-3 px-2 py-1 rounded-md hover:bg-amber-50 transition"
                  >
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-[#ffd8b8] to-[#ffd29b] shadow-sm">
                      <svg
                        className="w-4 h-4 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 8.5v7A2.5 2.5 0 0 0 5.5 18h13A2.5 2.5 0 0 0 21 15.5v-7"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 8.5l8.5 5 8.5-5"
                        />
                      </svg>
                    </span>

                    <div className="text-left text-xs text-[#5b2f2f] break-all">
                      indobusinessexports@gmail.com
                    </div>
                  </a>
                </li>
              </ul>
            </div>

            {/* Catalog / Office */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide unbounded-subHeading">
                Catalog
              </h3>
              <Link
                to="/brochure.pdf"
                className="
                  inline-flex items-center gap-2
                  px-3 py-2 rounded-full sanchez-regular
                  bg-amber-50 text-[#6a2a2a]
                  hover:bg-amber-100
                  transition transform hover:-translate-y-0.5
                "
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 11l4 4 4-4" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21H3" />
                </svg>
                Download Brochure
              </Link>

              <div className="mt-6 text-sm">
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide unbounded-subHeading">
                  Registered Office
                </h3>
                <address className="not-italic text-xs text-[#4b2a2a] max-w-[18rem] sanchez-regular">
                  JALAN MARGOMULYO 46 BLOCK H-13
                  <br />
                  ALAMAT BARU: JALAN MARGOMULYO 46 BLOCK H-12A
                  <br />
                  SURABAYA, Maharashtra, India 400020
                </address>
              </div>
            </div>
          </div>

          <hr className="my-6 border-[#e6c79a]" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-[#5b2f2f] text-center md:text-left">
              © {new Date().getFullYear()} PT INDO BUSINESS EXPORTS. All rights
              reserved.
            </div>

            <div className="flex items-center justify-center gap-3">
              {[InstaLogo, FbLogo, WhatsappLogo, LinkedinLogo].map(
                (icon, i) => (
                  <a
                    key={i}
                    href="#"
                    aria-label={`social-${i}`}
                    className="
                      inline-flex items-center justify-center
                      w-10 h-10 rounded-lg
                      bg-white/85 hover:bg-white
                      shadow-sm hover:shadow-md
                      transform transition hover:-translate-y-1 hover:scale-105
                    "
                  >
                    <img
                      src={icon}
                      alt={`social-${i}`}
                      className="w-6 h-6 object-contain"
                    />
                  </a>
                )
              )}
            </div>
          </div>
          
          <div className="text-2xs text-[#5b2f2f] text-center md:text-right mt-2">
            Developed by <span className="font-bold">KARAN VISHWAKARMA</span>
          </div>

        </div>
      </div>
    </footer>
  );
}


export default Footer;