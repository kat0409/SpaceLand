// src/components/Hero.jsx
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* 🔭 Galaxy Video Background */}
      <div className="absolute inset-0 w-full h-full z-[-1]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/assets/galaxy.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* 🌠 Refined LEFT-TO-RIGHT Fade overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, black 0%, rgba(0, 0, 0, 0.7) 25%, rgba(0, 0, 0, 0.3) 40%, rgba(0, 0, 0, 0) 60%)',
            backdropFilter: 'blur(1.5px)',
          }}
        />
      </div>

      {/* 🌌 Hero Content */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center h-full px-6 md:px-12">
        <div className="text-white text-left space-y-6">
          <h1
            className="text-[70px] md:text-[90px] font-extrabold tracking-widest drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            Welcome
          </h1>
          <p
            className="text-lg md:text-xl max-w-xl text-gray-200"
            style={{
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 600,
            }}
          >
            Houston’s ultimate space-themed rollercoaster adventure awaits.
          </p>
          <Link
            to="/rides"
            className="inline-block bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition"
          >
            Explore Rides
          </Link>
        </div>
      </div>
    </section>
  );
}