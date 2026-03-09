import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  DollarSign,
  Home,
  MessageCircle,
  Save,
  Clock,
  CheckCircle,
  XCircle,
  Edit3,
  Eye,
  Trash2  // Add this import
} from 'lucide-react';
import AdminLayout from "../../components/admin/AdminLayout";
import AlertMessage from "../../components/admin/AlertMessage";
import axiosInstance from "../../utils/Instance";


const LeadDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');
    
    if (!token) {
      navigate('/admin/login');
    } else {
      setUser(JSON.parse(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchLead();
    }
  }, [navigate, id]);

  const fetchLead = async () => {
    try {
      const response = await axiosInstance.get(`/api/leads/${id}`);
      setLead(response.data.data);
      setNotes(response.data.data.notes || '');
    } catch (error) {
      console.log(error)
      setMessage({ type: "error", text: "Failed to fetch lead details" });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await axiosInstance.put(`/api/leads/${id}/status`, { status: newStatus });
      setLead({ ...lead, status: newStatus });
      setMessage({ type: "success", text: "Status updated successfully!" });
      
      // If status is 'lost', show delete option
      if (newStatus === 'lost') {
        setTimeout(() => {
          if (window.confirm('Lead marked as lost. Would you like to delete it?')) {
            handleDeleteLead();
          }
        }, 500);
      }
    } catch (error) {
      console.log(error)
      setMessage({ type: "error", text: "Failed to update status" });
    }
  };

  const handleDeleteLead = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this lead?')) return;
    
    setDeleting(true);
    try {
      await axiosInstance.delete(`/api/leads/${id}`);
      setMessage({ type: "success", text: "Lead deleted successfully!" });
      setTimeout(() => navigate('/admin/leads'), 1500);
    } catch (error) {
      console.log(error)
      setMessage({ type: "error", text: "Failed to delete lead" });
    } finally {
      setDeleting(false);
    }
  };

  const handleSaveNotes = async () => {
    setSaving(true);
    try {
      await axiosInstance.put(`/api/leads/${id}/notes`, { notes });
      setMessage({ type: "success", text: "Notes saved successfully!" });
    } catch (error) {
      console.log(error)
      setMessage({ type: "error", text: "Failed to save notes" });
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'new': 'bg-blue-100 text-blue-700 border-blue-200',
      'contacted': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'qualified': 'bg-purple-100 text-purple-700 border-purple-200',
      'converted': 'bg-green-100 text-green-700 border-green-200',
      'lost': 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[status] || colors.new;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'short'
    });
  };

  if (loading) {
    return (
      <AdminLayout user={user}>
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!lead) {
    return (
      <AdminLayout user={user}>
        <div className="text-center py-20">
          <p className="text-gray-500">Lead not found</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout user={user}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/leads')}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Lead Details</h1>
          </div>
          
          {/* Delete button - shown for lost status or as additional option */}
          {lead.status === 'lost' && (
            <button
              onClick={handleDeleteLead}
              disabled={deleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:bg-red-300 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {deleting ? 'Deleting...' : 'Delete Lead'}
            </button>
          )}
        </div>

        <AlertMessage 
          message={message.text} 
          type={message.type} 
          onClose={() => setMessage({ type: "", text: "" })} 
        />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Lead Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status & Basic Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{lead.name}</h2>
                  <p className="text-gray-500 mt-1">{lead.subject || 'No subject'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className={`px-4 py-2 rounded-lg border font-medium ${getStatusColor(lead.status)}`}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="converted">Converted</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <a href={`mailto:${lead.email}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                      {lead.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <a href={`tel:${lead.phone}`} className="text-sm font-medium text-gray-900">
                      {lead.phone}
                    </a>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Home className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-500">Property Type</p>
                    <p className="text-sm font-medium text-gray-900">
                      {lead.property_type || 'Not specified'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-xs text-gray-500">Budget Range</p>
                    <p className="text-sm font-medium text-gray-900">
                      {lead.budget || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Message</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{lead.message}</p>
            </div>

            {/* Notes Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
                <button
                  onClick={handleSaveNotes}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="6"
                placeholder="Add your notes about this lead..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Right Column - Timeline & Metadata */}
          <div className="space-y-6">
            {/* Status Timeline */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Created</p>
                    <p className="text-xs text-gray-500">{formatDate(lead.created_at)}</p>
                    {/* <p className="text-xs text-gray-400 mt-1">(IST - Indian Standard Time)</p> */}
                  </div>
                </div>

                {lead.opened && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Eye className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">First Viewed</p>
                      <p className="text-xs text-gray-500">{formatDate(lead.opened_at)}</p>
                      {/* <p className="text-xs text-gray-400 mt-1">(IST - Indian Standard Time)</p> */}
                    </div>
                  </div>
                )}

                {lead.last_viewed_at && lead.last_viewed_at !== lead.opened_at && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Last Viewed</p>
                      <p className="text-xs text-gray-500">{formatDate(lead.last_viewed_at)}</p>
                      {/* <p className="text-xs text-gray-400 mt-1">(IST - Indian Standard Time)</p> */}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            {/* <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a
                  href={`mailto:${lead.email}`}
                  className="flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition"
                >
                  <Mail className="w-5 h-5" />
                  <span>Send Email</span>
                </a>
                <a
                  href={`tel:${lead.phone}`}
                  className="flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition"
                >
                  <Phone className="w-5 h-5" />
                  <span>Call Now</span>
                </a>
                <button
                  onClick={() => window.open(`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`, '_blank')}
                  className="w-full flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default LeadDetails;