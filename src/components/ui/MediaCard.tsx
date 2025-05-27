import Icons from "./Icons";
import type { Movie, TVShow } from "../../services/tmdb/models";

type Props = { onClick: () => void; isSelected: boolean } & (
  | { type: "movie"; media: Movie }
  | { type: "tv"; media: TVShow }
);

function MediaCard({ media, onClick, isSelected = false }: Props) {
  return (
    <div
      onClick={onClick}
      className={"group cursor-pointer transform transition-all duration-300"}
    >
      <div
        className={`relative overflow-hidden bg-gray-800 shadow-lg ${
          isSelected ? "border-2 border-yellow-500" : ""
        }`}
      >
        <img
          src={media.getPosterURL()}
          alt={media.title}
          className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Rating badge */}
        <div className="absolute top-2 right-2 bg-black/80 rounded-full px-2 py-1 flex items-center space-x-1">
          <Icons.Star className="w-3 h-3 text-yellow-500 fill-current" />
          <span className="text-white text-xs font-medium">
            {media.rating.toFixed(1)}
          </span>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
            {media.title}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default MediaCard;
