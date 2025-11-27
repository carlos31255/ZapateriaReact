import axiosInstance from '../config/axiosConfig';
import type { Boleta, DetalleBoleta } from '../types';

const API_URL = import.meta.env.VITE_API_VENTAS_URL;

export const ventasService = {
    createBoleta: async (boleta: Partial<Boleta>): Promise<Boleta> => {
        const response = await axiosInstance.post<Boleta>(`${API_URL}/ventas/boletas`, boleta);
        return response.data;
    },

    addDetalle: async (detalle: Partial<DetalleBoleta>): Promise<DetalleBoleta> => {
        const response = await axiosInstance.post<DetalleBoleta>(`${API_URL}/ventas/detalles`, detalle);
        return response.data;
    },

    getBoletasByCliente: async (idCliente: number): Promise<Boleta[]> => {
        const response = await axiosInstance.get<Boleta[]>(`${API_URL}/ventas/boletas/cliente/${idCliente}`);
        return response.data;
    },

    getAllBoletas: async (): Promise<Boleta[]> => {
        const response = await axiosInstance.get<Boleta[]>(`${API_URL}/ventas/boletas`);
        return response.data;
    },

    getBoletaById: async (id: number): Promise<Boleta> => {
        const response = await axiosInstance.get<Boleta>(`${API_URL}/ventas/boletas/${id}`);
        return response.data;
    },

    getDetallesByBoleta: async (idBoleta: number): Promise<DetalleBoleta[]> => {
        const response = await axiosInstance.get<DetalleBoleta[]>(`${API_URL}/ventas/boletas/${idBoleta}/detalles`);
        return response.data;
    },

    updateBoletaEstado: async (id: number, estado: string): Promise<Boleta> => {
        const response = await axiosInstance.put<Boleta>(`${API_URL}/ventas/boletas/${id}/estado`, { estado });
        return response.data;
    }
};
