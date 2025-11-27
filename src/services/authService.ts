import axiosInstance from '../config/axiosConfig';
import axios from 'axios';
import type { UsuarioAutenticado, CredencialesLogin, DatosRegistro, UsuarioBackend } from '../types';

const API_URL = import.meta.env.VITE_API_USUARIO_URL;

export const authService = {
    login: async (credenciales: CredencialesLogin): Promise<UsuarioAutenticado> => {
        try {
            // Llamar al endpoint de login con JWT
            const response = await axios.post(`${API_URL}/auth/login`, {
                email: credenciales.email,
                password: credenciales.contrasena
            });

            const { token, refreshToken, userId, email, nombre, rol } = response.data;

            // Guardar tokens en localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);

            // Obtener datos completos del usuario
            const usuarioResponse = await axiosInstance.get<UsuarioBackend>(`${API_URL}/usuarios/${userId}`);
            const usuarioBackend = usuarioResponse.data;

            // Mapear a UsuarioAutenticado
            return {
                id: usuarioBackend.idPersona.toString(),
                run: usuarioBackend.persona.rut,
                nombre: nombre,
                email: email,
                rol: rol.toLowerCase() as any,
                genero: '',
                fechaNacimiento: '',
                region: '',
                comuna: usuarioBackend.persona.idComuna ? usuarioBackend.persona.idComuna.toString() : '',
                direccion: `${usuarioBackend.persona.calle || ''} ${usuarioBackend.persona.numeroPuerta || ''}`.trim(),
                telefono: usuarioBackend.persona.telefono,
                fechaRegistro: usuarioBackend.persona.fechaRegistro,
                logueado: true,
                idPersonaBackend: usuarioBackend.idPersona
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
            await axiosInstance.post(`${API_URL}/auth/logout`);
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
                comuna: datos.comuna,
                direccion: datos.direccion,
                password: datos.contrasena
            };

            await axios.post(`${API_URL}/auth/register`, registerRequest);

        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        }
    },

    // Gestión de usuarios (para administradores)
    getAllUsuarios: async (): Promise<UsuarioBackend[]> => {
        const response = await axiosInstance.get<UsuarioBackend[]>(`${API_URL}/usuarios`);
        return response.data;
    },

    getUsuarioById: async (id: number): Promise<UsuarioBackend> => {
        const response = await axiosInstance.get<UsuarioBackend>(`${API_URL}/usuarios/${id}`);
        return response.data;
    },

    updateUsuario: async (id: number, usuario: Partial<UsuarioBackend>): Promise<UsuarioBackend> => {
        const response = await axiosInstance.put<UsuarioBackend>(`${API_URL}/usuarios/${id}`, usuario);
        return response.data;
    },

    deleteUsuario: async (id: number): Promise<void> => {
        await axiosInstance.delete(`${API_URL}/usuarios/${id}`);
    }
};
