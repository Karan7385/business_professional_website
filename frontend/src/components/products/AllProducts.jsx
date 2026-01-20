import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import Footer from "../../components/Footer.jsx";
import ProductCard from "../../components/products/ProductCard.jsx";

export default function AllProducts({ products = [] }) {
  const BASE_SERVER_URL = import.meta.env.VITE_BASE_SERVER_URL;

  const [preferences, setPreferences] = useState([]);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const res = await axios.get(
          `${BASE_SERVER_URL}/api/preferences`
        );
        setPreferences(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch preferences", error);
      }
    };

    fetchPreferences();
  }, []);
  
  const preferenceMap = useMemo(() => {
    const map = new Map();
    preferences.forEach((p) => {      
      map.set(p.id, p.priority);
    });
    return map;
  }, [preferences]);
  
  const categorizedProducts = useMemo(() => {
    const grouped = products.reduce((acc, product) => {
      
      const category = product.category;
      if (!category) return acc;

      if (!acc[category]) {
        acc[category] = {
          label: category,
          featured: [],
          rest: [],
        };
      }

      // if (product.grade?.toLowerCase().includes("export")) {
      //   acc[category].featured.push(product);
      // } else {
        acc[category].rest.push(product);
      // }

      return acc;
    }, {});

    Object.values(grouped).forEach((category) => {
      const sortByPriority = (a, b) => {
        const aPriority =
          preferenceMap.get(a.id) ?? Number.MAX_SAFE_INTEGER;
        const bPriority =
          preferenceMap.get(b.id) ?? Number.MAX_SAFE_INTEGER;

        return aPriority - bPriority;
      };

      // category.featured.sort(sortByPriority);
      category.rest.sort(sortByPriority);
    });

    return grouped;
  }, [products, preferenceMap]);

  console.log(categorizedProducts);
  

  /* -----------------------------
     Tabs
  -------------------------------- */
  const tabs = useMemo(() => {
    return Object.keys(categorizedProducts).map((category) => ({
      id: category,
      label: category,
    }));
  }, [categorizedProducts]);

  /* -----------------------------
     Active Tab
  -------------------------------- */
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    if (!tabs.length) return;

    const defaultTab =
      tabs.find((tab) => tab.id === "SPICE")?.id || tabs[0].id;

    setActiveTab(defaultTab);
  }, [tabs]);

  const activeCategoryData = categorizedProducts[activeTab];

  return (
    <div className="bg-linear-to-br from-amber-50 via-amber-100 to-amber-50 rounded-lg shadow-sm">
      <section className="max-w-7xl mx-auto px-4 py-10">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-heading sanchez-regular">
            Our Products
          </h1>
          <p className="mt-2 text-body text-sm unbounded-subHeading">
            Explore our premium quality natural products
          </p>
        </div>

        {/* Tabs */}
        {tabs.length > 0 && (
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-full bg-neutral-secondary-soft p-1 shadow-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-2 text-sm font-medium rounded-full transition-all sanchez-regular
                    ${activeTab === tab.id
                      ? "bg-linear-to-br from-amber-200 via-amber-100 to-amber-200 text-amber-950 shadow"
                      : "text-body hover:text-heading"
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        {activeCategoryData && (
          <TabContent
            title={activeCategoryData.label}
            featured={activeCategoryData.featured}
            rest={activeCategoryData.rest}
          />
        )}
      </section>

      <Footer />
    </div>
  );
}

/* --------------------------------
   Tab Content Component
--------------------------------- */
function TabContent({ title, featured, rest }) {
  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-semibold text-heading mb-6 unbounded-subHeading">
        {title}
      </h2>

      {/* Featured Products */}
      {/* {featured.length > 0 && (
        <>
          <h3 className="text-sm font-semibold text-body mb-4 uppercase">
            Featured Products
          </h3>

          <div className="grid grid-cols-1 gap-6 mb-10">
            {featured.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </div>
        </>
      )} */}

      {/* Remaining Products */}
      {rest.length > 0 ? (
        <>
          {/* {featured.length > 0 && (
            <h3 className="text-sm font-semibold text-body mb-4 uppercase">
              More Products
            </h3>
          )} */}

          <div className="grid grid-cols-1 gap-6">
            {rest.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </div>
        </>
      ) : (
        featured.length === 0 && (
          <div className="text-center py-12 text-body text-sm">
            No products available in this category.
          </div>
        )
      )}
    </div>
  );
}