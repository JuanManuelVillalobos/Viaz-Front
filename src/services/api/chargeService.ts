import apiClient from './apiClient';

export interface ChargeType {
    chargeId: number;
    name: string;
    penalty: number;
}

export interface CreateChargeTypeRequest {
    name: string;
    penalty: number;
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
    addChargeToShipment: async (viazId: string, chargeId: number, comment: string): Promise<void> => {
        await apiClient.post(`/api/shipment/add-charge/${viazId}/${chargeId}/${comment}`);
    },

    deleteChargeType: async (chargeId: number): Promise<void> => {
        await apiClient.delete(`/api/charge/delete-charge-type/${chargeId}`);
    }
};