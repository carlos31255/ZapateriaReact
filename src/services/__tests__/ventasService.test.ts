import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ventasService } from '../ventasService';
import axiosInstance from '../../config/axiosConfig';

// Mock axiosInstance
vi.mock('../../config/axiosConfig', () => ({
    default: {
        post: vi.fn(),
        get: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

describe('ventasService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createBoleta', () => {
        it('should create a boleta and return it', async () => {
            const mockBoleta = { idBoleta: 1, total: 1000, estado: 'PENDIENTE' };
            (axiosInstance.post as any).mockResolvedValue({ data: mockBoleta });

            const result = await ventasService.createBoleta({ total: 1000 });

            expect(axiosInstance.post).toHaveBeenCalledWith(expect.stringContaining('/api/v1/ventas/boletas'), { total: 1000 });
            expect(result).toEqual(mockBoleta);
        });
    });

    describe('getBoletasByCliente', () => {
        it('should fetch boletas for a specific client', async () => {
            const mockBoletas = [{ idBoleta: 1, total: 1000 }];
            (axiosInstance.get as any).mockResolvedValue({ data: mockBoletas });

            const result = await ventasService.getBoletasByCliente(1);

            expect(axiosInstance.get).toHaveBeenCalledWith(expect.stringContaining('/api/v1/ventas/boletas/cliente/1'));
            expect(result).toEqual(mockBoletas);
        });
    });

    describe('updateBoletaEstado', () => {
        it('should update boleta status', async () => {
            const mockBoleta = { idBoleta: 1, estado: 'PAGADO' };
            (axiosInstance.put as any).mockResolvedValue({ data: mockBoleta });

            const result = await ventasService.updateBoletaEstado(1, 'PAGADO');

            expect(axiosInstance.put).toHaveBeenCalledWith(expect.stringContaining('/api/v1/ventas/boletas/1/estado'), { estado: 'PAGADO' });
            expect(result).toEqual(mockBoleta);
        });
    });
});
