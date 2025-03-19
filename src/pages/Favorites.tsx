import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { Heart, ArrowLeft } from "lucide-react"
import { RootState } from "../store/store"
import { removeFavorite } from "../store/favoritesSlice"
import { Movie } from "../types/movie"
import MovieCard from "../components/MovieCard"

const Favorites = () => {
  const favorites = useSelector((state: RootState) => state.favorites.movies)
  const dispatch = useDispatch()
  const [removingMovies, setRemovingMovies] = useState<Record<string, boolean>>(
    {}
  )

  const handleRemoveFavorite = (movieId: string) => {
    setRemovingMovies(prev => ({ ...prev, [movieId]: true }))

    setTimeout(() => {
      dispatch(removeFavorite(movieId))
      setRemovingMovies(prev => ({ ...prev, [movieId]: false }))
    }, 300)
  }

  if (favorites.length === 0) {
    return (
      <div className="relative min-h-[80vh]">
        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(4px)",
          }}
        />

        <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-gray-300 hover:text-red-600 transition-colors bg-gray-800/50 rounded-lg px-4 py-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-[70vh] text-center px-4">
          <Heart className="w-20 h-20 text-gray-700 mb-6" />
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Your Favorites List is Empty
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Start adding some movies to your favorites!
          </p>
          <Link
            to="/"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Discover Movies
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-gray-300 hover:text-red-600 transition-colors bg-gray-800/50 rounded-lg px-4 py-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Favorites</h1>
            <p className="text-gray-400 mt-2">
              Your personally curated collection
            </p>
          </div>
          <span className="text-lg font-semibold px-4 py-2 bg-gray-800 rounded-lg">
            {favorites.length} {favorites.length === 1 ? "Movie" : "Movies"}
          </span>
        </div>

        <div className="movie-grid">
          {favorites.map((movie: Movie) => (
            <div
              key={movie.imdbID}
              className="transition-all duration-300"
              style={{
                opacity: removingMovies[movie.imdbID] ? 0 : 1,
                transform: removingMovies[movie.imdbID]
                  ? "scale(0)"
                  : "scale(1)",
              }}
            >
              <MovieCard movie={movie} isFavoritesPage={true} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Favorites
