import { Link } from "react-router-dom";
import { DetailedMovie, type DetailedTVShow } from "../../services/tmdb/models";
import Icons from "./Icons";

interface MediaHeroProps {
  media: DetailedMovie | DetailedTVShow;
}

function MediaHero({ media }: MediaHeroProps) {
  return (
    <div className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={media.getBackdropURL("original")}
          alt={media.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 cursor-pointer">
              <Icons.ArrowLeft />
            </div>
            Back to Browsing
          </Link>
        </div>
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Movie Poster */}
          <div className="lg:col-span-3 flex justify-center lg:justify-start">
            <div className="relative group">
              <img
                src={media.getPosterURL("w1280")}
                alt={media.title}
                className="w-64 sm:w-80 lg:w-full max-w-sm rounded-lg shadow-2xl transition-transform duration-300"
              />
            </div>
          </div>

          {/* Movie Details */}
          <div className="lg:col-span-9 space-y-6 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight">
                {media.title}
              </h1>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-yellow-400">
                <div className="flex items-center gap-1">
                  <Icons.StarFilled className="w-5 h-5 fill-current" />
                  <span className="text-lg font-semibold">
                    {media.rating.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Icons.Calendar className="w-4 h-4" />
                  <span>{new Date(media.releasedAt).getFullYear()}</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                {media?.genres.map((genre) => (
                  <span
                    className="bg-white/10 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm"
                    key={genre.id}
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            {media instanceof DetailedMovie && media?.tagline && (
              <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">
                {media.tagline}
              </p>
            )}

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
  );
}

export default MediaHero;
