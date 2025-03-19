import React from "react"
import { Link } from "react-router-dom"
import { Heart } from "lucide-react"

const Navbar = () => {
  return (
    <nav className="bg-black bg-opacity-90 shadow-lg sticky top-0 z-50 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-end h-16">
          {/* Favorites link - always visible on both mobile and desktop */}
          <Link
            to="/favorites"
            className="flex items-center space-x-2 text-gray-300 hover:text-red-600 transition-colors"
          >
            <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="hidden sm:inline">Favorites</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
