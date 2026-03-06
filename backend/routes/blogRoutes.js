const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const blogUploadController = require("../controllers/blogUploadController");
// CREATE
router.post("/", blogController.createBlog);

// READ
router.get("/", blogController.getAllBlogs);
router.get("/:slug", blogController.getBlogBySlug);

// UPDATE
router.put("/:id", blogController.updateBlog);

router.get("/id/:id", blogController.getBlogById);

router.post(
  "/upload",
  blogUploadController.uploadMiddleware,
  blogUploadController.uploadBlogImages
);

// DELETE
router.delete("/:id", blogController.deleteBlog);

module.exports = router;