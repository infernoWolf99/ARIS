/**
 * ARIS NestJS ANC Visits API Client
 * Maps to NestJS AncVisitsController / AncVisitsService with Prisma PostgreSQL
 */

import { ANCVisitRecord } from '../../types';
import { apiRequest } from './apiClient';

export interface CreateANCVisitDto extends Omit<ANCVisitRecord, 'id'> {}

export const ancVisitsApi = {
  /**
   * GET /api/v1/anc-visits/patient/:patientId
   * Fetch all ANC visits for a specific patient
   */
  async getByPatientId(patientId: string): Promise<ANCVisitRecord[]> {
    return apiRequest<ANCVisitRecord[]>(`/anc-visits/patient/${patientId}`, {
      method: 'GET',
    });
  },

  /**
   * POST /api/v1/anc-visits
   * Record a new routine ANC visit
   */
  async create(visitData: CreateANCVisitDto): Promise<ANCVisitRecord> {
    return apiRequest<ANCVisitRecord>('/anc-visits', {
      method: 'POST',
      body: JSON.stringify(visitData),
    });
  },

  /**
   * GET /api/v1/anc-visits/:id
   */
  async getById(id: string): Promise<ANCVisitRecord> {
    return apiRequest<ANCVisitRecord>(`/anc-visits/${id}`, {
      method: 'GET',
    });
  },
};
