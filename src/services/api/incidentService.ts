import apiClient from './apiClient';

export interface IncidentType {
    incidentId: string;
    name: string;
}

export interface CreateIncidentTypeRequest {
    name: string;
    description?: string;
}

export const incidentService = {
    // Get all incident types
    getAllIncidentTypes: async (): Promise<IncidentType[]> => {
        const response = await apiClient.get('/api/incident/get-incident-types');
        return response.data;
    },

    // Create a new incident type
    createIncidentType: async (incidentTypeData: CreateIncidentTypeRequest): Promise<IncidentType> => {
        const response = await apiClient.post('/api/incident/create-incident-type', incidentTypeData);
        return response.data;
    },

    // Add incident to shipment
    addIncidentToShipment: async (viazId: string, incidentId: string, comment : string): Promise<void> => {
        await apiClient.post(`/api/shipment/add-incident/${viazId}/${incidentId}/${comment}`);
    }
};