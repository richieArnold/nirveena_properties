import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Mail, 
  Phone, 
  Calendar,
  Home,
  Trash2,
  Eye,
  RefreshCw,
  Clock,
  ChevronRight
} from 'lucide-react';
import AdminLayout from "../../components/admin/AdminLayout";
import Pagination from "../../components/admin/Pagination";
import AlertMessage from "../../components/admin/AlertMessage";
import axiosInstance from "../../utils/Instance";


const CustomersList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [deleteLoading, setDeleteLoading] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');
    
    if (!token) {
      navigate('/admin/login');
    } else {
      setUser(JSON.parse(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCustomers();
    }
  }, [navigate, currentPage]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/api/customers/customers/all?page=${currentPage}&limit=10`
      );
      setCustomers(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setTotalCount(response.data.pagination.totalCount);
    } catch (error) {
      console.log(error)
      setMessage({ type: "error", text: "Failed to load customers" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete customer "${name}"? This will also delete all their enquiries.`)) return;

    setDeleteLoading(id);
    try {
      await axiosInstance.delete(`/api/customers/customers/${id}`);
      setMessage({ type: "success", text: "Customer deleted successfully!" });
      fetchCustomers();
    } catch (error) {
      console.log(error)
      setMessage({ type: "error", text: "Failed to delete customer" });
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleViewCustomer = (id) => {
    navigate(`/admin/customers/${id}`);
  };

  // FIXED: Format date to show IST correctly without double conversion
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    // Create date object - the string from backend is already in IST
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    // Format in IST without timezone conversion
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata', // Explicitly set to IST
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Alternative: If you want relative time (Today, Yesterday, etc.)
  const formatRelativeTime = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const now = new Date();
    
    // Convert both to IST for comparison
    const istDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const istNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    
    const diffTime = Math.abs(istNow - istDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      if (diffHours < 1) {
        const diffMinutes = Math.ceil(diffTime / (1000 * 60));
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
      }
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? 's' : ''} ago`;
    
    return formatDate(dateString);
  };

  return (
    <AdminLayout user={user}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
            <p className="text-sm text-gray-500 mt-1">Total: {totalCount} customers</p>
          </div>
          <button
            onClick={fetchCustomers}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        <AlertMessage 
          message={message.text} 
          type={message.type} 
          onClose={() => setMessage({ type: "", text: "" })} 
        />

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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Latest Enquiry</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered (IST)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customers.map((customer) => (
                      <tr 
                        key={customer.id} 
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                              {customer.first_name[0]}{customer.last_name[0]}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {customer.first_name} {customer.last_name}
                              </div>
                              <div className="text-xs text-gray-500">
                                ID: #{customer.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="w-3 h-3" />
                              <span className="truncate max-w-[150px]">{customer.email}</span>
                            </div>
                            {customer.contact && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="w-3 h-3" />
                                <span>{customer.contact}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {customer.latest_enquiry ? (
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1 text-sm text-gray-900">
                                <Home className="w-3 h-3 text-blue-600" />
                                <span className="font-medium">
                                  {customer.latest_enquiry.project_name || 'Unknown Project'}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                <Clock className="w-3 h-3" />
                                <span title={formatDate(customer.latest_enquiry.enquired_at)}>
                                  {formatRelativeTime(customer.latest_enquiry.enquired_at)}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">No enquiries</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            {customer.total_enquiries || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="flex flex-col">
                            <span>{formatDate(customer.created_at)}</span>
                            <span className="text-xs text-gray-400">IST</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewCustomer(customer.id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(customer.id, `${customer.first_name} ${customer.last_name}`)}
                              disabled={deleteLoading === customer.id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                              title="Delete Customer"
                            >
                              {deleteLoading === customer.id ? (
                                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {customers.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-gray-500">No customers found</p>
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

export default CustomersList;