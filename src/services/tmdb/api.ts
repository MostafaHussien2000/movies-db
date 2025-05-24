import { Movie, Review, TVShow } from "./models";
import type { MediaType, TMDBMediaItem, TMDBReview } from "../../types/tmdb";
import { TMDB_API_KEY, BASE_URL } from "./config";

export class TMDB {
  private baseURL: string;
  private apiKey: string;

  private get requestOptions() {
    return {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
    };
  }

  constructor() {
    this.baseURL = BASE_URL;
    this.apiKey = TMDB_API_KEY;
  }

  /* Movies Methods
  ================= */

  async getMoviesList({
    page = 1,
    type = "now_playing",
  }: {
    page: number;
    type: "now_playing" | "popular" | "upcoming" | "top_rated";
  }): Promise<Movie[]> {
    try {
      const response = await fetch(
        `${this.baseURL}/discover/movie/${type}?page=${page}`,
        this.requestOptions
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data.");
      }

      const json = await response.json();

      return json.results.map((result: TMDBMediaItem) => new Movie(result));
    } catch (err) {
      const error = err as Error;
      throw new Error(error.message);
    }
  }

  async searchMovies(query: string): Promise<Movie[]> {
    try {
      const response = await fetch(
        `${this.baseURL}/search/movie?query=${query}&page=1`,
        this.requestOptions
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data.");
      }

      const json = await response.json();

      return json.results.map((result: TMDBMediaItem) => new Movie(result));
    } catch (err) {
      const error = err as Error;
      throw new Error(error.message);
    }
  }

  async getMovieById(id: number): Promise<Movie> {
    try {
      const response = await fetch(
        `${this.baseURL}/movie/${id}`,
        this.requestOptions
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data.");
      }

      const json = await response.json();

      return new Movie(json);
    } catch (err) {
      const error = err as Error;
      throw new Error(error.message);
    }
  }

  /* TV Shows Methods
  =================== */

  async getTvShowsList({
    page = 1,
    type = "popular",
  }: {
    page: number;
    type: "popular" | "top_rated";
  }): Promise<TVShow[]> {
    try {
      const response = await fetch(
        `${this.baseURL}/tv/${type}?page=${page}`,
        this.requestOptions
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data.");
      }

      const json = await response.json();

      return json.results.map((result: TMDBMediaItem) => new TVShow(result));
    } catch (err) {
      const error = err as Error;
      throw new Error(error.message);
    }
  }

  async searchTVShows(query: string): Promise<TVShow[]> {
    try {
      const response = await fetch(
        `${this.baseURL}/search/tv?query=${query}`,
        this.requestOptions
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data.");
      }

      const json = await response.json();

      return json.results.map((result: TMDBMediaItem) => new TVShow(result));
    } catch (err) {
      const error = err as Error;
      throw new Error(error.message);
    }
  }

  async getTVShowById(id: number): Promise<TVShow> {
    try {
      const response = await fetch(
        `${this.baseURL}/tv/${id}?`,
        this.requestOptions
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data.");
      }

      const json = await response.json();

      return new TVShow(json);
    } catch (err) {
      const error = err as Error;
      throw new Error(error.message);
    }
  }

  /* Reviews for TV Shows/ Movies
  =============================== */

  async getReviews({
    id,
    mediaType,
  }: {
    id: number;
    mediaType: MediaType;
  }): Promise<Review[]> {
    try {
      const response = await fetch(
        `${this.baseURL}/${mediaType}/${id}/reviews?language=en-US&page=1`,
        this.requestOptions
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data.");
      }

      const json = await response.json();

      return json.results.map((result: TMDBReview) => new Review(result));
    } catch (err) {
      const error = err as Error;
      throw new Error(error.message);
    }
  }
}
