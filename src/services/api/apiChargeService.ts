import apiAxiosClient from './apiAxiosClient.ts';

export interface ChargeType {
    chargeId: number;
    name: string;
    penalty: number;
    entityTied: string;
}

export interface CreateChargeTypeRequest {
    name: string;
    penalty: number;
}

export const apiChargeService = {
    // Get all charge types
    getAllChargeTypes: async (): Promise<ChargeType[]> => {
        const response = await apiAxiosClient.get('/api/charge/get-charge-types');
        return response.data;
    },

    // Create a new charge type
    createChargeType: async (chargeTypeData: CreateChargeTypeRequest): Promise<ChargeType> => {
        const response = await apiAxiosClient.post('/api/charge/create-charge-type', chargeTypeData);
        return response.data;
    },

    // Add charge to shipment
    addChargeToShipment: async (viazId: string, chargeId: number, comment: string): Promise<void> => {
        await apiAxiosClient.post(`/api/shipment/add-charge/${viazId}/${chargeId}/${comment}`);
    },

    deleteChargeType: async (chargeId: number): Promise<void> => {
        await apiAxiosClient.delete(`/api/charge/delete-charge-type/${chargeId}`);
    }
};