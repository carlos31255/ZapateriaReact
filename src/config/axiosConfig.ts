import axios from 'axios';

// Crear instancia de axios
const axiosInstance = axios.create();

// Interceptor para agregar token a las peticiones
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores de autenticación
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Si el error es 401 y no hemos intentado refrescar el token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    // No hay refresh token, redirigir al login
                    localStorage.clear();
                    window.location.href = '/login';
                    return Promise.reject(error);
                }

                // Intentar refrescar el token
                const response = await axios.post(
                    `${import.meta.env.VITE_API_USUARIO_URL}/auth/refresh`,
                    { refreshToken }
                );

                const { token, refreshToken: newRefreshToken } = response.data;

                // Guardar nuevos tokens
                localStorage.setItem('token', token);
                if (newRefreshToken) {
                    localStorage.setItem('refreshToken', newRefreshToken);
                }

                // Reintentar la petición original con el nuevo token
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return axiosInstance(originalRequest);

            } catch (refreshError) {
                // Error al refrescar token, limpiar y redirigir al login
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
