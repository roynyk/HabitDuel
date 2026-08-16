import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flame, PlusCircle, LogIn, LogOut, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenCreateModal?: () => void;
  onOpenJoinModal?: () => void;
}

export function Navbar({ onOpenCreateModal, onOpenJoinModal }: NavbarProps) {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!localStorage.getItem('token'));
  const [userName, setUserName] = useState<string>(() => localStorage.getItem('userName') || 'User');

  // Real-time Auth Sync whenever route changes or storage event triggers
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const name = localStorage.getItem('userName');
      setIsLoggedIn(!!token);
      setUserName(name || 'User');
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    window.addEventListener('auth-change', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', checkAuth);
    };
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    window.dispatchEvent(new Event('auth-change'));
    window.location.href = '/';
  };

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#F2F0EA]/90 border-b border-stone-300/70 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="bg-amber-900/10 p-2 rounded-xl text-amber-900 border border-amber-900/20 group-hover:scale-105 transition-transform shadow-xs">
            <Flame className="w-5 h-5 fill-amber-900" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-stone-900">
              Habit<span className="text-amber-900">Duel</span>
            </span>
            <span className="text-[10px] text-stone-500 font-semibold tracking-wider uppercase -mt-1">
              Multiplayer Habit Tracker
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-700">
          {isLoggedIn && (
            <Link
              to="/dashboard"
              className={`transition-colors hover:text-amber-900 ${
                location.pathname === '/dashboard' ? 'text-amber-900 font-extrabold' : ''
              }`}
            >
              Dashboard Room
            </Link>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {onOpenJoinModal && (
            <button
              onClick={onOpenJoinModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-stone-800 bg-[#EAE6DD] border border-stone-300 hover:bg-[#E2DDD0] transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              Join Kode Room
            </button>
          )}

          {onOpenCreateModal && (
            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-amber-50 bg-amber-900 hover:bg-amber-950 shadow-sm shadow-amber-950/20 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              Buat Room Baru
            </button>
          )}

          {isLoggedIn ? (
            <div className="flex items-center gap-3 pl-2 border-l border-stone-300">
              <div className="flex items-center gap-2 text-xs font-medium text-stone-800">
                <div className="w-7 h-7 rounded-full bg-amber-900/10 border border-amber-900/20 flex items-center justify-center text-amber-900 font-bold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden lg:inline">{userName}</span>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-1.5 rounded-lg text-stone-500 hover:text-rose-700 hover:bg-[#EAE6DD] transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-stone-800 bg-[#EAE6DD] border border-stone-300 hover:bg-[#E2DDD0] transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              Masuk
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}
