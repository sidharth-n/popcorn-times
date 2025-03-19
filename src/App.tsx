import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Provider, useDispatch, useSelector } from "react-redux"
import { store, RootState } from "./store/store"
import Home from "./pages/Home"
import MovieDetails from "./pages/MovieDetails"
import Favorites from "./pages/Favorites"
import Genre from "./pages/Genre"
import LoadingLogo from "./components/LoadingLogo"
import Lottie from "lottie-react"
import { movieService } from "./services/api"
import { TOP_MOVIES } from "./constants/movieData"
import { setGenreMovies } from "./store/genreMoviesSlice"
import { Link } from "react-router-dom"
import { Heart } from "lucide-react"

function AppContent() {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const [logoData, setLogoData] = useState(null)
  const [initialDataLoaded, setInitialDataLoaded] = useState(false)
  const genreMoviesInitialized = useSelector(
    (state: RootState) => state.genreMovies.initialized
  )
  const favorites = useSelector((state: RootState) => state.favorites.movies)

  // Load logo animation data
  useEffect(() => {
    fetch("/logo.json")
      .then(response => response.json())
      .then(data => setLogoData(data))
      .catch(error => console.error("Error loading logo animation:", error))
  }, [])

  // Load initial movie data for homepage
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        if (genreMoviesInitialized) {
          // If we already have data, we don't need to load it again
          setInitialDataLoaded(true)
          return
        }

        // Load genre movies for homepage
        const newGenreMovies: Record<string, Movie[]> = {
          action: [],
          drama: [],
          scifi: [],
        }

        for (const genre of Object.keys(newGenreMovies)) {
          const movieIds = TOP_MOVIES[genre as keyof typeof TOP_MOVIES].slice(
            0,
            10
          )
          const movies = await Promise.all(
            movieIds.map(id => movieService.getMovieDetails(id))
          )
          newGenreMovies[genre] = movies.filter(
            movie => movie !== null
          ) as Movie[]
        }

        dispatch(setGenreMovies(newGenreMovies))
        setInitialDataLoaded(true)
      } catch (error) {
        console.error("Error pre-loading initial movie data:", error)
        // Even if there's an error, continue to the app after a delay
        setTimeout(() => setInitialDataLoaded(true), 2000)
      }
    }

    loadInitialData()
  }, [dispatch, genreMoviesInitialized])

  const handleLoadingComplete = () => {
    // Only complete loading if we have initial data
    if (initialDataLoaded) {
      setIsLoading(false)
    } else {
      // Check again in 300ms
      setTimeout(() => {
        if (initialDataLoaded) {
          setIsLoading(false)
        } else {
          // If still not loaded after 3 seconds, show app anyway
          setTimeout(() => setIsLoading(false), 3000)
        }
      }, 300)
    }
  }

  return (
    <div className="bg-black min-h-screen">
      {isLoading ? (
        <LoadingLogo onLoadingComplete={handleLoadingComplete} />
      ) : (
        <Router>
          <div className="min-h-screen bg-black text-white">
            <header className="bg-black text-white sticky top-0 z-40 border-b border-gray-800">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center space-x-2">
                    <Link to="/" className="flex items-center space-x-2">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12">
                        {logoData && (
                          <Lottie
                            animationData={logoData}
                            loop={true}
                            autoplay={true}
                            rendererSettings={{
                              preserveAspectRatio: "xMidYMid slice",
                            }}
                          />
                        )}
                      </div>
                      <span className="text-lg sm:text-xl md:text-2xl font-bold text-red-600 whitespace-nowrap">
                        POPCORN TIMES
                      </span>
                    </Link>
                  </div>
                  <Link
                    to="/favorites"
                    className="flex items-center space-x-1 text-gray-300 hover:text-red-600 transition-colors"
                  >
                    <Heart
                      className={
                        favorites.length > 0
                          ? "fill-red-600 text-red-600"
                          : "text-gray-400"
                      }
                      size={20}
                    />
                    <span className="font-medium">Favorites</span>
                  </Link>
                </div>
              </div>
            </header>

            <main className="container mx-auto pb-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/genre/:genre" element={<Genre />} />
              </Routes>
            </main>
          </div>
        </Router>
      )}
    </div>
  )
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export default App
