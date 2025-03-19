import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useLayoutEffect,
} from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  Heart,
  Film,
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowLeft,
  ArrowRight,
} from "lucide-react"
import { Movie } from "../types/movie"
import { movieService } from "../services/api"
import SearchBar from "../components/SearchBar"
import { RootState } from "../store/store"
import { addFavorite, removeFavorite } from "../store/favoritesSlice"
import MovieCard from "../components/MovieCard"
import { TOP_MOVIES, GENRE_NAMES } from "../constants/movieData"
import {
  setSearchQuery,
  setSearchResults,
  setIsSearching,
  setCurrentPage,
  setTotalResults,
  setLoading,
  setError,
} from "../store/searchSlice"
import { debounce } from "../utils/debounce"

function Home() {
  const dispatch = useDispatch()
  const {
    query: searchQuery,
    results: movies,
    isSearching,
    currentPage,
    totalResults,
    loading,
    error,
  } = useSelector((state: RootState) => state.search)
  const { movies: genreMovies } = useSelector(
    (state: RootState) => state.genreMovies
  )
  const [isDesktop, setIsDesktop] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Check if we're on desktop
  useLayoutEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }

    checkIfDesktop()
    window.addEventListener("resize", checkIfDesktop)

    return () => {
      window.removeEventListener("resize", checkIfDesktop)
    }
  }, [])

  // No longer need to fetch movies here, as they're loaded in App.tsx
  // and stored in Redux

  // Add debouncing for search input
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      handleSearch(query)
    }, 500),
    []
  )

  const handleSearch = useCallback(
    async (query: string, page: number = 1) => {
      // Ensure query is trimmed
      const trimmedQuery = query.trim()

      if (!trimmedQuery) {
        dispatch(setIsSearching(false))
        dispatch(setSearchResults([]))
        dispatch(setError(null))
        dispatch(setTotalResults(0))
        return
      }

      dispatch(setLoading(true))
      dispatch(setIsSearching(true))
      dispatch(setError(null))

      try {
        // Use the trimmed query for the API call
        const response = await movieService.searchMovies(trimmedQuery, page)
        if (response.Response === "False") {
          if (response.Error === "Too many results.") {
            dispatch(
              setError(
                "Your search is too broad. Please add more specific keywords."
              )
            )
          } else {
            dispatch(setError(response.Error || "No movies found"))
          }
          dispatch(setSearchResults([]))
          dispatch(setTotalResults(0))
        } else {
          dispatch(setSearchResults(response.Search || []))
          dispatch(setTotalResults(parseInt(response.totalResults) || 0))
        }
      } catch (error: any) {
        dispatch(setError(error.message || "Something went wrong"))
      } finally {
        dispatch(setLoading(false))
      }
    },
    [dispatch]
  )

  const handlePageChange = (newPage: number) => {
    dispatch(setCurrentPage(newPage))
    handleSearch(searchQuery, newPage)
    // Scroll to top of results
    window.scrollTo({
      top: searchInputRef.current?.offsetTop || 0,
      behavior: "smooth",
    })
  }

  // The API returns 10 results per page
  const resultsPerPage = 10
  const totalPages = Math.ceil(totalResults / resultsPerPage)

  const toggleFavorite = (movie: Movie) => {
    const isFavorite = favorites.some(fav => fav.imdbID === movie.imdbID)
    if (isFavorite) {
      dispatch(removeFavorite(movie.imdbID))
    } else {
      dispatch(addFavorite(movie))
    }
  }

  const GenreSection = ({
    title,
    movies,
  }: {
    title: string
    movies: Movie[]
  }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const scroll = (direction: "left" | "right") => {
      if (scrollContainerRef.current) {
        const scrollAmount = direction === "left" ? -300 : 300
        scrollContainerRef.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        })
      }
    }

    return (
      <div className="mb-12 relative group">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>

        {/* Scroll Buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-1/2 hover:bg-black"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-1/2 hover:bg-black"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Movie List */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto space-x-4 pb-6 scrollbar-hide -mx-4 px-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {movies.map(movie => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      </div>
    )
  }

  // Update the scroll-container class to prevent horizontal overflow
  // This targets the container that holds the horizontally scrolling movie cards

  // First, find this CSS class in your styles (likely in index.css or a CSS module)
  // and update it, or add these styles to the component's inline styling:

  const scrollContainerStyle = {
    overflowX: "auto",
    overflowY: "hidden",
    scrollbarWidth: "none" /* Firefox */,
    msOverflowStyle: "none" /* IE/Edge */,
    scrollSnapType: "x mandatory",
    whiteSpace: "nowrap",
    padding: "0.5rem 0",
    margin: "0 -1rem",
    width: "100%",
    maxWidth: "100vw",
    paddingLeft: "1rem",
    scrollPaddingLeft: "1rem",
  }

  return (
    <div className="space-y-8 overflow-x-hidden">
      <div
        className={`relative ${
          isSearching ? "min-h-[80px]" : "min-h-[40vh] sm:min-h-[60vh]"
        } flex items-center justify-center bg-gradient-to-b from-transparent to-black transition-all duration-500`}
      >
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80"
            alt="Cinema"
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              isSearching ? "opacity-20" : "opacity-40"
            }`}
          />
        </div>

        <div className="relative z-10 w-full max-w-3xl mx-auto px-4">
          {!isSearching && (
            <div className="text-center space-y-4 sm:space-y-6 mb-6 sm:mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                Grab Your Popcorn
              </h1>
              <p className="text-base sm:text-xl text-gray-300">
                Let's find your next favorite movie together
              </p>
            </div>
          )}
          <div className="relative">
            <input
              type="text"
              placeholder="Search for movies..."
              value={searchQuery}
              onChange={e => {
                const value = e.target.value
                dispatch(setSearchQuery(value))
                debouncedSearch(value.trim())
              }}
              className="w-full py-3 sm:py-4 px-4 sm:px-6 pl-10 sm:pl-12 bg-gray-900 bg-opacity-75 border-2 border-gray-700 rounded-lg focus:outline-none focus:border-red-600 text-white text-base sm:text-lg placeholder-gray-400 backdrop-blur-sm"
            />
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-8 sm:py-20">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mx-4 sm:mx-6 shadow-lg">
          <div className="flex flex-col items-center space-y-4">
            {error.includes("too broad") ? (
              <>
                <Search className="w-12 h-12 text-amber-500" />
                <h3 className="text-xl font-semibold text-amber-500">
                  Search Too Broad
                </h3>
                <p className="text-gray-300 text-center">
                  Please add more specific keywords to narrow down your search
                  results.
                </p>
              </>
            ) : (
              <>
                <Film className="w-12 h-12 text-red-500" />
                <p className="text-red-500 text-lg font-medium">{error}</p>
              </>
            )}
          </div>
        </div>
      )}

      {isSearching && movies.length > 0 && (
        <div className="px-4 sm:px-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold">Search Results</h2>
            <p className="text-sm text-gray-400">
              Showing {(currentPage - 1) * resultsPerPage + 1}-
              {Math.min(currentPage * resultsPerPage, totalResults)} of{" "}
              {totalResults} results
            </p>
          </div>

          {/* Optimized grid for desktop and mobile */}
          <div
            className={`grid gap-4 sm:gap-6 ${
              isDesktop
                ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
            }`}
          >
            {movies.map(movie => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg flex items-center ${
                  currentPage === 1
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                    : "bg-gray-800 text-white hover:bg-red-600"
                }`}
              >
                <ArrowLeft size={16} />
              </button>

              {/* Show more page buttons on desktop */}
              {Array.from({
                length: isDesktop
                  ? Math.min(7, totalPages)
                  : Math.min(5, totalPages),
              }).map((_, i) => {
                // Show pages around current page
                let pageNumber
                const maxVisible = isDesktop ? 7 : 5

                if (totalPages <= maxVisible) {
                  pageNumber = i + 1
                } else if (currentPage <= Math.ceil(maxVisible / 2)) {
                  pageNumber = i + 1
                } else if (
                  currentPage >=
                  totalPages - Math.floor(maxVisible / 2)
                ) {
                  pageNumber = totalPages - maxVisible + 1 + i
                } else {
                  pageNumber = currentPage - Math.floor(maxVisible / 2) + i
                }

                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-10 h-10 rounded-lg ${
                      currentPage === pageNumber
                        ? "bg-red-600 text-white"
                        : "bg-gray-800 text-white hover:bg-red-600"
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg flex items-center ${
                  currentPage === totalPages
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                    : "bg-gray-800 text-white hover:bg-red-600"
                }`}
              >
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {!isSearching && (
        <div className="space-y-8 sm:space-y-12">
          {/* Render movie sections by genre */}
          {Object.entries(genreMovies).map(([genre, movies]) =>
            movies.length > 0 ? (
              <div key={genre}>
                <div className="flex items-center justify-between px-4 sm:px-6 mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold">
                    {GENRE_NAMES[genre as keyof typeof GENRE_NAMES]}
                  </h2>
                  <Link
                    to={`/genre/${genre}`}
                    className="text-sm text-red-600 hover:text-red-400 transition-colors"
                  >
                    View All
                  </Link>
                </div>
                <div className="scroll-container" style={scrollContainerStyle}>
                  {movies.map(movie => (
                    <MovieCard
                      key={`${genre}-${movie.imdbID}`}
                      movie={movie}
                      inScroll={true}
                    />
                  ))}
                </div>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  )
}

export default Home
