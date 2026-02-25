import React, { useState, useEffect } from "react";
import axios from "axios";
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
  Info
} from 'lucide-react';
import AdminLayout from "../../components/admin/AdminLayout";
import Pagination from "../../components/admin/Pagination";
import AlertMessage from "../../components/admin/AlertMessage";

import axiosInstance from "../../utils/Instance";


const LeadsList = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
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
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchLeads();
    }
  }, [navigate, currentPage, statusFilter]);

 const fetchLeads = async () => {
  setLoading(true);
  try {
    // Build the URL with query parameters
    const params = {
      page: currentPage,
      limit: 10
    };
    
    // Add status filter if selected
    if (statusFilter) {
      params.status = statusFilter;
    }
    
    // Make the request using axiosInstance
    const response = await axiosInstance.get('/api/leads/all', { params });
    
    setLeads(response.data.data);
    setTotalPages(response.data.pagination.totalPages);
    setTotalCount(response.data.pagination.totalCount);
  } catch (error) {
    setMessage({ type: "error", text: "Failed to load leads" });
  } finally {
    setLoading(false);
  }
};

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axiosInstance.put(`/api/leads/${id}/status`, { status: newStatus });
      setMessage({ type: "success", text: "Status updated successfully!" });
      fetchLeads();
    } catch (error) {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
            <p className="text-sm text-gray-500 mt-1">Total: {totalCount} leads</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLegend(!showLegend)}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition flex items-center gap-2"
              title="Toggle Status Guide"
            >
              <Info className="w-4 h-4" />
              {showLegend ? 'Hide Guide' : 'Show Guide'}
            </button>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
            <button
              onClick={fetchLeads}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        <AlertMessage 
          message={message.text} 
          type={message.type} 
          onClose={() => setMessage({ type: "", text: "" })} 
        />

        {/* Status Legend Panel - Slides in from right */}
        {showLegend && (
          <div className="mb-6 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                <h2 className="font-semibold">Lead Status Guide</h2>
              </div>
              <button
                onClick={() => setShowLegend(false)}
                className="text-white/80 hover:text-white transition"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-5 gap-4">
              {statusDefinitions.map((item, index) => (
                <div key={index} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${item.color}`}>
                      {item.icon}
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{item.description}</p>
                  <p className="text-xs font-medium text-blue-600">→ {item.action}</p>
                </div>
              ))}
            </div>
            
            {/* Quick Stats Summary */}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600">Quick Tips:</span>
                <span className="flex items-center gap-1 text-blue-600">
                  <AlertCircle className="w-3 h-3" /> New = Fresh leads
                </span>
                <span className="flex items-center gap-1 text-purple-600">
                  <CheckCircle className="w-3 h-3" /> Qualified = Hot leads
                </span>
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-3 h-3" /> Converted = Done deals
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
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Budget</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Received</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(lead.status)}
                          {!lead.opened && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              New
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                          {lead.subject && (
                            <div className="text-xs text-gray-500 truncate max-w-[200px]">
                              {lead.subject}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-3 h-3" />
                            <span className="truncate max-w-[150px]">{lead.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <Phone className="w-3 h-3" />
                            <span>{lead.phone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Home className="w-3 h-3" />
                            <span>{lead.property_type || 'Any'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <DollarSign className="w-3 h-3" />
                            <span>{lead.budget || 'Not specified'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-3 h-3" />
                            <span title={new Date(lead.created_at).toLocaleString()}>
                              {formatDate(lead.created_at)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
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
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition"
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

              {leads.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-gray-500">No leads found</p>
                </div>
              )}
            </div>

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