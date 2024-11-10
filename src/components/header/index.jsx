import React from "react";
import { Link } from "react-router-dom";

const Header = ({ username, onLogout }) => {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="flex space-x-6">
        <Link to="/dashboard" className="hover:text-gray-400">
          Home
        </Link>
        <Link to="/create-employee" className="hover:text-gray-400">
          Create Employee
        </Link>
        <Link to="/employee-list" className="hover:text-gray-400">
          Employee List
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {username && (
          <>
            <span className="text-sm"> {username}</span>
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
