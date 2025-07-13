import React from 'react';
import dashboardBg from '../../../assets/wp7728152-employee-wallpapers.jpg'; // Adjust path as needed

const Home = () => {
  return (
    <div className="bg-gray-100 p-6">
      {/* Header with Background Image */}
      <header 
        className="relative shadow-md rounded-lg mb-6 h-64 flex items-center justify-center"
        style={{
          backgroundImage: `url(${dashboardBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-white bg-opacity-40 rounded-lg"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center p-6 text-black">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-xl">Welcome back! Here's an overview of your job portal.</p>
        </div>
      </header>
    </div>
  );
};

export default Home;