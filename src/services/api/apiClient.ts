import axios, {AxiosInstance} from 'axios';
import {jwtDecode} from 'jwt-decode';
import {toast} from '@/hooks/use-toast';
import {authService} from './authService';

interface JwtPayload {
    exp: number;
}

function isTokenExpired(token: string): boolean {
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (!decoded.exp) return true;
        const now = Date.now() / 1000;
        return decoded.exp < now;
    } catch {
        return true;
    }
}

const API_URL = 'http://localhost:8080';

const apiClient: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

apiClient.interceptors.request.use(
    async (config) => {
        let token = localStorage.getItem('accessToken');

        if (token) {
            if (isTokenExpired(token) && !config.url?.includes('/auth/refresh-token')) {
                try {
                    token = await authService.refreshToken();
                } catch {
                    toast({
                        title: 'Session expired',
                        description: 'Please log in again',
                        variant: 'destructive',
                    });
                    localStorage.clear();
                    window.location.href = '/login';
                    return Promise.reject(new axios.Cancel('Token expired and refresh failed'));
                }
            }
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (axios.isCancel(error)) {
            // Request was canceled due to expired token handling in request interceptor
            return Promise.reject(error);
        }

        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            originalRequest.url !== '/api/auth/login' &&
            originalRequest.url !== '/api/auth/refresh-token'
        ) {
            originalRequest._retry = true;

            try {
                const token = await authService.refreshToken();

                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                return apiClient(originalRequest);
            } catch {
                localStorage.clear();
                toast({
                    title: 'Session expired',
                    description: 'Please log in again',
                    variant: 'destructive',
                });
                window.location.href = '/login';
                return Promise.reject(error);
            }
        }

        // Existing error toast logic here for 400, 404, 500 etc.
        if (error.response) {
            const status = error.response.status;
            const errorMessage = error.response.data?.message || 'An error occurred';

            switch (status) {
                case 400:
                    toast({title: 'Invalid request', description: errorMessage, variant: 'destructive'});
                    break;
                case 401:
                    toast({title: 'Unauthorized', description: errorMessage, variant: 'destructive'});
                    break;
                case 404:
                    toast({title: 'Not found', description: errorMessage, variant: 'destructive'});
                    break;
                case 500:
                    toast({
                        title: 'Server error',
                        description: 'Something went wrong on the server',
                        variant: 'destructive'
                    });
                    break;
                default:
                    if (status !== 401) {
                        toast({title: 'Error', description: errorMessage, variant: 'destructive'});
                    }
            }
        } else if (error.request) {
            toast({title: 'Network error', description: 'Could not connect to the server', variant: 'destructive'});
        } else {
            toast({title: 'Request error', description: error.message, variant: 'destructive'});
        }

        return Promise.reject(error);
    }
);

export default apiClient;
