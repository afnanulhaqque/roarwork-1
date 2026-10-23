import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, Phone, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Offerings', path: '/offerings' },
    { name: 'Partnerships', path: '/partnerships' },
    { name: 'Team', path: '/team' },
    { name: 'Blog', path: '/blog' },
    { name: 'Location & Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav backdrop-blur-md bg-[#0B0F19]/90 border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E59B] to-[#00B87C] p-0.5 shadow-lg shadow-[#00B87C]/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
              <span className="text-white font-extrabold text-xl tracking-tighter">R</span>
            </div>
          </div>
          <div>
            <span className="text-white font-bold text-xl tracking-tight block">
              The <span className="text-[#00B87C]">Roarworks</span>
            </span>
            <span className="text-xs text-gray-400 font-medium block -mt-1 tracking-wider uppercase">
              Blue Area · Islamabad
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-[#00B87C] relative py-1 ${
                isActive(link.path) ? 'text-[#00B87C]' : 'text-gray-300'
              }`}
            >
              {link.name}
              {isActive(link.path) && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00B87C] rounded-full animate-pulse" />
              )}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/admin"
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-white/10 text-white rounded-lg hover:bg-white/15 transition-all border border-white/10"
              >
                <Shield className="w-3.5 h-3.5 text-[#00B87C]" />
                Dashboard ({user?.role === 'super_admin' ? 'Admin' : 'Staff'})
              </Link>
              <button
                onClick={logout}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/admin/login"
              className="text-xs text-gray-400 hover:text-white font-medium transition-colors"
            >
              Staff Login
            </Link>
          )}

          <Link
            to="/contact#book-tour"
            className="flex items-center gap-2 px-6 py-2.5 bg-[#00B87C] hover:bg-[#009F6B] text-white text-sm font-semibold rounded-lg shadow-lg shadow-[#00B87C]/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Book Now</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden items-center gap-2">
          <Link
            to="/contact#book-tour"
            className="px-3.5 py-1.5 bg-[#00B87C] text-white text-xs font-semibold rounded-md"
          >
            Book Now
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0B0F19] border-b border-white/10 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(link.path)
                  ? 'bg-white/10 text-[#00B87C]'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 bg-white/10 text-white rounded-lg font-medium text-sm"
                >
                  Admin / Staff Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 text-gray-400 text-sm"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-gray-400 text-sm hover:text-white"
              >
                Staff Portal Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
