import { useParams } from "react-router-dom";
import type { DetailedTVShow, TVShowSeason } from "../services/tmdb/models";
import { useEffect, useState } from "react";
import { TMDB } from "../services/tmdb/api";
import { formatDateToShortString } from "../utlis/formatDateToShortString";
import ReviewsSection from "../components/ui/ReviewsSection";
import {
  activityHistory,
  type HistoryMediaItem,
} from "../services/activityHistory/activityHistory";
import MediaHero from "../components/ui/MediaHero";
import CastSection from "../components/ui/CastSection";

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
        <MediaHero media={tvShow} />

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
          <CastSection id={tvShow?.id.toString()} mediaType="tv" />
        </div>

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
          src={
            season.poster_path
              ? season.getPosterURL()
              : "https://images.squarespace-cdn.com/content/v1/5d2a68ad50252200016f4384/1eb6d3ea-7973-4b99-9365-034b290cb888/no+cover.jpg"
          }
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
