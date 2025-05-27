export type MediaType = "movie" | "tv";

export interface TMDBMediaItem {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  vote_average: number;
}

export interface TMDBMovie extends TMDBMediaItem {
  release_date: string;
  belongs_to_collection?: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  };
  spoken_languages: { english_name: string; iso_639_1: string; name: string }[];
  tagline: string;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
  }[];
  cast: TMDBCastMember[];
}

export interface TMDBTVShow extends TMDBMediaItem {
  first_air_date: string;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
  }[];
  seasons: { name: string; poster_path: string | null; id: number }[];
  spoken_languages: { english_name: string; iso_639_1: string; name: string }[];
  cast: TMDBCastMember[];
}

interface TMDBAuthor {
  name: string;
  username: string;
  avatar_path: string | null;
  rating: number;
}

interface TMDBCastMember {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: "Acting" | "Directing" | (string & {});
}

export interface TMDBReview {
  id: number;
  author: string;
  author_details: TMDBAuthor;
  content: string;
  created_at: string;
}
