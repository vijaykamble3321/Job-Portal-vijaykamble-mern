import React, { useState } from 'react';
import { FiMenu, FiBell, FiSearch, FiUser, FiChevronDown, FiMessageSquare } from 'react-icons/fi';
import { FaRegCommentDots } from 'react-icons/fa';
import { Popover, Badge, Avatar, Dropdown, Space } from 'antd';
import { motion } from 'framer-motion';

const UserHeader = ({ toggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState([
    { id: 1, text: 'Your application was viewed by TechCorp', time: '2h ago', read: false },
    { id: 2, text: 'New job matches your profile: Senior UX Designer', time: '5h ago', read: true },
    { id: 3, text: 'Interview scheduled for tomorrow at 2:00 PM', time: '1d ago', read: true },
  ]);

  const userMenuItems = [
    {
      key: '1',
      label: (
        <div className="flex items-center px-3 py-2 hover:text-blue-600">
          <FiUser className="mr-3" />
          <span>My Profile</span>
        </div>
      )
    },
    {
      key: '2',
      label: (
        <div className="flex items-center px-3 py-2 hover:text-blue-600">
          <FaRegCommentDots className="mr-3" />
          <span>Saved Jobs</span>
        </div>
      )
    },
    {
      key: '3',
      label: (
        <div className="flex items-center px-3 py-2 hover:text-blue-600">
          <FiMessageSquare className="mr-3" />
          <span>Application History</span>
        </div>
      )
    },
    { type: 'divider' },
    {
      key: '4',
      label: (
        <div className="flex items-center px-3 py-2 text-red-500 hover:text-red-600">
          <span>Logout</span>
        </div>
      ),
      danger: true
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Left Section - Sidebar Toggle and Search */}
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={toggleSidebar}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:outline-none transition-colors"
              aria-label="Toggle sidebar"
            >
              <FiMenu className="h-5 w-5" />
            </motion.button>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative hidden md:block"
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FiSearch className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Search jobs, companies..."
                className="block w-64 pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 text-sm transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </motion.div>
          </div>

          {/* Right Section - User Controls */}
          <div className="flex items-center space-x-5">
            {/* Messages */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button className="p-2 relative text-gray-500 hover:text-gray-700 transition-colors">
                <FaRegCommentDots className="h-5 w-5" />
                <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-blue-500 border-2 border-white"></span>
              </button>
            </motion.div>

            {/* Notifications */}
            <Popover
              placement="bottomRight"
              trigger="click"
              overlayClassName="notification-popover"
              content={
                <div className="w-80">
                  <div className="px-4 py-3 font-medium text-gray-800 border-b border-gray-100 flex justify-between items-center">
                    <span>Notifications</span>
                    <button className="text-xs text-blue-500 hover:text-blue-600">Mark all as read</button>
                  </div>
                  <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
                      >
                        <p className="text-sm font-medium text-gray-800">{notification.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        {!notification.read && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r"></div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 text-center text-sm text-blue-500 border-t border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                    View all notifications
                  </div>
                </div>
              }
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Badge
                  count={unreadCount}
                  className="cursor-pointer hover:text-gray-700 transition-colors"
                  offset={[-5, 5]}
                >
                  <button className="p-2 text-gray-500">
                    <FiBell className="h-5 w-5" />
                  </button>
                </Badge>
              </motion.div>
            </Popover>

            {/* User Profile Dropdown */}
            <Dropdown
              menu={{ items: userMenuItems }}
              trigger={['click']}
              placement="bottomRight"
              overlayClassName="user-dropdown"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer"
              >
                <Space className="flex items-center hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors">
                  <Avatar
                    size={32}
                    className="bg-gradient-to-r from-blue-500 to-blue-300 text-white font-medium"
                    icon={<FiUser />}
                  />
                  <span className="hidden md:inline-block font-medium text-gray-700 text-sm ml-2">
                    John Doe
                  </span>
                  <FiChevronDown className="text-gray-400 text-xs ml-1" />
                </Space>
              </motion.div>
            </Dropdown>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .notification-popover .ant-popover-inner {
          padding: 0;
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }
        
        .user-dropdown .ant-dropdown-menu {
          padding: 8px;
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
        }
        
        .user-dropdown .ant-dropdown-menu-item {
          border-radius: 8px;
          margin: 2px 0;
        }
      `}</style>
    </header>
  );
};

export default UserHeader;
