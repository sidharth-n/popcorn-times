// Using environment variable for API key
const API_KEY = import.meta.env.VITE_OMDB_API_KEY

export const movieService = {
  searchMovies: async (query: string, page: number = 1) => {
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(
          query
        )}&page=${page}`
      )
      return await response.json()
    } catch (error) {
      console.error("Error searching movies:", error)
      throw error
    }
  },

  getMovieDetails: async (id: string) => {
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`
      )
      const data = await response.json()
      return data.Response === "True" ? data : null
    } catch (error) {
      console.error("Error fetching movie details:", error)
      return null
    }
  },
}
