import { Link } from 'react-router-dom';
import { Flame, ShieldAlert, Users, Camera, CheckCircle2, ArrowRight, Trophy, Zap, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onOpenCreateModal: () => void;
  onOpenJoinModal: () => void;
}

export function LandingPage({ onOpenCreateModal, onOpenJoinModal }: LandingPageProps) {
  return (
    <div className="space-y-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 text-center max-w-5xl mx-auto space-y-8">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-900/10 border border-amber-900/20 text-amber-950 text-xs font-bold uppercase tracking-wider">
          <Zap className="w-4 h-4 fill-amber-900 text-amber-900" /> Multiplayer Habit Tracker with Proof Upload
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-stone-900">
          Bangun Kebiasaan Bareng Teman. <br />
          <span className="text-amber-900">
            Upload Bukti Foto, Jaga Streak!
          </span>
        </h1>

        <p className="text-stone-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Habit tracker biasa sering membuatmu bosan dan lupa. Di <strong>HabitDuel</strong>, buat room duel bersama 2-4 temanmu, upload foto bukti setiap hari, dan buktikan siapa yang punya komitmen terkuat!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={onOpenCreateModal}
            className="px-6 py-3.5 rounded-xl font-extrabold text-sm text-amber-50 bg-amber-900 hover:bg-amber-950 shadow-md shadow-amber-950/20 hover:scale-[1.02] transition flex items-center gap-2"
          >
            <Flame className="w-4 h-4 fill-amber-50" /> Buat Habit Room Baru
          </button>
          
          <button
            onClick={onOpenJoinModal}
            className="px-6 py-3.5 rounded-xl font-bold text-sm text-stone-800 bg-[#EAE6DD] border border-stone-300 hover:bg-[#E2DDD0] transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-700" /> Gabung Pakai Kode Invite
          </button>

          <Link
            to="/dashboard"
            className="px-6 py-3.5 rounded-xl font-bold text-sm text-stone-700 hover:text-amber-900 transition flex items-center gap-1.5"
          >
            Lihat Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Live Preview Card Showcase */}
        <div className="pt-10 max-w-3xl mx-auto">
          <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-stone-300 shadow-md text-left space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-800 animate-pulse"></span>
                <span className="font-bold text-sm text-stone-900">Gym Warriors 2026</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-extrabold text-amber-900 bg-amber-900/10 px-2.5 py-1 rounded-full border border-amber-900/20">
                <Flame className="w-3.5 h-3.5 fill-amber-800 text-amber-800" /> 14 Days Streak!
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-white border border-stone-200 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-900 text-amber-50 font-bold text-xs flex items-center justify-center">A</div>
                  <span className="text-xs font-semibold text-stone-800">Alex</span>
                </div>
                <div className="text-[10px] text-amber-900 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Checked In (08:30)
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-stone-200 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-stone-700 text-white font-bold text-xs flex items-center justify-center">B</div>
                  <span className="text-xs font-semibold text-stone-800">Budi</span>
                </div>
                <div className="text-[10px] text-amber-900 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Checked In (14:15)
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-stone-200 space-y-2 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-rose-700 text-white font-bold text-xs flex items-center justify-center">C</div>
                  <span className="text-xs font-semibold text-stone-800">Citra</span>
                </div>
                <div className="text-[10px] text-rose-700 font-bold flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-rose-600" /> Pending (Deadline 22:00)
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Feature Grid Section */}
      <section className="max-w-6xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Mengapa HabitDuel Lebih Efektif?
          </h2>
          <p className="text-stone-600 text-sm max-w-xl mx-auto">
            Aplikasi habit biasa mengandalkan disiplin sendiri. HabitDuel menggunakan komitmen sosial & bukti nyata.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-stone-300 shadow-sm hover:shadow-md transition space-y-3">
            <div className="p-3 rounded-xl bg-amber-900/10 text-amber-900 w-fit border border-amber-900/20">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-stone-900">Habit Room Komunitas</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Buat kamar khusus untuk 2-4 teman dekatmu dengan kode invite pribadi.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-stone-300 shadow-sm hover:shadow-md transition space-y-3">
            <div className="p-3 rounded-xl bg-amber-900/10 text-amber-900 w-fit border border-amber-900/20">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-stone-900">Upload Foto Bukti</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Bukan sekadar centang tombol! Kamu wajib melampirkan foto bukti aktivitas (gym, halaman buku, dll).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-stone-300 shadow-sm hover:shadow-md transition space-y-3">
            <div className="p-3 rounded-xl bg-amber-900/10 text-amber-900 w-fit border border-amber-900/20">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-stone-900">Runtuh Streak Jika Alpa</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Jika salah satu anggota lupa check-in sampai deadline jam 10 malam, skor streak grup bisa runtuh!
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
