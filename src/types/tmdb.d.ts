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

interface TMDBAuthor {
  name: string;
  username: string;
  avatar_path: string | null;
  rating: number;
}

export interface TMDBReview {
  id: number;
  author: string;
  author_details: TMDBAuthor;
  content: string;
  created_at: string;
}
