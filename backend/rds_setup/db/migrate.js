const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, '../../.env') });

const fs = require("fs");
const pool = require("./index");

(async () => {
  try {
    const schemaPath = path.join(__dirname, "../schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    console.log(" Connecting to database...");
    await pool.query(schema);

    console.log(" Tables created successfully");
    process.exit(0);
  } catch (err) {
    console.error(" Migration failed:", err);
    process.exit(1);
  }
})();