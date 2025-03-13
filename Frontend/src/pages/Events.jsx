// src/pages/Auth.jsx
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const handleToggle = () => setIsLogin(!isLogin);

  return (
    <>
      <Header />
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-6 py-20 text-white">
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-10 w-full max-w-md space-y-6">
          <h2 className="text-3xl font-bold text-center">
            {isLogin ? "🚀 Log In to Spaceland" : "🪐 Create Your Account"}
          </h2>

          {/* FORM */}
          <form className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block mb-1 text-sm">Full Name</label>
                <input
                  type="text"
                  placeholder="Jane Astro"
                  className="w-full px-4 py-2 rounded-lg bg-black/20 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            )}

            <div>
              <label className="block mb-1 text-sm">Email</label>
              <input
                type="email"
                placeholder="you@spacemail.com"
                className="w-full px-4 py-2 rounded-lg bg-black/20 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-lg bg-black/20 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 transition-all font-semibold py-2 rounded-lg shadow"
            >
              {isLogin ? "Log In" : "Sign Up"}
            </button>
          </form>

          {/* TOGGLE BUTTON */}
          <p className="text-sm text-center text-gray-300">
            {isLogin ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={handleToggle}
                  className="text-purple-400 hover:underline"
                >
                  Sign up here
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={handleToggle}
                  className="text-purple-400 hover:underline"
                >
                  Log in here
                </button>
              </>
            )}
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}