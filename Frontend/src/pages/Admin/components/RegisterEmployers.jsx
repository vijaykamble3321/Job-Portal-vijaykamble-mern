import React, { useEffect, useState } from "react";
import API from "../../../../utils/API";
import { ClipLoader } from "react-spinners";
import { FaUserTie, FaCheckCircle, FaTimesCircle, FaSearch, FaFilter } from "react-icons/fa";
import { motion } from "framer-motion";

const RegisterEmployers = () => {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchEmployers();
  }, [statusFilter]);

  const fetchEmployers = async () => {
    setLoading(true);
    try {
      const endpoint =
        statusFilter === "approved"
          ? "/api/protected/admin/job/approved-employers"
          : "/api/protected/admin/job/pending-employers";
      const response = await API.get(endpoint);
      if (!response.data.error) {
        setEmployers(response.data.data);
        setError(null);
      } else {
        setError("Failed to fetch employers: " + response.data.message);
      }
    } catch (error) {
      setError("Error fetching employers: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/api/protected/admin/job/approve-employer?id=${id}`, { 
        status: status.toLowerCase() 
      });
      setMessage({ 
        type: "success", 
        text: `Employer ${status} successfully!` 
      });
      fetchEmployers();
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: "Error updating status. Please try again!" 
      });
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const filteredEmployers = employers.filter(employer =>
    employer.employerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employer.legalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <FaUserTie className="text-indigo-600 text-3xl mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">
              Employer <span className="text-indigo-600">Registrations</span>
            </h2>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search employers..."
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Status Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mb-6 p-4 rounded-lg shadow-md ${
              message.type === "success" 
                ? "bg-green-100 text-green-800 border-l-4 border-green-500" 
                : "bg-red-100 text-red-800 border-l-4 border-red-500"
            }`}
          >
            {message.text}
          </motion.div>
        )}

        {/* Status Filter Tabs */}
        <div className="flex mb-6 bg-white rounded-lg shadow-sm overflow-hidden w-fit">
          <button
            className={`px-6 py-3 font-medium flex items-center ${
              statusFilter === "pending"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setStatusFilter("pending")}
          >
            <FaFilter className="mr-2" />
            Pending ({employers.filter(e => e.status === "pending").length})
          </button>
          <button
            className={`px-6 py-3 font-medium flex items-center ${
              statusFilter === "approved"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setStatusFilter("approved")}
          >
            <FaCheckCircle className="mr-2" />
            Approved ({employers.filter(e => e.status === "approved").length})
          </button>
        </div>

        {/* Employer Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Legal Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  {statusFilter === "pending" && (
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={statusFilter === "pending" ? 5 : 4} className="px-6 py-8 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <ClipLoader color="#4F46E5" size={24} />
                        <span className="text-gray-600">Loading employer data...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={statusFilter === "pending" ? 5 : 4} className="px-6 py-8 text-center text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : filteredEmployers.length === 0 ? (
                  <tr>
                    <td colSpan={statusFilter === "pending" ? 5 : 4} className="px-6 py-8 text-center">
                      <div className="text-gray-500">
                        {searchTerm ? "No matching employers found" : "No employers available"}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEmployers.map((employer) => (
                    <motion.tr
                      key={employer._id}
                      className="hover:bg-gray-50"
                      whileHover={{ scale: 1.005 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <FaUserTie className="text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {employer.employerName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {employer.address}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employer.legalName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {employer.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                          employer.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {employer.status === "approved" ? (
                            <FaCheckCircle className="mr-1" />
                          ) : (
                            <FaTimesCircle className="mr-1" />
                          )}
                          {employer.status.charAt(0).toUpperCase() + employer.status.slice(1)}
                        </span>
                      </td>
                      {statusFilter === "pending" && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <select
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
                            value={employer.status}
                            onChange={(e) => updateStatus(employer._id, e.target.value)}
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approve</option>
                          </select>
                        </td>
                      )}
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterEmployers;