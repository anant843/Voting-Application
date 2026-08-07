import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Vote, LogOut, LayoutDashboard, UserCircle, Share2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-600 text-white shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform duration-300">
            <Vote className="h-7 w-7" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter text-slate-900 leading-none">
              INDIA<span className="text-orange-600">VOTES</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Digital Democracy</span>
          </div>
        </Link>

        <div className="flex items-center space-x-6">
          {!loading && (
            <>
              {user ? (
                <>
                  <Link to="/candidates" className="text-sm font-bold text-slate-600 hover:text-orange-600 transition-colors">
                    Candidates
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="flex items-center space-x-1.5 text-sm font-bold text-slate-600 hover:text-orange-600 transition-colors">
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Admin</span>
                    </Link>
                  )}
                  <Link to="/profile" className="flex items-center space-x-1.5 text-sm font-bold text-slate-600 hover:text-orange-600 transition-colors">
                    <UserCircle className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  <div className="h-6 w-px bg-slate-200 mx-2"></div>
                      <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center space-x-2 font-bold text-slate-500 hover:text-red-600">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="font-bold">Login</Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="primary" size="sm" className="font-bold shadow-orange-100">Sign Up</Button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
