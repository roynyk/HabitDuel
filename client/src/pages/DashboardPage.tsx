import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  PlusCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Crown,
} from "lucide-react";
import { api } from "../lib/api";

interface DashboardPageProps {
  onOpenCreateModal: () => void;
  onOpenJoinModal?: () => void;
}

export function DashboardPage({ onOpenCreateModal }: DashboardPageProps) {
  const [rooms, setRooms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const currentUserName = localStorage.getItem("userName");

  const fetchRooms = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await api.get("/api/rooms");
      if (response.data?.success) {
        setRooms(response.data.rooms || []);
      } else {
        setErrorMessage(response.data?.message || "Gagal memuat daftar room");
      }
    } catch (err: any) {
      console.error("Fetch rooms error:", err);
      setErrorMessage(
        err.response?.data?.message ||
          "Gagal mengambil data dari server backend",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Hitung berapa room yang sudah check-in hari ini oleh user aktif
  const checkedInRoomsCount = rooms.filter((room) => {
    return room.checkIns?.some((p: any) => {
      const isMe =
        p.user?.name === currentUserName || p.user?.email === currentUserName;
      const isToday =
        new Date(p.createdAt).toDateString() === new Date().toDateString();
      return isMe && isToday;
    });
  }).length;

  // Hitung berapa room yang dibuat/dimiliki oleh user aktif
  const ownedRoomsCount = rooms.filter((room) => {
    const myMember = room.members?.find(
      (m: any) =>
        m.user?.name === currentUserName || m.user?.email === currentUserName,
    );
    const myUserId = myMember?.userId || myMember?.user?.id;
    return room.createdById === myUserId;
  }).length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Dashboard Top Header */}
      <div className="border-b border-stone-300 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          Dashboard Habit Room
        </h1>
        <p className="text-sm text-stone-600">
          Kelola kamar duel & pantau progres streak kebiasaanmu secara real-time
        </p>
      </div>

      {/* Stats Summary Bar (3 Kartu Ringkas: Room Diikuti, Check-In Hari Ini, & Room Dibuat/Owner) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl">
        {/* Metrik 1: Total Habit Room Diikuti */}
        <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-stone-300 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-900/10 text-amber-900 border border-amber-900/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900">
              {rooms.length} Room
            </div>
            <div className="text-xs text-stone-500 font-medium">
              Habit Room Diikuti
            </div>
          </div>
        </div>

        {/* Metrik 2: Status Progres Check-In Hari Ini */}
        <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-stone-300 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-900/10 text-amber-900 border border-amber-900/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900">
              {checkedInRoomsCount} / {rooms.length} Done
            </div>
            <div className="text-xs text-stone-500 font-medium">
              Check-In Hari Ini
            </div>
          </div>
        </div>

        {/* Metrik 3: Total Room Dibuat / Milik Sendiri (Owner) */}
        <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-stone-300 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-900/10 text-amber-900 border border-amber-900/20">
            <Crown className="w-6 h-6 text-amber-900" />
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900">
              {ownedRoomsCount} Room
            </div>
            <div className="text-xs text-stone-500 font-medium">Room Kamu</div>
          </div>
        </div>
      </div>

      {/* Habit Rooms List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-stone-900">
          Kamar Habit Aktif Kamu
        </h2>

        {isLoading ? (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-amber-900 animate-spin mx-auto" />
            <p className="text-xs text-stone-500 font-medium">
              Memuat data habit room dari Supabase...
            </p>
          </div>
        ) : errorMessage ? (
          <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm text-center">
            {errorMessage}
          </div>
        ) : rooms.length === 0 ? (
          <div className="p-10 rounded-2xl bg-[#FAF9F6] border border-stone-300 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-900/10 text-amber-900 border border-amber-900/20 mx-auto flex items-center justify-center">
              <Users className="w-6 h-6 text-amber-900" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-stone-900">Belum Ada Habit Room</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Kamu belum bergabung atau membuat room habit. Buat room baru dan
                ajak temanmu berduel!
              </p>
            </div>
            <button
              onClick={onOpenCreateModal}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-amber-50 bg-amber-900 hover:bg-amber-950 transition inline-flex items-center gap-2 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" /> Buat Room Pertama
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rooms.map((room) => {
              const myMember = room.members?.find(
                (m: any) =>
                  m.user?.name === currentUserName ||
                  m.user?.email === currentUserName,
              );
              const streak = myMember?.currentStreak || 0;
              const memberCount = room.members?.length || 1;
              const myUserId = myMember?.userId || myMember?.user?.id;
              const isOwner = room.createdById === myUserId;

              return (
                <div
                  key={room.id}
                  className="p-6 rounded-2xl bg-[#FAF9F6] border border-stone-300 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-5 group"
                >
                  {/* Card Top */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-lg text-stone-900 group-hover:text-amber-900 transition-colors">
                            {room.name}
                          </h3>
                          {isOwner && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-900/10 text-amber-900 border border-amber-900/20 flex items-center gap-1">
                              <Crown className="w-3 h-3 text-amber-900" /> Owner
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-stone-500">
                          {room.habitTitle}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-extrabold text-amber-900 bg-amber-900/10 px-3 py-1 rounded-full border border-amber-900/20">
                        {streak} Days Streak!
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Meta & Button */}
                  <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-stone-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-stone-400" />{" "}
                        {memberCount} Anggota
                      </span>
                      <span className="flex items-center gap-1 font-mono text-amber-900 bg-amber-900/10 px-2 py-0.5 rounded border border-amber-900/20 font-bold">
                        Kode: {room.inviteCode}
                      </span>
                    </div>

                    <Link
                      to={`/room/${room.id}`}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-stone-800 bg-[#EAE6DD] hover:bg-amber-900 hover:text-amber-50 transition flex items-center gap-1"
                    >
                      Buka Room <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
