exports.formatPrice = (price) => {
  if (!price) return "";

  let value = price.toLowerCase();


  // Remove unwanted words
  value = value.replace(
    /(starting|starts|begins|begin|from|price|at|onward|onwards)/g,
    ""
  );

  value = value.trim().replace(/\s+/g, " ");

  // Range handling
  if (value.includes("-")) {
    const [min, max] = value.split("-").map((v) => normalize(v));
    return `₹${min} – ₹${max}`;
  }

  return `₹${normalize(value)}`;
};

const normalize = (val) => {
  val = val.trim();

  const num = parseFloat(val);

  if (val.includes("cr")) {
    return `${num.toFixed(2)} Cr`;
  }

  if (val.includes("l")) {
    return `${num} L`;
  }

  // If unit missing → assume Lakh (most common in listings)
  if (!isNaN(num)) {
    return `${num} L`;
  }

  return val;
};

const allowedExtensions = ["jpg", "jpeg", "png", "webp", "avif", "gif"];

exports.isValidImage = (url) => {
  if (!url) return false;

  const extension = url.split(".").pop().toLowerCase();

  return allowedExtensions.includes(extension);
};
