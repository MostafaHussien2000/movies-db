import type { MediaType, TMDBMediaItem } from "../../types/tmdb";
import { MAX_ITEMS, RECENT_SEARCHES_KEY, RECENT_VIEWS_KEY } from "./config";

export interface HistoryMediaItem extends TMDBMediaItem {
  type: MediaType;
}

function saveList(key: string, item: HistoryMediaItem) {
  const existingItems = localStorage.getItem(key);
  let list: HistoryMediaItem[] = [];

  if (existingItems) {
    list = JSON.parse(existingItems);
  }

  if (list.length >= 1) {
    list = list.filter(
      (i: HistoryMediaItem) => !(i.id === item.id && i.type === item.type)
    );
  }

  list.unshift(item);

  if (list.length > MAX_ITEMS) {
    list.pop();
  }

  localStorage.setItem(key, JSON.stringify(list));
}

function getList(key: string): HistoryMediaItem[] {
  const existingItems = localStorage.getItem(key);
  let list: HistoryMediaItem[] = [];

  if (existingItems) {
    list = JSON.parse(existingItems);
  }

  return list;
}

export const activityHistory = {
  saveSearch: (item: HistoryMediaItem) => saveList(RECENT_SEARCHES_KEY, item),
  getSearches: () => getList(RECENT_SEARCHES_KEY),

  saveViewed: (item: HistoryMediaItem) => saveList(RECENT_VIEWS_KEY, item),
  getViews: () => getList(RECENT_VIEWS_KEY),
};
