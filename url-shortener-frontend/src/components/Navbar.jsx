import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navLinkStyle = ({ isActive }) =>
    isActive
      ? "text-white border-b-2 border-white"
      : "text-gray-200 hover:text-white transition-colors duration-200";
  return (
    <nav className="bg-custom-gradient">
      <div className="px-8 h-16 flex justify-between items-center">
        {/* Logo */}
        <NavLink
          to="/"
          className="text-3xl font-bold italic text-white"
          onClick={() => setIsOpen(false)}
        >
          Lynklytics
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={navLinkStyle}>
            Home
          </NavLink>

          <NavLink to="/login" className={navLinkStyle}>
            Login
          </NavLink>

          <NavLink
            to="/register"
            className="bg-red-500 px-5 py-2 rounded-lg text-white font-medium hover:bg-red-600 transition-colors duration-200"
          >
            Signup
          </NavLink>
        </div>

        {/* Hamburger Button */}
        <button
          className="md:hidden text-white text-2xl cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="flex flex-col gap-4 text-white px-8 pb-4">
          <NavLink to="/" onClick={() => setIsOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/login" onClick={() => setIsOpen(false)}>
            Login
          </NavLink>
          <NavLink
            to="/register"
            onClick={() => setIsOpen(false)}
            className="bg-red-500 px-5 py-2 rounded-lg w-fit"
          >
            Signup
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
