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
        {/* 🌠 Bottom fade overlay */}
<div className="absolute bottom-0 w-full h-40 bg-gradient-to-b from-transparent to-black z-10 pointer-events-none" />
        

        {/* ✨ Optional: Particle animation overlay behind text */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          <div className="w-full h-full bg-[url('/assets/particles.png')] bg-repeat bg-cover opacity-10 animate-galaxy-particles" />
        </div>
      </div>

      {/* 🌌 Hero Content */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 items-center h-full px-6 md:px-12">
        <div className="text-white text-left space-y-6">
          <h1
            className="typewriter font-extrabold tracking-widest text-[70px] md:text-[90px] drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            Welcome<span className="typewriter-cursor">|</span>
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
            to="/purchase"
            className="mt-6 inline-block bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition animate-pulse-glow"
          >
            Buy Tickets
          </Link>
        </div>
      </div>
    </section>
  );
}