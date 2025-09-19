import apiClient from './apiClient';
import {ShipmentCharge, ShipmentIncident, ShipmentUpdateRequest, UserSummaryDTO, Page, ShipmentFilterOptionsDTO} from '@/types/api';
import {Shipment, ShipmentRequest, Transport} from "@/types/shipment.ts";

export const apiShipmentService = {
    // Get shipments with pagination and filters
    getShipments: async (
        page: number = 0, 
        size: number = 10, 
        statuses?: string[], 
        clients?: string[], 
        carriers?: string[]
    ): Promise<Page<Shipment>> => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('size', size.toString());
        
        if (statuses && statuses.length > 0) {
            statuses.forEach(status => params.append('statuses', status));
        }
        if (clients && clients.length > 0) {
            clients.forEach(client => params.append('clients', client));
        }
        if (carriers && carriers.length > 0) {
            carriers.forEach(carrier => params.append('carriers', carrier));
        }
        
        const response = await apiClient.get(`/api/shipment/shipments?${params.toString()}`);
        return response.data;
    },

    // Get all shipments (legacy - keeping for compatibility)
    getAllShipments: async (): Promise<Shipment[]> => {
        const response = await apiClient.get('/api/shipment/get-all-shipments');
        return response.data;
    },

    // Get filter options
    getFilterOptions: async (): Promise<ShipmentFilterOptionsDTO> => {
        const response = await apiClient.get('/api/shipment/filters');
        return response.data;
    },

    // Get pending shipments
    getPendingShipments: async (): Promise<Shipment[]> => {
        const response = await apiClient.get('/api/shipment/get-pending-shipments');
        return response.data;
    },

    // Get shipment by ID
    getShipmentById: async (viazId: string): Promise<Shipment> => {
        const response = await apiClient.get(`/api/shipment/get-shipment/${viazId}`);
        return response.data;
    },

    // Create a new shipment
    createShipment: async (shipment: ShipmentRequest): Promise<Shipment> => {
        const response = await apiClient.post('/api/shipment/create-shipment', shipment);
        return response.data;
    },

    // Update a shipment
    updateShipment: async (viazId: string, updates: ShipmentUpdateRequest): Promise<Shipment> => {
        const response = await apiClient.patch(`/api/shipment/update-shipment/${viazId}`, updates);
        return response.data;
    },

    // Delete a shipment
    deleteShipment: async (viazId: string): Promise<void> => {
        await apiClient.delete(`/api/shipment/delete-shipment/${viazId}`);
    },

    // Upload excel file
    uploadExcel: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiClient.post('/api/shipment/upload-excel', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    },

    // Export shipments to Excel
    exportShipmentsExcel: async (shipments: Shipment[]): Promise<Blob> => {
        const response = await apiClient.post('/api/shipment/export-excel',
            {shipments},
            {responseType: 'blob'}
        );

        return response.data;
    },

    // Upload file to a shipment
    uploadFile: async (viazId: string, file: File): Promise<void> => {
        const formData = new FormData();
        formData.append('file', file);

        await apiClient.post(`/api/shipment/${viazId}/upload-file`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // List documents for a shipment
    getShipmentDocuments: async (viazId: string): Promise<string[]> => {
        const response = await apiClient.get(`/api/shipment/${viazId}/list-objects`);
        return response.data;
    },

    // Delete document from a shipment
    deleteDocument: async (viazId: string, objectKey: string): Promise<void> => {
        await apiClient.delete(`/api/shipment/delete-object/${objectKey}`);
    },

    // Get document download URL - Updated to use the full objectKey directly
    getDocumentDownloadUrl: async (objectKey: string): Promise<string> => {
        // Use the objectKey directly without encoding since it already contains the full path
        const response = await apiClient.get(`/api/shipment/download-file/${objectKey}`);
        return response.data;
    },

    getTransports: async (): Promise<Transport[]> => {
        const response = await apiClient.get('/api/carrier/get-carriers');
        return response.data;
    },

    getCustomerServiceAgents: async (): Promise<UserSummaryDTO[]> => {
        const response = await apiClient.get('/api/user/get-customer-service-users');
        return response.data;
    },

    closeShipment: async (viazId: string, customerServiceRating: number, observations: string): Promise<void> => {
        const response = await apiClient.post(`/api/shipment/close-shipment/${viazId}/${customerServiceRating}/${observations}`, {
            customerServiceRating: customerServiceRating
        });
        return response.data;
    },

    // Get ETA for a shipment
    getShipmentEta: async (viazId: string): Promise<number> => {
        const response = await apiClient.get(`/api/shipment/${viazId}/eta`);
        return response.data;
    },

    // Get incident types
    getIncidentTypes: async (): Promise<any[]> => {
        const response = await apiClient.get('/api/incident/get-incident-types');
        return response.data;
    },

    // Add incident to shipment
    addIncidentToShipment: async (viazId: string, incidentId: string): Promise<void> => {
        await apiClient.post(`/api/shipment/add-incident/${viazId}/${incidentId}`);
    },

    // Reopen shipment
    reopenShipment: async (viazId: string): Promise<void> => {
        await apiClient.post(`/api/shipment/reopen-shipment/${viazId}`);
    },

    getShipmentCharges: async (viazId: string): Promise<ShipmentCharge[]> => {
        const response = await apiClient.get(`/api/shipment/get-charges/${viazId}`);
        return response.data;
    },

    getShipmentIncidents: async (viazId: string): Promise<ShipmentIncident[]> => {
        const response = await apiClient.get(`/api/shipment/get-incidents/${viazId}`);
        return response.data;
    },

    deleteIncident: async (incidentId: number): Promise<void> => {
        await apiClient.delete(`/api/shipment/delete-incident/${incidentId}`);
    },

    deleteCharge: async (chargeId: number): Promise<void> => {
        await apiClient.delete(`/api/shipment/delete-charge/${chargeId}`);
    },
};
