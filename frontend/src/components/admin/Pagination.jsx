import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, totalCount, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Simple page numbers for mobile
  const getMobilePageNumbers = () => {
    if (totalPages <= 3) {
      return [1, 2, 3].filter(p => p <= totalPages);
    }
    if (currentPage === 1) return [1, 2, '...'];
    if (currentPage === totalPages) return ['...', totalPages - 1, totalPages];
    return ['...', currentPage, '...'];
  };

  // Desktop page numbers
  const getDesktopPageNumbers = () => {
    const delta = 2;
    const range = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }
    
    const result = [];
    let last = 0;
    range.forEach(i => {
      if (last && i - last > 1) result.push('...');
      result.push(i);
      last = i;
    });
    return result;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-3 sm:px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Page Info */}
      <div className="text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
        <span className="hidden xs:inline">Page </span>
        <span className="font-medium">{currentPage}</span> of{' '}
        <span className="font-medium">{totalPages}</span>
        <span className="hidden sm:inline"> ({totalCount} total)</span>
        <span className="sm:hidden"> · {totalCount}</span>
      </div>
      
      {/* Pagination Controls */}
      <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 sm:p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        
        {/* Page Numbers - Mobile vs Desktop */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Mobile View (hidden on sm+) */}
          <div className="flex sm:hidden items-center gap-1">
            {(window.innerWidth < 640 ? getMobilePageNumbers() : []).map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' ? onPageChange(page) : null}
                disabled={page === '...'}
                className={`
                  min-w-[32px] h-8 rounded-lg text-xs
                  ${currentPage === page
                    ? 'bg-blue-600 text-white'
                    : page === '...'
                    ? 'cursor-default bg-transparent'
                    : 'border border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                {page}
              </button>
            ))}
          </div>
          
          {/* Desktop View (hidden on mobile) */}
          <div className="hidden sm:flex items-center gap-2">
            {getDesktopPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' ? onPageChange(page) : null}
                disabled={page === '...'}
                className={`
                  min-w-[40px] h-10 rounded-lg text-sm
                  ${currentPage === page
                    ? 'bg-blue-600 text-white'
                    : page === '...'
                    ? 'cursor-default bg-transparent'
                    : 'border border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
        
        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 sm:p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;