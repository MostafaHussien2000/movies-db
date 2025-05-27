import React, { useEffect, useState } from "react";
import type { MediaType, TMDBCastMember } from "../../types/tmdb";
import { TMDB } from "../../services/tmdb/api";

function CastSection({ id, mediaType }: { id: string; mediaType: MediaType }) {
  const [actors, setActors] = useState<TMDBCastMember[]>([]);
  const [loadingActors, setLoadingActors] = useState<boolean>(false);
  const [errorActors, setErrorActors] = useState<string | null>("");

  const [directors, setDirectors] = useState<TMDBCastMember[]>([]);
  const [loadingDirectors, setLoadingDirectors] = useState<boolean>(false);
  const [errorDirectors, setErrorDirectors] = useState<string | null>("");

  const tmdb = new TMDB();

  const getCast = async () => {
    try {
      setLoadingActors(true);
      setErrorActors(null);

      const cast = await tmdb.getCast({ id: Number(id), mediaType });

      setActors(
        cast.filter(
          (castMember) => castMember.known_for_department === "Acting"
        )
      );
      setDirectors(
        cast.filter(
          (castMember) => castMember.known_for_department === "Directing"
        )
      );

      console.log(cast);
    } catch (err) {
      setErrorActors(err as string);
    } finally {
      setLoadingActors(false);
    }
  };

  useEffect(() => {
    getCast();
  }, []);

  return (
    <>
      <div>
        <h2 className="text-2xl font-bold mb-4 text-yellow-500">Cast</h2>
        {loadingActors ? (
          <div className="flex justify-center items-center h-[510px]">
            <div className="flex flex-row gap-2">
              <div className="w-3 h-3 rounded-full bg-white animate-bounce"></div>
              <div className="w-3 h-3 rounded-full bg-white animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-3 h-3 rounded-full bg-white animate-bounce [animation-delay:-.5s]"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {actors.map((actor) => (
                <div
                  key={actor.id}
                  className={
                    "group cursor-pointer transform transition-all duration-300"
                  }
                >
                  <div
                    className={`relative overflow-hidden bg-gray-800 shadow-lg`}
                  >
                    <img
                      src={
                        actor.profile_path
                          ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                          : "https://th.bing.com/th/id/OIP.2TJevDgL7cwFGy8ZtIOpbAHaHa?cb=iwp2&w=545&h=545&rs=1&pid=ImgDetMain"
                      }
                      alt={actor.name}
                      className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                        {actor.name}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default CastSection;
