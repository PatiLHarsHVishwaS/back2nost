import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { ParticleStarfield } from './components/ParticleStarfield';
import { CrtOverlay } from './components/CrtOverlay';

import { LandingPage } from './pages/LandingPage';
import { ExplorePage } from './pages/ExplorePage';
import { CommunityListPage } from './pages/CommunityListPage';
import { CommunityDetailPage } from './pages/CommunityDetailPage';
import { ChatPage } from './pages/ChatPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { CreatePostPage } from './pages/CreatePostPage';
import { ProfilePage } from './pages/ProfilePage';
import { TimeCapsulePage } from './pages/TimeCapsulePage';
import { SearchPage } from './pages/SearchPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

export const App = () => {
  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col relative selection:bg-retro-amber/30 selection:text-amber-200">
      {/* Dynamic Time-Space Background Starfield Canvas */}
      <ParticleStarfield />

      {/* Retro CRT Scanline Filter Toggle */}
      <CrtOverlay />

      {/* Main Top Navbar */}
      <Navbar />

      {/* Main Page Routes */}
      <main className="flex-1 pb-20 md:pb-8 relative z-10">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/community" element={<CommunityListPage />} />
          <Route path="/community/:id" element={<CommunityDetailPage />} />
          <Route path="/chat/:communityId" element={<ChatPage />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route path="/create" element={<CreatePostPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/time-capsule" element={<TimeCapsulePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />
    </div>
  );
};

export default App;
