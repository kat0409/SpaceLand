export default function Hero() {
    return (
      <section className="h-screen flex flex-col items-center justify-center bg-black text-white text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Spaceland</h2>
        <p className="text-lg text-gray-300 mb-6">
          Houston’s ultimate space-themed rollercoaster adventure awaits.
        </p>
        <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 transition rounded-lg font-semibold">
          Explore Rides
        </button>
      </section>
    );
  }