import React, { useState, useEffect } from 'react';
import API from '../../../../utils/API'; 
import { 
  FaEnvelope, FaPhone, FaSpinner, FaSearch, 
  FaEdit, FaTrash, FaCheck, FaTimes,
  FaFilter, FaChevronDown, FaChevronUp, FaSort,
  FaUser, FaUserShield, FaUserTie
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from 'react-avatar';
import { useNavigate } from 'react-router';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    fname: '',
    lname: '',
    email: '',
    mobile: '',
    role: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: 'name',
    sortOrder: 'asc',
    role: 'all'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await API.get('/api/protected/admin/user/user-all');
      if (response.data.error) {
        setError(response.data.message);
      } else {
        setUsers(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch users');
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const originalUsers = [...users];
      try {
        setUsers(users.filter(user => user._id !== userId));
        await API.delete(`/api/protected/admin/user/delete/${userId}`);
        toast.success('User deleted successfully');
      } catch (err) {
        setUsers(originalUsers);
        toast.error(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleEdit = (user) => {
    setEditingId(user._id);
    setEditForm({
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      mobile: user.mobile || '',
      role: user.role || 'user'
    });
  };

  const handleUpdate = async () => {
    if (!editForm.fname || !editForm.lname) {
      toast.error('First and last names are required');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(editForm.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    const originalUsers = [...users];
    try {
      setUsers(users.map(user => 
        user._id === editingId ? { ...user, ...editForm } : user
      ));

      await API.put(`/api/protected/admin/user/update/${editingId}`, editForm);
      toast.success('User updated successfully');
      setEditingId(null);
    } catch (err) {
      setUsers(originalUsers);
      toast.error(err.response?.data?.message || 'Failed to update user');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const toggleSortOrder = () => {
    setFilters(prev => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredUsers = users
    .filter(user => {
      const matchesSearch = `${user.fname} ${user.lname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.mobile?.includes(searchTerm);
      
      const matchesRole = filters.role === 'all' || user.role === filters.role;
      
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      const order = filters.sortOrder === 'asc' ? 1 : -1;
      
      switch(filters.sortBy) {
        case 'name':
          return order * (`${a.fname} ${a.lname}`.localeCompare(`${b.fname} ${b.lname}`));
        case 'email':
          return order * a.email.localeCompare(b.email);
        case 'role':
          return order * (a.role || '').localeCompare(b.role || '');
        default:
          return 0;
      }
    });

  const getUserIcon = (role) => {
    switch(role) {
      case 'admin':
        return <FaUserShield className="text-purple-500" />;
      case 'employer':
        return <FaUserTie className="text-blue-500" />;
      default:
        return <FaUser className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="text-blue-500 text-4xl"
        >
          <FaSpinner />
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
            onClick={fetchUsers}
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
            <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
            <p className="text-gray-600 mt-1">Manage all platform users</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
            >
              <FaFilter />
              Filters
              {showFilters ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white p-4 rounded-lg shadow mb-6 overflow-hidden border border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <div className="flex">
                    <select
                      className="w-full border rounded-l px-3 py-2 border-r-0 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    >
                      <option value="name">Name</option>
                      <option value="email">Email</option>
                      <option value="role">Role</option>
                    </select>
                    <button
                      onClick={toggleSortOrder}
                      className="px-3 py-2 border rounded-r bg-gray-100 hover:bg-gray-200 transition-colors flex items-center"
                    >
                      {filters.sortOrder === 'asc' ? (
                        <>
                          <span className="mr-1">A-Z</span>
                          <FaSort />
                        </>
                      ) : (
                        <>
                          <span className="mr-1">Z-A</span>
                          <FaSort />
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User Role</label>
                  <select
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={filters.role}
                    onChange={(e) => handleFilterChange('role', e.target.value)}
                  >
                    <option value="all">All Roles</option>
                    <option value="user">Regular User</option>
                    <option value="employer">Employer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 text-blue-500">
                <FaUser className="text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Admins</p>
                <p className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100 text-purple-500">
                <FaUserShield className="text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Employers</p>
                <p className="text-2xl font-bold">{users.filter(u => u.role === 'employer').length}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100 text-green-500">
                <FaUserTie className="text-xl" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  <AnimatePresence>
                    {filteredUsers.map((user) => (
                      <motion.tr 
                        key={user._id} 
                        className="hover:bg-gray-50"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <Avatar
                                name={`${user.fname} ${user.lname}`}
                                size="40"
                                round={true}
                                color={user.role === 'admin' ? '#8B5CF6' : user.role === 'employer' ? '#3B82F6' : '#6B7280'}
                                fgColor="#fff"
                              />
                            </div>
                            <div className="ml-4">
                              {editingId === user._id ? (
                                <div className="flex space-x-2">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-24 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={editForm.fname}
                                    onChange={(e) => setEditForm({...editForm, fname: e.target.value})}
                                  />
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-24 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={editForm.lname}
                                    onChange={(e) => setEditForm({...editForm, lname: e.target.value})}
                                  />
                                </div>
                              ) : (
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {user.fname} {user.lname}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {editingId === user._id ? (
                            <>
                              <div className="mb-2">
                                <input
                                  type="email"
                                  className="border rounded px-2 py-1 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                  value={editForm.email}
                                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                />
                              </div>
                              <input
                                type="text"
                                className="border rounded px-2 py-1 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={editForm.mobile}
                                onChange={(e) => setEditForm({...editForm, mobile: e.target.value})}
                              />
                            </>
                          ) : (
                            <>
                              <div className="text-sm text-gray-900 flex items-center">
                                <FaEnvelope className="mr-2 text-gray-400" />
                                {user.email}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center mt-1">
                                <FaPhone className="mr-2 text-gray-400" />
                                {user.mobile || 'Not provided'}
                              </div>
                            </>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingId === user._id ? (
                            <select
                              className="border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                              value={editForm.role}
                              onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                            >
                              <option value="user">User</option>
                              <option value="employer">Employer</option>
                              <option value="admin">Admin</option>
                            </select>
                          ) : (
                            <div className="flex items-center">
                              {getUserIcon(user.role)}
                              <span className="ml-2 capitalize">{user.role || 'user'}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {editingId === user._id ? (
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={handleUpdate}
                                className="p-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
                                title="Save"
                              >
                                <FaCheck />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="p-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                                title="Cancel"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleEdit(user)}
                                className="p-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(user._id)}
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
                        <p className="text-lg">No users found matching your criteria</p>
                        <button 
                          onClick={() => {
                            setSearchTerm('');
                            setFilters({
                              sortBy: 'name',
                              sortOrder: 'asc',
                              role: 'all'
                            });
                          }}
                          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          Reset Filters
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

export default AllUsers;