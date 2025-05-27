import { useEffect, useRef, useState } from "react";
import MediaFeed from "../components/MediaFeed";
import { TMDB } from "../services/tmdb/api";
import type { MediaType } from "../types/tmdb";
import type { Movie, TVShow } from "../services/tmdb/models";
import Tabs from "../components/ui/Tabs";
import RecentlyViewedMedia from "../components/RecentlyViewedMedia";

function Home() {
  const tmdb = new TMDB();

  const [currentMediaTab, setCurrentMediaTab] = useState<MediaType>("movie");

  const [mediaItems, setMediaItems] = useState<Array<Movie | TVShow>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const isFetching = useRef(false);

  const getFeedItems = async () => {
    if (isFetching.current) return;

    // Resetting the state
    setLoading(true);
    setError(null);
    isFetching.current = true;

    try {
      const items = await (currentMediaTab === "movie"
        ? tmdb.getMoviesList
        : tmdb.getTvShowsList)({ page, type: "popular" });

      setMediaItems((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const uniqueItems = items.filter((item) => !existingIds.has(item.id));
        return [...prev, ...uniqueItems];
      });

      if (items.length < 20 || page === 499) {
        setHasMore(false);
      }
    } catch (err) {
      setError("Failed to load content.");
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  const handleScrollTrigger = () => {
    if (
      hasMore &&
      !loading &&
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500
    ) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScrollTrigger);
    return () => {
      window.removeEventListener("scroll", handleScrollTrigger);
    };
  }, [hasMore, loading]);

  useEffect(() => {
    if (!hasMore) return;
    getFeedItems();
  }, [page]);

  useEffect(() => {
    setMediaItems([]);
    setPage(1);
    setHasMore(true);
  }, [currentMediaTab]);

  const tabs: {
    id: MediaType;
    label: string;
  }[] = [
    { id: "movie", label: "Movies" },
    { id: "tv", label: "TV Shows" },
  ];

  return (
    <main className="min-h-screen py-6">
      <RecentlyViewedMedia />

      <section className="container mx-auto p-2">
        <Tabs
          tabs={tabs}
          currentTab={currentMediaTab}
          setCurrentTab={(tab) => {
            setCurrentMediaTab(tab);
            setMediaItems([]);
            setPage(1);
            setHasMore(true);
          }}
        />
        {page === 1 && loading ? (
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
        {hasMore && (
          <div className="container mx-auto p-2 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="w-full h-64 flex items-center justify-center bg-white/10 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Home;
