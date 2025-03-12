import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Hero() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.25; // ⬅️ slower: try 0.25, 0.5, 0.75 etc
    }
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Galaxy Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
      >
        <source src="/assets/galaxy.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Gradient Overlay for Fade Effect */}
      <div className="absolute bottom-0 w-full h-64 bg-gradient-to-b from-transparent to-black z-0 pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Welcome to <span className="text-purple-400">Spaceland</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-200 max-w-2xl">
          Houston’s ultimate space-themed rollercoaster adventure awaits.
        </p>
        <Link
          to="/rides"
          className="mt-8 bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition"
        >
          Explore Rides
        </Link>
      </div>
    </section>
  );
}