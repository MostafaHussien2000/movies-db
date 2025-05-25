import { useEffect, useRef, type JSX } from "react";

import { TMDB } from "../services/tmdb/api";

import { useState } from "react";

import type { Movie, TVShow } from "../services/tmdb/models";

import MediaCard from "./ui/MediaCard";
import MediaPeek from "./ui/MediaPeek";

import type { MediaType } from "../types/tmdb";

interface MediaFeedProps {
  mediaType: MediaType;
  mediaItems: (Movie | TVShow)[];
}

function MediaFeed({ mediaType, mediaItems }: MediaFeedProps) {
  /* Steps to achieve good peek-component behavior:
    -----------------------------------------------
    1. Calculate which row the where the media item should be in.
    2. Define all the media items in the same row.
    3. Handle the product click event (if the active product is clicked, the peek-component should disappear.).
    4. Find the index where we should insert the peek-component.
    5. Render the media items' cards.
    6. Insert the peek-component after the last element in the row.
    7. Reset selected card when resizing the screen. 
    */

  const [selectedMediaItem, setSelectedMediaItem] = useState<
    Movie | TVShow | null
  >(null);
  const [pointerPosition, setPointerPosition] = useState<number>(0);

  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const gridRef = useRef<HTMLDivElement | null>(null);

  const calculateRowIndex = (cardIndex: number): number => {
    if (!gridRef.current) return 0;

    const computedStyle = window.getComputedStyle(gridRef.current);
    const colunmsString = computedStyle.getPropertyValue(
      "grid-template-columns"
    );
    const columnsCount = colunmsString.split(" ").length;

    return Math.floor(cardIndex / columnsCount);
  };

  const getMediaItemsInSameRow = (rowIndex: number): number[] => {
    if (!gridRef.current) return [];

    const computedStyle = window.getComputedStyle(gridRef.current);
    const columnsString = computedStyle.getPropertyValue(
      "grid-template-columns"
    );
    const columnsCount = columnsString.split(" ").length;

    const productsInRow = [];
    const startIndex = rowIndex * columnsCount;
    const endIndex = Math.min(startIndex + columnsCount, mediaItems.length);

    for (let i = startIndex; i < endIndex; i++) {
      productsInRow.push(i);
    }

    return productsInRow;
  };

  const handleMediaCardClick = (mediaItem: Movie | TVShow, index: number) => {
    if (selectedMediaItem && selectedMediaItem.id === mediaItem.id) {
      setSelectedMediaItem(null);
      return;
    }

    setSelectedMediaItem(mediaItem);

    const mediaCardElement = cardsRef.current[index];

    if (mediaCardElement && gridRef.current) {
      const mediaCardRect = mediaCardElement.getBoundingClientRect();
      const gridRect = gridRef.current.getBoundingClientRect();

      const relativePointerX =
        mediaCardRect.left - gridRect.left + (mediaCardRect.width / 2) * 100;

      setPointerPosition(relativePointerX);
    }
  };

  const getPeekComponentInsertIndex = (): number | null => {
    if (!selectedMediaItem) return null;

    const selectedMediaItemIndex = mediaItems.findIndex(
      (i) => i.id === selectedMediaItem.id
    );

    if (selectedMediaItemIndex === -1) return null;

    const rowIndex = calculateRowIndex(selectedMediaItemIndex);
    const mediaItemsInSameRow = getMediaItemsInSameRow(rowIndex);

    const peekComponentInsertIndex =
      mediaItemsInSameRow[mediaItemsInSameRow.length - 1];

    return peekComponentInsertIndex;
  };

  const renderMediaItemsCards = () => {
    const cards: JSX.Element[] = [];
    const peekComponentIndex = getPeekComponentInsertIndex();

    mediaItems.forEach((item, index) => {
      cards.push(
        <div
          key={item.id}
          ref={(i) => {
            cardsRef.current[index] = i;
          }}
        >
          <MediaCard
            media={item}
            type={mediaType}
            isSelected={selectedMediaItem?.id === item.id}
            onClick={() => handleMediaCardClick(item, index)}
          />
        </div>
      );

      if (selectedMediaItem && peekComponentIndex === index) {
        cards.push(
          <div key={`peek-${selectedMediaItem.id}`} className="col-span-full">
            <MediaPeek
              mediaId={selectedMediaItem.id}
              mediaType={selectedMediaItem.getMediaType()}
              pointerPosition={pointerPosition}
            />
          </div>
        );
      }
    });

    return cards;
  };

  useEffect(() => {
    const handleViewPortResize = () => {
      setSelectedMediaItem(null);
    };

    window.addEventListener("resize", handleViewPortResize);

    return () => {
      window.removeEventListener("resize", handleViewPortResize);
    };
  }, []);

  return (
    <>
      <h1>{selectedMediaItem?.title}</h1>
      <div
        ref={gridRef}
        className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
      >
        {renderMediaItemsCards()}
      </div>
    </>
  );
}

export default MediaFeed;
