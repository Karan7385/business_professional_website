import React, { useEffect, useState, memo } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CertificatesGallery from "../../components/certificates/CertificatesGallery";
import {
  CERT_API_URL,
  CERT_HERO_CONTENT,
  CERT_STATS_TAGS,
} from "../../data/certificatesConfig";

const CertificatesHero = memo(function CertificatesHero({
  mounted,
  base,
  active,
}) {
  const { eyebrow, title, description } = CERT_HERO_CONTENT;

  return (
    <div
      className={`${base} ${mounted ? active : ""} text-center relative`}
      style={{ transitionDelay: "100ms" }}
    >
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-linear-to-br from-[#7A1F1F]/5 via-[#EAC97C]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-[#7A1F1F]/10 to-[#EAC97C]/10 border border-[#7A1F1F]/20 mb-6">
          <svg
            className="w-4 h-4 text-[#7A1F1F]"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-semibold text-[#7A1F1F] unbounded-subHeading">
            {eyebrow}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-[#7A1F1F] via-[#9a2f2f] to-[#7A1F1F] tracking-tight mb-6 sanchez-regular">
          {title}
        </h1>

        <p className="mt-6 max-w-3xl mx-auto text-base md:text-lg text-[#4b2b2b]/80 leading-relaxed unbounded-subHeading">
          {description}
        </p>
      </div>
    </div>
  );
});

const CertificatesStatsBanner = memo(function CertificatesStatsBanner({
  mounted,
  base,
  active,
}) {
  return (
    <div
      className={`${base} ${mounted ? active : ""} mt-12`}
      style={{ transitionDelay: "200ms" }}
    >
      <div className="relative rounded-3xl bg-linear-to-r from-[#7A1F1F] via-[#8f2b2b] to-[#7A1F1F] text-white shadow-[0_30px_80px_rgba(122,31,31,0.3)] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
});

export function Certificates() {
  const [pageMounted, setPageMounted] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setPageMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchCertificates() {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(CERT_API_URL);
        if (cancelled) return;

        const items = Array.isArray(res.data?.data) ? res.data.data : [];

        const mapped = items.map((item) => ({
          id: item.id,
          title: item.title,
          issuer: item.issuer,
          year: item.year,
          // prepend host if backend sends relative paths
          src: item.src?.startsWith("http")
            ? item.src
            : `http://localhost:3000${item.src}`,
          logo: item.logo?.startsWith("http")
            ? item.logo
            : `http://localhost:3000${item.logo}`,
          category: item.category,
          color: item.color,
        }));


        setCertificates(mapped);
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch certificates:", err);
          setError("Unable to load certificates right now.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchCertificates();

    return () => {
      cancelled = true;
    };
  }, []);

  const base =
    "transform transition-all duration-1000 ease-out opacity-0 translate-y-12";
  const active = "opacity-100 translate-y-0";

  return (
    <>
      <style>
        {`
          @keyframes linearShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .linear-animate {
            background-size: 200% 200%;
            animation: linearShift 8s ease infinite;
          }
        `}
      </style>

      <Navbar />

      <main className="min-h-screen bg-linear-to-br from-orange-50 via-slate-50 to-orange-50 pt-10 pb-16">
        <section className="max-w-7xl mx-auto px-6">
          <CertificatesHero
            mounted={pageMounted}
            base={base}
            active={active}
          />

          <CertificatesStatsBanner
            mounted={pageMounted}
            base={base}
            active={active}
          />

          <div
            className={`${base} ${pageMounted ? active : ""} mt-16`}
            style={{ transitionDelay: "300ms" }}
          >
            {loading && (
              <div className="text-center text-sm text-slate-500">
                Loading certificates...
              </div>
            )}

            {error && (
              <div className="text-center text-sm text-red-600">
                {error}
              </div>
            )}

            {!loading && !error && (
              <CertificatesGallery certificates={certificates} />
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Certificates;