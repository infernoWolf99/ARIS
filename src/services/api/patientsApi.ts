/**
 * ARIS NestJS Patients API Client
 * Maps to NestJS PatientsController / PatientsService with Prisma PostgreSQL
 */

import { Patient } from '../../types';
import { apiRequest } from './apiClient';

export interface CreatePatientDto extends Omit<Patient, 'id'> {}
export interface UpdatePatientDto extends Partial<CreatePatientDto> {}

export const patientsApi = {
  /**
   * GET /api/v1/patients
   * Fetch list of registered patients
   */
  async getAll(): Promise<Patient[]> {
    return apiRequest<Patient[]>('/patients', {
      method: 'GET',
    });
  },

  /**
   * GET /api/v1/patients/:id
   * Fetch single patient by UUID
   */
  async getById(id: string): Promise<Patient> {
    return apiRequest<Patient>(`/patients/${id}`, {
      method: 'GET',
    });
  },

  /**
   * POST /api/v1/patients
   * Register a new maternal health patient
   */
  async create(patientData: CreatePatientDto): Promise<Patient> {
    return apiRequest<Patient>('/patients', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  },

  /**
   * PUT /api/v1/patients/:id
   * Update existing patient records
   */
  async update(id: string, patientData: UpdatePatientDto): Promise<Patient> {
    return apiRequest<Patient>(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patientData),
    });
  },

  /**
   * DELETE /api/v1/patients/:id
   * Archive or remove patient record
   */
  async delete(id: string): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>(`/patients/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * GET /api/v1/patients/search?query=...
   */
  async search(query: string): Promise<Patient[]> {
    return apiRequest<Patient[]>(`/patients/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
    });
  },
};
