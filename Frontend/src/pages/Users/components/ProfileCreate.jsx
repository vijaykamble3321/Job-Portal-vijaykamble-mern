import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../../../utils/API';
import { 
  FaGraduationCap, 
  FaTools, 
  FaBriefcase, 
  FaPhone, 
  FaUser, 
  FaRegEdit,
  FaCamera,
  FaLinkedin,
  FaGithub,
  FaGlobe
} from 'react-icons/fa';
import { 
  AiOutlineCheck,
  AiOutlineCloudUpload
} from 'react-icons/ai';
import { 
  IoMdTime,
  IoIosClose
} from 'react-icons/io';
import { 
  BsFillLightningFill, 
  BsBarChart,
  BsPersonBadge
} from 'react-icons/bs';

const ProfileCreate = () => {
  const [profile, setProfile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    skills: '',
    education: '',
    experience: '',
    phone: '',
    linkedin: '',
    github: '',
    portfolio: '',
    bio: ''
  });

  const fetchProfile = async () => {
    try {
      const res = await API.get('/api/protected/users/job/profile');
      const profileData = res.data?.data;
      setProfile(profileData);
      setFormData({
        skills: profileData.skills?.join(', ') || '',
        education: profileData.education || '',
        experience: profileData.experience || '',
        phone: profileData.phone || '',
        linkedin: profileData.linkedin || '',
        github: profileData.github || '',
        portfolio: profileData.portfolio || '',
        bio: profileData.bio || ''
      });
      if (profileData.profileimage) {
        setPreviewImage(profileData.profileimage);
      }
    } catch (error) {
      toast.error('Failed to fetch profile.');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
      toast.error('Please select an image file (JPEG, PNG)');
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      return toast.warn('Please select an image.');
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setUploading(true);
      await API.post('/api/protected/users/job/upload-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success('Profile image updated successfully!');
      setSelectedFile(null);
      fetchProfile();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await API.put('/api/protected/users/job/profile', {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim())
      });
      toast.success('Profile updated successfully!');
      setEditMode(false);
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    }
  };

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  const defaultImage = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80';
  const displayImage = previewImage || profile.profileimage || defaultImage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto my-8"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white text-center py-4 font-bold text-xl rounded-t-xl shadow-lg">
        Professional Profile
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-b-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-8">
          {/* Profile Column */}
          <div className="lg:col-span-1 flex flex-col items-center">
            <div className="relative group mb-4">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-xl relative">
                <img
                  src={displayImage}
                  alt="Profile"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <label className="absolute inset-0 bg-black bg-opacity-30 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 cursor-pointer">
                  <FaCamera className="text-white text-2xl" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              {selectedFile && (
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewImage(profile.profileimage || defaultImage);
                  }}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors"
                >
                  <IoIosClose className="text-lg" />
                </button>
              )}
            </div>

            <button
              onClick={handleUpload}
              disabled={uploading || !selectedFile}
              className={`mt-2 px-4 py-2 rounded-full flex items-center gap-2 ${
                uploading || !selectedFile
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-pink-600 hover:bg-pink-700 text-white'
              } transition-colors duration-200 shadow-md`}
            >
              {uploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <AiOutlineCloudUpload />
                  {selectedFile ? 'Update Photo' : 'Select Photo First'}
                </>
              )}
            </button>

            <div className="mt-6 text-center w-full">
              <h2 className="text-2xl font-bold text-gray-800">{profile.fullname}</h2>
              <p className="text-pink-600 mt-1">Professional Developer</p>
              
              {/* Social Links */}
              <div className="flex justify-center mt-4 space-x-3">
                {profile.linkedin && (
                  <a 
                    href={profile.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-100 text-blue-600 p-2 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    <FaLinkedin />
                  </a>
                )}
                {profile.github && (
                  <a 
                    href={profile.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gray-100 text-gray-800 p-2 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <FaGithub />
                  </a>
                )}
                {profile.portfolio && (
                  <a 
                    href={profile.portfolio} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-purple-100 text-purple-600 p-2 rounded-full hover:bg-purple-200 transition-colors"
                  >
                    <FaGlobe />
                  </a>
                )}
              </div>

              {/* Edit Toggle */}
              <button 
                onClick={() => setEditMode(!editMode)}
                className="mt-4 px-4 py-2 rounded-lg flex items-center gap-2 bg-pink-100 text-pink-600 hover:bg-pink-200 transition-colors mx-auto"
              >
                <FaRegEdit />
                {editMode ? 'Cancel Editing' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Details Column */}
          <div className="lg:col-span-3">
            {/* Bio Section */}
            {editMode ? (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                  placeholder="Tell us about yourself..."
                />
              </div>
            ) : (
              profile.bio && (
                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">About Me</h3>
                  <p className="text-gray-700">{profile.bio}</p>
                </div>
              )
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skills Card */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-pink-100 p-2 rounded-full mr-3">
                    <FaTools className="text-pink-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
                </div>
                {editMode ? (
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="JavaScript, React, Node.js"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills?.map((skill, index) => (
                      <span key={index} className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Experience Card */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 p-2 rounded-full mr-3">
                    <IoMdTime className="text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Experience</h3>
                </div>
                {editMode ? (
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="5 years"
                  />
                ) : (
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-gray-800 mr-2">{profile.experience}</span>
                    <span className="text-gray-600">years of professional experience</span>
                  </div>
                )}
              </motion.div>

              {/* Education Card */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <FaGraduationCap className="text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Education</h3>
                </div>
                {editMode ? (
                  <input
                    type="text"
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Bachelor's in Computer Science"
                  />
                ) : (
                  <p className="text-gray-700">{profile.education}</p>
                )}
              </motion.div>

              {/* Contact Card */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <FaPhone className="text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Contact</h3>
                </div>
                {editMode ? (
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="+1 234 567 8900"
                  />
                ) : (
                  <p className="text-gray-700">{profile.phone}</p>
                )}
              </motion.div>
            </div>

            {/* Social Links Section */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* LinkedIn */}
              <motion.div 
                whileHover={{ y: -3 }}
                className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <FaLinkedin className="text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">LinkedIn</h3>
                </div>
                {editMode ? (
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                ) : profile.linkedin ? (
                  <a 
                    href={profile.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Profile
                  </a>
                ) : (
                  <p className="text-gray-500">Not provided</p>
                )}
              </motion.div>

              {/* GitHub */}
              <motion.div 
                whileHover={{ y: -3 }}
                className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-gray-100 p-2 rounded-full mr-3">
                    <FaGithub className="text-gray-800" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">GitHub</h3>
                </div>
                {editMode ? (
                  <input
                    type="url"
                    name="github"
                    value={formData.github}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="https://github.com/username"
                  />
                ) : profile.github ? (
                  <a 
                    href={profile.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-800 hover:underline"
                  >
                    View Profile
                  </a>
                ) : (
                  <p className="text-gray-500">Not provided</p>
                )}
              </motion.div>

              {/* Portfolio */}
              <motion.div 
                whileHover={{ y: -3 }}
                className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 p-2 rounded-full mr-3">
                    <FaGlobe className="text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Portfolio</h3>
                </div>
                {editMode ? (
                  <input
                    type="url"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="https://yourportfolio.com"
                  />
                ) : profile.portfolio ? (
                  <a 
                    href={profile.portfolio} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:underline"
                  >
                    Visit Site
                  </a>
                ) : (
                  <p className="text-gray-500">Not provided</p>
                )}
              </motion.div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center mb-3">
                  <BsFillLightningFill className="text-yellow-500 mr-2" />
                  <h4 className="font-medium text-gray-800">Strengths</h4>
                </div>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-pink-500 mr-2">•</span>
                    Problem-solving
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-500 mr-2">•</span>
                    Team collaboration
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-500 mr-2">•</span>
                    Continuous learning
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center mb-3">
                  <BsBarChart className="text-blue-500 mr-2" />
                  <h4 className="font-medium text-gray-800">Goals</h4>
                </div>
                <p className="text-gray-600">
                  To leverage my skills in a challenging environment that promotes professional growth while contributing to organizational success.
                </p>
              </div>
            </div>

            {/* Edit/Save Buttons */}
            {editMode && (
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setEditMode(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors shadow-md flex items-center gap-2"
                >
                  <AiOutlineCheck />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCreate;  