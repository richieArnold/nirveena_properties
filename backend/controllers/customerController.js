const pool = require("../rds_setup/db"); // adjust if needed
const { sendAdminNotification } = require("../utils/mailer"); // Import the mailer
// Existing function - keep as is

// exports.createCustomerEnquiry = async (req, res) => {
//   const { first_name, last_name, contact, email, project_id } = req.body;

//   try {
//     // Check existing customer
//     const existingCustomer = await pool.query(
//       "SELECT id FROM customers WHERE contact = $1",
//       [contact]
//     );

//     let customerId;

//     if (existingCustomer.rows.length > 0) {
//       customerId = existingCustomer.rows[0].id;
//     } else {
//       const newCustomer = await pool.query(
//         `INSERT INTO customers (first_name, last_name, contact, email)
//          VALUES ($1, $2, $3, $4)
//          RETURNING id`,
//         [first_name, last_name, contact, email]
//       );

//       customerId = newCustomer.rows[0].id;
//     }

//     // Insert enquiry (project optional)
//     await pool.query(
//       `INSERT INTO enquiries (customer_id, project_id)
//        VALUES ($1, $2)`,
//       [customerId, project_id || null]
//     );

//     res.json({
//       success: true,
//       message: "Enquiry submitted successfully",
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };


exports.createCustomerEnquiry = async (req, res) => {
  const { first_name, last_name, contact, email, project_id } = req.body;

  try {
    // 1. Handle Customer logic (Existing)
    const existingCustomer = await pool.query(
      "SELECT id FROM customers WHERE contact = $1",
      [contact]
    );

    let customerId;
    if (existingCustomer.rows.length > 0) {
      customerId = existingCustomer.rows[0].id;
    } else {
      const newCustomer = await pool.query(
        `INSERT INTO customers (first_name, last_name, contact, email)
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [first_name, last_name, contact, email]
      );
      customerId = newCustomer.rows[0].id;
    }

    // 2. Insert enquiry
    await pool.query(
      `INSERT INTO enquiries (customer_id, project_id) VALUES ($1, $2)`,
      [customerId, project_id || null]
    );

    // 3. FETCH PROJECT NAME (for the email)
    let projectName = "General Enquiry";
    if (project_id) {
      const projectRes = await pool.query("SELECT project_name FROM projects WHERE id = $1", [project_id]);
      if (projectRes.rows.length > 0) {
        projectName = projectRes.rows[0].project_name;
      }
    }

    // 4. TRIGGER EMAIL (Non-blocking)
    // We don't 'await' this so the user gets their response faster
    sendAdminNotification({ first_name, last_name, contact, email }, projectName);

    res.json({
      success: true,
      message: "Enquiry submitted successfully",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// ============= NEW ADMIN FUNCTIONS =============

// Get all customers with their latest enquiry
exports.getAllCustomers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await pool.query('SELECT COUNT(*) FROM customers');
    const totalCount = parseInt(countResult.rows[0].count);

    // Get customers with their latest enquiry and project details
    const result = await pool.query(
      `
      SELECT 
        c.id,
        c.first_name,
        c.last_name,
        c.contact,
        c.email,
        c.created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata' as created_at,
        (
          SELECT json_build_object(
            'id', e.id,
            'project_id', p.id,
            'project_name', p.project_name,
            'enquired_at', e.created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata'
          )
          FROM enquiries e
          LEFT JOIN projects p ON e.project_id = p.id
          WHERE e.customer_id = c.id
          ORDER BY e.created_at DESC
          LIMIT 1
        ) as latest_enquiry,
        (
          SELECT COUNT(*)
          FROM enquiries
          WHERE customer_id = c.id
        ) as total_enquiries
      FROM customers c
      ORDER BY c.created_at DESC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset]
    );

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount: totalCount,
        limit: limit
      }
    });

  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
      error: error.message
    });
  }
};

