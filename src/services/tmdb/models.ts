import type {
  MediaType,
  TMDBAuthor,
  TMDBMediaItem,
  TMDBMovie,
  TMDBReview,
  TMDBTVShow,
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
  genres: { id: number; name: string }[];
  rating: number;

  constructor(data: TMDBMediaItem) {
    this.id = data.id;
    this.title = data.title || data.name || "Untitled";
    this.overview = data.overview;
    this.poster = data.poster_path;
    this.backdrop = data.backdrop_path;
    this.genres = data.genres || [];
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

export class DetailedMovie extends Movie {
  releasedAt: string;
  collection?: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  };
  languages: { english_name: string; iso_639_1: string; name: string }[];
  tagline: string;
  productionCompanies: {
    id: number;
    logo_path: string | null;
    name: string;
  }[];

  constructor(data: TMDBMovie) {
    super(data);
    this.releasedAt = data.release_date;
    this.collection = data.belongs_to_collection;
    this.languages = data.spoken_languages;
    this.tagline = data.tagline;
    this.productionCompanies = data.production_companies;
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

export class DetailedTVShow extends TVShow {
  releasedAt: string;
  productionCompanies: { id: number; name: string; logo_path: string | null }[];
  seasons: { name: string; poster_path: string | null; id: number }[];

  constructor(data: TMDBTVShow) {
    super(data);
    this.releasedAt = data.first_air_date;
    this.productionCompanies = data.production_companies;
    this.seasons = data.seasons;
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
