import React from "react";
import MediaFeed from "../components/MediaFeed";

function Home() {
  return (
    <main className="min-h-screen bg-gray-950">
      <section className="container mx-auto">
        <MediaFeed mediaType="movie" />
      </section>
    </main>
  );
}

export default Home;
