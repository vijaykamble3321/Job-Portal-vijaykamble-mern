import React, { useEffect, useState } from "react";
import API from '../../../../utils/API';
import { 
  FaUser, FaEnvelope, FaPhone, FaEdit, FaTrash, FaSave, FaTimes,
  FaBuilding, FaSearch, FaUserTie
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Avatar from 'react-avatar';

const AllEmployers = () => {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    fname: '',
    lname: '',
    email: '',
    mobile: '',
    companyName: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEmployers();
  }, []);

  const fetchEmployers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await API.get("/api/protected/admin/user/employe-all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployers(response.data.data || []);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch employers");
      setLoading(false);
      toast.error("Failed to load employers");
    }
  };

  const handleEdit = (employer) => {
    setEditingId(employer._id);
    setEditForm({
      fname: employer.fname || '',
      lname: employer.lname || '',
      email: employer.email || '',
      mobile: employer.mobile || '',
      companyName: employer.companyName || ''
    });
  };

  const handleUpdate = async () => {
    if (!editForm.fname || !editForm.lname || !editForm.email) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await API.put(`/api/protected/admin/user/update/${editingId}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Employer updated successfully");
      setEmployers(employers.map(emp => 
        emp._id === editingId ? { ...emp, ...editForm } : emp
      ));
      setEditingId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employer?")) return;
    
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/api/protected/admin/user/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Employer deleted successfully");
      setEmployers(employers.filter(emp => emp._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete employer");
    }
  };

  const filteredEmployers = employers.filter(emp => {
    if (!emp) return false;
    
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${emp.fname || ''} ${emp.lname || ''}`.toLowerCase();
    const email = emp.email ? emp.email.toLowerCase() : '';
    const mobile = emp.mobile || '';
    const companyName = emp.companyName ? emp.companyName.toLowerCase() : '';
    
    return (
      fullName.includes(searchLower) ||
      email.includes(searchLower) ||
      mobile.includes(searchTerm) ||
      companyName.includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="text-blue-500 text-4xl"
        >
          <FaBuilding />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button 
            onClick={fetchEmployers}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <FaUserTie className="mr-2 text-blue-500" />
              Employers Management
            </h1>
            <p className="text-gray-600 mt-1">{filteredEmployers.length} employers registered</p>
          </div>
          
          <div className="w-full md:w-64">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search employers..."
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </motion.div>

        {/* Employers Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>

                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployers.length > 0 ? (
                  <AnimatePresence>
                    {filteredEmployers.map((emp, index) => (
                      <motion.tr 
                        key={emp._id}
                        className="hover:bg-gray-50"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <Avatar
                                name={`${emp.fname || ''} ${emp.lname || ''}`}
                                size="40"
                                round={true}
                                color="#3B82F6"
                                fgColor="#fff"
                              />
                            </div>
                            <div className="ml-4">
                              {editingId === emp._id ? (
                                <div className="flex space-x-2">
                                  <input
                                    type="text"
                                    value={editForm.fname}
                                    onChange={(e) => setEditForm({...editForm, fname: e.target.value})}
                                    className="border rounded px-2 py-1 w-24 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                  />
                                  <input
                                    type="text"
                                    value={editForm.lname}
                                    onChange={(e) => setEditForm({...editForm, lname: e.target.value})}
                                    className="border rounded px-2 py-1 w-24 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                  />
                                </div>
                              ) : (
                                <div className="text-sm font-medium text-gray-900">
                                  {emp.fname} {emp.lname}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {editingId === emp._id ? (
                            <>
                              <div className="mb-2">
                                <input
                                  type="email"
                                  value={editForm.email}
                                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                  className="border rounded px-2 py-1 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                              </div>
                              <input
                                type="text"
                                value={editForm.mobile}
                                onChange={(e) => setEditForm({...editForm, mobile: e.target.value})}
                                className="border rounded px-2 py-1 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                              />
                            </>
                          ) : (
                            <>
                              <div className="text-sm text-gray-900 flex items-center">
                                <FaEnvelope className="mr-2 text-gray-400" />
                                {emp.email}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center mt-1">
                                <FaPhone className="mr-2 text-gray-400" />
                                {emp.mobile || 'Not provided'}
                              </div>
                            </>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {editingId === emp._id ? (
                            <input
                              type="text"
                              value={editForm.companyName}
                              onChange={(e) => setEditForm({...editForm, companyName: e.target.value})}
                              className="border rounded px-2 py-1 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                          ) : (
                            emp.companyName && (
                              <div className="text-sm text-gray-900 flex items-center">
                                <FaBuilding className="mr-2 text-gray-400" />
                                {emp.companyName}
                              </div>
                            )
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {editingId === emp._id ? (
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={handleUpdate}
                                className="p-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
                                title="Save"
                              >
                                <FaSave />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="p-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                                title="Cancel"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleEdit(emp)}
                                className="p-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(emp._id)}
                                className="p-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                ) : (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td colSpan="4" className="px-6 py-8 text-center">
                      <div className="text-gray-500 flex flex-col items-center">
                        <FaSearch className="text-4xl mb-2 text-gray-300" />
                        <p className="text-lg">No employers found matching your criteria</p>
                        <button 
                          onClick={() => setSearchTerm('')}
                          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          Clear Search
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AllEmployers;