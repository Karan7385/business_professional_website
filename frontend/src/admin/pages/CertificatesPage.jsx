import { useState, useEffect } from "react";
import axios from "axios";
import { PlusCircle, Award, Trash2, Edit, X, Save } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";


const BASE_SERVER_URL = "http://localhost:3000";

const CERT_HERO_CONTENT = {
  eyebrow: "Admin Dashboard",
  title: "Manage Certifications",
  description:
    "Add, update, or remove company certifications to maintain transparency and compliance information on the public facing site.",
};

const initialFormState = {
  id: undefined,
  title: "",
  issuer: "",
  year: new Date().getFullYear().toString(),
  src: "", // preview url for main certificate file
  category: "",
  color: "from-gray-400 to-gray-600",
  type: "",
  file: null, // main certificate file (File)
  logo: "",
  logoFile: null,
};

const COLOR_OPTIONS = [
  { name: "Emerald / Teal", value: "from-emerald-500 to-teal-600" },
  { name: "Blue / Indigo", value: "from-blue-500 to-indigo-600" },
  { name: "Purple / Pink", value: "from-purple-500 to-pink-600" },
  { name: "Orange / Red", value: "from-orange-500 to-red-600" },

  { name: "Slate / Gray", value: "from-slate-500 to-gray-700" },
  { name: "Cyan / Sky", value: "from-cyan-400 to-sky-600" },
  { name: "Rose / Red", value: "from-rose-500 to-red-600" },
  { name: "Violet / Fuchsia", value: "from-violet-500 to-fuchsia-600" },
  { name: "Amber / Yellow", value: "from-amber-400 to-yellow-500" },
  { name: "Lime / Green", value: "from-lime-400 to-green-600" },
  { name: "Indigo / Violet", value: "from-indigo-500 to-violet-600" },
  { name: "Pink / Rose", value: "from-pink-500 to-rose-600" },
  { name: "Teal / Cyan", value: "from-teal-500 to-cyan-500" },
  { name: "Zinc / Slate (Dark Neutral)", value: "from-zinc-600 to-slate-800" },
  { name: "Gold Premium", value: "from-yellow-400 to-amber-600" },
  { name: "Royal Blue", value: "from-sky-600 to-blue-800" },
  { name: "Forest Green", value: "from-green-600 to-emerald-800" },
  { name: "Sunset", value: "from-rose-400 to-orange-500" },
  { name: "Ocean", value: "from-teal-400 to-blue-600" },
  { name: "Fire", value: "from-red-500 to-orange-500" },

  // 🌤 LIGHT COLORS ADDED BELOW
  { name: "Soft Sky", value: "from-sky-200 to-blue-300" },
  { name: "Lavender Mist", value: "from-indigo-200 to-purple-300" },
  { name: "Peach Glow", value: "from-orange-200 to-pink-300" },
  { name: "Mint Breeze", value: "from-green-200 to-teal-300" },
  { name: "Rose Petal", value: "from-rose-200 to-pink-300" },
  { name: "Buttercream", value: "from-yellow-200 to-amber-300" },
  { name: "Ice Blue", value: "from-cyan-200 to-sky-300" },
  { name: "Lilac Dream", value: "from-purple-200 to-fuchsia-300" },
  { name: "Vanilla Cream", value: "from-stone-200 to-amber-200" },
  { name: "Cloudy Gray", value: "from-gray-200 to-zinc-300" },
];

