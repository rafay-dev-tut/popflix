import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMovieDetails, fetchMovieVideos, getImageUrl } from '../services/api';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("trailer"); // 'trailer' ya 'fullMovie'
  const [serverKey, setServerKey] = useState("autoembed");

  useEffect(() => {
    const getMovieDetails = async () => {
      setLoading(true);
      const details = await fetchMovieDetails(id);
      const videoKey = await fetchMovieVideos(id);
      
      setMovie(details);
      setTrailerKey(videoKey);
      setLoading(false);
    };
    getMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#841919]"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center py-20 text-white">
        <h2 className="text-xl font-semibold">Movie not found!</h2>
        <Link to="/" className="text-[#841919] mt-4 inline-block hover:underline">Go back Home</Link>
      </div>
    );
  }

  
  const movieSources = {
  
    multiembed: `https://multiembed.mov/?video_id=${movie.id}&tmdb=1`,
    
    
    autoembed: `https://player.autoembed.cc/embed/movie/${movie.id}`,
    
   
    vidsrc_me: `https://vidsrc.me/embed/movie/${movie.id}`,
    
   
    smashy: `https://embed.smashystream.com/playere.php?tmdb=${movie.id}`
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 text-white">
      
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("trailer")}
            className={`px-4 py-2 rounded-t-lg font-semibold text-xs tracking-wide transition-all ${
              activeTab === "trailer" ? 'bg-[#841919] text-white' : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
            }`}
          >
            🎬 Play Trailer
          </button>
          <button
            onClick={() => setActiveTab("fullMovie")}
            className={`px-4 py-2 rounded-t-lg font-semibold text-xs tracking-wide transition-all ${
              activeTab === "fullMovie" ? 'bg-[#841919] text-white' : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
            }`}
          >
            ⭐ Watch Full Movie (VIP)
          </button>
        </div>

        
        {activeTab === "fullMovie" && (
          <div className="flex items-center gap-2 text-xs bg-gray-900 px-3 py-1.5 border border-gray-800 rounded">
            <span className="text-gray-400">Movie ID: {movie.id} | Link:</span>
            <select 
              value={serverKey} 
              onChange={(e) => setServerKey(e.target.value)}
              className="bg-black border border-gray-700 text-white rounded px-2 py-0.5 focus:outline-none cursor-pointer font-semibold"
            >
              <option value="autoembed">🚀 Server 1 (Auto-Load)</option>
              <option value="multiembed">⚡ Server 2 (Multi-Player)</option>
              <option value="vidsrc_me">🌐 Server 3 (Backup Stream)</option>
              <option value="smashy">🔒 Server 4 (Ultra Bypass)</option>
            </select>
          </div>
        )}
      </div>

     
      <div className="w-full aspect-video rounded-b-xl rounded-tr-xl overflow-hidden bg-black shadow-2xl mb-10 border border-gray-800 relative">
        {activeTab === "trailer" ? (
          trailerKey ? (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="Movie Trailer"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              Trailer not available.
            </div>
          )
        ) : (
         
          <div className="w-full h-full relative bg-black">
            <iframe
              className="w-full h-full"
              src={movieSources[serverKey]}
              title="Full Movie Player"
              frameBorder="0"
              allowFullScreen
              
            ></iframe>

           
            <div 
              className="absolute top-[8%] left-0 w-full h-[78%] bg-transparent cursor-pointer pointer-events-auto"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            />
          </div>
        )}
      </div>

     
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-48 sm:w-64 flex-shrink-0 rounded-lg overflow-hidden shadow-md border border-gray-800">
          <img src={getImageUrl(movie.poster_path)} alt={movie.title} className="w-full h-auto" />
        </div>

        <div className="flex-grow">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{movie.title}</h1>
          <p className="text-gray-400 text-sm italic mb-4">{movie.tagline}</p>

          <div className="flex flex-wrap gap-3 items-center text-xs font-semibold mb-6">
            <span className="bg-[#841919] text-white px-2.5 py-1 rounded">⭐ {movie.vote_average?.toFixed(1)}</span>
            <span className="bg-gray-800 text-gray-300 px-2.5 py-1 rounded">{movie.release_date?.split('-')[0]}</span>
            <span className="bg-gray-800 text-gray-300 px-2.5 py-1 rounded">{movie.runtime} min</span>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-bold border-b border-gray-800 pb-2 mb-3 tracking-wide">Overview</h3>
            <p className="text-gray-300 text-sm leading-relaxed max-w-3xl">{movie.overview}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-400 mb-2">Genres</h4>
            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((genre) => (
                <span key={genre.id} className="text-xs bg-gray-900 border border-gray-800 px-3 py-1 rounded-full text-gray-300">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default MovieDetails;