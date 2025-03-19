import React, { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Movie } from "../types/movie"
import { movieService } from "../services/api"
import MovieCard from "../components/MovieCard"
import { TOP_MOVIES, GENRE_NAMES } from "../constants/movieData"

const Genre = () => {
  const { genre } = useParams<{ genre: string }>()
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [initialLoading, setInitialLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(10)
  const [allMovieIds, setAllMovieIds] = useState<string[]>([])
  const [hasMore, setHasMore] = useState(true)

  // Initial load to get movie IDs
  useEffect(() => {
    if (!genre || !TOP_MOVIES[genre as keyof typeof TOP_MOVIES]) {
      setError("Genre not found")
      setInitialLoading(false)
      setLoading(false)
      return
    }

    // Get all movie IDs for this genre
    const movieIds = TOP_MOVIES[genre as keyof typeof TOP_MOVIES]
    setAllMovieIds(movieIds)

    // Reset state when genre changes
    setMovies([])
    setVisibleCount(10)
    setHasMore(movieIds.length > 10)

    setInitialLoading(true)
    fetchMovieBatch(movieIds.slice(0, 10))
  }, [genre])

  // Function to fetch a batch of movies by IDs
  const fetchMovieBatch = async (ids: string[]) => {
    setLoading(true)
    setError(null)

    try {
      // Fetch movie details for each ID in this batch
      const moviePromises = ids.map(id => movieService.getMovieDetails(id))
      const fetchedMovies = await Promise.all(moviePromises)

      // Filter out any null results and add to existing movies
      const validMovies = fetchedMovies.filter(
        movie => movie !== null
      ) as Movie[]

      setMovies(prev => [...prev, ...validMovies])
    } catch (error) {
      console.error("Error fetching genre movies:", error)
      setError("Failed to load movies. Please try again.")
    } finally {
      setInitialLoading(false)
      setLoading(false)
      setLoadingMore(false)
    }
  }

  // Handle the "Load More" button click
  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return

    setLoadingMore(true)
    const nextBatch = allMovieIds.slice(visibleCount, visibleCount + 10)
    setVisibleCount(prev => prev + 10)

    // Check if there are more movies to load after this batch
    setHasMore(visibleCount + 10 < allMovieIds.length)

    fetchMovieBatch(nextBatch)
  }

  // Get the display name for the genre
  const genreName = genre
    ? GENRE_NAMES[genre as keyof typeof GENRE_NAMES] || genre
    : ""

  return (
    <div className="min-h-screen">
      {/* Background overlay */}
      <div
        className="fixed inset-0 z-0 opacity-10"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Sticky header with back navigation */}
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">{genreName} Movies</h1>
          <p className="text-gray-400 mt-2">
            Our collection of top {genreName.toLowerCase()} films
          </p>
        </div>

        {initialLoading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        )}

        {error && <div className="text-red-500 text-center py-10">{error}</div>}

        {!initialLoading && !error && (
          <>
            <div className="movie-grid">
              {movies.map(movie => (
                <MovieCard key={movie.imdbID} movie={movie} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg transition-colors font-semibold flex items-center space-x-2"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <span>Load More</span>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Genre
