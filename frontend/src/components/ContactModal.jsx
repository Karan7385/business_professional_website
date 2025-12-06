import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  memo,
} from "react";
import axios from "axios";

// 🔸 Replace these with your real API endpoints
const CATEGORY_API_URL = "http://localhost:3000/api/products/get-categories";
const PRODUCT_API_URL = "http://localhost:3000/api/products/get-products";

function ContactModalBase({ isOpen, onClose, onSubmit, logoSrc }) {
  const [formValues, setFormValues] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
    countryCode: "",
    categories: [], // stores IDs
    products: [],   // stores IDs
  });

  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // ✅ Country code dropdown state
  const [countryCodes, setCountryCodes] = useState([]);
  const [isCodeDropdownOpen, setIsCodeDropdownOpen] = useState(false);
  const [codeSearch, setCodeSearch] = useState("");

  // ✅ Category & Product options from server
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);

  // ✅ Dropdown state for categories/products
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [productSearch, setProductSearch] = useState("");

  // ✅ Fetch country codes from public API once
  useEffect(() => {
    const fetchCountryCodes = async () => {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=idd,name"
        );
        const data = await res.json();

        const parsed = data
          .map((c) => {
            const root = c.idd?.root;
            const suffix = c.idd?.suffixes?.[0] || "";
            if (!root) return null;

            return {
              name: c.name?.common || "",
              dialCode: `${root}${suffix}`,
            };
          })
          .filter(Boolean)
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountryCodes(parsed);
      } catch (err) {
        console.error("Failed to fetch country codes", err);
      }
    };

    fetchCountryCodes();
  }, []);

  // ✅ Fetch categories from server
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(CATEGORY_API_URL);
        const data = res.data.data;

        // Expecting: [{ id, category }, ...]
        const parsed = (Array.isArray(data) ? data : []).map(
          (item, index) => ({
            id: item.id ?? item._id ?? String(index),
            label: item.category ?? item.label ?? `Category ${index + 1}`,
          })
        );

        // Sort alphabetically
        parsed.sort((a, b) => a.label.localeCompare(b.label));

        setCategoryOptions(parsed);
      } catch (err) {
        console.error("Failed to fetch categories", err);
        setCategoryOptions([]);
      }
    };

    fetchCategories();
  }, []);

  // ✅ Fetch products from server
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(PRODUCT_API_URL);
        const data = res.data.data;

        // Expecting: [{ id, name }, ...]
        const parsed = (Array.isArray(data) ? data : []).map(
          (item, index) => ({
            id: item.id ?? item._id ?? String(index),
            label: item.name ?? item.label ?? `Product ${index + 1}`,
          })
        );

        // Sort alphabetically
        parsed.sort((a, b) => a.label.localeCompare(b.label));

        setProductOptions(parsed);
      } catch (err) {
        console.error("Failed to fetch products", err);
        setProductOptions([]);
      }
    };

    fetchProducts();
  }, []);

  // Reset when closed
  useEffect(() => {
    if (!isOpen) {
      setFormValues({
        name: "",
        company: "",
        email: "",
        phone: "",
        message: "",
        countryCode: "",
        categories: [],
        products: [],
      });
      setTouched({});
      setIsSubmitting(false);
      setSubmitError("");
      setIsCodeDropdownOpen(false);
      setCodeSearch("");
      setIsCategoryOpen(false);
      setIsProductOpen(false);
      setCategorySearch("");
      setProductSearch("");
    }
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  // ✅ Multi-select toggles
  const toggleCategory = useCallback((id) => {
    setFormValues((prev) => {
      const exists = prev.categories.includes(id);
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((x) => x !== id)
          : [...prev.categories, id],
      };
    });
    setTouched((prev) => ({ ...prev, categories: true }));
  }, []);

  const toggleProduct = useCallback((id) => {
    setFormValues((prev) => {
      const exists = prev.products.includes(id);
      return {
        ...prev,
        products: exists
          ? prev.products.filter((x) => x !== id)
          : [...prev.products, id],
      };
    });
    setTouched((prev) => ({ ...prev, products: true }));
  }, []);

  // ✅ Filtered country codes based on search query
  const filteredCountryCodes = useMemo(() => {
    if (!codeSearch.trim()) return countryCodes;
    const q = codeSearch.toLowerCase();
    return countryCodes.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.toLowerCase().includes(q)
    );
  }, [countryCodes, codeSearch]);

  // ✅ Filtered category / product options (for dropdown search)
  const filteredCategoryOptions = useMemo(() => {
    if (!categorySearch.trim()) return categoryOptions;
    const q = categorySearch.toLowerCase();
    return categoryOptions.filter((c) =>
      c.label.toLowerCase().includes(q)
    );
  }, [categoryOptions, categorySearch]);

  const filteredProductOptions = useMemo(() => {
    if (!productSearch.trim()) return productOptions;
    const q = productSearch.toLowerCase();
    return productOptions.filter((p) =>
      p.label.toLowerCase().includes(q)
    );
  }, [productOptions, productSearch]);

  const errors = useMemo(() => {
    const newErrors = {};

    if (!formValues.name.trim()) {
      newErrors.name = "Full name is required.";
    }

    if (!formValues.email.trim()) {
      newErrors.email = "Email address is required.";
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formValues.email.trim())) {
        newErrors.email = "Please enter a valid email address.";
      }
    }

    if (!formValues.message.trim()) {
      newErrors.message = "Please add a brief message.";
    } else if (formValues.message.trim().length < 10) {
      newErrors.message = "Message should be at least 10 characters long.";
    }

    // Optional: basic phone validation (if provided)
    if (formValues.phone.trim()) {
      const phoneDigits = formValues.phone.replace(/[^\d+]/g, "");
      if (phoneDigits.length < 7) {
        newErrors.phone = "Please enter a valid phone / WhatsApp number.";
      }
      if (!formValues.countryCode.trim()) {
        newErrors.countryCode = "Please select a country code.";
      }
    }

    // Enforce at least one category / product
    if (formValues.categories.length === 0) {
      newErrors.categories = "Select at least one category.";
    }
    if (formValues.products.length === 0) {
      newErrors.products = "Select at least one product.";
    }

    return newErrors;
  }, [formValues]);

  const isFormValid = useMemo(
    () => Object.keys(errors).length === 0,
    [errors]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setTouched({
        name: true,
        email: true,
        phone: true,
        message: true,
        countryCode: true,
        categories: true,
        products: true,
      });
      setSubmitError("");

      if (!isFormValid) return;

      try {
        setIsSubmitting(true);

        // 👉 Convert selected IDs to NAMES here
        const selectedCategoryNames = categoryOptions
          .filter((cat) => formValues.categories.includes(cat.id))
          .map((cat) => cat.label);

        const selectedProductNames = productOptions
          .filter((prod) => formValues.products.includes(prod.id))
          .map((prod) => prod.label);

        const payload = {
          name: formValues.name.trim(),
          company: formValues.company.trim(),
          email: formValues.email.trim(),
          country_code: formValues.countryCode.trim(),
          phone: formValues.phone.trim(),
          message: formValues.message.trim(),
          // ✅ send names instead of IDs
          categories: selectedCategoryNames,
          products: selectedProductNames,
        };

        if (onSubmit) {
          await onSubmit(payload);
        } else {
          console.log("Contact form payload:", payload);
        }

        onClose?.();
      } catch (err) {
        console.error(err);
        setSubmitError(
          "Something went wrong while sending your message. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      formValues,
      isFormValid,
      onSubmit,
      onClose,
      categoryOptions, // ✅ included so mapping uses fresh options
      productOptions,
    ]
  );

  if (!isOpen) return null;

  const MAROON = "#7A1F1F";

  return (
    <>
      {/* Local animations for this modal only */}
      <style>
        {`
          @keyframes fadeInOverlay {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleInCard {
            from { opacity: 0; transform: translateY(16px) scale(0.96); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}
      </style>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 sm:px-6"
        style={{ animation: "fadeInOverlay 0.25s ease-out" }}
        onClick={onClose}
        aria-modal="true"
        role="dialog"
        aria-labelledby="contact-modal-title"
      >
        <div
          className="
            relative w-full max-w-xl
            rounded-3xl
            bg-linear-to-br from-white via-[#FFF7E3] to-[#FDEFC2]
            shadow-[0_24px_70px_rgba(0,0,0,0.35)]
            border border-[#F3DFC4]
            overflow-hidden
            max-h-[90vh]
            flex flex-col
          "
          style={{ animation: "scaleInCard 0.3s cubic-bezier(0.16,1,0.3,1)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Soft subtle highlight background */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-[#EAC97C]/25 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-[#7A1F1F]/5 blur-3xl" />
          </div>

          {/* Top Bar with logo and close */}
          <div className="relative z-10 flex items-center justify-between px-5 sm:px-6 pt-4 sm:pt-5 shrink-0">
            <div className="flex items-center gap-3">
              {logoSrc && (
                <div className="rounded-2xl bg-white/80 border border-[#F4DEC3] shadow-md p-1.5">
                  <img
                    src={logoSrc}
                    alt="PT INDO Business Exports Logo"
                    loading="lazy"
                    decoding="async"
                    className="w-9 h-9 sm:w-11 sm:h-11 object-contain"
                  />
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-[11px] tracking-[0.16em] uppercase text-[#B2501F] unbounded-subHeading">
                  Contact
                </span>
                <h2
                  id="contact-modal-title"
                  className="text-lg sm:text-xl font-extrabold tracking-tight unbounded-heading"
                  style={{ color: MAROON }}
                >
                  PT INDO BUSINESS EXPORTS
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="
                inline-flex items-center justify-center
                w-9 h-9 sm:w-10 sm:h-10
                rounded-2xl bg-white/80
                text-[#7A1F1F]
                border border-[#F4DEC3]
                hover:bg-white
                hover:shadow-md
                transition-all duration-200
              "
              aria-label="Close contact form"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Scrollable content */}
          <div className="relative z-10 px-5 sm:px-6 pb-5 sm:pb-6 pt-2 overflow-y-auto">
            {/* Intro */}
            <p className="mt-2 text-xs sm:text-sm text-[#5C4234] sanchez-regular">
              Share your requirements for{" "}
              <span className="font-semibold">
                spices, herbs, gums or agro commodities
              </span>{" "}
              and our team will respond with pricing, specifications and
              shipment options.
            </p>

            {/* Form */}
            <form
              className="mt-4 sm:mt-5 space-y-3 sm:space-y-4"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#6B4B3A] mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={formValues.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="
                      w-full rounded-xl border border-[#EED8C0] bg-white/80
                      px-3 py-2 text-xs sm:text-sm text-[#3A211F]
                      placeholder:text-[#B89B7A]
                      focus:outline-none focus:ring-2 focus:ring-[#EAC97C] focus:border-transparent
                    "
                    placeholder="Your full name"
                  />
                  {touched.name && errors.name && (
                    <p className="mt-1 text-[11px] text-[#B2501F]">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Company */}
                <div>
                  <label className="block text-xs font-semibold text-[#6B4B3A] mb-1">
                    Company / Organisation
                  </label>
                  <input
                    type="text"
                    name="company"
                    autoComplete="organization"
                    value={formValues.company}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="
                      w-full rounded-xl border border-[#EED8C0] bg-white/80
                      px-3 py-2 text-xs sm:text-sm text-[#3A211F]
                      placeholder:text-[#B89B7A]
                      focus:outline-none focus:ring-2 focus:ring-[#EAC97C] focus:border-transparent
                    "
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-[#6B4B3A] mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={formValues.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="
                      w-full rounded-xl border border-[#EED8C0] bg-white/80
                      px-3 py-2 text-xs sm:text-sm text-[#3A211F]
                      placeholder:text-[#B89B7A]
                      focus:outline-none focus:ring-2 focus:ring-[#EAC97C] focus:border-transparent
                    "
                    placeholder="you@company.com"
                  />
                  {touched.email && errors.email && (
                    <p className="mt-1 text-[11px] text-[#B2501F]">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone / WhatsApp with country code dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-[#6B4B3A] mb-1">
                    Phone / WhatsApp
                  </label>

                  <div className="flex flex-col sm:flex-row gap-2">
                    {/* Country Code Dropdown */}
                    <div className="relative w-full sm:w-32">
                      <button
                        type="button"
                        onClick={() =>
                          setIsCodeDropdownOpen((prev) => !prev)
                        }
                        className="
                          flex w-full items-center justify-between
                          rounded-xl border border-[#EED8C0] bg-white/80
                          px-3 py-2 text-xs sm:text-sm text-[#3A211F]
                          focus:outline-none focus:ring-2 focus:ring-[#EAC97C] focus:border-transparent
                        "
                      >
                        <span className="truncate">
                          {formValues.countryCode || "+Code"}
                        </span>
                        <span className="ml-2 text-[10px] sm:text-xs text-[#B89B7A]">
                          ▾
                        </span>
                      </button>

                      {isCodeDropdownOpen && (
                        <div
                          className="
                            absolute z-20 mt-1 w-full sm:w-64 rounded-xl border border-[#EED8C0]
                            bg-white shadow-lg
                          "
                        >
                          {/* Search bar for code / name */}
                          <div className="p-2 border-b border-[#F3E4D2]">
                            <input
                              type="text"
                              value={codeSearch}
                              onChange={(e) =>
                                setCodeSearch(e.target.value)
                              }
                              className="
                                w-full rounded-lg border border-[#EED8C0]
                                px-2 py-1 text-xs text-[#3A211F]
                                placeholder:text-[#B89B7A]
                                focus:outline-none focus:ring-1 focus:ring-[#EAC97C] focus:border-transparent
                              "
                              placeholder="Search country or code"
                            />
                          </div>

                          <ul className="max-h-52 overflow-y-auto text-xs sm:text-sm">
                            {filteredCountryCodes.map((c) => (
                              <li key={`${c.name}-${c.dialCode}`}>
                                <button
                                  type="button"
                                  onMouseDown={(e) =>
                                    e.preventDefault()
                                  }
                                  onClick={() => {
                                    setFormValues((prev) => ({
                                      ...prev,
                                      countryCode: c.dialCode,
                                    }));
                                    setTouched((prev) => ({
                                      ...prev,
                                      countryCode: true,
                                    }));
                                    setIsCodeDropdownOpen(false);
                                  }}
                                  className="
                                    flex w-full items-center justify-between
                                    px-3 py-2 text-left hover:bg-[#FFF7EC]
                                  "
                                >
                                  <span className="flex-1 truncate">
                                    {c.name}
                                  </span>
                                  <span className="ml-2 text-[#6B4B3A]">
                                    {c.dialCode}
                                  </span>
                                </button>
                              </li>
                            ))}
                            {filteredCountryCodes.length === 0 && (
                              <li className="px-3 py-2 text-xs text-[#B89B7A]">
                                No matches found
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Phone Number */}
                    <input
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      value={formValues.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="
                        flex-1 rounded-xl border border-[#EED8C0] bg-white/80
                        px-3 py-2 text-xs sm:text-sm text-[#3A211F]
                        placeholder:text-[#B89B7A]
                        focus:outline-none focus:ring-2 focus:ring-[#EAC97C] focus:border-transparent
                      "
                      placeholder="9XXXXXXXXX"
                    />
                  </div>

                  {(touched.phone && errors.phone) ||
                  (touched.countryCode && errors.countryCode) ? (
                    <p className="mt-1 text-[11px] text-[#B2501F]">
                      {errors.countryCode || errors.phone}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* ✅ Category – multi-select dropdown */}
              <div>
                <label className="block text-xs font-semibold text-[#6B4B3A] mb-1">
                  Categories
                </label>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setIsCategoryOpen((prev) => !prev)
                    }
                    className="
                      flex w-full items-center justify-between
                      rounded-xl border border-[#EED8C0] bg-white/80
                      px-3 py-2 text-xs sm:text-sm text-[#3A211F]
                      focus:outline-none focus:ring-2 focus:ring-[#EAC97C] focus:border-transparent
                    "
                  >
                    <span className="truncate text-left">
                      {formValues.categories.length === 0
                        ? "Select categories"
                        : `${formValues.categories.length} selected`}
                    </span>
                    <span className="ml-2 text-[10px] sm:text-xs text-[#B89B7A]">
                      ▾
                    </span>
                  </button>

                  {isCategoryOpen && (
                    <div
                      className="
                        absolute z-20 mt-1 w-full rounded-2xl border border-[#EED8C0]
                        bg-white shadow-lg
                      "
                    >
                      {/* Search inside dropdown */}
                      <div className="p-2 border-b border-[#F3E4D2]">
                        <input
                          type="text"
                          value={categorySearch}
                          onChange={(e) =>
                            setCategorySearch(e.target.value)
                          }
                          className="
                            w-full rounded-lg border border-[#EED8C0]
                            px-2 py-1 text-xs text-[#3A211F]
                            placeholder:text-[#B89B7A]
                            focus:outline-none focus:ring-1 focus:ring-[#EAC97C] focus:border-transparent
                          "
                          placeholder="Search categories"
                        />
                      </div>

                      <div className="max-h-56 overflow-y-auto text-xs sm:text-sm">
                        {filteredCategoryOptions.length === 0 ? (
                          <p className="px-3 py-2 text-[11px] text-[#B89B7A]">
                            No categories found
                          </p>
                        ) : (
                          filteredCategoryOptions.map((cat) => {
                            // ✅ FIXED: use cat.id instead of cat.category
                            const isSelected =
                              formValues.categories.includes(cat.id);
                            return (
                              <button
                                key={cat.id}
                                type="button"
                                onMouseDown={(e) =>
                                  e.preventDefault()
                                }
                                onClick={() => toggleCategory(cat.id)}
                                className={`
                                  flex w-full items-center justify-between
                                  px-3 py-2 text-left
                                  hover:bg-[#FFF7EC]
                                `}
                              >
                                <span className="flex items-center gap-2">
                                  <span
                                    className={`
                                      inline-flex h-3 w-3 items-center justify-center rounded-[4px] border
                                      ${
                                        isSelected
                                          ? "border-[#7A1F1F] bg-[#7A1F1F]"
                                          : "border-[#D9C7A8] bg-white"
                                      }
                                    `}
                                  >
                                    {isSelected && (
                                      <span className="block h-1.5 w-1.5 bg-white rounded-[2px]" />
                                    )}
                                  </span>
                                  <span className="truncate text-[#3A211F]">
                                    {cat.label}
                                  </span>
                                </span>
                                {isSelected && (
                                  <span className="text-[10px] text-[#7A1F1F]">
                                    Selected
                                  </span>
                                )}
                              </button>
                            );
                          })
                        )}
                      </div>

                      {/* Footer inside dropdown: Clear / Done */}
                      <div className="flex items-center justify-between px-3 py-2 border-t border-[#F3E4D2] bg-[#FFF9ED]">
                        <button
                          type="button"
                          onClick={() => {
                            setFormValues((prev) => ({
                              ...prev,
                              categories: [],
                            }));
                            setTouched((prev) => ({
                              ...prev,
                              categories: true,
                            }));
                          }}
                          className="text-[11px] text-[#B2501F]"
                        >
                          Clear
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsCategoryOpen(false)}
                          className="text-[11px] font-semibold text-[#7A1F1F]"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Selected chips under dropdown */}
                {formValues.categories.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formValues.categories.map((id) => {
                      const cat = categoryOptions.find((c) => c.id === id);
                      if (!cat) return null;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => toggleCategory(id)}
                          className="
                            inline-flex items-center gap-1
                            rounded-full bg-[#7A1F1F]/10 text-[#7A1F1F]
                            px-3 py-1 text-[11px] border border-[#7A1F1F]/20
                            hover:bg-[#7A1F1F]/15 transition
                          "
                        >
                          <span>{cat.label}</span>
                          <span className="text-[10px]">✕</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {touched.categories && errors.categories && (
                  <p className="mt-1 text-[11px] text-[#B2501F]">
                    {errors.categories}
                  </p>
                )}
              </div>

              {/* ✅ Products – multi-select dropdown */}
              <div>
                <label className="block text-xs font-semibold text-[#6B4B3A] mb-1">
                  Products
                </label>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setIsProductOpen((prev) => !prev)
                    }
                    className="
                      flex w-full items-center justify-between
                      rounded-xl border border-[#EED8C0] bg-white/80
                      px-3 py-2 text-xs sm:text-sm text-[#3A211F]
                      focus:outline-none focus:ring-2 focus:ring-[#EAC97C] focus:border-transparent
                    "
                  >
                    <span className="truncate text-left">
                      {formValues.products.length === 0
                        ? "Select products"
                        : `${formValues.products.length} selected`}
                    </span>
                    <span className="ml-2 text-[10px] sm:text-xs text-[#B89B7A]">
                      ▾
                    </span>
                  </button>

                  {isProductOpen && (
                    <div
                      className="
                        absolute z-20 mt-1 w-full rounded-2xl border border-[#EED8C0]
                        bg-white shadow-lg
                      "
                    >
                      {/* Search inside dropdown */}
                      <div className="p-2 border-b border-[#F3E4D2]">
                        <input
                          type="text"
                          value={productSearch}
                          onChange={(e) =>
                            setProductSearch(e.target.value)
                          }
                          className="
                            w-full rounded-lg border border-[#EED8C0]
                            px-2 py-1 text-xs text-[#3A211F]
                            placeholder:text-[#B89B7A]
                            focus:outline-none focus:ring-1 focus:ring-[#EAC97C] focus:border-transparent
                          "
                          placeholder="Search products"
                        />
                      </div>

                      <div className="max-h-56 overflow-y-auto text-xs sm:text-sm">
                        {filteredProductOptions.length === 0 ? (
                          <p className="px-3 py-2 text-[11px] text-[#B89B7A]">
                            No products found
                          </p>
                        ) : (
                          filteredProductOptions.map((prod) => {
                            const isSelected =
                              formValues.products.includes(prod.id);
                            return (
                              <button
                                key={prod.id}
                                type="button"
                                onMouseDown={(e) =>
                                  e.preventDefault()
                                }
                                onClick={() => toggleProduct(prod.id)}
                                className="
                                  flex w-full items-center justify-between
                                  px-3 py-2 text-left hover:bg-[#FFF7EC]
                                "
                              >
                                <span className="flex items-center gap-2">
                                  <span
                                    className={`
                                      inline-flex h-3 w-3 items-center justify-center rounded-[4px] border
                                      ${
                                        isSelected
                                          ? "border-[#7A1F1F] bg-[#7A1F1F]"
                                          : "border-[#D9C7A8] bg-white"
                                      }
                                    `}
                                  >
                                    {isSelected && (
                                      <span className="block h-1.5 w-1.5 bg-white rounded-[2px]" />
                                    )}
                                  </span>
                                  <span className="truncate text-[#3A211F]">
                                    {prod.label}
                                  </span>
                                </span>
                                {isSelected && (
                                  <span className="text-[10px] text-[#7A1F1F]">
                                    Selected
                                  </span>
                                )}
                              </button>
                            );
                          })
                        )}
                      </div>

                      {/* Footer inside dropdown: Clear / Done */}
                      <div className="flex items-center justify-between px-3 py-2 border-t border-[#F3E4D2] bg-[#FFF9ED]">
                        <button
                          type="button"
                          onClick={() => {
                            setFormValues((prev) => ({
                              ...prev,
                              products: [],
                            }));
                            setTouched((prev) => ({
                              ...prev,
                              products: true,
                            }));
                          }}
                          className="text-[11px] text-[#B2501F]"
                        >
                          Clear
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsProductOpen(false)}
                          className="text-[11px] font-semibold text-[#7A1F1F]"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Selected chips under dropdown */}
                {formValues.products.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formValues.products.map((id) => {
                      const product = productOptions.find((p) => p.id === id);
                      if (!product) return null;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => toggleProduct(id)}
                          className="
                            inline-flex items-center gap-1
                            rounded-full bg-[#7A1F1F]/10 text-[#7A1F1F]
                            px-3 py-1 text-[11px] border border-[#7A1F1F]/20
                            hover:bg-[#7A1F1F]/15 transition
                          "
                        >
                          <span>{product.label}</span>
                          <span className="text-[10px]">✕</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {touched.products && errors.products && (
                  <p className="mt-1 text-[11px] text-[#B2501F]">
                    {errors.products}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-[#6B4B3A] mb-1">
                  Message / Requirements{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formValues.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={4}
                  className="
                    w-full rounded-xl border border-[#EED8C0] bg-white/80
                    px-3 py-2 text-xs sm:text-sm text-[#3A211F]
                    placeholder:text-[#B89B7A]
                    focus:outline-none focus:ring-2 focus:ring-[#EAC97C] focus:border-transparent
                    resize-none
                  "
                  placeholder="Share product names, volumes, target ports, preferred packing and any certification requirements."
                />
                {touched.message && errors.message && (
                  <p className="mt-1 text-[11px] text-[#B2501F]">
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Error message */}
              {submitError && (
                <p className="text-[11px] text-[#B2501F] bg-[#FFF1E6] border border-[#F4B89A] rounded-lg px-3 py-2">
                  {submitError}
                </p>
              )}

              {/* Footer actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                <p className="text-[11px] text-[#6B4B3A] max-w-xs">
                  We typically respond within{" "}
                  <span className="font-semibold">1–2 business days</span> with
                  detailed specs and pricing.
                </p>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="
                      px-4 py-2 rounded-full text-xs sm:text-sm font-medium
                      bg-white/80 text-[#7A1F1F]
                      border border-[#EED8C0]
                      hover:bg:white
                      transition-colors duration-200
                    "
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !isFormValid}
                    className={`
                      inline-flex items-center justify-center
                      px-4 sm:px-5 py-2
                      rounded-full text-xs sm:text-sm font-semibold
                      shadow-md hover:shadow-lg
                      transition-all duration-200
                      ${
                        isSubmitting || !isFormValid
                          ? "bg-[#F5E1B8] text-[#7A1F1F]/60 cursor-not-allowed"
                          : "bg-[#EAC97C] text-[#7A1F1F] hover:bg-[#F4D489] hover:-translate-y-0.5"
                      }
                    `}
                  >
                    {isSubmitting ? "Sending…" : "Send Enquiry"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

const ContactModal = memo(ContactModalBase);
export default ContactModal;