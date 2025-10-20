import apiAxiosClient from './apiAxiosClient.ts';

export interface Carrier {
    carrierId: number;
    name: string;
    rfc: string;
    razonSocial: string;
    caat: string;
}

export interface SimplifiedCarrier {
    carrierId: number;
    name: string;
}

export interface CreateCarrierRequest {
    name: string;
    rfc: string;
    razonSocial: string;
    caat: string;
}

export const apiCarrierService = {
    // Create a new carrier
    createCarrier: async (carrierData: CreateCarrierRequest): Promise<Carrier> => {
        const response = await apiAxiosClient.post('/api/carrier/create-carrier', carrierData);
        return response.data;
    },

    // Get all carriers
    getAllCarriers: async (): Promise<SimplifiedCarrier[]> => {
        const response = await apiAxiosClient.get('/api/carrier/get-carriers');
        return response.data;
    },

    getAllCarriersWithSensitiveFields: async (): Promise<Carrier[]> => {
        const response = await apiAxiosClient.get('/api/carrier/get-carriers-with-sensitive-fields');
        return response.data;
    },

    // Delete a carrier
    deleteCarrier: async (carrierId: number): Promise<void> => {
        await apiAxiosClient.delete(`/api/carrier/delete-carrier/${carrierId}`);
    },

    // Update a carrier
    updateCarrier: async (carrierId: number, carrierData: Partial<Carrier>): Promise<Carrier> => {
        const response = await apiAxiosClient.patch(`/api/carrier/update-carrier/${carrierId}`, carrierData);
        return response.data;
    }
};