import React from 'react';
import { NavTab } from '../types';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isMobileDrawerOpen: boolean;
  onCloseMobileDrawer: () => void;
  shoppingListBadgeCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isMobileDrawerOpen,
  onCloseMobileDrawer,
  shoppingListBadgeCount = 4,
}) => {
  const navItems: { tab: NavTab; label: string; icon: string; badge?: number }[] = [
    { tab: 'menu-catalog', label: 'Menu Catalog', icon: 'restaurant_menu' },
    { tab: 'recipe-customizer', label: 'Recipe Customizer', icon: 'tune' },
    { tab: 'shopping-list', label: 'Shopping List', icon: 'local_mall', badge: shoppingListBadgeCount },
    { tab: 'saved-collections', label: 'Saved Collections', icon: 'bookmarks' },
    { tab: 'settings', label: 'Settings', icon: 'settings' },
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    onCloseMobileDrawer();
  };

  const navContent = (
    <>
      <div className="flex flex-col gap-6">
        {/* Brand header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#bccac0]/25">
          <button
            onClick={() => handleNavClick('menu-catalog')}
            className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
          >
            <img
              alt="Savor Brand Logo"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida/AEtjO1UY9Flg-n3NxbgejFd5SlxSNJXTPMXWIcFpuy2yTdgOaPksaPmwPZwQGnGgKJ7vgWkQ72z0Qc5WqWc_FUUgUp8ANG1HiJjGlIV7iKRdAALbWTJJGbiinZbu2yizIVA7wxKhXV6O4H5OipniWt6csO_R3CWELZARpAgF2QCyAcYyfzvjEtJPo1ZGAD9hbmUe7RQgWOYrfd3NAyfEn8Cf_LigYg9aGKpJY1iB9APY0clnqrlEFHsZEMYzkTVd"
            />
            <span className="text-2xl font-bold tracking-tight text-[#006948]">Savor</span>
          </button>
          {isMobileDrawerOpen && (
            <button
              onClick={onCloseMobileDrawer}
              aria-label="Close menu"
              className="p-1.5 rounded-lg text-[#6d7a72] hover:text-[#131b2e] hover:bg-[#e2e7ff] transition-colors lg:hidden cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          )}
        </div>

        {/* Navigation list */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = currentTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => handleNavClick(item.tab)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all font-semibold text-sm cursor-pointer ${
                  isActive
                    ? 'bg-[#6cf8bb] text-[#00714d] shadow-sm font-bold'
                    : 'text-[#3d4a42] hover:bg-[#e2e7ff] hover:text-[#131b2e]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`material-symbols-outlined text-xl ${
                      isActive ? 'text-[#00714d]' : 'text-[#6d7a72]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-[#00714d] text-white'
                        : 'bg-[#eaedff] text-[#3d4a42]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User profile / bottom card */}
      <div className="pt-4 border-t border-[#bccac0]/30 flex items-center justify-between bg-white/70 p-3 rounded-xl shadow-xs">
        <div className="flex items-center gap-3">
          <img
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-[#e2e7ff]"
            src="https://lh3.googleusercontent.com/aida/AEtjO1VcZJHcWlLKb_8tEg3eIPhRKZv0IAQ2kifrHQ-32-0YfhUCHiW9c9IODlACqRQeTREI3UpJRI4H67M8sXzJdTRzy06TNGByM2JqALjzIWh-Y6S4r-uZ5zss8AxaPPhXKoc1Tc2t9T2n1cRGqw0CmgpttXncAyPNiw91hJ-6OhCTO_m6o1IVGu8cw-t3i1FcwHCHbosTrv_3TbQZO7_ZzhO7rh1Y7rDW_CchOBzkBkp0AJNXfJCvV6Bo2n8"
          />
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-[#131b2e]">Mindful Culinary</span>
            <span className="text-[11px] text-[#3d4a42]">Kitchen Rituals</span>
          </div>
        </div>
        <span className="material-symbols-outlined text-[#006948] text-xl">eco</span>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-72 bg-[#f2f3ff]/95 backdrop-blur-xl z-30 flex-col justify-between p-6 shadow-[0_1px_8px_rgba(0,0,0,0.03)] border-r border-[#bccac0]/25">
        {navContent}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {isMobileDrawerOpen && (
        <div
          className="fixed inset-0 bg-[#283044]/45 backdrop-blur-xs z-50 transition-opacity duration-300 lg:hidden"
          onClick={onCloseMobileDrawer}
        >
          <div
            className="fixed left-0 top-0 bottom-0 w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col justify-between p-6 z-50 transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
