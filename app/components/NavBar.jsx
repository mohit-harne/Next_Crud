// components/Navbar.jsx

"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ModeToggle } from './theme-btn';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleMenuClick = () => {
    setIsOpen(false);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -60 }} // Slide from above
      animate={{ opacity: 1, y: 0 }}   // Fade in and move to original position
      transition={{ duration: 2.8, ease: "easeOut" }} // Adjusted to a faster and smoother duration
      className="fixed top-0 left-0 w-full bg-white/30 backdrop-blur-lg border-gray-200 shadow-md px-4 py-1 z-50"
    >
      <div className="container flex flex-wrap justify-between items-center mx-auto">
        <Link href="/" className="text-2xl font-bold text-black">
          CRUD
        </Link>
        {/* Hamburger Icon for Small Screens */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-controls="navbar-default"
          aria-expanded={isOpen ? 'true' : 'false'}
        >
          <svg
            className="w-6 h-6 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
            />
          </svg>
        </button>
        {/* Main Navigation Links */}
        <div
          className={`${
            isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden transition-all duration-500 ease-in-out w-full sm:flex sm:w-auto sm:opacity-100 sm:max-h-full`}
          id="navbar-default"
        >
          <ul className="flex flex-col mt-4 sm:flex-row sm:space-x-8 sm:mt-0 text-lg">
            <li>
              <Link href="/" className="block py-2 px-4 text-black rounded hover:bg-gray-100" onClick={handleMenuClick}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/users" className="block py-2 px-4 text-black rounded hover:bg-gray-100" onClick={handleMenuClick}>
                Users
              </Link>
            </li>
            <li>
              <Link href="/About" className="block py-2 px-4 text-black rounded hover:bg-gray-100" onClick={handleMenuClick}>
                About Us
              </Link>
            </li>
            <li>
              <Link href="/Contact" className="block py-2 px-4 text-black rounded hover:bg-gray-100" onClick={handleMenuClick}>
                Contact Us
              </Link>
            </li>
            <li>
              <a
                href="tel:+123456789"
                className="block py-2 px-4 text-gray-100 rounded-lg hover:bg-violet-900 bg-violet-700"
                onClick={handleMenuClick}
              >
                Call Us
              </a>
            </li>
            <li>
              <ModeToggle/>
            </li>
          </ul>
        </div>
      </div>
    </motion.nav>
  );
}
