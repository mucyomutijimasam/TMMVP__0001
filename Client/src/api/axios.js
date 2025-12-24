import axios from 'axios';

const api  = axios.create({
    baseURL:'http://localhost:15150/api',
    withCredentials: true,
    headers:{
        'Content-Type':'application/json'
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Or use a variable from your AuthProvider
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 2. Response Interceptor: Handle 401s by Refreshing
api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        // If it's a 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                // 1. Note the specific path and withCredentials for cookies
                const res = await axios.post(
                    'http://localhost:15150/api/auth/refresh', 
                    {}, 
                    { withCredentials: true }
                );

                // 2. Extract the new token
                const { accessToken } = res.data;

                if (accessToken) {
                    localStorage.setItem('token', accessToken);
                    
                    // 3. Update the header for the retry
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    
                    // 4. Return the original request with the new token
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // If refresh fails, the user must log in again
                console.error("Refresh token expired or invalid. Logging out...");
                localStorage.removeItem('token');
                window.location.href = '/login'; // Redirect to login
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
export default api