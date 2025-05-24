import type {
  MediaType,
  TMDBAuthor,
  TMDBMediaItem,
  TMDBReview,
} from "../../types/tmdb";
import { IMAGE_BASE_URL } from "./config";

type ImageSize = "w500" | "w780" | "w1280" | "original";

/* Models
========= */
// Media Models
abstract class MediaItem {
  id: number;
  title: string;
  overview: string;
  poster: string | null;
  backdrop: string | null;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  rating: number;

  constructor(data: TMDBMediaItem) {
    this.id = data.id;
    this.title = data.title || data.name || "Untitled";
    this.overview = data.overview;
    this.poster = data.poster_path;
    this.backdrop = data.backdrop_path;
    this.genre_ids = data.genre_ids;
    this.genres = data.genres;
    this.rating = data.vote_average;
  }

  getPosterURL(size: ImageSize = "w500"): string {
    return `${IMAGE_BASE_URL}/${size}/${this.poster}`;
  }

  getBackdropURL(size: ImageSize = "w500"): string {
    return `${IMAGE_BASE_URL}/${size}/${this.backdrop}`;
  }

  abstract getMediaType(): MediaType;
}

export class Movie extends MediaItem {
  constructor(data: TMDBMediaItem) {
    super(data);
  }

  getMediaType(): MediaType {
    return "movie";
  }
}

export class TVShow extends MediaItem {
  constructor(data: TMDBMediaItem) {
    super(data);
  }

  getMediaType(): MediaType {
    return "tv";
  }
}

// Review Models
export class Review {
  id: number;
  content: string;
  created_at: string;
  author_details: TMDBAuthor;

  constructor(data: TMDBReview) {
    this.id = data.id;
    this.content = data.content;
    this.created_at = data.created_at;
    this.author_details = data.author_details;
  }

  getAuthor(): TMDBAuthor {
    return {
      name: this.author_details.name,
      username: this.author_details.username,
      avatar_path: this.author_details.avatar_path,
      rating: this.author_details.rating,
    };
  }

  getRating(): number {
    return this.author_details.rating;
  }
}
