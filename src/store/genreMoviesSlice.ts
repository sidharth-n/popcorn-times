import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Movie } from "../types/movie"

interface GenreMoviesState {
  movies: Record<string, Movie[]>
  loading: boolean
  initialized: boolean
}

const initialState: GenreMoviesState = {
  movies: {
    action: [],
    drama: [],
    scifi: [],
  },
  loading: false,
  initialized: false,
}

const genreMoviesSlice = createSlice({
  name: "genreMovies",
  initialState,
  reducers: {
    setGenreMovies: (state, action: PayloadAction<Record<string, Movie[]>>) => {
      state.movies = action.payload
      state.initialized = true
    },
    setGenreMoviesLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { setGenreMovies, setGenreMoviesLoading } =
  genreMoviesSlice.actions
export default genreMoviesSlice.reducer