// --- Certificate Card ---
const CertificateCard = ({ certificate, onEdit, onDelete }) => {
  const {
    id,
    title,
    issuer,
    year,
    category,
    color = "from-gray-400 to-gray-600",
    src,
    type,
    logo,
  } = certificate;

  const cardBgClass = `bg-linear-to-br ${color}`;

  const isPdf =
    type === "pdf" ||
    (!!src && typeof src === "string" && src.toLowerCase().endsWith(".pdf"));

  const handleViewFile = () => {
    if (!src) return;
    window.open(BASE_SERVER_URL + src, "_blank");
  };


  return (
    <div
      className={`
        ${cardBgClass} text-white p-6 rounded-xl shadow-xl 
        transform transition-all duration-300 ease-in-out 
        hover:scale-[1.02] hover:shadow-2xl hover:brightness-110 
        relative overflow-hidden cursor-pointer
      `}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full transform translate-x-1/2 -translate-y-1/2 blur-lg opacity-50" />

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-start space-x-3 flex-1">
          {logo && (
            <div className="shrink-0 w-10 h-10 rounded-full overflow-hidden bg-white/20 border border-white/40">
              <img
                src={BASE_SERVER_URL + logo}
                alt={`${title} logo`}
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-xl text-slate-800 font-semibold mb-1 leading-tight unbounded-subHeading">
              {title}
            </h3>
            <p className="text-sm text-slate-900 opacity-80 unbounded-subHeading">{issuer}</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(certificate);
            }}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition duration-150"
            title="Edit Certificate"
          >
            <Edit className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
            className="p-2 rounded-full bg-red-500/80 hover:bg-red-600/90 transition duration-150"
            title="Delete Certificate"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {src && (
        <div className="relative z-10 mb-4 rounded-lg overflow-hidden border border-white/30 bg-white/10">
          {isPdf ? (
            <embed
              src={BASE_SERVER_URL + src}
              type="application/pdf"
              className="w-full"
              style={{ height: "160px" }}
            />
          ) : (
            <img src={BASE_SERVER_URL + src} alt={title} className="w-full h-32 object-cover" />
          )}
        </div>
      )}

      <div className="flex justify-between items-center border-t border-white/30 pt-4 relative z-10">
        <span className="text-xs text-slate-800 text-shadow-amber-200 font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm unbounded-subHeading">
          {category}
        </span>
        <span className="text-lg text-slate-800 font-bold sanchez-regular">{year}</span>
      </div>

      {src && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleViewFile();
          }}
          className="mt-4 w-full bg-white/30 hover:bg-white/40 text-slate-800 font-semibold py-2 rounded-lg transition duration-200 backdrop-blur-sm"
        >
          View Full Certificate
        </button>
      )}
    </div>
  );
};

