import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, CalendarDays, DollarSign, X, Upload, Check, Search } from 'lucide-react';
import API from '../../../../utils/API';
import bgImage from '../../../assets/wp7728152-employee-wallpapers.jpg';

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applying, setApplying] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    coverLetter: '',
  });
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState({
    title: '',
    location: ''
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await API.get('/api/protected/users/job/jobs');
        const jobsData = response.data?.data || [];
        setJobs(jobsData);
        setFilteredJobs(jobsData);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
        showNotification('error', 'Failed to load jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    // Filter jobs based on search terms
    const filtered = jobs.filter(job => {
      const matchesTitle = job.title.toLowerCase().includes(searchTerm.title.toLowerCase());
      const matchesLocation = job.location.toLowerCase().includes(searchTerm.location.toLowerCase());
      return matchesTitle && matchesLocation;
    });
    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchTerm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      if (e.target.files[0].size > 5 * 1024 * 1024) {
        showNotification('error', 'File size exceeds 5MB limit');
        return;
      }
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fullName || !formData.email || !formData.coverLetter) {
      showNotification('error', 'Please fill all required fields');
      return;
    }

    if (!resumeFile) {
      showNotification('error', 'Please upload your resume');
      return;
    }

    if (formData.coverLetter.length < 100) {
      showNotification('error', 'Cover letter must be at least 100 characters');
      return;
    }

    setApplying(true);

    try {
      // Step 1: Upload resume
      const resumeFormData = new FormData();
      resumeFormData.append('resume', resumeFile);
      
      const uploadResponse = await API.post(
        '/api/protected/users/job/upload-resume', 
        resumeFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Step 2: Submit application
      const applicationPayload = {
        jobId: selectedJob._id,
        fullName: formData.fullName,
        email: formData.email,
        coverLetter: formData.coverLetter,
        resume: uploadResponse.data.data.resumePath
      };

      const applicationResponse = await API.post(
        '/api/protected/users/job/apply',
        applicationPayload
      );

      showNotification('success', 'Application submitted successfully!');
      setIsModalOpen(false);
      setFormData({ fullName: '', email: '', coverLetter: '' });
      setResumeFile(null);
    } catch (error) {
      console.error('Application error:', error);
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Failed to submit application';
      showNotification('error', errorMessage);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center p-4 md:p-10 lg:p-16" 
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${bgImage})`,
        backgroundAttachment: 'fixed'
      }}>
      
      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 right-6 z-50 p-4 rounded-lg shadow-xl ${
              notification.type === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <Check className="w-5 h-5" />
              ) : (
                <X className="w-5 h-5" />
              )}
              <span>{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            Career Opportunities
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover your next career move with our hand-picked selection of job openings
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 bg-white rounded-xl shadow-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="title"
                value={searchTerm.title}
                onChange={handleSearchChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by job title..."
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="location"
                value={searchTerm.location}
                onChange={handleSearchChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by location..."
              />
            </div>
          </div>
          {searchTerm.title || searchTerm.location ? (
            <div className="mt-3 text-sm text-gray-600">
              Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} matching your search
            </div>
          ) : null}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading available positions...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Briefcase className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              {searchTerm.title || searchTerm.location 
                ? "No jobs match your search criteria" 
                : "No current openings"}
            </h3>
            <p className="text-gray-500">
              {searchTerm.title || searchTerm.location 
                ? "Try adjusting your search filters" 
                : "Check back later for new opportunities"}
            </p>
            {(searchTerm.title || searchTerm.location) && (
              <button
                onClick={() => setSearchTerm({ title: '', location: '' })}
                className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <motion.div
                key={job._id}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-md hover:shadow-lg transition-all"
                whileHover={{ y: -8 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full">
                      {job.type || 'Full-time'}
                    </span>
                  </div>
                  
                  <div className="space-y-3 text-gray-600 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-blue-600" />
                      </div>
                      <span>₹{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-green-600" />
                      </div>
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                        <CalendarDays className="w-4 h-4 text-purple-600" />
                      </div>
                      <span>Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setSelectedJob(job);
                      setIsModalOpen(true);
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Briefcase className="w-4 h-4" />
                    Apply Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Application Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <Briefcase className="w-6 h-6 text-blue-500" />
                    Apply for {selectedJob?.title}
                  </h3>
                  <p className="text-gray-500 mt-1">{selectedJob?.location}</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Letter *
                    <span className="text-xs text-gray-500 ml-1">(Min. 100 characters)</span>
                  </label>
                  <textarea
                    id="coverLetter"
                    name="coverLetter"
                    rows={6}
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    required
                    minLength={100}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Tell us why you're the perfect candidate for this position..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.coverLetter.length}/100 characters
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume *
                    <span className="text-xs text-gray-500 ml-1">(Max. 5MB)</span>
                  </label>
                  <label className="block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="w-10 h-10 text-gray-400 mb-3" />
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF, DOC, or DOCX (Max. 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      id="resume"
                      name="resume"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                  {resumeFile ? (
                    <div className="mt-3 flex items-center gap-2 bg-green-50 text-green-700 rounded-lg p-3">
                      <Check className="w-5 h-5" />
                      <span className="text-sm">{resumeFile.name}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                      <button
                        type="button"
                        onClick={() => setResumeFile(null)}
                        className="ml-auto text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-red-500 text-xs mt-1">Please select a resume file</p>
                  )}
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={applying}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {applying ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    By applying, you agree to our Terms and Privacy Policy.
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllJobs;