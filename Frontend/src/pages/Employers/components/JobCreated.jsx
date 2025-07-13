import React, { useState, useEffect } from "react";
import API from "../../../../utils/API";
import { FaEdit, FaTrash, FaPlus, FaBriefcase, FaMoneyBillWave, FaMapMarkerAlt, FaTags, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";

const JobCreated = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    salary: "",
    category: "",
    location: "",
    experience: "",
  });

  const [jobs, setJobs] = useState([]);
  const [jobId, setJobId] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/protected/employe/job/jobsall", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      if (res.data?.data) {
        setJobs(res.data.data);
        setMessage({ text: "", type: "" });
      } else {
        setMessage({ text: "No jobs found", type: "info" });
        setJobs([]);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setMessage({ 
        text: error.response?.data?.message || "Error fetching jobs", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateJob = async () => {
    try {
      const res = await API.post("/api/protected/employe/job/createjob", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      setMessage({ 
        text: "Job created successfully!", 
        type: "success" 
      });
      resetForm();
      fetchJobs();
    } catch (error) {
      console.error("Create Error:", error);
      setMessage({ 
        text: error.response?.data?.message || "Error creating job", 
        type: "error" 
      });
    }
  };

  const handleEditJob = (job) => {
    setFormData({
      title: job.title,
      description: job.description,
      salary: job.salary,
      category: job.category,
      location: job.location,
      experience: job.experience,
    });
    setJobId(job._id);
    setShowForm(true);
  };

  const handleUpdateJob = async () => {
    try {
      const res = await API.put(
        `/api/protected/employe/job/createjob-update?id=${jobId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      setMessage({ 
        text: "Job updated successfully!", 
        type: "success" 
      });
      resetForm();
      fetchJobs();
    } catch (error) {
      console.error("Update Error:", error);
      setMessage({ 
        text: error.response?.data?.message || "Error updating job", 
        type: "error" 
      });
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await API.delete(`/api/protected/employe/job/createjob-delete?id=${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        
        setMessage({ 
          text: "Job deleted successfully!", 
          type: "success" 
        });
        fetchJobs();
      } catch (error) {
        console.error("Delete Error:", error);
        setMessage({ 
          text: error.response?.data?.message || "Error deleting job", 
          type: "error" 
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      salary: "",
      category: "",
      location: "",
      experience: "",
    });
    setJobId("");
    setShowForm(false);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Job Management</h1>
            <p className="text-gray-600 mt-1">
              {jobs.length} {jobs.length === 1 ? "job posted" : "jobs posted"}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all mt-4 md:mt-0"
          >
            <FaPlus className="mr-2" /> Create New Job
          </motion.button>
        </div>

        {/* Message Alert */}
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 mb-6 rounded-lg ${
              message.type === "success" 
                ? "bg-green-100 text-green-800 border border-green-200"
                : message.type === "error"
                ? "bg-red-100 text-red-800 border border-red-200"
                : "bg-blue-100 text-blue-800 border border-blue-200"
            }`}
          >
            {message.text}
          </motion.div>
        )}

        {/* Job Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {jobId ? "Edit Job" : "Create New Job"}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaBriefcase className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. Senior Web Developer"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMoneyBillWave className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. $80,000 - $100,000"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. New York, NY"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaTags className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. Software Development"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience Level*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaClock className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. 5+ years"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description*
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="6"
                  placeholder="Describe the job responsibilities and requirements..."
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={jobId ? handleUpdateJob : handleCreateJob}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {jobId ? "Update Job" : "Create Job"}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Jobs List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Loading jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FaBriefcase className="text-blue-500 text-3xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No jobs posted yet
              </h3>
              <p className="text-gray-500 mb-6">
                Get started by creating your first job posting
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="flex items-center mx-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <FaPlus className="mr-2" /> Create Your First Job
              </motion.button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {jobs.map((job) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div className="flex-1">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                          <FaBriefcase className="text-blue-500 text-xl" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {job.title}
                          </h3>
                          <div className="mt-1 flex flex-wrap gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <FaMapMarkerAlt className="mr-1" />
                              {job.location}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <FaMoneyBillWave className="mr-1" />
                              {job.salary}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              <FaTags className="mr-1" />
                              {job.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="mt-3 text-gray-600 line-clamp-2">
                        {job.description}
                      </p>
                      <div className="mt-3 text-sm text-gray-500">
                        <span>Posted: {formatDate(job.createdAt)}</span>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEditJob(job)}
                        className="p-2 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <FaEdit size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteJob(job._id)}
                        className="p-2 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <FaTrash size={18} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCreated;