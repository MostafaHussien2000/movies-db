import Icons from "./ui/Icons";

function Navbar() {
  return (
    <header className="border-b border-gray-800 sticky top-0 z-50 mb-5">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-2 flex-col sm:flex-row">
          <h1 className="text-3xl font-bold text-white">
            Movies<span className="text-yellow-500">DB</span>
          </h1>
          <div className="flex items-center gap-4">
            <button className="flex justify-between items-center gap-5 border-b-2 border-b-foreground/20 text-gray-300 hover:border-yellow-500 py-2 px-4 sm:min-w-[220px]">
              <div className="flex justify-start items-center gap-2">
                <Icons.Search />
                <span className="opacity-50 text-sm">Search</span>
              </div>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-50">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
