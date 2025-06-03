
import apiClient from './apiClient';
import { ApiShipment, ShipmentUpdateRequest } from '@/types/api';

export const apiShipmentService = {
  // Get all shipments
  getAllShipments: async (): Promise<ApiShipment[]> => {
    const response = await apiClient.get('/api/shipment/get-all-shipments');
    return response.data;
  },
  
  // Get pending shipments
  getPendingShipments: async (): Promise<ApiShipment[]> => {
    const response = await apiClient.get('/api/shipment/get-pending-shipments');
    return response.data;
  },
  
  // Get shipment by ID
  getShipmentById: async (viazId: string): Promise<ApiShipment> => {
    const response = await apiClient.get(`/api/shipment/get-shipment/${viazId}`);
    return response.data;
  },
  
  // Create a new shipment
  createShipment: async (shipment: ApiShipment): Promise<ApiShipment> => {
    const response = await apiClient.post('/api/shipment/create-shipment', shipment);
    return response.data;
  },
  
  // Update a shipment
  updateShipment: async (viazId: string, updates: ShipmentUpdateRequest): Promise<ApiShipment> => {
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
  exportShipmentsExcel: async (shipments: ApiShipment[]): Promise<Blob> => {
    const response = await apiClient.post('/api/shipment/export-excel', 
      { shipments }, 
      { responseType: 'blob' }
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
  }
};
