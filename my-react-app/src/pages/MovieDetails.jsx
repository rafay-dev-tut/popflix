import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMovieDetails, fetchMovieVideos, getImageUrl } from '../services/api';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("trailer");
  const [serverKey, setServerKey] = useState("autoembed");
  const [iframeKey, setIframeKey] = useState(0); // force re-mount on server change
  const playerRef = useRef(null);

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

  const handleServerChange = (newServer) => {
    setServerKey(newServer);
    setIframeKey(prev => prev + 1); // remount iframe so new src loads cleanly
  };

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
    autoembed: `https://player.autoembed.cc/embed/movie/${movie.id}`,
    multiembed: `https://multiembed.mov/?video_id=${movie.id}&tmdb=1`,
    vidsrc_me: `https://vidsrc.me/embed/movie?tmdb=${movie.id}`,
    smashy: `https://embed.smashystream.com/playere.php?tmdb=${movie.id}`,
  };

  const servers = [
    { key: "autoembed",  label: "Server 1", icon: "🚀" },
    { key: "multiembed", label: "Server 2", icon: "⚡" },
    { key: "vidsrc_me",  label: "Server 3", icon: "🌐" },
    { key: "smashy",     label: "Server 4", icon: "🔒" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-10 text-white">

      {/* ── Tab Buttons ── */}
      <div className="flex gap-2 mb-0">
        <button
          onClick={() => setActiveTab("trailer")}
          className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-t-lg font-semibold text-xs tracking-wide transition-all ${
            activeTab === "trailer"
              ? 'bg-[#841919] text-white'
              : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
          }`}
        >
          🎬 Trailer
        </button>
        <button
          onClick={() => setActiveTab("fullMovie")}
          className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-t-lg font-semibold text-xs tracking-wide transition-all ${
            activeTab === "fullMovie"
              ? 'bg-[#841919] text-white'
              : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
          }`}
        >
          ⭐ Full Movie
        </button>
      </div>

      {/* ── Player Box ── */}
      <div
        ref={playerRef}
        className="w-full rounded-b-xl rounded-tr-xl overflow-hidden bg-black shadow-2xl border border-gray-800 relative"
        style={{ aspectRatio: '16/9' }}
      >
        {activeTab === "trailer" ? (
          trailerKey ? (
            <iframe
              key={`trailer-${trailerKey}`}
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&playsinline=1`}
              title="Movie Trailer"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
              Trailer not available.
            </div>
          )
        ) : (
          <iframe
            key={`movie-${serverKey}-${iframeKey}`}
            className="w-full h-full"
            src={movieSources[serverKey]}
            title="Full Movie Player"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            referrerPolicy="origin"
          />
        )}
      </div>

      {/* ── Server Selector (only in Full Movie tab) ── */}
      {activeTab === "fullMovie" && (
        <div className="mt-3 mb-6">
          {/* Mobile: scrollable pill row */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {servers.map((s) => (
              <button
                key={s.key}
                onClick={() => handleServerChange(s.key)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  serverKey === s.key
                    ? 'bg-[#841919] border-[#841919] text-white'
                    : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
                }`}
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
                {serverKey === s.key && <span className="ml-1 w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>}
              </button>
            ))}
          </div>
          <p className="text-gray-600 text-xs mt-2 pl-1">
            If one server doesn't work, try another ↑
          </p>
        </div>
      )}

      {/* ── Movie Info ── */}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start mt-2">

        {/* Poster */}
        <div className="w-28 sm:w-48 md:w-64 flex-shrink-0 rounded-lg overflow-hidden shadow-md border border-gray-800">
          <img
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex-grow min-w-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-1 leading-tight">
            {movie.title}
          </h1>
          {movie.tagline && (
            <p className="text-gray-400 text-sm italic mb-3">{movie.tagline}</p>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-2 items-center text-xs font-semibold mb-5">
            <span className="bg-[#841919] text-white px-2.5 py-1 rounded">
              ⭐ {movie.vote_average?.toFixed(1)}
            </span>
            <span className="bg-gray-800 text-gray-300 px-2.5 py-1 rounded">
              {movie.release_date?.split('-')[0]}
            </span>
            {movie.runtime && (
              <span className="bg-gray-800 text-gray-300 px-2.5 py-1 rounded">
                {movie.runtime} min
              </span>
            )}
          </div>

          {/* Overview */}
          <div className="mb-5">
            <h3 className="text-base sm:text-lg font-bold border-b border-gray-800 pb-2 mb-3 tracking-wide">
              Overview
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">{movie.overview}</p>
          </div>

          {/* Genres */}
          {movie.genres?.length > 0 && (
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-gray-400 mb-2">Genres</h4>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="text-xs bg-gray-900 border border-gray-800 px-3 py-1 rounded-full text-gray-300"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;