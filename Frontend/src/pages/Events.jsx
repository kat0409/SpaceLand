// src/pages/Auth.jsx
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {motion} from "framer-motion";

//the following is almost entirely based on "Frontend/src/pages/Dining.jsx"
export default function Events() {
  let events = 
  [
    {
      eventName: "Starlight Festival",
      date: "Ocsadaa 15, 2024",
      image: "/assets/starlight-festival.jpg"
    },
    {
      eventName: "Space Race Marathon",
      date: "November 05, 2024",
      image: "/assets/space-race.jpg"
    },
    {
      eventName: "Starlight Festival",
      date: "Ocsadaa 15, 2024",
      image: "/assets/alien-night.jpg"
    }
  ];

  return (
    <>
      <Header />
      <section className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-24 px-6 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-8">
            🎊 Events at <span className="text-purple-400">Spaceland</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-12">
            During your spacefare, entitle yourselves to some of the most entertaining opportunities in the Milky Way.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {events.map((res, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/5 border border-gray-700 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl text-left"
              >
                <img
                  src={res.image}
                  alt={res.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{res.eventName}</h3>
                  <p className="text-sm text-gray-300">{res.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}