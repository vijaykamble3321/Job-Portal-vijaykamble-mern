import React, { useState, useEffect } from "react";
import API from "../../../../utils/API";
import { 
  FaBuilding, 
  FaFileSignature, 
  FaIndustry, 
  FaTags, 
  FaMapMarkerAlt, 
  FaUserTie,
  FaCheckCircle,
  FaInfoCircle
} from "react-icons/fa";
import { motion } from "framer-motion";

const RegisterCompany = () => {
  const [formData, setFormData] = useState({
    employerName: "",
    legalName: "",
    sector: "",
    category: "",
    contactPerson: "",
    address: ""
  });

  const [employerStatus, setEmployerStatus] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await API.post(
        "/api/protected/employe/job/register",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.data) {
        setMessage({
          text: "Company registered successfully!",
          type: "success"
        });
        setFormData({
          employerName: "",
          legalName: "",
          sector: "",
          category: "",
          contactPerson: "",
          address: ""
        });
      } else {
        setMessage({
          text: response.data.message || "Registration failed",
          type: "error"
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage({
        text: error.response?.data?.message || "Failed to register company",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    try {
      setStatusLoading(true);
      const response = await API.get(
        "/api/protected/employe/job/register-check",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setEmployerStatus(response.data.data);
        setMessage({
          text: "Company status retrieved successfully!",
          type: "success"
        });
      } else {
        setMessage({
          text: response.data.message || "Failed to fetch status",
          type: "error"
        });
      }
    } catch (error) {
      console.error("Status check error:", error);
      setMessage({
        text: "Failed to check company status",
        type: "error"
      });
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Company Registration
          </h1>
          <p className="mt-3 text-xl text-gray-600">
            Register your company to start posting jobs
          </p>
        </motion.div>

        {/* Message Alert */}
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-8 p-4 rounded-lg border ${
              message.type === "success"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <div className="flex items-center">
              {message.type === "success" ? (
                <FaCheckCircle className="mr-2" />
              ) : (
                <FaInfoCircle className="mr-2" />
              )}
              <span>{message.text}</span>
            </div>
          </motion.div>
        )}

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white shadow-xl rounded-2xl overflow-hidden"
        >
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Company Information
            </h2>
            
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Employer Name */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaBuilding className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="employerName"
                      value={formData.employerName}
                      onChange={handleInputChange}
                      className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your company name"
                      required
                    />
                  </div>
                </div>

                {/* Legal Name */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Legal Name*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaFileSignature className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="legalName"
                      value={formData.legalName}
                      onChange={handleInputChange}
                      className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Legal business name"
                      required
                    />
                  </div>
                </div>

                {/* Sector */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry Sector*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaIndustry className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="sector"
                      value={formData.sector}
                      onChange={handleInputChange}
                      className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. Technology, Healthcare"
                      required
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Category*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaTags className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. Software Development"
                      required
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="relative md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Address*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Full business address"
                      required
                    />
                  </div>
                </div>

                {/* Contact Person */}
                <div className="relative md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUserTie className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Name of primary contact"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Register Company"
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Check Status Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white shadow-xl rounded-2xl overflow-hidden"
        >
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Check Registration Status
            </h2>
            <p className="text-gray-600 mb-6">
              Verify your company's registration status
            </p>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckStatus}
              disabled={statusLoading}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              {statusLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Checking...
                </span>
              ) : (
                "Check Status"
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Status Display */}
        {employerStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white shadow-xl rounded-2xl overflow-hidden"
          >
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Registration Details
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <FaBuilding className="text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {employerStatus.employerName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {employerStatus.legalName}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Status
                    </h4>
                    <p className={`text-lg font-semibold ${
                      employerStatus.status === "Active" 
                        ? "text-green-600" 
                        : "text-yellow-600"
                    }`}>
                      {employerStatus.status}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Industry
                    </h4>
                    <p className="text-lg font-semibold text-gray-900">
                      {employerStatus.sector}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Category
                    </h4>
                    <p className="text-lg font-semibold text-gray-900">
                      {employerStatus.category}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Contact Person
                    </h4>
                    <p className="text-lg font-semibold text-gray-900">
                      {employerStatus.contactPerson}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Business Address
                  </h4>
                  <p className="text-gray-900">
                    {employerStatus.address}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RegisterCompany;