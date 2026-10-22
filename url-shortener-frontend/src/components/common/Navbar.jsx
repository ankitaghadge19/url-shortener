import { useEffect, useRef, useState } from "react";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  // Controls the visibility of the mobile navigation menu.
  const [isOpen, setIsOpen] = useState(false);

  // Controls the visibility of the authenticated user's profile dropdown.
  const [showProfile, setShowProfile] = useState(false);

  // Get the current user, authentication status, and logout function from AuthContext.
  const { user, isAuthenticated, logout } = useAuth();

  // Provides programmatic navigation after logout.
  const navigate = useNavigate();

  // References the profile dropdown container to detect clicks outside it.
  const profileRef = useRef(null);

  // Apply different styles to navigation links depending on the current route.
  const navLinkStyle = ({ isActive }) =>
    isActive
      ? "text-white border-b-2 border-white"
      : "text-gray-200 hover:text-white transition-colors duration-200";

  // Log out the user and reset the navigation UI.
  const handleLogout = async () => {
    try {
      // Wait for the logout operation to complete.
      await logout();
    } finally {
      // Close open menus and navigate to Login even if logout throws an error.
      setShowProfile(false);
      setIsOpen(false);

      // Redirect to login and prevent returning to the previous page using browser Back.
      void navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    // Close the profile dropdown when a click occurs outside its container.
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    // Listen for clicks across the document while the Navbar is mounted.
    document.addEventListener("mousedown", handleClickOutside);

    // Remove the listener when the component unmounts to prevent memory leaks.
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-custom-gradient">
      <div className="px-6 h-16 flex justify-between items-center">
        {/* Brand logo; clicking it also closes the mobile menu */}
        <NavLink
          to="/"
          className="text-3xl font-bold italic text-white"
          onClick={() => setIsOpen(false)}
        >
          Lynklytics
        </NavLink>

        {/* Desktop navigation: visible on medium and larger screens */}
        <div className="hidden text-lg md:flex items-center gap-8">
          <NavLink to="/" className={navLinkStyle}>
            Home
          </NavLink>

          {/* Show Dashboard only when the user is authenticated */}
          {isAuthenticated && (
            <NavLink to="/dashboard" className={navLinkStyle}>
              Dashboard
            </NavLink>
          )}

          {/* Show Login and Signup links to logged-out users */}
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
            /* Show the profile dropdown to authenticated users */
            <div ref={profileRef} className="relative">
              <button
                // Toggle the profile dropdown when the user icon is clicked.
                onClick={() => setShowProfile(!showProfile)}
                className="text-white text-3xl cursor-pointer"
                aria-label="Toggle profile menu"
                aria-expanded={showProfile}
              >
                <FaUserCircle />
              </button>

              {/* Display account details and logout action when the dropdown is open */}
              {showProfile && (
                <div className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-md shadow-md overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-300">
                    {/* Display the username, with a fallback if it is unavailable */}
                    <p className="text-lg font-semibold text-gray-800">
                      {user?.username || "User"}
                    </p>

                    {/* Display the email and truncate it if it exceeds the available width */}
                    <p className="text-sm text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>

                  {/* End the current session through the shared logout handler */}
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

        {/* Toggle button for opening and closing the mobile navigation menu */}
        <button
          className="md:hidden text-white text-2xl cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Render the mobile navigation links only when the menu is open */}
      {isOpen && (
        <div className="flex flex-col gap-3 text-white px-8 pb-4">
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className={navLinkStyle}
          >
            Home
          </NavLink>

          {/* Provide Dashboard access to authenticated users */}
          {isAuthenticated && (
            <NavLink
              to="/dashboard"
              className={navLinkStyle}
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </NavLink>
          )}

          {/* Provide Login and Signup links to logged-out users */}
          {!isAuthenticated && (
            <>
              <NavLink
                className={navLinkStyle}
                to="/login"
                onClick={() => setIsOpen(false)}
              >
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

          {/* Provide a logout action in the mobile menu for authenticated users */}
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
