import { useEffect } from "react";

import { TMDB } from "../services/tmdb/api";

import { useState } from "react";

import type { Movie, TVShow } from "../services/tmdb/models";
import MediaCard from "./ui/MediaCard";

function MediaFeed({ mediaType }: { mediaType: "movie" | "tv" }) {
  const tmdb = new TMDB();

  const [mediaItems, setMediaItems] = useState<Array<Movie | TVShow>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getFeedItems();
  }, []);

  const getFeedItems = async () => {
    // Resetting the state
    setLoading(true);
    setError(null);
    setMediaItems([]);

    try {
      const items = await (mediaType === "movie"
        ? tmdb.getMoviesList
        : tmdb.getTvShowsList)({ page: 1, type: "popular" });
      setMediaItems(items);
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-800 h-80 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">Something went wrong</p>
        <p className="text-danger text-lg">{error}</p>
      </div>
    );
  }

  if (mediaItems?.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No items to display here.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {mediaItems.map((item) => (
          <MediaCard media={item} type={item.getMediaType()} key={item.id} />
        ))}
      </div>
    </>
  );
}

export default MediaFeed;
