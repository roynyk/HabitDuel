import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, UserPlus, Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin ? { email, password } : { email, password, name };

      const response = await api.post(endpoint, payload);

      if (response.data?.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userName', response.data.user.name || email.split('@')[0]);
        window.dispatchEvent(new Event('auth-change'));
        navigate('/dashboard');
      } else {
        setErrorMessage(response.data?.message || 'Terjadi kesalahan autentikasi');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      const serverMessage = err.response?.data?.message || 'Gagal terhubung ke server backend Hono';
      setErrorMessage(serverMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-[#FAF9F6] border border-stone-300 rounded-3xl shadow-xl p-8 space-y-6">
        
        {/* Brand Logo Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-900/10 text-amber-900 border border-amber-900/20 mx-auto flex items-center justify-center font-black">
            <Flame className="w-7 h-7 fill-amber-900" />
          </div>
          <h2 className="text-2xl font-black text-stone-900 tracking-tight">
            {isLogin ? 'Selamat Datang Kembali!' : 'Buat Akun HabitDuel'}
          </h2>
          <p className="text-xs text-stone-500">
            {isLogin ? 'Masuk untuk mengelola habit room milikmu' : 'Daftar sekarang & ajak temanmu berduel habit'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-[#EAE6DD] border border-stone-300 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setErrorMessage('');
            }}
            className={`py-2 rounded-lg transition-all ${
              isLogin ? 'bg-white text-amber-900 font-bold shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Masuk (Login)
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setErrorMessage('');
            }}
            className={`py-2 rounded-lg transition-all ${
              !isLogin ? 'bg-white text-amber-900 font-bold shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Daftar (Register)
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-700" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-900" /> Nama Lengkap
              </label>
              <input
                type="text"
                required
                placeholder="Alex Developer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-900 transition"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-900" /> Email Address
            </label>
            <input
              type="email"
              required
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-900 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-900" /> Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-900 transition"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-extrabold text-sm text-amber-50 bg-amber-900 hover:bg-amber-950 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm shadow-amber-950/20 mt-2"
          >
            {isLoading ? (
              'Memproses...'
            ) : isLogin ? (
              <>
                Masuk Sekarang <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Daftar Akun Baru <UserPlus className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
