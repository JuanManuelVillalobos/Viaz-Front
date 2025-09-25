import {apiClient} from "@/services/api/index.ts";

export type MonthlyCarrierRating = {
    carrierName: string;
    month: string;
    monthNumber: number;
    averageRating: number;
};

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

    getClosedShipmentsThisMonthCount: async (): Promise<number> => {
        const response = await apiClient.get('/api/stats/get-last-month-total-closed-shipments');
        return response.data;
    },

    getOpenShipmentsCount: async (): Promise<number> => {
        const response = await apiClient.get('/api/stats/get-open-shipments');
        return response.data;
    },

    getNumberOfIssuesOnOpenShipments: async (): Promise<number> => {
        const response = await apiClient.get('/api/stats/get-number-of-issues-in-open-shipments');
        return response.data;
    },

    getFullVsSencilloStats: async (): Promise<Record<string, { count: number; percentage: number }>> => {
        const response = await apiClient.get('/api/stats/get-number-of-shipments-by-type-of-service');
        return response.data;
    },

    getMonthlyCarrierRatings: async (): Promise<MonthlyCarrierRating[]> => {
        const response = await apiClient.get('/api/stats/get-monthly-ratings-of-carriers');
        return response.data;
    },

     getCleanedShipmentsCount: async (): Promise<number> => {
        const response = await apiClient.get('/api/stats/get-cleaned-shipments');
        return response.data;
     },

    getNumberOfChargesLastMonth: async (): Promise<number> => {
        const response = await apiClient.get('/api/stats/get-number-of-charges-in-last-month');
        return response.data;
    }

}