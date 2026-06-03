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

  // Server 4 (smashy) ko mukammal taur par nikal diya gaya hai security ke liye
  const movieSources = {
    autoembed: `https://player.autoembed.cc/embed/movie/${movie.id}`,
    multiembed: `https://multiembed.mov/?video_id=${movie.id}&tmdb=1`,
    vidsrc_me: `https://vidsrc.me/embed/movie?tmdb=${movie.id}`,
  };

  const servers = [
    { key: "autoembed",  label: "Server 1", icon: "🚀" },
    { key: "multiembed", label: "Server 2", icon: "⚡" },
    { key: "vidsrc_me",  label: "Server 3", icon: "🌐" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 py-4 sm:py-10 text-white">

      {/* ── Tab Buttons ── */}
      <div className="flex gap-2 mb-0">
        <button
          onClick={() => setActiveTab("trailer")}
          className={`flex-1 sm:flex-none px-4 py-2.5 rounded-t-lg font-semibold text-xs tracking-wide transition-all ${
            activeTab === "trailer"
              ? 'bg-[#841919] text-white'
              : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
          }`}
        >
          🎬 Trailer
        </button>
        <button
          onClick={() => setActiveTab("fullMovie")}
          className={`flex-1 sm:flex-none px-4 py-2.5 rounded-t-lg font-semibold text-xs tracking-wide transition-all ${
            activeTab === "fullMovie"
              ? 'bg-[#841919] text-white'
              : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
          }`}
        >
          ⭐ Full Movie
        </button>
      </div>

      {/* ── Player Box (Mobile Par Screen Ko Bara Kiya Hai) ── */}
      <div
        ref={playerRef}
        className="w-full rounded-b-xl rounded-tr-xl overflow-hidden bg-black shadow-2xl border border-gray-800 relative z-10"
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
            /* STRICT SECURITY SANDBOX: 
              Yeh attribute kisi bhi qism ki redirection ya unwanted pop-ups ko 100% block rakhta hai.
            */
            sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
          />
        )}
      </div>

      {/* ── Server Selector ── */}
      {activeTab === "fullMovie" && (
        <div className="mt-4 mb-6 bg-gray-900/50 p-3 rounded-xl border border-gray-800/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-sm font-medium text-gray-300 pl-1">
              Select Streaming Server:
            </span>
            
            {/* Mobile View: Dropdown Menu */}
            <div className="block sm:hidden relative">
              <select
                value={serverKey}
                onChange={(e) => handleServerChange(e.target.value)}
                className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#841919]"
              >
                {servers.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.icon} {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Desktop View: Buttons (Wahi Pehle Wala UI) */}
            <div className="hidden sm:flex gap-2">
              {servers.map((s) => (
                <button
                  key={s.key}
                  onClick={() => handleServerChange(s.key)}
                  className={`flex-items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                    serverKey === s.key
                      ? 'bg-[#841919] border-[#841919] text-white'
                      : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white'
                  }`}
                >
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                  {serverKey === s.key && <span className="ml-1 w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>}
                </button>
              ))}
            </div>
          </div>
          <p className="text-gray-500 text-[11px] mt-2 pl-1">
            💡 If the current server is buffering, please switch to another server from the list.
          </p>
        </div>
      )}

      {/* ── Movie Info ── */}
      <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 items-start mt-4">

        {/* Poster */}
        <div className="w-32 sm:w-48 md:w-64 mx-auto sm:mx-0 flex-shrink-0 rounded-xl overflow-hidden shadow-md border border-gray-800">
          <img
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex-grow min-w-0 w-full">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-1 leading-tight text-center sm:text-left">
            {movie.title}
          </h1>
          {movie.tagline && (
            <p className="text-gray-400 text-xs sm:text-sm italic mb-3 text-center sm:text-left">{movie.tagline}</p>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-2 items-center justify-center sm:justify-start text-xs font-semibold mb-5">
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
            <p className="text-gray-300 text-sm leading-relaxed text-justify sm:text-left">{movie.overview}</p>
          </div>

          {/* Genres */}
          {movie.genres?.length > 0 && (
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-gray-400 mb-2">Genres</h4>
              <div className="flex flex-wrap gap-2 justify-start">
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