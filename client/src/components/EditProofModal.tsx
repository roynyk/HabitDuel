import { useState, useEffect, useRef } from 'react';
import { X, Pencil, CheckCircle2, Upload, Camera } from 'lucide-react';
import { api } from '../lib/api';

interface EditProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  proofId?: string;
  initialNote?: string;
  photoUrl?: string;
  onSuccess?: () => void;
}

export function EditProofModal({
  isOpen,
  onClose,
  proofId,
  initialNote = '',
  photoUrl,
  onSuccess,
}: EditProofModalProps) {
  const [note, setNote] = useState(initialNote);
  const [currentPhoto, setCurrentPhoto] = useState<string | undefined>(photoUrl);
  const [newImageBase64, setNewImageBase64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setNote(initialNote);
    setCurrentPhoto(photoUrl);
    setNewImageBase64(null);
    setError('');
  }, [initialNote, photoUrl, isOpen]);

  if (!isOpen || !proofId) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const payload: any = { note };
      if (newImageBase64) {
        payload.photoUrl = newImageBase64;
      }

      const response = await api.put(`/api/proofs/proofs/${proofId}`, payload);

      if (response.data?.success) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setError(response.data?.message || 'Gagal memperbarui postingan');
      }
    } catch (err: any) {
      console.error('Update proof error:', err);
      setError(err.response?.data?.message || 'Terjadi kesalahan saat memperbarui postingan');
    } finally {
      setIsLoading(false);
    }
  };

  const displayPhoto = newImageBase64 || currentPhoto;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-[#FAF9F6] border border-stone-300 rounded-2xl shadow-2xl p-6 relative space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-900/10 text-amber-900 border border-amber-900/20">
              <Pencil className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">Edit Postingan Bukti</h3>
              <p className="text-xs text-stone-500">Perbarui foto bukti atau catatan buktimu</p>
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
          
          {/* Photo Preview & Change Option */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1.5 flex items-center justify-between">
              <span>Foto Bukti</span>
              <span className="text-[10px] text-amber-900 font-semibold">Klik foto untuk mengganti</span>
            </label>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />

            {displayPhoto ? (
              <div className="relative rounded-xl overflow-hidden border border-stone-300 bg-white group cursor-pointer">
                <img
                  src={displayPhoto}
                  alt="Foto Bukti"
                  className="w-full h-44 object-cover"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 text-xs font-bold text-white transition"
                >
                  <Upload className="w-4 h-4" /> Ganti Foto Bukti
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-40 rounded-xl border-2 border-dashed border-stone-300 hover:border-amber-900 bg-white flex flex-col items-center justify-center gap-2 text-stone-500 hover:text-amber-900 transition"
              >
                <Camera className="w-6 h-6 text-stone-400" />
                <span className="text-xs font-medium">Pilih Foto Bukti Baru</span>
              </button>
            )}
          </div>

          {/* Note Input */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              Catatan Bukti (Keterangan)
            </label>
            <textarea
              rows={3}
              placeholder="Tuliskan catatan baru di sini..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-900 transition resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-stone-200">
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
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-amber-50 bg-amber-900 hover:bg-amber-950 transition disabled:opacity-40 flex items-center gap-2 shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
