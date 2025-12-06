import { useEffect, useState, Fragment, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import { Toaster, toast } from "react-hot-toast";

// ======================== CONSTANTS =================================

const BASE_SERVER_URL = "http://localhost:3000";
const LIST_API_URL = `${BASE_SERVER_URL}/api/contact/list-enquiries`;
const UPDATE_STATUS_API_URL = (id) =>
  `${BASE_SERVER_URL}/api/contact/enquiries/${id}/status`;

// =========================== MAIN ==============================================

export default function EnquiriesPage() {
  const [data, setData] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch data from server
  useEffect(() => {
    const fetchEnquiry = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(LIST_API_URL);
        setData(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch enquiries:", err);
        setError("Failed to load enquiries. Please try again.");
        toast.error("Failed to load enquiries. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiry();
  }, []);

  const formatList = (value) => {
    if (!value) return "-";

    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed.join(", ");
        return value;
      } catch {
        return value;
      }
    }

    if (Array.isArray(value)) return value.join(", ");

    return String(value);
  };

  const truncate = (text, length = 60) => {
    if (!text) return "-";
    if (text.length <= length) return text;
    return text.slice(0, length) + "…";
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const status = (item.status || "").toLowerCase();

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "seen" && status === "seen") ||
        (statusFilter === "unseen" && status !== "seen");

      return matchesStatus;
    });
  }, [data, statusFilter]);

  const unseenCount = useMemo(
    () =>
      data.filter(
        (item) => (item.status || "").toLowerCase() !== "seen"
      ).length,
    [data]
  );

  const handleRowClick = async (rowId, item) => {
    const currentStatus = (item.status || "").toLowerCase();
    setExpandedId((prev) => (prev === rowId ? null : rowId));

    if (currentStatus !== "seen") {
      try {
        await axios.patch(UPDATE_STATUS_API_URL(rowId), {
          status: "seen",
        });

        setData((prev) =>
          prev.map((row) =>
            (row.id || row._id || row) === rowId
              ? { ...row, status: "seen" }
              : row
          )
        );
      } catch (err) {
        console.error("Failed to update status:", err);
        toast.error("Failed to update status");
      }
    }
  };

  const handleRowKeyDown = (e, rowId, item) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleRowClick(rowId, item);
    }
  };

  const handleDownloadExcel = () => {
    if (!filteredData.length) return;

    const exportRows = filteredData.map((item, index) => ({
      "#": index + 1,
      Name: item.name,
      Company: item.company || "",
      Email: item.email,
      CountryCode: item.country_code || "",
      Phone: item.phone || "",
      Message: item.message || "",
      Categories: formatList(item.categories),
      Products: formatList(item.products),
      Status: item.status || "",
    }));

    const ws = XLSX.utils.json_to_sheet(exportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Enquiries");
    XLSX.writeFile(wb, "enquiries.xlsx");
  };

  // Loading / Error / Empty states
  if (loading) {
    return (
      <div className="w-full py-12 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-slate-50 via-indigo-50 to-sky-50" />
        <div className="pointer-events-none absolute -top-32 -left-10 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-10 h-64 w-64 rounded-full bg-sky-200/30 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative flex flex-col items-center gap-3 rounded-2xl bg-white/70 px-6 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.12)] border border-slate-100 backdrop-blur-xl"
        >
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <p className="text-slate-700 text-sm font-medium">
              Fetching enquiries
            </p>
          </div>
          <div className="flex gap-1.5">
            <span className="h-1.5 w-6 rounded-full bg-slate-200 animate-pulse" />
            <span className="h-1.5 w-10 rounded-full bg-slate-200 animate-pulse" />
            <span className="h-1.5 w-8 rounded-full bg-slate-200 animate-pulse" />
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-12 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-rose-50 via-amber-50 to-slate-50" />
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-md mx-auto bg-white/80 border border-rose-200 rounded-2xl shadow-[0_18px_45px_rgba(127,29,29,0.16)] px-4 py-3.5 flex items-center gap-2.5 backdrop-blur-xl"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
          </div>
          <p className="text-rose-700 text-sm">{error}</p>
        </motion.div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="w-full py-12 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-slate-50 via-indigo-50/60 to-emerald-50" />
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-sm mx-auto text-center rounded-2xl bg-white/80 border border-slate-100 px-5 py-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl"
        >
          <p className="text-slate-600 text-sm">
            No enquiries found yet. They&apos;ll appear here as soon as someone
            reaches out.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full relative overflow-hidden">
        <motion.div
          className="relative max-w-6xl mx-auto space-y-4 py-4 px-3 sm:px-4"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Header + Status filter + Download */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-2xl font-semibold text-slate-900 unbounded-subHeading">
                Enquiries
              </h2>
              <p className="mt-0.5 text-xs sm:text-sm text-slate-500 flex items-center flex-wrap gap-2 sanchez-regular">
                <span>
                  Showing{" "}
                  <span className="font-semibold text-slate-800">
                    {filteredData.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-800">
                    {data.length}
                  </span>{" "}
                  enquiries
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-0.5 border border-slate-200 text-[0.7rem] shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  <span className="text-slate-600">
                    Unseen:{" "}
                    <span className="font-semibold text-slate-900">
                      {unseenCount}
                    </span>
                  </span>
                </span>
              </p>
            </div>

            {/* Status filter + Download button */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto justify-end unbounded-heading">
              <FilterSelect
                label="Status"
                value={statusFilter}
                onChange={setStatusFilter}
                options={["seen", "unseen"]}
                showAll
              />

              <button
                type="button"
                onClick={handleDownloadExcel}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-slate-100 text-slate-700 px-3.5 py-2 text-[0.7rem] sm:text-xs font-medium shadow-sm hover:bg-slate-200 active:bg-slate-300 border border-slate-200 transition-colors w-full sm:w-auto"
              >
                <span className="inline-block h-3.5 w-3.5 border border-slate-300 rounded-[0.35rem] relative shrink-0">
                  <span className="absolute inset-x-0.5 top-[3px] h-0.5 rounded-full bg-slate-300" />
                  <span className="absolute inset-x-0.5 top-[6px] h-0.5 rounded-full bg-slate-300" />
                  <span className="absolute inset-x-0.5 top-[9px] h-0.5 rounded-full bg-slate-200" />
                </span>
                <span>Download Excel</span>
              </button>
            </div>
          </div>

          {/* Card container */}
          <motion.div
            className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-[0_22px_55px_rgba(15,23,42,0.18)]"
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
          >
            <div className="overflow-hidden rounded-3xl">
              {/* ============ MOBILE ACCORDION VIEW ( < md ) ============ */}
              <div className="block md:hidden p-2 sm:p-3 space-y-2">
                {filteredData.map((item, index) => {
                  const rowId = item.id || item._id || index;
                  const isExpanded = expandedId === rowId;

                  const categoriesDisplay = formatList(item.categories);
                  const productsDisplay = formatList(item.products);

                  const status = (item.status || "").toLowerCase();
                  const isSeen = status === "seen";
                  const statusLabel = status || "unseen";

                  return (
                    <motion.div
                      key={rowId}
                      layout
                      className="rounded-2xl border border-slate-200 bg-slate-50/80 shadow-sm overflow-hidden"
                    >
                      {/* Accordion header */}
                      <button
                        type="button"
                        onClick={() => handleRowClick(rowId, item)}
                        className="w-full px-3 py-2.5 flex flex-col gap-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50"
                        aria-expanded={isExpanded}
                      >
                        {/* Top row: #, Name, Status (columns feel) */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-[0.65rem] text-slate-500 sanchez-regular">
                              #{index + 1}
                            </span>
                            <span className="text-sm font-semibold text-slate-900 truncate sanchez-regular">
                              {item.name}
                            </span>
                          </div>
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.65rem] unbounded-subHeading font-semibold capitalize shadow-sm ${
                              isSeen
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}
                          >
                            <span
                              className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                                isSeen ? "bg-emerald-500" : "bg-rose-500"
                              }`}
                            />
                            {statusLabel}
                          </span>
                        </div>

                        {/* Second row: Email + short message (like columns) */}
                        <div className="grid grid-cols-1 gap-1.5">
                          <div className="text-[0.7rem] text-indigo-600 underline decoration-dotted underline-offset-2 break-all sanchez-regular">
                            {item.email}
                          </div>
                          <div className="text-[0.7rem] text-slate-600 line-clamp-2 sanchez-regular">
                            {truncate(item.message, 80)}
                          </div>
                        </div>

                        {/* Expand / collapse indicator */}
                        <div className="flex items-center justify-end pt-0.5">
                          <span className="text-[0.65rem] text-slate-500 flex items-center gap-1">
                            <span>{isExpanded ? "Hide details" : "View details"}</span>
                            <span
                              className={`inline-block transition-transform duration-200 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            >
                              ▾
                            </span>
                          </span>
                        </div>
                      </button>

                      {/* Accordion content */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                            className="border-t border-slate-200 bg-white/90"
                          >
                            <div className="px-3 py-3 space-y-2.5">
                              <div className="grid grid-cols-2 gap-2 text-[0.7rem]">
                                <DetailField label="Name" value={item.name} />
                                <DetailField
                                  label="Company"
                                  value={item.company || "-"}
                                />
                                <DetailField label="Email" value={item.email} />
                                <DetailField
                                  label="Phone"
                                  value={
                                    item.phone
                                      ? `${item.country_code || ""} ${
                                          item.phone
                                        }`
                                      : "-"
                                  }
                                />
                                <DetailField
                                  label="Country Code"
                                  value={item.country_code || "-"}
                                />
                                <DetailField
                                  label="Status"
                                  value={item.status || "unseen"}
                                />
                                <DetailField
                                  label="Categories"
                                  value={categoriesDisplay || "-"}
                                />
                                <DetailField
                                  label="Products"
                                  value={productsDisplay || "-"}
                                />
                              </div>

                              <div className="pt-1">
                                <div className="text-[0.7rem] font-semibold tracking-[0.12em] text-slate-500 uppercase mb-1.5 unbounded-heading">
                                  Message
                                </div>
                                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[0.7rem] text-slate-800 whitespace-pre-wrap leading-relaxed shadow-inner sanchez-regular">
                                  {item.message || "-"}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>

              {/* ============ DESKTOP TABLE VIEW ( ≥ md ) ============ */}
              <div className="hidden md:block">
                <div className="w-full overflow-x-auto">
                  <table className="min-w-full text-xs sm:text-sm">
                    <thead className="bg-linear-to-r from-slate-50 via-indigo-50/80 to-sky-50/80">
                      <tr className="text-[0.7rem] sm:text-xs uppercase tracking-[0.12em] text-slate-500">
                        <th
                          scope="col"
                          className="px-3 py-3 text-left font-semibold border-b border-slate-200/70 unbounded-heading"
                        >
                          #
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3 text-left font-semibold border-b border-slate-200/70 unbounded-heading"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3 text-left font-semibold border-b border-slate-200/70 unbounded-heading"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="hidden lg:table-cell px-3 py-3 text-left font-semibold border-b border-slate-200/70 unbounded-heading"
                        >
                          Company
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3 text-left font-semibold border-b border-slate-200/70 unbounded-heading"
                        >
                          Message
                        </th>
                        <th
                          scope="col"
                          className="hidden xl:table-cell px-3 py-3 text-left font-semibold border-b border-slate-200/70 unbounded-heading"
                        >
                          Categories
                        </th>
                        <th
                          scope="col"
                          className="hidden xl:table-cell px-3 py-3 text-left font-semibold border-b border-slate-200/70 unbounded-heading"
                        >
                          Products
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3 text-left font-semibold border-b border-slate-200/70 unbounded-heading"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200/80">
                      {filteredData.map((item, index) => {
                        const rowId = item.id || item._id || index;
                        const isExpanded = expandedId === rowId;

                        const categoriesDisplay = formatList(item.categories);
                        const productsDisplay = formatList(item.products);

                        const status = (item.status || "").toLowerCase();
                        const isSeen = status === "seen";
                        const statusLabel = status || "unseen";

                        return (
                          <Fragment key={rowId}>
                            <motion.tr
                              onClick={() => handleRowClick(rowId, item)}
                              onKeyDown={(e) =>
                                handleRowKeyDown(e, rowId, item)
                              }
                              tabIndex={0}
                              role="button"
                              aria-expanded={isExpanded}
                              className={`cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 ${
                                index % 2 === 0
                                  ? "bg-white"
                                  : "bg-slate-50/70"
                              } hover:bg-indigo-50/90`}
                              whileHover={{ scale: 1.002 }}
                              transition={{ duration: 0.15 }}
                            >
                              <td className="px-3 py-3 text-center text-[0.7rem] sm:text-xs text-slate-500 sanchez-regular">
                                {index + 1}
                              </td>
                              <td className="px-3 py-3 text-sm font-semibold text-slate-900 sanchez-regular">
                                {item.name}
                              </td>
                              <td className="px-3 py-3 text-[0.7rem] sm:text-sm text-indigo-600 underline decoration-dotted underline-offset-2 break-all sanchez-regular">
                                {item.email}
                              </td>
                              <td className="hidden lg:table-cell px-3 py-3 text-xs sm:text-sm text-slate-600 sanchez-regular">
                                {item.company || "-"}
                              </td>
                              <td className="px-3 py-3 text-xs sm:text-sm text-slate-600 sanchez-regular text-justify">
                                {truncate(item.message, 50)}
                              </td>
                              <td className="hidden xl:table-cell px-3 py-3 text-xs sm:text-sm text-slate-600 sanchez-regular text-justify">
                                {categoriesDisplay || "-"}
                              </td>
                              <td className="hidden xl:table-cell px-3 py-3 text-xs sm:text-sm text-slate-600 sanchez-regular text-justify">
                                {productsDisplay || "-"}
                              </td>
                              <td className="px-3 py-3">
                                <span
                                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.7rem] unbounded-subHeading font-semibold capitalize shadow-sm ${
                                    isSeen
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : "bg-rose-50 text-rose-700 border-rose-200"
                                  }`}
                                >
                                  <span
                                    className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                                      isSeen ? "bg-emerald-500" : "bg-rose-500"
                                    }`}
                                  />
                                  {statusLabel}
                                </span>
                              </td>
                            </motion.tr>

                            <AnimatePresence initial={false}>
                              {isExpanded && (
                                <motion.tr
                                  key={`${rowId}-details`}
                                  className="bg-slate-50/80"
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{
                                    duration: 0.22,
                                    ease: "easeOut",
                                  }}
                                >
                                  <td
                                    colSpan={8}
                                    className="px-3 sm:px-4 pb-4 pt-0 border-t border-slate-200/80"
                                  >
                                    <motion.div
                                      className="mt-2 rounded-2xl border border-slate-200 bg-white/90 p-3 sm:p-4 shadow-sm"
                                      initial={{ opacity: 0, y: -6 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -4 }}
                                      transition={{ duration: 0.18 }}
                                    >
                                      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 text-xs sm:text-sm text-slate-700">
                                        <DetailField
                                          label="Name"
                                          value={item.name}
                                        />
                                        <DetailField
                                          label="Company"
                                          value={item.company || "-"}
                                        />
                                        <DetailField
                                          label="Email"
                                          value={item.email}
                                        />
                                        <DetailField
                                          label="Phone"
                                          value={
                                            item.phone
                                              ? `${item.country_code || ""} ${
                                                  item.phone
                                                }`
                                              : "-"
                                          }
                                        />
                                        <DetailField
                                          label="Country Code"
                                          value={item.country_code || "-"}
                                        />
                                        <DetailField
                                          label="Categories"
                                          value={categoriesDisplay || "-"}
                                        />
                                        <DetailField
                                          label="Products"
                                          value={productsDisplay || "-"}
                                        />
                                        <DetailField
                                          label="Status"
                                          value={item.status || "unseen"}
                                        />

                                        <div className="sm:col-span-2 lg:col-span-3">
                                          <div className="text-[0.7rem] font-semibold tracking-[0.12em] text-slate-500 uppercase mb-1.5 unbounded-heading">
                                            Message
                                          </div>
                                          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed shadow-inner sanchez-regular">
                                            {item.message || "-"}
                                          </div>
                                        </div>
                                      </div>
                                    </motion.div>
                                  </td>
                                </motion.tr>
                              )}
                            </AnimatePresence>
                          </Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Table / list footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-slate-50/90 px-4 py-2.5">
              <p className="text-[0.7rem] sm:text-xs text-slate-500 flex items-center gap-1.5 unbounded-heading">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                On mobile, tap any card to expand details. On desktop, click a
                row or press Enter to view full enquiry details. Unseen items are
                automatically marked as seen.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <Toaster position="top-right" />
    </>
  );
}

function DetailField({ label, value }) {
  return (
    <div>
      <div className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-slate-500 mb-0.5 unbounded-heading">
        {label}
      </div>
      <div className="text-xs sm:text-sm text-slate-900 wrap-break-word sanchez-regular">
        {value || "-"}
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options, showAll = false }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 text-[0.7rem] sm:text-xs w-full sm:w-auto">
      <span className="text-slate-500">{label}:</span>
      <select
        className="rounded-full border border-slate-200 bg-white/80 px-2.5 py-2 text-[0.7rem] sm:text-xs text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 w-full sm:w-auto"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      >
        {showAll && (
          <option className="unbounded-heading" value="all">
            All {label.toLowerCase()}
          </option>
        )}
        {options.map((opt) => (
          <option className="unbounded-heading" key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}