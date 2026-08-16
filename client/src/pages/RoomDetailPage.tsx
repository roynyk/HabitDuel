import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Flame,
  Users,
  Camera,
  Copy,
  Check,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Moon,
  Trophy,
  Crown,
  Pencil,
} from "lucide-react";
import { CheckInModal } from "../components/CheckInModal";
import { EditProofModal } from "../components/EditProofModal";
import { api } from "../lib/api";

export function RoomDetailPage() {
  const { id } = useParams();
  const [copied, setCopied] = useState(false);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [editingProof, setEditingProof] = useState<any>(null);
  const [room, setRoom] = useState<any>(null);
  const [proofs, setProofs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const currentUserName = localStorage.getItem("userName");

  const fetchRoomData = async () => {
    if (!id) return;
    setIsLoading(true);
    setErrorMessage("");
    try {
      // Fetch Room Detail
      const roomRes = await api.get(`/api/rooms/${id}`);
      if (roomRes.data?.success) {
        setRoom(roomRes.data.room);
      } else {
        setErrorMessage(roomRes.data?.message || "Room tidak ditemukan");
      }

      // Fetch Room Proofs Feed
      const proofRes = await api.get(`/api/proofs/rooms/${id}/proofs`);
      if (proofRes.data?.success) {
        setProofs(proofRes.data.proofs || []);
      }
    } catch (err: any) {
      console.error("Fetch room detail error:", err);
      setErrorMessage(
        err.response?.data?.message || "Gagal mengambil data room dari server",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomData();
  }, [id]);

  const handleCopyCode = () => {
    if (room?.inviteCode) {
      navigator.clipboard.writeText(room.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddProofSuccess = () => {
    fetchRoomData();
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-amber-900 animate-spin mx-auto" />
        <p className="text-xs text-stone-500 font-medium">
          Memuat detail room & feed bukti...
        </p>
      </div>
    );
  }

  if (errorMessage || !room) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <p className="text-sm text-rose-700 font-medium p-4 bg-rose-50 rounded-2xl border border-rose-200">
          {errorMessage || "Room tidak ditemukan."}
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-stone-800 bg-[#EAE6DD] border border-stone-300"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  // Cari Top Leader tunggal di Room ini
  const maxStreak = room.members
    ? Math.max(...room.members.map((m: any) => m.currentStreak || 0))
    : 0;

  const topMembers = maxStreak > 0
    ? room.members?.filter((m: any) => (m.currentStreak || 0) === maxStreak)
    : [];

  // Leader badge HANYA tampil jika ADA HANYA 1 ORANG pemuncak tunggal dengan streak > 0
  const hasSoleLeader = topMembers.length === 1;
  const topMember = hasSoleLeader ? topMembers[0] : null;
  const topFragName = topMember?.user?.name || "";
  const topFragStreak = topMember?.currentStreak || 0;

  // Cek apakah user aktif sudah melakukan check-in hari ini
  const isCheckedInToday = proofs.some((p: any) => {
    const isMe =
      p.user?.name === currentUserName || p.user?.email === currentUserName;
    const isToday =
      new Date(p.createdAt).toDateString() === new Date().toDateString();
    return isMe && isToday;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Back Button & Top Banner */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-amber-900 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500">Kode Invite:</span>
          <button
            onClick={handleCopyCode}
            className="px-3 py-1 rounded-lg bg-[#EAE6DD] border border-stone-300 text-xs font-mono font-bold text-amber-900 hover:border-amber-900/40 transition flex items-center gap-1.5"
          >
            {room.inviteCode}{" "}
            {copied ? (
              <Check className="w-3.5 h-3.5 text-amber-900" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Room Header Info */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF9F6] border border-stone-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-4xl font-black text-stone-900 break-words [overflow-wrap:anywhere]">
              {room.name}
            </h1>

            {/* Top Frag Leader Badge - Hanya tampil jika ADA HANYA 1 ORANG pemuncak tunggal */}
            {hasSoleLeader && (
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-900 bg-amber-900/10 px-3 py-1 rounded-full border border-amber-900/20 animate-fadeIn">
                <Trophy className="w-3.5 h-3.5 text-amber-800" /> {topFragName} (
                {topFragStreak} Days Streak! 🔥)
              </div>
            )}
          </div>
          <p className="text-sm font-semibold text-amber-900 break-words">
            {room.habitTitle}
          </p>
          <p className="text-xs text-stone-600 max-w-xl break-words [overflow-wrap:anywhere]">
            {room.habitDescription ||
              "Setiap hari wajib unggah foto bukti kebiasaanmu!"}
          </p>
        </div>

        {isCheckedInToday ? (
          <div className="px-6 py-3.5 rounded-2xl font-extrabold text-xs text-amber-900 bg-amber-900/10 border border-amber-900/20 flex items-center justify-center gap-2 z-10 shrink-0">
            <CheckCircle2 className="w-5 h-5 text-amber-900" /> Sudah Check-In
            Hari Ini
          </div>
        ) : (
          <button
            onClick={() => setIsCheckInOpen(true)}
            className="px-6 py-3.5 rounded-2xl font-extrabold text-sm text-amber-50 bg-amber-900 hover:bg-amber-950 transition shadow-md shadow-amber-950/20 flex items-center justify-center gap-2 z-10 hover:scale-[1.02] shrink-0"
          >
            <Camera className="w-5 h-5" /> Upload Bukti Hari Ini
          </button>
        )}
      </div>

      {/* Main Grid: Members & Proof Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Member Leaderboard & Dynamic Status Badges */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-900" /> Member Duel (
            {room.members?.length || 0})
          </h2>

          <div className="space-y-3">
            {room.members?.map((member: any) => {
              // Cek apakah member ini adalah Pemilik / Owner dari Room
              const isOwner =
                member.userId === room.createdById ||
                member.user?.id === room.createdById;

              // Cek apakah member ini sudah check-in HARI INI
              const memberCheckedInToday = proofs.some((p: any) => {
                const isUser =
                  p.userId === member.userId ||
                  p.user?.name === member.user?.name ||
                  p.user?.id === member.user?.id;
                const isToday =
                  new Date(p.createdAt).toDateString() ===
                  new Date().toDateString();
                return isUser && isToday;
              });

              const isTopFrag =
                hasSoleLeader &&
                (member.userId === topMember?.userId ||
                  member.user?.name === topMember?.user?.name);

              return (
                <div
                  key={member.id}
                  className={`p-4 rounded-2xl border shadow-xs flex items-center justify-between transition-all overflow-hidden ${
                    memberCheckedInToday
                      ? "bg-[#FAF9F6] border-stone-300"
                      : "bg-stone-200/40 border-stone-300/60 opacity-80"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl font-bold text-sm flex items-center justify-center border shrink-0 ${
                        memberCheckedInToday
                          ? "bg-amber-900/10 text-amber-900 border-amber-900/20"
                          : "bg-stone-300/60 text-stone-600 border-stone-400/40"
                      }`}
                    >
                      {member.user?.name
                        ? member.user.name.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-sm font-bold text-stone-900 break-words [overflow-wrap:anywhere]">
                          {member.user?.name || "Pengguna"}
                        </h4>

                        {/* Owner Badge */}
                        {isOwner && (
                          <span
                            className="text-[10px] px-1.5 py-0.2 bg-amber-900/10 text-amber-950 border border-amber-900/20 rounded font-black flex items-center gap-0.5 shrink-0"
                            title="Pemilik / Pembuat Room"
                          >
                            <Crown className="w-3 h-3 text-amber-900" /> Owner
                          </span>
                        )}

                        {/* Top Frag Sole Leader Badge */}
                        {isTopFrag && (
                          <span
                            className="text-[10px] px-1.5 py-0.2 bg-amber-900/10 text-amber-900 border border-amber-900/20 rounded font-black shrink-0"
                            title="Sole Leader Badge"
                          >
                            🏆 Top Frag
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                        <Flame
                          className={`w-3 h-3 shrink-0 ${
                            memberCheckedInToday
                              ? "text-amber-700 fill-amber-700"
                              : "text-stone-400 fill-stone-300"
                          }`}
                        />{" "}
                        {member.currentStreak || 0} Hari Streak
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 ml-2">
                    {memberCheckedInToday ? (
                      <span className="px-2.5 py-1 rounded-full bg-amber-900/10 text-amber-950 text-[10px] font-extrabold border border-amber-900/20 flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-amber-800 text-amber-800" />{" "}
                        Active
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-stone-300/60 text-stone-600 text-[10px] font-semibold border border-stone-400/40 flex items-center gap-1">
                        <Moon className="w-3.5 h-3.5 text-stone-500" /> Inactive
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Daily Feed Photos */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Camera className="w-5 h-5 text-amber-900" /> Live Feed Bukti Foto
            Hari Ini
          </h2>

          {proofs.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#FAF9F6] border border-stone-300 text-center space-y-2">
              <Camera className="w-8 h-8 text-stone-400 mx-auto" />
              <p className="text-xs text-stone-500 font-medium">
                Belum ada foto bukti yang di-upload di room ini hari ini.
              </p>
              <p className="text-[11px] text-stone-400">
                Jadilah yang pertama mengunggah foto bukti!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {proofs.map((proof: any) => {
                const isMyProof =
                  proof.user?.name === currentUserName ||
                  proof.user?.email === currentUserName;

                return (
                  <div
                    key={proof.id}
                    className="p-5 rounded-2xl bg-[#FAF9F6] border border-stone-300 shadow-sm space-y-4 hover:shadow-md transition overflow-hidden min-w-0"
                  >
                    {/* User Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-amber-900/10 text-amber-900 font-bold text-xs flex items-center justify-center border border-amber-900/20 shrink-0">
                          {proof.user?.name
                            ? proof.user.name.charAt(0).toUpperCase()
                            : "U"}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-stone-900 truncate">
                            {proof.user?.name || "Pengguna"}
                          </h4>
                          <span className="text-[10px] text-stone-400">
                            {new Date(proof.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Edit Button untuk Postingan Milik Sendiri */}
                      {isMyProof && (
                        <button
                          onClick={() => setEditingProof(proof)}
                          className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#EAE6DD] border border-stone-300 text-stone-700 hover:text-amber-900 hover:border-amber-900/40 transition cursor-pointer shrink-0"
                        >
                          <Pencil className="w-3.5 h-3.5 text-amber-900" /> Edit
                        </button>
                      )}
                    </div>

                    {/* Photo */}
                    <div className="rounded-xl overflow-hidden border border-stone-300 bg-white">
                      <img
                        src={proof.photoUrl}
                        alt="Bukti Aktivitas"
                        className="w-full max-h-96 object-cover"
                      />
                    </div>

                    {/* Note/Caption dengan Pemutus Kata Otomatis (Anti Overflow) */}
                    <div className="pt-1 min-w-0 overflow-hidden">
                      <p className="text-xs text-stone-800 font-medium break-words [overflow-wrap:anywhere] whitespace-pre-wrap leading-relaxed">
                        {proof.note || "Berhasil check-in!"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Check-In Modal */}
      <CheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        roomId={room.id}
        roomName={room.name}
        habitTitle={room.habitTitle}
        onSuccess={handleAddProofSuccess}
      />

      {/* Edit Proof Modal */}
      <EditProofModal
        isOpen={!!editingProof}
        onClose={() => setEditingProof(null)}
        proofId={editingProof?.id}
        initialNote={editingProof?.note}
        photoUrl={editingProof?.photoUrl}
        onSuccess={handleAddProofSuccess}
      />
    </div>
  );
}
