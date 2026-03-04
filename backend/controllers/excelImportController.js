const ExcelJS = require('exceljs');
const pool = require('../rds_setup/db');
const multer = require('multer');
const path = require('path');

// Configure multer for memory storage (we don't need to save the file)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Please upload an Excel file (.xlsx or .xls)'));
    }
  },
});

// Middleware for single file upload
exports.uploadExcel = upload.single('excelFile');

// Slug generator (copy from your propertyControllers.js)
function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Safe number conversion
function toNumber(value) {
  if (!value && value !== 0) return null;
  const cleaned = value.toString().replace(/[^\d.]/g, "");
  return cleaned ? Number(cleaned) : null;
}

// Column mapping guide for users
exports.getColumnMappingGuide = (req, res) => {
  const columnMapping = [
    { excelColumn: 'Project ID', databaseField: 'project_id', required: true, description: 'Unique ID for the project (numeric)' },
    { excelColumn: 'Project Name', databaseField: 'project_name', required: true, description: 'Name of the project' },
    { excelColumn: 'Project Type', databaseField: 'project_type', required: false, description: 'e.g., Villa, Apartment, Commercial' },
    { excelColumn: 'Project Status', databaseField: 'project_status', required: false, description: 'UC (Under Construction), RTM (Ready to Move), Completed' },
    { excelColumn: 'Project Location', databaseField: 'project_location', required: false, description: 'Project location/address' },
    { excelColumn: 'Total Acres', databaseField: 'total_acres', required: false, description: 'Area in acres (numeric)' },
    { excelColumn: 'No of Units', databaseField: 'no_of_units', required: false, description: 'Number of units (numeric)' },
    { excelColumn: 'Club House Size', databaseField: 'club_house_size', required: false, description: 'Size of club house (e.g., "25000 sq.ft")' },
    { excelColumn: 'Structure', databaseField: 'structure', required: false, description: 'e.g., G+3, G+10' },
    { excelColumn: 'Typology', databaseField: 'typology', required: false, description: 'e.g., "3 BHK, 4 BHK"' },
    { excelColumn: 'SBA', databaseField: 'sba', required: false, description: 'Super Built-up Area (e.g., "2500 - 4500 sq.ft")' },
    { excelColumn: 'Price', databaseField: 'price', required: false, description: 'Price range (e.g., "2.5 Cr - 4.5 Cr")' },
    { excelColumn: 'RERA Completion', databaseField: 'rera_completion', required: false, description: 'RERA completion date (e.g., "December 2025")' },
  ];

  res.json({
    success: true,
    message: 'Please ensure your Excel file has these column names (flexible matching is supported)',
    columnMapping,
    sampleRow: {
      'Project ID': 1001,
      'Project Name': 'Sunset Villas',
      'Project Type': 'Villa',
      'Project Status': 'UC',
      'Project Location': 'Gachibowli, Hyderabad',
      'Total Acres': 15.5,
      'No of Units': 120,
      'Club House Size': '25000 sq.ft',
      'Structure': 'G+3',
      'Typology': '3 BHK, 4 BHK',
      'SBA': '2500 - 4500 sq.ft',
      'Price': '2.5 Cr - 4.5 Cr',
      'RERA Completion': 'December 2025'
    }
  });
};
// Import projects from Excel
exports.importProjectsFromExcel = async (req, res) => {
  const client = await pool.connect();
  const results = {
    total: 0,
    successful: 0,
    failed: 0,
    errors: [],
    skipped: [],
    processedRows: []
  };

  // Arrays to store mapping information for frontend
  const mappingLogs = [];
  const unmatchedColumns = [];

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Load workbook from buffer
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);
    
    // Get first worksheet
    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
      return res.status(400).json({
        success: false,
        message: 'Excel file is empty'
      });
    }

    // Get header row (assuming first row is headers)
    const headerRow = worksheet.getRow(1);
    const headers = [];
    headerRow.eachCell((cell, colNumber) => {
      let headerValue = cell.value ? cell.value.toString().trim() : '';
      // Remove arrows and special characters for cleaner matching
      headerValue = headerValue.replace(/[→\-–—>]/g, '').trim();
      // Remove extra spaces
      headerValue = headerValue.replace(/\s+/g, ' ');
      headers[colNumber] = headerValue;
    });

    console.log('Detected headers:', headers.filter(h => h));

    // Define keyword mappings for each field
    const fieldKeywords = {
      project_id: ['id', 'project id', 'projectid', 'identification', 'code'],
      project_name: ['name', 'project name', 'projectname', 'title', 'property name'],
      project_type: ['type', 'project type', 'category', 'property type'],
      project_status: ['status', 'project status', 'stage', 'condition'],
      project_location: ['location', 'project location', 'address', 'place', 'city', 'area'],
      total_acres: ['acres', 'total acres', 'acre', 'land area', 'size acres'],
      no_of_units: ['units', 'no of units', 'number of units', 'unit count', 'total units'],
      club_house_size: ['club house', 'clubhouse', 'club house size', 'amenities size', 'club'],
      structure: ['structure', 'building structure', 'floors', 'storey', 'levels'],
      typology: ['typology', 'unit types', 'bhk', 'configuration', 'room types'],
      sba: ['sba', 'super built', 'built up area', 'carpet area', 'area sqft'],
      price: ['price', 'cost', 'value', 'rate', 'amount', 'budget'],
      rera_completion: ['rera', 'completion', 'rera completion', 'handover', 'possession']
    };

    // Create column mapping with flexible matching
    const columnMap = {};
    
    headers.forEach((header, index) => {
      if (!header) return;
      
      const headerLower = header.toString().toLowerCase().trim();
      let matched = false;
      
      // Check each field's keywords
      for (const [field, keywords] of Object.entries(fieldKeywords)) {
        // Check if any keyword is included in the header
        const keywordMatched = keywords.some(keyword => headerLower.includes(keyword));
        
        if (keywordMatched && !columnMap[field]) {
          columnMap[field] = index;
          console.log(`✅ Mapped column ${index} "${header}" → ${field}`);
          
          // Add to mapping logs
          mappingLogs.push({
            type: 'success',
            columnIndex: index,
            excelColumn: header,
            databaseField: field,
            note: 'Matched successfully'
          });
          
          matched = true;
          break; // Stop checking once matched
        }
      }
      
      // Special case for common typos
      if (!matched && headerLower.includes('ocation') && !columnMap.project_location) {
        columnMap.project_location = index;
        console.log(`🔧 Fixed typo: Mapped column ${index} "${header}" → project_location`);
        
        mappingLogs.push({
          type: 'warning',
          columnIndex: index,
          excelColumn: header,
          databaseField: 'project_location',
          note: 'Fixed typo (ocation → location)'
        });
        
        matched = true;
      }
      
      // If no match found, add to unmatched columns
      if (!matched && header) {
        unmatchedColumns.push(header);
        mappingLogs.push({
          type: 'warning',
          columnIndex: index,
          excelColumn: header,
          databaseField: 'ignored',
          note: 'No matching field found - column ignored'
        });
      }
    });

    // Validate required columns
    const requiredFields = ['project_id', 'project_name'];
    const missingRequired = requiredFields.filter(field => !columnMap[field]);

    if (missingRequired.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Could not find required columns in Excel file',
        details: `Missing: ${missingRequired.join(', ')}`,
        foundColumns: headers.filter(h => h),
        mappingLogs,
        unmatchedColumns,
        note: 'Please ensure your Excel has columns for Project ID and Project Name'
      });
    }

    // Log found mappings
    console.log('Column mappings found:', Object.keys(columnMap).map(key => 
      `${key} → Column ${columnMap[key]}`
    ));

    // Process rows (starting from row 2)
    let rowCount = 0;
    for (let i = 2; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      
      // Skip empty rows (check first few cells)
      const firstCell = row.getCell(1).value;
      const secondCell = row.getCell(2).value;
      if (!firstCell && !secondCell) continue;
      
      rowCount++;
      results.total++;

      try {
        // Helper function to get cell value safely
        const getCellValue = (colIndex) => {
          if (!colIndex) return null;
          const cell = row.getCell(colIndex);
          return cell ? cell.value : null;
        };

        // Extract values from cells
        const projectData = {
          project_id: getCellValue(columnMap.project_id),
          project_name: getCellValue(columnMap.project_name),
          project_type: getCellValue(columnMap.project_type),
          project_status: getCellValue(columnMap.project_status),
          project_location: getCellValue(columnMap.project_location),
          total_acres: getCellValue(columnMap.total_acres),
          no_of_units: getCellValue(columnMap.no_of_units),
          club_house_size: getCellValue(columnMap.club_house_size),
          structure: getCellValue(columnMap.structure),
          typology: getCellValue(columnMap.typology),
          sba: getCellValue(columnMap.sba),
          price: getCellValue(columnMap.price),
          rera_completion: getCellValue(columnMap.rera_completion),
        };

        // Validate required fields
        if (!projectData.project_id || !projectData.project_name) {
          throw new Error(`Missing required fields at row ${i}`);
        }

        // Clean and format data
        const slug = generateSlug(projectData.project_name.toString());

        // Begin transaction for this row
        await client.query('BEGIN');

        // Insert project with ON CONFLICT to handle duplicates
        await client.query(
          `
          INSERT INTO projects (
            project_id, project_name, slug, project_type, project_status,
            project_location, total_acres, no_of_units, club_house_size,
            structure, typology, sba, price, rera_completion
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
          ON CONFLICT (project_id) DO UPDATE SET
            project_name = EXCLUDED.project_name,
            slug = EXCLUDED.slug,
            project_type = EXCLUDED.project_type,
            project_status = EXCLUDED.project_status,
            project_location = EXCLUDED.project_location,
            total_acres = EXCLUDED.total_acres,
            no_of_units = EXCLUDED.no_of_units,
            club_house_size = EXCLUDED.club_house_size,
            structure = EXCLUDED.structure,
            typology = EXCLUDED.typology,
            sba = EXCLUDED.sba,
            price = EXCLUDED.price,
            rera_completion = EXCLUDED.rera_completion,
            updated_at = NOW()
          `,
          [
            Number(projectData.project_id),
            projectData.project_name.toString().trim(),
            slug,
            projectData.project_type ? projectData.project_type.toString().trim() : null,
            projectData.project_status ? projectData.project_status.toString().trim() : null,
            projectData.project_location ? projectData.project_location.toString().trim() : null,
            toNumber(projectData.total_acres),
            toNumber(projectData.no_of_units),
            projectData.club_house_size ? projectData.club_house_size.toString().trim() : null,
            projectData.structure ? projectData.structure.toString().trim() : null,
            projectData.typology ? projectData.typology.toString().trim() : null,
            projectData.sba ? projectData.sba.toString().trim() : null,
            projectData.price ? projectData.price.toString().trim() : null,
            projectData.rera_completion ? projectData.rera_completion.toString().trim() : null,
          ]
        );

        await client.query('COMMIT');
        results.successful++;
        
        // Add to processed rows
        results.processedRows.push({
          rowNumber: i,
          success: true,
          message: `Project ID ${projectData.project_id} imported successfully`
        });

      } catch (error) {
        await client.query('ROLLBACK');
        results.failed++;
        
        const errorMessage = error.message;
        results.errors.push({
          row: i,
          error: errorMessage,
          data: `Project ID: ${row.getCell(columnMap.project_id)?.value || 'Unknown'}`
        });
        
        // Add to processed rows
        results.processedRows.push({
          rowNumber: i,
          success: false,
          message: `Failed: ${errorMessage.substring(0, 100)}`
        });
        
        console.error(`Error processing row ${i}:`, error);
      }
    }

    // Add summary to mapping logs
    mappingLogs.push({
      type: 'summary',
      message: `Total rows processed: ${results.total}, Successful: ${results.successful}, Failed: ${results.failed}`
    });

    res.json({
      success: true,
      message: `Import completed. ${results.successful} of ${results.total} projects imported successfully.`,
      results,
      mappingLogs,
      unmatchedColumns
    });

  } catch (error) {
    console.error('Excel import error:', error);
    
    // Add error to mapping logs
    mappingLogs.push({
      type: 'error',
      message: `Import failed: ${error.message}`
    });
    
    res.status(500).json({
      success: false,
      message: 'Failed to import projects',
      error: error.message,
      mappingLogs,
      unmatchedColumns
    });
  } finally {
    client.release();
  }
};

