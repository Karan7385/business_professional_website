import { useState, useRef, useEffect } from "react";
import Logo from "../../assets/logos/logo.png";

// =========================== IMPORT PAGES ============================================

import DashboardPage from "../pages/DashboardPage";
import EnquiriesPage from "../pages/EnquiriesPage";
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import ProductsPage from "../pages/ProductsPage";
import CertificatesPage from "../pages/CertificatesPage";

import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// =========================== IMPORT PAGES ============================================




// ======================== = CONSTANTS =================================

const BASE_SERVER_URL = "http://localhost:3000";

// ======================== = CONSTANTS =================================




// ====================================== ICONS ========================================

const UserIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LogoutIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
);

const HomeIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const ClipboardIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M15 2H9a1 1 0 0 0-1 1v1h8V3a1 1 0 0 0-1-1z" />
  </svg>
);

const CollectionIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const DocumentIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

// ====================================== ICONS ========================================




// -----------------------------SIDEBAR CONFIG (component-based, no routing) =============================

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: HomeIcon, component: DashboardPage },
  { key: "enquiries", label: "Enquiries", icon: ClipboardIcon, component: EnquiriesPage },
  { key: "home", label: "Home", icon: HomeIcon, component: HomePage },
  // { key: "about", label: "About", icon: InfoIcon, component: AboutPage },
  { key: "products", label: "Products", icon: CollectionIcon, component: ProductsPage },
  { key: "certificates", label: "Certificates", icon: DocumentIcon, component: CertificatesPage },
];

// -----------------------------SIDEBAR CONFIG (component-based, no routing) =============================




// ===================================== USER DROPDOWN =============================================

