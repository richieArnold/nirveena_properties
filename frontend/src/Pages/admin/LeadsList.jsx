import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Eye, 
  MessageCircle, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Home,
  AlertCircle,
  Clock,
  Info,
  Download,
  ArrowLeft,
  User,
  Tag
} from 'lucide-react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import AdminLayout from "../../components/admin/AdminLayout";
import Pagination from "../../components/admin/Pagination";
import AlertMessage from "../../components/admin/AlertMessage";
import axiosInstance from "../../utils/Instance";

const LeadsList = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showLegend, setShowLegend] = useState(true);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');

  // Status definitions for legend
  const statusDefinitions = [
    {
      status: 'New',
      icon: <AlertCircle className="w-4 h-4" />,
      color: 'bg-blue-100 text-blue-700',
      description: 'Fresh lead just submitted the form. Not yet contacted.',
      action: 'Review and make initial contact'
    },
    {
      status: 'Contacted',
      icon: <MessageCircle className="w-4 h-4" />,
      color: 'bg-yellow-100 text-yellow-700',
      description: 'Initial outreach made via call/email/WhatsApp.',
      action: 'Follow up and gauge interest'
    },
    {
      status: 'Qualified',
      icon: <CheckCircle className="w-4 h-4" />,
      color: 'bg-purple-100 text-purple-700',
      description: 'Genuine interest, budget matches, ready for site visit.',
      action: 'Schedule site visit, share detailed info'
    },
    {
      status: 'Converted',
      icon: <CheckCircle className="w-4 h-4" />,
      color: 'bg-green-100 text-green-700',
      description: 'Success! Lead became a customer.',
      action: 'Handover to sales team for processing'
    },
    {
      status: 'Lost',
      icon: <XCircle className="w-4 h-4" />,
      color: 'bg-gray-100 text-gray-700',
      description: 'Not interested, budget mismatch, or unresponsive.',
      action: 'Can be deleted from system'
    }
  ];

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');
    
    if (!token) {
      navigate('/admin/login');
    } else {
      setUser(JSON.parse(userData));
      fetchLeads();
    }
  }, [navigate, currentPage, statusFilter]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10
      };
      
      if (statusFilter) {
        params.status = statusFilter;
      }
      
      const response = await axiosInstance.get('/api/leads/all', { params });
      
      setLeads(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setTotalCount(response.data.pagination.totalCount);
    } catch (error) {
      console.log(error)
      setMessage({ type: "error", text: "Failed to load leads" });
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = async () => {
    setExportLoading(true);
    try {
      const response = await axiosInstance.get('/api/leads/export/all');
      const allLeads = response.data.data;
      
      if (!allLeads || allLeads.length === 0) {
        setMessage({ type: "error", text: "No leads to export" });
        setExportLoading(false);
        return;
      }
      
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Nirveena Properties Admin';
      workbook.lastModifiedBy = user?.username || 'Admin';
      workbook.created = new Date();
      workbook.modified = new Date();
      
      const worksheet = workbook.addWorksheet('Leads', {
        properties: { tabColor: { argb: 'FF4F81BD' } },
        views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
      });
      
      worksheet.columns = [
        { header: 'ID', key: 'id', width: 8 },
        { header: 'Name', key: 'name', width: 20 },
        { header: 'Phone', key: 'phone', width: 15 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Subject', key: 'subject', width: 25 },
        { header: 'Message', key: 'message', width: 40 },
        { header: 'Property Type', key: 'property_type', width: 15 },
        { header: 'Budget', key: 'budget', width: 15 },
        { header: 'Status', key: 'status', width: 12 },
        { header: 'Opened', key: 'opened', width: 8 },
        { header: 'Notes', key: 'notes', width: 30 },
        { header: 'Created Date', key: 'created_at', width: 20 },
        { header: 'Opened Date', key: 'opened_at', width: 20 },
        { header: 'Last Updated', key: 'updated_at', width: 20 }
      ];
      
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4F81BD' }
      };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
      headerRow.height = 25;
      
      allLeads.forEach(lead => {
        const messagePreview = lead.message?.length > 100 
          ? lead.message.substring(0, 100) + '...' 
          : lead.message || '';
        
        worksheet.addRow({
          id: lead.id,
          name: lead.name,
          phone: lead.phone,
          email: lead.email,
          subject: lead.subject || 'N/A',
          message: messagePreview,
          property_type: lead.property_type || 'Any',
          budget: lead.budget || 'Not specified',
          status: lead.status?.charAt(0).toUpperCase() + lead.status?.slice(1) || 'New',
          opened: lead.opened ? 'Yes' : 'No',
          notes: lead.notes || '',
          created_at: lead.created_at ? new Date(lead.created_at).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            dateStyle: 'medium',
            timeStyle: 'short'
          }) : 'N/A',
          opened_at: lead.opened_at ? new Date(lead.opened_at).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            dateStyle: 'medium',
            timeStyle: 'short'
          }) : 'N/A',
          updated_at: lead.updated_at ? new Date(lead.updated_at).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            dateStyle: 'medium',
            timeStyle: 'short'
          }) : 'N/A'
        });
      });
      
      worksheet.addRow([]);
      
      const summaryHeaderRow = worksheet.addRow(['SUMMARY']);
      summaryHeaderRow.font = { bold: true, size: 14, color: { argb: 'FF4F81BD' } };
      summaryHeaderRow.height = 25;
      
      const totalRow = worksheet.addRow(['Total Leads:', allLeads.length]);
      totalRow.font = { bold: true };
      totalRow.getCell(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF0F0F0' }
      };
      
      const dateRow = worksheet.addRow(['Export Date:', new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })]);
      dateRow.font = { bold: true };
      dateRow.getCell(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF0F0F0' }
      };
      
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const fileName = `leads_export_${new Date().toLocaleDateString('en-IN').replace(/\//g, '-')}.xlsx`;
      saveAs(blob, fileName);
      
      setMessage({ type: "success", text: `Successfully exported ${allLeads.length} leads to Excel!` });
    } catch (error) {
      console.error("Export error:", error);
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to export leads" });
    } finally {
      setExportLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axiosInstance.put(`/api/leads/${id}/status`, { status: newStatus });
      setMessage({ type: "success", text: "Status updated successfully!" });
      fetchLeads();
    } catch (error) {
      console.log(error)
      setMessage({ type: "error", text: "Failed to update status" });
    }
  };

  const handleViewLead = (id) => {
    navigate(`/admin/leads/${id}`);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'new': { bg: 'bg-blue-100', text: 'text-blue-700', icon: <AlertCircle className="w-3 h-3" /> },
      'contacted': { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <MessageCircle className="w-3 h-3" /> },
      'qualified': { bg: 'bg-purple-100', text: 'text-purple-700', icon: <CheckCircle className="w-3 h-3" /> },
      'converted': { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle className="w-3 h-3" /> },
      'lost': { bg: 'bg-gray-100', text: 'text-gray-700', icon: <XCircle className="w-3 h-3" /> }
    };
    const config = statusConfig[status] || statusConfig.new;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString('en-IN', { 
        timeZone: 'Asia/Kolkata',
        hour: '2-digit', 
        minute: '2-digit' 
      })}`;
    }
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <AdminLayout user={user}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => navigate('/admin')}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Lead Management</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Total: {totalCount} leads</p>
          </div>
          
          {/* Action Buttons - Mobile Responsive */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={exportToExcel}
              disabled={exportLoading}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 text-xs sm:text-sm disabled:bg-green-300"
              title="Export to Excel"
            >
              <Download className="w-4 h-4" />
              <span className="hidden xs:inline">{exportLoading ? 'Exporting...' : 'Export'}</span>
              <span className="xs:hidden">Excel</span>
            </button>
            
            <button
              onClick={() => setShowLegend(!showLegend)}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <Info className="w-4 h-4" />
              <span className="hidden xs:inline">{showLegend ? 'Hide Guide' : 'Guide'}</span>
              <span className="xs:hidden">Guide</span>
            </button>
            
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
            >
              <option value="">All</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
            
            <button
              onClick={fetchLeads}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-2 text-xs sm:text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden xs:inline">Refresh</span>
            </button>
          </div>
        </div>

        <AlertMessage 
          message={message.text} 
          type={message.type} 
          onClose={() => setMessage({ type: "", text: "" })} 
        />

        {/* Status Legend Panel - Responsive */}
        {showLegend && (
          <div className="mb-6 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 sm:px-6 py-3 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                <h2 className="text-sm sm:text-base font-semibold">Lead Status Guide</h2>
              </div>
              <button
                onClick={() => setShowLegend(false)}
                className="text-white/80 hover:text-white transition"
              >
                <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              {statusDefinitions.map((item, index) => (
                <div key={index} className="border border-gray-100 rounded-lg p-3 sm:p-4 hover:shadow-md transition">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium ${item.color}`}>
                      {item.icon}
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                  <p className="text-xs font-medium text-blue-600">→ {item.action}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-gray-50 px-4 sm:px-6 py-3 border-t border-gray-100">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                <span className="text-gray-600">Quick Tips:</span>
                <span className="flex items-center gap-1 text-blue-600">
                  <AlertCircle className="w-3 h-3" /> New
                </span>
                <span className="flex items-center gap-1 text-purple-600">
                  <CheckCircle className="w-3 h-3" /> Qualified
                </span>
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-3 h-3" /> Converted
                </span>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Budget</th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Received</th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leads.map((lead) => (
                      <tr 
                        key={lead.id} 
                        className={`hover:bg-gray-50 transition cursor-pointer ${
                          !lead.opened ? 'bg-blue-50/30 font-medium' : ''
                        }`}
                        onClick={() => handleViewLead(lead.id)}
                      >
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(lead.status)}
                          {!lead.opened && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              New
                            </span>
                          )}
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                          {lead.subject && (
                            <div className="text-xs text-gray-500 truncate max-w-[150px]">
                              {lead.subject}
                            </div>
                          )}
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-600">
                            <Mail className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate max-w-[120px]">{lead.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-600 mt-1">
                            <Phone className="w-3 h-3 flex-shrink-0" />
                            <span>{lead.phone}</span>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-600">
                            <Home className="w-3 h-3 flex-shrink-0" />
                            <span>{lead.property_type || 'Any'}</span>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-600">
                            <DollarSign className="w-3 h-3 flex-shrink-0" />
                            <span>{lead.budget || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-600">
                            <Clock className="w-3 h-3 flex-shrink-0" />
                            <span>{formatDate(lead.created_at)}</span>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <select
                              value={lead.status}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleStatusChange(lead.id, e.target.value);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="qualified">Qualified</option>
                              <option value="converted">Converted</option>
                              <option value="lost">Lost</option>
                            </select>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewLead(lead.id);
                              }}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden space-y-4">
              {leads.map((lead) => (
                <div 
                  key={lead.id} 
                  className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden ${
                    !lead.opened ? 'border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => handleViewLead(lead.id)}
                >
                  {/* Card Header */}
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(lead.status)}
                        {!lead.opened && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            New
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">ID: #{lead.id}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
                    {lead.subject && (
                      <p className="text-sm text-gray-500 mt-1">{lead.subject}</p>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3">
                    {/* Contact Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-600 truncate">{lead.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-600">{lead.phone}</span>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-600">{lead.property_type || 'Any'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-600">{lead.budget || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-600">{formatDate(lead.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-600 capitalize">{lead.status}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <select
                        value={lead.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleStatusChange(lead.id, e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="converted">Converted</option>
                        <option value="lost">Lost</option>
                      </select>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewLead(lead.id);
                        }}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {leads.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No leads found</p>
              </div>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default LeadsList;