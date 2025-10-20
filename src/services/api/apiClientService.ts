import apiAxiosClient from './apiAxiosClient.ts';

export interface Client {
    clientId: number;
    name: string;
}

export interface SimplifiedClient {
    clientId: number;
    name: string;
}

export interface CreateClientRequest {
    name: string;
}

export const apiClientService = {
    // Create a new client
    createClient: async (clientData: CreateClientRequest): Promise<SimplifiedClient> => {
        const response = await apiAxiosClient.post('/api/client/create-client', clientData);
        return response.data;
    },

    // Get all clients
    getAllClients: async (): Promise<SimplifiedClient[]> => {
        const response = await apiAxiosClient.get('/api/client/get-clients');
        return response.data;
    },

    getAllClientsWithSensitiveFields: async (): Promise<SimplifiedClient[]> => {
        const response = await apiAxiosClient.get('/api/client/get-clients-with-sensitive-fields');
        return response.data;
    },

    // Delete a client
    deleteClient: async (clientId: number): Promise<void> => {
        await apiAxiosClient.delete(`/api/client/delete-client/${clientId}`);
    },

    // Update a client
    updateClient: async (clientId: number, clientData: Partial<SimplifiedClient>): Promise<SimplifiedClient> => {
        const response = await apiAxiosClient.patch(`/api/client/update-client/${clientId}`, clientData);
        return response.data;
    }
};