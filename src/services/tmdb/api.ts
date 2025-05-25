import { Movie, Review, TVShow } from "./models";
import type { MediaType, TMDBMediaItem, TMDBReview } from "../../types/tmdb";
import { TMDB_API_KEY, BASE_URL } from "./config";

export class TMDB {
  private baseURL: string;
  private apiKey: string;

  private get requestOptions(): RequestInit {
    return {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
    };
  }

  constructor() {
    if (!BASE_URL || !TMDB_API_KEY) {
      throw new Error("Missing required environment variables.");
    }

    this.baseURL = BASE_URL;
    this.apiKey = TMDB_API_KEY;
  }

  /* Movies Methods
  ================= */

  getMoviesList = async ({
    page = 1,
    type = "now_playing",
  }: {
    page: number;
    type: "now_playing" | "popular" | "upcoming" | "top_rated";
  }): Promise<Movie[]> => {
    const url = new URL(`${this.baseURL}/movie/${type}`);
    url.searchParams.set("language", "en-US");
    url.searchParams.set("page", page.toString());

    try {
      const response = await fetch(url.toString(), this.requestOptions);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Failed to fetch movies: ${response.status} - ${errorBody}`
        );
      }

      const json = await response.json();

      return json.results.map((result: TMDBMediaItem) => new Movie(result));
    } catch (err) {
      throw err;
    }
  };

  searchMovies = async ({
    query,
    page = 1,
  }: {
    query: string;
    page: number;
  }): Promise<Movie[]> => {
    try {
      const url = new URL(`${this.baseURL}/search/movie`);
      url.searchParams.set("language", "en-US");
      url.searchParams.set("query", query);
      url.searchParams.set("page", page.toString());

      const response = await fetch(url.toString(), this.requestOptions);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Failed to search movie: ${response.status} - ${errorBody}`
        );
      }

      const json = await response.json();

      return json.results.map((result: TMDBMediaItem) => new Movie(result));
    } catch (err) {
      throw err;
    }
  };

  getMovieById = async (id: number): Promise<Movie> => {
    try {
      const url = new URL(`${this.baseURL}/movie/${id.toString()}`);
      url.searchParams.set("language", "en-US");

      const response = await fetch(url.toString(), this.requestOptions);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Failed to fetch movie: ${response.status} - ${errorBody}`
        );
      }

      const json = await response.json();

      return new Movie(json);
    } catch (err) {
      throw err;
    }
  };

  /* TV Shows Methods
  =================== */

  getTvShowsList = async ({
    page = 1,
    type = "popular",
  }: {
    page: number;
    type: "popular" | "top_rated";
  }): Promise<TVShow[]> => {
    try {
      const url = new URL(`${this.baseURL}/tv/${type}`);
      url.searchParams.set("language", "en-US");
      url.searchParams.set("page", page.toString());

      const response = await fetch(url.toString(), this.requestOptions);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Failed to fetch tv shows: ${response.status} - ${errorBody}`
        );
      }

      const json = await response.json();

      return json.results.map((result: TMDBMediaItem) => new TVShow(result));
    } catch (err) {
      throw err;
    }
  };

  searchTVShows = async ({
    query,
    page = 1,
  }: {
    query: string;
    page: number;
  }): Promise<TVShow[]> => {
    try {
      const url = new URL(`${this.baseURL}/search/tv`);
      url.searchParams.set("language", "en-US");
      url.searchParams.set("query", query);
      url.searchParams.set("page", page.toString());

      const response = await fetch(url.toString(), this.requestOptions);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Failed to search tv shows: ${response.status} - ${errorBody}`
        );
      }

      const json = await response.json();

      return json.results.map((result: TMDBMediaItem) => new TVShow(result));
    } catch (err) {
      throw err;
    }
  };

  getTVShowById = async (id: number): Promise<TVShow> => {
    try {
      const url = new URL(`${this.baseURL}/tv/${id.toString()}`);
      url.searchParams.set("language", "en-US");

      const response = await fetch(url.toString(), this.requestOptions);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Failed to fetch tv show: ${response.status} - ${errorBody}`
        );
      }

      const json = await response.json();

      return new TVShow(json);
    } catch (err) {
      throw err;
    }
  };

  /* Reviews for TV Shows/ Movies
  =============================== */

  getReviews = async ({
    id,
    mediaType,
  }: {
    id: number;
    mediaType: MediaType;
  }): Promise<Review[]> => {
    try {
      const url = new URL(
        `${this.baseURL}/${mediaType}/${id.toString()}/reviews`
      );
      url.searchParams.set("language", "en-US");

      const response = await fetch(url.toString(), this.requestOptions);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Failed to fetch reviews: ${response.status} - ${errorBody}`
        );
      }

      const json = await response.json();

      return json.results.map((result: TMDBReview) => new Review(result));
    } catch (err) {
      throw err;
    }
  };
}
