import { useState } from 'react';
import { X, Flame, Calendar as CalendarIcon, Clock, Sparkles } from 'lucide-react';
import { api } from '../lib/api';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newRoom: any) => void;
}

export function CreateRoomModal({ isOpen, onClose, onSuccess }: CreateRoomModalProps) {
  const [name, setName] = useState('');
  const [habitTitle, setHabitTitle] = useState('');
  const [habitDescription, setHabitDescription] = useState('');
  
  // Custom Time Picker (format HH:MM) & Hourly Deadline Integer
  const [deadlineTimeStr, setDeadlineTimeStr] = useState<string>('22:00');
  const [dailyDeadlineHours, setDailyDeadlineHours] = useState<number>(22);
  
  // Custom Date Range & Calendar Schedule
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultEndStr = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [startDate, setStartDate] = useState<string>(todayStr);
  const [endDate, setEndDate] = useState<string>(defaultEndStr);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Function to quick-set duration in days
  const handleQuickPresetDays = (days: number) => {
    const startMs = startDate ? new Date(startDate).getTime() : Date.now();
    const endMs = startMs + days * 24 * 60 * 60 * 1000;
    setEndDate(new Date(endMs).toISOString().split('T')[0]);
  };

  // Calculate days difference for custom calendar
  const getDaysCount = () => {
    if (!startDate || !endDate) return 7;
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const diff = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    return diff;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/api/rooms', {
        name,
        habitTitle,
        habitDescription,
        targetDaysPerWeek: getDaysCount(),
        dailyDeadlineHours: Number(dailyDeadlineHours),
        startDate: startDate,
        endDate: endDate,
      });

      if (response.data?.success) {
        if (onSuccess) onSuccess(response.data.room);
        setName('');
        setHabitTitle('');
        setHabitDescription('');
        onClose();
      } else {
        setError(response.data?.message || 'Gagal membuat room');
      }
    } catch (err: any) {
      console.error('Create room error:', err);
      setError(err.response?.data?.message || 'Terjadi kesalahan saat membuat room');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg bg-[#FAF9F6] border border-stone-300 rounded-3xl shadow-2xl p-6 sm:p-7 relative space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-900/10 text-amber-900 border border-amber-900/20">
              <Flame className="w-5 h-5 fill-amber-900" />
            </div>
            <div>
              <h3 className="text-lg font-black text-stone-900">Buat Habit Room Baru</h3>
              <p className="text-xs text-stone-500">Tentukan aturan & jam deadline sesuai keinginanmu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-[#EAE6DD] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <p className="text-xs text-rose-700 font-medium p-3 bg-rose-50 rounded-xl border border-rose-200">{error}</p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Nama Room / Komunitas
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Gym Warriors 2026"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-900 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Judul Kebiasaan (Habit)
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Olahraga 45 Menit / Workout"
              value={habitTitle}
              onChange={(e) => setHabitTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-900 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Deskripsi Singkat (Opsional)
            </label>
            <textarea
              rows={2}
              placeholder="Wajib upload foto selfie di gym atau foto dumbbell..."
              value={habitDescription}
              onChange={(e) => setHabitDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-900 transition resize-none"
            />
          </div>

          {/* Jam Deadline Bebas (Hanya 1 Ikon Jam Asli Berlatar Cokelat) */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-900" /> Jam Batas Deadline Harian
              </span>
              <span className="text-[10px] text-stone-500 font-normal">Check-in dibuka 00:00 s/d Jam Deadline</span>
            </label>
            
            <input
              type="time"
              required
              value={deadlineTimeStr}
              onChange={(e) => {
                setDeadlineTimeStr(e.target.value);
                const hours = parseInt(e.target.value.split(':')[0], 10);
                if (!isNaN(hours)) setDailyDeadlineHours(hours);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-sm font-extrabold text-stone-900 focus:outline-none focus:border-amber-900 cursor-pointer shadow-xs"
            />
          </div>

          {/* Target Jadwal & Kalender */}
          <div className="space-y-2 pt-1 border-t border-stone-200">
            <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5 mb-1">
              <CalendarIcon className="w-3.5 h-3.5 text-amber-900" /> Target Tanggal Kalender & Durasi Challenge
            </label>

            <div className="p-3.5 rounded-2xl bg-amber-900/5 border border-amber-900/20 space-y-3">
              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <span className="text-[10px] font-bold text-stone-500 shrink-0">Preset Cepat:</span>
                {[7, 14, 30, 60, 90, 365].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handleQuickPresetDays(d)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition ${
                      getDaysCount() === d
                        ? 'bg-amber-900 text-amber-50 border-amber-900 shadow-xs'
                        : 'bg-white text-stone-700 border-stone-300 hover:border-amber-900/40'
                    }`}
                  >
                    {d === 365 ? '1 Tahun' : `${d} Hari`}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="block text-[11px] font-semibold text-stone-700 mb-1">Tanggal Mulai</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 font-semibold focus:outline-none focus:border-amber-900"
                  />
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-stone-700 mb-1">Tanggal Selesai</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 font-semibold focus:outline-none focus:border-amber-900"
                  />
                </div>
              </div>

              <div className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5 pt-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                Durasi Challenge Kalender: {getDaysCount()} Hari Pertandingan!
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3 flex justify-end gap-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-700 hover:bg-[#EAE6DD] transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-amber-50 bg-amber-900 hover:bg-amber-950 transition disabled:opacity-50 flex items-center gap-2 shadow-sm shadow-amber-950/20"
            >
              {isLoading ? 'Membuat Room...' : 'Buat Room Duel'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
