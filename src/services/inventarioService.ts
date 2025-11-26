import axios from 'axios';
import type { Inventario, ModeloZapato, Talla, Marca } from '../types';

const API_URL = import.meta.env.VITE_API_INVENTARIO_URL;

export const inventarioService = {
    // Inventario
    getAllInventario: async (): Promise<Inventario[]> => {
        const response = await axios.get<Inventario[]>(`${API_URL}/inventario`);
        return response.data;
    },

    getInventarioById: async (id: number): Promise<Inventario> => {
        const response = await axios.get<Inventario>(`${API_URL}/inventario/${id}`);
        return response.data;
    },

    getInventarioByModelo: async (idModelo: number): Promise<Inventario[]> => {
        const response = await axios.get<Inventario[]>(`${API_URL}/inventario/modelo/${idModelo}`);
        return response.data;
    },

    // Modelos
    getAllModelos: async (): Promise<ModeloZapato[]> => {
        const response = await axios.get<ModeloZapato[]>(`${API_URL}/modelos`);
        return response.data;
    },

    getModeloById: async (id: number): Promise<ModeloZapato> => {
        const response = await axios.get<ModeloZapato>(`${API_URL}/modelos/${id}`);
        return response.data;
    },

    // Marcas
    getAllMarcas: async (): Promise<Marca[]> => {
        const response = await axios.get<Marca[]>(`${API_URL}/marcas`);
        return response.data;
    },

    // Tallas
    getAllTallas: async (): Promise<Talla[]> => {
        const response = await axios.get<Talla[]>(`${API_URL}/tallas`);
        return response.data;
    }
};
