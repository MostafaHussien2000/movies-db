import { useEffect, useState } from "react";
import MediaFeed from "../components/MediaFeed";
import { TMDB } from "../services/tmdb/api";
import type { MediaType } from "../types/tmdb";
import type { Movie, TVShow } from "../services/tmdb/models";
import Tabs from "../components/ui/Tabs";

function Home() {
  const tmdb = new TMDB();

  const [currentMediaTab, setCurrentMediaTab] = useState<MediaType>("movie");

  const [mediaItems, setMediaItems] = useState<Array<Movie | TVShow>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getFeedItems();
  }, [currentMediaTab]);

  const getFeedItems = async () => {
    // Resetting the state
    setLoading(true);
    setError(null);
    setMediaItems([]);

    try {
      const items = await (currentMediaTab === "movie"
        ? tmdb.getMoviesList
        : tmdb.getTvShowsList)({ page: 1, type: "popular" });
      setMediaItems(items);
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  const tabs: {
    id: MediaType;
    label: string;
  }[] = [
    { id: "movie", label: "Movies" },
    { id: "tv", label: "TV Shows" },
  ];

  return (
    <main className="min-h-screen py-6">
      <section className="container mx-auto p-2">
        <Tabs
          tabs={tabs}
          currentTab={currentMediaTab}
          setCurrentTab={setCurrentMediaTab}
        />
        {loading ? (
          <div className="container mx-auto p-2 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="w-full h-64 flex items-center justify-center bg-white/10 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        ) : error ? (
          <center>
            <h3>Error: {JSON.stringify(error)}</h3>
          </center>
        ) : (
          mediaItems.length > 0 && (
            <MediaFeed mediaItems={mediaItems} mediaType={currentMediaTab} />
          )
        )}
      </section>
    </main>
  );
}

export default Home;
