import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import {
  PRODUCTS,
  SPICE_PAGE_COPY,
  SPICE_THEME,
} from "../../data/productConfig";

import ProductCard from "../../components/products/ProductCard";
import ProductDetailsSheet from "../../components/products/ProductDetailsSheet";
import ProductFiltersBar from "../../components/products/ProductFiltersBar";

const { primary, backgroundClasses } = SPICE_THEME;

function Product({ products = PRODUCTS }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name-asc");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  /* --------------------------------------------------
     ✅ HYDRATE STATE FROM URL
     -------------------------------------------------- */
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    const productFromUrl = searchParams.get("product");

    if (categoryFromUrl) {
      setCategoryFilter(categoryFromUrl);
    }

    if (productFromUrl) {
      setSearch(decodeURIComponent(productFromUrl));
    }
  }, [searchParams]);

  /* --------------------------------------------------
     Simulate loading (replace with real API later)
     -------------------------------------------------- */
  useEffect(() => {
    setIsLoading(false);
  }, [products]);

  /* --------------------------------------------------
     Categories
     -------------------------------------------------- */
  const categories = useMemo(() => {
    if (!products || products.length === 0) return ["All"];

    const set = new Set(
      products
        .map((p) => p.category)
        .filter(Boolean)
    );

    return ["All", ...Array.from(set)];
  }, [products]);

  /* --------------------------------------------------
     Filtering + Searching + Sorting
     -------------------------------------------------- */
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    let data = [...products];

    if (search.trim()) {
      const query = search.toLowerCase();
      data = data.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const category = (p.category || "").toLowerCase();
        const description = (p.description || "").toLowerCase();

        return (
          name.includes(query) ||
          category.includes(query) ||
          description.includes(query)
        );
      });
    }

    if (categoryFilter !== "All") {
      data = data.filter((p) => p.category === categoryFilter);
    }

    switch (sortBy) {
      case "name-desc":
        data.sort((a, b) =>
          (b.name || "").localeCompare(a.name || "")
        );
        break;
      case "origin-asc":
        data.sort((a, b) =>
          (a.origin || "").localeCompare(b.origin || "")
        );
        break;
      case "origin-desc":
        data.sort((a, b) =>
          (b.origin || "").localeCompare(a.origin || "")
        );
        break;
      case "name-asc":
      default:
        data.sort((a, b) =>
          (a.name || "").localeCompare(b.name || "")
        );
        break;
    }

    return data;
  }, [products, search, categoryFilter, sortBy]);

  /* --------------------------------------------------
     Handlers
     -------------------------------------------------- */
  const handleViewDetails = useCallback((product) => {
    setSelectedProduct(product);
    setIsSheetOpen(true);
  }, []);

  const handleCloseSheet = useCallback(() => {
    setIsSheetOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  }, []);

  /* Optional: clear URL params when user changes filters */
  const handleSearchChange = (value) => {
    setSearch(value);
    navigate("/products", { replace: true });
  };

  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
    navigate("/products", { replace: true });
  };

  return (
    <>
      <main className={backgroundClasses}>
        <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-10 md:pt-20 pb-14">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#B2501F] mb-1">
                {SPICE_PAGE_COPY.eyebrow}
              </p>
              <h1
                className="text-3xl md:text-4xl font-extrabold tracking-tight sanchez-regular"
                style={{ color: primary }}
              >
                {SPICE_PAGE_COPY.title}
              </h1>
              <p className="mt-2 text-sm md:text-base text-[#4B2B2B] max-w-xl">
                {SPICE_PAGE_COPY.description}
              </p>
            </div>

            <ProductFiltersBar
              search={search}
              onSearchChange={handleSearchChange}
              categoryFilter={categoryFilter}
              onCategoryChange={handleCategoryChange}
              sortBy={sortBy}
              onSortChange={setSortBy}
              categories={categories}
              totalCount={products?.length || 0}
              filteredCount={filteredProducts.length}
            />
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white/80 border border-[#F3DFC4] shadow-sm animate-pulse"
                >
                  <div className="h-40 bg-[#F7E7CC]" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-[#F3DFC4] rounded-full w-2/3" />
                    <div className="h-3 bg-[#F3DFC4] rounded-full w-full" />
                    <div className="h-3 bg-[#F3DFC4] rounded-full w-5/6" />
                    <div className="h-8 bg-[#F3DFC4] rounded-full w-1/2 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && !isLoading && (
            <div className="text-center py-10 text-[#B2501F] bg-[#FFF1E6] border border-[#F4B89A] rounded-2xl max-w-xl mx-auto">
              {error}
            </div>
          )}

          {/* Grid */}
          {!isLoading && !error && (
            <>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-10 text-[#6B4B3A]">
                  No products matched your search.
                </div>
              ) : (
                <div>
                  {filteredProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                      onView={handleViewDetails}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        <ProductDetailsSheet
          product={selectedProduct}
          isOpen={isSheetOpen}
          onClose={handleCloseSheet}
        />
      </main>

      <Footer />
    </>
  );
}

export default Product;