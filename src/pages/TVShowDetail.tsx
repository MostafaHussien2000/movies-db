import { Link, useParams } from "react-router-dom";
import type { DetailedTVShow, TVShowSeason } from "../services/tmdb/models";
import { useEffect, useState } from "react";
import { TMDB } from "../services/tmdb/api";
import Icons from "../components/ui/Icons";
import { formatDateToShortString } from "../utlis/formatDateToShortString";
import ReviewsSection from "../components/ui/ReviewsSection";
import {
  activityHistory,
  type HistoryMediaItem,
} from "../services/activityHistory/activityHistory";

function TVShowDetail() {
  const { id } = useParams();

  const tmdb = new TMDB();

  const [tvShow, setTVShow] = useState<DetailedTVShow>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getTVShow = async () => {
    try {
      setLoading(true);
      setError(null);
      const tvShow = await tmdb.getTVShowById(Number(id));
      setTVShow(tvShow);

      const historyTVShow: HistoryMediaItem = {
        id: tvShow.id,
        title: tvShow.title,
        poster_path: tvShow.getPosterURL(),
        backdrop_path: tvShow.getBackdropURL(),
        overview: tvShow.overview,
        vote_average: tvShow.rating,
        type: "tv",
      };

      if (tvShow) {
        activityHistory.saveViewed(historyTVShow);
      }
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTVShow();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[510px]">
        <div className="flex flex-row gap-2">
          <div className="w-3 h-3 rounded-full bg-white animate-bounce"></div>
          <div className="w-3 h-3 rounded-full bg-white animate-bounce [animation-delay:-.3s]"></div>
          <div className="w-3 h-3 rounded-full bg-white animate-bounce [animation-delay:-.5s]"></div>
        </div>
      </div>
    );

  if (error || !tvShow)
    return (
      <center>
        <h3>Error: {JSON.stringify(error)}</h3>
      </center>
    );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative h-screen">
        <div className="relative min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] overflow-hidden">
          <img
            src={tvShow?.getBackdropURL("original")}
            alt={tvShow?.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-transparent to-black/40" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Link to="/" className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 cursor-pointer">
                <Icons.ArrowLeft />
              </div>
              Back to Browsing
            </Link>
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              {/* Poster */}
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <img
                  src={tvShow?.getPosterURL("w1280")}
                  alt={tvShow?.title}
                  width={200}
                  height={300}
                  className="shadow-2xl w-48 md:w-64 lg:w-72"
                />
              </div>

              {/* Movie Details */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  {tvShow?.title}
                </h1>

                <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Icons.StarFilled className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-semibold">
                      {tvShow?.rating.toFixed(1)}
                    </span>
                  </div>
                  {tvShow?.releasedAt && (
                    <div className="flex items-center gap-2">
                      <Icons.Calendar className="w-5 h-5" />
                      <span>{new Date(tvShow?.releasedAt).getFullYear()}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                  {tvShow?.genres.map((genre) => (
                    <span
                      className="bg-white/10 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm"
                      key={genre.id}
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <button className="bg-red-600 hover:bg-red-700 flex items-center gap-2 px-4 py-2 rounded">
                    <Icons.Play className="w-5 h-5 mr-2" />
                    Watch Trailer
                  </button>
                  <button className="border-white text-white hover:bg-white hover:text-gray-900 flex items-center gap-2 px-4 py-2 rounded">
                    <Icons.Heart className="w-5 h-5 mr-2" />
                    Add to Watchlist
                  </button>
                  <button className="border-white text-white hover:bg-white hover:text-gray-900 flex items-center gap-2 px-4 py-2 rounded">
                    <Icons.Share className="w-5 h-5 mr-2" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-4 text-yellow-500">
                About the Show
              </h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                {tvShow?.overview}
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Release Date</h3>
                  <p className="text-gray-300">
                    {formatDateToShortString(tvShow?.releasedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {tvShow?.seasons && (
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            <h2 className="text-2xl font-bold mb-4 text-yellow-500">Seasons</h2>

            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {tvShow?.seasons.map((season) => (
                <SeasonCard season={season} key={season.id} />
              ))}
            </div>
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <ReviewsSection id={tvShow?.id.toString()} mediaType="tv" />
        </div>
      </div>
    </div>
  );
}

export default TVShowDetail;

function SeasonCard({ season }: { season: TVShowSeason }) {
  return (
    <div
      className={"group cursor-pointer transform transition-all duration-300"}
    >
      <div className={`relative overflow-hidden bg-gray-800 shadow-lg `}>
        <img
          src={season.getPosterURL()}
          alt={season.name}
          className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
            {season.name}
          </h3>
        </div>
      </div>
    </div>
  );
}
