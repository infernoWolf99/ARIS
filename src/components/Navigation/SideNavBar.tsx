import React from 'react';
import { useApp } from '../../context/AppContext';
import { ViewMode } from '../../types';

interface SideNavBarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const SideNavBar: React.FC<SideNavBarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { activeView, setActiveView, setQuickActionOpen, currentUser, logout } = useApp();

  const navItems: { id: ViewMode; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'facility', label: 'Facility Setup', icon: 'settings_applications' },
    { id: 'registration', label: 'Registration', icon: 'person_add' },
    { id: 'obstetric', label: 'Obstetric History', icon: 'history_edu' },
    { id: 'anc', label: 'ANC Visits', icon: 'event_note' },
    { id: 'delivery', label: 'Delivery Records', icon: 'child_care' },
    { id: 'pnc', label: 'PNC Mother', icon: 'female' },
    { id: 'child', label: 'Child Profile', icon: 'child_friendly' },
    { id: 'coc', label: 'CoC Tracker', icon: 'timeline' },
  ];

  const handleNavClick = (view: ViewMode) => {
    setActiveView(view);
    if (onCloseMobile) onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col h-full py-6 px-4 overflow-y-auto bg-[#f0f3ff] text-[#111c2d] border-r border-[#bdc9c8]">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-6 px-2">
        <div className="w-10 h-10 rounded-full bg-[#005f5e] flex items-center justify-center text-white font-black text-sm shrink-0 shadow-xs">
          GHS
        </div>
        <div>
          <h1 className="font-headline-sm text-lg font-black text-[#005f5e]">ARIS</h1>
          <p className="font-label-sm text-xs text-[#3e4948]">GHS Antenatal Records</p>
        </div>
      </div>

      {/* Quick Action Button */}
      <button
        onClick={() => {
          setQuickActionOpen(true);
          if (onCloseMobile) onCloseMobile();
        }}
        className="w-full bg-[#005f5e] text-white py-3 px-4 rounded-lg font-label-md text-sm mb-6 flex items-center justify-center gap-2 hover:bg-[#007a78] transition-colors shadow-xs cursor-pointer active:scale-98"
      >
        <span className="material-symbols-outlined text-xl icon-fill">add</span>
        Quick Action
      </button>

      {/* Navigation List */}
      <ul className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <li key={item.id}>
              <button
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-label-md text-sm transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#005f5e] text-white shadow-xs font-bold border-l-4 border-[#abfffc]'
                    : 'text-[#3e4948] hover:bg-[#dee8ff] hover:text-[#111c2d]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`material-symbols-outlined text-xl ${
                      isActive ? 'icon-fill text-[#abfffc]' : ''
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.id === 'coc' && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#005f5e]/10 text-[#005f5e]'
                    }`}
                  >
                    80%
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Footer Items & User Profile */}
      <div className="mt-auto border-t border-[#bdc9c8] pt-4 space-y-3">
        {currentUser && (
          <div className="flex items-center gap-3 px-2 py-2 bg-[#dee8ff]/60 rounded-xl border border-[#bdc9c8]/50">
            <div className="w-9 h-9 rounded-full bg-[#007a78] text-[#abfffc] font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
              {currentUser.staffMember.initials || 'AJ'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#111c2d] truncate">
                {currentUser.staffMember.name}
              </p>
              <p className="text-[10px] text-[#005f5e] font-semibold truncate">
                {currentUser.staffMember.role}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            alert('Support Helpdesk: Ghana Health Service IT Support (Toll-free 333 or support@ghs.gov.gh)');
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full flex items-center gap-3 text-[#3e4948] px-3.5 py-2.5 hover:bg-[#dee8ff] rounded-lg transition-all font-label-md text-xs sm:text-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">help</span>
          <span>Support Desk</span>
        </button>

        <button
          onClick={() => {
            logout();
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full flex items-center gap-3 text-[#ba1a1a] bg-[#ba1a1a]/5 hover:bg-[#ba1a1a]/15 border border-[#ba1a1a]/20 px-3.5 py-2.5 rounded-xl transition-all font-label-md text-xs sm:text-sm font-bold cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          <span>Sign Out / Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:block fixed left-0 top-0 h-screen w-64 z-40">
        {navContent}
      </nav>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative w-64 h-full z-10">{navContent}</div>
        </div>
      )}
    </>
  );
};
