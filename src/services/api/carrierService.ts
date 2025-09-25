import apiClient from './apiClient';

export interface Carrier {
    carrierId: number;
    name: string;
    rfc: string;
    razonSocial: string;
    caat: string;
}

export interface CreateCarrierRequest {
    name: string;
    rfc: string;
    razonSocial: string;
    caat: string;
}

export const carrierService = {
    // Create a new carrier
    createCarrier: async (carrierData: CreateCarrierRequest): Promise<Carrier> => {
        const response = await apiClient.post('/api/carrier/create-carrier', carrierData);
        return response.data;
    },

    // Get all carriers
    getAllCarriers: async (): Promise<Carrier[]> => {
        const response = await apiClient.get('/api/carrier/get-carriers');
        return response.data;
    },

    getAllCarriersWithSensitiveFields: async (): Promise<Carrier[]> => {
        const response = await apiClient.get('/api/carrier/get-carriers-with-sensitive-fields');
        return response.data;
    },

    // Delete a carrier
    deleteCarrier: async (carrierId: number): Promise<void> => {
        await apiClient.delete(`/api/carrier/delete-carrier/${carrierId}`);
    },

    // Update a carrier
    updateCarrier: async (carrierId: number, carrierData: Partial<Carrier>): Promise<Carrier> => {
        const response = await apiClient.patch(`/api/carrier/update-carrier/${carrierId}`, carrierData);
        return response.data;
    }
};