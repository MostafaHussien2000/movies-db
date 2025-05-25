import MediaFeed from "./components/MediaFeed";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <MediaFeed mediaType="movie" />
    </>
  );
}

export default App;
