import apiClient from './apiClient';

export interface Carrier {
  id: string;
  name: string;
  type: 'maritime' | 'terrestrial';
  contact: string;
  email: string;
  status: 'active' | 'inactive';
}

export interface CreateCarrierRequest {
  name: string;
}

export const carrierService = {
  // Create a new carrier
  createCarrier: async (carrierData: CreateCarrierRequest): Promise<Carrier> => {
    const response = await apiClient.post('/api/carrier/create-carrier', carrierData);
    return response.data;
  },

  // Get all carriers
  getAllCarriers: async (): Promise<Carrier[]> => {
    const response = await apiClient.get('/api/carrier/get-all-carriers');
    return response.data;
  },

  // Delete a carrier
  deleteCarrier: async (carrierId: string): Promise<void> => {
    await apiClient.delete(`/api/carrier/delete-carrier/${carrierId}`);
  },

  // Update a carrier
  updateCarrier: async (carrierId: string, carrierData: Partial<Carrier>): Promise<Carrier> => {
    const response = await apiClient.put(`/api/carrier/update-carrier/${carrierId}`, carrierData);
    return response.data;
  }
};