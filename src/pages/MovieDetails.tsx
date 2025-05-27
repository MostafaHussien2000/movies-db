import { useParams } from "react-router-dom";
import { TMDB } from "../services/tmdb/api";
import type { DetailedMovie } from "../services/tmdb/models";
import { useEffect, useState } from "react";
import { formatDateToShortString } from "../utlis/formatDateToShortString";
import ReviewsSection from "../components/ui/ReviewsSection";
import {
  activityHistory,
  type HistoryMediaItem,
} from "../services/activityHistory/activityHistory";
import CastSection from "../components/ui/CastSection";
import MediaHero from "../components/ui/MediaHero";

function MovieDetails() {
  const { id } = useParams();

  const [movie, setMovie] = useState<DetailedMovie>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tmdb = new TMDB();

  const getMovie = async () => {
    try {
      setLoading(true);
      setError(null);
      const movie = await tmdb.getMovieById(Number(id));
      setMovie(movie);

      const historyMovie: HistoryMediaItem = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster,
        backdrop_path: movie.backdrop,
        overview: movie.overview,
        vote_average: movie.rating,
        type: "movie",
      };

      if (movie) {
        activityHistory.saveViewed(historyMovie);
      }
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovie();
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

  if (error || !movie)
    return (
      <center>
        <h3>Error: {JSON.stringify(error)}</h3>
      </center>
    );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <MediaHero media={movie} />

      <div className="relative h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-4 text-yellow-500">
                About the Movie
              </h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                {movie.overview}
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Release Date</h3>
                  <p className="text-gray-300">
                    {formatDateToShortString(movie.releasedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <CastSection id={movie.id.toString()} mediaType="movie" />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <ReviewsSection id={movie.id.toString()} mediaType="movie" />
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
