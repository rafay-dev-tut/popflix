import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { fetchPopularMovies, fetchFilteredMovies, fetchGenres, searchMovies, getImageUrl } from '../services/api';

function Movies() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate(); 

 
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search') || "";


  useEffect(() => {
    const getGenresData = async () => {
      const genresList = await fetchGenres();
      if (genresList) setGenres(genresList);
    };
    getGenresData();
  }, []);

  
  useEffect(() => {
    if (searchQuery) {
      setSelectedGenre(""); 
      setCurrentPage(1);
    }
  }, [searchQuery]);

  
  useEffect(() => {
    const fetchMoviesData = async () => {
      try {
        setLoading(true);
        let data;

        if (searchQuery) {
        
          data = await searchMovies(searchQuery, currentPage);
        } else if (selectedGenre) {
          
          data = await fetchFilteredMovies(selectedGenre, currentPage);
        } else {
         
          data = await fetchPopularMovies(currentPage);
        }

        if (data && data.results) {
          setMovies(data.results);
          setTotalPages(data.total_pages > 500 ? 500 : data.total_pages); // TMDB limits page to 500 max
        } else {
          setMovies([]);
        }
      } catch (error) {
        console.error("Error loading movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesData();
  }, [searchQuery, selectedGenre, currentPage]); 

  // Category change handler
  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId);
    setCurrentPage(1); 
    
    if (searchQuery) {
      navigate('/movies'); 
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 bg-[#0b0c10] min-h-screen text-white">
      
      {/* 🏷️ SECTION 1: CATEGORIES / GENRES CHIPS */}
      <div className="mb-8 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-gray-800">
        <div className="flex gap-2.5 min-w-max">
          <button
            onClick={() => handleGenreChange("")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 border cursor-pointer ${
              selectedGenre === "" && !searchQuery
                ? 'bg-[#841919] border-[#841919] text-white'
                : 'bg-[#1c1d24] border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
            }`}
          >
            All Movies
          </button>
          
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleGenreChange(genre.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 border cursor-pointer ${
                selectedGenre === genre.id
                  ? 'bg-[#841919] border-[#841919] text-white'
                  : 'bg-[#1c1d24] border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

  
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-white border-l-4 border-[#841919] pl-3 tracking-wide">
          {searchQuery 
            ? `Search Results for: "${searchQuery}"` 
            : selectedGenre 
              ? `${genres.find(g => g.id === selectedGenre)?.name || 'Filtered'} Movies`
              : "Explore Popular Movies"
          }
        </h1>
        <span className="text-xs text-gray-500 font-medium bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
          Page {currentPage} of {totalPages}
        </span>
      </div>

    
      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#841919]"></div>
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          Koi movies nahi milin. Dusri query ya category try karein!
        </div>
      ) : (
        <>
        
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <Link 
                to={`/movie/${movie.id}`} 
                key={movie.id}
                className="bg-[#1c1d24] rounded-lg overflow-hidden shadow-lg group hover:scale-105 transition-all duration-300 border border-gray-800/40 hover:border-[#841919]/50 flex flex-col h-full cursor-pointer"
              >
                <div className="relative overflow-hidden aspect-[2/3]">
                  {movie.poster_path ? (
                    <img 
                      src={getImageUrl(movie.poster_path)} 
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center text-xs text-gray-500 p-4 text-center">
                      No Poster Available
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md text-yellow-400 font-bold text-xs px-2 py-1 rounded-md flex items-center gap-1">
                    ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                  </div>
                </div>

                <div className="p-4 flex flex-col justify-between flex-grow bg-gradient-to-b from-[#1c1d24] to-[#15161b]">
                  <h3 className="font-semibold text-sm text-gray-100 line-clamp-1 group-hover:text-[#841919] transition-colors duration-200">
                    {movie.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 font-medium">
                    {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
                  </p>
                </div>
              </Link>
            ))}
          </div>

         
          <div className="flex justify-center items-center gap-4 mt-14 pt-6 border-t border-gray-900">
            <button
              onClick={() => {
                setCurrentPage((prev) => Math.max(prev - 1, 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === 1}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all duration-200 bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 disabled:opacity-40 disabled:hover:text-gray-400 disabled:hover:border-gray-800 cursor-pointer disabled:cursor-not-allowed"
            >
              ◀ Previous
            </button>
            
            <span className="text-sm font-semibold text-gray-400">
              Page <span className="text-white bg-gray-900 border border-gray-800 px-2.5 py-1 rounded mx-1">{currentPage}</span> of {totalPages}
            </span>

            <button
              onClick={() => {
                setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all duration-200 bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 disabled:opacity-40 disabled:hover:text-gray-400 disabled:hover:border-gray-800 cursor-pointer disabled:cursor-not-allowed"
            >
              Next ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Movies;