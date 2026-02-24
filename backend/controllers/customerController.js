const pool = require("../rds_setup/db"); // adjust if needed

exports.createCustomerEnquiry = async (req, res) => {
  const { first_name, last_name, contact, email, project_id } = req.body;

  try {
    // 1️⃣ Check existing customer
    const existingCustomer = await pool.query(
      "SELECT id FROM customers WHERE email = $1",
      [email]
    );

    let customerId;

    if (existingCustomer.rows.length > 0) {
      customerId = existingCustomer.rows[0].id;
    } else {
      const newCustomer = await pool.query(
        `INSERT INTO customers (first_name, last_name, contact, email)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [first_name, last_name, contact, email]
      );

      customerId = newCustomer.rows[0].id;
    }

    // 2️⃣ Insert enquiry
    await pool.query(
      `INSERT INTO enquiries (customer_id, project_id)
       VALUES ($1, $2)`,
      [customerId, project_id]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};