import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchPopularMovies, getImageUrl } from '../services/api';

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMovies = async () => {
      try {
        setLoading(true);
        const data = await fetchPopularMovies(); 
        
        
        if (data && data.results && Array.isArray(data.results)) {
          setMovies(data.results);
        } else {
          setMovies([]);
        }
      } catch (error) {
        console.error("Error fetching movies in Home component:", error);
      } finally {
        setLoading(false);
      }
    };
    getMovies();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0c0d10]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#841919]"></div>
      </div>
    );
  }

  
  const heroMovie = movies.length > 0 ? movies[0] : null;
  const gridMovies = movies.length > 1 ? movies.slice(1) : movies;

  return (
    <div className="bg-[#0c0d10] min-h-screen text-gray-100 pb-12">
      
  
      {heroMovie && (
        <div className="relative h-[70vh] sm:h-[80vh] w-full overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={getImageUrl(heroMovie.backdrop_path || heroMovie.poster_path)} 
              alt={heroMovie.title}
              className="w-full h-full object-cover object-top scale-105 filter brightness-[0.35]"
            />
          
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d10] via-transparent to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0c0d10]/90 via-[#0c0d10]/30 to-transparent" />
          </div>

        
          <div className="absolute bottom-0 left-0 max-w-4xl px-6 sm:px-12 pb-12 md:pb-20 z-10 space-y-4">
            <span className="bg-[#841919] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded">
              Trending Choice
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white line-clamp-2 drop-shadow-lg">
              {heroMovie.title}
            </h1>
            <div className="flex items-center gap-4 text-sm font-medium">
              <span className="text-yellow-400 flex items-center gap-1">
                ⭐ {heroMovie.vote_average ? heroMovie.vote_average.toFixed(1) : 'N/A'}
              </span>
              <span className="text-gray-400">
                {heroMovie.release_date ? heroMovie.release_date.split('-')[0] : 'N/A'}
              </span>
            </div>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg line-clamp-3 max-w-2xl font-light leading-relaxed">
              {heroMovie.overview}
            </p>
            <div className="pt-2">
              <Link 
                to={`/movie/${heroMovie.id}`}
                className="inline-flex items-center justify-center bg-[#841919] hover:bg-[#a62222] text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-[#841919]/30"
              >
               
              </Link>
            </div>
          </div>
        </div>
      )}

    
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white border-l-4 border-[#841919] pl-3 tracking-wide">
            Popular Movies pagal
          </h2>
          <h2 className="text-xl sm:text-2xl font-bold text-white border-l-4 border-[#841919] pl-3 tracking-wide">
            Popular Movies pagal
          </h2>
        </div>

        {gridMovies.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No movies found.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {gridMovies.map((movie) => (
              <Link 
                to={`/movie/${movie.id}`} 
                key={movie.id}
                className="bg-[#14151a] rounded-xl overflow-hidden shadow-xl group hover:scale-[1.03] transition-all duration-300 border border-gray-900 hover:border-[#841919]/50 flex flex-col h-full cursor-pointer"
              >
                <div className="relative overflow-hidden aspect-[2/3]">
                  <img 
                    src={getImageUrl(movie.poster_path)} 
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md text-yellow-400 font-bold text-xs px-2 py-1 rounded-md flex items-center gap-1 shadow-md">
                    ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                  </div>
                </div>

                <div className="p-4 flex flex-col justify-between flex-grow bg-gradient-to-b from-[#14151a] to-[#0f1013]">
                  <h3 className="font-semibold text-sm text-gray-200 line-clamp-1 group-hover:text-[#841919] transition-colors duration-200">
                    {movie.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 font-medium">
                    {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default Home;