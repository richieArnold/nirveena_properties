import React, { useState } from "react";
import { Home } from "lucide-react";

const ImageWithFallback = ({ src, alt, className }) => {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className={`${className} bg-gray-100 flex flex-col items-center justify-center text-gray-400`}>
        <Home size={36} className="mb-2 opacity-50" />
        <span className="text-[10px] font-bold uppercase tracking-widest">
          Image Unavailable
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
};

export default ImageWithFallback;
