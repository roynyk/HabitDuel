import { useState } from 'react';
import { X, Sparkles, Key } from 'lucide-react';
import { api } from '../lib/api';

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (room: any) => void;
}

export function JoinRoomModal({ isOpen, onClose, onSuccess }: JoinRoomModalProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (inviteCode.trim().length < 4) {
      setError('Kode invite tidak valid.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post('/api/rooms/join', {
        inviteCode: inviteCode.trim().toUpperCase(),
      });

      if (response.data?.success) {
        if (onSuccess) onSuccess(response.data.room);
        setInviteCode('');
        onClose();
      } else {
        setError(response.data?.message || 'Gagal bergabung ke room');
      }
    } catch (err: any) {
      console.error('Join room error:', err);
      setError(err.response?.data?.message || 'Terjadi kesalahan saat bergabung ke room');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-[#FAF9F6] border border-stone-300 rounded-2xl shadow-2xl p-6 relative space-y-5">
        
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-900/10 text-amber-900 border border-amber-900/20">
              <Sparkles className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">Gabung Room Habit</h3>
              <p className="text-xs text-stone-500">Masukkan kode invite dari temanmu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-[#EAE6DD] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-900" /> Kode Invite Room
            </label>
            <input
              type="text"
              required
              maxLength={8}
              placeholder="Contoh: AB12CD"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-base font-mono uppercase tracking-widest text-amber-950 placeholder-stone-400 focus:outline-none focus:border-amber-900 transition text-center font-bold"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-700 font-medium text-center">{error}</p>
          )}

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-[#EAE6DD] transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 rounded-xl text-xs font-bold text-amber-50 bg-amber-900 hover:bg-amber-950 transition disabled:opacity-50"
            >
              {isLoading ? 'Bergabung...' : 'Masuk Room'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
