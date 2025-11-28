import axiosInstance from '../config/axiosConfig';
import type { Entrega } from '../types';

const API_URL = import.meta.env.VITE_API_ENTREGAS_URL;

export const entregasService = {
    createEntrega: async (entrega: Partial<Entrega>): Promise<Entrega> => {
        const response = await axiosInstance.post<Entrega>(`${API_URL}/api/v1/entregas`, entrega);
        return response.data;
    },

    getEntregaByBoleta: async (idBoleta: number): Promise<Entrega> => {
        const response = await axiosInstance.get<Entrega>(`${API_URL}/api/v1/entregas/boleta/${idBoleta}`);
        return response.data;
    }
};
