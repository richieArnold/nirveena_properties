const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/sitemap.xml", async (req, res) => {
  try {

    const result = await pool.query("SELECT slug FROM projects");

    const baseUrl = "https://www.nirveena.com";

    let urls = "";

    result.rows.forEach(property => {
      urls += `
<url>
  <loc>${baseUrl}/property/${property.slug}</loc>
  <priority>0.8</priority>
</url>`;
    });

    const sitemap =
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
  <loc>${baseUrl}</loc>
  <priority>1.0</priority>
</url>
<url>
  <loc>${baseUrl}/property</loc>
  <priority>0.9</priority>
</url>
${urls}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(sitemap);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating sitemap");
  }
});

module.exports = router;