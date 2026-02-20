
import React, { useState, useEffect } from "react";

function FilterBar() {

      const [searchQuery, setSearchQuery] = useState("");
      const [selectedType, setSelectedType] = useState("all");
      const [selectedStatus, setSelectedStatus] = useState("all");



        const projectTypes = [
    "all",
    ...new Set(properties.map((p) => p.project_type?.toLowerCase())),
  ];

  const projectStatuses = [
    "all",
    ...new Set(properties.map((p) => p.project_status?.toLowerCase())),
  ];
  return (
    <>
            {/* 🔎 FILTER BAR */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full px-6 py-5 flex items-center gap-6">
          {/* Search Input */}
          <div className="relative w-80">
            <input
              type="text"
              placeholder="Search project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-4 py-3 bg-gray-100 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
            />
          </div>

          {/* Type Pills */}
          <div className="flex gap-3">
            {projectTypes.map((type) => {
              const isActive = selectedType === type;

              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border
            ${
              isActive
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
            }`}
                >
                  {type === "all"
                    ? "All Assets"
                    : type.replace(/\b\w/g, (l) => l.toUpperCase())}
                </button>
              );
            })}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="rtm">RTM</option>
            <option value="uc">UC</option>
            <option value="eoi">EOI</option>
          </select>
        </div>
      </div>
    </>
  )
}

export default FilterBar
