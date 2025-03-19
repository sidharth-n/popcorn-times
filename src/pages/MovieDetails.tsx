import React, { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  Heart,
  Star,
  Clock,
  Film,
  ArrowLeft,
  Calendar,
  User,
  Award,
} from "lucide-react"
import { MovieDetails as MovieDetailsType } from "../types/movie"
import { movieService } from "../services/api"
import { RootState } from "../store/store"
import { addFavorite, removeFavorite } from "../store/favoritesSlice"
import { Movie } from "../types/movie"

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [movie, setMovie] = useState<MovieDetailsType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const dispatch = useDispatch()
  const favorites = useSelector((state: RootState) => state.favorites.movies)
  const isFavorite = favorites.some((m: Movie) => m.imdbID === id)

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return

      try {
        const data = await movieService.getMovieDetails(id)
        setMovie(data)
        document.body.style.backgroundImage = `url(${
          data.Poster !== "N/A" ? data.Poster : ""
        })`
        document.body.style.backgroundSize = "cover"
        document.body.style.backgroundPosition = "center"
        document.body.style.backgroundAttachment = "fixed"
      } catch (err) {
        setError("Failed to fetch movie details")
      } finally {
        setLoading(false)
      }
    }

    fetchMovie()

    return () => {
      document.body.style.backgroundImage = ""
    }
  }, [id])

  const toggleFavorite = () => {
    if (!movie) return

    if (isFavorite) {
      dispatch(removeFavorite(movie.imdbID))
    } else {
      dispatch(addFavorite(movie))
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-500 mb-4">
          {error || "Movie not found"}
        </h2>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-gray-300 hover:text-red-600 transition-colors bg-gray-800 rounded-lg px-6 py-3"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
      </div>
    )
  }

  const InfoItem = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: any
    label: string
    value: string
  }) => (
    <div className="flex items-center space-x-2 text-gray-300">
      <Icon className="w-5 h-5" />
      <span className="text-sm">{value}</span>
    </div>
  )

  return (
    <div className="relative min-h-screen pb-10">
      {/* Background poster with gradient overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${
            movie.Poster !== "N/A"
              ? movie.Poster
              : "https://via.placeholder.com/1920x1080?text=No+Backdrop"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          filter: "blur(8px)",
          opacity: 0.2,
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* Back navigation */}
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
        <div className="flex flex-col md:flex-row gap-8">
          {/* Movie poster */}
          <div className="md:w-1/3 lg:w-1/4">
            <div className="sticky top-24 max-w-[280px] mx-auto md:mx-0">
              <img
                src={movie.Poster !== "N/A" ? movie.Poster : "/placeholder.png"}
                alt={movie.Title}
                className="w-full rounded-lg shadow-2xl"
              />
              <button
                onClick={toggleFavorite}
                className="mt-4 w-full py-3 px-6 flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 transition-colors rounded-lg text-white font-semibold"
              >
                <Heart
                  className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`}
                />
                <span>
                  {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                </span>
              </button>
            </div>
          </div>

          {/* Movie details */}
          <div className="md:w-2/3 lg:w-3/4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
              {movie.Title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-6">
              {movie.Year && (
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{movie.Year}</span>
                </div>
              )}

              {movie.Runtime && movie.Runtime !== "N/A" && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{movie.Runtime}</span>
                </div>
              )}

              {movie.imdbRating && movie.imdbRating !== "N/A" && (
                <div className="flex items-center text-yellow-500">
                  <Star className="w-4 h-4 mr-1 fill-current" />
                  <span>{movie.imdbRating}/10</span>
                </div>
              )}

              {movie.Rated && movie.Rated !== "N/A" && (
                <span className="px-2 py-1 bg-gray-800 rounded text-xs">
                  {movie.Rated}
                </span>
              )}
            </div>

            {movie.Genre && movie.Genre !== "N/A" && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {movie.Genre.split(", ").map((genre: string) => (
                    <span
                      key={genre}
                      className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {movie.Plot && movie.Plot !== "N/A" && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-3">
                  Overview
                </h2>
                <p className="text-gray-300 leading-relaxed">{movie.Plot}</p>
              </div>
            )}

            {/* Cast & crew */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {movie.Director && movie.Director !== "N/A" && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Director
                  </h3>
                  <p className="text-gray-300">{movie.Director}</p>
                </div>
              )}

              {movie.Writer && movie.Writer !== "N/A" && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Writers
                  </h3>
                  <p className="text-gray-300">{movie.Writer}</p>
                </div>
              )}

              {movie.Actors && movie.Actors !== "N/A" && (
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Cast
                  </h3>
                  <p className="text-gray-300">{movie.Actors}</p>
                </div>
              )}
            </div>

            {/* Awards & box office */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {movie.Awards && movie.Awards !== "N/A" && (
                <div className="p-4 bg-gray-900 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Awards
                  </h3>
                  <p className="text-gray-300">{movie.Awards}</p>
                </div>
              )}

              {movie.BoxOffice && movie.BoxOffice !== "N/A" && (
                <div className="p-4 bg-gray-900 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Box Office
                  </h3>
                  <p className="text-gray-300">{movie.BoxOffice}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetails
