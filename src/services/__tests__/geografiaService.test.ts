import { describe, it, expect, vi, beforeEach } from 'vitest';
import { geografiaService } from '../geografiaService';
import axios from 'axios';

// Mock axios
vi.mock('axios', () => ({
    default: {
        get: vi.fn(),
    },
}));

describe('geografiaService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getAllRegiones', () => {
        it('should fetch all regiones', async () => {
            const mockRegiones = [{ idRegion: 1, nombreRegion: 'Metropolitana', codigoRegion: 'RM' }];
            (axios.get as any).mockResolvedValue({ data: mockRegiones });

            const result = await geografiaService.getAllRegiones();

            expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/api/v1/regiones'));
            expect(result).toEqual(mockRegiones);
        });
    });

    describe('getRegionById', () => {
        it('should fetch region by id', async () => {
            const mockRegion = { idRegion: 1, nombreRegion: 'Metropolitana', codigoRegion: 'RM' };
            (axios.get as any).mockResolvedValue({ data: mockRegion });

            const result = await geografiaService.getRegionById(1);

            expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/api/v1/regiones/1'));
            expect(result).toEqual(mockRegion);
        });
    });

    describe('getAllComunas', () => {
        it('should fetch all comunas', async () => {
            const mockComunas = [{ idComuna: 1, nombreComuna: 'Santiago' }];
            (axios.get as any).mockResolvedValue({ data: mockComunas });

            const result = await geografiaService.getAllComunas();

            expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/api/v1/comunas'));
            expect(result).toEqual(mockComunas);
        });
    });

    describe('getComunasByRegion', () => {
        it('should fetch comunas by region id', async () => {
            const mockComunas = [{ idComuna: 1, nombreComuna: 'Santiago' }];
            (axios.get as any).mockResolvedValue({ data: mockComunas });

            const result = await geografiaService.getComunasByRegion(1);

            expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/api/v1/comunas/region/1'));
            expect(result).toEqual(mockComunas);
        });
    });

    describe('getAllCiudades', () => {
        it('should fetch all ciudades', async () => {
            const mockCiudades = [{ idCiudad: 1, nombreCiudad: 'Santiago Centro' }];
            (axios.get as any).mockResolvedValue({ data: mockCiudades });

            const result = await geografiaService.getAllCiudades();

            expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/api/v1/ciudades'));
            expect(result).toEqual(mockCiudades);
        });
    });

    describe('getCiudadesByComuna', () => {
        it('should fetch ciudades by comuna id', async () => {
            const mockCiudades = [{ idCiudad: 1, nombreCiudad: 'Santiago Centro' }];
            (axios.get as any).mockResolvedValue({ data: mockCiudades });

            const result = await geografiaService.getCiudadesByComuna(1);

            expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/api/v1/ciudades/comuna/1'));
            expect(result).toEqual(mockCiudades);
        });
    });
});
