import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import axios from "axios";

const PIE_COLORS = [
  "#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231",
  "#911eb4", "#46f0f0", "#f032e6", "#bcf60c", "#fabebe",
  "#008080", "#e6beff", "#9a6324", "#fffac8", "#800000",
  "#aaffc3", "#808000", "#ffd8b1", "#000075", "#808080",
  "#ffffff", "#000000", "#ffe6e6", "#b30000", "#ff6666",
  "#ff1a1a", "#990000", "#ff751a", "#ff944d", "#b35900",
  "#e6b800", "#ffff33", "#ccff33", "#99ff33", "#66ff33",
  "#33ff33", "#00ff00", "#00e600", "#00cc00", "#00b300",
  "#009900", "#008000", "#33ff99", "#66ffcc", "#99ffff",
  "#66d9ff", "#33adff", "#0073e6", "#004d99", "#001f4d",
  "#b3ccff", "#9999ff", "#b366ff", "#cc33ff", "#e600e6",
  "#ff33cc", "#ff66b3", "#ff99cc", "#ffccff", "#ffdf00",
  "#ffd000", "#ffc100", "#ffb200", "#ffa300", "#ff9400",
  "#ff8500", "#ff7600", "#ff6700", "#ff5800", "#ff4900",
  "#ff3a00", "#ff2b00", "#ff1c00", "#ff0d00", "#ff0000",
  "#ff004d", "#cc0066", "#990073", "#660080", "#33004d",
  "#4d0033", "#590047", "#66005a", "#73006e", "#800082",
  "#8c0096", "#9900a9", "#a600bd", "#b300d1", "#bf00e5",
  "#cc00f9", "#d700ff", "#e000ff", "#ea00ff", "#f300ff",
  "#fc00ff", "#ff00fc", "#ff00f5", "#ff00ed", "#ff00e6"
];

const DashboardPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [enquiriesByCategory, setEnquiriesByCategory] = useState([]);
  const [enquiriesByProduct, setEnquiriesByProduct] = useState([]);
  const [enquiriesOverTime, setEnquiriesOverTime] = useState([]);
  const [activityLog, setActivityLog] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const enqRes = await axios.get(
        "http://localhost:3000/api/contact/list-enquiries"
      );

      const logRes = await axios.get("http://localhost:3000/api/logs/get-logs");
      const data = enqRes.data.data;

      // --------- Activity Log: format date+time and sort newest → oldest ----------
      let logData = logRes.data.data.map((item) => {
        const date = new Date(item.created_at);

        const formattedDate = date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }); // e.g. "06 Dec 2025"

        const formattedTime = date.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }); // e.g. "09:05 AM"

        return {
          id: item.id,
          time: `${formattedDate} • ${formattedTime}`, // date + time string
          timestamp: date.getTime(),                  // for sorting
          type: item.topic,
          detail: item.detail,
        };
      });

      // sort by timestamp descending (latest first)
      logData = logData.sort((a, b) => b.timestamp - a.timestamp);

      setEnquiries(data);
      setActivityLog(logData);

      // ---------------------------
      // 1) Enquiries by Category
      // ---------------------------
      const categoryMap = data.reduce((acc, item) => {
        const categories =
          item.categories && Array.isArray(item.categories)
            ? item.categories
            : ["Uncategorized"];

        categories.forEach((category) => {
          acc[category] = (acc[category] || 0) + 1;
        });

        return acc;
      }, {});

      const catRes = Object.entries(categoryMap).map(([name, value]) => ({
        name,
        value,
      }));
      setEnquiriesByCategory(catRes);

      // ---------------------------
      // 2) Enquiries by Product
      //    (similar to categories)
      // ---------------------------
      const productMap = data.reduce((acc, item) => {
        const products =
          item.products && Array.isArray(item.products)
            ? item.products
            : [item.product || "Unspecified Product"];

        products.forEach((product) => {
          acc[product] = (acc[product] || 0) + 1;
        });

        return acc;
      }, {});

      const prodRes = Object.entries(productMap).map(([name, value]) => ({
        name,
        value,
      }));
      setEnquiriesByProduct(prodRes);

      // ---------------------------
      // 3) Enquiries over Time
      //    from created_at -> "HH:00"
      // ---------------------------
      const timeMap = data.reduce((acc, item) => {
        if (!item.created_at) return acc;

        const date = new Date(item.created_at);
        if (isNaN(date.getTime())) return acc;

        const hours = String(date.getHours()).padStart(2, "0"); // 0-23 -> "00".."23"
        const label = `${hours}:00`; // "11:00"

        acc[label] = (acc[label] || 0) + 1;
        return acc;
      }, {});

      const timeRes = Object.entries(timeMap)
        .sort(([a], [b]) => a.localeCompare(b)) // sort by time string
        .map(([time, enquiries]) => ({
          time,
          enquiries,
        }));

      setEnquiriesOverTime(timeRes);
    };

    fetchData();
  }, []);

  const unseenCount = enquiries.filter((item) => item.status === "unseen").length;
  const seenCount = enquiries.filter((item) => item.status === "seen").length;

  const unseenPercent =
    enquiries.length > 0
      ? ((unseenCount / enquiries.length) * 100).toFixed(0)
      : 0;
  const seenPercent =
    enquiries.length > 0 ? ((seenCount / enquiries.length) * 100).toFixed(0) : 0;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <header
        className="
          flex flex-col gap-2 md:flex-row md:items-center md:justify-between
          transform-gpu transition-all duration-300
          hover:drop-shadow-[0_6px_10px_rgba(0,0,0,0.15)]
        "
      >

        <div className="group">
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight unbounded-subHeading relative w-fit transition-all duration-300group-hover:text-slate-800">
            Dashboard
            {/* animated underline */}
            <span className="absolute left-0 -bottom-1 h-[3px] w-0 bg-linear-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 group-hover:w-full" />
          </h1>

          <p className="text-sm text-slate-500 mt-0.5 sanchez-regular transition-all duration-300 group-hover:text-slate-600">
            Overview of enquiries, categories and recent activity.
          </p>
        </div>

        {/* Live status */}
        <div className="flex items-center gap-2 text-xs text-slate-500 unbounded-subHeading font-medium tracking-wide select-none transition-all duration-300">
          {/* pulsing live dot */}
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-70 animate-ping" />
          </span>
          Live data · Updated just now
        </div>
      </header>

      {/* KPIs */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

        {/* Total Enquiries */}
        <div className="group rounded-2xl border border-blue-200 bg-linear-to-r from-blue-200 to-blue-400 backdrop-blur-sm shadow-sm p-4 flex flex-col relative overflow-hidden transform-gpu transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-300/70">
          {/* subtle highlight strip */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-white/20 blur-2 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-300" />

          <div className="flex items-center gap-2 text-blue-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 transform-gpu transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0l-8 5m8-5l-8 5m0 0l-8-5"
              />
            </svg>
            <p className="text-xs font-semibold unbounded-heading tracking-wide uppercase">Total Enquiries</p>
          </div>

          <p className="mt-3 text-4xl font-extrabold sanchez-regular text-blue-900 drop-shadow-[0_3px_4px_rgba(0,0,0,0.35)] transform-gpu transition-transform duration-300 group-hover:scale-110 group-hover:translate-y-0.5">
            {enquiries.length}
          </p>
        </div>

        {/* Open / In Progress */}
        <div className="group rounded-2xl border border-amber-200 bg-linear-to-r from-amber-200 to-amber-400 backdrop-blur-sm shadow-sm p-4 flex flex-col relative overflow-hidden transform-gpu transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-300/70">
          <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-white/25 blur-2 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-300" />

          <div className="flex items-center gap-2 text-amber-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 transform-gpu transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-xs font-semibold tracking-wide uppercase unbounded-heading">
              Open / In Progress
            </p>
          </div>

          <p className="mt-3 text-4xl font-extrabold text-amber-900 sanchez-regular drop-shadow-[0_3px_4px_rgba(0,0,0,0.35)] transform-gpu transition-transform duration-300 group-hover:scale-110 group-hover:translate-y-0.5">{unseenCount}</p>
          <p className="mt-1 text-xs text-amber-800 font-medium unbounded-subHeading">
            {unseenPercent}% of all enquiries
          </p>
        </div>

        {/* Completed */}
        <div
          className="group rounded-2xl border border-green-200 bg-gradient-to-r from-green-200 to-green-400 backdrop-blur-sm shadow-sm p-4 flex flex-col relative overflow-hidden transform-gpu transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-300/70">
          <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-white/25 blur-2 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-300" />

          <div className="flex items-center gap-2 text-green-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 transform-gpu transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="text-xs font-semibold tracking-wide uppercase unbounded-heading">
              Completed
            </p>
          </div>

          <p className="mt-3 text-4xl font-extrabold text-green-900 sanchez-regular drop-shadow-[0_3px_4px_rgba(0,0,0,0.35)] transform-gpu transition-transform duration-300 group-hover:scale-110 group-hover:translate-y-0.5">{seenCount}</p>
          <p className="mt-1 text-xs text-green-800 font-medium unbounded-subHeading">
            {seenPercent}% of all enquiries
          </p>
        </div>
      </section>

      {/* Charts row 1 */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Line chart: Enquiries over Time */}
        <div className="group col-span-1 xl:col-span-2 min-w-0 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm p-4 md:p-5 flex flex-col relative overflow-hidden transform-gpu transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.01] hover:shadow-2xl hover:shadow-slate-300/80">
          {/* highlight blob */}
          <div className="pointer-events-none absolute -right-14 -top-16 h-32 w-32 rounded-full bg-sky-100/70 blur-3 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-300" />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-slate-50 shadow-md shadow-slate-400/40 transform-gpu transition-transform duration-300 group-hover:scale-110">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900 unbounded-subHeading">
                  Enquiries by Time
                </h2>
                <p className="text-xs text-slate-500 sanchez-regular">
                  Most user enquiries received throughout the day.
                </p>
              </div>
            </div>
          </div>

          <div className="w-full h-64 min-w-0 mt-1 transform-gpu transition-transform duration-300 group-hover:scale-[1.01]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={enquiriesOverTime}
                margin={{ left: -20, right: 10, top: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  axisLine={{ stroke: "#e5e7eb" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "0.75rem",
                    borderColor: "#e5e7eb",
                    fontSize: "0.75rem",
                    boxShadow: "0 10px 25px rgba(15,23,42,0.12)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="enquiries"
                  stroke="#0f172a"
                  strokeWidth={2.2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  isAnimationActive={true}
                  animationDuration={700}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie chart: Enquiries by Category */}
        <div className="group min-w-0 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-200 backdrop-blur-sm shadow-sm p-4 md:p-5 flex flex-col relative overflow-hidden transform-gpu transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.01] hover:shadow-2xl hover:shadow-slate-300/80">
          {/* highlight blob */}
          <div className="pointer-events-none absolute -left-12 -bottom-10 h-32 w-32 rounded-full bg-slate-300/50 blur-3 group-hover:-translate-x-2 group-hover:-translate-y-2 transition-transform duration-300" />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-slate-50 shadow-md shadow-slate-500/40 transform-gpu transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11.25 4.5l.75 7.5 7.5.75M4.5 12a7.5 7.5 0 0012.69 5.303L12 12z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900 unbounded-subHeading">
                  Enquiries by Category
                </h2>
                <p className="text-xs text-slate-500 sanchez-regular">
                  Distribution of enquiries across product categories.
                </p>
              </div>
            </div>
          </div>

          <div className="w-full h-64 min-w-0 transform-gpu transition-transform duration-300 group-hover:scale-[1.01]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={enquiriesByCategory}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={45}
                  outerRadius={72}
                  paddingAngle={3}
                  stroke="transparent"
                  isAnimationActive={true}
                  animationDuration={700}
                  animationEasing="ease-out"
                >
                  {enquiriesByCategory.map((entry, index) => (
                    <Cell
                      key={`cat-cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                      className="transition-all duration-300"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "0.75rem",
                    borderColor: "#e5e7eb",
                    fontSize: "0.75rem",
                    boxShadow: "0 10px 25px rgba(15,23,42,0.12)",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-xs text-slate-600">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Charts row 2 + activity log */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Pie chart: Enquiries by Product */}
        <div className="group min-w-0 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-200 backdrop-blur-sm shadow-sm p-4 md:p-5 flex flex-col relative overflow-hidden transform-gpu transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.01] hover:shadow-2xl hover:shadow-slate-300/80">
          {/* highlight blob */}
          <div className="pointer-events-none absolute -left-12 -top-10 h-28 w-28 rounded-full bg-slate-300/50 blur-3 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300" />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-slate-50 shadow-md shadow-slate-500/40 transform-gpu transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11.25 4.5l.75 7.5 7.5.75M4.5 12a7.5 7.5 0 0012.69 5.303L12 12z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900 unbounded-subHeading">
                  Enquiries by Product
                </h2>
                <p className="text-xs text-slate-500 sanchez-regular">
                  Distribution of enquiries across products.
                </p>
              </div>
            </div>
          </div>

          <div className="w-full h-64 min-w-0 transform-gpu transition-transform duration-300 group-hover:scale-[1.01]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={enquiriesByProduct}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={45}
                  outerRadius={72}
                  paddingAngle={3}
                  stroke="transparent"
                  isAnimationActive={true}
                  animationDuration={700}
                  animationEasing="ease-out"
                >
                  {enquiriesByProduct.map((entry, index) => (
                    <Cell
                      key={`prod-cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                      className="transition-all duration-300"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "0.75rem",
                    borderColor: "#e5e7eb",
                    fontSize: "0.75rem",
                    boxShadow: "0 10px 25px rgba(15,23,42,0.12)",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-xs text-slate-600">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity log */}
        <div className="group rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm p-4 md:p-5 flex flex-col relative overflow-hidden transform-gpu transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.01] hover:shadow-2xl hover:shadow-slate-300/80">
          {/* subtle highlight */}
          <div className="pointer-events-none absolute -right-12 -bottom-10 h-28 w-28 rounded-full bg-sky-100/70 blur-3 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-300" />

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-slate-50 shadow-md shadow-slate-500/40 transform-gpu transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7M5 7h14"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900 unbounded-subHeading">
                  Activity Log
                </h2>
                <p className="text-xs text-slate-500 sanchez-regular">
                  Latest updates across your enquiries.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-2 space-y-3 max-h-64 overflow-y-auto pr-1">
            {activityLog.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 border-b border-slate-100 pb-2 last:border-0 last:pb-0 transform-gpu transition-all duration-200 hover:bg-slate-50/80 hover:rounded-xl hover:px-2 hover:-translate-y-[1px] hover:shadow-sm">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-linear-to-br from-sky-400 to-sky-600 shadow-sm shadow-sky-400/60 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium text-slate-900 truncate sanchez-regular">
                      {item.type}
                    </p>
                    <span className="text-2xs text-slate-400 whitespace-nowrap unbounded-heading">
                      {item.time}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 unbounded-subHeading">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
            {activityLog.length === 0 && (
              <p className="text-xs text-slate-400 italic">
                No recent activity.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;