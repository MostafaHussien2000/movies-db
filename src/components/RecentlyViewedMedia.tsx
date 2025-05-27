import React, { useEffect, useState } from "react";
import {
  activityHistory,
  type HistoryMediaItem,
} from "../services/activityHistory/activityHistory";
import MediaCard from "./ui/MediaCard";
import { Movie, TVShow } from "../services/tmdb/models";
import { useNavigate } from "react-router-dom";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const settings = {
  dots: true,
  infinite: false,
  accessibility: true,
  speed: 500,
  slidesToShow: 6,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 425,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

function RecentlyViewedMedia() {
  const [mediaItems, setMediaItems] = useState<HistoryMediaItem[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const items = activityHistory.getViews();
    setMediaItems(items || []);
  }, []);

  if (mediaItems.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto p-2">
      <h2 className="text-2xl font-bold mb-4">Recently Viewed</h2>
      <div className="m-w-full p-2">
        <Slider {...settings}>
          {mediaItems.map((item) => (
            <MediaCard
              key={item.id}
              media={item.type === "movie" ? new Movie(item) : new TVShow(item)}
              onClick={() => navigate(`/${item.type}/${item.id}`)}
              isSelected={false}
              type={item.type}
            />
          ))}
        </Slider>
      </div>
    </section>
  );
}

export default RecentlyViewedMedia;
