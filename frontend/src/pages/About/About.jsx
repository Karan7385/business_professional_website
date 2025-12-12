import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { TEAM_MEMBERS } from "../../data/aboutConfig";
import TeamCarousel3D from "../../components/about/TeamCarousel3D";
import HeroMissionVision from "../../components/about/HeroMissionVision";
import CoreValues from "../../components/about/CoreValues";
import JourneyTimeline from "../../components/about/JourneyTimeline";
import WhyUs from "../../components/about/WhyUs";

function About() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setMounted(true), 60);
    return () => window.clearTimeout(t);
  }, []);

  const sectionBase =
    "transform transition-all duration-1000 ease-out opacity-0 translate-y-8";
  const sectionActive = "opacity-100 translate-y-0";

  return (
    <>
      <main className="min-h-screen bg-linear-to-br from-orange-50 via-orange-50 to-slate-100 pt-5">
        <section className="w-full flex flex-col gap-12">
          <HeroMissionVision
            mounted={mounted}
            sectionBase={sectionBase}
            sectionActive={sectionActive}
          />

          {/* NEW WHY-US SECTION */}
          <WhyUs
            mounted={mounted}
            sectionBase={sectionBase}
            sectionActive={sectionActive}
          />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
            <div
              className={`${sectionBase} ${mounted ? sectionActive : ""
                } w-full text-center mt-10`}
              style={{ transitionDelay: "350ms" }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-[#7A1F1F] sanchez-regular">
                Meet Our Leadership Team
              </h2>
              <TeamCarousel3D members={TEAM_MEMBERS} />
            </div>
          </div>

          <CoreValues
            mounted={mounted}
            sectionBase={sectionBase}
            sectionActive={sectionActive}
          />

          {/* <JourneyTimeline
            mounted={mounted}
            sectionBase={sectionBase}
            sectionActive={sectionActive}
          /> */}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default About;