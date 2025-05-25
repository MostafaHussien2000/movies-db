import { useEffect } from "react";

import { TMDB } from "../services/tmdb/api";

function MediaFeed({ mediaType }: { mediaType: "movie" | "tv" }) {
  const tmdb = new TMDB();

  useEffect(() => {
    getFeedItems({ page: 1, type: "popular" })
      .then((items) => console.log(items))
      .catch((err) => console.error(err));
  }, []);

  const getFeedItems =
    mediaType === "movie" ? tmdb.getMoviesList : tmdb.getTvShowsList;

  return (
    <div>
      <h1>Hey</h1>
    </div>
  );
}

export default MediaFeed;
