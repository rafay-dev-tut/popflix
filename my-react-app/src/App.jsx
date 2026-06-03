import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './theme/header';
import Fotter from './theme/fotter'; // 👈 Check karein agar spelling folder mein 'footer' hai toh yahan bhi theek karein
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails'; 
import Subscription from './pages/Subscription'; // 👈 1. Subscription page ko yahan import kiya

function App() {
  return (
    <BrowserRouter>
      {/* Background rich dark cinema theme */}
      <div className="flex flex-col min-h-screen bg-[#0b0c10] text-white">
        
        {/* Header top par hi rahega */}
        <Header />
        
        {/* Main Content Area: Yahan pages badalte hain */}
        <main className="flex-grow">
          <Routes>
            {/* Main home page ka route */}
            <Route path="/" element={<Home />} />
            
            {/* Movies list page ka route */}
            <Route path="/movies" element={<Movies />} />
            
            {/* Movie Details page ka route */}
            <Route path="/movie/:id" element={<MovieDetails />} />

            {/* 👈 2. Yeh line missing thi! Ab subscription page open hoga */}
            <Route path="/subscription" element={<Subscription />} />
          </Routes>
        </main>

        {/* Footer bottom par hi rahega */}
        <Fotter />
        
      </div>
    </BrowserRouter>
  );
}

export default App;