import React, { useState } from 'react';
import { Download, Upload, AlertCircle, CheckCircle, XCircle, FileSpreadsheet, ChevronDown, ChevronUp } from 'lucide-react';
import axiosInstance from '../../utils/Instance';

const ExcelImport = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const [columnGuide, setColumnGuide] = useState(null);
  const [showGuide, setShowGuide] = useState(false);
  const [mappingLogs, setMappingLogs] = useState([]);
  const [unmatchedColumns, setUnmatchedColumns] = useState([]);
  const [showMappingDetails, setShowMappingDetails] = useState(false);
  const [showRowDetails, setShowRowDetails] = useState(false);

  // Fetch column mapping guide
  const fetchGuide = async () => {
    try {
      const response = await axiosInstance.get('/api/excel-import/guide');
      setColumnGuide(response.data);
      setShowGuide(true);
    } catch (error) {
      console.error('Error fetching guide:', error);
    }
  };

  // Download template
  const downloadTemplate = async () => {
    try {
      const response = await axiosInstance.get('/api/excel-import/template', {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'project-import-template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading template:', error);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setImportResults(null);
    setMappingLogs([]);
    setUnmatchedColumns([]);
    setShowMappingDetails(false);
    setShowRowDetails(false);
  };

  // Handle file upload and import
  const handleImport = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    setLoading(true);
    setMappingLogs([]);
    setUnmatchedColumns([]);
    
    const formData = new FormData();
    formData.append('excelFile', file);

    try {
      const response = await axiosInstance.post('/api/excel-import/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Import response:', response.data); // Debug log
      
      // Set mapping logs from response
      if (response.data.mappingLogs) {
        setMappingLogs(response.data.mappingLogs);
      }
      
      // Set unmatched columns
      if (response.data.unmatchedColumns) {
        setUnmatchedColumns(response.data.unmatchedColumns);
      }
      
      // Set import results
      if (response.data.results) {
        setImportResults(response.data.results);
      }
      
      // Show success message
      if (response.data.success) {
        // Optional: Show toast or alert
      }
    } catch (error) {
      console.error('Import error:', error);
      
      // If error response contains data, show it
      if (error.response?.data) {
        if (error.response.data.mappingLogs) {
          setMappingLogs(error.response.data.mappingLogs);
        }
        if (error.response.data.unmatchedColumns) {
          setUnmatchedColumns(error.response.data.unmatchedColumns);
        }
        alert(error.response.data.message || 'Failed to import projects');
      } else {
        alert('Failed to import projects');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Import Projects from Excel</h2>
      
      {/* Action Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={downloadTemplate}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
        >
          <Download size={18} />
          Download Template
        </button>
        
        <button
          onClick={fetchGuide}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <AlertCircle size={18} />
          View Column Guide
        </button>
      </div>

      {/* Column Mapping Guide */}
      {showGuide && columnGuide && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">Column Mapping Guide</h3>
          <p className="text-sm text-blue-600 mb-3">{columnGuide.message}</p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-blue-100">
                  <th className="px-3 py-2 text-left">Excel Column</th>
                  <th className="px-3 py-2 text-left">Required</th>
                  <th className="px-3 py-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                {columnGuide.columnMapping.map((col, index) => (
                  <tr key={index} className="border-b border-blue-100">
                    <td className="px-3 py-2 font-medium">{col.excelColumn}</td>
                    <td className="px-3 py-2">
                      {col.required ? (
                        <span className="text-red-600 font-medium">Required</span>
                      ) : (
                        <span className="text-gray-500">Optional</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-gray-600">{col.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 p-3 bg-white rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Sample Row:</p>
            <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
              {JSON.stringify(columnGuide.sampleRow, null, 2)}
            </pre>
          </div>

          <button
            onClick={() => setShowGuide(false)}
            className="mt-3 text-sm text-blue-600 hover:text-blue-800"
          >
            Hide Guide
          </button>
        </div>
      )}

      {/* File Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Excel File
        </label>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
        <p className="text-xs text-gray-500 mt-1">
          Supported formats: .xlsx, .xls (Max size: 10MB)
        </p>
      </div>

      {/* Import Button */}
      <button
        onClick={handleImport}
        disabled={!file || loading}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Importing...
          </>
        ) : (
          <>
            <Upload size={18} />
            Import Projects
          </>
        )}
      </button>

      {/* Column Mapping Summary */}
      {mappingLogs.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900">Column Mapping Summary</h3>
            <button
              onClick={() => setShowMappingDetails(!showMappingDetails)}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              {showMappingDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {showMappingDetails ? 'Hide Details' : 'Show Details'}
            </button>
          </div>
          
          {/* Success Summary */}
          <div className="mb-3">
            <p className="text-sm text-gray-600">
              ✅ {mappingLogs.filter(log => log.type === 'success').length} columns matched successfully
              {unmatchedColumns.length > 0 && (
                <span className="ml-2 text-yellow-600">
                  ⚠️ {unmatchedColumns.length} columns unmatched
                </span>
              )}
            </p>
          </div>

          {/* Mapping Preview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-3">
            {mappingLogs.filter(log => log.type === 'success').map((log, index) => (
              <div key={index} className="bg-white p-2 rounded border text-xs">
                <span className="font-medium text-gray-700 truncate block" title={log.excelColumn}>
                  {log.excelColumn}:
                </span>
                <span className="text-green-600 font-medium">→ {log.databaseField}</span>
              </div>
            ))}
          </div>

          {/* Detailed Mapping Logs */}
          {showMappingDetails && (
            <div className="mt-3 bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-xs max-h-60 overflow-y-auto">
              <div className="flex items-center gap-2 mb-2 text-gray-400 border-b border-gray-700 pb-1">
                <FileSpreadsheet size={14} />
                <span>Column Mapping Execution Log</span>
              </div>
              {mappingLogs.map((log, index) => (
                <div key={index} className="py-1 border-b border-gray-800 last:border-0">
                  {log.type === 'success' && (
                    <span className="text-green-400">✅</span>
                  )}
                  {log.type === 'warning' && (
                    <span className="text-yellow-400">⚠️</span>
                  )}
                  {log.type === 'error' && (
                    <span className="text-red-400">❌</span>
                  )}
                  {log.type === 'summary' && (
                    <span className="text-blue-400">📊</span>
                  )}
                  <span className="ml-2">
                    {log.columnIndex !== undefined && (
                      <span className="text-blue-400">Col {log.columnIndex}</span>
                    )}
                    {log.excelColumn && (
                      <span className="text-gray-400"> "{log.excelColumn}"</span>
                    )}
                    {log.databaseField && log.databaseField !== 'ignored' && (
                      <span className="text-purple-400"> → {log.databaseField}</span>
                    )}
                    {log.databaseField === 'ignored' && (
                      <span className="text-yellow-400"> → ignored</span>
                    )}
                    {log.note && (
                      <span className="text-yellow-400 ml-2">({log.note})</span>
                    )}
                    {log.message && (
                      <span className="text-gray-300">{log.message}</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Unmatched Columns Warning */}
          {unmatchedColumns.length > 0 && (
            <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
              <h4 className="text-xs font-medium text-yellow-800 mb-1 flex items-center gap-1">
                <AlertCircle size={12} />
                Unmatched Columns ({unmatchedColumns.length})
              </h4>
              <div className="flex flex-wrap gap-1">
                {unmatchedColumns.map((col, idx) => (
                  <span key={idx} className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                    {col}
                  </span>
                ))}
              </div>
              <p className="text-xs text-yellow-600 mt-1">
                These columns were not matched to any database field and were ignored.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Import Results */}
      {importResults && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Import Results</h3>
          
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-blue-100 p-3 rounded-lg text-center">
              <p className="text-xs text-blue-600">Total</p>
              <p className="text-xl font-bold text-blue-700">{importResults.total || 0}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg text-center">
              <p className="text-xs text-green-600">Successful</p>
              <p className="text-xl font-bold text-green-700">{importResults.successful || 0}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg text-center">
              <p className="text-xs text-red-600">Failed</p>
              <p className="text-xl font-bold text-red-700">{importResults.failed || 0}</p>
            </div>
          </div>

          {/* Row Processing Toggle */}
          {importResults.processedRows && importResults.processedRows.length > 0 && (
            <div className="mb-4">
              <button
                onClick={() => setShowRowDetails(!showRowDetails)}
                className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-2"
              >
                {showRowDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                Row Processing Details ({importResults.processedRows.length} rows)
              </button>
              
              {showRowDetails && (
                <div className="bg-white p-2 rounded border max-h-40 overflow-y-auto">
                  {importResults.processedRows.map((row, index) => (
                    <div key={index} className="text-xs py-1 border-b last:border-0 flex items-center gap-2">
                      {row.success ? (
                        <CheckCircle size={12} className="text-green-500 flex-shrink-0" />
                      ) : (
                        <XCircle size={12} className="text-red-500 flex-shrink-0" />
                      )}
                      <span className="text-gray-600">Row {row.rowNumber}:</span>
                      <span className={row.success ? 'text-green-600' : 'text-red-600'}>
                        {row.message}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Errors */}
          {importResults.errors && importResults.errors.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Errors:</h4>
              <div className="max-h-40 overflow-y-auto">
                {importResults.errors.map((error, index) => (
                  <div key={index} className="text-xs text-red-600 mb-1 p-2 bg-red-50 rounded">
                    Row {error.row}: {error.error}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExcelImport;