import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const FacilitySetupView: React.FC = () => {
  const { facility, setFacility, staffList, setNewStaffModalOpen, showToast } = useApp();

  const [editingFacility, setEditingFacility] = useState(false);
  const [formData, setFormData] = useState(facility);

  const handleSaveFacility = (e: React.FormEvent) => {
    e.preventDefault();
    setFacility(formData);
    setEditingFacility(false);
    showToast('Facility metadata updated successfully');
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#111c2d] tracking-tight">
          System Setup & User Management
        </h1>
        <p className="text-xs sm:text-sm text-[#3e4948]">
          Configure facility profile details, administrative settings, and manage staff user accounts.
        </p>
      </div>

      {/* Facility Metadata Card */}
      <div className="bg-white rounded-2xl border border-[#bdc9c8]/40 p-6 shadow-xs">
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#bdc9c8]/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#005f5e] text-2xl">
              domain
            </span>
            <h2 className="text-base font-bold text-[#111c2d]">
              Healthcare Facility Profile
            </h2>
          </div>
          {!editingFacility ? (
            <button
              onClick={() => setEditingFacility(true)}
              className="px-3 py-1.5 bg-[#f0f3ff] text-[#005f5e] hover:bg-[#dee8ff] border border-[#bdc9c8]/50 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
              Edit Details
            </button>
          ) : (
            <button
              onClick={() => setEditingFacility(false)}
              className="px-3 py-1.5 bg-[#f0f3ff] text-[#3e4948] hover:bg-[#dee8ff] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>

        {!editingFacility ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-xs text-[#6e7978] font-medium mb-1">Facility Name</p>
              <p className="font-bold text-[#111c2d]">{facility.name}</p>
            </div>
            <div>
              <p className="text-xs text-[#6e7978] font-medium mb-1">Facility Type</p>
              <p className="font-semibold text-[#111c2d]">{facility.type}</p>
            </div>
            <div>
              <p className="text-xs text-[#6e7978] font-medium mb-1">Region</p>
              <p className="font-semibold text-[#111c2d]">{facility.region}</p>
            </div>
            <div>
              <p className="text-xs text-[#6e7978] font-medium mb-1">District</p>
              <p className="font-semibold text-[#111c2d]">{facility.district}</p>
            </div>
            <div>
              <p className="text-xs text-[#6e7978] font-medium mb-1">Sub-District</p>
              <p className="font-semibold text-[#111c2d]">{facility.subDistrict}</p>
            </div>
            <div>
              <p className="text-xs text-[#6e7978] font-medium mb-1">GHS Code</p>
              <p className="font-semibold text-[#005f5e]">GAR-KL-0042</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveFacility} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#3e4948] mb-1">
                Facility Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg text-sm focus:outline-none focus:border-[#005f5e]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#3e4948] mb-1">
                Facility Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg text-sm focus:outline-none focus:border-[#005f5e]"
              >
                <option>Hospital</option>
                <option>Polyclinic</option>
                <option>Health Center</option>
                <option>CHPS Compound</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#3e4948] mb-1">
                Region
              </label>
              <input
                type="text"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg text-sm focus:outline-none focus:border-[#005f5e]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#3e4948] mb-1">
                District
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg text-sm focus:outline-none focus:border-[#005f5e]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#3e4948] mb-1">
                Sub-District
              </label>
              <input
                type="text"
                value={formData.subDistrict}
                onChange={(e) => setFormData({ ...formData, subDistrict: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg text-sm focus:outline-none focus:border-[#005f5e]"
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingFacility(false)}
                className="px-4 py-2 border border-[#bdc9c8] text-xs font-semibold rounded-lg text-[#3e4948] hover:bg-[#f0f3ff] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#005f5e] text-white text-xs font-semibold rounded-lg hover:bg-[#007a78] transition-colors shadow-xs cursor-pointer"
              >
                Save Facility Changes
              </button>
            </div>
          </form>
        )}
      </div>

      {/* User Access & Staff Roster Table */}
      <div className="bg-white rounded-2xl border border-[#bdc9c8]/40 p-6 shadow-xs">
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#bdc9c8]/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#005f5e] text-2xl">
              badge
            </span>
            <div>
              <h2 className="text-base font-bold text-[#111c2d]">
                User Access & Role Permissions
              </h2>
              <p className="text-xs text-[#6e7978]">
                Authorized healthcare personnel and clinical staff members.
              </p>
            </div>
          </div>
          <button
            onClick={() => setNewStaffModalOpen(true)}
            className="px-4 py-2 bg-[#005f5e] text-white text-xs font-semibold rounded-lg hover:bg-[#007a78] transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Add New User
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#bdc9c8]/40 text-xs font-bold text-[#6e7978] bg-[#f8fafc]">
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Role / Title</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {staffList.map((staff) => (
                <tr key={staff.id} className="hover:bg-[#f0f3ff]/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          staff.colorClass || 'bg-[#007a78] text-white'
                        }`}
                      >
                        {staff.initials}
                      </div>
                      <div>
                        <div className="font-bold text-[#111c2d]">{staff.name}</div>
                        <div className="text-[11px] text-[#6e7978]">ID: {staff.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#3e4948]">{staff.role}</td>
                  <td className="py-3.5 px-4 text-xs font-mono text-[#111c2d]">
                    {staff.contact}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        staff.status === 'Active'
                          ? 'bg-[#abfffc] text-[#005f5e]'
                          : 'bg-[#e2e8f0] text-[#6e7978]'
                      }`}
                    >
                      {staff.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() =>
                        showToast(`Editing permissions for ${staff.name}`)
                      }
                      className="text-xs font-semibold text-[#005f5e] hover:underline cursor-pointer"
                    >
                      Edit Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
