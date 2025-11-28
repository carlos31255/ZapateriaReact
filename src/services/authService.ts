import axiosInstance from '../config/axiosConfig';
import axios from 'axios';
import type { UsuarioAutenticado, CredencialesLogin, DatosRegistro, UsuarioBackend } from '../types';

const API_URL = import.meta.env.VITE_API_USUARIO_URL;

export const authService = {
    login: async (credenciales: CredencialesLogin): Promise<UsuarioAutenticado> => {
        try {
            // Llamar al endpoint de login con JWT
            const response = await axios.post(`${API_URL}/api/v1/auth/login`, {
                email: credenciales.email,
                password: credenciales.contrasena
            });

            const {
                token,
                refreshToken,
                userId,
                email,
                nombre,
                rol,
                run,
                telefono,
                genero,
                fechaNacimiento,
                region,
                comuna,
                direccion,
                fechaRegistro
            } = response.data;

            // Guardar tokens en localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);

            // Mapear a UsuarioAutenticado usando los datos del LoginResponse
            return {
                id: userId.toString(),
                run: run || '',
                nombre: nombre || '',
                email: email || '',
                rol: (rol === 'ADMIN' ? 'administrador' : rol.toLowerCase()) as any,
                genero: genero || '',
                fechaNacimiento: fechaNacimiento || '',
                region: region || '',
                comuna: comuna || '',
                direccion: direccion || '',
                telefono: telefono || '',
                fechaRegistro: fechaRegistro || new Date().toISOString(),
                logueado: true,
                idPersonaBackend: userId
            };
        } catch (error: any) {
            console.error('Error en login:', error);
            if (error.response?.status === 401) {
                throw new Error('Credenciales inválidas');
            }
            throw new Error('Error al iniciar sesión');
        }
    },

    logout: async (): Promise<void> => {
        try {
            await axiosInstance.post(`${API_URL}/api/v1/auth/logout`);
        } catch (error) {
            console.error('Error en logout:', error);
        } finally {
            // Limpiar tokens del localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        }
    },

    register: async (datos: DatosRegistro): Promise<void> => {
        try {
            // Separar nombre y apellido
            const nombreParts = datos.nombre.split(' ');
            const nombre = nombreParts[0];
            const apellido = nombreParts.slice(1).join(' ') || '';

            const registerRequest = {
                run: datos.run,
                nombre: nombre,
                apellido: apellido,
                email: datos.email,
                telefono: datos.telefono,
                genero: datos.genero,
                fechaNacimiento: datos.fechaNacimiento,
                region: datos.region,
                comuna: datos.comuna,
                direccion: datos.direccion,
                password: datos.contrasena
            };

            await axios.post(`${API_URL}/api/v1/auth/register`, registerRequest);

        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        }
    },

    // Gestión de usuarios (para administradores)
    getAllUsuarios: async (): Promise<UsuarioBackend[]> => {
        const response = await axiosInstance.get<UsuarioBackend[]>(`${API_URL}/api/v1/usuarios`);
        return response.data;
    },

    getUsuarioById: async (id: number): Promise<UsuarioBackend> => {
        const response = await axiosInstance.get<UsuarioBackend>(`${API_URL}/api/v1/usuarios/${id}`);
        return response.data;
    },

    updateUsuario: async (id: number, usuario: Partial<UsuarioBackend>): Promise<UsuarioBackend> => {
        const response = await axiosInstance.put<UsuarioBackend>(`${API_URL}/api/v1/usuarios/${id}`, usuario);
        return response.data;
    },

    deleteUsuario: async (id: number): Promise<void> => {
        await axiosInstance.delete(`${API_URL}/api/v1/usuarios/${id}`);
    }
};
