// Types for movie data from OMDB API
export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}

export interface MovieDetails extends Movie {
  Plot: string;
  Genre: string;
  Director: string;
  Actors: string;
  Runtime: string;
  imdbRating: string;
}

export interface SearchResponse {
  Search: Movie[];
  totalResults: string;
  Response: string;
}