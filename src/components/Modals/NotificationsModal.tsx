import React from 'react';
import { useApp } from '../../context/AppContext';

export const NotificationsModal: React.FC = () => {
  const { notificationsOpen, setNotificationsOpen, notifications, markNotificationRead } = useApp();

  if (!notificationsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs"
        onClick={() => setNotificationsOpen(false)}
      />

      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-[#bdc9c8]/40 z-10">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#bdc9c8]/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#005f5e]">notifications</span>
            <h3 className="font-headline-sm text-base font-bold text-[#111c2d]">
              System & Clinical Notices
            </h3>
          </div>
          <button
            onClick={() => setNotificationsOpen(false)}
            className="text-[#6e7978] hover:bg-[#f0f3ff] p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                n.read
                  ? 'bg-[#f8fafc] border-[#e2e8f0] opacity-80'
                  : 'bg-[#fd7a8c]/10 border-[#fd7a8c]/40'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-semibold text-xs text-[#111c2d] flex items-center gap-1.5">
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-[#ba1a1a] inline-block" />
                  )}
                  {n.title}
                </h4>
                <span className="text-[10px] text-[#6e7978]">{n.time}</span>
              </div>
              <p className="text-xs text-[#3e4948] leading-relaxed">{n.message}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-[#bdc9c8]/30 flex justify-end">
          <button
            onClick={() => setNotificationsOpen(false)}
            className="px-4 py-1.5 bg-[#005f5e] text-white text-xs font-semibold rounded-lg hover:bg-[#007a78] transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
