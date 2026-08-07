/**
 * ARIS NestJS Delivery Records API Client
 */

import { DeliveryRecordData } from '../../types';
import { apiRequest } from './apiClient';

export interface CreateDeliveryDto extends Omit<DeliveryRecordData, 'id'> {}

export const deliveriesApi = {
  async getByPatientId(patientId: string): Promise<DeliveryRecordData[]> {
    return apiRequest<DeliveryRecordData[]>(`/deliveries/patient/${patientId}`, {
      method: 'GET',
    });
  },

  async create(deliveryData: CreateDeliveryDto): Promise<DeliveryRecordData> {
    return apiRequest<DeliveryRecordData>('/deliveries', {
      method: 'POST',
      body: JSON.stringify(deliveryData),
    });
  },
};
