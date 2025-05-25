import { useEffect, useState } from "react";
import { TMDB } from "../../services/tmdb/api";
import type { Movie, TVShow } from "../../services/tmdb/models";
import Icons from "./Icons";

interface MediaPeekProps {
  mediaId: number;
  mediaType: string;
  pointerPosition: number;
}

function MediaPeek({ mediaId, mediaType, pointerPosition }: MediaPeekProps) {
  const tmdb = new TMDB();

  const [mediaData, setMediaData] = useState<Movie | TVShow | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getMediaFn =
    mediaType === "movie" ? tmdb.getMovieById : tmdb.getTVShowById;

  const getMedia = async () => {
    try {
      setLoading(true);
      setError(null);

      const mediaData = await getMediaFn(mediaId);
      setMediaData(mediaData);
    } catch (err) {
      console.error(err);
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMedia();
  }, []);

  if (loading)
    return (
      <>
        <div className="w-full h-64 flex items-center justify-center bg-white/10 animate-pulse"></div>
      </>
    );

  if (error)
    return (
      <>
        <center>
          <h3>Error: {JSON.stringify(error)}</h3>
        </center>
      </>
    );

  return (
    <div className="relative w-full animate-fade-in">
      {/* Triangle pointer with yellow border */}
      <div
        className="absolute w-12 h-12 bg-red-500 z-40"
        style={{ left: pointerPosition, transform: "translateX(-50%)" }}
      ></div>

      <div className="bg-gray-800 overflow-hidden shadow-2xl border-2 border-yellow-400">
        <div className="relative h-64 md:h-80">
          {/* Backdrop image */}
          <img
            src={mediaData?.getBackdropURL()}
            alt={mediaData?.title}
            className="w-full h-full object-cover"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="flex gap-6 p-6 w-full">
              {/* Info */}
              <div className="flex-1 text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-2">
                  {mediaData?.title}
                </h2>

                <p className="text-gray-300 text-sm md:text-base mb-6 line-clamp-3">
                  {mediaData?.overview}
                </p>

                <div className="flex items-center gap-4 mb-4 text-sm">
                  {/* Rating */}
                  {mediaData?.rating && (
                    <div>
                      <h3 className="font-semibold text-lg">
                        Rating{" "}
                        <span className="text-yellow-500 text-sm">
                          ({Math.round((mediaData.rating / 2) * 2) / 2})
                        </span>
                      </h3>
                      <div className="flex items-center gap-1 mt-2">
                        {Array.from({
                          length: 5,
                        }).map((_, index) => {
                          const starIndex = index + 1;
                          const fiveStarRating =
                            Math.round((mediaData.rating / 2) * 2) / 2;

                          if (fiveStarRating >= starIndex) {
                            return (
                              <Icons.StarFilled
                                className="w-5 h-5 fill-yellow-500"
                                key={index}
                              />
                            );
                          } else if (fiveStarRating >= starIndex - 0.5) {
                            return (
                              <Icons.StarHalfFilled
                                className="w-5 h-5 fill-yellow-500"
                                key={index}
                              />
                            );
                          } else {
                            return (
                              <Icons.Star
                                className="w-5 h-5 stroke-yellow-500"
                                key={index}
                              />
                            );
                          }
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  //   onClick={handleReadMore}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2"
                >
                  Read More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MediaPeek;
