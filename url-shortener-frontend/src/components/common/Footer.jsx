import { FaGithub, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Footer = () => {
  // Get the user's authentication status to display relevant navigation links.
  const { isAuthenticated } = useAuth();

  // Automatically update the copyright year without manually changing it.
  const currentYear = new Date().getFullYear();

  // Store social media link details in one array for easier maintenance and rendering.
  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/",
      icon: <FaGithub />,
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/",
      icon: <FaLinkedin />,
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/",
      icon: <FaInstagram />,
    },
    {
      name: "Twitter",
      url: "https://twitter.com/",
      icon: <FaTwitter />,
    },
  ];

  return (
    <footer className="bg-custom-gradient text-white">
      <div className="py-8">
        {/* Display the application brand and its main purpose */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {/* Brand section */}
          <div className="flex flex-col items-center">
            <h2 className="text-4xl font-bold">Linklytics</h2>
            <p className="mt-4 text-gray-200 text-sm">
              • Shorten • Share • Analyze
            </p>
          </div>

          {/* Navigation links available to users */}
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-3">Quick Links</h3>

            <ul className="space-y-1">
              <li>
                <NavLink
                  to="/"
                  className="hover:text-blue-200 transition-colors duration-200"
                >
                  Home
                </NavLink>
              </li>

              {/* Show the Dashboard link only to authenticated users */}
              {isAuthenticated && (
                <li>
                  <NavLink
                    to="/dashboard"
                    className="hover:text-blue-200 transition-colors duration-200"
                  >
                    Dashboard
                  </NavLink>
                </li>
              )}

              {/* Show Login and Sign Up links only to logged-out users */}
              {!isAuthenticated && (
                <>
                  <li>
                    <NavLink
                      to="/login"
                      className="hover:text-blue-200 transition-colors duration-200"
                    >
                      Login
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/register"
                      className="hover:text-blue-200 transition-colors duration-200"
                    >
                      Sign Up
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Render social media links from the socialLinks array */}
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">Connect</h3>

            <div className="flex gap-5 text-3xl">
              {socialLinks.map((social) => (
                <a
                  // Use the platform name as a unique key for each rendered link.
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  // Prevent the opened external page from accessing the original window.
                  rel="noopener noreferrer"
                  className="hover:text-blue-200 hover:scale-110 transition-all duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Separate the main footer content from the copyright section */}
        <div className="border-t border-white/20 mt-8"></div>

        {/* Display the current year and copyright notice */}
        <div className="text-center text-sm text-gray-200 pt-4">
          © {currentYear} Linklytics. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
