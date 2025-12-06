import React, { memo } from "react";

function ProductFiltersBar({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  sortBy,
  onSortChange,
  categories,
  totalCount,
  filteredCount,
}) {
  return (
    <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <span className="absolute inset-y-0 left-3 flex items-center">
            <svg
              className="w-4 h-4 text-[#B89B7A]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14z"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by name, category, description..."
            className="
              w-full rounded-full border border-[#F3DFC4]
              bg-white/90 pl-9 pr-3 py-2
              text-xs sm:text-sm text-[#3A211F]
              placeholder:text-[#B89B7A]
              focus:outline-none focus:ring-2 focus:ring-[#EAC97C] focus:border-transparent
              shadow-sm
            "
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Category filter */}
        <select
          className="
            rounded-full border border-[#F3DFC4] bg-white/90
            px-3 py-2 text-xs sm:text-sm text-[#3A211F]
            focus:outline-none focus:ring-2 focus:ring-[#EAC97C] focus:border-transparent
            shadow-sm
          "
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "All" ? "All Categories" : cat}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          className="
            rounded-full border border-[#F3DFC4] bg-white/90
            px-3 py-2 text-xs sm:text-sm text-[#3A211F]
            focus:outline-none focus:ring-2 focus:ring-[#EAC97C] focus:border-transparent
            shadow-sm
          "
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="name-asc">Name (A–Z)</option>
          <option value="name-desc">Name (Z–A)</option>
          <option value="origin-asc">Origin (A–Z)</option>
          <option value="origin-desc">Origin (Z–A)</option>
        </select>
      </div>

      {/* Count text */}
      <p className="text-[11px] text-[#6B4B3A]">
        Showing{" "}
        <span className="font-semibold">{filteredCount}</span> of{" "}
        <span className="font-semibold">{totalCount}</span> products
      </p>
    </div>
  );
}

export default memo(ProductFiltersBar);