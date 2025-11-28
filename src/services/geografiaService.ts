import axios from 'axios';
import type { Region, Comuna, Ciudad } from '../types';

// Re-export types for convenience
export type { Region, Comuna, Ciudad } from '../types';

const API_URL = import.meta.env.VITE_API_GEOGRAFIA_URL;

export const geografiaService = {
    // Regiones
    getAllRegiones: async (): Promise<Region[]> => {
        const response = await axios.get<Region[]>(`${API_URL}/regiones`);
        return response.data;
    },

    getRegionById: async (id: number): Promise<Region> => {
        const response = await axios.get<Region>(`${API_URL}/regiones/${id}`);
        return response.data;
    },

    // Comunas
    getAllComunas: async (): Promise<Comuna[]> => {
        const response = await axios.get<Comuna[]>(`${API_URL}/comunas`);
        return response.data;
    },

    getComunasByRegion: async (idRegion: number): Promise<Comuna[]> => {
        const response = await axios.get<Comuna[]>(`${API_URL}/comunas/region/${idRegion}`);
        return response.data;
    },

    // Ciudades
    getAllCiudades: async (): Promise<Ciudad[]> => {
        const response = await axios.get<Ciudad[]>(`${API_URL}/ciudades`);
        return response.data;
    },

    getCiudadesByComuna: async (idComuna: number): Promise<Ciudad[]> => {
        const response = await axios.get<Ciudad[]>(`${API_URL}/ciudades/comuna/${idComuna}`);
        return response.data;
    }
};
