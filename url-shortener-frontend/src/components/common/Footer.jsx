import { FaGithub, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Footer = () => {
  const { isAuthenticated } = useAuth();

  const currentYear = new Date().getFullYear();

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
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {/* Brand (Left Section) */}
          <div className="flex flex-col items-center">
            <h2 className="text-4xl font-bold">Linklytics</h2>
            <p className="mt-4 text-gray-200 text-sm">
              • Shorten • Share • Analyze
            </p>
          </div>

          {/* Quick Links (Middle Section) */}
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

              {/* Logged-in user */}
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

              {/* Logged-out user */}
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
                      to="/signup"
                      className="hover:text-blue-200 transition-colors duration-200"
                    >
                      Sign Up
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Social Links (Right Section) */}
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">Connect</h3>

            <div className="flex gap-5 text-3xl">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="hover:text-blue-200 hover:scale-110 transition-all duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 mt-8"></div>

        {/* Bottom Section */}
        <div className="text-center text-sm text-gray-200 pt-4">
          © {currentYear} Linklytics. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
