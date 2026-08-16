import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { RoomDetailPage } from './pages/RoomDetailPage';
import { CreateRoomModal } from './components/CreateRoomModal';
import { JoinRoomModal } from './components/JoinRoomModal';

// Protected Route Component Guard
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}

export function App() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  // Auth Guard Handler
  const handleOpenCreateModal = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
    } else {
      setIsCreateOpen(true);
    }
  };

  const handleOpenJoinModal = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
    } else {
      setIsJoinOpen(true);
    }
  };

  // Auto-refresh callback after Create or Join Room
  const handleRoomSuccess = (room: any) => {
    setRefreshKey((prev) => prev + 1);
    if (room?.id) {
      navigate(`/room/${room.id}`);
    } else {
      if (window.location.pathname === '/dashboard') {
        window.location.reload();
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F0EA] text-stone-900 font-sans selection:bg-amber-900 selection:text-amber-50 flex flex-col justify-between">
      <div>
        <Navbar
          onOpenCreateModal={handleOpenCreateModal}
          onOpenJoinModal={handleOpenJoinModal}
        />

        <main className="px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route
              path="/"
              element={
                <LandingPage
                  onOpenCreateModal={handleOpenCreateModal}
                  onOpenJoinModal={handleOpenJoinModal}
                />
              }
            />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Protected Routes (Wajib Login) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage
                    key={refreshKey}
                    onOpenCreateModal={handleOpenCreateModal}
                    onOpenJoinModal={handleOpenJoinModal}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/room/:id"
              element={
                <ProtectedRoute>
                  <RoomDetailPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>

      {/* Global Modals */}
      <CreateRoomModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handleRoomSuccess}
      />

      <JoinRoomModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        onSuccess={handleRoomSuccess}
      />

      {/* Footer */}
      <footer className="w-full border-t border-stone-200/80 py-6 text-center text-xs text-stone-500">
        HabitDuel &copy; 2026 • Multiplayer Habit Tracker with Proof Upload
      </footer>
    </div>
  );
}

export default App;
