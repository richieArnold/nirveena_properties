const pool = require("../rds_setup/db/index");

// Slug generator (same logic as properties)
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * CREATE BLOG
 */
exports.createBlog = async (req, res) => {
  const client = await pool.connect();

  try {
    const { title, body, author, status, images = [] } = req.body;

    if (!title || !body || !author) {
      return res.status(400).json({
        success: false,
        message: "title, body and author are required",
      });
    }

    let baseSlug = generateSlug(title);
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await client.query(
        "SELECT id FROM blogs WHERE slug = $1",
        [slug]
      );

      if (existing.rows.length === 0) break;

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    await client.query("BEGIN");

    const blogResult = await client.query(
      `
      INSERT INTO blogs (title, slug, body, author, status)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *
      `,
      [title.trim(), slug, body, author.trim(), status || "published"]
    );

    const blog = blogResult.rows[0];

    // Insert images
    for (let i = 0; i < images.length; i++) {
      await client.query(
        `
        INSERT INTO blog_images (blog_id, image_url, sort_order)
        VALUES ($1,$2,$3)
        `,
        [blog.id, images[i], i]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });

  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Create blog error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create blog",
      error: error.message,
    });
  } finally {
    client.release();
  }
};

/**
 * GET ALL BLOGS (PAGINATED - PUBLIC)
 */
exports.getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const countResult = await pool.query(
      "SELECT COUNT(*) FROM blogs WHERE status = 'published'"
    );

    const totalCount = parseInt(countResult.rows[0].count);

 const result = await pool.query(`
SELECT 
  b.id,
  b.title,
  b.slug,
  b.author,
  b.created_at,
  (
    SELECT json_agg(bi ORDER BY bi.sort_order)
    FROM blog_images bi
    WHERE bi.blog_id = b.id
  ) AS images
FROM blogs b
WHERE b.status = 'published'
ORDER BY b.created_at DESC
LIMIT $1 OFFSET $2
`, [limit, offset]);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount: totalCount,
        limit: limit,
      },
    });
  } catch (error) {
    console.error("Get blogs error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
      error: error.message,
    });
  }
};

/**
 * GET BLOG BY SLUG
 */
exports.getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const blogResult = await pool.query(
      "SELECT * FROM blogs WHERE slug = $1 AND status = 'published'",
      [slug]
    );

    if (blogResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const blog = blogResult.rows[0];

    const imagesResult = await pool.query(
      `
      SELECT image_url, sort_order
      FROM blog_images
      WHERE blog_id = $1
      ORDER BY sort_order ASC
      `,
      [blog.id]
    );

    blog.images = imagesResult.rows;

    res.json({
      success: true,
      data: blog,
    });

  } catch (error) {
    console.error("Get blog error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
      error: error.message,
    });
  }
};

/**
 * UPDATE BLOG (Slug does NOT change)
 */
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body, author, status } = req.body;

    const existing = await pool.query(
      "SELECT * FROM blogs WHERE id = $1",
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const result = await pool.query(
      `
      UPDATE blogs SET
        title = $1,
        body = $2,
        author = $3,
        status = $4
      WHERE id = $5
      RETURNING *
      `,
      [
        title || existing.rows[0].title,
        body || existing.rows[0].body,
        author || existing.rows[0].author,
        status || existing.rows[0].status,
        id,
      ]
    );

    res.json({
      success: true,
      message: "Blog updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Update blog error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update blog",
      error: error.message,
    });
  }
};

/**
 * DELETE BLOG
 */
exports.deleteBlog = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    await client.query("BEGIN");

    const blogResult = await client.query(
      "SELECT * FROM blogs WHERE id = $1",
      [id]
    );

    if (blogResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    await client.query(
      "DELETE FROM blog_images WHERE blog_id = $1",
      [id]
    );

    const result = await client.query(
      "DELETE FROM blogs WHERE id = $1 RETURNING *",
      [id]
    );

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Blog deleted successfully",
      data: result.rows[0],
    });

  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Delete blog error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete blog",
      error: error.message,
    });
  } finally {
    client.release();
  }
};


exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM blogs WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const blog = result.rows[0];

    const images = await pool.query(
      `
      SELECT image_url, sort_order
      FROM blog_images
      WHERE blog_id = $1
      ORDER BY sort_order ASC
      `,
      [id]
    );

    blog.images = images.rows;

    res.json({
      success: true,
      data: blog,
    });

  } catch (error) {
    console.error("Get blog by id error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
      error: error.message,
    });
  }
};