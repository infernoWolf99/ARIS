/**
 * ARIS NestJS Staff Members API Client
 */

import { StaffMember } from '../../types';
import { apiRequest } from './apiClient';

export interface CreateStaffDto extends Omit<StaffMember, 'id'> {}

export const staffApi = {
  async getAll(): Promise<StaffMember[]> {
    return apiRequest<StaffMember[]>('/staff', {
      method: 'GET',
    });
  },

  async create(staffData: CreateStaffDto): Promise<StaffMember> {
    return apiRequest<StaffMember>('/staff', {
      method: 'POST',
      body: JSON.stringify(staffData),
    });
  },
};
