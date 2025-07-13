import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'; // Lucide icons

const Notification = ({ message = "Welcome to our Healthcare System! 🚑✨", type = "info", autoClose = true, duration = 4000 }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => setShow(false), duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration]);

  if (!show) return null;

  const typeStyles = {
    success: "bg-green-100 border-green-300 text-green-800",
    error: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    info: "bg-blue-100 border-blue-300 text-blue-800",
  };

  const typeIcons = {
    success: <CheckCircle className="h-6 w-6 mr-2" />,
    error: <XCircle className="h-6 w-6 mr-2" />,
    warning: <AlertTriangle className="h-6 w-6 mr-2" />,
    info: <Info className="h-6 w-6 mr-2" />,
  };

  return (
    <div className={`border-l-4 p-4 rounded-md mb-4 shadow-lg flex items-center animate-fadeIn ${typeStyles[type]}`}>
      {typeIcons[type]}
      <span className="flex-1 text-base font-medium">{message}</span>
      <button 
        onClick={() => setShow(false)}
        className="text-2xl font-bold ml-4 focus:outline-none hover:text-gray-500 transition"
      >
        &times;
      </button>
    </div>
  );
};

export default Notification;
