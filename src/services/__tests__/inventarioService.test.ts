import { describe, it, expect, vi, beforeEach } from 'vitest';
import { inventarioService } from '../inventarioService';
import axiosInstance from '../../config/axiosConfig';

// Mock axiosInstance
vi.mock('../../config/axiosConfig', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

describe('inventarioService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getAllInventario', () => {
        it('should fetch all inventario', async () => {
            const mockInventario = [{ idInventario: 1, stockActual: 10 }];
            (axiosInstance.get as any).mockResolvedValue({ data: mockInventario });

            const result = await inventarioService.getAllInventario();

            expect(axiosInstance.get).toHaveBeenCalledWith(expect.stringContaining('/api/v1/inventario'));
            expect(result).toEqual(mockInventario);
        });
    });

    describe('getInventarioById', () => {
        it('should fetch inventario by id', async () => {
            const mockInventario = { idInventario: 1, stockActual: 10 };
            (axiosInstance.get as any).mockResolvedValue({ data: mockInventario });

            const result = await inventarioService.getInventarioById(1);

            expect(axiosInstance.get).toHaveBeenCalledWith(expect.stringContaining('/api/v1/inventario/1'));
            expect(result).toEqual(mockInventario);
        });
    });

    describe('getInventarioByModelo', () => {
        it('should fetch inventario by modelo id', async () => {
            const mockInventario = [{ idInventario: 1, stockActual: 10 }];
            (axiosInstance.get as any).mockResolvedValue({ data: mockInventario });

            const result = await inventarioService.getInventarioByModelo(1);

            expect(axiosInstance.get).toHaveBeenCalledWith(expect.stringContaining('/api/v1/inventario/modelo/1'));
            expect(result).toEqual(mockInventario);
        });
    });

    describe('getAllModelos', () => {
        it('should fetch all modelos', async () => {
            const mockModelos = [{ idModelo: 1, nombreModelo: 'Test' }];
            (axiosInstance.get as any).mockResolvedValue({ data: mockModelos });

            const result = await inventarioService.getAllModelos();

            expect(axiosInstance.get).toHaveBeenCalledWith(expect.stringContaining('/api/v1/modelos'));
            expect(result).toEqual(mockModelos);
        });
    });

    describe('getModeloById', () => {
        it('should fetch modelo by id', async () => {
            const mockModelo = { idModelo: 1, nombreModelo: 'Test' };
            (axiosInstance.get as any).mockResolvedValue({ data: mockModelo });

            const result = await inventarioService.getModeloById(1);

            expect(axiosInstance.get).toHaveBeenCalledWith(expect.stringContaining('/api/v1/modelos/1'));
            expect(result).toEqual(mockModelo);
        });
    });

    describe('getAllMarcas', () => {
        it('should fetch all marcas', async () => {
            const mockMarcas = [{ idMarca: 1, nombreMarca: 'Nike' }];
            (axiosInstance.get as any).mockResolvedValue({ data: mockMarcas });

            const result = await inventarioService.getAllMarcas();

            expect(axiosInstance.get).toHaveBeenCalledWith(expect.stringContaining('/api/v1/marcas'));
            expect(result).toEqual(mockMarcas);
        });
    });

    describe('getAllTallas', () => {
        it('should fetch all tallas', async () => {
            const mockTallas = [{ idTalla: 1, numeroTalla: '40' }];
            (axiosInstance.get as any).mockResolvedValue({ data: mockTallas });

            const result = await inventarioService.getAllTallas();

            expect(axiosInstance.get).toHaveBeenCalledWith(expect.stringContaining('/api/v1/tallas'));
            expect(result).toEqual(mockTallas);
        });
    });

    describe('createModelo', () => {
        it('should create a modelo', async () => {
            const mockModelo = { idModelo: 1, nombreModelo: 'Test' };
            (axiosInstance.post as any).mockResolvedValue({ data: mockModelo });

            const result = await inventarioService.createModelo({ nombreModelo: 'Test' });

            expect(axiosInstance.post).toHaveBeenCalledWith(expect.stringContaining('/api/v1/modelos'), { nombreModelo: 'Test' });
            expect(result).toEqual(mockModelo);
        });
    });

    describe('updateModelo', () => {
        it('should update a modelo', async () => {
            const mockModelo = { idModelo: 1, nombreModelo: 'Updated' };
            (axiosInstance.put as any).mockResolvedValue({ data: mockModelo });

            const result = await inventarioService.updateModelo(1, { nombreModelo: 'Updated' });

            expect(axiosInstance.put).toHaveBeenCalledWith(expect.stringContaining('/api/v1/modelos/1'), { nombreModelo: 'Updated' });
            expect(result).toEqual(mockModelo);
        });
    });

    describe('deleteModelo', () => {
        it('should delete a modelo', async () => {
            (axiosInstance.delete as any).mockResolvedValue({});

            await inventarioService.deleteModelo(1);

            expect(axiosInstance.delete).toHaveBeenCalledWith(expect.stringContaining('/api/v1/modelos/1'));
        });
    });

    describe('createInventario', () => {
        it('should create inventario', async () => {
            const mockInventario = { idInventario: 1, stockActual: 10 };
            (axiosInstance.post as any).mockResolvedValue({ data: mockInventario });

            const result = await inventarioService.createInventario({ stockActual: 10 });

            expect(axiosInstance.post).toHaveBeenCalledWith(expect.stringContaining('/api/v1/inventario'), { stockActual: 10 });
            expect(result).toEqual(mockInventario);
        });
    });

    describe('updateInventario', () => {
        it('should update inventario', async () => {
            const mockInventario = { idInventario: 1, stockActual: 20 };
            (axiosInstance.put as any).mockResolvedValue({ data: mockInventario });

            const result = await inventarioService.updateInventario(1, { stockActual: 20 });

            expect(axiosInstance.put).toHaveBeenCalledWith(expect.stringContaining('/api/v1/inventario/1'), { stockActual: 20 });
            expect(result).toEqual(mockInventario);
        });
    });

    describe('deleteInventario', () => {
        it('should delete inventario', async () => {
            (axiosInstance.delete as any).mockResolvedValue({});

            await inventarioService.deleteInventario(1);

            expect(axiosInstance.delete).toHaveBeenCalledWith(expect.stringContaining('/api/v1/inventario/1'));
        });
    });
});
