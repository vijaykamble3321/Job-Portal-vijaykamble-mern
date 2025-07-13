import React, { useEffect, useState } from 'react';
import API from '../../../../utils/API';
import { 
  FaUser, 
  FaBriefcase, 
  FaChartLine,
  FaUserPlus,
  FaBuilding,
  FaSpinner,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';

const Analyst = () => {
  const [stats, setStats] = useState({
    userCount: 0,
    employerCount: 0,
    newUsers: 0,
    activeUsers: 0,
    userGrowth: 0,
    employerGrowth: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await API.get('/api/protected/admin/user/user-employer-count');
        if (response.data.error) {
          setError(response.data.message);
        } else {
          setStats(response.data.data);
        }
      } catch (err) {
        setError('Failed to fetch analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <FaSpinner className="animate-spin text-blue-500 text-4xl mb-4" />
        <span className="text-xl text-gray-700">Loading Dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Key metrics and performance indicators</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-3xl font-bold text-gray-800">{stats.userCount}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <FaUser className="text-blue-500 text-2xl" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {stats.userGrowth >= 0 ? (
                <span className="text-green-600 flex items-center">
                  <FaArrowUp className="mr-1" />
                  {stats.userGrowth}% from last week
                </span>
              ) : (
                <span className="text-red-600 flex items-center">
                  <FaArrowDown className="mr-1" />
                  {Math.abs(stats.userGrowth)}% from last week
                </span>
              )}
            </div>
          </div>

          {/* Total Employers */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Employers</p>
                <p className="text-3xl font-bold text-gray-800">{stats.employerCount}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <FaBuilding className="text-green-500 text-2xl" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {stats.employerGrowth >= 0 ? (
                <span className="text-green-600 flex items-center">
                  <FaArrowUp className="mr-1" />
                  {stats.employerGrowth}% from last week
                </span>
              ) : (
                <span className="text-red-600 flex items-center">
                  <FaArrowDown className="mr-1" />
                  {Math.abs(stats.employerGrowth)}% from last week
                </span>
              )}
            </div>
          </div>

          {/* New Users */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">New Users</p>
                <p className="text-3xl font-bold text-gray-800">{stats.newUsers}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <FaUserPlus className="text-purple-500 text-2xl" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              This week
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Users</p>
                <p className="text-3xl font-bold text-gray-800">{stats.activeUsers}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-100">
                <FaChartLine className="text-yellow-500 text-2xl" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Currently online
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">User Growth Trend</h2>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <FaChartLine className="text-4xl mx-auto mb-2 text-blue-400" />
              <p>Growth chart visualization</p>
              <p className="text-sm">(Chart integration would go here)</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start pb-4 border-b border-gray-100">
              <div className="p-2 rounded-full bg-blue-100 mr-4">
                <FaUser className="text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">New user registration spike detected</p>
                <p className="text-xs text-gray-500 mt-1">Today, 10:45 AM</p>
              </div>
            </div>
            <div className="flex items-start pb-4 border-b border-gray-100">
              <div className="p-2 rounded-full bg-green-100 mr-4">
                <FaBriefcase className="text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">5 new employers joined this week</p>
                <p className="text-xs text-gray-500 mt-1">Yesterday, 3:22 PM</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-2 rounded-full bg-purple-100 mr-4">
                <FaChartLine className="text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Increased user engagement detected</p>
                <p className="text-xs text-gray-500 mt-1">Monday, 9:15 AM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyst;