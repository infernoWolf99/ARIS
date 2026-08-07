import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const NewStaffModal: React.FC = () => {
  const { newStaffModalOpen, setNewStaffModalOpen, addStaffMember } = useApp();

  const [name, setName] = useState('');
  const [role, setRole] = useState('Senior Midwife');
  const [contact, setContact] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  if (!newStaffModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const names = name.trim().split(' ');
    const initials =
      names.length > 1
        ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
        : name.slice(0, 2).toUpperCase();

    addStaffMember({
      name,
      initials,
      role,
      contact: contact || '+233 20 000 0000',
      status,
      colorClass: 'bg-[#007a78] text-[#abfffc]',
    });

    setName('');
    setContact('');
    setNewStaffModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs"
        onClick={() => setNewStaffModalOpen(false)}
      />

      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-[#bdc9c8]/40 z-10">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#bdc9c8]/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#005f5e]">group_add</span>
            <h3 className="font-headline-sm text-base font-bold text-[#111c2d]">
              Add Healthcare Staff
            </h3>
          </div>
          <button
            onClick={() => setNewStaffModalOpen(false)}
            className="text-[#6e7978] hover:bg-[#f0f3ff] p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#3e4948] mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Kojo Mensah"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-[#ffffff] border border-[#cbd5e1] rounded-lg focus:outline-none focus:border-[#005f5e] text-sm text-[#111c2d]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3e4948] mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 bg-[#ffffff] border border-[#cbd5e1] rounded-lg focus:outline-none focus:border-[#005f5e] text-sm text-[#111c2d]"
            >
              <option>Senior Midwife</option>
              <option>Midwife</option>
              <option>Obstetrician</option>
              <option>Community Health Nurse</option>
              <option>Data Entry Clerk</option>
              <option>Senior Consultant</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3e4948] mb-1">
              Contact Phone Number
            </label>
            <input
              type="text"
              placeholder="+233 24 000 0000"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full px-3 py-2 bg-[#ffffff] border border-[#cbd5e1] rounded-lg focus:outline-none focus:border-[#005f5e] text-sm text-[#111c2d]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3e4948] mb-1">
              Account Status
            </label>
            <div className="flex gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#111c2d]">
                <input
                  type="radio"
                  name="status"
                  value="Active"
                  checked={status === 'Active'}
                  onChange={() => setStatus('Active')}
                  className="text-[#005f5e] focus:ring-[#005f5e]"
                />
                Active
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#111c2d]">
                <input
                  type="radio"
                  name="status"
                  value="Inactive"
                  checked={status === 'Inactive'}
                  onChange={() => setStatus('Inactive')}
                  className="text-[#005f5e] focus:ring-[#005f5e]"
                />
                Inactive
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-[#bdc9c8]/30 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setNewStaffModalOpen(false)}
              className="px-4 py-2 border border-[#bdc9c8] text-[#3e4948] text-xs font-semibold rounded-lg hover:bg-[#f0f3ff] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#005f5e] text-white text-xs font-semibold rounded-lg hover:bg-[#007a78] transition-colors shadow-xs cursor-pointer"
            >
              Save Staff Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