// Get single customer with all their enquiries
exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const customerResult = await pool.query(
      `
      SELECT 
        id,
        first_name,
        last_name,
        contact,
        email,
        created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata' as created_at
      FROM customers 
      WHERE id = $1
      `,
      [id]
    );

    if (customerResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    const customer = customerResult.rows[0];

    // Get all enquiries for this customer
    const enquiriesResult = await pool.query(
      `
      SELECT 
        e.id,
        e.created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata' as enquired_at,
        p.id as project_id,
        p.project_name,
        p.project_location,
        p.price,
        p.project_type
      FROM enquiries e
      LEFT JOIN projects p ON e.project_id = p.id
      WHERE e.customer_id = $1
      ORDER BY e.created_at DESC
      `,
      [id]
    );

    customer.enquiries = enquiriesResult.rows;

    res.json({
      success: true,
      data: customer
    });

  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer",
      error: error.message
    });
  }
};

// Get all enquiries with customer and project details
exports.getAllEnquiries = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await pool.query('SELECT COUNT(*) FROM enquiries');
    const totalCount = parseInt(countResult.rows[0].count);

    // Get enquiries with customer and project details
    const result = await pool.query(
      `
      SELECT 
        e.id,
        e.created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata' as created_at,
        json_build_object(
          'id', c.id,
          'first_name', c.first_name,
          'last_name', c.last_name,
          'contact', c.contact,
          'email', c.email
        ) as customer,
        json_build_object(
          'id', p.id,
          'project_name', p.project_name,
          'project_location', p.project_location,
          'price', p.price,
          'project_type', p.project_type,
          'slug', p.slug
        ) as project
      FROM enquiries e
      LEFT JOIN customers c ON e.customer_id = c.id
      LEFT JOIN projects p ON e.project_id = p.id
      ORDER BY e.created_at DESC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset]
    );

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount: totalCount,
        limit: limit
      }
    });

  } catch (error) {
    console.error("Error fetching enquiries:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enquiries",
      error: error.message
    });
  }
};

// Delete customer (cascade will delete enquiries)
exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    // First check if customer exists
    const checkResult = await pool.query(
      "SELECT id, first_name, last_name FROM customers WHERE id = $1",
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    const customer = checkResult.rows[0];

    // Delete customer (enquiries will be auto-deleted due to CASCADE)
    await pool.query(
      "DELETE FROM customers WHERE id = $1",
      [id]
    );

    res.json({
      success: true,
      message: `Customer ${customer.first_name} ${customer.last_name} deleted successfully`
    });

  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete customer",
      error: error.message
    });
  }
};

// Delete single enquiry
exports.deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    // First check if enquiry exists
    const checkResult = await pool.query(
      `SELECT e.id, c.first_name, c.last_name, p.project_name
       FROM enquiries e
       LEFT JOIN customers c ON e.customer_id = c.id
       LEFT JOIN projects p ON e.project_id = p.id
       WHERE e.id = $1`,
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found"
      });
    }

    const enquiry = checkResult.rows[0];

    // Delete enquiry
    await pool.query("DELETE FROM enquiries WHERE id = $1", [id]);

    res.json({
      success: true,
      message: `Enquiry for ${enquiry.project_name || 'project'} by ${enquiry.first_name} ${enquiry.last_name} deleted successfully`
    });

  } catch (error) {
    console.error("Error deleting enquiry:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete enquiry",
      error: error.message
    });
  }
};

// Get statistics for dashboard
exports.getCustomerStats = async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        COUNT(DISTINCT c.id) as total_customers,
        COUNT(e.id) as total_enquiries,
        COUNT(DISTINCT e.customer_id) as active_customers,
        COUNT(DISTINCT e.project_id) as projects_enquired,
        COUNT(CASE WHEN DATE(c.created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata') = CURRENT_DATE THEN 1 END) as new_customers_today,
        COUNT(CASE WHEN DATE(e.created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata') = CURRENT_DATE THEN 1 END) as new_enquiries_today
      FROM customers c
      LEFT JOIN enquiries e ON c.id = e.customer_id
    `);

    res.json({
      success: true,
      data: stats.rows[0]
    });

  } catch (error) {
    console.error("Error fetching customer stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer stats",
      error: error.message
    });
  }
};