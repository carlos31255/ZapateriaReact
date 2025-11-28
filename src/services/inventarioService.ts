import axiosInstance from '../config/axiosConfig';
import type { Inventario, ModeloZapato, Talla, Marca } from '../types';

const API_URL = import.meta.env.VITE_API_INVENTARIO_URL;

export const inventarioService = {
    // Inventario
    getAllInventario: async (): Promise<Inventario[]> => {
        const response = await axiosInstance.get<Inventario[]>(`${API_URL}/api/v1/inventario`);
        return response.data;
    },

    getInventarioById: async (id: number): Promise<Inventario> => {
        const response = await axiosInstance.get<Inventario>(`${API_URL}/api/v1/inventario/${id}`);
        return response.data;
    },

    getInventarioByModelo: async (idModelo: number): Promise<Inventario[]> => {
        const response = await axiosInstance.get<Inventario[]>(`${API_URL}/api/v1/inventario/modelo/${idModelo}`);
        return response.data;
    },

    // Modelos
    getAllModelos: async (): Promise<ModeloZapato[]> => {
        const response = await axiosInstance.get<ModeloZapato[]>(`${API_URL}/api/v1/modelos`);
        return response.data;
    },

    getModeloById: async (id: number): Promise<ModeloZapato> => {
        const response = await axiosInstance.get<ModeloZapato>(`${API_URL}/api/v1/modelos/${id}`);
        return response.data;
    },

    // Marcas
    getAllMarcas: async (): Promise<Marca[]> => {
        const response = await axiosInstance.get<Marca[]>(`${API_URL}/api/v1/marcas`);
        return response.data;
    },

    // Tallas
    getAllTallas: async (): Promise<Talla[]> => {
        const response = await axiosInstance.get<Talla[]>(`${API_URL}/api/v1/tallas`);
        return response.data;
    },

    // CRUD Modelos
    createModelo: async (modelo: Partial<ModeloZapato>): Promise<ModeloZapato> => {
        const response = await axiosInstance.post<ModeloZapato>(`${API_URL}/api/v1/modelos`, modelo);
        return response.data;
    },

    updateModelo: async (id: number, modelo: Partial<ModeloZapato>): Promise<ModeloZapato> => {
        const response = await axiosInstance.put<ModeloZapato>(`${API_URL}/api/v1/modelos/${id}`, modelo);
        return response.data;
    },

    deleteModelo: async (id: number): Promise<void> => {
        await axiosInstance.delete(`${API_URL}/api/v1/modelos/${id}`);
    },

    // CRUD Inventario
    createInventario: async (inventario: Partial<Inventario>): Promise<Inventario> => {
        const response = await axiosInstance.post<Inventario>(`${API_URL}/api/v1/inventario`, inventario);
        return response.data;
    },

    updateInventario: async (id: number, inventario: Partial<Inventario>): Promise<Inventario> => {
        const response = await axiosInstance.put<Inventario>(`${API_URL}/api/v1/inventario/${id}`, inventario);
        return response.data;
    },

    deleteInventario: async (id: number): Promise<void> => {
        await axiosInstance.delete(`${API_URL}/api/v1/inventario/${id}`);
    }
};
