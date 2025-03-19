import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Movie } from "../types/movie"

interface SearchState {
  query: string
  results: Movie[]
  isSearching: boolean
  currentPage: number
  totalResults: number
  loading: boolean
  error: string | null
}

const initialState: SearchState = {
  query: "",
  results: [],
  isSearching: false,
  currentPage: 1,
  totalResults: 0,
  loading: false,
  error: null,
}

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload
    },
    setSearchResults: (state, action: PayloadAction<Movie[]>) => {
      state.results = action.payload
    },
    setIsSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    setTotalResults: (state, action: PayloadAction<number>) => {
      state.totalResults = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    resetSearch: state => {
      return initialState
    },
  },
})

export const {
  setSearchQuery,
  setSearchResults,
  setIsSearching,
  setCurrentPage,
  setTotalResults,
  setLoading,
  setError,
  resetSearch,
} = searchSlice.actions

export default searchSlice.reducer
