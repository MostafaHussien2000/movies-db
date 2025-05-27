import type { MediaType } from "../../types/tmdb";

function Tabs({
  tabs,
  currentTab,
  setCurrentTab,
}: {
  tabs: {
    id: MediaType;
    label: string;
  }[];
  currentTab: MediaType;
  setCurrentTab: (tab: MediaType) => void;
}) {
  return (
    <div className="flex gap-2 mb-6 border-b-2 border-gray-800">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setCurrentTab(tab.id)}
          className={`px-4 py-2 text-white ${
            tab.id === currentTab ? "border-b-2 border-yellow-500" : ""
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default Tabs;
