/**
 * ARIS NestJS Child Welfare Records API Client
 */

import { ChildRecord } from '../../types';
import { apiRequest } from './apiClient';

export interface CreateChildDto extends Omit<ChildRecord, 'id'> {}

export const childrenApi = {
  async getAll(): Promise<ChildRecord[]> {
    return apiRequest<ChildRecord[]>('/children', {
      method: 'GET',
    });
  },

  async getByMotherPatientId(motherPatientId: string): Promise<ChildRecord[]> {
    return apiRequest<ChildRecord[]>(`/children/mother/${motherPatientId}`, {
      method: 'GET',
    });
  },

  async create(childData: CreateChildDto): Promise<ChildRecord> {
    return apiRequest<ChildRecord>('/children', {
      method: 'POST',
      body: JSON.stringify(childData),
    });
  },
};
