import axios from 'axios';

// 👈 Humne direct key hatakar Vercel aur Vite ke mutabiq load kar li hai
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '204aa4b3666847e0d703930da9824bac'; 
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

// 1. Popular Movies Fetch karne ka function (with Page support)
export const fetchPopularMovies = async (page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return { results: [], total_pages: 1 };
  }
};

// 2. Filtered Movies by Genre and Page
export const fetchFilteredMovies = async (genreId, page = 1) => {
  try {
    let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}`;
    if (genreId) {
      url += `&with_genres=${genreId}`;
    }
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error filtering movies:", error);
    return { results: [], total_pages: 1 };
  }
};

// 3. Genres List Fetch karne ka function
export const fetchGenres = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
    return response.data.genres;
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
};

// 4. Movie Details Fetch karne ka function
export const fetchMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
};

// 5. Movie Trailer Video Fetch karne ka function
export const fetchMovieVideos = async (movieId) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`);
    const trailer = response.data.results.find(
      (video) => video.type === 'Trailer' && video.site === 'YouTube'
    );
    return trailer ? trailer.key : response.data.results[0]?.key || null;
  } catch (error) {
    console.error("Error fetching movie videos:", error);
    return null;
  }
};

// 6. Movies Search karne ka function
export const searchMovies = async (query, page = 1) => {
  try {
    if (!query) return { results: [], total_pages: 1 };
    const response = await axios.get(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}`
    );
    return response.data;
  } catch (error) {
    console.error("Error searching movies:", error);
    return { results: [], total_pages: 1 };
  }
};

// Image URL helper
export const getImageUrl = (posterPath) => {
  return posterPath ? `${IMAGE_URL}${posterPath}` : 'https://via.placeholder.com/500x750?text=No+Image';
};