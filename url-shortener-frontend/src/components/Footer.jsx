import {
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-custom-gradient text-white">
      <div className="py-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {/* Left */}
          <div className="flex flex-col items-center">
            <h2 className="text-4xl font-bold">Linklytics</h2>

            <p className="mt-4 text-gray-200 text-sm">
              • Shorten • Share • Analyze
            </p>
          </div>

          {/* Middle */}
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>

            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="hover:text-blue-200 transition-colors duration-200"
                >
                  Home
                </a>
              </li>

              <li>
                <a
                  href="/login"
                  className="hover:text-blue-200 transition-colors duration-200"
                >
                  Login
                </a>
              </li>

              <li>
                <a
                  href="/signup"
                  className="hover:text-blue-200 transition-colors duration-200"
                >
                  Sign Up
                </a>
              </li>
            </ul>
          </div>

          {/* Right */}
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">Connect</h3>

            <div className="flex gap-5 text-3xl">
              <a
                href="https://github.com/"
                target="_blank"
                className="hover:text-blue-200 hover:scale-110 transition-all duration-200"
              >
                <FaGithub />
              </a>

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                className="hover:text-blue-200 hover:scale-110 transition-all duration-200"
              >
                <FaLinkedin />
              </a>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                className="hover:text-blue-200 hover:scale-110 transition-all duration-200"
              >
                <FaInstagram />
              </a>

              <a
                href="https://twitter.com/"
                target="_blank"
                className="hover:text-blue-200 hover:scale-110 transition-all duration-200"
              >
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 mt-8"></div>

        {/* Bottom */}
        <div className="text-center text-sm text-gray-200 pt-4">
          © 2026 Linklytics. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;