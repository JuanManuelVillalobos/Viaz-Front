import apiClient from './apiClient';

export interface ChargeType {
    chargeId: string;
    name: string;
}

export interface CreateChargeTypeRequest {
    name: string;
    description?: string;
}

export const chargeService = {
    // Get all charge types
    getAllChargeTypes: async (): Promise<ChargeType[]> => {
        const response = await apiClient.get('/api/charge/get-charge-types');
        return response.data;
    },

    // Create a new charge type
    createChargeType: async (chargeTypeData: CreateChargeTypeRequest): Promise<ChargeType> => {
        const response = await apiClient.post('/api/charge/create-charge-type', chargeTypeData);
        return response.data;
    },

    // Add charge to shipment
    addChargeToShipment: async (viazId: string, chargeId: string, comment: string): Promise<void> => {
        await apiClient.post(`/api/shipment/add-charge/${viazId}/${chargeId}/${comment}`);
    }
};