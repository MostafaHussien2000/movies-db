import { useEffect, useState } from "react";
import type { MediaType } from "../../types/tmdb";
import type { Review } from "../../services/tmdb/models";
import { TMDB } from "../../services/tmdb/api";
import ReactMarkdown from "react-markdown";

interface ReviewsSectionProps {
  id: string;
  mediaType: MediaType;
}

function ReviewsSection({ id, mediaType }: ReviewsSectionProps) {
  const tmdb = new TMDB();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const reviews = await tmdb.getReviews({ id: Number(id), mediaType });
      setReviews(reviews);
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReviews();
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

  if (error)
    return (
      <center>
        <h3>Error: {JSON.stringify(error)}</h3>
      </center>
    );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-yellow-500">Reviews</h2>
      <div className="grid grid-cols-1 gap-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-background/10 backdrop-blur-sm rounded-lg p-4"
            >
              <div className="flex items-center gap-4 p-2 rounded-lg">
                <div className="bg-white/50 rounded-full w-12 h-12">
                  {review.getAvatarURL() && (
                    <img
                      src={review.getAvatarURL()}
                      alt={review.getAuthor().name}
                      className="rounded-full w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-white">
                    {review.getAuthor().name || "Anonymous"}
                  </p>
                  {/* username */}
                  <p className="text-xs text-gray-300">
                    @{review.getAuthor().username || "anonymous"}
                  </p>
                </div>
              </div>
              <div className="text-md">
                {<ReactMarkdown>{review.content}</ReactMarkdown>}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center my-8 text-white/40">No reviews found</p>
        )}
      </div>
    </div>
  );
}

export default ReviewsSection;
