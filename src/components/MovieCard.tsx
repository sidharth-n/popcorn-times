import React from "react"
import { Link } from "react-router-dom"
import { Movie } from "../types/movie"
import { Heart, X } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { addFavorite, removeFavorite } from "../store/favoritesSlice"

interface MovieCardProps {
  movie: Movie
  inScroll?: boolean
  isFavoritesPage?: boolean
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  inScroll = false,
  isFavoritesPage = false,
}) => {
  const dispatch = useDispatch()
  const favorites = useSelector((state: any) => state.favorites.movies)
  const isFavorite = favorites.some((m: Movie) => m.imdbID === movie.imdbID)

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isFavorite) {
      dispatch(removeFavorite(movie.imdbID))
    } else {
      dispatch(addFavorite(movie))
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(removeFavorite(movie.imdbID))
  }

  // Use local placeholder image from public folder
  const placeholderImage = "/placeholder.png"

  return (
    <Link
      to={`/movie/${movie.imdbID}`}
      className={`movie-card ${inScroll ? "scroll-item" : ""}`}
    >
      <div className="relative group">
        <img
          src={movie.Poster !== "N/A" ? movie.Poster : placeholderImage}
          alt={movie.Title}
          className="movie-card-img"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-3">
          <h3 className="text-white font-bold text-sm sm:text-base truncate">
            {movie.Title}
          </h3>
          <p className="text-gray-300 text-xs sm:text-sm">{movie.Year}</p>
        </div>

        {/* Either show heart button OR remove button, not both */}
        {isFavoritesPage ? (
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-red-600 transition-all duration-200 hover:scale-105"
            aria-label="Remove from favorites"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        ) : (
          <button
            onClick={toggleFavorite}
            className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
              isFavorite
                ? "bg-red-600 text-white scale-105"
                : "bg-black bg-opacity-50 text-white hover:bg-red-600/70"
            }`}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Heart
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-200 ${
                isFavorite ? "fill-current" : "hover:scale-110"
              }`}
            />
          </button>
        )}
      </div>
    </Link>
  )
}

export default MovieCard
