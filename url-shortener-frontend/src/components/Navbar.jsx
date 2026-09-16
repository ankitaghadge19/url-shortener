import { useEffect, useRef, useState } from "react";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const profileRef = useRef(null);

  const navLinkStyle = ({ isActive }) =>
    isActive
      ? "text-white border-b-2 border-white"
      : "text-gray-200 hover:text-white transition-colors duration-200";

  const handleLogout = async () => {
    await logout();

    setShowProfile(false);
    setIsOpen(false);

    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfile(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, []);

  return (
    <nav className="bg-custom-gradient">
      <div className="px-6 h-16 flex justify-between items-center">
        {/* Logo */}
        <NavLink
          to="/"
          className="text-3xl font-bold italic text-white"
          onClick={() => setIsOpen(false)}
        >
          Lynklytics
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden text-lg md:flex items-center gap-8">
          <NavLink to="/" className={navLinkStyle}>
            Home
          </NavLink>

          {isAuthenticated && (
            <NavLink to="/dashboard" className={navLinkStyle}>
              Dashboard
            </NavLink>
          )}

          {!isAuthenticated ? (
            <>
              <NavLink to="/login" className={navLinkStyle}>
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="bg-red-500 px-5 py-2 rounded-lg text-white font-medium hover:bg-red-600 transition-colors duration-200"
              >
                Signup
              </NavLink>
            </>
          ) : (
              
           /* Profile */
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="text-white text-3xl cursor-pointer"
              >
                <FaUserCircle />
              </button>

              {showProfile && (
                <div className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-md shadow-md overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-300">
                    <p className="text-lg font-semibold text-gray-800">
                      {user?.name || "User"}
                    </p>

                    <p className="text-sm text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-lg font-semibold px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-white text-2xl cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="flex flex-col gap-3 text-white px-8 pb-4">
          <NavLink to="/" onClick={() => setIsOpen(false)}
          className={navLinkStyle}>
            Home
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/dashboard"
              className={navLinkStyle}
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </NavLink>
          )}

          {!isAuthenticated && (
            <>
              <NavLink className={navLinkStyle} to="/login" onClick={() => setIsOpen(false)}>
                Login
              </NavLink>

              <NavLink
                to="/register"
                onClick={() => setIsOpen(false)}
                className="bg-red-500 px-5 py-2 rounded-lg"
              >
                Signup
              </NavLink>
            </>
          )}

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="text-red-300 text-left font-semibold cursor-pointer"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
