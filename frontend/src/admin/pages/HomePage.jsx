import { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";




// ==================================== CONSTANTS =================================================

const BASE_SERVER_URL = "http://localhost:3000";

// ==================================== CONSTANTS =================================================




// ================================ COMPONENT ==========================================

const Label = ({ children }) => (
  <label className="block text-xs font-bold text-slate-700 mb-1 unbounded-subHeading">
    {children}
  </label>
);

const TextInput = ({ disabled, ...props }) => (
  <input
    {...props}
    disabled={disabled}
    className={`w-full rounded-lg border border-slate-200 bg-white/70 px-3 py-2 text-sm outline-none
      focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all sanchez-regular
      ${disabled ? "opacity-60 cursor-not-allowed bg-slate-50" : ""}`}
  />
);

const TextArea = ({ rows = 3, disabled, ...props }) => (
  <textarea
    rows={rows}
    {...props}
    disabled={disabled}
    className={`w-full rounded-lg border border-slate-200 bg-white/70 px-3 py-2 text-sm outline-none
      focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all resize-y sanchez-regular
      ${disabled ? "opacity-60 cursor-not-allowed bg-slate-50" : ""}`}
  />
);

const FileInput = ({ onChange, accept, label, disabled }) => (
  <div className="flex items-center gap-3">
    <input
      type="file"
      accept={accept}
      onChange={disabled ? undefined : onChange}
      disabled={disabled}
      className={`block w-full text-xs text-slate-600
                 file:mr-3 file:py-1.5 file:px-3
                 file:rounded-full file:border-0
                 file:text-xs file:font-semibold
                 file:bg-linear-to-r file:from-slate-500 file:to-slate-600 file:text-white
                 hover:file:from-slate-600 hover:file:to-slate-700
                 cursor-pointer sanchez-regular
                 ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
    />
    {label && (
      <span className="text-2xs text-slate-500 italic whitespace-nowrap sanchez-regular">
        {label}
      </span>
    )}
  </div>
);

const SectionCard = ({ title, children, actions }) => (
  <section
    className="
      group relative mb-6 overflow-hidden
      rounded-2xl border border-slate-200
      bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200
      backdrop-blur-sm shadow-md p-5 sm:p-6 flex flex-col
      transform-gpu transition-all duration-300 ease-out
      hover:-translate-y-2 hover:scale-[1.015]
      hover:shadow-2xl hover:shadow-slate-300/70
    "
  >

    {/* 💡 STRONG floating highlight blob (visible like stat cards) */}
    <div
      className="
        pointer-events-none absolute -right-6 -top-6
        h-20 w-20 rounded-full
        bg-white/45 blur-xl
        transition-all duration-300 transform-gpu
        group-hover:translate-x-3 group-hover:translate-y-3 group-hover:scale-110
      "
    />

    {/* subtle glossy reflection */}
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-white/5" />

    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4 gap-3">
        <h2
          className="
            text-base font-bold uppercase tracking-wide unbounded-heading
            bg-gradient-to-r from-slate-700 via-slate-900 to-slate-950
            bg-clip-text text-transparent
            transform-gpu transition-all duration-300 group-hover:translate-y-0.5
          "
        >
          {title}
        </h2>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      <div
        className="
          transform-gpu transition-transform duration-300 ease-out
          group-hover:translate-y-0.5
        "
      >
        {children}
      </div>
    </div>
  </section>
);

const AddButton = ({ children, ...props }) => (
  <button
    type="button"
    {...props}
    className="
      inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold
      bg-linear-to-r from-blue-500 via-blue-600 to-blue-700
      text-white shadow-md hover:shadow-lg
      transition-all duration-200 hover:-translate-y-0.5
      disabled:opacity-50 disabled:cursor-not-allowed
      focus:outline-none focus:ring-2 focus:ring-rose-200 focus:ring-offset-2 focus:ring-offset-rose-50
    "
  >
    <span className="text-sm">＋</span>
    {children}
  </button>
);

const EditButton = ({ children, ...props }) => (
  <button
    type="button"
    {...props}
    className="
      inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold
      bg-linear-to-r from-amber-300 via-yellow-300 to-amber-400 unbounded-subHeading
      text-slate-800 shadow hover:shadow-md
      transition-all duration-200 hover:-translate-y-0.5
      disabled:opacity-50 disabled:cursor-not-allowed
      focus:outline-none focus:ring-1 focus:ring-amber-200
    "
  >
    ✎ {children}
  </button>
);

const DeleteButton = ({ children = "Delete", ...props }) => (
  <button
    type="button"
    {...props}
    className="
      inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold
      bg-linear-to-r from-red-600 via-rose-600 to-red-700
      text-white shadow hover:shadow-md
      transition-all duration-200 hover:-translate-y-0.5
      disabled:opacity-50 disabled:cursor-not-allowed
      focus:outline-none focus:ring-1 focus:ring-rose-300
    "
  >
    🗑 {children}
  </button>
);

const SaveButtonSmall = ({ children = "Save Changes", ...props }) => (
  <button
    type="submit"
    {...props}
    className="
      inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold
      bg-linear-to-r from-emerald-500 via-emerald-600 to-emerald-700 unbounded-subHeading
      text-white shadow hover:shadow-lg
      transition-all duration-200 hover:-translate-y-0.5
      disabled:opacity-50 disabled:cursor-not-allowed
      focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:ring-offset-2
    "
  >
    {children}
  </button>
);

const CancelButton = ({ ...props }) => (
  <button
    type="button"
    {...props}
    className="
      inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold
      bg-slate-100 text-slate-700 border border-slate-200 unbounded-subHeading
      hover:bg-slate-200 hover:border-slate-300
      transition-all duration-200 hover:-translate-y-0.5
      disabled:opacity-50 disabled:cursor-not-allowed
      focus:outline-none focus:ring-1 focus:ring-slate-300
    "
  >
    Cancel
  </button>
);

// ================================ COMPONENT ==========================================




const HomePage = () => {

  // ----------------------------------------- JUMBOTRON ----------------------------------------------------

  const jumbotronData = async () => {
    const res = await axios.get(`${BASE_SERVER_URL}/api/home/jumbotron/`);
    return res.data.data;
  };

  useEffect(() => {
    const fetchJumbotron = async () => {
      try {
        const data = await jumbotronData();
        if (data) {
          setJumbotron((prev) => ({
            ...prev,
            backgroundAlt: data.background_alt || "",
            title: data.title || "",
            intro: data.intro || "",
            body: data.body || "",
            backgroundImagePreview: data.background_image
              ? `${BASE_SERVER_URL}/${data.background_image}`
              : prev.backgroundImagePreview,
          }));
        }
      } catch (err) {
        console.error("Error fetching jumbotron:", err);
        toast.error("Error fetching jumbotron:");
      }
    };

    fetchJumbotron();
  }, []);

  useEffect(() => {
    const fetchJumbotron = async () => {
      const data = await jumbotronData();
      if (data) {
        setJumbotron(prev => ({
          ...prev,
          ...data,
        }));
      }
    };

    fetchJumbotron();
  }, []);


  const [jumbotron, setJumbotron] = useState({
    backgroundImageFile: null,
    backgroundImagePreview: "",
    backgroundAlt: "",
    title: "",
    intro: "",
    body: "",
  });
  const [isEditingJumbotron, setIsEditingJumbotron] = useState(false);


  const handleSaveJumbotron = async (e) => {
    e.preventDefault();

    const { backgroundImageFile, backgroundAlt, body, intro, title } = jumbotron;

    const formData = new FormData();
    formData.append("backgroundAlt", backgroundAlt);
    formData.append("body", body);
    formData.append("intro", intro);
    formData.append("title", title);

    if (backgroundImageFile) {
      formData.append("backgroundImageFile", backgroundImageFile);
    }

    try {
      const res = await axios.put(
        `${BASE_SERVER_URL}/api/home/jumbotron/edit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(res.data.message || "Jumbotron updated successfully");
      setIsEditingJumbotron(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update Jumbotron Data");
    }
  };

  // ----------------------------------------- JUMBOTRON ----------------------------------------------------




  // ----------------------------------------- CAROUSEL  ----------------------------------------------------

  const [carouselItems, setCarouselItems] = useState([
    { id: 1, imageFile: null, imagePreview: "", alt: "", label: "" },
  ]);

  const carouselData = async () => {
    const res = await axios.get(`${BASE_SERVER_URL}/api/home/carousel`);

    const mapped = res.data.data.map((item) => ({
      id: item.id,
      imageFile: null,
      imagePreview: BASE_SERVER_URL + item.src,
      alt: item.alt,
      label: item.label,
    }));

    setCarouselItems(mapped);
  };

  useEffect(() => {
    carouselData();
  }, [])
  const [isEditingCarousel, setIsEditingCarousel] = useState(false);

  const handleSaveCarousel = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // multiple carousel items
      carouselItems.forEach((item, index) => {
        formData.append(`items[${index}][id]`, item.id);
        formData.append(`items[${index}][alt]`, item.alt);
        formData.append(`items[${index}][label]`, item.label);

        // Only append file if user selected a new one
        if (item.imageFile) {
          formData.append(`items[${index}][imageFile]`, item.imageFile);
        }
      });

      const res = await axios.put(
        `${BASE_SERVER_URL}/api/home/carousel/edit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(res.data.message);
      setIsEditingCarousel(false);
      carouselData(); // refresh updated carousel from DB
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update carousel");
    }
  };

  // ----------------------------------- CAROUSEL ----------------------------------------------------------------




  // ----------------------------------- TAB: STATS, SERVICES, FAQ -------------------------------------------------------------

  const [stats, setStats] = useState([]);
  const [services, setServices] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [isEditingTabs, setIsEditingTabs] = useState(false);

  const tabsData = async () => {
    try {
      const res = await axios.get(`${BASE_SERVER_URL}/api/home/tabs`);

      setStats(res.data.data.stats);
      setServices(res.data.data.services);
      setFaqs(res.data.data.faqs);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    tabsData();
  }, []);

  const handleSaveTabs = async (e) => {
    e.preventDefault();
    const resEditTabs = await axios.put(
      `${BASE_SERVER_URL}/api/home/tabs/edit`,
      {
        stats,
        services,
        faqs,
      },
    );
    toast.success(resEditTabs.data.message);

    setIsEditingTabs(false);
  };

  // ----------------------------------- TAB: STATS, SERVICES, FAQ -------------------------------------------------------------




  // ----------------------------------- HELPERS -------------------------------------------------

  const handleImageChange = (file, cb) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    cb(file, preview);
  };

  // ----------------------------------- HELPERS -------------------------------------------------


  return (
    <>
      {/* Global toaster for this page */}
      <Toaster position="top-right" toastOptions={{ style: { fontSize: "0.85rem", }, }} />

      <div className="min-h-screen w-full bg-linear-to-br py-8 sm:py-10 px-4 sm:px-6 lg:px-10">
        <div className="max-w-6xl mx-auto">

          {/* PAGE HEADER */}
          <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* Page heading */}
            <div>
              <h1
                className="
                text-xl sm:text-2xl font-extrabold
                bg-linear-to-r text-slate-800
                bg-clip-text unbounded-subHeading
              "
              >
                Home Page Editor
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-xl sanchez-regular">
                Edit each section independently with its own Edit and Save
                controls.
              </p>
            </div>
          </header>

          {/* ========== JUMBOTRON SECTION ========== */}
          <SectionCard
            title="Jumbotron"
            actions={
              isEditingJumbotron ? (
                <>
                  <SaveButtonSmall form="jumbotron-form" />
                  <CancelButton
                    onClick={() => {
                      setIsEditingJumbotron(false);
                    }}
                  />
                </>
              ) : (
                <EditButton onClick={() => setIsEditingJumbotron(true)}>
                  Edit Section
                </EditButton>
              )
            }
          >
            <form id="jumbotron-form" onSubmit={handleSaveJumbotron}>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <Label>Background Image</Label>
                  <FileInput
                    accept="image/*"
                    label="Recommended keep your file name: exportImages.jpg"
                    disabled={!isEditingJumbotron}
                    onChange={(e) =>
                      handleImageChange(
                        e.target.files?.[0],
                        (file, preview) =>
                          setJumbotron((prev) => ({
                            ...prev,
                            backgroundImageFile: file,
                            backgroundImagePreview: preview,
                          }))
                      )
                    }
                  />
                  {jumbotron.backgroundImagePreview && (
                    <div className="mt-2">
                      <img
                        src={jumbotron.backgroundImagePreview}
                        alt="Jumbotron preview"
                        className="h-36 w-full object-cover rounded-xl shadow-md"
                      />
                    </div>
                  )}
                  <div className="mt-4 space-y-2">
                    <Label>Background Alt Text</Label>
                    <TextInput
                      disabled={!isEditingJumbotron}
                      placeholder="Assorted spices and agro commodities..."
                      value={jumbotron.backgroundAlt}
                      onChange={(e) =>
                        setJumbotron((prev) => ({
                          ...prev,
                          backgroundAlt: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label>Title</Label>
                    <TextInput
                      disabled={!isEditingJumbotron}
                      placeholder="PT INDO BUSINESS EXPORTS"
                      value={jumbotron.title}
                      onChange={(e) =>
                        setJumbotron((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Intro Body</Label>
                    <TextArea
                      disabled={!isEditingJumbotron}
                      rows={3}
                      placeholder="Short intro text shown in bigger font..."
                      value={jumbotron.intro}
                      onChange={(e) =>
                        setJumbotron((prev) => ({
                          ...prev,
                          intro: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Body Text</Label>
                    <TextArea
                      disabled={!isEditingJumbotron}
                      rows={3}
                      placeholder="Additional supporting description..."
                      value={jumbotron.body}
                      onChange={(e) =>
                        setJumbotron((prev) => ({
                          ...prev,
                          body: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </form>
          </SectionCard>

          {/* ========== CAROUSEL SECTION ========== */}
          <SectionCard
            title="Carousel"
            actions={
              isEditingCarousel ? (
                <>
                  <SaveButtonSmall form="carousel-form" />
                  <CancelButton
                    onClick={() => {
                      setIsEditingCarousel(false);
                    }}
                  />
                </>
              ) : (
                <EditButton onClick={() => setIsEditingCarousel(true)}>
                  Edit Section
                </EditButton>
              )
            }
          >
            <form id="carousel-form" onSubmit={handleSaveCarousel}>
              <div className="space-y-4">
                {carouselItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="
                    rounded-xl border border-slate-100 bg-white/70 p-4
                    flex flex-col gap-3 sm:flex-row sm:items-start
                    transition-all duration-200 hover:shadow-md hover:-translate-y-0.5
                  "
                  >
                    <div className="w-full sm:w-60">
                      <Label>Slide Image</Label>
                      <FileInput
                        accept="image/*"
                        disabled={!isEditingCarousel}
                        onChange={(e) =>
                          handleImageChange(
                            e.target.files?.[0],
                            (file, preview) =>
                              setCarouselItems((prev) =>
                                prev.map((s) =>
                                  s.id === item.id
                                    ? {
                                      ...s,
                                      imageFile: file,
                                      imagePreview: preview,
                                    }
                                    : s
                                )
                              )
                          )
                        }
                      />
                      {item.imagePreview && (
                        <img
                          src={item.imagePreview}
                          alt="Slide preview"
                          className="mt-2 h-28 w-full object-cover rounded-lg shadow"
                        />
                      )}
                    </div>

                    <div className="flex-1 grid sm:grid-cols-2 gap-3">
                      <div>
                        <Label>Alt Text</Label>
                        <TextInput
                          disabled={!isEditingCarousel}
                          placeholder="Carousel image alt text..."
                          value={item.alt}
                          onChange={(e) =>
                            setCarouselItems((prev) =>
                              prev.map((s) =>
                                s.id === item.id
                                  ? { ...s, alt: e.target.value }
                                  : s
                              )
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label>Label / Caption</Label>
                        <TextInput
                          disabled={!isEditingCarousel}
                          placeholder="Premium global spices and herbs..."
                          value={item.label}
                          onChange={(e) =>
                            setCarouselItems((prev) =>
                              prev.map((s) =>
                                s.id === item.id
                                  ? { ...s, label: e.target.value }
                                  : s
                              )
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center justify-between gap-2 sm:w-24">
                      <span className="text-[11px] text-slate-500">
                        #{index + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </form>
          </SectionCard>

          {/* ========== PRODUCT VERTICAL SLIDER ========== */}
          {/* <SectionCard
            title="Product Vertical Slider"
            actions={
              isEditingProducts ? (
                <>
                  <AddButton
                    onClick={() =>
                      setProducts((prev) => [
                        ...prev,
                        {
                          id: Date.now(),
                          name: "",
                          type: "",
                          grade: "",
                          description: "",
                          imageFile: null,
                          imagePreview: "",
                          imageAlt: "",
                        },
                      ])
                    }
                  >
                    Add Product Slide
                  </AddButton>
                  <SaveButtonSmall form="products-form" />
                  <CancelButton
                    onClick={() => {
                      setIsEditingProducts(false);
                    }}
                  />
                </>
              ) : (
                <EditButton onClick={() => setIsEditingProducts(true)}>
                  Edit Section
                </EditButton>
              )
            }
          >
            <form id="products-form" onSubmit={handleSaveProducts}>
              <div className="space-y-4">
                {products.map((p, index) => (
                  <div
                    key={p.id}
                    className="
                    rounded-2xl border border-amber-100 bg-white/80 p-4
                    transition-all duration-200 hover:shadow-md hover:-translate-y-0.5
                  "
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-semibold text-amber-800">
                        Product #{index + 1}
                      </span>
                      {isEditingProducts && (
                        <DeleteButton
                          onClick={() =>
                            setProducts((prev) =>
                              prev.length === 1
                                ? prev
                                : prev.filter((prod) => prod.id !== p.id)
                            )
                          }
                        />
                      )}
                    </div>
                    <div className="grid md:grid-cols-3 gap-3">
                      <div>
                        <Label>Name</Label>
                        <TextInput
                          disabled={!isEditingProducts}
                          value={p.name}
                          placeholder="Premium Black Pepper"
                          onChange={(e) =>
                            setProducts((prev) =>
                              prev.map((prod) =>
                                prod.id === p.id
                                  ? { ...prod, name: e.target.value }
                                  : prod
                              )
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label>Type</Label>
                        <TextInput
                          disabled={!isEditingProducts}
                          value={p.type}
                          placeholder="Spice / Herbs / Gum..."
                          onChange={(e) =>
                            setProducts((prev) =>
                              prev.map((prod) =>
                                prod.id === p.id
                                  ? { ...prod, type: e.target.value }
                                  : prod
                              )
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label>Grade</Label>
                        <TextInput
                          disabled={!isEditingProducts}
                          value={p.grade}
                          placeholder="ASTA Quality, Curcumin Rich..."
                          onChange={(e) =>
                            setProducts((prev) =>
                              prev.map((prod) =>
                                prod.id === p.id
                                  ? { ...prod, grade: e.target.value }
                                  : prod
                              )
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="mt-3 grid md:grid-cols-2 gap-3">
                      <div>
                        <Label>Description</Label>
                        <TextArea
                          disabled={!isEditingProducts}
                          rows={4}
                          value={p.description}
                          placeholder="Handpicked black pepper with strong aroma..."
                          onChange={(e) =>
                            setProducts((prev) =>
                              prev.map((prod) =>
                                prod.id === p.id
                                  ? { ...prod, description: e.target.value }
                                  : prod
                              )
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Image</Label>
                        <FileInput
                          accept="image/*"
                          disabled={!isEditingProducts}
                          onChange={(e) =>
                            handleImageChange(
                              e.target.files?.[0],
                              (file, preview) =>
                                setProducts((prev) =>
                                  prev.map((prod) =>
                                    prod.id === p.id
                                      ? {
                                        ...prod,
                                        imageFile: file,
                                        imagePreview: preview,
                                      }
                                      : prod
                                  )
                                )
                            )
                          }
                        />
                        {p.imagePreview && (
                          <img
                            src={p.imagePreview}
                            alt="Product preview"
                            className="mt-2 h-32 w-full object-cover rounded-lg shadow"
                          />
                        )}
                        <div>
                          <Label>Image Alt Text</Label>
                          <TextInput
                            disabled={!isEditingProducts}
                            value={p.imageAlt}
                            placeholder="Premium black pepper..."
                            onChange={(e) =>
                              setProducts((prev) =>
                                prev.map((prod) =>
                                  prod.id === p.id
                                    ? { ...prod, imageAlt: e.target.value }
                                    : prod
                                )
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </form>
          </SectionCard> */}

          {/* ========== TAB: STATS & SERVICES & FAQ ========== */}
          <SectionCard
            title="Tabs: Statistics & Services & FAQ"
            actions={
              isEditingTabs ? (
                <>
                  <SaveButtonSmall form="tabs-form" />
                  <CancelButton
                    onClick={() => {
                      setIsEditingTabs(false);
                    }}
                  />
                </>
              ) : (
                <EditButton onClick={() => setIsEditingTabs(true)}>
                  Edit Section
                </EditButton>
              )
            }
          >
            <form id="tabs-form" onSubmit={handleSaveTabs}>

              {/* STATS */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-amber-900">
                    Statistics Items
                  </h3>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {stats.map((s) => (
                    <div
                      key={s.id}
                      className="rounded-lg border border-slate-100 bg-white/80 p-3 space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] text-slate-500">Stat</span>
                      </div>
                      <div>
                        <Label>Title</Label>
                        <TextInput
                          disabled={!isEditingTabs}
                          value={s.title}
                          placeholder="150+"
                          onChange={(e) =>
                            setStats((prev) =>
                              prev.map((st) =>
                                st.id === s.id
                                  ? { ...st, title: e.target.value }
                                  : st
                              )
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <TextInput
                          disabled={!isEditingTabs}
                          value={s.description}
                          placeholder="Exported product categories"
                          onChange={(e) =>
                            setStats((prev) =>
                              prev.map((st) =>
                                st.id === s.id
                                  ? { ...st, description: e.target.value }
                                  : st
                              )
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>


              {/* SERVICES */}
              <div className="mb-5 border-t border-amber-100 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-amber-900">
                    Service Items
                  </h3>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {services.map((svc) => (
                    <div
                      key={svc.id}
                      className="rounded-lg border border-slate-100 bg-white/80 p-3 space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] text-slate-500">
                          Service
                        </span>
                      </div>
                      <div>
                        <Label>Title</Label>
                        <TextInput
                          disabled={!isEditingTabs}
                          value={svc.title}
                          placeholder="Premium Spices & Herbs Export"
                          onChange={(e) =>
                            setServices((prev) =>
                              prev.map((se) =>
                                se.id === svc.id
                                  ? { ...se, title: e.target.value }
                                  : se
                              )
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <TextArea
                          disabled={!isEditingTabs}
                          rows={3}
                          value={svc.description}
                          placeholder="High-grade turmeric, cumin, coriander..."
                          onChange={(e) =>
                            setServices((prev) =>
                              prev.map((se) =>
                                se.id === svc.id
                                  ? { ...se, description: e.target.value }
                                  : se
                              )
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>


              {/* FAQ */}
              <div className="border-t border-amber-100 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-amber-900">
                    FAQ Items
                  </h3>
                </div>
                <div className="space-y-3">
                  {faqs.map((f) => (
                    <div
                      key={f.id}
                      className="rounded-lg border border-slate-100 bg-white/80 p-3 space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] text-slate-500">
                          FAQ ID: {f.id}
                        </span>
                      </div>
                      <div>
                        <Label>Question</Label>
                        <TextInput
                          disabled={!isEditingTabs}
                          value={f.question}
                          placeholder="What does PT INDO specialize in?"
                          onChange={(e) =>
                            setFaqs((prev) =>
                              prev.map((faq) =>
                                faq.id === f.id
                                  ? { ...faq, question: e.target.value }
                                  : faq
                              )
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label>Answer</Label>
                        <TextArea
                          disabled={!isEditingTabs}
                          rows={3}
                          value={f.answer}
                          placeholder="PT INDO BUSINESS EXPORTS specializes in..."
                          onChange={(e) =>
                            setFaqs((prev) =>
                              prev.map((faq) =>
                                faq.id === f.id
                                  ? { ...faq, answer: e.target.value }
                                  : faq
                              )
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </SectionCard>

          {/* ========== CERTIFICATES ========== */}
          {/* <SectionCard
            title="Certificates"
            actions={
              isEditingCertificates ? (
                <>
                  <AddButton
                    onClick={() =>
                      setCertificates((prev) => [
                        ...prev,
                        {
                          id: Date.now(),
                          logoFile: null,
                          logoPreview: "",
                          logoAlt: "",
                        },
                      ])
                    }
                  >
                    Add Certificate
                  </AddButton>
                  <SaveButtonSmall form="certificates-form" />
                  <CancelButton
                    onClick={() => {
                      setIsEditingCertificates(false);
                    }}
                  />
                </>
              ) : (
                <EditButton onClick={() => setIsEditingCertificates(true)}>
                  Edit Section
                </EditButton>
              )
            }
          >
            <form id="certificates-form" onSubmit={handleSaveCertificates}>
              <div className="space-y-4">
                {certificates.map((c, index) => (
                  <div
                    key={c.id}
                    className="
                    rounded-xl border border-slate-100 bg-white/80 p-4
                    flex flex-col gap-3 sm:flex-row sm:items-center
                    transition-all duration-200 hover:shadow-md hover:-translate-y-0.5
                  "
                  >
                    <div className="w-full sm:w-64">
                      <Label>Logo Image</Label>
                      <FileInput
                        accept="image/*"
                        disabled={!isEditingCertificates}
                        onChange={(e) =>
                          handleImageChange(
                            e.target.files?.[0],
                            (file, preview) =>
                              setCertificates((prev) =>
                                prev.map((cert) =>
                                  cert.id === c.id
                                    ? {
                                      ...cert,
                                      logoFile: file,
                                      logoPreview: preview,
                                    }
                                    : cert
                                )
                              )
                          )
                        }
                      />
                      {c.logoPreview && (
                        <div className="mt-2">
                          <img
                            src={c.logoPreview}
                            alt="Certificate logo preview"
                            className="h-20 w-20 object-contain rounded-lg border border-amber-100 bg-white shadow"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Label>Logo Alt Text</Label>
                      <TextInput
                        disabled={!isEditingCertificates}
                        value={c.logoAlt}
                        placeholder="ISO 9001:2015 certified"
                        onChange={(e) =>
                          setCertificates((prev) =>
                            prev.map((cert) =>
                              cert.id === c.id
                                ? { ...cert, logoAlt: e.target.value }
                                : cert
                            )
                          )
                        }
                      />
                      <p className="mt-1 text-[11px] text-slate-500">
                        Certificate #{index + 1} &mdash; ID: {c.id}
                      </p>
                    </div>

                    <div className="flex justify-end sm:w-28">
                      {isEditingCertificates && (
                        <DeleteButton
                          onClick={() =>
                            setCertificates((prev) =>
                              prev.length === 1
                                ? prev
                                : prev.filter((cert) => cert.id !== c.id)
                            )
                          }
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </form>
          </SectionCard> */}
        </div>
      </div>
    </>
  );
};

export default HomePage;