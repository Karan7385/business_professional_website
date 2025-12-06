import { use, useEffect, useState } from "react";
import axios from "axios";

// ================================= IMPORT COMPONENTS =============================================================

import Navbar from "../../components/Navbar.jsx";
import Carousel from "../../components/home/Carousel.jsx";
import About from "../../components/home/About.jsx";
import Footer from "../../components/Footer.jsx";
import { Tab } from "../../components/home/Tab.jsx";
import Jumbotron from "../../components/home/Jumbotron.jsx";
import ProductVerticalSlider from "../../components/home/ProductVerticalSlider.jsx";
import CertificateSlider from "../../components/home/CertificateSlider.jsx";
import LogoLoader from "../../components/LogoLoader";

import { toast, Toaster } from "react-hot-toast";

// ================================= ANIMATED DIV ============================================================

function AnimatedSection({ children, mounted, delayMs }) {
  const base = "transform transition-all duration-700 ease-out opacity-0 translate-y-6";
  const active = "opacity-100 translate-y-0";

  return (
    <div
      className={`${base} ${mounted ? active : ""}`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}

// ================================= HOME ============================================================

function Home() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [jumbotronData, setJumbotronData] = useState([]);
  const [carouselData, setCarouselData] = useState([]);
  const [tabData, setTabData] = useState({});
  const [productData, setProductData] = useState([]);
  const [certificateData, setCertificateData] = useState([]);

  const BASE_SERVER_URL = "http://localhost:3000";

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [jumbotronRes, carouselRes, tabRes, productRes, certificateRes] = await Promise.all([
          axios.get(`${BASE_SERVER_URL}/api/home/jumbotron`),
          axios.get(`${BASE_SERVER_URL}/api/home/carousel`),
          axios.get(`${BASE_SERVER_URL}/api/home/tabs`),
          axios.get(`${BASE_SERVER_URL}/api/products`),
          axios.get(`${BASE_SERVER_URL}/api/certs`),
        ]);

        // Assuming your API shape is { data: [...] }
        setJumbotronData(jumbotronRes.data.data);
        setCarouselData(carouselRes.data.data);
        setTabData(tabRes.data.data);
        setProductData(productRes.data.data)
        setCertificateData(certificateRes.data.data)
        
      } catch (error) {
        toast.error("Error fetching home data:");
      } finally {
        setIsLoading(false);
        setMounted(true);
      }
    };

    fetchHomeData();
  }, []);

  const sections = [
    {
      id: "jumbotron",
      delay: 80,
      render: () => <Jumbotron data={jumbotronData}/>
    },
    {
      id: "carousel",
      delay: 160,
      render: () => <Carousel data={carouselData}/>
    },
    {
      id: "about",
      delay: 240,
      render: () => <About />,
    },
    {
      id: "products",
      delay: 320,
      render: () => <ProductVerticalSlider data={productData} />,
    },
    {
      id: "tabs",
      delay: 400,
      render: () => <Tab data={tabData}/>
    },
    {
      id: "certificates",
      delay: 480,
      render: () => <CertificateSlider data={certificateData}/>,
    },
  ];

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 8000 }} />

      {isLoading ? (
        <LogoLoader />
      ) : (
        <div className="bg-linear-to-br from-orange-50 via-orange-50 to-slate-100">
          <Navbar />

          {sections.map(({ id, delay, render }) => (
            <AnimatedSection key={id} mounted={mounted} delayMs={delay}>
              {render()}
            </AnimatedSection>
          ))}

          <Footer />
        </div>
      )}
    </>
  );
}

export default Home;