import apiClient from './apiClient';

export interface IncidentType {
    incidentId: number;
    name: string;
    penalty: number;
}

export interface CreateIncidentTypeRequest {
    name: string;
    penalty: number;
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
    addIncidentToShipment: async (viazId: string, incidentId: number, comment : string): Promise<void> => {
        await apiClient.post(`/api/shipment/add-incident/${viazId}/${incidentId}/${comment}`);
    },

    deleteIncidentType: async (incidentId: number): Promise<void> => {
        await apiClient.delete(`/api/incident/delete-incident-type/${incidentId}`);
    }
};