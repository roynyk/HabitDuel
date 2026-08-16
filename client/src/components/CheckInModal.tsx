import { useState, useRef } from 'react';
import { X, Camera, Upload, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { api } from '../lib/api';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId?: string;
  roomName?: string;
  habitTitle?: string;
  onSuccess?: () => void;
}

export function CheckInModal({ isOpen, onClose, roomId, roomName = 'Gym Warriors', habitTitle = 'Workout 45 Menit', onSuccess }: CheckInModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage || !roomId) return;

    setError('');
    setIsLoading(true);

    try {
      const response = await api.post(`/api/proofs/rooms/${roomId}/checkin`, {
        photoUrl: selectedImage,
        note,
      });

      if (response.data?.success) {
        if (onSuccess) onSuccess();
        setSelectedImage(null);
        setNote('');
        onClose();
      } else {
        setError(response.data?.message || 'Gagal melakukan check-in');
      }
    } catch (err: any) {
      console.error('Check-in proof error:', err);
      setError(err.response?.data?.message || 'Terjadi kesalahan saat mengunggah bukti');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-[#FAF9F6] border border-stone-300 rounded-2xl shadow-2xl p-6 relative space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-900/10 text-amber-900 border border-amber-900/20">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">Upload Bukti Hari Ini</h3>
              <p className="text-xs text-stone-500">{roomName} • {habitTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-[#EAE6DD] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <p className="text-xs text-rose-700 font-medium p-2 bg-rose-50 rounded-xl border border-rose-200">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Photo Selector / Preview Area */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1.5">
              Foto Bukti Aktivitas Hari Ini
            </label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />

            {selectedImage ? (
              <div className="relative rounded-xl overflow-hidden border border-amber-900/30 bg-white group">
                <img
                  src={selectedImage}
                  alt="Bukti Preview"
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 text-xs font-semibold text-white transition"
                >
                  <Upload className="w-4 h-4" /> Ganti Foto
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-40 rounded-xl border-2 border-dashed border-stone-300 hover:border-amber-900 bg-white flex flex-col items-center justify-center gap-2 text-stone-500 hover:text-amber-900 transition"
              >
                <div className="p-3 rounded-full bg-[#FAF9F6] border border-stone-200 shadow-xs">
                  <ImageIcon className="w-6 h-6 text-stone-400" />
                </div>
                <span className="text-xs font-medium">Klik untuk memilih/ambil foto bukti</span>
              </button>
            )}
          </div>

          {/* Note Input */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              Catatan Singkat (Opsional)
            </label>
            <input
              type="text"
              placeholder="Contoh: Selesai 100x Push-up hari ini 💪"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-900 transition"
            />
          </div>

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
              disabled={!selectedImage || isLoading}
              className="px-5 py-2 rounded-xl text-xs font-bold text-amber-50 bg-amber-900 hover:bg-amber-950 transition disabled:opacity-40 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isLoading ? 'Mengirim Bukti...' : 'Kirim Bukti Hari Ini'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
