import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Menu, X } from 'lucide-react';


interface NavBarProps {
    navItems: { path: string; name: string; icon: JSX.Element }[];
}

export function NavBar({ navItems }: NavBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-white shadow-lg md:hidden"
      >
        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Navigation */}
      <nav className={`
        fixed left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out z-40
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:h-auto md:w-full
      `}>
        <div className="p-6 md:max-w-7xl md:mx-auto md:flex md:justify-between md:items-center">
          <div className="flex items-center space-x-2 mb-8 md:mb-0">
            <Compass className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold">BrestLife</span>
          </div>
          <ul className="space-y-4 md:space-y-0 md:flex md:space-x-8">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}