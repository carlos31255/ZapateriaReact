import { describe, it, expect, vi, beforeEach } from 'vitest';
import { entregasService } from '../entregasService';
import axiosInstance from '../../config/axiosConfig';

// Mock axiosInstance
vi.mock('../../config/axiosConfig', () => ({
    default: {
        post: vi.fn(),
        get: vi.fn(),
    },
}));

describe('entregasService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createEntrega', () => {
        it('should create an entrega and return it', async () => {
            const mockEntrega = { idEntrega: 1, idBoleta: 1, estadoEntrega: 'PENDIENTE' };
            (axiosInstance.post as any).mockResolvedValue({ data: mockEntrega });

            const result = await entregasService.createEntrega({ idBoleta: 1 });

            expect(axiosInstance.post).toHaveBeenCalledWith(expect.stringContaining('/api/v1/entregas'), { idBoleta: 1 });
            expect(result).toEqual(mockEntrega);
        });
    });

    describe('getEntregaByBoleta', () => {
        it('should fetch entrega by boleta id', async () => {
            const mockEntrega = { idEntrega: 1, idBoleta: 1, estadoEntrega: 'PENDIENTE' };
            (axiosInstance.get as any).mockResolvedValue({ data: mockEntrega });

            const result = await entregasService.getEntregaByBoleta(1);

            expect(axiosInstance.get).toHaveBeenCalledWith(expect.stringContaining('/api/v1/entregas/boleta/1'));
            expect(result).toEqual(mockEntrega);
        });
    });
});
