import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import logo from '../assets/POPFLiX.svg'; 

function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile sidebar state
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false); // Search karne ke baad mobile menu close ho jaye
    } else {
      navigate('/movies');
    }
  };

  return (
    <header className="bg-[#0b0c10] text-white shadow-2xl sticky top-0 z-50 border-b border-gray-900">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        
       
        <div className="flex items-center flex-shrink-0">
          <Link to="/">
            <img 
              src={logo} 
              alt="POPFLIX Logo" 
              className="h-7 w-auto object-contain transition-all duration-300 hover:drop-shadow-[0_0_8px_#841919] hover:scale-105" 
            />
          </Link>
        </div>

        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="font-medium text-sm text-gray-300 hover:text-[#841919] transition-colors duration-200">
            Home
          </Link>
          <Link to="/movies" className="font-medium text-sm text-gray-300 hover:text-[#841919] transition-colors duration-200">
            Movies
          </Link>
          <Link to="/subscription" className="font-medium text-sm text-gray-300 hover:text-[#841919] transition-colors duration-200">
            Subscription
          </Link>
        </nav>

       
        <div className="flex items-center gap-4 flex-grow md:flex-grow-0 justify-end">
         
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-[180px] sm:max-w-[240px] md:max-w-[280px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies..."
              className="w-full bg-[#1c1d24] text-white pl-9 pr-4 py-1.5 rounded-md text-sm placeholder-gray-500 border border-gray-700/60 focus:outline-none focus:bg-[#252630] focus:border-[#841919] focus:ring-1 focus:ring-[#841919] transition-all duration-200"
            />
          </form>

         
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-300 hover:text-[#841919] focus:outline-none p-1"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
             
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
             
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

      </div>

     
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

     
      <div 
        className={`fixed top-0 right-0 h-full w-[260px] bg-[#0b0c10] border-l border-gray-900 shadow-2xl p-6 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end mb-8">
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-[#841919]">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-6">
          <Link 
            to="/" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="font-semibold text-lg text-gray-300 hover:text-[#841919] pb-2 border-b border-gray-900 transition-colors"
          >
            Home
          </Link>
          <Link 
            to="/movies" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="font-semibold text-lg text-gray-300 hover:text-[#841919] pb-2 border-b border-gray-900 transition-colors"
          >
            Movies
          </Link>
          <Link 
            to="/subscription" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="font-semibold text-lg text-gray-300 hover:text-[#841919] pb-2 border-b border-gray-900 transition-colors"
          >
            Subscription
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;