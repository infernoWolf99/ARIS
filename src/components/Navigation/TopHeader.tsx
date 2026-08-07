import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { KhayaTranslatorWidget } from '../KhayaAI/KhayaTranslatorWidget';

interface TopHeaderProps {
  onOpenMobileNav: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenMobileNav }) => {
  const {
    facility,
    availableFacilitiesList,
    switchFacilityByName,
    searchQuery,
    setSearchQuery,
    notifications,
    setNotificationsOpen,
    patients,
    setActivePatient,
    setActiveView,
    currentUser,
    logout,
  } = useApp();


  const [facilityDropdownOpen, setFacilityDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setFacilityDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredPatientSearch = searchQuery.trim()
    ? patients.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.nhisNo.includes(searchQuery)
      )
    : [];

  return (
    <header className="sticky top-0 z-30 flex justify-between items-center w-full px-4 md:px-8 bg-white dark:bg-[#263143] h-16 border-b border-[#bdc9c8]/30 shadow-xs">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onOpenMobileNav}
          className="md:hidden p-2 text-[#3e4948] hover:bg-[#e7eeff] rounded-full transition-colors cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        {/* ARIS title on mobile */}
        <div className="md:hidden font-headline-md font-bold text-[#005f5e]">ARIS</div>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex relative text-[#3e4948] w-64 lg:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6e7978] text-xl">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            placeholder="Search patients, ID, NHIS..."
            className="w-full pl-10 pr-4 py-2 bg-[#f0f3ff] border border-[#bdc9c8]/40 rounded-xl focus:ring-2 focus:ring-[#005f5e] focus:border-[#005f5e] focus:bg-white text-xs transition-all outline-none"
          />

          {/* Search Results Dropdown */}
          {searchFocused && filteredPatientSearch.length > 0 && (
            <div className="absolute left-0 right-0 top-12 bg-white border border-[#bdc9c8] rounded-xl shadow-lg z-50 overflow-hidden max-h-80 overflow-y-auto">
              <div className="p-2 text-xs font-semibold text-[#6e7978] bg-[#f8fafc]">
                Matching Patients ({filteredPatientSearch.length})
              </div>
              {filteredPatientSearch.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setActivePatient(p);
                    setActiveView('anc');
                    setSearchQuery('');
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-[#f0f3ff] border-b border-[#e2e8f0] flex justify-between items-center transition-colors cursor-pointer"
                >
                  <div>
                    <div className="font-semibold text-sm text-[#111c2d]">{p.name}</div>
                    <div className="text-xs text-[#6e7978]">
                      ID: {p.id} • Gestation: {p.gestationWeeks} Weeks
                    </div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-[#007a78]/10 text-[#005f5e]">
                    {p.riskStatus}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Khaya AI Translator Widget */}
        <KhayaTranslatorWidget />

        {/* Notifications Icon */}
        <button
          onClick={() => setNotificationsOpen(true)}
          className="p-2 text-[#3e4948] hover:bg-[#e7eeff] rounded-full transition-colors relative cursor-pointer"
          title="Notifications"
        >
          <span className="material-symbols-outlined">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full ring-2 ring-white" />
          )}
        </button>

        {/* Settings button */}
        <button
          onClick={() => setActiveView('facility')}
          className="p-2 text-[#3e4948] hover:bg-[#e7eeff] rounded-full transition-colors cursor-pointer"
          title="Facility Setup & Settings"
        >
          <span className="material-symbols-outlined">settings</span>
        </button>

        <div className="h-6 w-px bg-[#bdc9c8] mx-1 hidden sm:block" />

        {/* Facility Switcher Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setFacilityDropdownOpen(!facilityDropdownOpen)}
            className="flex items-center gap-1.5 text-sm font-semibold text-[#111c2d] hover:text-[#005f5e] transition-colors py-1 px-2.5 rounded-lg border border-[#bdc9c8]/50 bg-[#f0f3ff] hover:bg-[#dee8ff] cursor-pointer"
          >
            <span className="truncate max-w-[140px] sm:max-w-[200px]">{facility.name}</span>
            <span className="material-symbols-outlined text-lg">expand_more</span>
          </button>

          {facilityDropdownOpen && (
            <div className="absolute right-0 top-11 w-64 bg-white border border-[#bdc9c8] rounded-xl shadow-lg z-50 py-1 overflow-hidden">
              <div className="px-3 py-2 text-xs font-semibold text-[#6e7978] bg-[#f8fafc] border-b border-[#e2e8f0]">
                Select Healthcare Facility
              </div>
              {availableFacilitiesList.map((fname) => (
                <button
                  key={fname}
                  onClick={() => {
                    switchFacilityByName(fname);
                    setFacilityDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-xs sm:text-sm font-medium hover:bg-[#f0f3ff] transition-colors flex items-center justify-between cursor-pointer ${
                    facility.name === fname ? 'bg-[#abfffc]/30 text-[#005f5e] font-bold' : 'text-[#111c2d]'
                  }`}
                >
                  <span className="truncate">{fname}</span>
                  {facility.name === fname && (
                    <span className="material-symbols-outlined text-base text-[#005f5e]">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Provider Profile Badge & Logout Button */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 border-l border-[#bdc9c8]/40 pl-2">
          <div className="hidden lg:flex flex-col text-right leading-tight">
            <span className="text-xs font-bold text-[#111c2d]">
              {currentUser?.staffMember.name || 'Ama Jumah'}
            </span>
            <span className="text-[10px] text-[#005f5e] font-semibold">
              {currentUser?.staffMember.role || 'Senior Midwife'}
            </span>
          </div>

          <div
            className="w-8 h-8 rounded-full bg-[#007a78] text-[#abfffc] font-bold text-xs flex items-center justify-center shadow-xs border border-[#005f5e]/30 shrink-0"
            title={`${currentUser?.staffMember.name} (${currentUser?.staffMember.role})`}
          >
            {currentUser?.staffMember.initials || 'AJ'}
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-[#ba1a1a] bg-[#ba1a1a]/5 hover:bg-[#ba1a1a]/15 border border-[#ba1a1a]/20 rounded-lg transition-all cursor-pointer font-bold text-xs active:scale-95 min-h-[36px]"
            title="Sign Out of ARIS Platform"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );

};
