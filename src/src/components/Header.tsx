import React, { useState } from 'react';
import { NavTab } from '../types';

interface HeaderProps {
  onOpenMobileDrawer: () => void;
  onSelectTab: (tab: NavTab) => void;
  searchTerm: string;
  onSearchChange: (query: string) => void;
  selectedRecipesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileDrawer,
  onSelectTab,
  searchTerm,
  onSearchChange,
  selectedRecipesCount,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-white/90 backdrop-blur-xl z-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-[#bccac0]/25 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
      {/* Left zone: Drawer button & Logo on mobile */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileDrawer}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 rounded-lg text-[#3d4a42] hover:text-[#131b2e] hover:bg-[#e2e7ff] transition-colors focus:outline-none flex items-center justify-center cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>

        <div
          onClick={() => onSelectTab('menu-catalog')}
          className="flex lg:hidden items-center gap-2 cursor-pointer"
        >
          <img
            alt="Savor Brand Logo"
            className="h-7 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1UY9Flg-n3NxbgejFd5SlxSNJXTPMXWIcFpuy2yTdgOaPksaPmwPZwQGnGgKJ7vgWkQ72z0Qc5WqWc_FUUgUp8ANG1HiJjGlIV7iKRdAALbWTJJGbiinZbu2yizIVA7wxKhXV6O4H5OipniWt6csO_R3CWELZARpAgF2QCyAcYyfzvjEtJPo1ZGAD9hbmUe7RQgWOYrfd3NAyfEn8Cf_LigYg9aGKpJY1iB9APY0clnqrlEFHsZEMYzkTVd"
          />
          <span className="text-xl font-bold tracking-tight text-[#006948]">Savor</span>
        </div>

        {/* Global quick search bar on desktop header */}
        <div className="hidden md:flex items-center relative w-72 lg:w-96">
          <span className="material-symbols-outlined absolute left-3.5 text-[#6d7a72] text-xl pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search recipes, ingredients, tags..."
            className="w-full bg-[#f2f3ff] pl-10 pr-8 py-2 rounded-full text-sm text-[#131b2e] placeholder:text-[#6d7a72]/70 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#006948]/25 transition-all shadow-xs"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 text-[#6d7a72] hover:text-[#131b2e] cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Right zone: Notifications & User profile */}
      <div className="flex items-center gap-3">
        {/* Quick link to Shopping List */}
        <button
          onClick={() => onSelectTab('shopping-list')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#eaedff] hover:bg-[#6cf8bb]/40 text-[#00714d] text-xs font-semibold transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">local_mall</span>
          <span>{selectedRecipesCount} Dishes Planned</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="relative p-2 rounded-full text-[#3d4a42] hover:text-[#131b2e] hover:bg-[#e2e7ff] transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-2xl">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#006948] ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#bccac0]/30 py-3 px-4 z-50 text-left">
              <div className="flex items-center justify-between pb-2 border-b border-[#bccac0]/20 mb-2">
                <span className="text-xs font-bold text-[#131b2e] uppercase tracking-wider">Weekly Kitchen Alerts</span>
                <span className="text-[11px] text-[#006948] font-semibold">Mark read</span>
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="flex gap-2.5 items-start p-2 rounded-lg bg-[#f2f3ff]">
                  <span className="material-symbols-outlined text-[#006948] text-lg mt-0.5">outdoor_grill</span>
                  <div className="text-xs">
                    <p className="font-semibold text-[#131b2e]">Prep Day Scheduled</p>
                    <p className="text-[#3d4a42]">Sunday meal prep batch: Tuscan Chicken & Veggie bowls ready.</p>
                  </div>
                </div>
                <div className="flex gap-2.5 items-start p-2 rounded-lg hover:bg-[#f2f3ff] transition-colors">
                  <span className="material-symbols-outlined text-[#825100] text-lg mt-0.5">local_mall</span>
                  <div className="text-xs">
                    <p className="font-semibold text-[#131b2e]">Shopping List Synced</p>
                    <p className="text-[#3d4a42]">14 items remaining in produce & pantry aisles.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div
          onClick={() => onSelectTab('settings')}
          className="flex items-center gap-2 cursor-pointer group"
          title="Account Settings"
        >
          <img
            alt="Profile"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-[#e2e7ff] group-hover:ring-[#006948] transition-all"
            src="https://lh3.googleusercontent.com/aida/AEtjO1VcZJHcWlLKb_8tEg3eIPhRKZv0IAQ2kifrHQ-32-0YfhUCHiW9c9IODlACqRQeTREI3UpJRI4H67M8sXzJdTRzy06TNGByM2JqALjzIWh-Y6S4r-uZ5zss8AxaPPhXKoc1Tc2t9T2n1cRGqw0CmgpttXncAyPNiw91hJ-6OhCTO_m6o1IVGu8cw-t3i1FcwHCHbosTrv_3TbQZO7_ZzhO7rh1Y7rDW_CchOBzkBkp0AJNXfJCvV6Bo2n8"
          />
        </div>
      </div>
    </header>
  );
};
