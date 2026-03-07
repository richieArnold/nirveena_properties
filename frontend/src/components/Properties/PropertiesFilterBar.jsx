import React from "react";

function PropertiesFilterBar({
  searchQuery,
  setSearchQuery,
  projectTypes,
  selectedType,
  setSelectedType,
  selectedStatus,
  setSelectedStatus,
}) {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="w-full px-4 sm:px-6 py-5 flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="relative w-full lg:w-80">
          {" "}
          <input
            type="text"
            placeholder="Search project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-4 py-3 bg-gray-100 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
          />
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
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

        <div className="hidden lg:block flex-1" />

        <div className="w-full lg:w-auto">
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
    </div>
  );
}

export default PropertiesFilterBar;