// --- Modal ---
const CertificateFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  certificateToEdit,
}) => {
  const [formData, setFormData] = useState(initialFormState);

  const inferTypeFromSrc = (src) => {
    if (!src || typeof src !== "string") return "";
    if (src.toLowerCase().endsWith(".pdf")) return "pdf";
    return "image";
  };

  useEffect(() => {
    if (certificateToEdit) {
      const inferredType =
        certificateToEdit.type || inferTypeFromSrc(certificateToEdit.src);

      setFormData({
        ...initialFormState,
        ...certificateToEdit,
        type: inferredType,
        file: null,
        logoFile: null,
      });
    } else {
      setFormData(initialFormState);
    }
  }, [certificateToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      file,
      src: previewUrl,
      type: file.type.includes("pdf") ? "pdf" : "image",
    }));
  };

  const handleLogoFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      logoFile: file,
      logo: previewUrl,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  const isEditing = !!certificateToEdit;
  const isPdf = formData.type === "pdf";

  return (
    <div
      className="
        fixed inset-0 z-50 
        bg-gray-900/60 backdrop-blur-sm
        overflow-y-auto           /* allow page scroll when tall */
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="certificate-modal-title"
    >
      {/* This inner flex keeps the card centered but still scrollable on small screens */}
      <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
        {/* Glow / linear frame */}
        <div className="relative w-full max-w-lg">
          <div className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-linear-to-br from-blue-500/50 via-sky-400/40 to-indigo-500/50 opacity-80 blur-md" />

          {/* Modal card */}
          <div
            className="
              relative bg-white/95 rounded-2xl shadow-2xl border border-white/70
              ring-1 ring-blue-100/60 overflow-hidden 
              transform transition-transform duration-300 ease-out
              hover:-translate-y-0.5
              max-h-[90vh]          /* don't exceed viewport height */
              flex flex-col         /* so header + body layout nicely */
            "
            style={{ animation: "modal-pop 0.28s ease-out" }}
          >
            {/* Top accent bar */}
            <div className="h-1.5 bg-linear-to-r from-blue-500 via-indigo-500 to-cyan-400 flex-shrink-0" />

            {/* Scrollable content */}
            <div className="p-5 sm:p-6 overflow-y-auto">
              {/* Header */}
              <div className="flex justify-between items-start pb-4 border-b border-gray-100 gap-3">
                <div>
                  <h2
                    id="certificate-modal-title"
                    className="text-xl sm:text-2xl font-semibold text-gray-900 unbounded-subHeading flex items-center gap-2"
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-inner shadow-blue-100">
                      📜
                    </span>
                    <span>
                      {isEditing ? "Edit Certificate" : "Add New Certificate"}
                    </span>
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-gray-500 sanchez-regular">
                    {isEditing
                      ? "Update the details and files for this certificate."
                      : "Fill in the details and upload the certificate & logo."}
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                {/* Title */}
                <div>
                  <label className="flex items-center justify-between text-sm font-medium text-gray-700 unbounded-subHeading">
                    <span>Title</span>
                    <span className="text-[11px] text-gray-400">Required</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g. ISO 9001:2015 Quality Management"
                    className="mt-1 block w-full border border-gray-200 rounded-xl shadow-sm px-3 py-2.5 text-sm sanchez-regular bg-gray-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70 transition-all"
                  />
                </div>

                {/* Issuer + Year */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 unbounded-subHeading">
                      Issuer
                    </label>
                    <input
                      type="text"
                      name="issuer"
                      value={formData.issuer}
                      onChange={handleChange}
                      required
                      placeholder="e.g. TUV Rheinland"
                      className="mt-1 block w-full border border-gray-200 rounded-xl shadow-sm px-3 py-2.5 text-sm sanchez-regular bg-gray-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 unbounded-subHeading">
                      Year
                    </label>
                    <input
                      type="text"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      required
                      placeholder="e.g. 2024"
                      className="mt-1 block w-full border border-gray-200 rounded-xl shadow-sm px-3 py-2.5 text-sm sanchez-regular bg-gray-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70 transition-all"
                    />
                  </div>
                </div>

                {/* Category + Certificate file */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 unbounded-subHeading">
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Quality, Safety"
                      className="mt-1 block w-full border border-gray-200 rounded-xl shadow-sm px-3 py-2.5 text-sm sanchez-regular bg-gray-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 unbounded-subHeading">
                      Certificate File (Image / PDF)
                    </label>
                    <div className="mt-1">
                      <label className="flex items-center justify-between gap-2 rounded-xl border border-dashed border-blue-300 bg-linear-to-r from-blue-50/70 via-sky-50/70 to-indigo-50/60 px-3 py-2.5 text-xs sm:text-sm text-gray-700 cursor-pointer hover:border-blue-500 hover:bg-blue-50/80 transition-all">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-inner shadow-blue-100 text-blue-600">
                            📁
                          </span>
                          <span className="sanchez-regular">
                            <span className="font-semibold">Click to upload</span>{" "}
                            <span className="hidden sm:inline">
                              or drag & drop (JPG, PNG, PDF)
                            </span>
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-500">
                          Max ~5MB
                        </span>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {formData.src && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs text-gray-500 unbounded-subHeading">
                          File Preview
                        </p>
                        {isPdf ? (
                          <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-50/80">
                            <embed
                              src={BASE_SERVER_URL + formData.src}
                              type="application/pdf"
                              className="w-full"
                              style={{ height: "260px" }}
                            />
                          </div>
                        ) : (
                          <div className="h-28 rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
                            <img
                              src={BASE_SERVER_URL + formData.src}
                              alt="Certificate preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Logo upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 unbounded-subHeading">
                    Certificate Logo (Image)
                  </label>
                  <div className="mt-1">
                    <label className="flex items-center justify-between gap-2 rounded-xl border border-dashed border-amber-300 bg-linear-to-r from-amber-50/70 via-orange-50/70 to-yellow-50/60 px-3 py-2.5 text-xs sm:text-sm text-gray-700 cursor-pointer hover:border-amber-500 hover:bg-amber-50/80 transition-all sanchez-regular">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-inner shadow-amber-100 text-amber-500">
                          🏷️
                        </span>
                        <span className="font-semibold">Upload logo</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {formData.logo && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-gray-500 unbounded-subHeading">
                        Logo Preview
                      </p>
                      <div className="h-16 w-16 rounded-full overflow-hidden border border-gray-200 bg-white flex items-center justify-center shadow-sm">
                        <img
                          src={BASE_SERVER_URL + formData.logo}
                          alt="Logo preview"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Color scheme */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 unbounded-subHeading">
                    Card Color Scheme
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COLOR_OPTIONS.map((option) => {
                      const isActive = formData.color === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              color: option.value,
                            }))
                          }
                          className={`
                            relative p-0.5 rounded-full border-2 transition-all duration-200
                            bg-linear-to-br ${option.value}
                            ${
                              isActive
                                ? "border-blue-500 shadow-md shadow-blue-300/60 scale-105"
                                : "border-transparent hover:border-gray-300 hover:scale-105"
                            }
                          `}
                          title={option.name}
                        >
                          <div className="w-7 h-7 rounded-full opacity-90" />
                          {isActive && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="h-3 w-3 rounded-full bg-white/90 shadow-sm" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center items-center px-4 py-2.5 text-sm font-semibold rounded-xl shadow-md shadow-blue-500/30 text-white bg-linear-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-700 hover:via-indigo-700 hover:to-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 active:scale-[0.98] transition-all unbounded-subHeading"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isEditing ? "Save Changes" : "Add Certificate"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Simple keyframes for pop-in & fade-in */}
        <style>{`
          @keyframes modal-pop {
            0% {
              opacity: 0;
              transform: translateY(12px) scale(0.96);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

// --- Main Page ---
export default function CertificatesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [certificateToEdit, setCertificateToEdit] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all certificates
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${BASE_SERVER_URL}/api/certs`);
        setCertificates(res.data.data || []);
      } catch (err) {
        console.error("Error fetching certificates:", err);
        setError("Failed to load certificates from server.");
        toast.error("Failed to load certificates from server.");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const handleAddClick = () => {
    setCertificateToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (certificate) => {
    setCertificateToEdit(certificate);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_SERVER_URL}/api/certs/${id}`);
      setCertificates((prev) => prev.filter((c) => c.id !== id));
      toast.success("Successfully! deleted")
    } catch (error) {
      console.error("Error deleting certificate:", error);
      toast.error("Failed to delete certificate.");
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      const isEditing = !!formData.id;
      const data = new FormData();

      data.append("title", formData.title);
      data.append("issuer", formData.issuer);
      data.append("year", formData.year);
      data.append("category", formData.category);
      data.append("color", formData.color);

      if (formData.file) {
        data.append("src", formData.file); // main file
      }

      if (formData.logoFile) {
        data.append("logo", formData.logoFile); // logo file
      }

      let res;

      if (isEditing) {
        res = await axios.put(
          `${BASE_SERVER_URL}/api/certs/${formData.id}`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const updated = res.data.data;
        setCertificates((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c))
        );

        toast.success("Successfully! updated");
      } else {
        res = await axios.post(`${BASE_SERVER_URL}/api/certs`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const created = res.data.data;
        setCertificates((prev) => [...prev, created]);
        toast.success("Successfully! added");
      }

      setCertificateToEdit(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving certificate:", error);
      toast.error("Failed to save certificate.");
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen p-4 sm:p-8 lg:p-12 bg-linear-to-br from-white via-gray-50 to-blue-50">
        <header className="mb-10 p-6 bg-white/90 rounded-xl shadow-lg border border-gray-100 backdrop-blur-sm">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider flex items-center unbounded-heading">
            <Award className="w-4 h-4 mr-2" />
            {CERT_HERO_CONTENT.eyebrow}
          </p>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1 mb-3 unbounded-subHeading">
            {CERT_HERO_CONTENT.title}
          </h1>
          <p className="text-gray-600 max-w-3xl sanchez-regular">
            {CERT_HERO_CONTENT.description}
          </p>
        </header>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 unbounded-subHeading">
            Certificates ({certificates.length})
          </h2>
          <button
            onClick={handleAddClick}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-md text-white bg-blue-500 hover:bg-blue-600 unbounded-subHeading"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add New
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-10">
            Loading certificates...
          </div>
        ) : certificates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {certificates.map((cert) => (
              <CertificateCard
                key={cert.id}
                certificate={cert}
                onEdit={handleEditClick}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-10 border-2 border-dashed border-gray-300 rounded-xl bg-white/50">
            <p className="text-gray-500 unbounded-subHeading">
              No certificates found. Click &apos;Add New&apos; to begin managing
              your compliance data.
            </p>
          </div>
        )}

        <CertificateFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
          certificateToEdit={certificateToEdit}
        />
      </div>
    </>
  );
}