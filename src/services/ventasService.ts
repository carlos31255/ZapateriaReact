import axios from 'axios';
import type { Boleta, DetalleBoleta } from '../types';

const API_URL = import.meta.env.VITE_API_VENTAS_URL;

export const ventasService = {
    createBoleta: async (boleta: Partial<Boleta>): Promise<Boleta> => {
        const response = await axios.post<Boleta>(`${API_URL}/ventas/boletas`, boleta);
        return response.data;
    },

    addDetalle: async (detalle: Partial<DetalleBoleta>): Promise<DetalleBoleta> => {
        const response = await axios.post<DetalleBoleta>(`${API_URL}/ventas/detalles`, detalle);
        return response.data;
    },

    getBoletasByCliente: async (idCliente: number): Promise<Boleta[]> => {
        const response = await axios.get<Boleta[]>(`${API_URL}/ventas/boletas/cliente/${idCliente}`);
        return response.data;
    }
};
