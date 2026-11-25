
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [open, setOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const initial = user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-3xl font-bold text-blue-600">
          Re<span className="text-gray-800">Find</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-7 text-gray-700 font-medium">

          <Link to="/" className="hover:text-blue-600 transition">
            Home
          </Link>

          <Link to="/browse" className="hover:text-blue-600 transition">
            Browse Items
          </Link>

          <Link
            to="/report?type=lost"
            className="hover:text-blue-600 transition"
          >
            Report Lost
          </Link>

          <Link
            to="/report?type=found"
            className="hover:text-blue-600 transition"
          >
            Report Found
          </Link>

        </div>

        {/* User Section */}
        <div className="relative">

          {!user ? (

            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:text-blue-800"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </div>

          ) : (

            <button
              onClick={() => setOpen(!open)}
              className="w-11 h-11 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center hover:bg-blue-700 transition"
              aria-label="Open user profile menu"
              aria-expanded={open}
            >
              {initial}
            </button>

          )}

          {/* Profile Dropdown */}
          {user && open && (

            <div className="absolute right-0 top-14 w-72 bg-white shadow-xl border border-gray-100 rounded-xl p-4">

              {/* User Information */}
              <div className="flex items-center gap-3 mb-4">

                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-bold">
                  {initial}
                </div>

                <div className="min-w-0">
                  <h3 className="font-bold text-gray-800 truncate">
                    {user.name}
                  </h3>

                  <p className="text-sm text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>

              </div>

              <hr className="mb-3" />

              {/* Contact */}
              <div className="mb-4">
                <p className="text-xs text-gray-400 uppercase font-semibold">
                  Contact Number
                </p>

                <p className="text-sm text-gray-700 mt-1">
                  {user.contact}
                </p>
              </div>

              {/* Profile Button */}
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                My Profile
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full mt-2 border border-red-200 text-red-600 py-2 rounded-lg hover:bg-red-50 transition"
              >
                Logout
              </button>

            </div>

          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;
