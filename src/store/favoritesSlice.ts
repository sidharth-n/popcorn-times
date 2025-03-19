import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Movie } from "../types/movie"

interface FavoritesState {
  movies: Movie[]
}

const initialState: FavoritesState = {
  movies: [],
}

// Create favorites slice for managing favorite movies
export const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<Movie>) => {
      if (!state.movies.find(movie => movie.imdbID === action.payload.imdbID)) {
        state.movies.push(action.payload)
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.movies = state.movies.filter(
        movie => movie.imdbID !== action.payload
      )
    },
  },
})

export const { addFavorite, removeFavorite } = favoritesSlice.actions
export default favoritesSlice.reducer