const UserDropdown = ({ user }) => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${BASE_SERVER_URL}/api/auth/logout`,
        {},
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success === true) {
        // Delete cookie
        document.cookie = "admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        toast.success(res.data.message || "Logged out successfully!");

        // Delay redirect for toast visual
        setTimeout(() => navigate("/login"), 700);
      }
    } catch (error) {
      toast.error("Something went wrong while logging out.");
      console.error(error);
    } finally {
      setOpen(false);
    }
  };

  return (
    <div className="relative" ref={ref}>
      
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="group flex items-center gap-2 px-2 py-1 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm hover:shadow-md hover:bg-white transition-all duration-200">

        <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold border border-slate-800 group-hover:scale-105 group-active:scale-95 transition-transform duration-150 unbounded-subHeading">
          {user?.name?.[0] || "U"}
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl py-2 z-50 origin-top-right scale-100 opacity-100 transform transition-all duration-200">
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-semibold border border-slate-700 shadow-inner">
                <UserIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 unbounded-subHeading">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-xs text-slate-500 font-medium sanchez-regular">
                  Administrator
                </p>
              </div>
            </div>
            <div className="mt-3 text-[11px] text-slate-600 space-y-1.5">
              <p className="sanchez-regular">
                <span className="font-semibold text-slate-800 unbounded-subHeading">
                  Login time:
                </span>{" "}
                {user?.loginTime || "2025-11-30 09:15 AM"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 unbounded-heading hover:bg-red-50 transition-colors duration-150"
          >
            <LogoutIcon className="w-4 h-4 mr-3" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

// ===================================== USER DROPDOWN =============================================




// ============================ Main layout (tab-style content switching) ================================
export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard"); // default
  const notificationCount = 3;

  // User Dropdown Data
  const user = {
    name: "Admin User",
    loginTime: new Date().toString(),
  };

  // SideBar Link
  const SidebarLink = ({ item }) => {
    const isActive = item.key === activeTab;

    return (
      <button
        type="button"
        onClick={() => {
          setActiveTab(item.key);
          setSidebarOpen(false);
        }}
        className={[
          "group relative flex w-full items-center gap-3 px-3 py-2 text-sm rounded-xl transition-all duration-200 ease-out transform text-left",
          isActive
            ? "text-slate-900 font-semibold"
            : "text-slate-600 hover:text-slate-900",
        ].join(" ")}
      >
        {/* Active pill background */}
        <span
          className={[
            "absolute inset-0 rounded-xl -z-10 transition-all duration-200",
            isActive
              ? "bg-slate-900/5 shadow-sm"
              : "bg-slate-900/0 group-hover:bg-slate-900/4",
          ].join(" ")}
        />

        <div className="w-8 h-8 rounded-full bg-slate-900/5 flex items-center justify-center group-hover:bg-slate-900/10 transition-colors duration-200">
          <item.icon className="w-4 h-4" />
        </div>
        <span className="tracking-tight unbounded-subHeading">{item.label}</span>

        <span
          className={[
            "ml-auto w-1 h-4 rounded-full transition-all duration-200",
            isActive ? "bg-slate-900/70" : "bg-slate-900/0 group-hover:bg-slate-900/40",
          ].join(" ")}
        />
      </button>
    );
  };

  const activeItem = navItems.find((n) => n.key === activeTab);
  const ActiveComponent = activeItem?.component || null;

  return (
    <div className="h-screen flex flex-col text-slate-900 relative overflow-hidden bg-linear-to-br from-slate-50 via-slate-100 to-slate-200">
      {/* Subtle background blobs for depth */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 -right-24 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-16 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-linear-to-r from-white via-slate-50 to-slate-100 backdrop-blur-lg shadow-xl">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-3">
            {/* mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100/80 transition-colors duration-150"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
                <img
                  src={Logo}
                  alt="Company Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/40x40/c2b8a3/ffffff?text=L";
                  }}
                />
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-extrabold tracking-tight leading-snug">
                  <span className="bg-clip-text text-lg text-transparent bg-linear-to-r from-slate-700 via-slate-900 to-slate-950 unbounded-heading">
                    PT INDO BUSINESS EXPORT
                  </span>
                </span>
                <span className="text-[11px] text-slate-500 tracking-wide unbounded-subHeading">
                  IMPORT &amp; EXPORT · Admin Panel
                </span>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <UserDropdown user={user} />
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-72 bg-linear-to-b from-white via-slate-50 to-slate-100 backdrop-blur-2xl border-r border-slate-200/80 shadow-xl">
          <div className="h-full p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.18em]">
                Menu
              </div>
              <div className="px-2 py-0.5 rounded-full bg-emerald-50 text-2xs text-emerald-600 font-medium border border-emerald-100">
                Admin
              </div>
            </div>

            <nav className="space-y-1 flex-1">
              {navItems.map((item) => (
                <SidebarLink key={item.key} item={item} />
              ))}
            </nav>

            <div className="mt-6 pt-4 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
              <span>© {new Date().getFullYear()} PT INDO</span>
              <span className="inline-flex items-center gap-1 text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                v1.3
              </span>
            </div>
          </div>
        </aside>

        {/* Mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200" />
            <div
              className="absolute top-0 left-0 bottom-0 w-72 bg-linear-to-b from-white via-slate-50 to-slate-100 backdrop-blur-2xl shadow-2xl shadow-slate-900/30 p-4 transition-transform duration-200 ease-out translate-x-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.18em]">
                  Menu
                </span>
                <button
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors duration-150"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close sidebar"
                >
                  ✕
                </button>
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <SidebarLink key={item.key} item={item} />
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Content area – tab based */}
        <main className="flex-1 relative">
          {/* Scrollable area */}
          <div className="h-full overflow-y-auto scroll-smooth smooth-scroll-y relative">
            {/* top fade shadow */}
            <div className="pointer-events-none sticky top-0 z-10 h-6 bg-linear-to-b from-slate-200/70 via-slate-200/20 to-transparent" />

            {/* content */}
            <div className="relative p-4 md:p-6 lg:p-8">
              <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl p-4 md:p-6 lg:p-8 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(148,163,184,0.55)]">
                {ActiveComponent && <ActiveComponent />}
              </div>
            </div>

            {/* bottom fade shadow */}
            <div className="pointer-events-none sticky bottom-0 z-10 h-6 bg-linear-to-t from-slate-300/70 via-slate-200/30 to-transparent" />
          </div>
        </main>
      </div>

      <Toaster position="top-right" />
    </div>
  );
}