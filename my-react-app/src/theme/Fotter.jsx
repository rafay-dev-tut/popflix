import React from 'react';
import { Link } from 'react-router-dom'; 
import logo from '../assets/POPFLiX.svg'; 

function Fotter() {
  return (
 
    <footer className="bg-[#0b0c10] text-gray-400 border-t border-gray-900/80 mt-auto py-10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        
       
        <div className="flex flex-col items-center md:items-start gap-3">
          <Link to="/" className="transition-transform hover:scale-105">
            <img 
              src={logo} 
              alt="POPFLIX Logo" 
              className="h-6 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" 
            />
          </Link>
          <p className="text-[11px] text-gray-500 max-w-[250px] text-center md:text-left tracking-wide">
            Your ultimate cinematic destination for movies and entertainment.
          </p>
        </div>

   
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-medium">
          <Link to="/" className="text-gray-400 hover:text-[#841919] transition-colors duration-200">
            Home
          </Link>
          <Link to="/movies" className="text-gray-400 hover:text-[#841919] transition-colors duration-200">
            Movies
          </Link>
          <Link to="/subscription" className="text-gray-400 hover:text-[#841919] transition-colors duration-200">
            Subscription
          </Link>
        </nav>

        
        <div className="text-[11px] text-gray-500 text-center md:text-right tracking-wider">
          <p>&copy; {new Date().getFullYear()} <span className="text-gray-400 font-medium">POPFLIX</span>. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}

export default Fotter;