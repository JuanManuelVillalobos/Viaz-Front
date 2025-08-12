import axios, {AxiosInstance} from 'axios';
import {toast} from '@/hooks/use-toast';

// Base API configuration
const API_URL = 'http://localhost:8080/';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for cookies (refresh token)
});

// Request interceptor - add auth token to requests
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors and token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 (Unauthorized) and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                if (localStorage.getItem('accessToken') == null) {
                    return Promise.reject(error);
                }
                // Call the refresh token endpoint (it will use the refresh token cookie)
                const response = await axios.post(`${API_URL}api/auth/refresh-token`, {}, {
                    withCredentials: true // Needed to include cookies
                });

                if (response.data.accessToken) {
                    // Save the new access token
                    localStorage.setItem('accessToken', response.data.accessToken);

                    // Retry the original request with the new token
                    originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                // If refresh token is invalid, log out the user
                localStorage.removeItem('accessToken');
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('user');

                toast({
                    title: "Session expired",
                    description: "Please log in again",
                    variant: "destructive",
                });

                // Redirect to login page
                window.location.href = '/login';
            }
        }

        // Handle common errors
        if (error.response) {
            // The request was made and the server responded with an error status
            const status = error.response.status;
            const errorMessage = error.response.data?.message || 'An error occurred';

            switch (status) {
                case 400:
                    toast({
                        title: "Invalid request",
                        description: errorMessage,
                        variant: "destructive",
                    });
                    break;
                case 404:
                    toast({
                        title: "Not found",
                        description: errorMessage,
                        variant: "destructive",
                    });
                    break;
                case 500:
                    toast({
                        title: "Server error",
                        description: "Something went wrong on the server",
                        variant: "destructive",
                    });
                    break;
                default:
                    if (status !== 401) { // We already handle 401 above
                        toast({
                            title: "Error",
                            description: errorMessage,
                            variant: "destructive",
                        });
                    }
            }
        } else if (error.request) {
            // The request was made but no response was received
            toast({
                title: "Network error",
                description: "Could not connect to the server",
                variant: "destructive",
            });
        } else {
            // Something happened in setting up the request
            toast({
                title: "Request error",
                description: error.message,
                variant: "destructive",
            });
        }

        return Promise.reject(error);
    }
);

export default apiClient;
