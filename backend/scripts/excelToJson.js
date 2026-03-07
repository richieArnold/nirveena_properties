const path = require("path");
const fs = require("fs");
const { parseExcelToJson } = require("../src/services/excel/excelParser.service");

// Paths
const inputFilePath = path.join(
  __dirname,
  "..",
  "data",
  "input",
  "updated_details.xlsx"
);

console.log(inputFilePath)

const outputFilePath = path.join(
  __dirname,
  "..",
  "data",
  "output",
  "projects.json"
);

try {
  const jsonData = parseExcelToJson(inputFilePath);

  console.log(jsonData)

  fs.writeFileSync(
    outputFilePath,
    JSON.stringify(jsonData, null, 2),
    "utf-8"
  );

  console.log("✅ Excel successfully converted to JSON");
  console.log(`📁 Output file: ${outputFilePath}`);
} catch (error) {
  console.error("❌ Failed to parse Excel file");
  console.error(error.message);
}
