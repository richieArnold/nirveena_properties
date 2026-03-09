import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar,
  Home,
  Trash2,
  Clock,
  DollarSign,
  MapPin
} from 'lucide-react';
import AdminLayout from "../../components/admin/AdminLayout";
import AlertMessage from "../../components/admin/AlertMessage";
import axiosInstance from "../../utils/Instance";


const CustomerDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');
    
    if (!token) {
      navigate('/admin/login');
    } else {
      setUser(JSON.parse(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCustomer();
    }
  }, [navigate, id]);

  const fetchCustomer = async () => {
    try {
      const response = await axiosInstance.get(`/api/customers/customers/${id}`);
      setCustomer(response.data.data);
    } catch (error) {
      console.log(error)
      setMessage({ type: "error", text: "Failed to fetch customer details" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEnquiry = async (enquiryId) => {
    if (!window.confirm('Delete this enquiry?')) return;

    try {
      await axiosInstance.delete(`/api/customers/enquiries/${enquiryId}`);
      setMessage({ type: "success", text: "Enquiry deleted successfully!" });
      fetchCustomer();
    } catch (error) {
      console.log(error)
      setMessage({ type: "error", text: "Failed to delete enquiry" });
    }
  };

  // Use the SAME format as LeadDetails.jsx for detail page
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

  if (!customer) {
    return (
      <AdminLayout user={user}>
        <div className="text-center py-20">
          <p className="text-gray-500">Customer not found</p>
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
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/admin/customers')}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Customer Details</h1>
        </div>

        <AlertMessage 
          message={message.text} 
          type={message.type} 
          onClose={() => setMessage({ type: "", text: "" })} 
        />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Customer Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                  {customer.first_name[0]}{customer.last_name[0]}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {customer.first_name} {customer.last_name}
                  </h2>
                  <p className="text-sm text-gray-500">Customer ID: #{customer.id}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <a href={`mailto:${customer.email}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                      {customer.email}
                    </a>
                  </div>
                </div>

                {customer.contact && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <a href={`tel:${customer.contact}`} className="text-sm font-medium text-gray-900">
                        {customer.contact}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-500">Registered On</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(customer.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Enquiries */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Enquiry History ({customer.enquiries?.length || 0})
              </h3>

              {customer.enquiries?.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No enquiries found</p>
              ) : (
                <div className="space-y-4">
                  {customer.enquiries.map((enquiry) => (
                    <div key={enquiry.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-blue-600" />
                          <h4 className="font-semibold text-gray-900">
                            {enquiry.project_name || 'Unknown Project'}
                          </h4>
                        </div>
                        <button
                          onClick={() => handleDeleteEnquiry(enquiry.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete Enquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-2">
                        {enquiry.project_location && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{enquiry.project_location}</span>
                          </div>
                        )}
                        {enquiry.price && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <DollarSign className="w-4 h-4" />
                            <span>{enquiry.price}</span>
                          </div>
                        )}
                        {enquiry.project_type && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Home className="w-4 h-4" />
                            <span>{enquiry.project_type}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(enquiry.enquired_at)}</span>
                        </div>
                      </div>

                      {enquiry.project_id && (
                        <button
                          onClick={() => navigate(`/admin/view/${enquiry.project_id}`)}
                          className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View Project Details →
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CustomerDetails;