import { useState, useEffect, useRef } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import axios from "axios";

import Logo from "../assets/logos/logo.png";
import InstaLogo from "../assets/logos/insta-logo.png";
import FbLogo from "../assets/logos/fb-logo.png";
import TwitterLogo from "../assets/logos/twitter-logo.png";
import WhatsappLogo from "../assets/logos/whatsapp-logo.png";
import LinkedinLogo from "../assets/logos/linkedin-logo.png";

import ContactModal from "../components/ContactModal";

export default function NavbarA() {
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [prodData, setProdData] = useState([]);

  const location = useLocation();
  const navbarRef = useRef(null);

  const socialLinks = [
    { icon: InstaLogo, href: "/instagram" },
    { icon: FbLogo, href: "/facebook" },
    { icon: WhatsappLogo, href: "/whatsapp" },
    { icon: LinkedinLogo, href: "/linkedin" },
  ];

  useEffect(() => {
    const data = async () => {
      const res = await axios.get("http://localhost:3000/api/products/get-categories");
      setProdData(res.data.data);
    }

    data();
  }, []);

  const PRODUCT_CATEGORIES = prodData.map((item) => {
    return {
      label: item.category,
      value: item.category
    }
  });

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    {
      label: "Products",
      path: "/products",
      dropdown: PRODUCT_CATEGORIES,
    },
    { label: "Certificates", path: "/certs" },
  ];

  const handleSubmitContact = async (data) => {

    const res = await axios.post(
      "http://localhost:3000/api/contact/submit-enquiries",
      data,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const topBarHeight = 80;

      if (currentScrollY < lastScrollY && currentScrollY > topBarHeight) {
        setIsSticky(true);
      } else if (currentScrollY > lastScrollY || currentScrollY <= topBarHeight) {
        setIsSticky(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <header className="w-full">
        {/* TOP BAR - Professional Branding */}
        <div className="bg-gradient-to-r from-[#EDDBAB] via-[#F7E6C4] to-[#EAC97C] backdrop-blur-sm border-b border-[#EAC97C]/40 py-2 sm:py-0">
          <div className="max-w-7xl mx-auto px-6 lg:px-4">
            <div className="flex items-center justify-between">
              <Link
                to="/"
                className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
                onClick={() => {
                  setOpen(false);
                  setProductOpen(false);
                }}
              >
                <img
                  src={Logo}
                  className="h-24 w-auto"
                  alt="PT INDO BUSINESS EXPORTS logo"
                  loading="lazy"
                />
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold text-[#7A1F1F] leading-tight unbounded-heading">
                    PT INDO BUSINESS EXPORTS
                  </h1>
                  <p className="text-xs text-[#7A1F1F] font-medium unbounded-subHeading">
                    IMPORTER & EXPORTER
                  </p>
                  <p className="text-xs text-[#7A1F1F] font-medium unbounded-subHeading">
                    SPICES, HERBS, GUMS RESINS AND NATURAL ESSENTIAL OILS
                  </p>
                </div>
              </Link>

              <div className="hidden lg:flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                  {socialLinks.map(({ icon, href }, i) => (
                    <Link
                      key={i}
                      to={href}
                      className="w-10 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 flex items-center justify-center"
                      aria-label={`Visit our ${href} page`}
                    >
                      <img src={icon} alt="" className="w-14 h-8" />
                    </Link>
                  ))}
                </div>

                <button
                  onClick={() => setOpenModal(true)}
                  className="px-6 py-2 text-sm font-semibold text-[#7A1F1F] bg-linear-to-r from-[#EAC97C] to-[#d8b569] hover:bg-linear-to-r hover:from-[#EAC97C] hover:to-[#d8b569] rounded-lg transition-colors duration-200 border border-transparent hover:border-white/30"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PRIMARY NAVBAR - Clean & Professional */}
        <div
          ref={navbarRef}
          className={`
            w-full z-40 bg-linear-to-br from-slate-100 via-orange-50 to-orange-50 backdrop-blur-sm
            transition-all duration-300 ease-in-out
            ${isSticky
              ? "fixed top-0 shadow-slate-400 shadow-lg"
              : "relative"
            }
          `}
        >
          <nav className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className={`flex items-center justify-center h-7 ${isSticky ? "lg:h-14" : "lg:h-7"}`}>
              {/* Desktop Navigation */}
              <div className={`hidden lg:flex items-center space-x-30 sanchez-regular mt-5 ${isSticky ? "" : "mt-5"}`}>
                {navItems.map((item) => {
                  const isDropdown = !!item.dropdown;

                  if (isDropdown) {
                    return (
                      <div key={item.label} className="relative">
                        <button
                          type="button"
                          onClick={() => setProductOpen((prev) => !prev)}
                          className={`
                            flex items-center space-x-1 text-sm font-semibold px-3 py-2 rounded-lg
                            transition-all duration-200 border border-transparent
                            ${location.pathname.startsWith(item.path)
                              ? "text-[#7A1F1F] bg-[#EAC97C]/10 border-[#EAC97C]/30"
                              : "text-gray-700 hover:text-[#7A1F1F] hover:border hover:bg-[#EAC97C]/10"
                            }
                          `}
                        >
                          <span>{item.label}</span>
                          <svg
                            className={`w-4 h-4 transition-transform duration-200 ${productOpen ? "rotate-180" : ""
                              }`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </button>

                        {productOpen && (
                          <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50">
                            {item.dropdown.map((sub) => (
                              <Link
                                key={sub.value}
                                to={{
                                  pathname: "/products",
                                  search: `?category=${encodeURIComponent(
                                    sub.value
                                  )}`,
                                }}
                                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#7A1F1F] hover:pl-6 transition-all duration-150 font-medium border-l-2 border-transparent hover:border-[#EAC97C]"
                                onClick={() => setProductOpen(false)}
                              >
                                {sub.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <NavLink
                      key={item.label}
                      to={item.path}
                      className={({ isActive }) =>
                        `text-sm font-semibold px-3 py-2 rounded-lg transition-all duration-200 ${isActive
                          ? "text-[#7A1F1F] bg-[#EAC97C]/10 border border-[#EAC97C]/30"
                          : "text-gray-700 hover:text-[#7A1F1F] hover:border hover:bg-[#EAC97C]/10"
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  );
                })}
              </div>

              {/* Mobile menu button */}
              <div className={`lg:hidden flex items-center ${isSticky ? "" : "mt-5"}`}>
                <button
                  onClick={() => setOpen((prev) => !prev)}
                  className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-[#7A1F1F] transition-colors duration-200"
                  aria-label="Toggle menu"
                >
                  {open ? (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </nav>

          {/* Mobile Menu */}
          {open && (
            <div className="lg:hidden border-t border-gray-200 bg-linear-to-br from-slate-100 via-orange-50 to-slate-100">
              <div className="px-6 py-8 space-y-4 max-w-md mx-auto sanchez-regular">
                <NavLink
                  to="/"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block w-full text-left px-4 py-3 text-lg font-semibold rounded-xl transition-all duration-200 ${isActive
                      ? "bg-[#EAC97C]/10 text-[#7A1F1F] border border-[#EAC97C]/30"
                      : "text-gray-700 hover:bg-gray-50 hover:text-[#7A1F1F]"
                    }`
                  }
                >
                  Home
                </NavLink>

                <NavLink
                  to="/about"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block w-full text-left px-4 py-3 text-lg font-semibold rounded-xl transition-all duration-200 ${isActive
                      ? "bg-[#EAC97C]/10 text-[#7A1F1F] border border-[#EAC97C]/30"
                      : "text-gray-700 hover:bg-gray-50 hover:text-[#7A1F1F]"
                    }`
                  }
                >
                  About
                </NavLink>

                <div>
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 text-lg font-semibold text-gray-700 hover:text-[#7A1F1F] hover:bg-gray-50 rounded-xl transition-all duration-200"
                    onClick={() => setProductOpen((prev) => !prev)}
                  >
                    <span>Products</span>
                    <svg
                      className={`w-5 h-5 transition-transform duration-200 ${productOpen ? "rotate-180" : ""
                        }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>

                  {productOpen && (
                    <div className="mt-2 space-y-1 pl-4">
                      {PRODUCT_CATEGORIES.map((sub) => (
                        <Link
                          key={sub.value}
                          to={{
                            pathname: "/products",
                            search: `?category=${encodeURIComponent(
                              sub.value
                            )}`,
                          }}
                          className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#7A1F1F] hover:bg-gray-50 hover:pl-4 transition-all duration-150 rounded-lg"
                          onClick={() => {
                            setOpen(false);
                            setProductOpen(false);
                          }}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <NavLink
                  to="/certs"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block w-full text-left px-4 py-3 text-lg font-semibold rounded-xl transition-all duration-200 ${isActive
                      ? "bg-[#EAC97C]/10 text-[#7A1F1F] border border-[#EAC97C]/30"
                      : "text-gray-700 hover:bg-gray-50 hover:text-[#7A1F1F]"
                    }`
                  }
                >
                  Certificates
                </NavLink>

                <div className="flex items-center justify-center space-x-6 pt-6 pb-4">
                  {[InstaLogo, FbLogo, TwitterLogo, WhatsappLogo, LinkedinLogo].map(
                    (icon, i) => (
                      <Link
                        key={i}
                        className="w-10 h-8 rounded-lg bg-gray-100 hover:bg-[#EAC97C]/20 transition-all duration-200 flex items-center justify-center"
                      >
                        <img src={icon} alt="" className="w-14 h-8" />
                      </Link>
                    )
                  )}
                </div>

                <button
                  onClick={() => {
                    setOpen(false);
                    setOpenModal(true);
                  }}
                  className="w-full px-6 py-4 text-lg font-semibold text-[#7A1F1F] hover:bg-gradient-to-r bg-gradient-to-r from-[#EAC97C] to-[#d8b569] hover:from-[#EAC97C] hover:to-[#d8b569] rounded-xl transition-all duration-200 shadow-sm hover:shadow-md border border-transparent"
                >
                  Contact Us
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <ContactModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmitContact}
        logoSrc={Logo}
      />
    </>
  );
}