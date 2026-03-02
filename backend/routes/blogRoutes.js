const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");

// Public Routes
router.get("/", blogController.getAllBlogs);
router.get("/:slug", blogController.getBlogBySlug);

// Admin Routes (no auth for now)
router.post("/", blogController.createBlog);
router.put("/:id", blogController.updateBlog);
router.delete("/:id", blogController.deleteBlog);

module.exports = router;