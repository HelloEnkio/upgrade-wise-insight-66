
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-tech-gray-50 to-tech-gray-100 border-t border-tech-gray-200/50 py-12 px-6 mt-24">
      <div className="container mx-auto">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-tech rounded-lg flex items-center justify-center shadow-neon">
              <span className="text-white font-bold text-xs">IB</span>
            </div>
            <span className="text-lg font-bold bg-gradient-dark bg-clip-text text-transparent">Is it Better?</span>
          </div>
          
          <p className="text-tech-gray-600 max-w-md mx-auto">
            <span className="text-tech-electric font-semibold">AI-powered</span> comparisons for smarter upgrade decisions
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-8 text-sm">
            <Link to="/contact" className="text-tech-gray-500 hover:text-tech-electric transition-colors font-medium">
              Contact
            </Link>
            <Link to="/privacy" className="text-tech-gray-500 hover:text-tech-electric transition-colors font-medium">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-tech-gray-500 hover:text-tech-electric transition-colors font-medium">
              Terms of Service
            </Link>
          </div>
          
          <div className="pt-6 border-t border-tech-gray-200/50">
            <p className="text-sm text-tech-gray-500">
              © {new Date().getFullYear()} Is it Better? • Making tech decisions <span className="text-tech-electric">easier</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
