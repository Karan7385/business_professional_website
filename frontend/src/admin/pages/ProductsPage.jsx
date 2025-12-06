import React, { useEffect, useState, useMemo } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Image as ImageIcon,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

// =================================== CONSTANTS ========================================

const BASE_SERVER_URL = "http://localhost:3000";

// =================================== CONSTANTS ========================================

// ======================== Initial state for the product form ===================================

const initialFormState = {
  id: null,
  name: "",
  category: "",
  origin: "",
  grade: "",
  moisture: "",
  min_order_qty: "",
  description: "",
  packaging: "", // comma-separated values, stored as JSON array on backend
};

// ======================== Initial state for the product form ===================================

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [error, setError] = useState(null);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(BASE_SERVER_URL + "/api/products/");

      setProducts(res.data.data || []);
    } catch (err) {
      console.error("Error fetching products", err);
      setError("Failed to fetch products. Please try again.");
      toast.error("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateSidebar = () => {
    setForm(initialFormState);
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
    setIsEdit(false);
    setError(null);
    setIsSidebarOpen(true);
  };

  const openEditSidebar = (product) => {
    setForm({
      id: product.id,
      name: product.name || "",
      category: product.category || "",
      origin: product.origin || "",
      grade: product.grade || "",
      moisture: product.moisture || "",
      min_order_qty: product.min_order_qty || product.minOrderQty || "",
      description: product.description || "",
      packaging: Array.isArray(product.packaging)
        ? product.packaging.join(", ")
        : product.packaging || "",
    });

    setExistingImages(product.images || []);
    setImageFiles([]);
    setImagePreviews([]);
    setIsEdit(true);
    setError(null);
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setIsSidebarOpen(false);
    setImagePreviews([]);
    setError(null);
  };

  // Close sidebar with ESC for better accessibility
  useEffect(() => {
    if (!isSidebarOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSidebarOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);

    imagePreviews.forEach((url) => URL.revokeObjectURL(url));

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(newPreviews);
  };

  // Remove one existing image while editing
  const handleRemoveExistingImage = (imgToRemove) => {
    setExistingImages((prev) =>
      prev.filter((img) => {
        // string case
        if (typeof img === "string" && typeof imgToRemove === "string") {
          return img !== imgToRemove;
        }
        // object case with url
        if (typeof img === "object" && typeof imgToRemove === "object") {
          return img.url !== imgToRemove.url;
        }
        // mixed types, fall back to strict inequality
        return img !== imgToRemove;
      })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category) {
      setError("Product name and category are required.");
      toast.error("Product name and category are required.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const formData = new FormData();

      // Append form fields based on DB columns
      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("origin", form.origin);
      formData.append("grade", form.grade);
      formData.append("moisture", form.moisture);
      formData.append("min_order_qty", form.min_order_qty);
      formData.append("description", form.description);

      // packaging: convert comma-separated string into JSON array
      let packagingArray = [];
      if (form.packaging && typeof form.packaging === "string") {
        packagingArray = form.packaging
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      formData.append("packaging", JSON.stringify(packagingArray));

      // send remaining existing images (for edit)
      if (isEdit) {
        formData.append("existing_images", JSON.stringify(existingImages));
      }

      // Append images (new uploads)
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      let url = BASE_SERVER_URL + "/api/products";
      let method = "post";

      if (isEdit && form.id) {
        url = BASE_SERVER_URL + `/api/products/${form.id}`;
        method = "put";
      }

      await axios({
        url,
        method,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchProducts();
      closeSidebar();
      toast.success("Successfully! Updated");
    } catch (err) {
      console.error(err);
      setError("Error saving product. Check console for details.");
      toast.error("Error saving product. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this product?"
      )
    )
      return;
    try {
      setDeletingId(id);

      await axios.delete(BASE_SERVER_URL + `/api/products/${id}`);
      await fetchProducts();
      toast.success("Successfully! Deleted");
    } catch (err) {
      console.error(err);
      setError("Error deleting product.");
      toast.success("Failed to delete product! Please try again");
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered products for table / cards
  const filteredProducts = useMemo(() => {
    const searchLower = (search || "").toLowerCase();
    const categoryLower = (categoryFilter || "all").toLowerCase();

    return products.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const category = (p.category || "").toLowerCase();
      const origin = (p.origin || "").toLowerCase();

      const matchesSearch =
        !searchLower ||
        name.includes(searchLower) ||
        category.includes(searchLower) ||
        origin.includes(searchLower);

      const matchesCategory =
        categoryLower === "all" || category === categoryLower;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const categories = useMemo(
    () =>
      Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
    [products]
  );

  // Determine if the product table's image column should use a mock image
  const MOCK_IMAGE_URL = "/mock-image.png";

  // Helper: get full URL for image (handles string or {url})
  const getImageSrc = (img) => {
    if (!img) return null;

    const path = typeof img === "string" ? img : img.url;

    if (!path) return null;

    // If it's already an absolute URL, return as is
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    // Otherwise treat as relative from server
    return BASE_SERVER_URL + path;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-white/60 via-amber-50/40 to-orange-50/40 backdrop-blur">
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-amber-700/70 unbounded-heading">
              Product Portfolio
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 unbounded-subHeading">
              PT INDO SPICES CATALOGUES
            </h1>
            <p className="mt-1 text-sm text-slate-600 max-w-xl sanchez-regular">
              Create, update and manage export-grade spice products with images.
            </p>
          </div>
          <button
            onClick={openCreateSidebar}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-700 text-white px-5 py-2.5 text-sm font-medium shadow-lg shadow-amber-700/30 hover:bg-amber-800 active:scale-[0.98] transition-all unbounded-subHeading w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            New Product
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, category, or origin..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full border border-amber-200 bg-white/80 px-4 py-2 text-sm shadow-inner shadow-amber-100/50 focus:outline-none focus:ring-2 focus:ring-amber-500/60 focus:border-amber-300 transition unbounded-subHeading"
                aria-label="Search products by name, category, or origin"
              />
            </div>
          </div>
          <div className="relative group inline-block w-full md:w-auto">
            {/* highlight blob */}
            <div
              className="
                pointer-events-none absolute -top-4 -right-4 h-10 w-10 rounded-full
                bg-amber-300/50 blur-xl opacity-0
                transition-all duration-300
                group-hover:opacity-70 group-focus-within:opacity-90
              "
            />

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="
                relative w-full appearance-none pr-10
                px-4 py-2.5 rounded-full cursor-pointer
                text-sm font-semibold tracking-wide unbounded-subHeading
                bg-linear-to-r from-amber-100 via-white to-amber-100
                border border-amber-400/60
                shadow-[inset_0_2px_6px_rgba(255,255,255,0.9),0_4px_10px_rgba(255,200,120,0.35)]
                backdrop-blur-md
                transition-all duration-300
                hover:-translate-y-[2px] hover:shadow-[inset_0_2px_6px_rgba(255,255,255,0.9),0_6px_18px_rgba(255,200,120,0.55)]
                hover:border-amber-500/70
                focus:-translate-y-[2px]
                focus:shadow-[0_0_0_4px_rgba(255,200,120,0.45),0_6px_18px_rgba(255,200,120,0.55)]
                focus:border-amber-600
                focus:outline-none
                [&>option]:py-2 [&>option]:px-2
                [&>option]:text-[14px]
                [&>option]:font-medium
                [&>option]:border-b [&>option]:border-amber-200/60
                [&>option:last-child]:border-b-0
              "
              aria-label="Filter products by category"
            >
              <option value="all" className="bg-white text-slate-700">
                All categories
              </option>
              {categories.map((c) => (
                <option
                  key={c}
                  value={c}
                  className="
                    bg-white text-slate-700
                    hover:bg-amber-100 hover:text-amber-900
                  "
                >
                  {c}
                </option>
              ))}
            </select>

            {/* dropdown arrow */}
            <svg
              className="
                absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4
                text-amber-700 transition-transform duration-300 pointer-events-none
                group-focus-within:rotate-180 group-hover:scale-110
              "
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>

        {/* Products list */}
        <div className="rounded-3xl border border-amber-100 bg-white/80 shadow-2xl shadow-amber-100/60 overflow-hidden">
          {/* Desktop / Tablet: Table */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm" aria-label="Products table">
                <thead>
                  <tr className="bg-amber-50/80 text-xs uppercase text-slate-600 tracking-wider">
                    <th className="px-4 py-3 text-left w-1/4 unbounded-heading">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left w-1/6 unbounded-heading">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left hidden sm:table-cell w-1/6 unbounded-heading">
                      Origin
                    </th>
                    <th className="px-4 py-3 text-left hidden md:table-cell w-1/12 unbounded-heading">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left hidden lg:table-cell w-1/12 unbounded-heading">
                      MOQ
                    </th>
                    <th className="px-4 py-3 text-right w-1/4 unbounded-heading">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Loading state */}
                  {loading && (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center">
                        <div className="inline-flex items-center gap-2 text-slate-500 text-sm">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Loading products...
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* Empty state */}
                  {!loading && filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center">
                        <p className="text-sm text-slate-500 unbounded-subHeading">
                          No products found matching your criteria.
                        </p>
                      </td>
                    </tr>
                  )}

                  {/* Product rows */}
                  {!loading &&
                    filteredProducts.map((product, idx) => {
                      const firstImage = product.images && product.images[0];
                      const firstImageSrc = getImageSrc(firstImage);

                      return (
                        <tr
                          key={
                            product.id ??
                            product._id ??
                            `${product.name}-${idx}`
                          }
                          className={`border-t border-amber-50/80 ${
                            idx % 2 === 0 ? "bg-white/90" : "bg-amber-50/50"
                          } transition-colors hover:bg-amber-100/60 sanchez-regular`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-amber-100/60 flex items-center justify-center overflow-hidden shadow-md">
                                {/* Display product image or placeholder */}
                                {firstImageSrc ? (
                                  <img
                                    src={
                                      firstImageSrc === "/mock-pepper.jpg" ||
                                      firstImageSrc === "/mock-cinnamon.jpg"
                                        ? MOCK_IMAGE_URL
                                        : firstImageSrc
                                    }
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <ImageIcon className="w-5 h-5 text-amber-700/70" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-slate-900">
                                  {product.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-700 font-medium">
                            {product.category}
                          </td>
                          <td className="px-4 py-3 text-slate-700 hidden sm:table-cell">
                            {product.origin}
                          </td>
                          <td className="px-4 py-3 text-slate-700 hidden md:table-cell">
                            <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full">
                              {product.description}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-700 hidden lg:table-cell">
                            {product.min_order_qty || product.minOrderQty}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => openEditSidebar(product)}
                                className="inline-flex items-center justify-center rounded-full border border-amber-300 bg-white px-3 py-1.5 text-xs text-amber-800 hover:bg-amber-50 transition shadow-sm unbounded-subHeading"
                                aria-label={`Edit ${product.name}`}
                                type="button"
                              >
                                <Pencil className="w-3.5 h-3.5 mr-1" />
                                Edit
                              </button>

                              <button
                                onClick={() => handleDelete(product.id)}
                                disabled={deletingId === product.id}
                                className="inline-flex items-center justify-center rounded-full bg-red-50 px-3 py-1.5 text-xs text-red-700 hover:bg-red-100 transition disabled:opacity-60 disabled:cursor-not-allowed shadow-sm unbounded-subHeading"
                                aria-label={`Delete ${product.name}`}
                                type="button"
                              >
                                {deletingId === product.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                                )}
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile: Card list */}
          <div className="md:hidden">
            {loading && (
              <div className="px-4 py-10 text-center">
                <div className="inline-flex items-center gap-2 text-slate-500 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading products...
                </div>
              </div>
            )}

            {!loading && filteredProducts.length === 0 && (
              <div className="px-4 py-10 text-center">
                <p className="text-sm text-slate-500 unbounded-subHeading">
                  No products found matching your criteria.
                </p>
              </div>
            )}

            {!loading && filteredProducts.length > 0 && (
              <div
                className="divide-y divide-amber-100"
                role="list"
                aria-label="Products"
              >
                {filteredProducts.map((product, idx) => {
                  const firstImage = product.images && product.images[0];
                  const firstImageSrc = getImageSrc(firstImage);

                  return (
                    <div
                      key={
                        product.id ?? product._id ?? `${product.name}-${idx}`
                      }
                      role="listitem"
                      className="px-4 py-4 flex gap-3 sanchez-regular bg-white/80"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-xl bg-amber-100/60 flex items-center justify-center overflow-hidden shadow-md">
                          {firstImageSrc ? (
                            <img
                              src={
                                firstImageSrc === "/mock-pepper.jpg" ||
                                firstImageSrc === "/mock-cinnamon.jpg"
                                  ? MOCK_IMAGE_URL
                                  : firstImageSrc
                              }
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-amber-700/70" />
                          )}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-semibold text-slate-900">
                              {product.name}
                            </h3>
                            <p className="text-xs text-amber-800 font-medium">
                              {product.category}
                            </p>
                          </div>
                        </div>

                        <div className="mt-2 space-y-1 text-xs text-slate-600">
                          {product.origin && (
                            <p>
                              <span className="font-semibold">Origin: </span>
                              {product.origin}
                            </p>
                          )}
                          {product.description && (
                            <p className="line-clamp-2">
                              <span className="font-semibold">
                                Description:{" "}
                              </span>
                              {product.description}
                            </p>
                          )}
                          {(product.min_order_qty || product.minOrderQty) && (
                            <p>
                              <span className="font-semibold">MOQ: </span>
                              {product.min_order_qty || product.minOrderQty}
                            </p>
                          )}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => openEditSidebar(product)}
                            className="inline-flex flex-1 items-center justify-center rounded-full border border-amber-300 bg-white px-3 py-2 text-xs text-amber-800 hover:bg-amber-50 transition shadow-sm unbounded-subHeading"
                            aria-label={`Edit ${product.name}`}
                          >
                            <Pencil className="w-3.5 h-3.5 mr-1" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(product.id)}
                            disabled={deletingId === product.id}
                            className="inline-flex flex-1 items-center justify-center rounded-full bg-red-50 px-3 py-2 text-xs text-red-700 hover:bg-red-100 transition disabled:opacity-60 disabled:cursor-not-allowed shadow-sm unbounded-subHeading"
                            aria-label={`Delete ${product.name}`}
                          >
                            {deletingId === product.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5 mr-1" />
                            )}
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-50 overflow-hidden"
          onClick={closeSidebar}
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-sidebar-title"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

          {/* Sidebar Panel */}
          <div
            className="fixed inset-x-0 bottom-0 top-auto md:inset-y-0 md:right-0 md:left-auto w-full md:w-2/3 lg:w-1/2 xl:w-1/3 max-w-3xl bg-white/95 shadow-2xl shadow-amber-900/20 border-t md:border-t-0 md:border-l border-amber-100 transition-transform duration-300 ease-out mx-auto md:mx-0 rounded-t-3xl md:rounded-none flex flex-col"
            style={{
              transform: isSidebarOpen
                ? "translateY(0)"
                : "translateY(100%)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-amber-100/80 shrink-0">
              <div>
                <h2
                  id="product-sidebar-title"
                  className="text-xl text-slate-800 unbounded-heading"
                >
                  {isEdit ? "Edit Product" : "Create New Product"}
                </h2>
                <p className="text-sm text-slate-500 unbounded-subHeading">
                  {isEdit
                    ? `Updating details for ${form.name}`
                    : "Fill in the product details and upload images."}
                </p>
                <p className="text-sm text-orange-800 roboto-text">
                  Make sure enter text in concise
                </p>
              </div>
              <button
                onClick={closeSidebar}
                className="rounded-full p-2 hover:bg-slate-100 transition"
                aria-label="Close sidebar"
                type="button"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-3 mx-6 my-3 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-2 text-sm shrink-0">
                <AlertTriangle className="w-4 h-4 mt-0.5" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {/* Form Content */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col grow overflow-y-auto p-6 pt-0"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-4">
                {/* Basic Info */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormInput
                    name="name"
                    label="Name*"
                    value={form.name}
                    onChange={handleInputChange}
                    required
                    autoFocus
                  />
                  <FormInput
                    name="category"
                    label="Category*"
                    value={form.category}
                    onChange={handleInputChange}
                    required
                  />
                  <FormInput
                    name="origin"
                    label="Origin"
                    value={form.origin}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Specifications */}
                <FormInput
                  name="grade"
                  label="Grade"
                  value={form.grade}
                  onChange={handleInputChange}
                />
                <FormInput
                  name="moisture"
                  label="Moisture"
                  value={form.moisture}
                  onChange={handleInputChange}
                />
                <FormInput
                  name="min_order_qty"
                  label="Minimum Order Qty"
                  value={form.min_order_qty}
                  onChange={handleInputChange}
                />
                <div /> {/* spacer */}

                {/* Packaging (JSON) */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1 unbounded-heading">
                    Packaging
                  </label>
                  <input
                    type="text"
                    name="packaging"
                    value={form.packaging}
                    onChange={handleInputChange}
                    placeholder="25kg PP Bags"
                    className="w-full rounded-xl border border-amber-200 bg-white/90 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/60 focus:border-amber-300 transition sanchez-regular"
                  />
                  <p className="mt-1 text-[11px] text-orange-500 unbounded-subHeading">
                    Enter values separated by commas.
                  </p>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1 unbounded-heading">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full rounded-xl border border-amber-200 bg-white/90 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/60 focus:border-amber-300 transition resize-y sanchez-regular"
                  />
                </div>

                {/* Images Section */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1 unbounded-heading">
                    Images
                  </label>

                  {/* Existing Images – PREVIEW + DELETE WHILE EDITING */}
                  {isEdit &&
                    existingImages?.length > 0 &&
                    imagePreviews.length === 0 && (
                      <div className="mb-3">
                        <p className="text-[11px] text-orange-500 mb-1 unbounded-subHeading">
                          Existing Images (tap ❌ to remove)
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {existingImages.map((img, index) => {
                            const imgSrc = getImageSrc(img);
                            return (
                              <div
                                key={imgSrc || index}
                                className="relative w-16 h-16 rounded-xl overflow-hidden border border-amber-200 bg-amber-50/60 shadow-md"
                              >
                                {imgSrc ? (
                                  <img
                                    src={
                                      imgSrc === "/mock-pepper.jpg" ||
                                      imgSrc === "/mock-cinnamon.jpg"
                                        ? MOCK_IMAGE_URL
                                        : imgSrc
                                    }
                                    alt="Existing product"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <ImageIcon className="w-4 h-4 text-amber-700/70" />
                                )}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveExistingImage(img)
                                  }
                                  className="absolute top-0 left-0 m-0.5 w-4 h-4 flex items-center justify-center rounded-full bg-red-600 text-[9px] text-white"
                                  title="Remove this image"
                                  aria-label="Remove this image"
                                >
                                  ×
                                </button>
                                <span className="absolute bottom-0 right-0 px-1 py-px bg-green-500/90 rounded-tl-lg text-white text-[8px] font-bold">
                                  LIVE
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  {/* File Dropzone / Input */}
                  <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-amber-300 rounded-2xl px-4 py-5 text-center cursor-pointer bg-amber-50/40 hover:bg-amber-50/80 transition sanchez-regular">
                    <ImageIcon className="w-7 h-7 mb-2 text-amber-700/80" />
                    <p className="text-sm font-medium text-slate-700">
                      Tap to choose images or drag & drop
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      (JPG, PNG, WEBP, up to 5MB per file)
                    </p>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      className="hidden"
                      onChange={handleImageChange}
                      aria-label="Upload product images"
                    />
                  </label>

                  {/* Uploaded Image Previews (NEW IMAGES) */}
                  {imageFiles.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-slate-600 mb-2 sanchez-regular">
                        {isEdit
                          ? "New Images to Upload:"
                          : "Selected Images:"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {imagePreviews.map((previewUrl, index) => (
                          <div
                            key={index}
                            className="w-20 h-20 rounded-xl overflow-hidden border-2 border-green-500 bg-white shadow-lg relative"
                          >
                            <img
                              src={previewUrl}
                              alt={`Selected preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-0 right-0 p-0.5 bg-amber-700 rounded-bl-lg text-white text-[8px] font-bold">
                              NEW
                            </span>
                          </div>
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-slate-500 sanchez-regular">
                        Selected {imageFiles.length} file
                        {imageFiles.length > 1 ? "s" : ""}.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer buttons */}
              <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 border-t border-amber-100 pt-4 shrink-0 unbounded-subHeading">
                <button
                  type="button"
                  onClick={closeSidebar}
                  className="px-4 py-2 text-sm font-medium text-slate-600 rounded-full hover:bg-slate-100 transition w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-700 px-6 py-2 text-sm font-semibold text-white shadow-md shadow-amber-700/30 hover:bg-amber-800 active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isEdit ? "Save changes" : "Create product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tailwind & Animation Styles - Updated for Slide-in */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// Reusable Form Input Component
const FormInput = ({
  name,
  label,
  value,
  onChange,
  required = false,
  type = "text",
  autoFocus = false,
}) => (
  <div>
    <label className="block text-xs font-semibold text-slate-700 mb-1 unbounded-heading">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      autoFocus={autoFocus}
      className="w-full rounded-xl border border-amber-200 bg-white/90 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/60 focus:border-amber-300 transition sanchez-regular"
    />
  </div>
);