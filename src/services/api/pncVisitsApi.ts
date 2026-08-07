/**
 * ARIS NestJS PNC Visits API Client
 */

import { PNCVisitRecord } from '../../types';
import { apiRequest } from './apiClient';

export interface CreatePNCVisitDto extends Omit<PNCVisitRecord, 'id'> {}

export const pncVisitsApi = {
  async getByPatientId(patientId: string): Promise<PNCVisitRecord[]> {
    return apiRequest<PNCVisitRecord[]>(`/pnc-visits/patient/${patientId}`, {
      method: 'GET',
    });
  },

  async create(visitData: CreatePNCVisitDto): Promise<PNCVisitRecord> {
    return apiRequest<PNCVisitRecord>('/pnc-visits', {
      method: 'POST',
      body: JSON.stringify(visitData),
    });
  },
};
