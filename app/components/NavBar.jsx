"use client";
import { ModeToggle } from './theme-btn';
import '../globals.css'
import { useState } from 'react';
import Link from 'next/link';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
    <nav className="bg-gray-300 bg-opacity-0 backdrop-blur-md px-4 fixed w-full z-10 top-0">
      <div className="flex items-center justify-between px-6  ">
        <div className=" text-xl font-semibold">
          <Link href="/">CRUD</Link>
        </div>

        {/* Toggle button for mobile */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className=" focus:outline-none"
          >
            {/* Icon for hamburger menu */}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-10 py-4 text-lg">
          <Link href="/" className=" hover:text-orange-500 hover:underline hover:scale-110 transition-all ">
            Home
          </Link>
          <Link href="/About" className=" hover:text-orange-500 hover:underline hover:scale-110 transition-all">
            About
          </Link>
          <Link href="/users" className=" hover:text-orange-500 hover:underline hover:scale-110 transition-all">
            Users
          </Link>
          <Link href="/Contact" className=" hover:text-orange-500 hover:underline hover:scale-110 transition-all">
            Contact
          </Link>
         
        </div>
        <ModeToggle />
        
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden mt-2 space-y-2">
          <Link href="/" className="block  hover:text-orange-500 hover:underline hover:scale-110 transition-all">
            Home
          </Link>
          <Link href="/About" className="block  hover:text-orange-500 hover:underline hover:scale-110 transition-all">
            About
          </Link>
          <Link
            href="/users"
            className="block  hover:text-orange-500 hover:underline hover:scale-110 transition-all"
          >
            Users
          </Link>
          <Link href="/Contact" className="block  hover:text-orange-500 hover:underline hover:scale-110 transition-all">
            Contact
          </Link>
        </div>
      )}
      <hr/>
    </nav>
    
    </>
  );
};

export default NavBar;
