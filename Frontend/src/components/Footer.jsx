import GithubButton from './githubButton';

// src/components/Footer.jsx
export default function Footer() {
    return (
      <footer
        id="footer"
        className="bg-gradient-to-t from-black via-gray-900 to-black text-white py-10 px-6"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Column 1: Brand/Info */}
          <div>
            <h3 className="text-2xl font-bold mb-2">Spaceland 🚀</h3>
            <p className="text-sm text-gray-400">
              A cosmic rollercoaster experience like no other.
              Located in the heart of Houston, TX.
            </p>
          </div>
  
          {/* Column 2: Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Contact</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>Email: contact@spaceland.com</li>
              <li>Phone: (832) 555-SPACE</li>
              <li>Location: Houston, TX</li>
            </ul>
          </div>
  
          {/* Column 3: Social Links & Employee Login */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Follow Us</h4>
            <div className="flex gap-4 mb-4">
              <a href="#" className="hover:text-purple-400 transition duration-300">Facebook</a>
              <a href="#" className="hover:text-purple-400 transition duration-300">Twitter</a>
              <a href="#" className="hover:text-purple-400 transition duration-300">Instagram</a>
            </div>
  
            {/* Employee Login Button */}
            <a
              href="/employee-login"
              className="inline-block bg-gradient-to-r from-purple-600 to-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow hover:from-purple-700 hover:to-indigo-600 transition-all"
            >
              Employee Login
            </a>
            <a className="mb-4" href="https://github.com/kat0409/SpaceLand.git">
              <GithubButton />
            </a>
          </div>
        </div>
  
        {/* Bottom Credits */}
        <div className="mt-10 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Spaceland. All rights reserved.
        </div>
      </footer>
    );
  }