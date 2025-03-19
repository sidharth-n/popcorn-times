import { configureStore } from "@reduxjs/toolkit"
import favoritesReducer from "./favoritesSlice"
import searchReducer from "./searchSlice"
import genreMoviesReducer from "./genreMoviesSlice"

// Configure Redux store with reducers
export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    search: searchReducer,
    genreMovies: genreMoviesReducer,
  },
})

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
