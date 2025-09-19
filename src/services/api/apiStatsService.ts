import {apiClient} from "@/services/api/index.ts";


export const apiStatsService = {
// Get total shipments managed last month
    getLastMonthTotalShipments: async (): Promise<number> => {
        const response = await apiClient.get('/api/stats/get-last-month-total-shipments');
        return response.data;
    },

    getShipmentInTransitCount: async (): Promise<number> => {
        const response = await apiClient.get('/api/stats/get-shipments-in-transit');
        return response.data;
    },

    getOpenShipmentsCount: async (): Promise<number> => {
        const response = await apiClient.get('/api/stats/get-open-shipments');
        return response.data;
    }
}