// Download sample Excel template
exports.downloadSampleTemplate = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Projects');

    // Define columns with exact field names
    const columns = [
      { header: 'Project ID', key: 'project_id', width: 15 },
      { header: 'Project Name', key: 'project_name', width: 30 },
      { header: 'Project Type', key: 'project_type', width: 15 },
      { header: 'Project Status', key: 'project_status', width: 15 },
      { header: 'Project Location', key: 'project_location', width: 30 },
      { header: 'Total Acres', key: 'total_acres', width: 12 },
      { header: 'No of Units', key: 'no_of_units', width: 12 },
      { header: 'Club House Size', key: 'club_house_size', width: 18 },
      { header: 'Structure', key: 'structure', width: 12 },
      { header: 'Typology', key: 'typology', width: 20 },
      { header: 'SBA', key: 'sba', width: 20 },
      { header: 'Price', key: 'price', width: 20 },
      { header: 'RERA Completion', key: 'rera_completion', width: 20 },
    ];

    worksheet.columns = columns;

    // Style header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, size: 12 };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4F81BD' }
    };
    headerRow.font = { color: { argb: 'FFFFFFFF' }, bold: true };

    // Add sample data row
    worksheet.addRow({
      project_id: 1001,
      project_name: 'Sunset Villas',
      project_type: 'Villa',
      project_status: 'UC',
      project_location: 'Gachibowli, Hyderabad',
      total_acres: 15.5,
      no_of_units: 120,
      club_house_size: '25000 sq.ft',
      structure: 'G+3',
      typology: '3 BHK, 4 BHK',
      sba: '2500 - 4500 sq.ft',
      price: '2.5 Cr - 4.5 Cr',
      rera_completion: 'December 2025'
    });

    // Add note worksheet
    const notesWorksheet = workbook.addWorksheet('Instructions');
    notesWorksheet.getCell('A1').value = 'PROJECT IMPORT INSTRUCTIONS';
    notesWorksheet.getCell('A1').font = { bold: true, size: 14 };
    
    notesWorksheet.getCell('A3').value = 'Required Columns:';
    notesWorksheet.getCell('A3').font = { bold: true };
    notesWorksheet.getCell('A4').value = '• Project ID (must be unique numeric value)';
    notesWorksheet.getCell('A5').value = '• Project Name';
    
    notesWorksheet.getCell('A7').value = 'Optional Columns:';
    notesWorksheet.getCell('A7').font = { bold: true };
    notesWorksheet.getCell('A8').value = '• Project Type (e.g., Villa, Apartment, Commercial)';
    notesWorksheet.getCell('A9').value = '• Project Status (UC, RTM, Completed)';
    notesWorksheet.getCell('A10').value = '• Project Location';
    notesWorksheet.getCell('A11').value = '• Total Acres (numeric)';
    notesWorksheet.getCell('A12').value = '• No of Units (numeric)';
    notesWorksheet.getCell('A13').value = '• Club House Size (e.g., "25000 sq.ft")';
    notesWorksheet.getCell('A14').value = '• Structure (e.g., G+3, G+10)';
    notesWorksheet.getCell('A15').value = '• Typology (e.g., "3 BHK, 4 BHK")';
    notesWorksheet.getCell('A16').value = '• SBA (e.g., "2500 - 4500 sq.ft")';
    notesWorksheet.getCell('A17').value = '• Price (e.g., "2.5 Cr - 4.5 Cr")';
    notesWorksheet.getCell('A18').value = '• RERA Completion (e.g., "December 2025")';

    notesWorksheet.getCell('A20').value = 'Note: Column headers are flexible. The system will match:';
    notesWorksheet.getCell('A20').font = { bold: true };
    notesWorksheet.getCell('A21').value = '• "ID", "Project ID", "Code" → maps to project_id';
    notesWorksheet.getCell('A22').value = '• "Name", "Project Name" → maps to project_name';
    notesWorksheet.getCell('A23').value = '• "Status", "Stage" → maps to project_status';
    notesWorksheet.getCell('A24').value = '• "Location", "Address" → maps to project_location';
    notesWorksheet.getCell('A25').value = '• "Price", "Cost" → maps to price';
    notesWorksheet.getCell('A26').value = '• And many more keywords...';

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=project-import-template.xlsx');

    // Write to response
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Error generating template:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate template',
      error: error.message
    });
  }
};