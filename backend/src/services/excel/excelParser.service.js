const xlsx = require("xlsx");

/**
 * Reads an Excel file and converts it to JSON
 * - Reads only A1 to M105
 * - Empty cells → ""
 * - Dates → string
 */
function parseExcelToJson(filePath) {
  const workbook = xlsx.readFile(filePath);

  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const data = xlsx.utils.sheet_to_json(sheet, {
    range: "A1:M105", // 👈 LIMITS rows & columns
    defval: "",       // empty cells → ""
    raw: false        // dates → string
  });

  return data;
}

module.exports = {
  parseExcelToJson
};
