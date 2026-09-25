import React, { useState } from 'react';

interface HeaderProps {
  onOpenMobileDrawer: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showSearchBar?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileDrawer,
  searchQuery,
  setSearchQuery,
  showSearchBar = true,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-[#ffffff]/85 backdrop-blur-xl z-40 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-[#bccac0]/25 shadow-[0_1px_4px_rgba(0,0,0,0.02)] transition-all">
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
        {/* Mobile drawer toggle */}
        <button
          aria-label="Open navigation menu"
          className="lg:hidden p-2 rounded-lg text-[#3d4a42] hover:text-[#131b2e] hover:bg-[#e2e7ff] transition-colors focus:outline-none flex items-center justify-center cursor-pointer"
          onClick={onOpenMobileDrawer}
          type="button"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>

        {/* Mobile Logo */}
        <div className="flex lg:hidden items-center gap-2 mr-2">
          <img
            alt="Savor Brand Logo"
            className="h-7 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1UY9Flg-n3NxbgejFd5SlxSNJXTPMXWIcFpuy2yTdgOaPksaPmwPZwQGnGgKJ7vgWkQ72z0Qc5WqWc_FUUgUp8ANG1HiJjGlIV7iKRdAALbWTJJGbiinZbu2yizIVA7wxKhXV6O4H5OipniWt6csO_R3CWELZARpAgF2QCyAcYyfzvjEtJPo1ZGAD9hbmUe7RQgWOYrfd3NAyfEn8Cf_LigYg9aGKpJY1iB9APY0clnqrlEFHsZEMYzkTVd"
          />
          <span className="font-bold text-lg text-[#006948] tracking-tight">Savor</span>
        </div>

        {/* Search Bar in Header if desired */}
        {showSearchBar && (
          <div className="w-full relative hidden sm:flex items-center">
            <span className="material-symbols-outlined absolute left-3.5 text-[#6d7a72] pointer-events-none text-xl">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes, ingredients, tags..."
              className="w-full bg-[#f2f3ff] py-2 pl-10 pr-4 rounded-full text-sm text-[#131b2e] placeholder:text-[#6d7a72]/70 focus:outline-none focus:bg-[#ffffff] focus:ring-2 focus:ring-[#006948]/20 transition-all border border-transparent focus:border-[#006948]/30"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-[#6d7a72] hover:text-[#131b2e] text-xs"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 sm:gap-4 relative">
        {/* Notification Bell */}
        <div className="relative">
          <button
            aria-label="Notifications"
            className="relative p-2 rounded-full text-[#3d4a42] hover:text-[#131b2e] hover:bg-[#e2e7ff] transition-colors cursor-pointer"
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <span className="material-symbols-outlined text-2xl">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#006948] ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#bccac0]/30 py-3 z-50">
              <div className="px-4 py-2 border-b border-[#bccac0]/20 flex items-center justify-between">
                <span className="font-semibold text-sm text-[#131b2e]">Kitchen Reminders</span>
                <span className="text-[11px] bg-[#6cf8bb]/50 text-[#00714d] px-2 py-0.5 rounded-full font-bold">2 New</span>
              </div>
              <div className="flex flex-col divide-y divide-[#bccac0]/15">
                <div className="px-4 py-3 hover:bg-[#f2f3ff] transition-colors flex gap-3 cursor-pointer">
                  <span className="material-symbols-outlined text-[#006948] text-xl mt-0.5">timer</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#131b2e]">Weekly Plan Synced</span>
                    <span className="text-[11px] text-[#3d4a42]">4 recipes and 18 grocery items ready for active week.</span>
                  </div>
                </div>
                <div className="px-4 py-3 hover:bg-[#f2f3ff] transition-colors flex gap-3 cursor-pointer">
                  <span className="material-symbols-outlined text-[#825100] text-xl mt-0.5">restaurant</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#131b2e]">Pantry Harvest Note</span>
                    <span className="text-[11px] text-[#3d4a42]">Fresh rosemary & thyme harvested from balcony garden.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2">
          <img
            alt="Profile"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-[#e2e7ff] cursor-pointer hover:ring-[#006948] transition-all"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDafo-DbNRv7Y_6cFOmVd1-vw2Y3FhWLXRj4QzK3AdUeYrJi06c0aIE4I7DuRIGA-LOC7bT7XWGbLwvllZy1-fsxxX38JTpfQd9SLPOYDq2z5jaVTFlPd0mAT85ZNxMYXcoEqkht0_6PIehY6WEatNSqoTNM0bF9dXJIkje-J3v-1NVI_Ve4Gfd784WtXUZd_kc3AeqlDeNqrtB20WbKAjPes6vWz5-UnZYyNEvhFU4nfU2YMwUJ56bwA"
          />
        </div>
      </div>
    </header>
  );
};

