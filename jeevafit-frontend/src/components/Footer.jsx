import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#03045E] text-white py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Brand Info */}
        <div>
          <h3 className="text-2xl font-sans-serif font-bold mb-2">JeevaFit</h3>
          <p className="text-sm font-sans-serif font-medium text-gray-300">
            Your intelligent companion for managing health — from vitals tracking to appointments and more.
          </p>
        </div>

        {/* Navigation */}
        <div className='w-full items-center justify-center md:text-center'>
          <h4 className="text-lg font-sans-serif font-bold mb-3">Quick Links</h4>
          <ul className="space-y-2 font-sans-serif font-medium text-sm text-gray-300">
            <li><a href="#features" className="hover:underline">Features</a></li>
            <li><a href="#how-it-works" className="hover:underline">How It Works</a></li>
            <li><a href="/login" className="hover:underline">Get Started</a></li>
            <li><a href="#contact" className="hover:underline">Contact Us</a></li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div className='w-full items-center justify-center md:text-center'>
          <h4 className="text-lg font-sans-serif font-bold mb-3">Get in Touch</h4>
          <p className="text-sm text-gray-300">Email: support@jeevafit.app</p>

          {/* Optional: Social icons (placeholder) */}
          {/* <div className="flex gap-4 mt-4">
            <a href="#" aria-label="Facebook" className="hover:text-[#FF6D00]">📘</a>
            <a href="#" aria-label="Twitter" className="hover:text-[#FF6D00]">🐦</a>
            <a href="#" aria-label="Instagram" className="hover:text-[#FF6D00]">📸</a>
          </div> */}
        </div>
      </div>

      <div className="text-center mt-10 text-xs text-gray-400">
        &copy; {new Date().getFullYear()} JeevaFit. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;