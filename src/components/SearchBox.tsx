import { useEffect, useState } from "react";
import Icons from "./ui/Icons";
import type { MediaType } from "../types/tmdb";
import { Movie, TVShow } from "../services/tmdb/models";
import { TMDB } from "../services/tmdb/api";
import { Link } from "react-router-dom";

interface SearchBoxProps {
  isOpen: boolean;
  close: () => void;
}

const tabs = [
  { id: "movie", name: "Movies", icon: Icons.Film },
  { id: "tv", name: "TV Shows", icon: Icons.TV },
];

function SearchBox({ isOpen, close }: SearchBoxProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<MediaType>("movie");

  const [results, setResults] = useState<
    MediaType extends "movie" ? Movie[] : TVShow[]
  >([]);

  const onClose = () => {
    setSearchQuery("");
    close();
  };

  const tmdb = new TMDB();

  const searchFn =
    activeTab === "movie" ? tmdb.searchMovies : tmdb.searchTVShows;

  const search = async () => {
    if (searchQuery.trim().length < 3) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await searchFn({ query: searchQuery, page: 1 });
      setResults(response);
    } catch (err) {
      console.error(err);
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  // Use debouncing

  useEffect(() => {
    setResults([]);

    const timer = setTimeout(() => {
      search();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, activeTab]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-background bg-opacity-70 backdrop-blur-sm flex items-start justify-center pt-20 z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0A0A0A] rounded-lg shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center px-4 py-3 border-b border-white/10">
          <Icons.Search size={20} className="text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="What are you looking for?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-md outline-none text-white placeholder-foreground/30 bg-inherit"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-red-500/10 rounded-md transition-colors"
          >
            <Icons.X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center px-4 border-b border-white/10 space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as MediaType)}
              className={`flex items-center space-x-2 px-3 py-3 text-sm transition-colors ${
                activeTab === tab.id ? "border-b-2 border-yellow-500" : ""
              }`}
            >
              {tab.icon && <tab.icon size={16} color="white" />}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="p-4">
          {searchQuery.length < 3 ? (
            <center>
              <p className="text-gray-400 text-sm">
                Please enter at least 3 characters
              </p>
            </center>
          ) : loading ? (
            <div className="flex justify-center items-center h-[210px]">
              <div className="flex flex-row gap-2">
                <div className="w-3 h-3 rounded-full bg-white animate-bounce"></div>
                <div className="w-3 h-3 rounded-full bg-white animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-3 h-3 rounded-full bg-white animate-bounce [animation-delay:-.5s]"></div>
              </div>
            </div>
          ) : error ? (
            <center>
              <p className="text-gray-400 text-sm">Error: {error}</p>
            </center>
          ) : results.length > 0 ? (
            <div className="space-y-1 max-h-[490px] overflow-y-scroll">
              {results.map((item) => (
                <Link
                  to={`/${activeTab}/${item.id}`}
                  key={item.id}
                  onClick={onClose}
                >
                  <SearchResult item={item} />
                </Link>
              ))}
            </div>
          ) : (
            <center>
              <p className="text-gray-400 text-sm">No results found</p>
            </center>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchBox;

function SearchResult({ item }: { item: Movie | TVShow }) {
  const MOVIE_POSTER_PLACEHOLDER =
    "https://incakoala.github.io/top9movie/film-poster-placeholder.png";
  return (
    <div className="flex items-center justify-between p-3 hover:bg-white/10 cursor-pointer group border-b border-white/10">
      <div className="flex items-center space-x-3">
        <div className="rounded-md bg-white/15 transition-colors w-10 aspect-[9/16]">
          <img
            loading="lazy"
            src={item.getPosterURL() || MOVIE_POSTER_PLACEHOLDER}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <div className="font-medium text-sm text-white">{item.title}</div>
        </div>
      </div>
      <Icons.ArrowRight
        size={20}
        color="white"
        className="opacity-0 group-hover:opacity-100 duration-300"
      />
    </div>
  );
}
