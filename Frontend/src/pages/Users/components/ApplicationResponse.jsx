import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaBriefcase, FaClock, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import API from '../../../../utils/API';

const ApplicationResponse = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const res = await API.get('/api/protected/users/job/jobs-response');
      if (res.data && res.data.data) {
        setApplications(res.data.data);
      } else {
        toast.info('No applications found.');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return <FaCheckCircle className="text-green-500 mr-1" />;
      case 'rejected':
        return <FaTimesCircle className="text-red-500 mr-1" />;
      default:
        return <FaHourglassHalf className="text-yellow-500 mr-1" />;
    }
  };

  const statusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-gray-800 mb-8 flex items-center"
        >
          <FaBriefcase className="mr-3 text-blue-600" />
          My Job Applications
        </motion.h2>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-5 h-64">
                <Skeleton height={30} width="70%" />
                <Skeleton height={20} width="50%" className="mt-3" />
                <Skeleton height={20} width="60%" className="mt-3" />
                <Skeleton height={20} width="40%" className="mt-3" />
                <Skeleton count={3} className="mt-3" />
              </div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-sm p-8 text-center"
          >
            <img 
              src="/images/empty-applications.svg" 
              alt="No applications" 
              className="mx-auto h-48 mb-6"
            />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Applications Found</h3>
            <p className="text-gray-500">You haven't applied to any jobs yet.</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {applications.map((app) => (
                <motion.div
                  key={app._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-800 truncate">
                        {app.jobId?.title || 'Job Title'}
                      </h3>
                      <span className={`text-xs px-3 py-1 rounded-full ${statusColor(app.status)} font-medium flex items-center`}>
                        {getStatusIcon(app.status)}
                        {app.status}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600 mb-3">
                      <FaMapMarkerAlt className="mr-2 text-blue-500" />
                      <span>{app.jobId?.location || 'Location not specified'}</span>
                    </div>

                    <div className="flex items-center text-gray-600 mb-4">
                      <FaClock className="mr-2 text-blue-500" />
                      <span>Applied on: {new Date(app.appliedAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}</span>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Cover Letter</h4>
                      <p className="text-gray-700 text-sm line-clamp-3">
                        {app.coverLetter || 'No cover letter provided'}
                      </p>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                        View Job Details →
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default ApplicationResponse;