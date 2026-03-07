const pool = require("../rds_setup/db/index");

// Submit a new lead
exports.submitLead = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      subject,
      message,
      propertyType,
      budget
    } = req.body;

    // Basic validation
    if (!name || !phone || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, phone, email, and message are required"
      });
    }

    // Insert lead into database
    const result = await pool.query(
      `INSERT INTO inbound_leads 
       (name, phone, email, subject, message, property_type, budget, status, opened) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING id`,
      [
        name.trim(),
        phone.trim(),
        email.trim().toLowerCase(),
        subject || null,
        message.trim(),
        propertyType || null,
        budget || null,
        'new',
        false
      ]
    );

    res.status(201).json({
      success: true,
      message: "Thank you! We'll get back to you soon.",
      data: {
        leadId: result.rows[0].id
      }
    });

  } catch (error) {
    console.error("Lead submission error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit lead",
      error: error.message
    });
  }
};

// Get all leads with pagination
// Get all leads with pagination (updated with timezone conversion)
exports.getAllLeads = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const status = req.query.status;

    let query = `
      SELECT 
        id, 
        name, 
        phone, 
        email, 
        subject, 
        message, 
        property_type,
        budget,
        status,
        notes,
        opened,
        opened_at,
        created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata' as created_at,
        updated_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata' as updated_at
      FROM inbound_leads
    `;
    
    let countQuery = 'SELECT COUNT(*) FROM inbound_leads';
    const queryParams = [];
    const countParams = [];

    // Add status filter if provided
    if (status) {
      query += ` WHERE status = $1`;
      countQuery += ` WHERE status = $1`;
      queryParams.push(status);
      countParams.push(status);
    }

    // Add ordering and pagination
    query += ` ORDER BY created_at DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);

    const [leadsResult, countResult] = await Promise.all([
      pool.query(query, queryParams),
      pool.query(countQuery, countParams)
    ]);

    const totalCount = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: leadsResult.rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount: totalCount,
        limit: limit
      }
    });

  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch leads",
      error: error.message
    });
  }
};

// Get lead by ID (updated with timezone conversion)
exports.getLeadById = async (req, res) => {
  try {
    const { id } = req.params;

    // First, mark as opened if not already
    await pool.query(
      `UPDATE inbound_leads 
       SET opened = TRUE, 
           opened_at = CASE WHEN opened = FALSE THEN NOW() ELSE opened_at END,
           last_viewed_at = NOW()
       WHERE id = $1 AND opened = FALSE`,
      [id]
    );

    // Then fetch the lead with timezone conversion
    const result = await pool.query(
      `SELECT 
        id, 
        name, 
        phone, 
        email, 
        subject, 
        message, 
        property_type,
        budget,
        status,
        notes,
        opened,
        opened_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata' as opened_at,
        last_viewed_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata' as last_viewed_at,
        created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata' as created_at,
        updated_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata' as updated_at
      FROM inbound_leads 
      WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Error fetching lead:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch lead",
      error: error.message
    });
  }
};

// Get leads statistics (updated with timezone for today's count)
exports.getLeadsStats = async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'new' THEN 1 END) as new,
        COUNT(CASE WHEN status = 'contacted' THEN 1 END) as contacted,
        COUNT(CASE WHEN status = 'qualified' THEN 1 END) as qualified,
        COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted,
        COUNT(CASE WHEN status = 'lost' THEN 1 END) as lost,
        COUNT(CASE WHEN opened = FALSE THEN 1 END) as unopened,
        COUNT(CASE WHEN DATE(created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata') = CURRENT_DATE THEN 1 END) as today
      FROM inbound_leads
    `);

    res.json({
      success: true,
      data: stats.rows[0]
    });

  } catch (error) {
    console.error("Error fetching leads stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch leads stats",
      error: error.message
    });
  }
};

// Delete lead (for lost status)
exports.deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM inbound_leads WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    res.json({
      success: true,
      message: "Lead deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting lead:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete lead",
      error: error.message
    });
  }
};





// Update lead status
exports.updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['new', 'contacted', 'qualified', 'converted', 'lost'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    const result = await pool.query(
      `UPDATE inbound_leads 
       SET status = $1, updated_at = NOW() 
       WHERE id = $2 
       RETURNING id, status`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    res.json({
      success: true,
      message: "Lead status updated successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Error updating lead:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update lead",
      error: error.message
    });
  }
};

// Add/Update notes for a lead
exports.updateLeadNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const result = await pool.query(
      `UPDATE inbound_leads 
       SET notes = $1, updated_at = NOW() 
       WHERE id = $2 
       RETURNING id, notes`,
      [notes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    res.json({
      success: true,
      message: "Notes updated successfully",
      data: result.rows[0]
    });

  } catch (error) {
    console.error("Error updating notes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update notes",
      error: error.message
    });
  }
};

// Get leads statistics for dashboard
exports.getLeadsStats = async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'new' THEN 1 END) as new,
        COUNT(CASE WHEN status = 'contacted' THEN 1 END) as contacted,
        COUNT(CASE WHEN status = 'qualified' THEN 1 END) as qualified,
        COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted,
        COUNT(CASE WHEN status = 'lost' THEN 1 END) as lost,
        COUNT(CASE WHEN opened = FALSE THEN 1 END) as unopened,
        COUNT(CASE WHEN DATE(created_at) = CURRENT_DATE THEN 1 END) as today
      FROM inbound_leads
    `);

    res.json({
      success: true,
      data: stats.rows[0]
    });

  } catch (error) {
    console.error("Error fetching leads stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch leads stats",
      error: error.message
    });
  }
};

// Delete lead
exports.deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM inbound_leads WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    res.json({
      success: true,
      message: "Lead deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting lead:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete lead",
      error: error.message
    });
  }
};





// Export all leads to Excel (no pagination, all fields)
exports.exportAllLeads = async (req, res) => {
  try {
    // Get ALL leads without pagination
    const result = await pool.query(
      `SELECT 
        id, 
        name, 
        phone, 
        email, 
        subject, 
        message, 
        property_type,
        budget,
        status,
        notes,
        opened,
        opened_at,
        created_at,
        updated_at
      FROM inbound_leads 
      ORDER BY created_at DESC`
    );

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error("Error exporting leads:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export leads",
      error: error.message
    });
  }
};

